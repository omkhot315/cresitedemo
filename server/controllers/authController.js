import { User } from "../models/User.js";
import { Business } from "../models/Business.js";
import { generateToken } from "../utils/generateToken.js";
import {
  isBrevoConfigured, deliverOtp, otpDeliveryMode, canRevealOtp,
  hashSecret, generateOtp, generateResetToken,
  OTP_EXPIRY_MINUTES, OTP_RESEND_SECONDS, OTP_MAX_ATTEMPTS,
} from "../services/brevo.js";

/*
 * Public sign-up creates "owner" accounts only — people who build and manage
 * their own websites. The elevated roles are never self-assignable:
 *   - "admin"      is provisioned by the super admin
 *   - "superadmin" exists once, created by `npm run seed`
 */

/**
 * POST /api/auth/register — public.
 * Any `role` sent by the client is ignored and forced to "owner".
 */
export async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are all required." });
  }
  if (String(name).trim().length < 2) {
    return res.status(400).json({ message: "Please enter your full name." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  const mail = String(email).toLowerCase().trim();
  const exists = await User.findOne({ email: mail });
  if (exists) {
    return res.status(409).json({ message: "An account with that email already exists — try signing in." });
  }

  // Role is hard-coded: privilege escalation via the request body is impossible.
  const user = await User.create({ name: String(name).trim(), email: mail, password, role: "owner" });
  user.lastLoginAt = new Date();
  await user.save();

  return res.status(201).json({ user: user.toSafeJSON(), token: generateToken(user) });
}

/** POST /api/auth/login */
export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Incorrect email or password." });
  }
  if (!user.active) return res.status(403).json({ message: "This account has been deactivated." });

  user.lastLoginAt = new Date();
  await user.save();
  return res.json({ user: user.toSafeJSON(), token: generateToken(user) });
}

/** GET /api/auth/me — validate the session and refresh the cached profile. */
export async function me(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}

/* --------------------------- super admin only ---------------------------- */

/**
 * POST /api/auth/users — the super admin provisions an account.
 * Roles "owner" and "admin" only: the platform keeps exactly one super admin.
 */
export async function createUser(req, res) {
  const { name, email, password, role = "owner" } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are all required." });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }
  if (!["owner", "admin"].includes(role)) {
    return res.status(400).json({ message: 'Accounts can be created as "owner" or "admin" only — the platform has a single super admin.' });
  }

  const mail = String(email).toLowerCase();
  const exists = await User.findOne({ email: mail });
  if (exists) return res.status(409).json({ message: "An account with that email already exists." });

  const user = await User.create({ name: String(name).trim(), email: mail, password, role });
  return res.status(201).json(user.toSafeJSON());
}

/** GET /api/auth/users — super admin only (enforced by the route). */
export async function listUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });

  /* Websites currently owned by each account. */
  const owned = await Business.aggregate([{ $group: { _id: "$owner", count: { $sum: 1 } } }]);
  const byOwner = Object.fromEntries(owned.map((c) => [String(c._id), c.count]));

  /* Immutable "who built it" rollup: totals, live/draft split, dates, categories. */
  const built = await Business.aggregate([
    {
      $group: {
        _id: "$createdBy",
        createdCount: { $sum: 1 },
        publishedCount: { $sum: { $cond: ["$published", 1, 0] } },
        firstCreatedAt: { $min: "$createdAt" },
        lastCreatedAt: { $max: "$createdAt" },
        categories: { $addToSet: "$category" },
      },
    },
  ]);
  const byCreator = Object.fromEntries(built.map((c) => [String(c._id), c]));

  const requesterIsSuper = req.user.role === "superadmin";
  const requesterId = String(req.user._id);
  res.json(
    users.map((u) => {
      const id = String(u._id);
      const b = byCreator[id];
      return {
        ...u.toSafeJSON(),
        websiteCount: byOwner[id] || 0,
        /** Creator analytics powering the super admin control room. */
        createdCount: b?.createdCount || 0,
        publishedCount: b?.publishedCount || 0,
        draftCount: b ? b.createdCount - b.publishedCount : 0,
        firstCreatedAt: b?.firstCreatedAt || null,
        lastCreatedAt: b?.lastCreatedAt || null,
        categories: b?.categories || [],
        /** Client hints: what the *requester* may do with this row. */
        canManageUsers: requesterIsSuper,
        /** The super admin row is always locked. */
        protected: u.role === "superadmin",
        self: id === requesterId,
      };
    })
  );
}

/** PATCH /api/auth/users/:id/role — super admin only. */
export async function updateUserRole(req, res) {
  const { role } = req.body || {};
  if (!["owner", "admin"].includes(role)) {
    return res.status(400).json({ message: 'Role must be either "owner" or "admin".' });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  if (user.role === "superadmin") {
    return res.status(400).json({ message: "The super admin role cannot be changed." });
  }

  user.role = role;
  await user.save();
  return res.json(user.toSafeJSON());
}

/** DELETE /api/auth/users/:id — super admin only. */
export async function deleteUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  if (user.role === "superadmin") {
    return res.status(400).json({ message: "The super admin account cannot be deleted." });
  }

  await user.deleteOne();
  /* Keep the websites, but unpublish and detach them so nothing stays live ownerless. */
  await Business.updateMany({ owner: user._id }, { $set: { owner: null, ownerName: "", ownerEmail: "", published: false } });
  return res.json({ success: true, id: req.params.id });
}

/* --------------------------- forgot password (OTP) ------------------------- */

