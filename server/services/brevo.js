import axios from "axios";
import crypto from "node:crypto";

/**
 * Brevo (formerly Sendinblue) transactional email.
 *
 * Used to deliver one-time passwords for the "forgot password" flow.
 * Docs: https://developers.brevo.com/reference/send-transactional-email
 *
 * env vars:
 *   BREVO_API_KEY       – API key from Brevo → SMTP & API → API Keys
 *   BREVO_SENDER_EMAIL  – a sender verified inside Brevo
 *   BREVO_SENDER_NAME   – display name (defaults to "Cresite")
 *   OTP_EXPIRY_MINUTES  – how long a code is valid (default 10)
 *   BREVO_API_URL       – test override; never set in production
 */
export const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
/** Minimum gap between two OTP sends, in seconds. */
export const OTP_RESEND_SECONDS = 60;
/** Wrong attempts allowed before a code is invalidated. */
export const OTP_MAX_ATTEMPTS = 5;

export const brevoConfig = () => ({
  apiKey: process.env.BREVO_API_KEY || "",
  senderEmail: process.env.BREVO_SENDER_EMAIL || "",
  senderName: process.env.BREVO_SENDER_NAME || "Cresite",
});

export const isBrevoConfigured = (c = brevoConfig()) => !!(c.apiKey && c.senderEmail);

/**
 * How OTPs are delivered.
 *
 *   "brevo"   — real email through Brevo (production)
 *   "console" — printed on the server console and returned to the caller, so
 *               the flow is fully testable before mail credentials exist.
 *
 * When Brevo keys are absent we fall back to "console" automatically instead of
 * failing, so password reset always works.
 */
export const otpDeliveryMode = () => (isBrevoConfigured() ? "brevo" : "console");

/** True when the OTP may be revealed to the caller (development convenience only). */
export const canRevealOtp = () => otpDeliveryMode() === "console";

const endpoint = () => process.env.BREVO_API_URL || "https://api.brevo.com/v3/smtp/email";

/**
 * Hash a secret (OTP or reset token) before it touches the database, so a
 * database leak can't reveal usable codes.
 */
export const hashSecret = (value) =>
  crypto
    .createHmac("sha256", process.env.OTP_SECRET || process.env.JWT_SECRET || "cresite-otp-pepper")
    .update(String(value))
    .digest("hex");

/** A random 6-digit numeric OTP (100000–999999). */
export const generateOtp = () => String(crypto.randomInt(100000, 1000000));

/** A single-use reset token handed to the browser after a verified OTP. */
export const generateResetToken = () => crypto.randomBytes(32).toString("hex");

const otpEmailHtml = ({ code, minutes, name }) => `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,Segoe UI,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;">
          <tr>
            <td style="background:#101014;padding:28px 32px;">
              <span style="font-size:19px;font-weight:700;color:#ffffff;letter-spacing:-0.2px;">Cresite</span>
              <div style="font-size:12px;color:#9ca3af;margin-top:4px;">Website builder for local business</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0;font-size:21px;color:#101014;">Reset your password</h1>
              <p style="margin:14px 0 0;font-size:14px;line-height:1.65;color:#4b5563;">
                Hi ${name || "there"}, we received a request to reset the password for your Cresite
                account. Use the verification code below to continue.
              </p>
              <div style="margin:26px 0;padding:18px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:14px;text-align:center;">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;color:#6d28d9;text-transform:uppercase;">
                  Verification code
                </div>
                <div style="margin-top:8px;font-size:34px;font-weight:700;letter-spacing:9px;color:#4c1d95;">
                  ${code}
                </div>
              </div>
              <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#6b7280;">
                This code expires in <strong>${minutes} minutes</strong> and can be used once.
                If you didn't ask for a reset, you can safely ignore this email — your password stays unchanged.
              </p>
              <p style="margin:22px 0 0;font-size:12px;color:#9ca3af;">
                Please don't share this code with anyone.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#fafafa;border-top:1px solid #f0f0f0;font-size:11px;color:#a1a1aa;">
              Sent by Cresite · cresite.in@gmail.com
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

/**
 * Send an OTP email through Brevo's transactional email API.
 * @returns {boolean} whether Brevo accepted the message
 */
export async function sendOtpEmail({ to, toName, otp }) {
  const c = brevoConfig();
  if (!isBrevoConfigured(c)) {
    throw new Error("OTP email delivery is not configured.");
  }

  const payload = {
    sender: { email: c.senderEmail, name: c.senderName },
    to: [{ email: to, name: toName || to.split("@")[0] }],
    subject: `${otp} is your Cresite verification code`,
    htmlContent: otpEmailHtml({ code: otp, minutes: OTP_EXPIRY_MINUTES, name: toName }),
    textContent: `Your Cresite verification code is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
  };

  try {
    await axios.post(endpoint(), payload, {
      headers: { "api-key": c.apiKey, "Content-Type": "application/json", Accept: "application/json" },
      timeout: 15000,
    });
    return true;
  } catch (e) {
    const msg =
      e?.response?.data?.message || e?.response?.data?.ErrorChildMessage || e.message || "Brevo rejected the email";
    throw new Error(`Could not send the verification email: ${msg}`);
  }
}

/**
 * Deliver an OTP by whichever channel is available.
 *
 * With Brevo configured the code is emailed. Without credentials it is written
 * to the server console so the reset flow still works end-to-end — nothing is
 * silently dropped.
 *
 * @returns {{ delivered: boolean, channel: "brevo"|"console" }}
 */
export async function deliverOtp({ to, toName, otp }) {
  if (isBrevoConfigured()) {
    await sendOtpEmail({ to, toName, otp });
    return { delivered: true, channel: "brevo" };
  }

  /* No mail credentials — log clearly so the code is recoverable. */
  console.log("\n────────── CREsite PASSWORD RESET OTP ──────────");
  console.log(`  Email : ${to}`);
  console.log(`  Name  : ${toName || "—"}`);
  console.log(`  OTP   : ${otp}`);
  console.log(`  Valid : ${OTP_EXPIRY_MINUTES} minutes`);
  console.log("───────────────────────────────────────────────\n");
  return { delivered: true, channel: "console" };
}
