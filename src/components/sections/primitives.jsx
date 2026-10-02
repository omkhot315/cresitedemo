import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useBiz } from "../business/bizContext.js";
import { withAlpha, initials } from "../../utils/businessUtils.js";

/* Scroll-in reveal used across all business sections */
export function Reveal({ children, delay = 0, y = 26, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Consistent container + vertical rhythm for standard sections */
export function SectionShell({ id, tone = "base", className = "", children }) {
  const { skin } = useBiz();
  return (
    <section
      id={id}
      className={`relative ${className}`}
      style={{
        background: tone === "alt" ? withAlpha(skin.theme.muted, 0.055) : undefined,
        scrollMarginTop: 92,
      }}
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">{children}</div>
    </section>
  );
}

export function Kicker({ children, withLines = false, color }) {
  const { skin } = useBiz();
  const line = <span className="hidden h-px w-7 sm:inline-block" style={{ background: "currentColor", opacity: 0.7 }} />;
  return (
    <span
      className="inline-flex items-center gap-2.5 text-[11px] sm:text-xs"
      style={{
        color: color || skin.theme.primary,
        letterSpacing: skin.kicker.spacing,
        textTransform: skin.kicker.transform,
        fontWeight: skin.kicker.weight,
      }}
    >
      {withLines && line}
      {children}
      {withLines && line}
    </span>
  );
}

/** Section heading driven by the template registry copy (overridable). */
export function SectionHead({ id, align = "center", title, kicker, sub }) {
  const { meta, skin } = useBiz();
  const m = meta[id] || {};
  const k = kicker ?? m.kicker;
  const t = title ?? m.title;
  const s = sub ?? m.subtitle;
  return (
    <Reveal className={`mb-10 sm:mb-14 ${align === "center" ? "text-center" : "text-left"}`}>
      {k && <Kicker withLines={align === "center"}>{k}</Kicker>}
      {t && (
        <h2
          className="mt-3 text-balance"
          style={{
            fontFamily: skin.fonts.display,
            fontWeight: skin.heading.weight,
            letterSpacing: skin.heading.spacing,
            textTransform: skin.heading.transform,
            fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)",
            lineHeight: 1.12,
          }}
        >
          {t}
        </h2>
      )}
      {s && (
        <p
          className={`mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)] ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {s}
        </p>
      )}
    </Reveal>
  );
}

export function Stars({ n = 5, size = 14, className = "" }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < n ? "fill-amber-400 text-amber-400" : "text-[var(--line)]"} />
      ))}
    </div>
  );
}

export function InitialAvatar({ name = "", size = 44 }) {
  const { skin } = useBiz();
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold"
      style={{
        width: size,
        height: size,
        background: withAlpha(skin.theme.primary, 0.14),
        color: skin.theme.primary,
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </span>
  );
}

/** Theme-aware button — variants adapt to the active template family. */
export function BizButton({
  href,
  onClick,
  icon: Icon,
  children,
  variant = "solid",
  className = "",
  target,
  small = false,
}) {
  const { skin, preview } = useBiz();
  const radius = skin.button === "pill" ? 999 : skin.button === "sharp" ? 6 : 14;
  const styles = {
    solid: { background: "var(--p)", color: "var(--onp)" },
    accent: { background: "var(--a)", color: "var(--ona)" },
    inverted: { background: "var(--onp)", color: "var(--p)" },
    outline: { border: "1.5px solid var(--line)", color: "var(--ink)", background: "transparent" },
    ghost: { background: withAlpha(skin.theme.ink, 0.06), color: "var(--ink)" },
    light: { background: "rgba(255,255,255,0.94)", color: "#151515" },
    "outline-light": { border: "1.5px solid rgba(255,255,255,0.55)", color: "#fff", background: "transparent" },
    whatsapp: { background: "#25D366", color: "#fff" },
  };
  const cls = `inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${
    small ? "px-4 py-2 text-[13px]" : "px-6 py-3.5 text-sm"
  } ${className}`;
  const st = { ...styles[variant], borderRadius: radius };
  const handle = (e) => {
    if (preview && href?.startsWith("#")) e.preventDefault();
    onClick?.(e);
  };
  if (href) {
    return (
      <a href={href} target={target} rel={target === "_blank" ? "noreferrer" : undefined} onClick={handle} className={cls} style={st}>
        {Icon && <Icon size={16} strokeWidth={2.5} />}
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={handle} className={cls} style={st}>
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      {children}
    </button>
  );
}
