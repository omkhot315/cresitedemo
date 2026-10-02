import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, ArrowLeft, Layers, KeyRound, Check, Loader2, ShieldCheck } from "lucide-react";
import { authApi } from "../services/authApi.js";
import { useAuth } from "../store/AuthContext.jsx";
import { BrandMark } from "../components/common/PlatformNav.jsx";

const inputWrap =
  "flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100";
const inputCls = "w-full bg-transparent py-3 text-sm outline-none placeholder:text-black/30";

const STEPS = [
  { n: 1, label: "Email" },
  { n: 2, label: "Verify" },
  { n: 3, label: "New password" },
];

/**
 * /forgot-password — three-step reset using an OTP emailed via Brevo.
 *
 *   1. Enter the account email  → we send a 6-digit code
 *   2. Enter the code           → we issue a single-use reset token
 *   3. Choose a new password    → done, and you're signed straight in
 */
export default function ForgotPassword() {
  const navigate = useNavigate();
  const { establishSession } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cooldown, setCooldown] = useState(0);
  /* Shown only when email delivery isn't configured. */
  const [devOtp, setDevOtp] = useState("");
  const [devNote, setDevNote] = useState("");

  const otpRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === 2) otpRefs.current[0]?.focus();
  }, [step]);

  /* ------------------------------- step 1 ------------------------------- */
  const sendCode = async (e) => {
    e?.preventDefault();
    setError("");
    setNotice("");
    if (!email.trim()) return setError("Please enter your email address.");
    setBusy(true);
    try {
      const res = await authApi.forgotPassword({ email: email.trim() });
      setNotice(res.message);
      /* Without mail credentials the API returns the code so the flow works. */
      if (res.devOtp) {
        setDevOtp(res.devOtp);
        setDevNote(res.note);
      } else {
        setDevOtp("");
        setDevNote("");
      }
      setCooldown(60);
      setStep(2);
    } catch (err) {
      setError(err.message);
      if (err.retryAfter) setCooldown(err.retryAfter);
    } finally {
      setBusy(false);
    }
  };

  /* ------------------------------- step 2 ------------------------------- */
  const setDigit = (i, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((o) => {
      const next = [...o];
      next[i] = digit;
      return next;
    });
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const onOtpPaste = (e) => {
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
    if (!text) return;
    e.preventDefault();
    const digits = text.slice(0, 6).split("");
    setOtp((o) => {
      const next = [...o];
      digits.forEach((d, idx) => {
        next[idx] = d;
      });
      return next;
    });
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const verifyCode = async (e) => {
    e?.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) return setError("Enter all six digits of your code.");
    setBusy(true);
    try {
      const res = await authApi.verifyResetOtp({ email: email.trim(), otp: code });
      setResetToken(res.resetToken);
      setNotice("");
      setStep(3);
    } catch (err) {
      setError(err.message);
      /* Too many attempts → back to step 1 so they can request a fresh code. */
      if (/too many incorrect attempts/i.test(err.message)) {
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => setStep(1), 1200);
      }
    } finally {
      setBusy(false);
    }
  };

  /* ------------------------------- step 3 ------------------------------- */
  const savePassword = async (e) => {
    e?.preventDefault();
    setError("");
    if (password.length < 6) return setError("Choose a password of at least 6 characters.");
    if (password !== confirm) return setError("Those passwords don't match.");
    setBusy(true);
    try {
      const res = await authApi.resetPassword({
        email: email.trim(),
        resetToken,
        newPassword: password,
      });
      const session = establishSession(res);
      if (!session.ok) throw new Error(session.error);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const goBack = () => {
    setError("");
    setNotice("");
    if (step === 1) navigate("/login");
    else if (step === 2) setStep(1);
    else setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#101014] lg:grid lg:grid-cols-2">
      {/* ---------------------------- brand panel ---------------------------- */}
      <aside className="relative hidden overflow-hidden bg-[#0D0D12] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-grid-light absolute inset-0" />
        <div className="animate-blob absolute -right-20 top-10 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />

        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#5046E5] to-[#8B5CF6] text-white">
              <Layers size={16} strokeWidth={2.4} />
            </span>
            <span className="font-display text-[17px] font-bold">Cresite</span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[#D7F75B]">
            <KeyRound size={24} />
          </span>
          <h2 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.1]">
            Let's get you{" "}
            <span className="font-accent-serif italic text-[#D7F75B]">back in</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/60">
            We'll email you a six-digit verification code. It's valid for ten minutes and can only be used once — so
            your account stays yours.
          </p>
          <ul className="mt-8 space-y-3.5">
            {[
              "Codes are single-use and expire quickly",
              "Your websites and data are untouched",
              "Every other device is signed out after a reset",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[14px] text-white/75">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#D7F75B] text-[#101014]">
                  <ShieldCheck size={12} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[12px] text-white/35">© {new Date().getFullYear()} Cresite. All rights reserved.</p>
      </aside>

      {/* ------------------------------ the flow ----------------------------- */}
      <main className="flex min-h-screen flex-col justify-center px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden">
            <BrandMark />
          </div>

          <button
            type="button"
            onClick={goBack}
            className="mt-8 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#77777F] transition hover:text-[#101014] lg:mt-0"
          >
            <ArrowLeft size={14} /> {step === 1 ? "Back to sign in" : "Previous step"}
          </button>

          <div className="mt-4">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {step === 1 ? "Forgot your password?" : step === 2 ? "Check your email" : "Choose a new password"}
            </h1>
            <p className="mt-2 text-[14.5px] text-[#55555E]">
              {step === 1
                ? "Enter the email you signed up with and we'll send a verification code."
                : step === 2
                ? `We sent a six-digit code to ${email}. Enter it below to continue.`
                : "Pick something you haven't used before, at least 6 characters."}
            </p>
          </div>

          {/* progress */}
          <div className="mt-7 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex flex-1 items-center gap-2">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold transition ${
                    step > s.n
                      ? "bg-emerald-100 text-emerald-700"
                      : step === s.n
                      ? "bg-indigo-600 text-white"
                      : "bg-black/5 text-[#A1A1AA]"
                  }`}
                >
                  {step > s.n ? <Check size={13} strokeWidth={3} /> : s.n}
                </span>
                <span className={`text-[11.5px] font-bold ${step >= s.n ? "text-[#101014]" : "text-[#A1A1AA]"}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <span className={`h-px flex-1 ${step > s.n ? "bg-emerald-300" : "bg-black/10"}`} />
                )}
              </div>
            ))}
          </div>

          {/* ------------------------------ step 1 ------------------------------ */}
          {step === 1 && (
            <form onSubmit={sendCode} className="mt-7 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">Email</span>
                <span className={inputWrap}>
                  <Mail size={16} className="shrink-0 text-black/30" />
                  <input
                    type="email"
                    className={inputCls}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    required
                    autoComplete="email"
                  />
                </span>
              </label>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] font-semibold text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy || cooldown > 0}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5046E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA] disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending your code…
                  </>
                ) : cooldown > 0 ? (
                  `Resend available in ${cooldown}s`
                ) : (
                  <>
                    Send verification code <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ------------------------------ step 2 ------------------------------ */}
          {step === 2 && (
            <form onSubmit={verifyCode} className="mt-7 space-y-5">
              <div>
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">
                  Verification code
                </span>
                <div className="flex gap-2" onPaste={onOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      value={digit}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => onOtpKeyDown(i, e)}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      aria-label={`Digit ${i + 1}`}
                      className="h-14 w-full rounded-xl border border-black/10 bg-white text-center text-xl font-bold outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  ))}
                </div>
              </div>

              {notice && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[12.5px] font-semibold text-emerald-700">
                  {notice}
                </p>
              )}

              {/* Shown only while email delivery is unconfigured. */}
              {devOtp && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-700">
                    Email delivery not configured
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-amber-800">
                    Your verification code is:
                  </p>
                  <p className="mt-2 text-center font-display text-3xl font-bold tracking-[0.35em] text-amber-900">
                    {devOtp}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOtp(devOtp.split(""));
                      otpRefs.current[5]?.focus();
                    }}
                    className="mt-3 w-full rounded-full bg-amber-600 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-amber-700"
                  >
                    Fill it in automatically
                  </button>
                  {devNote && (
                    <p className="mt-2.5 text-[11px] leading-relaxed text-amber-700">{devNote}</p>
                  )}
                </div>
              )}
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] font-semibold text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5046E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA] disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verifying…
                  </>
                ) : (
                  <>
                    Verify code <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[13px]">
                <button
                  type="button"
                  onClick={() => {
                    setEmail(email);
                    setOtp(["", "", "", "", "", ""]);
                    setNotice("");
                    setError("");
                    setStep(1);
                  }}
                  className="font-semibold text-[#77777F] transition hover:text-[#101014]"
                >
                  Wrong email?
                </button>
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={cooldown > 0 || busy}
                  className="font-bold text-[#5046E5] transition hover:text-[#4338CA] disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}

          {/* ------------------------------ step 3 ------------------------------ */}
          {step === 3 && (
            <form onSubmit={savePassword} className="mt-7 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">New password</span>
                <span className={inputWrap}>
                  <Lock size={16} className="shrink-0 text-black/30" />
                  <input
                    type="password"
                    className={inputCls}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">
                  Confirm password
                </span>
                <span className={inputWrap}>
                  <Lock size={16} className="shrink-0 text-black/30" />
                  <input
                    type="password"
                    className={inputCls}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Type it again"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </span>
              </label>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] font-semibold text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5046E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA] disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Updating…
                  </>
                ) : (
                  <>
                    Update password <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <p className="text-center text-[11.5px] leading-relaxed text-[#8E8E96]">
                For your security, every other device signed into this account will be signed out.
              </p>
            </form>
          )}

          <p className="mt-6 text-center text-[13px] text-[#77777F]">
            Remembered it?{" "}
            <Link to="/login" className="font-bold text-[#5046E5] transition hover:text-[#4338CA]">
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
