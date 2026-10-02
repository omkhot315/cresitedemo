import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Layers, Link2, LayoutGrid, Palette,
  MonitorSmartphone, Rocket, Gauge, Mail, Phone, MapPin, Send, Sparkles,
} from "lucide-react";
import PlatformNav, { BrandMark } from "../components/common/PlatformNav.jsx";
import { useAuth } from "../store/AuthContext.jsx";
import { submitLead } from "../services/leadApi.js";
import PhoneInput from "../components/common/PhoneInput.jsx";
import BizIcon from "../components/common/BizIcon.jsx";
import { CATEGORIES } from "../data/categories.js";
import { SEED_BUSINESSES } from "../data/seedBusinesses.js";
import { templateForCategory } from "../templates/registry.js";
import { setPageMeta, setLetterFavicon, DEFAULT_META, withAlpha, PLATFORM_URL } from "../utils/businessUtils.js";

const INK = "#101014";

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Tag = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-600">
    {children}
  </span>
);

const H2 = ({ children, className = "" }) => (
  <h2 className={`text-balance font-display text-3xl font-bold tracking-tight sm:text-[2.6rem] sm:leading-[1.08] ${className}`}>
    {children}
  </h2>
);

/* Floating browser mock for the hero */
function MiniSite({ img, name, slug, accent, className = "", style = {} }) {
  return (
    <div className={`absolute w-52 ${className}`}>
      <div
        className="animate-float overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl shadow-indigo-950/10"
        style={style}
      >
        <div className="flex items-center gap-1.5 border-b border-black/5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
          <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
          <span className="h-2 w-2 rounded-full bg-[#28C840]" />
          <span className="ml-1.5 truncate rounded-full bg-black/5 px-2 py-0.5 text-[8.5px] font-medium text-black/50">
            {PLATFORM_URL}/{slug}
          </span>
        </div>
        <img src={img} alt={name} className="h-24 w-full object-cover" />
        <div className="flex items-center justify-between px-3 py-2.5">
          <div>
            <p className="text-[11px] font-bold text-black/80">{name}</p>
            <div className="mt-1 h-1 w-16 rounded-full bg-black/10" />
          </div>
          <span className="h-1.5 w-8 rounded-full" style={{ background: accent }} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const location = useLocation();
  const { isAuthed } = useAuth();
  /* Logged-out visitors sign up first; returning users go straight to the builder. */
  const ctaTo = isAuthed ? "/create" : "/signup";
  const [openFaq, setOpenFaq] = useState(0);
  const [sent, setSent] = useState(false);
  const [contactBusy, setContactBusy] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", message: "" });

  /** Platform contact enquiries feed the same super-admin inbox as website forms. */
  const sendPlatformEnquiry = async (e) => {
    e.preventDefault();
    setContactError("");

    if (!contactForm.name.trim()) return setContactError("Please tell us your name.");
    if (!contactForm.phone.trim() && !contactForm.email.trim()) {
      return setContactError("Please add a phone number or email so we can reply.");
    }

    setContactBusy(true);
    const res = await submitLead({
      businessSlug: "cresite-platform",
      ...contactForm,
    });
    setContactBusy(false);

    if (!res.ok) return setContactError(res.error || "Could not send your message. Please try again.");

    setSent(true);
    setContactForm({ name: "", phone: "", email: "", message: "" });
    setTimeout(() => setSent(false), 5000);
    return undefined;
  };

  useEffect(() => {
    setPageMeta(DEFAULT_META);
    setLetterFavicon("C", "#5046E5");
  }, []);

  useEffect(() => {
    if (location.hash) {
      const t = setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth" }), 80);
      return () => clearTimeout(t);
    }
  }, [location.hash]);

  const demos = SEED_BUSINESSES.filter((b) => b.published);

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#101014]">
      <PlatformNav />

      {/* ============================== HERO ============================== */}
      <section className="bg-grid relative overflow-hidden pb-14 pt-32 sm:pt-40">
        <div className="animate-blob pointer-events-none absolute -top-24 right-[8%] h-96 w-96 rounded-full bg-indigo-400/25 blur-3xl" />
        <div className="animate-blob pointer-events-none absolute -left-24 top-64 h-80 w-80 rounded-full bg-[#D7F75B]/30 blur-3xl" style={{ animationDelay: "3s" }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FadeIn>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold shadow-sm">
                <Sparkles size={13} className="text-indigo-600" />
                One platform · 85+ business templates · Zero code
              </span>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.2rem]">
                Build Your Business Website{" "}
                <span className="font-accent-serif bg-gradient-to-r from-[#5046E5] via-[#7C3AED] to-[#D946EF] bg-clip-text font-medium italic text-transparent">
                  in Minutes
                </span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.16}>
              <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-[#55555E]">
                Create a professional online presence for your clinic, gym, salon, cafe, restaurant, hotel and more
                — all under one powerful platform.
              </p>
            </FadeIn>
            <FadeIn delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to={ctaTo}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#5046E5] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-[#4338CA]"
                >
                  Create Website
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#examples"
                  className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-7 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-black/30"
                >
                  Explore Businesses
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-[#55555E]">
                {["Free to try", "No code needed", "Live in ~5 minutes"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-600" strokeWidth={3} /> {t}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Floating browser mocks */}
          <div className="relative hidden h-[540px] lg:block">
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-indigo-300/60" />
            <MiniSite {...demoCard(demos, "smile-dental-care")} className="left-2 top-2 -rotate-6" style={{ animationDelay: "0s" }} />
            <MiniSite {...demoCard(demos, "powerfit-fitness")} className="right-0 top-44 rotate-3" style={{ animationDelay: "1.4s" }} />
            <MiniSite {...demoCard(demos, "brew-and-bean")} className="bottom-2 left-16 -rotate-2" style={{ animationDelay: "2.6s" }} />
          </div>
        </div>

        <FadeIn delay={0.1} className="relative mx-auto mt-14 max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-6 border-t border-black/10 pt-8 sm:grid-cols-4">
            {[
              { v: "5", l: "demo sites live" },
              { v: "85+", l: "business categories" },
              { v: "~5 min", l: "from idea to live" },
              { v: "0", l: "lines of code" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-2xl font-bold sm:text-3xl">{s.v}</p>
                <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#55555E]">{s.l}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ============================ MARQUEE ============================ */}
      <div className="overflow-hidden bg-[#0D0D12] py-4">
        <div className="animate-marquee flex w-max items-center gap-12 pr-12">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span key={i} className="flex items-center gap-2.5 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.18em] text-white/60">
              <BizIcon name={c.icon} size={15} className="text-[#D7F75B]" />
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* =========================== CATEGORIES ========================== */}
      <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
        <FadeIn className="max-w-2xl">
          <Tag>Categories</Tag>
          <H2 className="mt-4">A template for every trade</H2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-[#55555E]">
            Each category gets its own design language — layouts, fonts, colours and sections crafted for how that
            business actually sells. Pick yours and start.
          </p>
        </FadeIn>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <FadeIn key={c.id} delay={Math.min(i * 0.03, 0.3)}>
              <Link
                to={`/create?category=${c.id}`}
                className="group flex h-full flex-col rounded-2xl border border-black/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-[#5046E5] group-hover:text-white">
                  <BizIcon name={c.icon} size={19} />
                </span>
                <span className="mt-4 font-display text-[15px] font-bold">{c.label}</span>
                <span className="mt-1 text-[12.5px] leading-snug text-[#77777F]">{c.blurb}</span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <section id="features" className="border-y border-black/5 bg-white scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <FadeIn className="max-w-2xl">
            <Tag>Why Cresite</Tag>
            <H2 className="mt-4">Everything a local business needs to look big-league</H2>
          </FadeIn>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Link2, t: "A real address, instantly", d: "Every business gets a clean, shareable link — cresite.in/your-brand. No domains to buy, no hosting to configure." },
              { icon: LayoutGrid, t: "Category-smart templates", d: "Clinics get doctor profiles and treatments. Cafes get menus and hours. Gyms get plans and trainers. Automatically." },
              { icon: Palette, t: "Your brand, your rules", d: "Colours, fonts, photos and tone follow YOUR identity — applied live across the whole site as you tweak." },
              { icon: MonitorSmartphone, t: "Preview on every device", d: "Watch your site assemble itself as you type — and flip between desktop, tablet and mobile with one click." },
              { icon: Rocket, t: "SEO & speed, built in", d: "<50ms renders, dynamic titles and descriptions, Open Graph cards and clean URLs that Google loves." },
              { icon: Gauge, t: "A dashboard that stays light", d: "Edit anything, publish or unpublish, copy your link — manage every site you own from one calm screen." },
            ].map((f, i) => (
              <FadeIn key={f.t} delay={i * 0.05}>
                <div className="group h-full rounded-3xl border border-black/10 bg-[#FBFAF7] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#101014] text-white transition-colors group-hover:bg-[#5046E5]">
                    <f.icon size={20} />
                  </span>
                  <h3 className="mt-5 font-display text-[17px] font-bold">{f.t}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#55555E]">{f.d}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== HOW IT WORKS ========================== */}
      <section id="how" className="relative overflow-hidden bg-[#0D0D12] scroll-mt-16">
        <div className="bg-grid-light absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <FadeIn className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#D7F75B]">
              How it works
            </span>
            <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-[2.6rem] sm:leading-[1.08]">
              From "I need a website" to "check out my website" in three steps
            </h2>
          </FadeIn>
          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {[
              { n: "01", t: "Tell us about your business", d: "Name, category, services, photos and brand colours. Two minutes, tops — most fields fill themselves in." },
              { n: "02", t: "Watch it come alive", d: "The builder assembles a complete website around your answers and re-renders with every keystroke." },
              { n: "03", t: "Publish & share your link", d: "One click and you're live. Put it in your Instagram bio, on your visiting card, in your WhatsApp status." },
            ].map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.08}>
                <div className="relative">
                  <p className="font-display text-[4.5rem] font-bold leading-none text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.22)" }}>
                    {s.n}
                  </p>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">{s.t}</h3>
                  <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/60">{s.d}</p>
                  {i < 2 && <div className="absolute right-0 top-8 hidden h-px w-16 border-t border-dashed border-white/25 lg:block" />}
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <Link
              to={ctaTo}
              className="mt-14 inline-flex items-center gap-2 rounded-full bg-[#D7F75B] px-7 py-3.5 text-sm font-bold text-[#101014] transition hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-8px_rgba(215,247,91,0.5)]"
            >
              Start with step one <ArrowRight size={15} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ============================ EXAMPLES ============================ */}
      <section id="examples" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:px-8">
        <FadeIn className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Tag>Live examples</Tag>
            <H2 className="mt-4">Real sites, built on this exact platform</H2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[#55555E]">
              Five demo businesses run on Cresite right now. Same engine, same components — wildly different
              personalities. Click any of them.
            </p>
          </div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 text-[13px] font-semibold transition hover:border-black/30">
            Open dashboard <ArrowUpRight size={14} />
          </Link>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demos.map((b, i) => {
            const tpl = templateForCategory(b.category);
            return (
              <FadeIn key={b.slug} delay={i * 0.06} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <Link
                  to={`/${b.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  <div className="flex items-center gap-1.5 border-b border-black/5 px-4 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
                    <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
                    <span className="h-2 w-2 rounded-full bg-[#28C840]" />
                    <span className="ml-2 flex-1 truncate rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-medium text-black/50">
                      {PLATFORM_URL}/{b.slug}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> LIVE
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <img
                      src={b.heroImage}
                      alt={b.name}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-display text-[16px] font-bold">{b.name}</p>
                      <p className="mt-0.5 text-[12px] italic text-[#77777F]">{b.tagline}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider"
                        style={{ background: withAlpha(tpl.theme.primary, 0.12), color: tpl.theme.primary }}
                      >
                        {tpl.name.split(" ")[0]}
                      </span>
                      <ArrowUpRight size={16} className="text-black/30 transition group-hover:text-[#5046E5]" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ============================= PRICING ============================ */}
      <section id="pricing" className="border-y border-black/5 bg-white scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <Tag>Pricing</Tag>
            <H2 className="mt-4">One simple price per website</H2>
            <p className="mt-4 text-[15.5px] text-[#55555E]">
              Pay once, own it for the year. No monthly surprises, no per-section upsells.
            </p>
          </FadeIn>
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-3">
            {[
              {
                id: "basic",
                name: "Website",
                price: "₹999", per: "/year", cta: "Start building", to: ctaTo, hot: false,
                blurb: "A complete website on your own Cresite link.",
                feats: [
                  "1 business website",
                  "cresite.in/your-brand link",
                  "All sections — menu, team, gallery, reviews, FAQs",
                  "WhatsApp & call buttons",
                  "Unlimited edits, any time",
                  "Mobile, tablet & desktop design",
                ],
              },
              {
                id: "domain",
                name: "Website + Domain",
                price: "₹2,999", per: "/year", cta: "Claim your domain", to: ctaTo, hot: true,
                blurb: "Everything above, on your very own domain name.",
                feats: [
                  "Everything in Website",
                  "Your own domain — yourbrand.com",
                  "Free domain for the first year",
                  "Business email setup help",
                  "Advanced SEO controls",
                  "Remove Cresite branding",
                ],
              },
              {
                id: "custom",
                name: "Custom Website",
                price: "Custom", per: "quote", cta: "Tell us what you need", to: "/#contact", hot: false,
                blurb: "Something bigger, stranger or fully bespoke? Let's talk.",
                feats: [
                  "Completely custom design",
                  "Any features you need — booking, payments, catalogues",
                  "Multi-page & multi-language sites",
                  "Content written for you",
                  "Photo & logo assistance",
                  "Dedicated support & priority turnaround",
                ],
              },
            ].map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.07}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                    p.hot
                      ? "bg-[#101014] text-white shadow-2xl shadow-indigo-950/30 lg:-translate-y-3 lg:scale-[1.03]"
                      : "border border-black/10 bg-[#FBFAF7] hover:shadow-xl"
                  }`}
                >
                  {p.hot && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#D7F75B] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#101014]">
                      Most Popular
                    </span>
                  )}
                  <p className={`font-display text-sm font-bold uppercase tracking-[0.14em] ${p.hot ? "text-[#D7F75B]" : "text-indigo-600"}`}>{p.name}</p>
                  <div className="mt-4 flex items-end gap-1.5">
                    <span
                      className={`font-display font-bold leading-none ${
                        p.price === "Custom" ? "text-[2.3rem]" : "text-[2.7rem]"
                      }`}
                    >
                      {p.price}
                    </span>
                    <span className={`mb-1.5 text-sm ${p.hot ? "text-white/60" : "text-[#77777F]"}`}>{p.per}</span>
                  </div>
                  <p className={`mt-2.5 text-[13px] ${p.hot ? "text-white/60" : "text-[#77777F]"}`}>{p.blurb}</p>
                  <ul className="mt-7 flex flex-1 flex-col gap-3">
                    {p.feats.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13.5px]">
                        <Check size={16} strokeWidth={3} className={`mt-0.5 shrink-0 ${p.hot ? "text-[#D7F75B]" : "text-emerald-600"}`} />
                        <span className={p.hot ? "text-white/80" : "text-[#55555E]"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={p.to}
                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition hover:-translate-y-0.5 ${
                      p.hot ? "bg-[#D7F75B] text-[#101014]" : "bg-[#101014] text-white hover:bg-[#5046E5]"
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* =============================== FAQ ============================== */}
      <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-24 sm:px-8">
        <FadeIn className="text-center">
          <Tag>FAQ</Tag>
          <H2 className="mt-4">Questions, answered</H2>
        </FadeIn>
        <div className="mt-12 space-y-3">
          {[
            { q: "Do I need any technical skills?", a: "None at all. If you can fill a form, you can build a Cresite website. Everything — design, layout, hosting, SEO — is handled for you." },
            { q: "How fast can my website go live?", a: "Most owners finish in about five minutes. Pick a category, tweak the pre-filled content, hit publish. Your link works instantly." },
            { q: "Can I change things later?", a: "Anytime. Prices change, photos change, hours change — edit from your dashboard and the site updates the moment you save." },
            { q: "Will it look good on phones?", a: "Every template is designed mobile-first. Over 80% of your visitors will find you on a phone, so that's where we start." },
            { q: "Can I use my own domain name?", a: "Yes — the Website + Domain plan (₹2,999/year) puts your site on yourbrand.com and includes the domain free for the first year, plus help setting up business email." },
            { q: "What if I need something more than a template?", a: "Choose Custom Website. We design and build exactly what you need — bookings, payments, catalogues, multi-page or multi-language — and quote you a fixed price up front." },
            { q: "Is there a free option to try it out?", a: "You can create an account and build your complete website free. Upgrade to a paid plan when you're ready to connect a domain or go fully custom." },
            { q: "My category isn't listed. Now what?", a: "Choose 'Other Business' — the professional template adapts to any trade, and we're adding new category designs every month." },
          ].map((f, i) => {
            const open = openFaq === i;
            return (
              <FadeIn key={i} delay={i * 0.04}>
                <div className={`overflow-hidden rounded-2xl border bg-white transition-colors ${open ? "border-indigo-400" : "border-black/10"}`}>
                  <button onClick={() => setOpenFaq(open ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left">
                    <span className="py-1 font-display text-[15.5px] font-bold">{f.q}</span>
                    <motion.span animate={{ rotate: open ? 180 : 0 }} className="shrink-0 text-[#77777F]">
                      <ChevronDown size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-5 text-[14px] leading-relaxed text-[#55555E]">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ============================= CONTACT ============================ */}
      <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8">
        <FadeIn>
          <div className="grid overflow-hidden rounded-[2.5rem] border border-black/10 bg-white lg:grid-cols-2">
            <div className="relative bg-[#101014] p-10 text-white sm:p-14">
              <div className="animate-blob absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
              <div className="relative">
                <Tag>Contact</Tag>
                <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Prefer to talk to a human?
                </h2>
                <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-white/65">
                  We help local businesses go online every day. Ask us anything — migrations, bulk setups, or "what
                  should my site say?"
                </p>
                <div className="mt-10 space-y-5 text-[14px]">
                  {[
                    { icon: Mail, label: "cresite.in@gmail.com" },
                    { icon: Phone, label: "+91 9421015198" },
                    { icon: MapPin, label: "Available across India" },
                  ].map((r, i) => (
                    <p key={i} className="flex items-center gap-3 text-white/80">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-[#D7F75B]">
                        <r.icon size={16} />
                      </span>
                      {r.label}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <form
              className="p-10 sm:p-14"
              onSubmit={sendPlatformEnquiry}
            >
              <h3 className="font-display text-xl font-bold">Drop us a line</h3>
              <p className="mt-1.5 text-[13px] text-[#77777F]">
                Your message goes directly to our team.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <input
                  value={contactForm.name}
                  onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="rounded-xl border border-black/10 bg-[#FBFAF7] px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                />
                <PhoneInput
                  value={contactForm.phone}
                  onChange={(value) => setContactForm((f) => ({ ...f, phone: value }))}
                  placeholder="9421015198"
                  className="border-black/10 bg-[#FBFAF7]"
                />
              </div>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="Email (optional)"
                className="mt-4 w-full rounded-xl border border-black/10 bg-[#FBFAF7] px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
              />
              <textarea
                rows={4}
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Tell us about your business…"
                className="mt-4 w-full resize-none rounded-xl border border-black/10 bg-[#FBFAF7] px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
              />

              {contactError && (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] font-semibold text-red-600">
                  {contactError}
                </p>
              )}

              <button
                disabled={contactBusy}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#5046E5] px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4338CA] disabled:opacity-60"
              >
                {sent ? <Check size={15} /> : <Send size={15} />}
                {contactBusy ? "Sending…" : sent ? "Message sent — thank you!" : "Send message"}
              </button>
            </form>
          </div>
        </FadeIn>
      </section>

      {/* ============================== FOOTER ============================ */}
      <footer className="bg-[#0D0D12] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            {/* Uses the same shared BrandMark as the navbar. Enable the PNG once in PlatformNav.jsx. */}
            <BrandMark />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-white/55">
              The website platform for local business. One calm dashboard, a link you can share anywhere, and designs
              that make small look mighty.
            </p>
          </div>
          <div className="lg:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Product</p>
            <div className="mt-4 flex flex-col gap-2.5 text-[13.5px] text-white/70">
              <Link to="/create" className="w-fit transition hover:text-white">Create website</Link>
              <Link to="/dashboard" className="w-fit transition hover:text-white">Dashboard</Link>
              <a href="/#pricing" className="w-fit transition hover:text-white">Pricing</a>
              <a href="/#features" className="w-fit transition hover:text-white">Features</a>
            </div>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Live examples</p>
            <div className="mt-4 flex flex-col gap-2.5 text-[13.5px] text-white/70">
              {demos.map((b) => (
                <Link key={b.slug} to={`/${b.slug}`} className="w-fit transition hover:text-white">
                  {b.name} <span className="text-white/35">/{b.slug}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Company</p>
            <div className="mt-4 flex flex-col gap-2.5 text-[13.5px] text-white/70">
              <a href="/#contact" className="w-fit transition hover:text-white">Contact</a>
              <a href="/#faq" className="w-fit transition hover:text-white">FAQ</a>
              <a href="/#how" className="w-fit transition hover:text-white">How it works</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl items-center px-5 py-6 text-[12px] text-white/40 sm:px-8">
            <span className="inline-flex items-center gap-2">
              <Layers size={13} /> © {new Date().getFullYear()} Cresite. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function demoCard(demos, slug) {
  const b = demos.find((d) => d.slug === slug) || demos[0];
  return {
    img: b.heroImage,
    name: b.name,
    slug: b.slug,
    accent: templateForCategory(b.category).theme.primary,
  };
}
