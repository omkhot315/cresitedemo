import { Router } from "express";
import { asyncHandler, dbGuard } from "../middleware/errorMiddleware.js";
import { protect, optionalAuth, superAdminOnly } from "../middleware/authMiddleware.js";
import {
  listBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  togglePublish,
  deleteBusiness,
  seedDemo,
} from "../controllers/businessController.js";

const router = Router();

// All business routes need MongoDB; answer 503 (not a hang) when offline.
router.use(dbGuard);

/* ------------------------------ public reads ----------------------------- */
// Business websites must be viewable by anyone — optionalAuth enables ?mine=true.
router.get("/", optionalAuth, asyncHandler(listBusinesses));

/* --------------------------- authenticated writes ------------------------ */
router.post("/", protect, asyncHandler(createBusiness));
// Seeding stamps ownership, so it is reserved for the super admin.
router.post("/seed", protect, superAdminOnly, asyncHandler(seedDemo));

router.get("/:slug", optionalAuth, asyncHandler(getBusiness));
// Owner-or-superadmin is enforced inside each controller via canManage().
router.put("/:slug", protect, asyncHandler(updateBusiness));
router.patch("/:slug/publish", protect, asyncHandler(togglePublish));
router.delete("/:slug", protect, asyncHandler(deleteBusiness));

export default router;
