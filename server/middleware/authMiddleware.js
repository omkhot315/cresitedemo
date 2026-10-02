import { User } from "../models/User.js";
import { verifyToken } from "../utils/generateToken.js";

/** Pull "Bearer <token>" out of the Authorization header. */
function bearer(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : null;
}

/**
 * Require a valid JWT. Attaches the live user document to req.user so a role
 * change or deactivation takes effect immediately (token payload is not trusted).
 */
export async function protect(req, res, next) {
  const token = bearer(req);
  if (!token) return res.status(401).json({ message: "Not authorized — please sign in." });
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Account no longer exists." });
    if (!user.active) return res.status(403).json({ message: "This account has been deactivated." });
    /* Reject tokens issued before the last password change, so a reset signs
       out every device that was logged in with the old password. */
    if (user.passwordChangedAt) {
      const changedAt = new Date(user.passwordChangedAt).getTime();
      const issuedAt = (decoded.iat || 0) * 1000;
      if (changedAt > issuedAt + 1000) {
        return res.status(401).json({ message: "Your password was changed. Please sign in again." });
      }
    }
    req.user = user;
    return next();
  } catch (err) {
    const expired = err?.name === "TokenExpiredError";
    return res.status(401).json({ message: expired ? "Session expired — please sign in again." : "Invalid session token." });
  }
}

/** Attach req.user when a token is present, but never block the request. */
export async function optionalAuth(req, res, next) {
  const token = bearer(req);
  if (!token) return next();
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (user?.active) req.user = user;
  } catch {
    /* ignore bad tokens on public routes */
  }
  return next();
}

export const isSuperAdmin = (user) => user?.role === "superadmin";

/** Super-admin gate — provisioning & platform-wide powers (use after `protect`). */
export function superAdminOnly(req, res, next) {
  if (!isSuperAdmin(req.user)) {
    return res.status(403).json({ message: "Only the platform super admin can perform this action." });
  }
  return next();
}

/**
 * Website-level authorization.
 *
 * Websites are private to the account that created them. Admins are NOT
 * peers: admin1 cannot see or touch admin2's websites. Only the single
 * super admin has platform-wide access.
 */
export function canManage(user, business) {
  if (!user || !business) return false;
  if (isSuperAdmin(user)) return true;
  return !!business.owner && String(business.owner) === String(user._id);
}
