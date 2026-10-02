import { Business } from "../models/Business.js";
import { canManage, isSuperAdmin } from "../middleware/authMiddleware.js";
import {
  reconcileSubscription, syncSubscription, isPubliclyVisible,
  effectiveStatus, daysRemaining,
} from "../services/subscription.js";
import { SEED_BUSINESSES } from "../../src/data/seedBusinesses.js";

/** Backwards compatible for super-admin sites created before the flag existed. */
const isPaymentExempt = (business) =>
  !!business.paymentExempt || business.createdByRole === "superadmin";

/** Mongo doc -> API payload (adds friendly `id`, drops internals). */
const normalize = (doc) => {
  const o = doc.toObject ? doc.toObject() : doc;
  const { __v, ...rest } = o;
  const exempt = isPaymentExempt(rest);
  return {
    ...rest,
    paymentExempt: exempt,
    /* Live subscription state so the UI can group sites without extra calls. */
    subscriptionStatus: exempt ? "active" : effectiveStatus(rest),
    daysRemaining: exempt ? null : daysRemaining(rest.subscriptionExpiry),
    id: rest.id || String(o._id),
    owner: rest.owner ? String(rest.owner) : null,
    createdBy: rest.createdBy ? String(rest.createdBy) : null,
  };
};

/**
 * Never let client payloads overwrite immutable/server-managed fields.
 * Ownership and the creator audit trail are stamped from the JWT only.
 */
const sanitize = (body) => {
  const {
    _id, id, __v, createdAt, updatedAt,
    owner, ownerName, ownerEmail,
    createdBy, createdByName, createdByEmail, createdByRole,
    paid, paidAt,
    paymentExempt, paymentExemptReason, paymentExemptBy, paymentExemptAt,
    ...payload
  } = body || {};
  return payload;
};

/**
 * GET /api/businesses
 * Public directory listing. Supports ?published=true, ?category=, and
 * ?mine=true — which returns only the caller's own websites. Websites are
 * private to their creator: admins do NOT see each other's sites, only the
 * super admin sees everything.
 */
export async function listBusinesses(req, res) {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;

  if (req.query.mine === "true") {
    if (!req.user) return res.status(401).json({ message: "Sign in to view your websites." });
    if (!isSuperAdmin(req.user)) filter.owner = req.user._id;
  } else if (!isSuperAdmin(req.user)) {
    /*
     * Public visitors get published sites only. A signed-in admin/owner also
     * receives their own drafts, but never another creator's drafts.
     */
    filter.$or = req.user
      ? [{ published: true }, { owner: req.user._id }]
      : [{ published: true }];
  }

  if (req.query.published === "true") {
    filter.published = true;
    delete filter.$or;
  }
  const docs = await Business.find(filter).sort({ createdAt: -1 });
  /* Signed-in managers get reconciled terms, repairing any old doubled dates. */
  if (req.user) {
    await Promise.all(docs.filter((d) => canManage(req.user, d)).map((d) => reconcileSubscription(d)));
  }
  /* A lapsed subscription must never appear in any public listing. */
  const visible = isSuperAdmin(req.user)
    ? docs
    : docs.filter((d) => isPubliclyVisible(d) || (req.user && d.owner && String(d.owner) === String(req.user._id)));
  res.json(visible.map(normalize));
}

/**
 * GET /api/businesses/:slug — published sites are public; drafts are private.
 * An expired subscription hides the site from everyone except its owner and
 * the super admin, who still get full access so they can renew.
 */
export async function getBusiness(req, res) {
  const doc = await Business.findOne({ slug: req.params.slug.toLowerCase() });
  if (!doc) return res.status(404).json({ message: `No business at /${req.params.slug}` });

  /* Lazily evaluate expiry so a lapsed term hides the site immediately. */
  await reconcileSubscription(doc);
  await syncSubscription(doc);
  const manager = canManage(req.user, doc);

  if (!doc.published && !manager) {
    return res.status(403).json({ message: "This website is not published yet." });
  }
  if (!manager && !isPubliclyVisible(doc)) {
    /* 419 = authentication/expiry related; the client shows the renew page. */
    return res.status(419).json({
      subscriptionExpired: true,
      slug: doc.slug,
      name: doc.name,
      message: "This website's subscription has expired.",
    });
  }
  return res.json(normalize(doc));
}

