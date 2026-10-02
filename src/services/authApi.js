/**
 * Authentication data layer — mirrors services/businessApi.js.
 *
 *   REMOTE mode — real JWT auth against Express + MongoDB (bcrypt hashed).
 *   LOCAL mode  — a self-contained demo provider backed by localStorage
 *                 so the static build stays usable.
 *
 * Public sign-up creates "owner" accounts only. Admin accounts are provisioned
 * by the super admin, who is created once by `npm run seed`.
 *
 * Endpoints:
 *   POST   /api/auth/register
 *   POST   /api/auth/login
 *   GET    /api/auth/me
 *   GET    /api/auth/users                 (admin + superadmin)
 *   POST   /api/auth/users                 (superadmin)
 *   PATCH  /api/auth/users/:id/role        (superadmin)
 *   DELETE /api/auth/users/:id             (superadmin)
 */
import { http, detectMode, apiError } from "./httpClient.js";

const USERS_KEY = "cresite.users.v1";
const TOKEN_KEY = "cresite.token.v1";
/* One-time compatibility with builds published before the brand rename. */
const LEGACY_USERS_KEY = ["site", "forge.users.v1"].join("");
const LEGACY_TOKEN_KEY = ["site", "forge.token.v1"].join("");

/* Accounts that exist in LOCAL mode (mirrored by `npm run seed`). */
export const DEMO_ACCOUNTS = [
  { name: "Super Admin", email: "superadmin@cresite.in", password: "super123", role: "superadmin" },
  { name: "Platform Admin", email: "admin@cresite.in", password: "admin123", role: "admin" },
  { name: "Demo Owner", email: "owner@cresite.in", password: "owner123", role: "owner" },
];

/** Friendly labels + colours for each role. */
export const ROLE_META = {
  superadmin: { label: "Super Admin", short: "super", tint: "bg-violet-100 text-violet-700" },
  admin: { label: "Admin", short: "admin", tint: "bg-indigo-100 text-indigo-700" },
  owner: { label: "Owner", short: "owner", tint: "bg-emerald-100 text-emerald-700" },
};

/* ------------------------------ token storage ----------------------------- */
export const tokenStore = {
  get() {
    try {
      const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
      if (token) localStorage.setItem(TOKEN_KEY, token);
      return token;
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(LEGACY_TOKEN_KEY);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(LEGACY_TOKEN_KEY);
      }
    } catch {
      /* storage unavailable */
    }
  },
};

/* =========================== LOCAL implementation ==========================
 * NOTE: browser-only demo mode. Passwords are obfuscated, not cryptographically
 * hashed — real security is enforced by the Express API (bcrypt + JWT).
 */
const obfuscate = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return `lh$${h.toString(36)}$${btoa(unescape(encodeURIComponent(s))).slice(0, 24)}`;
};

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY) || localStorage.getItem(LEGACY_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        localStorage.setItem(USERS_KEY, raw);
        return parsed;
      }
    }
  } catch {
    /* fall through to seeding */
  }
  const seeded = DEMO_ACCOUNTS.map((a, i) => ({
    id: `local-user-${i + 1}`,
    name: a.name,
    email: a.email,
    role: a.role,
    active: true,
    password: obfuscate(a.password),
    createdAt: new Date(Date.now() - (3 - i) * 86400000).toISOString(),
    lastLoginAt: null,
  }));
  writeUsers(seeded);
  return seeded;
}

function writeUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* storage unavailable */
  }
}

const publicUser = ({ password, ...u }) => u;
const localToken = (user) => `local.${btoa(JSON.stringify({ id: user.id, role: user.role, t: Date.now() }))}`;

