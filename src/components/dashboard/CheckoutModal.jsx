import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, Loader2, AlertCircle, Check, Lock, CreditCard } from "lucide-react";
import { getPaymentConfig, createPaymentOrder, openCheckout } from "../../services/paymentApi.js";
import { getPlan } from "../../data/plans.js";

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

/**
 * Cashfree checkout for a website's plan.
 *
 * Flow: confirm → our API creates a Cashfree order (secret stays server-side)
 * → the Cashfree drop-in opens → on return we verify server-side.
 */
export default function CheckoutModal({ open, onClose, business }) {
  const [config, setConfig] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    let alive = true;
    setStarted(false);
    setError("");
    getPaymentConfig()
      .then((c) => alive && setConfig(c))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [open]);

  const plan = business?.plan ? getPlan(business.plan) : null;
  const payable = plan && plan.price !== null;
  const freeSite = business?.paymentExempt || business?.createdByRole === "superadmin";

  const pay = async () => {
    if (freeSite) {
      setError("No payment is required — this website was created by the super admin.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const order = await createPaymentOrder({ plan: business.plan, businessSlug: business.slug });
      setStarted(true);
      // Hands the page over to Cashfree; the customer returns to /payment/status.
      await openCheckout({ paymentSessionId: order.paymentSessionId, environment: order.environment });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center bg-black/50 px-5 backdrop-blur-sm"
          onClick={busy ? undefined : onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            {/* header */}
            <div className="relative bg-[#101014] px-7 py-7 text-white">
              {!busy && (
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D7F75B]">
                <CreditCard size={11} /> Secure checkout
              </span>
              <h2 className="mt-3 font-display text-xl font-bold">{plan ? plan.name : "Choose a plan"}</h2>
              <p className="mt-1 text-[13px] text-white/60">
                {business?.name ? `${business.name} · /${business.slug}` : ""}
              </p>
            </div>

            {/* body */}
            <div className="px-7 py-6">
              {!config ? (
                <p className="flex items-center gap-2 text-[13.5px] text-[#77777F]">
                  <Loader2 size={15} className="animate-spin" /> Checking payment options…
                </p>
              ) : freeSite ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="flex items-start gap-2 text-[13px] leading-relaxed text-emerald-800">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                    <span>
                      <strong>No payment required.</strong> Websites created by the super admin publish free.
                    </span>
                  </p>
                </div>
              ) : !config.configured ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="flex items-start gap-2 text-[13px] leading-relaxed text-amber-800">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>
                      {config.configurationMessage ||
                        "Online payments aren't fully configured on this server yet."}
                    </span>
                  </p>
                </div>
              ) : !payable ? (
                <div className="rounded-2xl border border-black/10 bg-[#FBFAF7] p-4">
                  <p className="text-[13px] leading-relaxed text-[#55555E]">
                    Custom websites are quoted per project. Finish building your site so we can see what you need, then{" "}
                    <Link to="/#contact" className="font-bold text-[#5046E5] underline">
                      talk to us
                    </Link>{" "}
                    for a fixed price.
                  </p>
                </div>
              ) : (
                <>
                  {/* price summary */}
                  <div className="flex items-end justify-between rounded-2xl border border-black/10 bg-[#FBFAF7] px-5 py-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">Amount due</p>
                      <p className="mt-1 font-display text-3xl font-bold leading-none">{fmtINR(plan.price)}</p>
                      <p className="mt-1 text-[12px] text-[#77777F]">{plan.per} · includes GST</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">
                      {config.environment === "production" ? "Live" : "Sandbox"}
                    </span>
                  </div>

                  {/* what you get */}
                  <ul className="mt-5 space-y-2">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[13px] text-[#55555E]">
                        <Check size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-emerald-600" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 flex items-center gap-2 rounded-xl bg-black/[0.03] px-3.5 py-2.5 text-[11.5px] text-[#77777F]">
                    <ShieldCheck size={14} className="shrink-0 text-indigo-500" />
                    UPI, Cards, Netbanking, Wallets & Pay Later — processed securely by Cashfree.
                  </p>

                  {error && (
                    <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] font-semibold text-red-600">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
                    </p>
                  )}

                  <button
                    onClick={pay}
                    disabled={busy || started}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5046E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA] disabled:opacity-60"
                  >
                    {busy || started ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Opening Cashfree…
                      </>
                    ) : (
                      <>
                        <Lock size={15} /> Pay {fmtINR(plan.price)}
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-[11px] text-[#A1A1AA]">
                    You'll be redirected to Cashfree and returned here afterwards.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
