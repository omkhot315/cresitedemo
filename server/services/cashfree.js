import axios from "axios";

/**
 * Minimal Cashfree Payment Gateway client.
 *
 * Docs: https://www.cashfree.com/docs/api-reference/payments/latest/orders/create
 *
 * env vars:
 *   CASHFREE_APP_ID          – Client ID from the Cashfree dashboard
 *   CASHFREE_SECRET_KEY      – Client Secret (server-side only, never exposed)
 *   CASHFREE_ENVIRONMENT     – "sandbox" (default) | "production"
 *   APP_URL                  – public HTTPS frontend URL, used for return_url
 *   CASHFREE_RETURN_URL_BASE – optional HTTPS override (useful for a dev tunnel)
 */
export const API_VERSION = "2025-01-01";

export const cashfreeConfig = () => ({
  appId: process.env.CASHFREE_APP_ID || "",
  secretKey: process.env.CASHFREE_SECRET_KEY || "",
  environment: process.env.CASHFREE_ENVIRONMENT === "production" ? "production" : "sandbox",
  appUrl: (process.env.CASHFREE_RETURN_URL_BASE || process.env.APP_URL || "").replace(/\/+$/, ""),
});

export const isCashfreeConfigured = (c = cashfreeConfig()) => !!(c.appId && c.secretKey);

/** Cashfree requires every return_url to be a public absolute HTTPS URL. */
export function isValidCashfreeReturnBase(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const privateHost =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host.endsWith(".localhost");
    return url.protocol === "https:" && !!host && !privateHost;
  } catch {
    return false;
  }
}

/**
 * Resolve the public HTTPS origin.
 *
 * Priority:
 *   1. CASHFREE_RETURN_URL_BASE / APP_URL from the environment
 *   2. Proxy headers from the current HTTPS request (Render/Railway/Nginx)
 *
 * localhost HTTP is deliberately rejected: use an HTTPS tunnel such as ngrok
 * or Cloudflare Tunnel while testing Cashfree locally.
 */
export function resolveCashfreeReturnBase(req, c = cashfreeConfig()) {
  if (isValidCashfreeReturnBase(c.appUrl)) {
    const url = new URL(c.appUrl);
    return url.origin + url.pathname.replace(/\/+$/, "");
  }

  const forwardedProto = String(req?.headers?.["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim();
  const forwardedHost = String(req?.headers?.["x-forwarded-host"] || "")
    .split(",")[0]
    .trim();
  const protocol = forwardedProto || req?.protocol || "";
  const host = forwardedHost || req?.get?.("host") || "";

  if (protocol === "https" && host) {
    const derived = `https://${host}`.replace(/\/+$/, "");
    return isValidCashfreeReturnBase(derived) ? derived : null;
  }
  return null;
}

/** Build and validate the exact return URL sent to Cashfree. */
export function buildCashfreeReturnUrl(req, orderId, c = cashfreeConfig()) {
  const base = resolveCashfreeReturnBase(req, c);
  if (!base) return null;
  const returnUrl = `${base}/payment/status?order_id=${encodeURIComponent(orderId)}`;
  return isValidCashfreeReturnBase(returnUrl) ? returnUrl : null;
}

const baseUrl = (c) =>
  process.env.CASHFREE_BASE_URL
    ? process.env.CASHFREE_BASE_URL.replace(/\/+$/, "")
    : c.environment === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const http = (c) =>
  axios.create({
    baseURL: baseUrl(c),
    timeout: 15000,
    headers: {
      "x-client-id": c.appId,
      "x-client-secret": c.secretKey,
      "x-api-version": API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

const wrap = (e) => {
  const msg = e?.response?.data?.message || e?.message || "Cashfree request failed";
  const err = new Error(Array.isArray(msg) ? msg.join("; ") : msg);
  err.status = e?.response?.status;
  return err;
};

/**
 * Create a Cashfree order and return a payment_session_id for the drop-in SDK.
 * `orderId` must be 3–45 chars, alphanumeric plus "_" and "-".
 */
export async function createCashfreeOrder({ orderId, amount, customer, returnUrl, note }) {
  const c = cashfreeConfig();
  if (!isCashfreeConfigured(c)) throw new Error("Cashfree is not configured on the server.");
  if (!isValidCashfreeReturnBase(returnUrl)) {
    const err = new Error(
      "Cashfree requires an HTTPS return URL. Set APP_URL=https://your-domain.com (or use CASHFREE_RETURN_URL_BASE with an HTTPS tunnel during local testing)."
    );
    err.status = 503;
    throw err;
  }
  try {
    const { data } = await http(c).post("/orders", {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: customer.id,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
      },
      order_meta: { return_url: returnUrl },
      order_note: note,
    });
    return data;
  } catch (e) {
    throw wrap(e);
  }
}

/** Fetch a single order's live status from Cashfree. */
export async function fetchCashfreeOrder(orderId) {
  const c = cashfreeConfig();
  if (!isCashfreeConfigured(c)) throw new Error("Cashfree is not configured on the server.");
  try {
    const { data } = await http(c).get(`/orders/${encodeURIComponent(orderId)}`);
    return data;
  } catch (e) {
    throw wrap(e);
  }
}