const localImpl = {
  /* OTP emails need the API server to hold the Brevo key. */
  async forgotPassword() {
    throw new Error("Password reset needs the API server to be running.");
  },
  async verifyResetOtp() {
    throw new Error("Password reset needs the API server to be running.");
  },
  async resetPassword() {
    throw new Error("Password reset needs the API server to be running.");
  },
  async register({ name, email, password }) {
    const users = readUsers();
    const mail = String(email).toLowerCase().trim();
    if (users.some((u) => u.email === mail)) {
      throw new Error("An account with that email already exists — try signing in.");
    }
    const user = {
      id: `local-user-${Date.now()}`,
      name: String(name).trim(),
      email: mail,
      role: "owner", // never self-assignable
      active: true,
      password: obfuscate(password),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    writeUsers([...users, user]);
    return { user: publicUser(user), token: localToken(user) };
  },

  async login({ email, password }) {
    const users = readUsers();
    const mail = String(email).toLowerCase().trim();
    const user = users.find((u) => u.email === mail);
    if (!user || user.password !== obfuscate(password)) throw new Error("Incorrect email or password.");
    if (!user.active) throw new Error("This account has been deactivated.");
    user.lastLoginAt = new Date().toISOString();
    writeUsers(users);
    return { user: publicUser(user), token: localToken(user) };
  },

  async me(token) {
    if (!token?.startsWith("local.")) throw new Error("Invalid session.");
    let payload;
    try {
      payload = JSON.parse(atob(token.slice(6)));
    } catch {
      throw new Error("Invalid session.");
    }
    const user = readUsers().find((u) => u.id === payload.id);
    if (!user || !user.active) throw new Error("Session no longer valid.");
    return publicUser(user);
  },

  async listUsers() {
    return readUsers().map(publicUser);
  },

  async createUser({ name, email, password, role = "owner" }) {
    const users = readUsers();
    const mail = String(email).toLowerCase().trim();
    if (users.some((u) => u.email === mail)) throw new Error("An account with that email already exists.");
    if (!["owner", "admin"].includes(role)) {
      throw new Error('Accounts can be created as "owner" or "admin" only.');
    }
    const user = {
      id: `local-user-${Date.now()}`,
      name: String(name).trim(),
      email: mail,
      role,
      active: true,
      password: obfuscate(password),
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    };
    writeUsers([...users, user]);
    return publicUser(user);
  },

  async updateRole(id, role) {
    const users = readUsers();
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error("User not found.");
    if (user.role === "superadmin") throw new Error("The super admin role cannot be changed.");
    user.role = role;
    writeUsers(users);
    return publicUser(user);
  },

  async deleteUser(id) {
    const users = readUsers();
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error("User not found.");
    if (user.role === "superadmin") throw new Error("The super admin account cannot be deleted.");
    writeUsers(users.filter((u) => u.id !== id));
    return { success: true, id };
  },
};

/* =========================== REMOTE implementation ========================= */
const remoteImpl = {
  /** POST /api/auth/forgot-password — emails a 6-digit OTP. */
  async forgotPassword(payload) {
    try {
      const { data } = await http.post("/auth/forgot-password", payload);
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
  /** POST /api/auth/verify-reset-otp — checks the code, returns a resetToken. */
  async verifyResetOtp(payload) {
    try {
      const { data } = await http.post("/auth/verify-reset-otp", payload);
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
  /** POST /api/auth/reset-password — sets the new password and signs in. */
  async resetPassword(payload) {
    try {
      const { data } = await http.post("/auth/reset-password", payload);
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
  async register(payload) {
    try {
      const { data } = await http.post("/auth/register", payload);
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
  async login(payload) {
    try {
      const { data } = await http.post("/auth/login", payload);
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
  async me() {
    try {
      const { data } = await http.get("/auth/me");
      return data.user;
    } catch (e) {
      throw apiError(e);
    }
  },
  async listUsers() {
    try {
      const { data } = await http.get("/auth/users");
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
  async createUser(payload) {
    try {
      const { data } = await http.post("/auth/users", payload);
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
  async updateRole(id, role) {
    try {
      const { data } = await http.patch(`/auth/users/${id}/role`, { role });
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
  async deleteUser(id) {
    try {
      const { data } = await http.delete(`/auth/users/${id}`);
      return data;
    } catch (e) {
      throw apiError(e);
    }
  },
};

async function impl() {
  return (await detectMode()) === "remote" ? remoteImpl : localImpl;
}

export const authApi = {
  /** Public sign-up — always creates an "owner". */
  async register(payload) {
    return (await impl()).register(payload);
  },
  async login(payload) {
    return (await impl()).login(payload);
  },
  async forgotPassword(payload) {
    return (await impl()).forgotPassword(payload);
  },
  async verifyResetOtp(payload) {
    return (await impl()).verifyResetOtp(payload);
  },
  async resetPassword(payload) {
    return (await impl()).resetPassword(payload);
  },
  async me(token) {
    return (await impl()).me(token);
  },
  async listUsers() {
    return (await impl()).listUsers();
  },
  async createUser(payload) {
    return (await impl()).createUser(payload);
  },
  async updateRole(id, role) {
    return (await impl()).updateRole(id, role);
  },
  async deleteUser(id) {
    return (await impl()).deleteUser(id);
  },
  async getMode() {
    return detectMode();
  },
};
