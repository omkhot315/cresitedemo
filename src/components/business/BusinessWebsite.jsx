import { useEffect, useMemo } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { BizContext } from "./bizContext.js";
import { templateForCategory, sectionMetaFor } from "../../templates/registry.js";
import { getCategory } from "../../data/categories.js";
import {
  readableOn,
  setPageMeta,
  setLetterFavicon,
  initials,
  waLink,
  telLink,
  DEFAULT_META,
} from "../../utils/businessUtils.js";
import BizNavbar from "./BizNavbar.jsx";
import SectionRenderer, { SECTION_COMPONENTS } from "./SectionRenderer.jsx";
import BizFooter from "../sections/BizFooter.jsx";

/**
 * Floating WhatsApp + Call actions on every live business site.
 */
function FloatingActions() {
  return (
    <BizContext.Consumer>
      {({ business }) => {
        const wa = business.contact?.whatsapp || business.contact?.phone;
        const phone = business.contact?.phone;
        if (!wa && !phone) return null;
        return (
          <div
            className="fixed z-40 flex flex-col items-center gap-3"
            style={{
              bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
              right: "max(1.25rem, env(safe-area-inset-right, 0px))",
            }}
          >
            {wa && (
              <a
                href={waLink(wa, `Hi ${business.name}! I found your website and would like to know more.`)}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                className="animate-pulse-ring grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110"
              >
                <MessageCircle size={22} strokeWidth={2.2} />
              </a>
            )}
            {phone && (
              <a
                href={telLink(phone)}
                aria-label="Call now"
                className="grid h-12 w-12 place-items-center rounded-full shadow-xl transition-transform hover:scale-110"
                style={{ background: "var(--p)", color: "var(--onp)" }}
              >
                <Phone size={20} strokeWidth={2.2} />
              </a>
            )}
          </div>
        );
      }}
    </BizContext.Consumer>
  );
}

/**
 * The single engine that renders EVERY business website.
 * Data in -> theme resolved -> sections rendered -> SEO applied.
 * There is intentionally no ClinicWebsite.jsx / GymWebsite.jsx etc.
 */
export default function BusinessWebsite({ business, preview = false }) {
  const template = templateForCategory(business.category);

  /**
   * Section visibility: `business.sections` is the explicit list of sections
   * the owner switched ON. When it's absent (older records) every section the
   * template offers is shown. Order always follows the template.
   */
  const order = useMemo(() => {
    const all = template.sections.map((s) => s.id);
    const chosen = Array.isArray(business.sections) ? business.sections : all;
    const known = all.filter((id) => chosen.includes(id) && SECTION_COMPONENTS[id]);
    if (!known.includes("hero")) known.unshift("hero");
    return known;
  }, [business.sections, template]);

  const skin = useMemo(() => {
    const theme = { ...template.theme };
    Object.entries(business.theme || {}).forEach(([k, v]) => {
      if (v) theme[k] = v;
    });
    /* If the CTA's destination was switched off, aim it somewhere that exists. */
    const ctaTarget = order.includes(template.ctaTarget)
      ? template.ctaTarget
      : order.includes("contact")
      ? "contact"
      : order[order.length - 1] || "hero";
    return {
      ...template,
      theme,
      ctaTarget,
      onPrimary: readableOn(theme.primary),
      onAccent: readableOn(theme.accent),
      meta: sectionMetaFor(template),
    };
  }, [template, business.theme, order]);

  /* Dynamic SEO: title, description, Open Graph, theme colour + letter favicon */
  useEffect(() => {
    if (preview) return undefined;
    const cat = getCategory(business.category);
    const title = business.seo?.title || `${business.name} | Best ${cat.label}`;
    const description =
      business.seo?.description ||
      (business.about ? business.about.slice(0, 155) : `${business.name} — ${business.tagline || cat.label}`);
    setPageMeta({ title, description, image: business.heroImage, themeColor: skin.theme.primary });
    setLetterFavicon(initials(business.name) || "C", skin.theme.primary);
    return () => {
      setPageMeta(DEFAULT_META);
      setLetterFavicon("C", "#5046E5");
    };
  }, [business, preview, skin.theme.primary]);

  const ctx = useMemo(
    () => ({ business, skin, meta: skin.meta, order, preview }),
    [business, skin, order, preview]
  );

  const vars = {
    "--p": skin.theme.primary,
    "--s": skin.theme.secondary,
    "--a": skin.theme.accent,
    "--bg": skin.theme.bg,
    "--card": skin.theme.card,
    "--ink": skin.theme.ink,
    "--muted": skin.theme.muted,
    "--line": skin.theme.line,
    "--onp": skin.onPrimary,
    "--ona": skin.onAccent,
    "--r": template.radius,
    background: "var(--bg)",
    color: "var(--ink)",
    fontFamily: skin.fonts.body,
  };

  return (
    <BizContext.Provider value={ctx}>
      <div className="biz-site relative min-h-screen overflow-x-clip antialiased" style={vars}>
        <BizNavbar />
        <main>
          <SectionRenderer order={order} />
        </main>
        <BizFooter />
        {!preview && <FloatingActions />}
      </div>
    </BizContext.Provider>
  );
}
