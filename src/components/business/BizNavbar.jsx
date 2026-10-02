import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { useBiz } from "./bizContext.js";
import { initials, telLink, withAlpha } from "../../utils/businessUtils.js";
import { BizButton } from "../sections/primitives.jsx";

/**
 * Theme-aware navigation.
 *  - "floating": rounded pill that glides over the hero (clinic, cafe, salon…)
 *  - "bar":      full-width cinematic bar (gym, restaurant)
 * Respects the business's section list and brand colours automatically.
 */
export default function BizNavbar() {
  const { business, skin, meta, order, preview } = useBiz();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (preview) return undefined;
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [preview]);

  const links = order.map((id) => ({ id, ...(meta[id] || {}) })).filter((s) => s.nav).slice(0, 7);
  const solid = scrolled || preview;
  const floating = skin.navVariant === "floating";
  const ctaTarget = `#${skin.ctaTarget || "contact"}`;
  const prevent = (e) => preview && e.preventDefault();

  const Brand = (
    <a href="#hero" onClick={prevent} className="flex items-center gap-2.5">
      {business.logo ? (
        <img src={business.logo} alt={business.name} className="h-9 w-9 rounded-full object-cover" />
      ) : (
        <span
          className="grid h-9 w-9 place-items-center text-[13px] font-bold"
          style={{
            background: "var(--p)",
            color: "var(--onp)",
            borderRadius: skin.button === "pill" ? 999 : skin.button === "sharp" ? 6 : 12,
            fontFamily: skin.fonts.display,
          }}
        >
          {initials(business.name) || "B"}
        </span>
      )}
      <span
        className="max-w-[150px] truncate text-[15px] font-bold tracking-tight sm:max-w-[220px]"
        style={{ fontFamily: skin.fonts.display }}
      >
        {business.name}
      </span>
    </a>
  );

  const NavLinks = ({ className = "", onNavigate }) => (
    <nav className={className}>
      {links.map((l) => (
        <a
          key={l.id}
          href={`#${l.id}`}
          onClick={(e) => {
            prevent(e);
            onNavigate?.();
          }}
          className="rounded-full px-3 py-1.5 text-[13.5px] font-medium text-[var(--ink)] opacity-80 transition hover:bg-[var(--line)] hover:opacity-100"
        >
          {l.nav}
        </a>
      ))}
    </nav>
  );

  return (
    <header className={preview ? "sticky top-0 z-40" : "fixed inset-x-0 top-0 z-50"}>
      <div className={floating ? "mx-auto max-w-6xl px-4 pt-3 sm:px-6" : ""}>
        <div
          className={`flex items-center justify-between gap-3 transition-all duration-300 ${
            floating ? "rounded-full px-4 py-2.5 sm:px-5" : "mx-auto max-w-7xl px-5 py-3.5 sm:px-8"
          }`}
          style={{
            background: solid
              ? withAlpha(skin.theme.card || skin.theme.bg, floating ? 0.9 : 0.94)
              : floating
              ? withAlpha(skin.theme.card || skin.theme.bg, 0.55)
              : "transparent",
            backdropFilter: solid || floating ? "blur(14px)" : "none",
            WebkitBackdropFilter: solid || floating ? "blur(14px)" : "none",
            border: floating ? `1px solid ${withAlpha(skin.theme.line || skin.theme.muted, 0.6)}` : "none",
            borderBottom: !floating && solid ? `1px solid ${skin.theme.line}` : undefined,
            boxShadow: solid && floating ? "0 12px 40px -18px rgba(0,0,0,0.35)" : "none",
          }}
        >
          {Brand}

          <NavLinks className="hidden items-center gap-0.5 lg:flex" />

          <div className="flex items-center gap-2">
            {business.contact?.phone && (
              <a
                href={telLink(business.contact.phone)}
                className="hidden h-9 w-9 place-items-center rounded-full border transition hover:scale-105 sm:grid"
                style={{ borderColor: "var(--line)", color: "var(--p)" }}
                aria-label="Call"
              >
                <Phone size={15} />
              </a>
            )}
            <BizButton href={ctaTarget} small className="hidden md:inline-flex">
              {skin.ctaLabel}
            </BizButton>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border lg:hidden"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
              aria-label="Menu"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="mx-4 mt-2 max-h-[calc(100svh-6.5rem)] overflow-y-auto rounded-2xl border p-3 shadow-2xl lg:hidden"
            style={{ background: "var(--card)", borderColor: "var(--line)" }}
          >
            <nav className="flex flex-col">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => {
                    prevent(e);
                    setOpen(false);
                  }}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium transition hover:bg-[var(--line)]"
                >
                  {l.nav}
                </a>
              ))}
            </nav>
            <div className="mt-2 border-t px-1 pt-3" style={{ borderColor: "var(--line)" }}>
              <BizButton href={ctaTarget} className="w-full">
                {skin.ctaLabel}
              </BizButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
