import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { useBiz } from "../business/bizContext.js";
import { Reveal, BizButton } from "./primitives.jsx";
import { telLink, waLink } from "../../utils/businessUtils.js";

/** Big brand-colour conversion band before the contact section. */
export default function BizCta() {
  const { business, skin } = useBiz();
  const phone = business.contact?.phone;
  const wa = business.contact?.whatsapp || phone;
  const title = business.cta?.title || skin.ctaLabel;
  const sub = business.cta?.subtitle || "Reach out on call or WhatsApp — we reply fast, promise.";

  return (
    <section id="cta" className="relative" style={{ scrollMarginTop: 92 }}>
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-10">
        <Reveal>
          <div
            className="relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20"
            style={{ borderRadius: "calc(var(--r) * 1.3)", background: "var(--p)", color: "var(--onp)" }}
          >
            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[26px]" style={{ borderColor: "rgba(255,255,255,0.12)" }} />
            <div className="pointer-events-none absolute -bottom-28 -left-10 h-64 w-64 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />

            <div className="relative">
              <h2
                className="mx-auto max-w-2xl text-balance"
                style={{
                  fontFamily: skin.fonts.display,
                  fontWeight: skin.heading.weight,
                  textTransform: skin.heading.transform,
                  letterSpacing: skin.heading.transform === "uppercase" ? "0.03em" : skin.heading.spacing,
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  lineHeight: 1.1,
                }}
              >
                {title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed opacity-85">{sub}</p>

              <div className="mt-8 flex flex-wrap justify-center gap-3 px-2">
                {phone ? (
                  <BizButton href={telLink(phone)} icon={Phone} variant="inverted" className="w-full min-[400px]:w-auto">
                    Call {phone}
                  </BizButton>
                ) : (
                  <BizButton href="#contact" icon={ArrowRight} variant="inverted" className="w-full min-[400px]:w-auto">
                    Get in Touch
                  </BizButton>
                )}
                {wa && (
                  <BizButton
                    href={waLink(wa, `Hi ${business.name}! I'd like to make an enquiry.`)}
                    target="_blank"
                    icon={MessageCircle}
                    variant="whatsapp"
                    className="w-full min-[400px]:w-auto"
                  >
                    WhatsApp Us
                  </BizButton>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
