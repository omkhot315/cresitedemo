import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layers, Menu, X, ArrowRight, LogOut, LayoutDashboard, Crown, ChevronDown, User } from "lucide-react";
import { useAuth } from "../../store/AuthContext.jsx";
import { ROLE_META } from "../../services/authApi.js";

const LINKS = [
  { label: "Categories", hash: "#categories" },
  { label: "Features", hash: "#features" },
  { label: "How it works", hash: "#how" },
  { label: "Examples", hash: "#examples" },
  { label: "Pricing", hash: "#pricing" },
  { label: "FAQ", hash: "#faq" },
];

export function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      {/*
        CRESITE PNG LOGO
        ----------------
        1. Put your transparent PNG at: public/images/cresite-logo.png
        2. Uncomment the <img> below.
        3. Comment out the fallback icon + "Cresite" text underneath.

        BrandMark is shared by the navbar, homepage footer and mobile login,
        so changing it here updates every platform brand placement.

        <img
          src="/images/cresite-logo.png"
          alt="Cresite"
          className="h-10 w-auto max-w-[180px] object-contain"
        />
      */}

      {/* Fallback brand mark — comment out these two spans after enabling the PNG logo. */}
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#5046E5] to-[#8B5CF6] text-white shadow-lg shadow-indigo-500/25">
        <Layers size={16} strokeWidth={2.4} />
      </span>
      <span className="font-display text-[17px] font-bold tracking-tight text-[#101014]">Cresite</span>
    </Link>
  );
}

/** Avatar + dropdown for the signed-in account. */
function UserMenu({ user, isAdmin, isSuperAdmin, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const roleMeta = ROLE_META[user.role] || ROLE_META.owner;

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-black/10 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-black/25"
      >
        <span
          className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold text-white ${
            isSuperAdmin
              ? "bg-gradient-to-br from-[#7C3AED] to-[#A855F7]"
              : isAdmin
              ? "bg-gradient-to-br from-[#5046E5] to-[#8B5CF6]"
              : "bg-[#101014]"
          }`}
        >
          {user.name?.slice(0, 2).toUpperCase()}
        </span>
        <span className="hidden max-w-[110px] truncate text-[13px] font-semibold sm:block">{user.name}</span>
        <ChevronDown size={13} className={`text-black/40 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
          <div className="border-b border-black/5 px-4 py-3.5">
            <p className="truncate text-[13.5px] font-bold">{user.name}</p>
            <p className="truncate font-mono text-[11.5px] text-[#77777F]">{user.email}</p>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleMeta.tint}`}
            >
              {isSuperAdmin ? <Crown size={10} /> : <User size={10} />} {roleMeta.label}
            </span>
          </div>
          <div className="p-1.5">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-[#3F3F46] transition hover:bg-black/5"
            >
              <LayoutDashboard size={15} /> My websites
            </Link>
            {isSuperAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                <Crown size={15} /> Control room
              </Link>
            )}
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Shared navigation for all platform pages. */
export default function PlatformNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthed, isAdmin, isSuperAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href = (hash) => (pathname === "/" ? hash : `/${hash}`);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "bg-white/85 shadow-[0_1px_0_rgba(16,16,20,0.07)] backdrop-blur-xl" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <BrandMark />

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.hash}
              href={href(l.hash)}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-[#3F3F46] transition hover:bg-black/5 hover:text-black"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <>
              <Link
                to="/create"
                className="group hidden items-center gap-1.5 rounded-full bg-[#101014] px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#5046E5] sm:inline-flex"
              >
                Create Website
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <UserMenu user={user} isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-2 text-[13.5px] font-semibold text-[#3F3F46] transition hover:bg-black/5 sm:block"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="group inline-flex items-center gap-1.5 rounded-full bg-[#101014] px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#5046E5] sm:px-5"
              >
                Get Started Free
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-black/5 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col">
            {LINKS.map((l) => (
              <a
                key={l.hash}
                href={href(l.hash)}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-[15px] font-medium text-[#3F3F46] transition hover:bg-black/5"
              >
                {l.label}
              </a>
            ))}
            <div className="my-2 border-t border-black/5" />
            {isAuthed ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-[15px] font-semibold text-[#5046E5] transition hover:bg-indigo-50">
                  My websites
                </Link>
                {isSuperAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-[15px] font-semibold text-[#5046E5] transition hover:bg-indigo-50">
                    Control room
                  </Link>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-[15px] font-semibold text-[#5046E5] transition hover:bg-indigo-50">
                  Create a free account
                </Link>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-[15px] font-semibold text-[#3F3F46] transition hover:bg-black/5">
                  Sign in
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
