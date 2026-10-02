import { Router } from "express";
import crypto from "node:crypto";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

/**
 * Cloudinary signed uploads.
 *
 * The browser never sees CLOUDINARY_API_SECRET. It asks this endpoint for a
 * short-lived signature, then posts the file straight to Cloudinary — so large
 * images never pass through (or get buffered by) our API.
 *
 * Required env:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * Optional:
 *   CLOUDINARY_FOLDER (defaults to "cresite")
 */
const router = Router();

const cfg = () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  folder: process.env.CLOUDINARY_FOLDER || "cresite",
});

const isConfigured = (c) => !!(c.cloudName && c.apiKey && c.apiSecret);

/** GET /api/uploads/config — public: tells the client which mode to use. */
router.get("/config", (req, res) => {
  const c = cfg();
  res.json({
    configured: isConfigured(c),
    cloudName: c.cloudName || null,
    folder: c.folder,
  });
});

/**
 * GET /api/uploads/signature — authenticated.
 * Returns a signature valid for an immediate upload to our folder.
 */
router.get(
  "/signature",
  protect,
  asyncHandler(async (req, res) => {
    const c = cfg();
    if (!isConfigured(c)) {
      return res.status(503).json({ message: "Cloudinary is not configured on the server." });
    }

    const timestamp = Math.round(Date.now() / 1000);
    // Params must be sorted alphabetically and signed with the API secret.
    const toSign = `folder=${c.folder}&timestamp=${timestamp}${c.apiSecret}`;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    return res.json({
      signature,
      timestamp,
      apiKey: c.apiKey,
      cloudName: c.cloudName,
      folder: c.folder,
    });
  })
);

export default router;
