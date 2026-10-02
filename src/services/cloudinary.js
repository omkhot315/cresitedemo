/**
 * Cloudinary image uploads.
 *
 * Two modes, chosen automatically:
 *
 *  1. SIGNED   — the API is reachable and Cloudinary is configured server-side.
 *                The browser asks `GET /api/uploads/signature` and posts the
 *                file with that signature. The API secret never leaves the
 *                server. This is the recommended production setup.
 *
 *  2. UNSIGNED — no backend, but VITE_CLOUDINARY_CLOUD_NAME +
 *                VITE_CLOUDINARY_UPLOAD_PRESET are set. Uses an unsigned
 *                upload preset straight from the browser.
 *
 * If neither is available, `isConfigured()` resolves false and the UI falls
 * back to pasting an image URL, so the builder always works.
 *
 * Setup: see .env.example (CLOUDINARY_* for the server, VITE_CLOUDINARY_* for
 * the browser) and create an unsigned upload preset in your Cloudinary console.
 */
import { http, detectMode, apiError } from "./httpClient.js";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
const FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || "cresite";

export const MAX_FILE_MB = 8;
export const ACCEPTED = "image/png,image/jpeg,image/jpg,image/webp,image/avif,image/gif";

let cachedConfig;

/** Resolve which upload mode (if any) is usable. Cached for the session. */
export async function getUploadConfig() {
  if (cachedConfig) return cachedConfig;

  // Prefer server-signed uploads when the API is live.
  if ((await detectMode()) === "remote") {
    try {
      const { data } = await http.get("/uploads/config");
      if (data?.configured) {
        cachedConfig = { mode: "signed", cloudName: data.cloudName, folder: data.folder || FOLDER };
        return cachedConfig;
      }
    } catch {
      /* fall through to unsigned */
    }
  }

  if (CLOUD_NAME && UPLOAD_PRESET) {
    cachedConfig = { mode: "unsigned", cloudName: CLOUD_NAME, preset: UPLOAD_PRESET, folder: FOLDER };
    return cachedConfig;
  }

  cachedConfig = { mode: "off" };
  return cachedConfig;
}

export async function isConfigured() {
  return (await getUploadConfig()).mode !== "off";
}

function validate(file) {
  if (!file) throw new Error("No file selected.");
  if (!file.type.startsWith("image/")) throw new Error("Only image files can be uploaded.");
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    throw new Error(`Image is too large — keep it under ${MAX_FILE_MB} MB.`);
  }
}

/** POST to Cloudinary with progress reporting via XHR. */
function post(url, form, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(body);
        else reject(new Error(body?.error?.message || `Upload failed (${xhr.status})`));
      } catch {
        reject(new Error("Unexpected response from Cloudinary."));
      }
    };
    xhr.onerror = () => reject(new Error("Network error while uploading."));
    xhr.send(form);
  });
}

/**
 * Upload one image and return a delivery URL.
 * @returns {Promise<{url:string, publicId:string, width:number, height:number}>}
 */
export async function uploadImage(file, onProgress) {
  validate(file);
  const cfg = await getUploadConfig();
  if (cfg.mode === "off") throw new Error("Image uploads aren't configured. Paste an image URL instead.");

  const form = new FormData();
  form.append("file", file);

  if (cfg.mode === "signed") {
    let sig;
    try {
      const { data } = await http.get("/uploads/signature");
      sig = data;
    } catch (e) {
      throw apiError(e);
    }
    form.append("api_key", sig.apiKey);
    form.append("timestamp", sig.timestamp);
    form.append("signature", sig.signature);
    if (sig.folder) form.append("folder", sig.folder);
  } else {
    form.append("upload_preset", cfg.preset);
    if (cfg.folder) form.append("folder", cfg.folder);
  }

  const res = await post(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`, form, onProgress);
  return {
    url: res.secure_url,
    publicId: res.public_id,
    width: res.width,
    height: res.height,
  };
}

/**
 * Cloudinary transformation helper — keeps stored URLs light on the page.
 * Falls through untouched for non-Cloudinary URLs (e.g. pasted links).
 */
export function optimized(url, { w = 1200, q = "auto" } = {}) {
  if (!url || !url.includes("/upload/") || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_${q},w_${w},c_limit/`);
}
