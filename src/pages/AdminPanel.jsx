import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Globe, ShieldCheck, Trash2, Check, Eye, Pencil, Crown, UserCog, Database,
  UserPlus, X, BadgeCheck, Lock, CalendarDays, TrendingUp, ChevronDown, Trophy,
  Clock, BarChart3, ListFilter, FilePlus, Inbox, Phone, Mail, RefreshCw, Wallet,
} from "lucide-react";
import PlatformNav from "../components/common/PlatformNav.jsx";
import { useAuth } from "../store/AuthContext.jsx";
import { useBusinesses } from "../store/BusinessContext.jsx";
import { authApi, ROLE_META } from "../services/authApi.js";
import { getLeads, getLeadStats, toggleLeadRead, deleteLead, flushLeadQueue, queuedLeadCount } from "../services/leadApi.js";
import PaymentHistory from "../components/dashboard/PaymentHistory.jsx";
import { getCategory } from "../data/categories.js";
import { templateForCategory } from "../templates/registry.js";
import { withAlpha, PLATFORM_URL } from "../utils/businessUtils.js";

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-black/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

/* ------------------------------- helpers -------------------------------- */
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const fmtShort = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "—";

/** "today" / "3 days ago" / "2 months ago" */
function fmtAgo(d) {
  if (!d) return "never";
  const diff = Date.now() - new Date(d).getTime();
  const day = 86400000;
  if (diff < day) return "today";
  const days = Math.floor(diff / day);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

/** Stable identity for a creator across sites + accounts. */
const creatorKeyOf = (b) =>
  (b.createdByEmail || b.ownerEmail || "unassigned").toLowerCase();

const avatarClass = (role) =>
  role === "superadmin"
    ? "bg-gradient-to-br from-[#7C3AED] to-[#A855F7]"
    : role === "admin"
    ? "bg-gradient-to-br from-[#5046E5] to-[#8B5CF6]"
    : "bg-[#101014]";

/* -------------------------------- atoms --------------------------------- */
function StatCard({ icon: Icon, label, value, sub, tint = "indigo" }) {
  const tints = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tints[tint]}`}>
        <Icon size={19} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-xl font-bold leading-none">{value}</p>
        <p className="mt-1 truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[#77777F]">{label}</p>
        {sub && <p className="mt-0.5 truncate text-[11px] text-[#A1A1AA]">{sub}</p>}
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const meta = ROLE_META[role] || ROLE_META.owner;
  const Icon = role === "superadmin" ? Crown : role === "admin" ? ShieldCheck : UserCog;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider ${meta.tint}`}>
      <Icon size={11} /> {meta.short}
    </span>
  );
}

