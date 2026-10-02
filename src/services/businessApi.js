/**
 * Data layer with automatic backend detection.
 *
 *   REMOTE mode — the Express + MongoDB API (server/) is reachable:
 *                 all reads/writes go through axios → `${API_URL}/api`.
 *   LOCAL mode  — no API detected: identical interface backed by localStorage
 *                 seeded with the demo businesses. The whole app keeps working
 *                 in static previews and offline demos with zero changes.
 *
 * Mode is detected once (GET /api/health, db must be "connected") and cached.
 *
 * API surface (mirrors server/routes/businessRoutes.js):
 *   GET    /api/businesses                 -> businessApi.list()
 *   GET    /api/businesses/:slug           -> businessApi.get(slug)
 *   POST   /api/businesses                 -> businessApi.create(data)
 *   PUT    /api/businesses/:slug           -> businessApi.update(slug, data)
 *   DELETE /api/businesses/:slug           -> businessApi.remove(slug)
 *   POST   /api/businesses/seed            -> businessApi.resetDemo()
 */
import { http, detectMode, apiError } from "./httpClient.js";
import { SEED_BUSINESSES } from "../data/seedBusinesses.js";

const STORAGE_KEY = "cresite.businesses.v1";
/* One-time compatibility with builds published before the brand rename. */
const LEGACY_STORAGE_KEY = ["site", "forge.businesses.v1"].join("");

/* ============================ LOCAL implementation =========================== */
function write(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable */
  }
}

function seedLocal() {
  const map = {};
  SEED_BUSINESSES.forEach((b) => {
    map[b.slug] = structuredClone(b);
  });
  write(map);
  return map;
}

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        localStorage.setItem(STORAGE_KEY, raw);
        return parsed;
      }
    }
  } catch {
    /* corrupted storage — reseed */
  }
  return seedLocal();
}

const localImpl = {
  async list() {
    return readLocal();
  },
  async get(slug) {
    return readLocal()[slug] || null;
  },
  async create(business) {
    const map = readLocal();
    map[business.slug] = business;
    write(map);
    return business;
  },
  async update(originalSlug, business) {
    const map = readLocal();
    if (originalSlug !== business.slug) delete map[originalSlug];
    map[business.slug] = business;
    write(map);
    return business;
  },
  async remove(slug) {
    const map = readLocal();
    delete map[slug];
    write(map);
  },
  async resetDemo() {
    return seedLocal();
  },
};

/* =========================== REMOTE implementation =========================== */
const remoteImpl = {
  async list() {
    try {
      const { data } = await http.get("/businesses");
      return Object.fromEntries(data.map((b) => [b.slug, b]));
    } catch (e) {
      throw apiError(e);
    }
  },
  async get(slug) {
    try {
      const { data } = await http.get(`/businesses/${slug}`);
      return data;
    } catch (e) {
      if (e?.response?.status === 404) return null;
      throw apiError(e);
    }
  },
  async create(business) {
    try {
      const { data } = await http.post("/businesses", business);
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
  async update(originalSlug, business) {
    try {
      const { data } = await http.put(`/businesses/${originalSlug}`, business);
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
  async remove(slug) {
    try {
      await http.delete(`/businesses/${slug}`);
    } catch (e) {
      throw apiError(e);
    }
  },
  async resetDemo() {
    try {
      await http.post("/businesses/seed");
      return remoteImpl.list();
    } catch (e) {
      throw apiError(e);
    }
  },
};

/* ============================== public interface ============================= */
async function impl() {
  return (await detectMode()) === "remote" ? remoteImpl : localImpl;
}

export const businessApi = {
  /** GET /api/businesses -> { [slug]: business } */
  async list() {
    return (await impl()).list();
  },
  /** GET /api/businesses/:slug */
  async get(slug) {
    return (await impl()).get(slug);
  },
  /** POST /api/businesses */
  async create(business) {
    return (await impl()).create(business);
  },
  /** PUT /api/businesses/:slug — handles slug renames */
  async update(originalSlug, business) {
    return (await impl()).update(originalSlug, business);
  },
  /** DELETE /api/businesses/:slug */
  async remove(slug) {
    return (await impl()).remove(slug);
  },
  /** POST /api/businesses/seed (remote) or localStorage reseed (local) */
  async resetDemo() {
    return (await impl()).resetDemo();
  },
  /** Diagnostics for the UI/debugger */
  async getMode() {
    return detectMode();
  },
};
