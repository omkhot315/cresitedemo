/**
 * Shared helpers for the website-builder platform.
 */

export const PLATFORM_NAME = "Cresite";
export const PLATFORM_TAGLINE = "Websites for every local business";
export const PLATFORM_URL = "cresite.in";

/** Slugs that can never be used by a business (they collide with app routes). */
export const RESERVED_SLUGS = [
  "create",
  "dashboard",
  "business",
  "api",
  "admin",
  "login",
  "signup",
  "app",
  "www",
  "auth",
  "forgot-password",
  "home",
  "pricing",
  "about",
  "contact",
  "help",
  "support",
];

/** "Smile Dental Care!" -> "smile-dental-care" */
export function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && !RESERVED_SLUGS.includes(slug);
}

export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ---------- Colour helpers ---------- */
function hexToRgb(hex) {
  const h = (hex || "").replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 0, g: 0, b: 0 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

/** Returns "#ffffff" or a dark ink depending on which reads better on `hex`. */
export function readableOn(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#131316" : "#ffffff";
}

export function withAlpha(hex, alpha = 0.5) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ---------- Contact action links ---------- */
export const onlyDigits = (v = "") => v.replace(/[^\d]/g, "");
export const telLink = (phone = "") => `tel:+${onlyDigits(phone)}`;
export const waLink = (number = "", message = "Hi! I'd like to know more.") =>
  `https://wa.me/${onlyDigits(number)}?text=${encodeURIComponent(message)}`;
export const mapsEmbed = (address = "") =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

export function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/* ---------- SEO helpers ---------- */
function upsertMeta(attr, key, content) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content || "");
}

/**
 * Sets document title, description, Open Graph + theme-color.
 * Used by every business route so each site is SEO-ready.
 */
export function setPageMeta({ title, description, image, themeColor }) {
  if (typeof document === "undefined") return;
  if (title) document.title = title;
  if (description) {
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:description", description);
  }
  if (title) {
    upsertMeta("property", "og:title", title);
    upsertMeta("name", "twitter:title", title);
  }
  if (image) upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:type", "website");
  if (themeColor) upsertMeta("name", "theme-color", themeColor);
}

/** Renders a letter-based favicon so every generated site has its own identity. */
export function setLetterFavicon(text = "C", bg = "#5046E5") {
  try {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const r = 16;
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, r);
    ctx.fill();
    ctx.fillStyle = readableOn(bg);
    ctx.font = "700 34px 'Space Grotesk', 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.slice(0, 1).toUpperCase(), size / 2, size / 2 + 2);
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = canvas.toDataURL("image/png");
  } catch {
    /* canvas unsupported — ignore */
  }
}

export const DEFAULT_META = {
  title: `${PLATFORM_NAME} — Build Your Business Website in Minutes`,
  description:
    "Create a professional online presence for your clinic, gym, salon, cafe, restaurant, hotel and more — all under one powerful platform.",
  themeColor: "#5046E5",
};
