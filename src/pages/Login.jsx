import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Layers, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "../store/AuthContext.jsx";
import { BrandMark } from "../components/common/PlatformNav.jsx";

const inputWrap =
  "flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100";
const inputCls = "w-full bg-transparent py-3 text-sm outline-none placeholder:text-black/30";

/**
 * /login and /signup — one page, two modes.
 *
 * Public sign-up creates an "owner" account so anyone can build their own
 * business website. Admin and super-admin roles stay provisioned-only.
 */
export default function Login({ initialMode = "login" }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  const [mode, setMode] = useState(location.pathname === "/signup" ? "register" : initialMode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isRegister = mode === "register";
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const switchMode = (next) => {
    setMode(next);
    setError("");
    window.history.replaceState(null, "", next === "register" ? "/signup" : "/login");
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError("");
    setBusy(true);
    const res = isRegister
      ? await register({ name: form.name, email: form.email, password: form.password })
      : await login({ email: form.email, password: form.password });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    // New owners go straight to the builder; returning users to their dashboard.
    return navigate(isRegister ? "/create" : redirectTo, { replace: true });
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
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? "r" : "l"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {isRegister ? (
                <>
                  <h2 className="text-balance font-display text-4xl font-bold leading-[1.1]">
                    Your business deserves a{" "}
                    <span className="font-accent-serif italic text-[#D7F75B]">real website</span>
                  </h2>
                  <p className="mt-5 text-[15px] leading-relaxed text-white/60">
                    Create a free account and publish a professional site for your clinic, gym, salon, cafe or
                    restaurant — in minutes, with no code.
                  </p>
                  <ul className="mt-8 space-y-3.5">
                    {[
                      "Free to start — no card required",
                      "Your own link, live instantly",
                      "Edit anything, any time",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-3 text-[14px] text-white/75">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#D7F75B] text-[#101014]">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h2 className="text-balance font-display text-4xl font-bold leading-[1.1]">
                    Welcome back to your{" "}
                    <span className="font-accent-serif italic text-[#D7F75B]">website builder</span>
                  </h2>
                  <p className="mt-5 text-[15px] leading-relaxed text-white/60">
                    Sign in to build, publish and manage your business websites — all from one calm dashboard.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="relative text-[12px] text-white/35">© {new Date().getFullYear()} Cresite. All rights reserved.</p>
      </aside>

      {/* ------------------------------ the form ----------------------------- */}
      <main className="flex min-h-screen flex-col justify-center px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden">
            <BrandMark />
          </div>

          <div className="mt-8 lg:mt-0">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-[14.5px] text-[#55555E]">
              {isRegister
                ? "Free forever to start. Build your first website right after signing up."
                : "Sign in to manage your business websites."}
            </p>
          </div>

          {/* mode switch */}
          <div className="mt-7 flex rounded-full bg-black/5 p-1">
            {[
              { id: "login", label: "Sign in" },
              { id: "register", label: "Sign up" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => switchMode(t.id)}
                className={`flex-1 rounded-full py-2.5 text-[13.5px] font-bold transition ${
                  mode === t.id ? "bg-white text-[#101014] shadow" : "text-[#77777F] hover:text-[#101014]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <AnimatePresence initial={false}>
              {isRegister && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">
                      Your name
                    </span>
                    <span className={inputWrap}>
                      <User size={16} className="shrink-0 text-black/30" />
                      <input
                        className={inputCls}
                        value={form.name}
                        onChange={(e) => set({ name: e.target.value })}
                        placeholder="Priya Sharma"
                        required={isRegister}
                        autoComplete="name"
                      />
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">Email</span>
              <span className={inputWrap}>
                <Mail size={16} className="shrink-0 text-black/30" />
                <input
                  type="email"
                  className={inputCls}
                  value={form.email}
                  onChange={(e) => set({ email: e.target.value })}
                  placeholder="you@business.com"
                  required
                  autoComplete="email"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">
                Password
              </span>
              <span className={inputWrap}>
                <Lock size={16} className="shrink-0 text-black/30" />
                <input
                  type={showPw ? "text" : "password"}
                  className={inputCls}
                  value={form.password}
                  onChange={(e) => set({ password: e.target.value })}
                  placeholder={isRegister ? "At least 6 characters" : "••••••••"}
                  required
                  minLength={isRegister ? 6 : undefined}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="shrink-0 text-black/30 transition hover:text-black/60"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            {!isRegister && (
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-[12.5px] font-bold text-[#5046E5] transition hover:text-[#4338CA]"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] font-semibold text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5046E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA] disabled:opacity-60"
            >
              {busy ? (isRegister ? "Creating account…" : "Signing in…") : isRegister ? "Create free account" : "Sign in"}
              {!busy && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
            </button>

            {isRegister && (
              <p className="text-center text-[11.5px] leading-relaxed text-[#8E8E96]">
                By creating an account you agree to our terms and privacy policy.
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-[13px] text-[#55555E]">
            {isRegister ? "Already have an account?" : "New to Cresite?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isRegister ? "login" : "register")}
              className="font-bold text-[#5046E5] transition hover:text-[#4338CA]"
            >
              {isRegister ? "Sign in instead" : "Create a free account"}
            </button>
          </p>

          <p className="mt-6 text-center text-[13px] text-[#77777F]">
            <Link to="/" className="font-semibold transition hover:text-[#101014]">
              ← Back to Cresite home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
