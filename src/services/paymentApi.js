/**
 * Cashfree payment data layer.
 *
 * Order creation and status checks always go through our API so the Cashfree
 * secret key never reaches the browser. Only the drop-in checkout runs
 * client-side, using the short-lived payment_session_id.
 *
 *   GET  /api/payments/config
 *   POST /api/payments/create-order
 *   GET  /api/payments/status/:orderId
 *   GET  /api/payments/orders
 */
import { load } from "@cashfreepayments/cashfree-js";
import { http, apiError } from "./httpClient.js";

/** GET /api/payments/config — is checkout available, and in which mode? */
export async function getPaymentConfig() {
  try {
    const { data } = await http.get("/payments/config");
    return data;
  } catch (e) {
    throw apiError(e);
  }
}

/**
 * POST /api/payments/create-order — creates a Cashfree order for a plan.
 * @returns {{orderId, paymentSessionId, amount, environment, payment}}
 */
export async function createPaymentOrder({ plan, businessSlug }) {
  try {
    const { data } = await http.post("/payments/create-order", { plan, businessSlug });
    return data;
  } catch (e) {
    throw apiError(e);
  }
}

/** GET /api/payments/status/:orderId — server-verified payment state. */
export async function getPaymentStatus(orderId) {
  try {
    const { data } = await http.get(`/payments/status/${encodeURIComponent(orderId)}`);
    return data;
  } catch (e) {
    throw apiError(e);
  }
}

/**
 * GET /api/payments/orders — payment history.
 * @returns {{payments: Array, stats?: {totalCollected, paidCount, pendingCount,
 *   failedCount, thisMonthCollected, thisMonthCount}}} — stats is present only
 *   for the super admin.
 */
export async function listPayments() {
  try {
    const { data } = await http.get("/payments/orders");
    /* Accept both the new { payments, stats } shape and a plain array. */
    if (Array.isArray(data)) return { payments: data };
    return data;
  } catch (e) {
    throw apiError(e);
  }
}

/** Indian-rupee formatting shared by both dashboards. */
export const fmtINR = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const PAYMENT_STATUS_META = {
  PENDING: { label: "Pending", tint: "bg-amber-100 text-amber-700", dot: "#F59E0B" },
  PAID: { label: "Paid", tint: "bg-emerald-100 text-emerald-700", dot: "#10B981" },
  FAILED: { label: "Failed", tint: "bg-red-100 text-red-700", dot: "#EF4444" },
  CANCELLED: { label: "Cancelled", tint: "bg-slate-100 text-slate-600", dot: "#94A3B8" },
  EXPIRED: { label: "Expired", tint: "bg-slate-100 text-slate-600", dot: "#94A3B8" },
  REFUNDED: { label: "Refunded", tint: "bg-indigo-100 text-indigo-700", dot: "#6366F1" },
};

/* --------------------------- Cashfree drop-in SDK -------------------------- */
let sdkPromise;

/** Load (and cache) the Cashfree JS SDK for the given environment. */
export async function getCashfree(environment = "sandbox") {
  if (!sdkPromise) {
    sdkPromise = load({ mode: environment === "production" ? "production" : "sandbox" }).catch((e) => {
      sdkPromise = null; // allow a retry
      throw new Error("Could not load the Cashfree checkout. Check your connection and try again.");
    });
  }
  return sdkPromise;
}

/**
 * Open the Cashfree checkout and resolve when it closes or completes.
 * The caller should re-verify status server-side afterwards.
 */
export async function openCheckout({ paymentSessionId, environment = "sandbox" }) {
  const cashfree = await getCashfree(environment);
  return cashfree.checkout({
    paymentSessionId,
    redirectTarget: "_self",
  });
}

export const PAYMENT_LABELS = {
  PENDING: { label: "Pending", tint: "bg-amber-100 text-amber-700" },
  PAID: { label: "Paid", tint: "bg-emerald-100 text-emerald-700" },
  FAILED: { label: "Failed", tint: "bg-red-100 text-red-700" },
  CANCELLED: { label: "Cancelled", tint: "bg-slate-100 text-slate-600" },
  EXPIRED: { label: "Expired", tint: "bg-slate-100 text-slate-600" },
  REFUNDED: { label: "Refunded", tint: "bg-indigo-100 text-indigo-700" },
};
