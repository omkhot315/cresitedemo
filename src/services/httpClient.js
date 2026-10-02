/**
 * Shared axios client + backend mode detection.
 *
 * Both data layers (businessApi, authApi) use this so there is exactly one
 * place that knows the API origin, attaches the JWT, and decides whether the
 * app runs in REMOTE (Express + MongoDB) or LOCAL (localStorage) mode.
 */
import axios from "axios";

/* Dev defaults to the local Express server; production is same-origin because
   Express serves the built SPA. Override with VITE_API_URL. */
const rawUrl = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:5000" : "");
export const API_URL = (rawUrl || "").replace(/\/+$/, "");

export const http = axios.create({ baseURL: `${API_URL}/api`, timeout: 8000 });

/* Attach the bearer token to every request when signed in. */
http.interceptors.request.use((config) => {
  try {
    const token =
      localStorage.getItem("cresite.token.v1") ||
      localStorage.getItem(["site", "forge.token.v1"].join(""));
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    /* storage unavailable */
  }
  return config;
});

/** Axios error -> friendly Error carrying the server's message. */
export function apiError(e) {
  const err = new Error(e?.response?.data?.message || e?.message || "Request failed");
  err.status = e?.response?.status;
  return err;
}

let mode = null; // null = not probed | "remote" | "local"

/** Probe the API once; cached for the session. */
export async function detectMode() {
  if (mode) return mode;
  try {
    const { data } = await http.get("/health", { timeout: 2500 });
    mode = data?.status === "ok" && data?.db === "connected" ? "remote" : "local";
  } catch {
    mode = "local";
  }
  if (import.meta.env.DEV) {
    console.info(`[Cresite] data layer: ${mode.toUpperCase()} mode (${mode === "remote" ? http.defaults.baseURL : "localStorage"})`);
  }
  return mode;
}
