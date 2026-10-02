import { motion } from "framer-motion";
import { Phone, MapPin, Clock, ArrowDown, MessageCircle } from "lucide-react";
import { useBiz } from "../business/bizContext.js";
import { BizButton, Stars, Kicker } from "./primitives.jsx";
import BizIcon from "../common/BizIcon.jsx";
import { getCategory, categoryLabel } from "../../data/categories.js";
import { telLink, waLink, withAlpha } from "../../utils/businessUtils.js";

const ease = [0.22, 1, 0.36, 1];

function useExcerpt() {
  const { business } = useBiz();
  const a = business.about || "";
  if (!a) return business.tagline || "";
  return a.length > 175 ? `${a.slice(0, 172).trimEnd()}…` : a;
}

function cityOf(business) {
  const parts = (business.contact?.address || "").split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0] || "";
}

/* ---------------- Split hero (clinic / professional) ---------------- */
function SplitHero() {
  const { business, skin } = useBiz();
  const cat = getCategory(business.category);
  const excerpt = useExcerpt();
  const wa = business.contact?.whatsapp || business.contact?.phone;

  return (
    <section id="hero" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -left-40 top-16 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{ background: withAlpha(skin.theme.primary, 0.14) }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[22rem] w-[22rem] rounded-full blur-3xl"
        style={{ background: withAlpha(skin.theme.accent, 0.12) }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-28 sm:px-8 sm:pt-36 lg:grid-cols-2 lg:gap-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase"
            style={{
              borderColor: withAlpha(skin.theme.primary, 0.35),
              background: withAlpha(skin.theme.primary, 0.07),
              color: skin.theme.primary,
              letterSpacing: "0.14em",
            }}
          >
            <BizIcon name={cat.icon} size={13} />
            {cat.label}
          </span>

          <h1
            className="mt-5 text-balance"
            style={{
              fontFamily: skin.fonts.display,
              fontWeight: skin.heading.weight,
              letterSpacing: skin.heading.spacing,
              fontSize: "clamp(2.5rem, 5.4vw, 4.1rem)",
              lineHeight: 1.05,
            }}
          >
            {business.tagline || business.name}
          </h1>

          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-[var(--muted)]">{excerpt}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BizButton href={`#${skin.ctaTarget || "contact"}`} className="w-full min-[400px]:w-auto">
              {skin.ctaLabel}
            </BizButton>
            {business.contact?.phone && (
              <BizButton href={telLink(business.contact.phone)} icon={Phone} variant="outline" className="w-full min-[400px]:w-auto">
                Call Now
              </BizButton>
            )}
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-[var(--muted)]">
            <Stars n={5} />
            <span className="font-medium text-[var(--ink)]">
              {business.stats?.find((s) => /rating/i.test(s.label))?.value || "5.0"}
            </span>
            <span>— rated by the people who matter most, our customers.</span>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease }}
        >
          <div
            className="absolute -right-4 -top-4 h-full w-full"
            style={{ borderRadius: "var(--r)", background: withAlpha(skin.theme.primary, 0.12) }}
          />
          {business.heroImage ? (
            <img
              src={business.heroImage}
              alt={business.name}
              className="relative aspect-[5/4] w-full object-cover shadow-2xl sm:aspect-[5/5] lg:aspect-[4/5]"
              style={{ borderRadius: "var(--r)" }}
            />
          ) : (
            <div
              className="relative grid aspect-[5/4] w-full place-items-center sm:aspect-[5/5] lg:aspect-[4/5]"
              style={{ borderRadius: "var(--r)", background: `linear-gradient(135deg, ${withAlpha(skin.theme.primary, 0.16)}, ${withAlpha(skin.theme.accent, 0.2)})` }}
            >
              <span style={{ fontFamily: skin.fonts.display, fontSize: "5rem", fontWeight: 800, color: withAlpha(skin.theme.primary, 0.5) }}>
                {business.name?.[0] || "B"}
              </span>
            </div>
          )}

          {business.hours?.[0] && (
            <motion.div
              className="absolute left-2 top-6 hidden rounded-2xl border bg-[var(--card)] px-4 py-3 shadow-xl sm:-left-3 sm:top-8 sm:block"
              style={{ borderColor: "var(--line)" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: withAlpha(skin.theme.primary, 0.12), color: "var(--p)" }}>
                  <Clock size={16} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Open today</p>
                  <p className="text-[12.5px] font-semibold">{business.hours[0].time}</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            className="absolute right-2 bottom-6 rounded-2xl border bg-[var(--card)] px-4 py-3 shadow-xl sm:-right-4 sm:bottom-8"
            style={{ borderColor: "var(--line)" }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Stars n={5} size={13} />
            <p className="mt-1.5 text-[12.5px] font-semibold">
              {business.stats?.[0]?.value} {business.stats?.[0]?.label || "happy customers"}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Full-bleed cinematic hero (gym / restaurant) ---------------- */
function FullHero() {
  const { business, skin } = useBiz();
  const excerpt = useExcerpt();
  const city = cityOf(business);

  return (
    <section id="hero" className="relative flex min-h-[max(600px,96svh)] items-end overflow-hidden">
      {business.heroImage && (
        <motion.img
          src={business.heroImage}
          alt={business.name}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${withAlpha(skin.theme.secondary, 0.55)} 0%, rgba(0,0,0,0.25) 42%, ${withAlpha(skin.theme.secondary, 0.94)} 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, ${withAlpha(skin.theme.secondary, 0.6)} 0%, transparent 60%)` }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-44 sm:px-8 sm:pb-20">
        <motion.div initial={{ opacity: 0, y: 44 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
          <span
            className="inline-flex items-center gap-2.5 text-xs font-semibold text-white"
            style={{ letterSpacing: skin.kicker.spacing, textTransform: "uppercase" }}
          >
            <span className="h-px w-9" style={{ background: "var(--p)" }} />
            <span style={{ color: "var(--p)" }}>{business.name}</span>
            {city && <span className="text-white/70">· {city}</span>}
          </span>

          <h1
            className="mt-4 max-w-4xl text-balance text-white"
            style={{
              fontFamily: skin.fonts.display,
              fontWeight: skin.heading.weight,
              letterSpacing: skin.heading.spacing,
              textTransform: skin.heading.transform,
              fontSize: "clamp(2.6rem, 7vw, 5.4rem)",
              lineHeight: 1.02,
            }}
          >
            {business.tagline || categoryLabel(business.category)}
          </h1>

          <p className="mt-5 hidden max-w-lg text-[15.5px] leading-relaxed text-white/75 sm:block">{excerpt}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BizButton href={`#${skin.ctaTarget || "contact"}`} className="w-full min-[400px]:w-auto">
              {skin.ctaLabel}
            </BizButton>
            {(business.contact?.whatsapp || business.contact?.phone) && (
              <BizButton
                href={waLink(business.contact?.whatsapp || business.contact?.phone, `Hi ${business.name}!`)}
                target="_blank"
                icon={MessageCircle}
                variant="outline-light"
                className="w-full min-[400px]:w-auto"
              >
                WhatsApp Us
              </BizButton>
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-[13px] text-white/70">
            {business.hours?.[0] && (
              <span className="inline-flex items-center gap-2">
                <Clock size={14} style={{ color: "var(--p)" }} />
                {business.hours[0].day} · {business.hours[0].time}
              </span>
            )}
            {business.contact?.address && (
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} style={{ color: "var(--p)" }} />
                {business.contact.address.split(",").slice(0, 2).join(", ")}
              </span>
            )}
            <span className="ml-auto hidden items-center gap-2 text-white/50 lg:inline-flex">
              <ArrowDown size={14} /> Scroll to explore
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Centered brand hero (cafe / salon) ---------------- */
function CenterHero() {
  const { business, skin } = useBiz();
  const excerpt = useExcerpt();
  const arch = skin.id === "salon";

  return (
    <section id="hero" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[46rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: withAlpha(skin.theme.primary, 0.12) }}
      />
      <div className="relative mx-auto max-w-4xl px-5 pt-28 text-center sm:px-8 sm:pt-36">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }}>
          <Kicker withLines>{categoryLabel(business.category)}</Kicker>
          <h1
            className="mt-4 text-balance"
            style={{
              fontFamily: skin.fonts.display,
              fontWeight: skin.heading.weight,
              fontSize: "clamp(2.9rem, 8vw, 5.6rem)",
              lineHeight: 1.02,
            }}
          >
            {business.name}
          </h1>
          <p
            className="mx-auto mt-4 max-w-2xl"
            style={{ fontFamily: skin.fonts.display, fontStyle: "italic", fontSize: "clamp(1.15rem, 2.6vw, 1.6rem)", color: "var(--p)" }}
          >
            {business.tagline}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">{excerpt}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BizButton href={`#${skin.ctaTarget || "contact"}`} className="w-full min-[400px]:w-auto">
              {skin.ctaLabel}
            </BizButton>
            {business.contact?.phone && (
              <BizButton href={telLink(business.contact.phone)} icon={Phone} variant="outline" className="w-full min-[400px]:w-auto">
                {business.contact.phone}
              </BizButton>
            )}
          </div>
        </motion.div>

        <motion.div
          className="relative mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          {business.heroImage && (
            <div className={arch ? "relative mx-auto max-w-sm sm:max-w-md" : "relative"}>
              {arch && (
                <div
                  className="absolute inset-0 translate-x-4 translate-y-4 rounded-b-[2rem] rounded-t-[999px]"
                  style={{ border: `2px solid ${withAlpha(skin.theme.accent, 0.7)}` }}
                />
              )}
              <img
                src={business.heroImage}
                alt={business.name}
                className={
                  arch
                    ? "relative aspect-[3/4] w-full rounded-b-[2rem] rounded-t-[999px] object-cover"
                    : "w-full object-cover shadow-2xl aspect-[16/10] sm:aspect-[21/9]"
                }
                style={arch ? undefined : { borderRadius: "var(--r)" }}
              />
            </div>
          )}

          {!!business.stats?.length && (
            <div className="flex flex-wrap items-start justify-center gap-x-12 gap-y-6 pb-4 pt-10">
              {business.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p style={{ fontFamily: skin.fonts.display, fontSize: "1.65rem", fontWeight: 700, color: "var(--p)" }}>{s.value}</p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default function BizHero() {
  const { skin } = useBiz();
  if (skin.heroVariant === "full") return <FullHero />;
  if (skin.heroVariant === "center") return <CenterHero />;
  return <SplitHero />;
}
