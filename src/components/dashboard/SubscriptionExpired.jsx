import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, RefreshCw, ShieldAlert, ArrowLeft, CalendarX } from "lucide-react";
import PlatformNav from "../common/PlatformNav.jsx";
import { fmtDate } from "../../services/subscriptionApi.js";

/**
 * "Subscription Expired – Renew Now" page.
 *
 * Shown in place of a website whose 1-year term has lapsed. All of the owner's
 * content is still stored — renewing brings the site straight back.
 */
export default function SubscriptionExpired({ business, onRenew, isOwner = false }) {
  const expiry = business?.subscriptionExpiry;
  const name = business?.name || "This website";

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#101014]">
      <PlatformNav />
      <main className="mx-auto grid min-h-screen max-w-2xl place-items-center px-5 pb-20 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-xl"
        >
          {/* header */}
          <div className="relative overflow-hidden bg-[#1A1614] px-8 py-10 text-center text-white">
            <div className="bg-grid-light absolute inset-0" />
            <div className="animate-blob absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-500/25 blur-3xl" />
            <div className="relative">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/15 text-amber-400">
                <CalendarX size={28} />
              </span>
              <h1 className="mt-5 font-display text-2xl font-bold sm:text-3xl">Subscription Expired</h1>
              <p className="mt-2.5 text-[14px] leading-relaxed text-white/65">
                {name}'s 1-year subscription has ended, so it's currently hidden from visitors.
              </p>
            </div>
          </div>

          {/* body */}
          <div className="px-8 py-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-[#FBFAF7] p-4">
                <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">
                  <Clock size={11} /> Subscription ended
                </p>
                <p className="mt-1.5 font-display text-[15px] font-bold">{fmtDate(expiry)}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#FBFAF7] p-4">
                <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">
                  <ShieldAlert size={11} /> Your content
                </p>
                <p className="mt-1.5 text-[13px] font-bold text-emerald-700">Safely preserved</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
              <p className="text-[13px] leading-relaxed text-emerald-800">
                <strong>Nothing has been deleted.</strong> Every page, photo, service, review and setting is
                exactly as you left it. Renewing restores your website instantly — at the same link, with all
                its content intact.
              </p>
            </div>

            {/* actions */}
            {isOwner ? (
              <div className="mt-7 space-y-2.5">
                <button
                  type="button"
                  onClick={onRenew}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5046E5] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA]"
                >
                  <RefreshCw size={16} /> Renew Now — ₹999 / year
                </button>
                <Link
                  to="/dashboard"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/15 px-6 py-3.5 text-sm font-bold transition hover:border-black/30"
                >
                  <ArrowLeft size={15} /> Back to my websites
                </Link>
              </div>
            ) : (
              <div className="mt-7 space-y-2.5">
                <p className="rounded-2xl bg-black/[0.03] px-5 py-4 text-center text-[13px] leading-relaxed text-[#55555E]">
                  The owner needs to renew this subscription. Please check back soon.
                </p>
                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#101014] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#5046E5]"
                >
                  <ArrowLeft size={15} /> Explore Cresite
                </Link>
              </div>
            )}

            <p className="mt-5 text-center text-[11.5px] text-[#A1A1AA]">
              Renewal adds a full year from your expiry date, so you never lose days you've already paid for.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