/** POST /api/businesses — authenticated; the creator becomes the owner. */
export async function createBusiness(req, res) {
  const payload = sanitize(req.body);
  if (payload.slug) payload.slug = payload.slug.toLowerCase();
  const exists = payload.slug ? await Business.findOne({ slug: payload.slug }) : null;
  if (exists) return res.status(409).json({ message: `/${payload.slug} is already taken — choose another slug.` });

  const freeForSuperAdmin = req.user.role === "superadmin";

  /* A hosting plan must be chosen before a website can be created. */
  if (!["basic", "domain", "custom"].includes(payload.plan)) {
    return res.status(400).json({ message: "Please select a plan for your website before saving." });
  }

  /*
   * Regular accounts always start as drafts and need Cashfree confirmation.
   * A website created by the super admin is permanently payment-exempt and
   * may go live immediately — though a plan is still recorded.
   */
  payload.published = freeForSuperAdmin;

  const doc = await Business.create({
    ...payload,
    owner: req.user._id,
    ownerName: req.user.name,
    ownerEmail: req.user.email,
    createdBy: req.user._id,
    createdByName: req.user.name,
    createdByEmail: req.user.email,
    createdByRole: req.user.role,
    paymentExempt: freeForSuperAdmin,
    paymentExemptReason: freeForSuperAdmin ? "superadmin_creation" : "",
    paymentExemptBy: freeForSuperAdmin ? req.user._id : null,
    paymentExemptAt: freeForSuperAdmin ? new Date() : null,
  });
  return res.status(201).json(normalize(doc));
}

/** PUT /api/businesses/:slug — owner or super admin only. Supports slug rename. */
export async function updateBusiness(req, res) {
  const current = await Business.findOne({ slug: req.params.slug.toLowerCase() });
  if (!current) return res.status(404).json({ message: `No business at /${req.params.slug}` });
  if (!canManage(req.user, current)) {
    return res.status(403).json({ message: "You can only edit websites created by your account." });
  }

  const payload = sanitize(req.body);
  if (payload.slug) payload.slug = payload.slug.toLowerCase();

  if (payload.slug && payload.slug !== current.slug) {
    const clash = await Business.findOne({ slug: payload.slug });
    if (clash) return res.status(409).json({ message: `/${payload.slug} is already taken.` });
  }

  /* Only paid sites or sites created payment-exempt by the super admin go live. */
  if (payload.published === true && !current.paid && !isPaymentExempt(current)) {
    return res.status(402).json({
      paymentRequired: true,
      message: "Payment required before publishing — choose a plan and complete payment to take your website live.",
    });
  }

  Object.assign(current, payload);
  const saved = await current.save();
  return res.json(normalize(saved));
}

/** PATCH /api/businesses/:slug/publish — owner or super admin only. */
export async function togglePublish(req, res) {
  const doc = await Business.findOne({ slug: req.params.slug.toLowerCase() });
  if (!doc) return res.status(404).json({ message: `No business at /${req.params.slug}` });
  if (!canManage(req.user, doc)) {
    return res.status(403).json({ message: "You can only publish websites created by your account." });
  }
  if (!doc.published && !doc.paid && !isPaymentExempt(doc)) {
    return res.status(402).json({
      paymentRequired: true,
      plan: doc.plan || null,
      message: "Payment required before publishing. Complete payment to take your website live.",
    });
  }
  doc.published = !doc.published;
  await doc.save();
  return res.json(normalize(doc));
}

/** DELETE /api/businesses/:slug — owner or super admin only. */
export async function deleteBusiness(req, res) {
  const doc = await Business.findOne({ slug: req.params.slug.toLowerCase() });
  if (!doc) return res.status(404).json({ message: `No business at /${req.params.slug}` });
  if (!canManage(req.user, doc)) {
    return res.status(403).json({ message: "You can only delete websites created by your account." });
  }
  await doc.deleteOne();
  return res.json({ success: true, slug: doc.slug });
}

/** POST /api/businesses/seed — super admin only. Idempotent demo-data loader. */
export async function seedDemo(req, res) {
  const stamp = {
    owner: req.user._id,
    ownerName: req.user.name,
    ownerEmail: req.user.email,
    createdBy: req.user._id,
    createdByName: req.user.name,
    createdByEmail: req.user.email,
    createdByRole: req.user.role,
  };
  const ops = SEED_BUSINESSES.map((b) => ({
    updateOne: { filter: { slug: b.slug }, update: { $set: { ...b, ...stamp } }, upsert: true },
  }));
  await Business.bulkWrite(ops);
  const docs = await Business.find({ slug: { $in: SEED_BUSINESSES.map((b) => b.slug) } });
  return res.json({ seeded: docs.length, slugs: docs.map((d) => d.slug) });
}
