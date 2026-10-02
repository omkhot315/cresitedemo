import { Router } from "express";
import { asyncHandler, dbGuard } from "../middleware/errorMiddleware.js";
import { protect, superAdminOnly } from "../middleware/authMiddleware.js";
import { leadLimiter } from "../middleware/rateLimiters.js";
import { Lead } from "../models/Lead.js";
import { Business } from "../models/Business.js";

/**
 * Contact-form enquiries.
 *
 *   POST  /api/leads              public  — a visitor submits a website's form
 *   GET   /api/leads              super admin — the inbox (filterable)
 *   PATCH /api/leads/:id/read     super admin — mark read/unread
 *   DELETE /api/leads/:id         super admin — remove a lead
 *   GET   /api/leads/stats        super admin — counts for the dashboard cards
 */
const router = Router();

router.use(dbGuard);

const normalize = (doc) => {
  const o = doc.toObject ? doc.toObject() : doc;
  const { __v, ...rest } = o;
  return { ...rest, id: String(rest._id) };
};

/** POST /api/leads — public submission from any business website. */
router.post(
  "/",
  leadLimiter,
  asyncHandler(async (req, res) => {
    const { businessSlug, name, phone, email, message } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Please tell us your name." });
    }
    /* A phone number or an email is needed so the business can reply. */
    if (!String(phone || "").trim() && !String(email || "").trim()) {
      return res.status(400).json({ message: "Please add a phone number or an email so we can reply." });
    }

    const slug = String(businessSlug || "").toLowerCase().trim();
    const site = slug ? await Business.findOne({ slug }) : null;
    const isPlatform = slug === "cresite-platform";

    const lead = await Lead.create({
      businessSlug: site ? site.slug : slug,
      businessName: site ? site.name : isPlatform ? "Cresite Platform" : "",
      category: site ? site.category : isPlatform ? "platform" : "",
      name: String(name).trim().slice(0, 120),
      phone: String(phone || "").trim().slice(0, 30),
      email: String(email || "").trim().slice(0, 160),
      message: String(message || "").trim().slice(0, 2000),
      source: "contact-form",
    });

    return res.status(201).json({
      ok: true,
      id: String(lead._id),
      message: "Thanks! Your enquiry has been sent.",
    });
  })
);

/* ------------------- everything below is super-admin only ------------------- */
router.use(protect, superAdminOnly);

/** GET /api/leads?unread=1&business=slug — the inbox. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.unread === "true" || req.query.unread === "1") filter.read = false;
    if (req.query.business) filter.businessSlug = String(req.query.business).toLowerCase();
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const docs = await Lead.find(filter).sort({ createdAt: -1 }).limit(limit);
    return res.json(docs.map(normalize));
  })
);

/** GET /api/leads/stats — counts for the dashboard cards. */
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const [total, unread, today, businesses] = await Promise.all([
      Lead.countDocuments({}),
      Lead.countDocuments({ read: false }),
      Lead.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      Lead.distinct("businessSlug"),
    ]);
    return res.json({ total, unread, today, websites: businesses.length });
  })
);

/** PATCH /api/leads/:id/read — toggle read state. */
router.patch(
  "/:id/read",
  asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found." });
    /* Body may pass an explicit value; otherwise toggle. */
    lead.read = typeof req.body?.read === "boolean" ? req.body.read : !lead.read;
    await lead.save();
    return res.json(normalize(lead));
  })
);

/** DELETE /api/leads/:id */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await Lead.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Lead not found." });
    return res.json({ success: true, id: req.params.id });
  })
);

export default router;
