import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Receipt, RefreshCw } from "lucide-react";
import PlatformNav from "../components/common/PlatformNav.jsx";
import { getPaymentStatus, PAYMENT_LABELS } from "../services/paymentApi.js";
import { useBusinesses } from "../store/BusinessContext.jsx";
import { getPlan } from "../data/plans.js";

const fmtINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

/**
 * /payment/status — the return_url Cashfree sends customers back to.
 * The status shown here is re-read from Cashfree by our API, never trusted
 * from the URL or the browser.
 */
export default function PaymentStatus() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id") || params.get("orderId");
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const pollRef = useRef(0);
  const [refreshed, setRefreshed] = useState(false);
  const { refresh } = useBusinesses();

  useEffect(() => {
    let alive = true;
    if (!orderId) {
      setError("No payment reference in the link.");
      setChecking(false);
      return () => {
        alive = false;
      };
    }

    const check = async () => {
      try {
        const data = await getPaymentStatus(orderId);
        if (!alive) return;
        setPayment(data);
        setError("");
        /* Cashfree can take a moment to settle — poll briefly while pending. */
        /* Payment confirmed — the site is published server-side; sync our list. */
        if (data.status === "PAID" && !refreshed) {
          setRefreshed(true);
          refresh();
        }

        if (data.status === "PENDING" && pollRef.current < 5) {
          pollRef.current += 1;
          setTimeout(check, 2500);
        } else {
          setChecking(false);
        }
      } catch (e) {
        if (!alive) return;
        setError(e.message);
        setChecking(false);
      }
    };

    check();
    return () => {
      alive = false;
    };
  }, [orderId]);

  const status = payment?.status || "PENDING";
  const meta = PAYMENT_LABELS[status] || PAYMENT_LABELS.PENDING;
  const plan = payment ? getPlan(payment.plan) : null;
  const success = status === "PAID";

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#101014]">
      <PlatformNav />
      <main className="mx-auto grid min-h-screen max-w-xl place-items-center px-5 pb-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-[2rem] border border-black/10 bg-white p-8 text-center shadow-xl sm:p-10"
        >
          {/* status icon */}
          <span
            className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
              success ? "bg-emerald-100 text-emerald-600" : checking ? "bg-indigo-50 text-indigo-500" : "bg-amber-100 text-amber-600"
            }`}
          >
            {success ? (
              <CheckCircle2 size={30} />
            ) : checking ? (
              <Loader2 size={28} className="animate-spin" />
            ) : status === "PENDING" ? (
              <RefreshCw size={28} />
            ) : (
              <XCircle size={30} />
            )}
          </span>

          <h1 className="mt-6 font-display text-2xl font-bold">
            {success
              ? "Payment successful"
              : checking
              ? "Checking your payment…"
              : status === "PENDING"
              ? "Payment is still processing"
              : "Payment not completed"}
          </h1>

          <p className="mt-3 text-[14px] leading-relaxed text-[#55555E]">
            {success
              ? "Payment confirmed — your website has been published and is now live."
              : checking
              ? "We're confirming this with the payment gateway — this only takes a few seconds."
              : status === "PENDING"
              ? "The bank hasn't confirmed yet. This page will update automatically, or refresh in a moment."
              : "No money was taken for an unsuccessful payment. You can try again any time."}
          </p>

          {/* receipt */}
          {(payment || error === "") && payment && (
            <div className="mt-8 space-y-3 rounded-2xl border border-black/10 bg-[#FBFAF7] p-5 text-left">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">
                <Receipt size={12} /> Receipt
              </p>
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-[#77777F]">Plan</span>
                <span className="font-bold">{plan ? plan.name : payment.plan}</span>
              </div>
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-[#77777F]">Amount</span>
                <span className="font-bold">{fmtINR(payment.amount)}</span>
              </div>
              {payment.businessSlug && (
                <div className="flex items-center justify-between gap-3 text-[13.5px]">
                  <span className="text-[#77777F]">Website</span>
                  <span className="truncate font-mono font-semibold">/{payment.businessSlug}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-black/5 pt-3 text-[13.5px]">
                <span className="text-[#77777F]">Status</span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${meta.tint}`}>
                  {meta.label}
                </span>
              </div>
              {success && (
                <div className="flex items-center justify-between border-t border-black/5 pt-3 text-[13px]">
                  <span className="text-[#77777F]">Website</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
                  </span>
                </div>
              )}
              <p className="truncate pt-1 font-mono text-[11px] text-[#A1A1AA]">{payment.orderId}</p>
            </div>
          )}

          {error && (
            <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
              {error}
            </p>
          )}

          {/* actions */}
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {success ? (
              <>
                {payment?.businessSlug && (
                  <Link
                    to={`/${payment.businessSlug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5046E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA]"
                  >
                    View my website
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 px-6 py-3.5 text-sm font-bold transition hover:border-black/30"
                >
                  Go to dashboard
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setChecking(true);
                    pollRef.current = 0;
                    getPaymentStatus(orderId)
                      .then(setPayment)
                      .catch((e) => setError(e.message))
                      .finally(() => setChecking(false));
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 px-6 py-3.5 text-sm font-bold transition hover:border-black/30"
                >
                  <RefreshCw size={15} /> Check again
                </button>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#101014] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#5046E5]"
                >
                  <ArrowLeft size={15} /> Back to dashboard
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
