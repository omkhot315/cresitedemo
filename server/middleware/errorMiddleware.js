import mongoose from "mongoose";

/** Wrap async handlers so rejections reach the error middleware (Express 4 & 5 safe). */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Blocks API routes with a clear 503 when MongoDB isn't connected. */
export const dbGuard = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      offline: true,
      message: "Database not connected. Start MongoDB (or fix MONGO_URI) — the frontend will use local data until then.",
    });
  }
  return next();
};

/** 404 for unknown /api routes */
export function apiNotFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

/* eslint-disable-next-line no-unused-vars */
export function errorHandler(err, req, res, next) {
  // Mongo duplicate key (e.g. slug unique index)
  if (err?.code === 11000) {
    return res.status(409).json({
      message: `Duplicate value for ${Object.keys(err.keyValue || {}).join(", ") || "a unique field"} — already in use.`,
    });
  }
  // Mongoose validation
  if (err?.name === "ValidationError") {
    const message = Object.values(err.errors || {}).map((e) => e.message).join("; ");
    return res.status(400).json({ message: message || "Validation failed" });
  }
  if (err?.name === "CastError") {
    return res.status(400).json({ message: `Invalid value for "${err.path}"` });
  }
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const isProd = process.env.NODE_ENV === "production";

  if (status >= 500) {
    console.error(`[server error] ${req.method} ${req.originalUrl}:`, err);
  }

  const clientMessage =
    status >= 500 && isProd
      ? "An unexpected internal server error occurred. Please try again later."
      : err.message || "Unexpected server error";

  return res.status(status).json({ message: clientMessage });
}
