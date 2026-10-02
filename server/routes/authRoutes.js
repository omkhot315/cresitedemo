import { Router } from "express";
import { asyncHandler, dbGuard } from "../middleware/errorMiddleware.js";
import { protect, superAdminOnly } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiters.js";
import {
  register, login, me, createUser, listUsers, updateUserRole, deleteUser,
  requestPasswordReset, verifyResetOtp, resetPassword,
} from "../controllers/authController.js";

/**
 * Auth routes.
 *
 * Public sign-up creates "owner" accounts only. Admins are provisioned by the
 * super admin, who is created once by `npm run seed`.
 */
const router = Router();

router.use(dbGuard);

router.post("/register", authLimiter, asyncHandler(register));
router.post("/login", authLimiter, asyncHandler(login));

/* Forgot password — public, driven by an emailed OTP (Brevo). */
router.post("/forgot-password", authLimiter, asyncHandler(requestPasswordReset));
router.post("/verify-reset-otp", authLimiter, asyncHandler(verifyResetOtp));
router.post("/reset-password", authLimiter, asyncHandler(resetPassword));
router.get("/me", protect, asyncHandler(me));

/* Super admin: view, provision and manage accounts */
router.get("/users", protect, superAdminOnly, asyncHandler(listUsers));
router.post("/users", protect, superAdminOnly, asyncHandler(createUser));
router.patch("/users/:id/role", protect, superAdminOnly, asyncHandler(updateUserRole));
router.delete("/users/:id", protect, superAdminOnly, asyncHandler(deleteUser));

export default router;
