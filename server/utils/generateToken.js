import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "cresite-dev-secret-change-me";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/** Sign a JWT carrying the user id + role (role is re-verified from DB on each request). */
export function generateToken(user) {
  return jwt.sign({ id: String(user._id), role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
