import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Platform user.
 *
 * Role hierarchy (public sign-up creates owners; elevated roles are provisioned):
 *  - "superadmin": the single platform owner, created by `npm run seed`.
 *                  Provisions admins, manages every account and website.
 *  - "admin":      created by the super admin. Creates and manages only the
 *                  websites owned by their own account. No control-room access.
 *  - "owner":      created by the super admin. Builds and manages only the
 *                  websites that belong to their account.
 */
const ROLES = ["owner", "admin", "superadmin"];
export const STAFF_ROLES = ["admin", "superadmin"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned by default
    },
    role: { type: String, enum: ROLES, default: "owner", index: true },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },

    /* ---- "Forgot password" via email OTP (Brevo). Secrets are stored ---- *
     * ---- hashed, never in plain text.                                 ---- */
    /** The current OTP, kept for verification and support lookups. */
    resetOtp: { type: String, default: "", select: false },
    /** HMAC of the OTP — what verification actually compares against. */
    resetOtpHash: { type: String, default: "", select: false },
    resetOtpExpiry: { type: Date, default: null },
    /** Unix ms of the last OTP send, used to rate-limit resends. */
    resetSentAt: { type: Date, default: null },
    /** Wrong attempts against the current OTP. */
    resetAttempts: { type: Number, default: 0 },
    /** Single-use token issued once the OTP is verified. */
    resetTokenHash: { type: String, default: "" },
    resetTokenExpiry: { type: Date, default: null },
    /** Set on password change so older JWTs stop working. */
    passwordChangedAt: { type: Date, default: null },

  },
  { timestamps: true }
);

/* Hash password whenever it is set or changed.
   (Async middleware in Mongoose 9 resolves via the returned promise — no `next`.) */
userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function matchPassword(entered) {
  return bcrypt.compare(entered, this.password);
};

/** Safe shape for API responses (never includes the hash). */
userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    role: this.role,
    active: this.active,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
  };
};

export const User = mongoose.model("User", userSchema);