/** The same response whether or not the email exists — prevents enumeration. */
const GENERIC_SENT = () => ({
  message: `If an account exists for that email, a verification code is on its way. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
});

/** Wipe every reset field (after success, or when issuing a fresh code). */
function clearResetFields(user) {
  user.resetOtp = "";
  user.resetOtpHash = "";
  user.resetOtpExpiry = null;
  user.resetSentAt = null;
  user.resetAttempts = 0;
  user.resetTokenHash = "";
  user.resetTokenExpiry = null;
}

/**
 * POST /api/auth/forgot-password  { email }
 *
 * Generates a 6-digit OTP, stores it on the user document (both the raw code
 * and its HMAC), and delivers it. With Brevo configured the code is emailed;
 * without credentials it is printed on the server console so the reset flow
 * still works end-to-end. Resends are rate-limited.
 */
export async function requestPasswordReset(req, res) {
  const { email } = req.body || {};
  const mail = String(email || "").toLowerCase().trim();
  if (!mail) return res.status(400).json({ message: "Please enter your email address." });

  const user = await User.findOne({ email: mail });
  if (!user) return res.status(200).json(GENERIC_SENT());

  /* Rate-limit resends so the address can't be used to spam mail. */
  if (user.resetSentAt) {
    const since = (Date.now() - new Date(user.resetSentAt).getTime()) / 1000;
    if (since < OTP_RESEND_SECONDS) {
      const wait = Math.ceil(OTP_RESEND_SECONDS - since);
      return res.status(429).json({ message: `Please wait ${wait}s before requesting another code.`, retryAfter: wait });
    }
  }

  const otp = generateOtp();

  /* A new code invalidates any previous one. */
  clearResetFields(user);
  user.resetOtp = otp;
  user.resetOtpHash = hashSecret(otp);
  user.resetOtpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  user.resetSentAt = new Date();
  await user.save();

  /* Deliver by email when possible, otherwise log it. */
  let channel = "brevo";
  try {
    const result = await deliverOtp({ to: user.email, toName: user.name, otp });
    channel = result.channel;
  } catch (err) {
    /* Delivery failed — clear the code so a code that never arrived can't be guessed. */
    clearResetFields(user);
    await user.save();
    return res.status(502).json({ message: err.message });
  }

  const payload = {
    message: `Your verification code has been sent to ${user.email}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    channel,
  };

  /* Development convenience: without mail credentials the code can't be read
     from an inbox, so return it so the flow is testable. Never in production. */
  if (canRevealOtp()) {
    payload.devOtp = otp;
    payload.note = "Email delivery is not configured, so the code is returned here. Set BREVO_API_KEY to send real emails.";
  }

  return res.status(200).json(payload);
}

/**
 * POST /api/auth/verify-reset-otp  { email, otp }
 * Checks the OTP and issues a single-use reset token.
 */
export async function verifyResetOtp(req, res) {
  const { email, otp } = req.body || {};
  const mail = String(email || "").toLowerCase().trim();
  const code = String(otp || "").trim();

  if (!mail || !code) return res.status(400).json({ message: "Enter the code from your email." });

  const user = await User.findOne({ email: mail }).select("+resetOtp +resetOtpHash +resetTokenHash");
  if (!user || !user.resetOtpHash || !user.resetOtpExpiry) {
    return res.status(400).json({ message: "That code isn't valid. Request a new one." });
  }
  if (new Date(user.resetOtpExpiry).getTime() <= Date.now()) {
    clearResetFields(user);
    await user.save();
    return res.status(400).json({ message: "That code has expired. Request a new one." });
  }
  if (user.resetAttempts >= OTP_MAX_ATTEMPTS) {
    clearResetFields(user);
    await user.save();
    return res.status(400).json({ message: "Too many incorrect attempts. Request a new code." });
  }

  if (hashSecret(code) !== user.resetOtpHash) {
    user.resetAttempts += 1;
    await user.save();
    const left = OTP_MAX_ATTEMPTS - user.resetAttempts;
    return res.status(400).json({
      message: left > 0 ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.` : "Too many incorrect attempts. Request a new code.",
    });
  }

  /* Correct code → issue a short-lived, single-use reset token. */
  const resetToken = generateResetToken();
  user.resetOtpHash = "";
  user.resetOtpExpiry = null;
  user.resetAttempts = 0;
  user.resetTokenHash = hashSecret(resetToken);
  user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  return res.json({ verified: true, resetToken, message: "Code verified. Choose a new password." });
}

/**
 * POST /api/auth/reset-password  { email, resetToken, newPassword }
 * Sets the new password and signs the user in.
 */
export async function resetPassword(req, res) {
  const { email, resetToken, newPassword } = req.body || {};
  const mail = String(email || "").toLowerCase().trim();
  const token = String(resetToken || "").trim();

  if (!mail || !token) return res.status(400).json({ message: "Your session expired. Please start again." });
  if (!newPassword || String(newPassword).length < 6) {
    return res.status(400).json({ message: "Choose a password of at least 6 characters." });
  }

  const user = await User.findOne({ email: mail }).select("+resetOtp +resetOtpHash +resetTokenHash");
  if (!user || !user.resetTokenHash || !user.resetTokenExpiry) {
    return res.status(400).json({ message: "Your reset link has expired. Please start again." });
  }
  if (new Date(user.resetTokenExpiry).getTime() <= Date.now()) {
    clearResetFields(user);
    await user.save();
    return res.status(400).json({ message: "Your reset link has expired. Please start again." });
  }
  if (hashSecret(token) !== user.resetTokenHash) {
    return res.status(400).json({ message: "We couldn't verify that request. Please start again." });
  }

  /* The pre-save hook hashes the new password for us. */
  user.password = newPassword;
  user.passwordChangedAt = new Date();
  clearResetFields(user);
  user.lastLoginAt = new Date();
  await user.save();

  return res.json({ user: user.toSafeJSON(), token: generateToken(user), message: "Your password has been updated." });
}
