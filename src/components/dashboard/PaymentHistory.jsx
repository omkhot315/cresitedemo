import { useEffect, useState } from "react";
import { CreditCard, RefreshCw, ChevronDown, Wallet, TrendingUp, Clock, XCircle } from "lucide-react";
import { listPayments, fmtINR, PAYMENT_STATUS_META } from "../../services/paymentApi.js";
import { getPlan } from "../../data/plans.js";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

/** Small status pill. */
function StatusPill({ status }) {
  const meta = PAYMENT_STATUS_META[status] || PAYMENT_STATUS_META.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider ${meta.tint}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
}

/** Summary card used by the super admin revenue row. */
function RevenueCard({ icon: Icon, label, value, tint = "indigo" }) {
  const tints = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tints[tint]}`}>
        <Icon size={19} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-xl font-bold leading-none">{value}</p>
        <p className="mt-1 truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[#77777F]">{label}</p>
      </div>
    </div>
  );
}

/**
 * Payment history table, shared by the user dashboard and the super admin
 * control room.
 *
 * @param {boolean} isSuperAdmin — when true, shows revenue totals and the
 *   payer column instead of "my payments only".
 */
export default function PaymentHistory({ isSuperAdmin = false }) {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await listPayments();
      setPayments(res.payments || []);
      setStats(res.stats || null);
    } catch (e) {
      setError(e.message);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = {
    all: payments.length,
    paid: payments.filter((p) => p.status === "PAID").length,
    pending: payments.filter((p) => p.status === "PENDING").length,
    failed: payments.filter((p) => ["FAILED", "CANCELLED", "EXPIRED"].includes(p.status)).length,
  };

  const visible =
    filter === "all"
      ? payments
      : filter === "paid"
      ? payments.filter((p) => p.status === "PAID")
      : filter === "pending"
      ? payments.filter((p) => p.status === "PENDING")
      : payments.filter((p) => ["FAILED", "CANCELLED", "EXPIRED"].includes(p.status));

  return (
    <div>
      {/* Revenue rollups — super admin only */}
      {isSuperAdmin && stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RevenueCard icon={Wallet} label="Total collected" value={fmtINR(stats.totalCollected)} tint="emerald" />
          <RevenueCard
            icon={TrendingUp}
            label="This month"
            value={fmtINR(stats.thisMonthCollected)}
            sub={undefined}
            tint="indigo"
          />
          <RevenueCard icon={CreditCard} label="Successful" value={stats.paidCount} tint="emerald" />
          <RevenueCard icon={Clock} label="Pending / Failed" value={`${stats.pendingCount} / ${stats.failedCount}`} tint="amber" />
        </div>
      )}

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-full bg-black/5 p-1">
          {[
            { id: "all", label: `All (${counts.all})` },
            { id: "paid", label: `Paid (${counts.paid})` },
            { id: "pending", label: `Pending (${counts.pending})` },
            { id: "failed", label: `Failed (${counts.failed})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                filter === f.id ? "bg-white shadow" : "text-[#77777F] hover:text-[#101014]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={load}
          className="ml-auto inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-[12px] font-bold transition hover:border-black/30"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Table / empty state */}
      {loading ? (
        <div className="mt-6 grid place-items-center rounded-3xl border border-black/10 bg-white py-16">
          <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-black/10 border-t-[#5046E5]" />
        </div>
      ) : error ? (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-[13.5px] font-semibold text-red-600">{error}</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-black/15 bg-white p-12 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-500">
            <CreditCard size={22} />
          </span>
          <p className="mt-4 font-display text-[16px] font-bold">
            {filter === "all" ? "No payments yet" : "Nothing in this view"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[#77777F]">
            {filter === "all"
              ? "When you subscribe to a plan, every transaction will appear here with its receipt."
              : "Try a different filter to see other transactions."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-hidden rounded-3xl border border-black/10 bg-white lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-black/10 bg-black/[0.02] text-[11px] font-bold uppercase tracking-[0.12em] text-[#77777F]">
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Website</th>
                    <th className="px-5 py-3.5">Plan</th>
                    {isSuperAdmin && <th className="px-5 py-3.5">Payer</th>}
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Method</th>
                    <th className="px-5 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => {
                    const plan = getPlan(p.plan);
                    return (
                      <tr key={p.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                        <td className="px-5 py-4">
                          <p className="text-[13px] font-semibold">{fmtDate(p.createdAt)}</p>
                          <p className="text-[11px] text-[#A1A1AA]">{fmtTime(p.createdAt)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="max-w-[180px] truncate text-[13px] font-semibold">
                            {p.businessName || "—"}
                          </p>
                          <p className="max-w-[180px] truncate font-mono text-[11px] text-[#A1A1AA]">
                            /{p.businessSlug || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-bold text-[#55555E]">
                            {plan ? plan.name : p.plan}
                          </span>
                        </td>
                        {isSuperAdmin && (
                          <td className="px-5 py-4">
                            <p className="max-w-[160px] truncate text-[12.5px] font-semibold">
                              {p.customerName || "—"}
                            </p>
                            <p className="max-w-[160px] truncate font-mono text-[11px] text-[#A1A1AA]">
                              {p.customerEmail || ""}
                            </p>
                          </td>
                        )}
                        <td className="px-5 py-4 font-display text-[14.5px] font-bold">{fmtINR(p.amount)}</td>
                        <td className="px-5 py-4">
                          <span className="text-[12.5px] capitalize text-[#55555E]">
                            {p.paymentMethod || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <StatusPill status={p.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 space-y-3 lg:hidden">
            {visible.map((p) => {
              const plan = getPlan(p.plan);
              return (
                <article key={p.id} className="rounded-3xl border border-black/10 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[15px] font-bold">
                        {p.businessName || "Website"}
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-[#A1A1AA]">
                        {fmtDate(p.createdAt)} · {fmtTime(p.createdAt)}
                      </p>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3">
                    <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-bold text-[#55555E]">
                      {plan ? plan.name : p.plan}
                    </span>
                    <span className="font-display text-[17px] font-bold">{fmtINR(p.amount)}</span>
                  </div>
                  {isSuperAdmin && p.customerEmail && (
                    <p className="mt-2 truncate font-mono text-[11px] text-[#A1A1AA]">{p.customerEmail}</p>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}

      {payments.length > 0 && (
        <p className="mt-4 text-center text-[11.5px] text-[#A1A1AA]">
          Showing {visible.length} of {payments.length} transactions
        </p>
      )}
    </div>
  );
}