/** Super-admin-only form for provisioning a new admin or owner. */
function AddUserForm({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (p) => setForm((f) => ({ ...f, ...p }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await onCreate(form);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setForm({ name: "", email: "", password: "", role: "admin" });
    setOpen(false);
    return null;
  };

  return (
    <div className="rounded-3xl border border-violet-200 bg-violet-50/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-display text-[15px] font-bold">
            <UserPlus size={16} className="text-violet-600" /> Provision an account
          </p>
          <p className="mt-1 text-[12.5px] text-[#55555E]">
            As super admin you provision admins and can also create owner accounts; public sign-up creates owners only.
          </p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-[#101014] px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#5046E5]"
        >
          {open ? <X size={14} /> : <UserPlus size={14} />}
          {open ? "Cancel" : "Add account"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            onSubmit={submit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid gap-4 rounded-2xl border border-violet-200 bg-white p-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">Full name</span>
                <input className={inputCls} value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Anita Desai" required />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">Email</span>
                <input type="email" className={inputCls} value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="anita@cresite.in" required />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">Password</span>
                <input type="text" className={inputCls} value={form.password} onChange={(e) => set({ password: e.target.value })} placeholder="At least 6 characters" minLength={6} required />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">Role</span>
                <select className={inputCls} value={form.role} onChange={(e) => set({ role: e.target.value })}>
                  <option value="admin">Admin — manages their own websites</option>
                  <option value="owner">Owner — manages their own websites</option>
                </select>
              </label>
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] font-semibold text-red-600 sm:col-span-2">{error}</p>
              )}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5046E5] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA] disabled:opacity-60"
                >
                  {busy ? "Creating…" : "Create account"} <BadgeCheck size={15} />
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Per-creator analytics card: how many websites this account built, how many
 * are live vs draft, when they started, when they last shipped, which
 * categories they work in, and the full list of their sites.
 */
function CreatorCard({ creator, rank, totalSites, isYou, onOpenSites }) {
  const [open, setOpen] = useState(false);
  const share = totalSites ? Math.round((creator.total / totalSites) * 100) : 0;

  return (
    <article className="overflow-hidden rounded-3xl border border-black/10 bg-white">
      {/* header */}
      <div className="flex flex-wrap items-start gap-4 p-5">
        <span className="relative shrink-0">
          <span className={`grid h-12 w-12 place-items-center rounded-2xl text-[15px] font-bold text-white ${avatarClass(creator.role)}`}>
            {(creator.name || "?").slice(0, 2).toUpperCase()}
          </span>
          {rank <= 3 && creator.total > 0 && (
            <span
              className={`absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold text-white ring-2 ring-white ${
                rank === 1 ? "bg-amber-500" : rank === 2 ? "bg-slate-400" : "bg-amber-700"
              }`}
            >
              {rank}
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-display text-[16px] font-bold">{creator.name || "Unassigned"}</p>
            {creator.role && <RoleBadge role={creator.role} />}
            {isYou && <span className="text-[11px] font-semibold text-[#A1A1AA]">(you)</span>}
          </div>
          <p className="mt-0.5 truncate font-mono text-[11.5px] text-[#77777F]">{creator.email || "—"}</p>
        </div>

        <div className="text-right">
          <p className="font-display text-3xl font-bold leading-none text-[#5046E5]">{creator.total}</p>
          <p className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">
            website{creator.total === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* share bar */}
      <div className="px-5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#77777F]">
          <span>{share}% of all websites</span>
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {creator.live} live
            </span>
            <span className="inline-flex items-center gap-1 text-[#A1A1AA]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C4C4CC]" /> {creator.drafts} draft
            </span>
          </span>
        </div>
        <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-black/5">
          <div className="bg-emerald-500 transition-all" style={{ width: `${creator.total ? (creator.live / creator.total) * 100 : 0}%` }} />
          <div className="bg-[#C4C4CC] transition-all" style={{ width: `${creator.total ? (creator.drafts / creator.total) * 100 : 0}%` }} />
        </div>
      </div>

      {/* meta grid */}
      <div className="mt-4 grid grid-cols-2 gap-px border-y border-black/5 bg-black/5 sm:grid-cols-4">
        {[
          { icon: FilePlus, label: "First site", value: fmtShort(creator.first) },
          { icon: CalendarDays, label: "Latest site", value: fmtShort(creator.last) },
          { icon: Clock, label: "Last activity", value: fmtAgo(creator.last) },
          { icon: BarChart3, label: "Categories", value: creator.categories.size || 0 },
        ].map((m) => (
          <div key={m.label} className="bg-white px-4 py-3">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#A1A1AA]">
              <m.icon size={11} /> {m.label}
            </p>
            <p className="mt-1 truncate text-[12.5px] font-bold">{m.value}</p>
          </div>
        ))}
      </div>

      {/* categories */}
      {creator.categories.size > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pt-4">
          {[...creator.categories].slice(0, 6).map((c) => {
            const cat = getCategory(c);
            const tpl = templateForCategory(c);
            return (
              <span
                key={c}
                className="rounded-full px-2.5 py-1 text-[10.5px] font-bold"
                style={{ background: withAlpha(tpl.theme.primary, 0.12), color: tpl.theme.primary }}
              >
                {cat.label}
              </span>
            );
          })}
          {creator.categories.size > 6 && (
            <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10.5px] font-bold text-[#77777F]">
              +{creator.categories.size - 6}
            </span>
          )}
        </div>
      )}

      {/* site list toggle */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        {creator.total > 0 ? (
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#5046E5] transition hover:text-[#4338CA]"
          >
            <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            {open ? "Hide" : "Show"} their {creator.total} website{creator.total === 1 ? "" : "s"}
          </button>
        ) : (
          <span className="text-[12.5px] font-semibold text-[#A1A1AA]">No websites created yet</span>
        )}
        {creator.total > 0 && (
          <button
            onClick={() => onOpenSites(creator.key)}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3.5 py-1.5 text-[11.5px] font-bold transition hover:border-indigo-400 hover:text-indigo-600"
          >
            <ListFilter size={12} /> Filter sites
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="divide-y divide-black/5 border-t border-black/5">
              {creator.sites.map((b) => (
                <li key={b.slug} className="flex items-center gap-3 px-5 py-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${b.published ? "bg-emerald-500" : "bg-[#C4C4CC]"}`}
                    title={b.published ? "Live" : "Draft"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold">{b.name}</p>
                    <p className="truncate font-mono text-[11px] text-[#77777F]">
                      {PLATFORM_URL}/{b.slug}
                    </p>
                  </div>
                  <span className="hidden shrink-0 text-[11px] font-semibold text-[#A1A1AA] sm:block">
                    {getCategory(b.category).label}
                  </span>
                  {b.paymentExempt || b.createdByRole === "superadmin" ? (
                    <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      free
                    </span>
                  ) : b.plan ? (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        b.plan === "domain"
                          ? "bg-indigo-100 text-indigo-700"
                          : b.plan === "custom"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-black/5 text-[#55555E]"
                      }`}
                    >
                      {b.plan === "domain" ? "₹2,999" : b.plan === "custom" ? "custom" : "₹9"}
                    </span>
                  ) : null}
                  <span className="shrink-0 text-[11px] font-semibold text-[#A1A1AA]">{fmtShort(b.createdAt)}</span>
                  <Link
                    to={`/business/${b.slug}/edit`}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-black/10 text-[#55555E] transition hover:border-indigo-400 hover:text-indigo-600"
                    aria-label={`Edit ${b.name}`}
                  >
                    <Pencil size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

/** /admin — platform control room, exclusively for the super admin. */
export default function AdminPanel() {
  const { user, isSuperAdmin, canManageUsers, createUser, updateUserRole, deleteUser } = useAuth();
  const { myList, deleteBusiness, togglePublished, resetDemo } = useBusinesses();
  /* Sites are private to their creator — only the super admin sees them all. */
  const visibleSites = myList;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState("creators");
  /* Contact-form enquiries submitted from the hosted websites. */
  const [leads, setLeads] = useState([]);
  const [leadStats, setLeadStats] = useState({ total: 0, unread: 0, today: 0, websites: 0 });
  const [leadFilter, setLeadFilter] = useState("all");
  const [creatorFilter, setCreatorFilter] = useState("all");

  const notify = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2600);
  };

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await authApi.listUsers());
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  /** Load contact-form enquiries from every hosted website. */
  const loadLeads = async () => {
    try {
      const [list, stats] = await Promise.all([getLeads({ limit: 200 }), getLeadStats()]);
      setLeads(list);
      setLeadStats(stats);
    } catch {
      setLeads([]);
    }
  };

  useEffect(() => {
    load();
    loadLeads();
    /* Try to deliver any enquiries captured while the API was unreachable. */
    flushLeadQueue().then((sent) => {
      if (sent > 0) loadLeads();
    });
  }, []);

  const onCreate = async (payload) => {
    const res = await createUser(payload);
    if (res.ok) {
      notify(`${res.user.name} added as ${res.user.role}`);
      load();
    }
    return res;
  };

  const changeRole = async (u, role) => {
    const res = await updateUserRole(u.id, role);
    notify(res.ok ? `${u.name} is now ${role === "admin" ? "an admin" : "an owner"}` : res.error);
    if (res.ok) load();
  };

  const removeUser = async (u) => {
    const res = await deleteUser(u.id);
    notify(res.ok ? `${u.name}'s account was removed` : res.error);
    if (res.ok) load();
  };

  /**
   * Group every website by the account that created it, so the super admin can
   * see at a glance that e.g. admin1 built 5 sites and admin2 built 7 — with
   * live/draft split, first & latest build dates and the categories they cover.
   */
  const creators = useMemo(() => {
    const map = new Map();

    const ensure = ({ key, name, email, role }) => {
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: name || "Unassigned",
          email: email || "",
          role: role || "",
          total: 0,
          live: 0,
          drafts: 0,
          categories: new Set(),
          first: null,
          last: null,
          sites: [],
        });
      }
      return map.get(key);
    };

    visibleSites.forEach((b) => {
      const entry = ensure({
        key: creatorKeyOf(b),
        name: b.createdByName || b.ownerName,
        email: b.createdByEmail || b.ownerEmail,
        role: b.createdByRole,
      });
      entry.total += 1;
      if (b.published) entry.live += 1;
      else entry.drafts += 1;
      if (b.category) entry.categories.add(b.category);
      const t = b.createdAt ? new Date(b.createdAt) : null;
      if (t && !Number.isNaN(t.getTime())) {
        if (!entry.first || t < entry.first) entry.first = t;
        if (!entry.last || t > entry.last) entry.last = t;
      }
      entry.sites.push(b);
    });

    /* Include provisioned accounts that haven't built anything yet. */
    users.forEach((u) => {
      const entry = ensure({ key: (u.email || u.id).toLowerCase(), name: u.name, email: u.email, role: u.role });
      if (!entry.role) entry.role = u.role;
      if (!entry.name || entry.name === "Unassigned") entry.name = u.name;
    });

    map.forEach((e) => e.sites.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));

    return [...map.values()].sort(
      (a, b) => b.total - a.total || (b.last || 0) - (a.last || 0) || a.name.localeCompare(b.name)
    );
  }, [visibleSites, users]);

  /* Platform-wide rollups */
  const stats = useMemo(() => {
    const live = visibleSites.filter((b) => b.published).length;
    const activeCreators = creators.filter((c) => c.total > 0);
    const top = activeCreators[0] || null;
    const thisMonth = visibleSites.filter((b) => {
      if (!b.createdAt) return false;
      const d = new Date(b.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return {
      live,
      drafts: visibleSites.length - live,
      activeCreators: activeCreators.length,
      top,
      thisMonth,
      avg: activeCreators.length ? (visibleSites.length / activeCreators.length).toFixed(1) : "0",
    };
  }, [visibleSites, creators]);

  const filteredSites = useMemo(
    () => (creatorFilter === "all" ? visibleSites : visibleSites.filter((b) => creatorKeyOf(b) === creatorFilter)),
    [visibleSites, creatorFilter]
  );

  const openSitesFor = (key) => {
    setCreatorFilter(key);
    setTab("sites");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statsFor = (u) => creators.find((c) => c.key === (u.email || "").toLowerCase());

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#101014]">
      <PlatformNav />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-violet-700">
              <Crown size={13} /> Super admin
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Platform control room</h1>
            <p className="mt-2 max-w-xl text-[14.5px] text-[#55555E]">
              Signed in as <span className="font-semibold text-[#101014]">{user?.email}</span>. Provision accounts,
              assign roles and track exactly who built what across the platform.
            </p>
          </div>
          <button
            onClick={async () => {
              const ok = await resetDemo();
              notify(ok ? "Demo businesses restored" : "Could not reseed");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 text-[13px] font-bold transition hover:border-black/30"
          >
            <Database size={14} /> Reseed demo data
          </button>
        </div>

        {/* ------------------------------- stats ------------------------------- */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard icon={Users} label="Accounts" value={users.length} sub={`${stats.activeCreators} actively building`} />
          <StatCard icon={Globe} label="Websites" value={visibleSites.length} tint="emerald" sub={`${stats.avg} avg per creator`} />
          <StatCard icon={Eye} label="Live" value={stats.live} tint="emerald" />
          <StatCard icon={Pencil} label="Drafts" value={stats.drafts} tint="slate" />
          <StatCard icon={TrendingUp} label="New this month" value={stats.thisMonth} tint="amber" />
          <StatCard
            icon={Inbox}
            label="Enquiries"
            value={leadStats.total}
            tint={leadStats.unread > 0 ? "violet" : "indigo"}
            sub={leadStats.unread > 0 ? `${leadStats.unread} unread · ${leadStats.today} today` : `${leadStats.websites} websites`}
          />
          <StatCard
            icon={Trophy}
            label="Top creator"
            value={stats.top ? stats.top.total : 0}
            tint="violet"
            sub={stats.top ? stats.top.name : "No websites yet"}
          />
        </div>

        {canManageUsers && (
          <div className="mt-8">
            <AddUserForm onCreate={onCreate} />
          </div>
        )}

        {/* tabs */}
        <div className="mt-9 flex w-fit max-w-full overflow-x-auto rounded-full bg-black/5 p-1">
          {[
            { id: "creators", label: "Who built what", icon: BarChart3 },
            { id: "leads", label: `Enquiries${leadStats.unread ? ` (${leadStats.unread})` : ""}`, icon: Inbox },
            { id: "payments", label: "Payments", icon: Wallet },
            { id: "users", label: "Accounts", icon: Users },
            { id: "sites", label: "All websites", icon: Globe },
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

        {/* --------------------------- who built what -------------------------- */}
        {/* ---------------------- contact-form enquiries ---------------------- */}
        {tab === "leads" && (
          <div>
            {/* filters */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-black/5 p-1">
                {[
                  { id: "all", label: `All (${leadStats.total})` },
                  { id: "unread", label: `Unread (${leadStats.unread})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setLeadFilter(f.id)}
                    className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition ${
                      leadFilter === f.id ? "bg-white shadow" : "text-[#77777F] hover:text-[#101014]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {queuedLeadCount() > 0 && (
                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[11.5px] font-bold text-amber-700">
                  {queuedLeadCount()} queued offline
                </span>
              )}
              <button
                onClick={loadLeads}
                className="ml-auto inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-[12px] font-bold transition hover:border-black/30"
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {/* list */}
            {leads.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-black/15 bg-white p-12 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-500">
                  <Inbox size={22} />
                </span>
                <p className="mt-4 font-display text-[16px] font-bold">No enquiries yet</p>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[#77777F]">
                  Every message submitted through a hosted website's contact form appears here.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {(leadFilter === "unread" ? leads.filter((l) => !l.read) : leads).map((lead) => (
                  <article
                    key={lead.id}
                    className={`rounded-3xl border bg-white p-5 transition ${
                      lead.read ? "border-black/10 opacity-75" : "border-indigo-300 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-display text-[15px] font-bold">{lead.name}</p>
                          {!lead.read && (
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-indigo-700">
                              New
                            </span>
                          )}
                          {lead.businessName && (
                            <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#55555E]">
                              {lead.businessName}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px]">
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
                              className="inline-flex items-center gap-1.5 font-semibold text-[#55555E] transition hover:text-indigo-600"
                            >
                              <Phone size={12} /> {lead.phone}
                            </a>
                          )}
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="inline-flex items-center gap-1.5 font-semibold text-[#55555E] transition hover:text-indigo-600"
                            >
                              <Mail size={12} /> {lead.email}
                            </a>
                          )}
                          <span className="text-[11.5px] text-[#A1A1AA]">
                            {fmtAgo(lead.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-[#25D366] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:opacity-90"
                          >
                            Reply
                          </a>
                        )}
                        <button
                          onClick={async () => {
                            const updated = await toggleLeadRead(lead.id, !lead.read);
                            setLeads((l) => l.map((x) => (x.id === lead.id ? { ...x, read: updated.read } : x)));
                            setLeadStats((s) => ({ ...s, unread: Math.max(0, s.unread + (lead.read ? 1 : -1)) }));
                          }}
                          className="rounded-full border border-black/15 px-3 py-1.5 text-[11px] font-bold transition hover:border-indigo-400 hover:text-indigo-600"
                        >
                          Mark {lead.read ? "unread" : "read"}
                        </button>
                        <button
                          onClick={async () => {
                            await deleteLead(lead.id);
                            setLeads((l) => l.filter((x) => x.id !== lead.id));
                            setLeadStats((s) => ({
                              ...s,
                              total: Math.max(0, s.total - 1),
                              unread: Math.max(0, s.unread - (lead.read ? 0 : 1)),
                            }));
                            notify("Enquiry deleted");
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-black/10 text-[#77777F] transition hover:border-red-400 hover:text-red-600"
                          aria-label="Delete enquiry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {lead.message && (
                      <p className="mt-3.5 whitespace-pre-line border-t border-black/5 pt-3.5 text-[13.5px] leading-relaxed text-[#55555E]">
                        {lead.message}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --------------------------- payment history -------------------------- */}
        {tab === "payments" && (
          <div className="mt-6">
            <PaymentHistory isSuperAdmin />
          </div>
        )}

        {tab === "creators" && (
          <>
            <p className="mt-6 text-[13px] text-[#55555E]">
              Every website is attributed to the account that created it. Ranked by number of websites built.
            </p>
            <div className="mt-4 grid gap-5 xl:grid-cols-2">
              {creators.map((c, i) => (
                <CreatorCard
                  key={c.key}
                  creator={c}
                  rank={i + 1}
                  totalSites={visibleSites.length}
                  isYou={c.email === user?.email}
                  onOpenSites={openSitesFor}
                />
              ))}
            </div>
            {creators.length === 0 && (
              <p className="mt-10 text-center text-[13.5px] text-[#77777F]">No accounts or websites yet.</p>
            )}
          </>
        )}

        {/* ------------------------------ accounts ----------------------------- */}
        {tab === "users" && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white">
            {loading ? (
              <div className="grid place-items-center py-16">
                <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-black/10 border-t-[#5046E5]" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left">
                  <thead>
                    <tr className="border-b border-black/10 bg-black/[0.02] text-[11px] font-bold uppercase tracking-[0.12em] text-[#77777F]">
                      <th className="px-5 py-3.5">Account</th>
                      <th className="px-5 py-3.5">Role</th>
                      <th className="px-5 py-3.5">Websites built</th>
                      <th className="px-5 py-3.5">Live / Draft</th>
                      <th className="px-5 py-3.5">Last created</th>
                      <th className="px-5 py-3.5 text-right">{canManageUsers ? "Actions" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const self = u.id === user?.id || u.email === user?.email;
                      const isSuper = u.role === "superadmin";
                      const s = statsFor(u);
                      const total = s?.total ?? u.websiteCount ?? 0;
                      return (
                        <tr key={u.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white ${avatarClass(u.role)}`}>
                                {u.name?.slice(0, 2).toUpperCase()}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-[13.5px] font-bold">
                                  {u.name} {self && <span className="text-[11px] font-semibold text-[#A1A1AA]">(you)</span>}
                                </p>
                                <p className="truncate font-mono text-[11.5px] text-[#77777F]">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <RoleBadge role={u.role} />
                          </td>
                          <td className="px-5 py-4">
                            {total > 0 ? (
                              <button
                                onClick={() => openSitesFor((u.email || "").toLowerCase())}
                                className="inline-flex items-center gap-1.5 font-display text-[15px] font-bold text-[#5046E5] transition hover:underline"
                              >
                                {total}
                                <span className="text-[11px] font-semibold text-[#A1A1AA]">
                                  site{total === 1 ? "" : "s"}
                                </span>
                              </button>
                            ) : (
                              <span className="text-[13px] font-semibold text-[#A1A1AA]">0</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold">
                              <span className="inline-flex items-center gap-1 text-emerald-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {s?.live ?? 0}
                              </span>
                              <span className="text-[#D4D4D8]">/</span>
                              <span className="inline-flex items-center gap-1 text-[#77777F]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#C4C4CC]" />
                                {s?.drafts ?? 0}
                              </span>
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-[12.5px] font-semibold">{fmtDate(s?.last)}</p>
                            <p className="text-[11px] text-[#A1A1AA]">{fmtAgo(s?.last)}</p>
                          </td>
                          <td className="px-5 py-4">
                            {canManageUsers && !isSuper ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => changeRole(u, u.role === "admin" ? "owner" : "admin")}
                                  className="rounded-full border border-black/15 px-3.5 py-1.5 text-[12px] font-bold transition hover:border-indigo-400 hover:text-indigo-600"
                                >
                                  {u.role === "admin" ? "Make owner" : "Make admin"}
                                </button>
                                <button
                                  onClick={() => removeUser(u)}
                                  disabled={self}
                                  className="grid h-8 w-8 place-items-center rounded-lg border border-black/10 text-[#77777F] transition hover:border-red-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                  aria-label="Delete account"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-end">
                                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#A1A1AA]">
                                  <Lock size={12} /> {isSuper ? "Protected" : "Super admin only"}
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------- all websites --------------------------- */}
        {tab === "sites" && (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[#77777F]">
                <ListFilter size={14} /> Creator
              </label>
              <select
                value={creatorFilter}
                onChange={(e) => setCreatorFilter(e.target.value)}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold outline-none transition focus:border-indigo-500"
              >
                <option value="all">All creators ({visibleSites.length})</option>
                {creators
                  .filter((c) => c.total > 0)
                  .map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.name} — {c.total} site{c.total === 1 ? "" : "s"}
                    </option>
                  ))}
              </select>
              {creatorFilter !== "all" && (
                <button
                  onClick={() => setCreatorFilter("all")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3.5 py-1.5 text-[12px] font-bold transition hover:border-black/30"
                >
                  <X size={12} /> Clear filter
                </button>
              )}
              <span className="ml-auto text-[12.5px] font-semibold text-[#77777F]">
                Showing {filteredSites.length} of {visibleSites.length}
              </span>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSites.map((b) => {
                const tpl = templateForCategory(b.category);
                const cat = getCategory(b.category);
                /* Immutable audit trail, falling back to current owner for older records. */
                const creator = {
                  name: b.createdByName || b.ownerName || "",
                  email: b.createdByEmail || b.ownerEmail || "",
                  role: b.createdByRole || "",
                };
                return (
                  <article key={b.slug} className="overflow-hidden rounded-3xl border border-black/10 bg-white">
                    <div className="flex items-center justify-between gap-2 px-5 py-4">
                      <div className="min-w-0">
                        <p className="truncate font-display text-[15.5px] font-bold">{b.name}</p>
                        <p className="mt-1 truncate font-mono text-[11.5px] text-[#77777F]">
                          {PLATFORM_URL}/{b.slug}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: withAlpha(tpl.theme.primary, 0.12), color: tpl.theme.primary }}
                      >
                        {cat.label}
                      </span>
                    </div>

                    {/* creator attribution */}
                    <div className="border-t border-black/5 bg-black/[0.02] px-5 py-3">
                      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#A1A1AA]">Created by</p>
                      <div className="mt-1.5 flex items-center gap-2.5">
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ${avatarClass(creator.role)}`}>
                          {(creator.name || "?").slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-[12.5px] font-bold">{creator.name || "Unassigned"}</p>
                            {creator.role && <RoleBadge role={creator.role} />}
                          </div>
                          {creator.email && <p className="truncate font-mono text-[11px] text-[#77777F]">{creator.email}</p>}
                        </div>
                      </div>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-black/5 pt-2.5 text-[11px] text-[#77777F]">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={11} /> Created {fmtDate(b.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={11} /> {fmtAgo(b.createdAt)}
                        </span>
                        {b.updatedAt && b.updatedAt !== b.createdAt && (
                          <span className="inline-flex items-center gap-1.5">
                            <Pencil size={11} /> Edited {fmtAgo(b.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-black/5 px-5 py-3.5">
                      <span className="truncate text-[11px] font-semibold text-[#A1A1AA]">
                        {b.ownerEmail && b.ownerEmail !== creator.email ? `Owned by ${b.ownerEmail}` : "Owner"}
                      </span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          onClick={() => togglePublished(b.slug)}
                          className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                            b.published ? "bg-emerald-100 text-emerald-700" : "bg-black/5 text-[#77777F]"
                          }`}
                        >
                          {b.published ? "Live" : "Draft"}
                        </button>
                        <a
                          href={b.published ? `/${b.slug}` : `/${b.slug}?preview=1`}
                          target="_blank"
                          rel="noreferrer"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-black/10 text-[#55555E] transition hover:border-indigo-400 hover:text-indigo-600"
                        >
                          <Eye size={14} />
                        </a>
                        <Link
                          to={`/business/${b.slug}/edit`}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-black/10 text-[#55555E] transition hover:border-indigo-400 hover:text-indigo-600"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => {
                            deleteBusiness(b.slug);
                            notify(`"${b.name}" deleted`);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-black/10 text-[#55555E] transition hover:border-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredSites.length === 0 && (
              <p className="mt-10 text-center text-[13.5px] text-[#77777F]">No websites match this filter.</p>
            )}
          </>
        )}
      </main>

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
