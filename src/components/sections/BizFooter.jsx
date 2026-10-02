import { Phone, Mail, MapPin, MessageCircle, Layers } from "lucide-react";
import { useBiz } from "../business/bizContext.js";
import { readableOn, withAlpha, initials, telLink, waLink, PLATFORM_NAME } from "../../utils/businessUtils.js";

/* Brand glyphs (lucide no longer ships brand icons) — classic feather paths */
const Instagram = ({ size = 15, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const Facebook = ({ size = 15, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

/**
 * Deep-brand footer with nav, contact, hours and a Cresite credit.
 * The footer always uses the website's PRIMARY theme colour, so it carries the
 * brand colour of whichever template the business chose.
 */
export default function BizFooter() {
  const { business, skin, meta, order, preview } = useBiz();
  const c = business.contact || {};

  /**
   * The footer is painted in the website's PRIMARY theme colour. When that
   * colour is too light to sit behind a full-width footer band (photography's
   * near-white, jewellery's champagne), we deepen it by mixing in the template's
   * secondary colour so the band still reads as the brand but stays legible.
   */
  const isLight = (hex) => {
    const h = String(hex || "").replace("#", "");
    if (h.length < 6) return false;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
  };

  const blend = (a, b, weight = 0.72) => {
    const pa = String(a).replace("#", "");
    const pb = String(b).replace("#", "");
    const mix = (i) => {
      const x = parseInt(pa.slice(i, i + 2), 16);
      const y = parseInt(pb.slice(i, i + 2), 16);
      return Math.round(x * weight + y * (1 - weight));
    };
    const to = (n) => n.toString(16).padStart(2, "0");
    return `#${to(mix(0))}${to(mix(2))}${to(mix(4))}`;
  };

  const footerBg = isLight(skin.theme.primary)
    ? blend(skin.theme.primary, skin.theme.secondary)
    : skin.theme.primary;

  const onSec = readableOn(footerBg);
  const muted = withAlpha(onSec, 0.62);
  const links = order.map((id) => ({ id, ...(meta[id] || {}) })).filter((s) => s.nav && s.id !== "hero");
  const year = new Date().getFullYear();

  const socials = [
    business.social?.instagram && { icon: Instagram, href: business.social.instagram, label: "Instagram" },
    business.social?.facebook && { icon: Facebook, href: business.social.facebook, label: "Facebook" },
    (c.whatsapp || c.phone) && {
      icon: MessageCircle,
      href: waLink(c.whatsapp || c.phone, `Hi ${business.name}!`),
      label: "WhatsApp",
    },
  ].filter(Boolean);

  return (
    <footer style={{ background: footerBg, color: onSec }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-9 w-9 place-items-center text-[13px] font-bold"
              style={{ background: "var(--p)", color: "var(--onp)", borderRadius: 12, fontFamily: skin.fonts.display }}
            >
              {initials(business.name) || "B"}
            </span>
            <span className="text-[16px] font-bold" style={{ fontFamily: skin.fonts.display }}>
              {business.name}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed" style={{ color: muted }}>
            {business.tagline}
          </p>
          {!!socials.length && (
            <div className="mt-5 flex gap-2.5">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full transition hover:scale-110"
                  style={{ background: withAlpha(onSec, 0.1), color: onSec }}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: muted }}>
            Explore
          </p>
          <nav className="mt-4 flex flex-col gap-2.5">
            {links.slice(0, 7).map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => preview && e.preventDefault()}
                className="w-fit text-[13.5px] transition hover:translate-x-1"
                style={{ color: withAlpha(onSec, 0.85) }}
              >
                {l.nav}
              </a>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: muted }}>
            Contact
          </p>
          <div className="mt-4 space-y-3 text-[13.5px]" style={{ color: withAlpha(onSec, 0.85) }}>
            {c.phone && (
              <a href={telLink(c.phone)} className="flex items-center gap-2.5 transition hover:opacity-80">
                <Phone size={14} style={{ color: onSec, opacity: 0.85 }} /> {c.phone}
              </a>
            )}
            {c.email && (
              <a href={`mailto:${c.email}`} className="flex items-center gap-2.5 break-all transition hover:opacity-80">
                <Mail size={14} style={{ color: onSec, opacity: 0.85 }} /> {c.email}
              </a>
            )}
            {c.address && (
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin size={14} className="mt-1 shrink-0" style={{ color: onSec, opacity: 0.85 }} /> {c.address}
              </p>
            )}
          </div>
        </div>

        {!!business.hours?.length && (
          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: muted }}>
              Hours
            </p>
            <div className="mt-4 space-y-2 text-[13px]" style={{ color: withAlpha(onSec, 0.85) }}>
              {business.hours.map((h, i) => (
                <p key={i}>
                  <span className="font-semibold">{h.day}</span>
                  <br />
                  <span style={{ color: muted }}>{h.time}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${withAlpha(onSec, 0.14)}` }}>
        <div
          className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-[12px] sm:flex-row sm:px-8"
          style={{ color: muted }}
        >
          <span>
            © {year} {business.name}. All rights reserved.
          </span>
          <a
            href="/"
            onClick={(e) => preview && e.preventDefault()}
            className="inline-flex items-center gap-1.5 transition hover:opacity-100"
            style={{ color: withAlpha(onSec, 0.85) }}
          >
            <Layers size={13} style={{ color: onSec, opacity: 0.85 }} />
            Made with <span className="font-bold">{PLATFORM_NAME}</span> — build your own free website
          </a>
        </div>
      </div>
    </footer>
  );
}
