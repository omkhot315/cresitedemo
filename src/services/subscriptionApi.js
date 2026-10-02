/**
 * Subscription data layer (1-year website terms).
 *
 *   GET  /api/payments/subscription/:slug   public — is this site visible?
 *   GET  /api/payments/subscriptions        mine — grouped active/expiring/expired
 *   POST /api/payments/subscriptions/sweep  super admin — re-evaluate all
 */
import { http, apiError } from "./httpClient.js";

/** Public subscription state for a single website. */
export async function getSubscription(slug) {
  try {
    const { data } = await http.get(`/payments/subscription/${encodeURIComponent(slug)}`);
    return data;
  } catch (e) {
    throw apiError(e);
  }
}

/** My websites grouped as active / expiring / expired. */
export async function getSubscriptionGroups() {
  try {
    const { data } = await http.get("/payments/subscriptions");
    return data;
  } catch (e) {
    throw apiError(e);
  }
}

/** Super admin: re-evaluate every subscription now. */
export async function sweepSubscriptions() {
  try {
    const { data } = await http.post("/payments/subscriptions/sweep");
    return data;
  } catch (e) {
    throw apiError(e);
  }
}

/* ------------------------------- presentation ------------------------------ */
export const DAY = 86400000;

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

/** Days until expiry, or null when there is no term. */
export const daysLeft = (expiry) =>
  expiry ? Math.ceil((new Date(expiry).getTime() - Date.now()) / DAY) : null;

export const SUB_STATUS = {
  none: { label: "Unpaid", tint: "bg-slate-100 text-slate-600", dot: "#94A3B8" },
  active: { label: "Active", tint: "bg-emerald-100 text-emerald-700", dot: "#10B981" },
  expiring: { label: "Expiring soon", tint: "bg-amber-100 text-amber-700", dot: "#F59E0B" },
  expired: { label: "Expired", tint: "bg-red-100 text-red-700", dot: "#EF4444" },
};
