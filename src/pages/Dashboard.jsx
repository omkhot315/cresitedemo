import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Eye, Pencil, Trash2, Copy, Check, Globe, LayoutGrid, RotateCcw, Crown, ShieldCheck, UserRound,
  Clock, CalendarX, RefreshCw, CreditCard,
} from "lucide-react";
import PlatformNav from "../components/common/PlatformNav.jsx";
import { useAuth } from "../store/AuthContext.jsx";
import { useBusinesses } from "../store/BusinessContext.jsx";
import { templateForCategory } from "../templates/registry.js";
import CheckoutModal from "../components/dashboard/CheckoutModal.jsx";
import PaymentHistory from "../components/dashboard/PaymentHistory.jsx";
import { getSubscriptionGroups, fmtDate } from "../services/subscriptionApi.js";
import StatusBadge from "../components/dashboard/StatusBadge.jsx";
import { getCategory } from "../data/categories.js";
import BizIcon from "../components/common/BizIcon.jsx";
import { withAlpha, PLATFORM_URL } from "../utils/businessUtils.js";

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={19} />
      </span>
      <div>
        <p className="font-display text-xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#77777F]">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { myList: list, ready, refresh, deleteBusiness, togglePublished, resetDemo } = useBusinesses();
  const [toast, setToast] = useState("");
  const [confirmSlug, setConfirmSlug] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [showPay, setShowPay] = useState(null);
  /* Payments tab — transaction history for this account. */
  const [tab, setTab] = useState("sites");
  /* 1-year subscription groups: active / expiring / expired. */
  const [subs, setSubs] = useState({ active: [], expiring: [], expired: [] });

  useEffect(() => {
    let alive = true;
    getSubscriptionGroups()
      .then((g) => alive && setSubs(g || { active: [], expiring: [], expired: [] }))
      .catch(() => alive && setSubs({ active: [], expiring: [], expired: [] }));
    return () => {
      alive = false;
    };
  }, [list.length]);

  const subCounts = {
    active: subs.active.length,
    expiring: subs.expiring.length,
    expired: subs.expired.length,
    total: subs.active.length + subs.expiring.length + subs.expired.length,
  };

  /* Renewal from the expired page or dashboard card. */
  const renew = (slug) => {
    setShowPay(slug);
    /* Once payment succeeds, reload both the sites and the subscription groups. */
    setTimeout(() => {
      refresh();
      getSubscriptionGroups()
        .then((g) => setSubs(g || { active: [], expiring: [], expired: [] }))
        .catch(() => {});
    }, 1500);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const copy = async (slug) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    } catch {
      /* clipboard unavailable */
    }
    setCopiedSlug(slug);
    showToast("Website link copied — paste it anywhere");
    setTimeout(() => setCopiedSlug(null), 1800);
  };

  const live = list.filter((b) => b.published).length;

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#101014]">
      <PlatformNav />

      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {isSuperAdmin ? "All Websites" : "My Websites"}
              </h1>
              {isAdmin && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] ${
                    isSuperAdmin ? "bg-violet-100 text-violet-700" : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {isSuperAdmin ? <Crown size={11} /> : <ShieldCheck size={11} />}
                  {isSuperAdmin ? "Super admin view" : "Admin account"}
                </span>
              )}
            </div>
            <p className="mt-2 max-w-lg text-[14.5px] text-[#55555E]">
              {isSuperAdmin
                ? "As super admin you can see and manage every website on the platform, whoever created it."
                : `Welcome back, ${user?.name?.split(" ")[0]} — these are the websites your account created. Only you and the super admin can see them.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {isSuperAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold transition hover:border-black/30"
              >
                <Crown size={15} /> Control room
              </Link>
            )}
            <Link
              to="/create"
              className="inline-flex items-center gap-2 rounded-full bg-[#5046E5] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA]"
            >
              <Plus size={16} strokeWidth={2.6} /> Create Website
            </Link>
          </div>
        </div>

        {/* Renewal reminders */}
        {(subs.expiring.length > 0 || subs.expired.length > 0) && (
          <div className="mt-8 space-y-3">
            {subs.expired.map((s) => (
              <div key={s.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5">
                <p className="flex items-start gap-2.5 text-[13px] leading-relaxed text-red-800">
                  <CalendarX size={16} className="mt-0.5 shrink-0 text-red-600" />
                  <span>
                    <strong>{s.name}</strong> expired on {fmtDate(s.expiry)} and is hidden from visitors. Your content is safe.
                  </span>
                </p>
                <button
                  onClick={() => renew(s.slug)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#5046E5] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#4338CA]"
                >
                  <RefreshCw size={13} /> Renew now
                </button>
              </div>
            ))}
            {subs.expiring.map((s) => (
              <div key={s.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
                <p className="flex items-start gap-2.5 text-[13px] leading-relaxed text-amber-800">
                  <Clock size={16} className="mt-0.5 shrink-0 text-amber-600" />
                  <span>
                    <strong>{s.name}</strong> expires in {s.daysRemaining} day{s.daysRemaining === 1 ? "" : "s"} ({fmtDate(s.expiry)}). Renew now to avoid downtime.
                  </span>
                </p>
                <button
                  onClick={() => renew(s.slug)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-[12px] font-bold text-white transition hover:bg-amber-700"
                >
                  <RefreshCw size={13} /> Renew
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Subscription overview — active / expiring / expired */}
        {subCounts.total > 0 && (
          <div className="mt-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { key: "active", label: "Active", icon: ShieldCheck, tint: "bg-emerald-50 text-emerald-600", sites: subs.active },
                { key: "expiring", label: "Expiring soon", icon: Clock, tint: "bg-amber-50 text-amber-600", sites: subs.expiring },
                { key: "expired", label: "Expired", icon: CalendarX, tint: "bg-red-50 text-red-600", sites: subs.expired },
              ].map((s) => (
                <div key={s.key} className="rounded-2xl border border-black/10 bg-white px-5 py-4">
                  <div className="flex items-center gap-4">
                    <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.tint}`}>
                      <s.icon size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-xl font-bold leading-none">{s.sites.length}</p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#77777F]">
                        {s.label}
                      </p>
                    </div>
                  </div>
                  {s.sites.length > 0 && (
                    <ul className="mt-3.5 space-y-2 border-t border-black/5 pt-3">
                      {s.sites.slice(0, 3).map((site) => (
                        <li key={site.slug} className="flex items-center justify-between gap-2 text-[12px]">
                          <Link to={`/business/${site.slug}/edit`} className="min-w-0 flex-1 truncate font-semibold transition hover:text-indigo-600">
                            {site.name}
                          </Link>
                          <span className="shrink-0 text-[11px] font-semibold text-[#A1A1AA]">
                            {site.status === "expired"
                              ? fmtDate(site.expiry)
                              : `${site.daysRemaining}d left`}
                          </span>
                        </li>
                      ))}
                      {s.sites.length > 3 && (
                        <li className="text-[11px] font-semibold text-[#A1A1AA]">
                          +{s.sites.length - 3} more
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Total websites" value={list.length} icon={Globe} />
          <Stat label="Live right now" value={live} icon={Eye} />
          <Stat label="Categories used" value={new Set(list.map((b) => b.category)).size} icon={LayoutGrid} />
        </div>

        {/* Sites / Payments tabs */}
        <div className="mt-9 flex w-fit max-w-full overflow-x-auto rounded-full bg-black/5 p-1">
          {[
            { id: "sites", label: `My Websites (${list.length})`, icon: Globe },
            { id: "payments", label: "Payments", icon: CreditCard },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-bold transition ${
                tab === t.id ? "bg-white shadow" : "text-[#77777F] hover:text-[#101014]"
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Payments tab */}
        {tab === "payments" && (
          <div className="mt-6">
            <PaymentHistory isSuperAdmin={false} />
          </div>
        )}

        {/* Website cards */}
        {tab === "sites" && !ready ? (
          <div className="mt-16 grid place-items-center">
            <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-black/10 border-t-[#5046E5]" />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {list.map((b) => {
                const tpl = templateForCategory(b.category);
                const cat = getCategory(b.category);
                const freeSite = b.paymentExempt || b.createdByRole === "superadmin";
                return (
                  <motion.article
                    key={b.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white transition-shadow hover:shadow-2xl hover:shadow-indigo-500/10"
                  >
                    {/* Cover */}
                    <div className="relative h-36 overflow-hidden">
                      {b.heroImage ? (
                        <img src={b.heroImage} alt={b.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      ) : (
                        <div
                          className="grid h-full w-full place-items-center"
                          style={{ background: `linear-gradient(135deg, ${withAlpha(tpl.theme.primary, 0.85)}, ${withAlpha(tpl.theme.secondary, 0.95)})` }}
                        >
                          <BizIcon name={cat.icon} size={38} className="text-white/80" />
                        </div>
                      )}
                      <span
                        className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: withAlpha(tpl.theme.primary, 0.92), color: "#fff" }}
                      >
                        {cat.label}
                      </span>
                      <span
                        className={`absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          b.published ? "bg-emerald-500 text-white" : "bg-black/70 text-white/90"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        {b.published ? "Live" : "Draft"}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-[17px] font-bold">{b.name}</h3>
                        {freeSite ? (
                          <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                            Free · super admin
                          </span>
                        ) : b.plan ? (
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              b.plan === "domain"
                                ? "bg-indigo-100 text-indigo-700"
                                : b.plan === "custom"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-black/5 text-[#55555E]"
                            }`}
                          >
                            {b.plan === "domain"
                              ? "₹2,999 domain"
                              : b.plan === "custom"
                              ? "custom"
                              : "₹9 basic"}
                          </span>
                        ) : null}
                      </div>
                      {/* 1-year subscription status + renewal warning */}
                      {!freeSite && b.subscriptionStatus && b.subscriptionStatus !== "none" && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <StatusBadge status={b.subscriptionStatus} days={b.daysRemaining} />
                          {b.subscriptionStatus !== "active" && (
                            <button
                              onClick={() => renew(b.slug)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#5046E5] px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white transition hover:bg-[#4338CA]"
                            >
                              <RefreshCw size={11} /> Renew
                            </button>
                          )}
                          {b.subscriptionStatus === "active" && b.subscriptionExpiry && (
                            <span className="text-[11px] text-[#A1A1AA]">until {fmtDate(b.subscriptionExpiry)}</span>
                          )}
                        </div>
                      )}
                      {isSuperAdmin && (
                        <p className="mt-1 flex items-center gap-1.5 truncate text-[11.5px] font-medium text-[#A1A1AA]">
                          <UserRound size={11} className="shrink-0" />
                          Created by{" "}
                          <span className="font-semibold text-[#55555E]">
                            {b.createdByName || b.ownerName || "Unknown"}
                          </span>
                          {(b.createdByRole || "") && (
                            <span className="shrink-0 rounded-full bg-black/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                              {b.createdByRole}
                            </span>
                          )}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="truncate rounded-lg bg-black/5 px-2.5 py-1 font-mono text-[11.5px] font-semibold text-[#55555E]">
                          {PLATFORM_URL}/{b.slug}
                        </span>
                        <button
                          onClick={() => copy(b.slug)}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-black/10 text-[#77777F] transition hover:border-indigo-400 hover:text-indigo-600"
                          aria-label="Copy link"
                        >
                          {copiedSlug === b.slug ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        </button>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-2 border-t border-black/5 pt-4">
                        {/* Publish switch */}
                      <button
                        onClick={async () => {
                          /* Publishing requires a confirmed payment. */
                          const r = await togglePublished(b.slug);
                          if (!r.ok) {
                            showToast(r.error);
                            if (r.paymentRequired) setShowPay(b.slug);
                          } else {
                            showToast(
                              b.published ? `"${b.name}" unpublished` : `"${b.name}" is now LIVE`
                            );
                          }
                        }}
                          className="flex items-center gap-2"
                          aria-label="Toggle published"
                        >
                          <span
                            className="relative h-6 w-11 rounded-full transition-colors"
                            style={{ background: b.published ? "#22C55E" : "#D4D4D8" }}
                          >
                            <span
                              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                              style={{ left: b.published ? 22 : 2 }}
                            />
                          </span>
                          <span className="text-[12px] font-semibold text-[#55555E]">{b.published ? "Live" : "Draft"}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {b.plan && b.plan !== "custom" && !b.paid && !freeSite && (
                            <button
                              onClick={() => setShowPay(b.slug)}
                              className="rounded-full bg-[#5046E5] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-[#4338CA]"
                            >
                              Pay
                            </button>
                          )}
                          {freeSite ? (
                            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                              Free
                            </span>
                          ) : b.paid ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                              Paid
                            </span>
                          ) : null}
                          <a
                            href={b.published ? `/${b.slug}` : `/${b.slug}?preview=1`}
                            target="_blank"
                            rel="noreferrer"
                            className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 text-[#55555E] transition hover:border-indigo-400 hover:text-indigo-600"
                            title={b.published ? "Preview live site" : "Preview draft"}
                          >
                            <Eye size={15} />
                          </a>
                          <Link
                            to={`/business/${b.slug}/edit`}
                            className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 text-[#55555E] transition hover:border-indigo-400 hover:text-indigo-600"
                            title="Edit website"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => setConfirmSlug(b.slug)}
                            className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 text-[#55555E] transition hover:border-red-400 hover:text-red-600"
                            title="Delete website"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete confirm overlay */}
                    <AnimatePresence>
                      {confirmSlug === b.slug && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 p-6 text-center backdrop-blur-sm"
                        >
                          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-red-600">
                            <Trash2 size={20} />
                          </span>
                          <p className="mt-4 font-display text-lg font-bold">Delete "{b.name}"?</p>
                          <p className="mt-1.5 text-[12.5px] text-[#77777F]">This removes the website and its link. It can't be undone.</p>
                          <div className="mt-5 flex gap-2.5">
                            <button
                              onClick={() => {
                                deleteBusiness(b.slug);
                                setConfirmSlug(null);
                                showToast(`"${b.name}" deleted`);
                              }}
                              className="rounded-full bg-red-600 px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-red-700"
                            >
                              Yes, delete
                            </button>
                            <button
                              onClick={() => setConfirmSlug(null)}
                              className="rounded-full border border-black/15 px-5 py-2.5 text-[13px] font-bold transition hover:bg-black/5"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </AnimatePresence>

            {/* Create new tile */}
            <Link
              to="/create"
              className="group flex min-h-[280px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-black/15 bg-white/50 p-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-600 transition group-hover:scale-110">
                <Plus size={24} />
              </span>
              <p className="mt-4 font-display text-[16px] font-bold">Build another website</p>
              <p className="mt-1.5 max-w-[220px] text-[12.5px] leading-relaxed text-[#77777F]">
                A new trade, a second branch, a client's business — the platform scales with you.
              </p>
            </Link>
          </div>
        )}

        {ready && isSuperAdmin && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={async () => {
                const ok = await resetDemo();
                showToast(ok ? "Demo businesses restored" : "Could not restore demo data");
              }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12.5px] font-semibold text-[#77777F] transition hover:bg-black/5 hover:text-[#101014]"
            >
              <RotateCcw size={14} /> Restore demo data
            </button>
          </div>
        )}
      </main>

      {/* Cashfree checkout */}
      <CheckoutModal
        open={!!showPay}
        onClose={() => setShowPay(null)}
        business={list.find((b) => b.slug === showPay)}
      />

      {/* Toast + draft hint */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[#101014] px-5 py-3 text-[13px] font-semibold text-white shadow-2xl"
          >
            <Check size={15} className="text-emerald-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
