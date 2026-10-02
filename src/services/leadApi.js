/**
 * Contact-form enquiries (leads).
 *
 *   POST  /api/leads           public       — submit from any business website
 *   GET   /api/leads           super admin  — inbox
 *   GET   /api/leads/stats     super admin  — dashboard counts
 *   PATCH /api/leads/:id/read  super admin  — mark read/unread
 *   DELETE /api/leads/:id      super admin  — delete
 */
import { http, apiError, detectMode } from "./httpClient.js";

/** Offline queue: leads captured while the API is unreachable. */
const QUEUE_KEY = "cresite.leads.queue.v1";

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(items) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items.slice(-50)));
  } catch {
    /* storage unavailable */
  }
}

/**
 * Submit a contact-form enquiry. If the API can't be reached (offline/static
 * build) the lead is queued locally and flushed next time we're online, so an
 * enquiry is never silently lost.
 */
export async function submitLead({ businessSlug, name, phone, email, message }) {
  const payload = {
    businessSlug: businessSlug || "",
    name: String(name || "").trim(),
    phone: String(phone || "").trim(),
    email: String(email || "").trim(),
    message: String(message || "").trim(),
    capturedAt: new Date().toISOString(),
  };

  try {
    await http.post("/leads", payload);
    return { ok: true, queued: false };
  } catch (e) {
    /* Network failure → queue. Validation errors → surface to the user. */
    if (e?.response?.status && e.response.status < 500 && e.response.status !== 404) {
      return { ok: false, error: e?.response?.data?.message || "Please check your details." };
    }
    writeQueue([...readQueue(), payload]);
    return { ok: true, queued: true };
  }
}

/** Try to send any leads captured while offline. */
export async function flushLeadQueue() {
  if ((await detectMode()) !== "remote") return 0;
  const queue = readQueue();
  if (!queue.length) return 0;
  const remaining = [];
  let sent = 0;
  for (const lead of queue) {
    try {
      await http.post("/leads", lead);
      sent += 1;
    } catch {
      remaining.push(lead);
    }
  }
  writeQueue(remaining);
  return sent;
}

/** How many leads are waiting offline (shown as a hint in the inbox). */
export const queuedLeadCount = () => readQueue().length;

/* ----------------------------- super admin ----------------------------- */

export async function getLeads({ unread, business, limit } = {}) {
  try {
    const params = {};
    if (unread) params.unread = "true";
    if (business) params.business = business;
    if (limit) params.limit = limit;
    const { data } = await http.get("/leads", { params });
    return data;
  } catch (e) {
    throw apiError(e);
  }
}

export async function getLeadStats() {
  try {
    const { data } = await http.get("/leads/stats");
    return data;
  } catch (e) {
    throw apiError(e);
  }
}

export async function toggleLeadRead(id, read) {
  try {
    const { data } = await http.patch(`/leads/${id}/read`, { read });
    return data;
  } catch (e) {
    throw apiError(e);
  }
}

export async function deleteLead(id) {
  try {
    await http.delete(`/leads/${id}`);
    return true;
  } catch (e) {
    throw apiError(e);
  }
}
