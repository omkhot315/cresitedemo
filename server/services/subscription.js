import { Business } from "../models/Business.js";
import { Payment } from "../models/Payment.js";

/**
 * 1-year subscription lifecycle.
 *
 * A website is publicly visible only while its subscription is active. When the
 * term ends the site is hidden (not deleted) — every piece of customer data is
 * kept, so a renewal brings it straight back.
 *
 * Expiry is evaluated lazily on read (works without a cron worker) and a
 * sweep helper is exported for a scheduled job if one is added later.
 */

const DAY = 24 * 60 * 60 * 1000;
/** How many days before expiry we start warning the owner. */
export const REMINDER_DAYS = 30;

/** Is the stored expiry in the past? */
const isPast = (date) => !!date && new Date(date).getTime() <= Date.now();

/** Days remaining until expiry (negative once lapsed). */
export const daysRemaining = (expiry) =>
  expiry ? Math.ceil((new Date(expiry).getTime() - Date.now()) / DAY) : null;

/** A subscription term is exactly 365 × 24 hours. */
export const SUBSCRIPTION_DAYS = 365;

/**
 * Pure calculation used by reconciliation. Exposed to make the idempotency
 * rule explicit: N unique paid orders always equals N × 365 days — no matter
 * how many times status was checked.
 */
export function calculateSubscriptionTerm(payments = []) {
  const unique = [];
  const seen = new Set();
  for (const payment of payments) {
    if (!payment?.orderId || seen.has(payment.orderId)) continue;
    seen.add(payment.orderId);
    unique.push(payment);
  }

  let start = null;
  let expiry = null;
  const valid = [];
  for (const payment of unique) {
    const paidAt = new Date(payment.paidAt || payment.createdAt || Date.now());
    if (Number.isNaN(paidAt.getTime())) continue;
    if (!start) start = paidAt;
    const base = expiry && expiry.getTime() > paidAt.getTime() ? expiry : paidAt;
    expiry = new Date(base.getTime() + SUBSCRIPTION_DAYS * DAY);
    valid.push(payment);
  }

  return {
    payments: valid,
    orderIds: valid.map((p) => p.orderId),
    start,
    expiry,
  };
}

/**
 * Work out what a website's subscription status should be right now.
 * Exempt (super-admin created) sites never expire.
 */
export function effectiveStatus(business) {
  if (!business || business.paymentExempt) return "active";
  const { subscriptionStatus, subscriptionExpiry } = business;
  if (subscriptionStatus === "none") return "none";
  if (isPast(subscriptionExpiry)) return "expired";
  const left = daysRemaining(subscriptionExpiry);
  if (left !== null && left <= REMINDER_DAYS) return "expiring";
  return "active";
}

/** True when the website may be shown to the public. */
export const isPubliclyVisible = (business) => {
  if (!business) return false;
  if (!business.published) return false;
  const s = effectiveStatus(business);
  /* "none" means never paid → the paywall already handles it. */
  return s === "active" || s === "expiring" || s === "none";
};

/**
 * Persist a fresh evaluation for one document (no-op when unchanged).
 * @returns the saved document, or null if nothing needed saving
 */
export async function syncSubscription(doc) {
  if (!doc) return null;
  const next = effectiveStatus(doc);
  if (next === doc.subscriptionStatus) return null;
  doc.subscriptionStatus = next;
  /* An expired site must not stay publicly reachable. */
  if (next === "expired") doc.published = false;
  await doc.save();
  return doc;
}

/** Evaluate and persist statuses for every stored website. */
export async function sweepSubscriptions() {
  const docs = await Business.find({
    subscriptionStatus: { $in: ["active", "expiring", "expired"] },
    paymentExempt: { $ne: true },
  });
  let changed = 0;
  for (const doc of docs) {
    /* Also repairs duplicate extensions from legacy status polling. */
    await reconcileSubscription(doc);
    const saved = await syncSubscription(doc);
    if (saved) changed += 1;
  }
  return { checked: docs.length, changed };
}

/**
 * Rebuild a website's subscription deterministically from its PAID Cashfree
 * orders. This is both an idempotency guarantee and a repair mechanism for
 * records that were previously extended more than once by status polling.
 *
 * Each unique PAID order contributes exactly 365 days. An early renewal stacks
 * from the current expiry; a renewal after expiry starts from its payment date.
 */
export async function reconcileSubscription(siteOrSlug, { publishOnActivation = false } = {}) {
  const site =
    typeof siteOrSlug === "string"
      ? await Business.findOne({ slug: siteOrSlug })
      : siteOrSlug;
  if (!site) return site;
  if (site.paymentExempt) return site;

  const payments = await Payment.find({
    businessSlug: site.slug,
    status: "PAID",
  }).sort({ paidAt: 1, createdAt: 1 });

  const term = calculateSubscriptionTerm(payments);
  if (!term.start || !term.expiry || !term.payments.length) return site;

  const left = daysRemaining(term.expiry);
  const status = left < 0 ? "expired" : left <= REMINDER_DAYS ? "expiring" : "active";
  const latest = term.payments[term.payments.length - 1];

  site.subscriptionStart = term.start;
  site.subscriptionExpiry = term.expiry;
  site.subscriptionRenewals = term.orderIds.length;
  site.appliedSubscriptionOrderIds = term.orderIds;
  site.subscriptionStatus = status;
  site.paid = true;
  site.paidAt = latest.paidAt || latest.createdAt || new Date();
  site.plan = latest.plan || site.plan;

  if (status === "expired") site.published = false;
  else if (publishOnActivation) site.published = true;

  await site.save();

  /* Backfill idempotency markers on legacy Payment documents. */
  await Payment.updateMany(
    { orderId: { $in: term.orderIds }, subscriptionApplied: { $ne: true } },
    { $set: { subscriptionApplied: true, subscriptionAppliedAt: new Date() } }
  );

  return site;
}

/** Renewal reminder copy for a given number of days left. */
export function reminderFor(business) {
  const left = daysRemaining(business.subscriptionExpiry);
  if (left === null || left < 0) {
    return {
      level: "expired",
      title: "Subscription expired",
      message: "Your website is currently hidden from visitors. Renew to bring it back online.",
    };
  }
  if (left === 0) {
    return { level: "expired", title: "Subscription expires today", message: "Renew today to keep your website online." };
  }
  if (left <= 7) {
    return { level: "urgent", title: `${left} day${left === 1 ? "" : "s"} left`, message: "Your subscription ends very soon. Renew now to avoid downtime." };
  }
  return { level: "soon", title: `${left} days left`, message: "Your subscription is coming to an end. Renew to keep your website online." };
}
