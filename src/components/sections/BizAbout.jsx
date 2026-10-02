import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead } from "./primitives.jsx";
import { withAlpha } from "../../utils/businessUtils.js";

/**
 * About — image panel + story + stat grid. Works for every template family.
 */
export default function BizAbout() {
  const { business, skin } = useBiz();
  if (!business.about && !business.stats?.length) return null;

  const img = business.aboutImage || business.heroImage;
  const arch = skin.teamVariant === "arch"; // salon family loves arches

  return (
    <SectionShell id="about">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-2 lg:order-1">
          <div
            className="absolute -bottom-4 -left-4 h-full w-full"
            style={{ borderRadius: arch ? "999px 999px var(--r) var(--r)" : "var(--r)", background: withAlpha(skin.theme.primary, 0.12) }}
          />
          {img ? (
            <img
              src={img}
              alt={`About ${business.name}`}
              loading="lazy"
              className="relative aspect-[5/4] w-full object-cover"
              style={{ borderRadius: arch ? "999px 999px var(--r) var(--r)" : "var(--r)" }}
            />
          ) : (
            <div
              className="relative grid aspect-[5/4] w-full place-items-center"
              style={{
                borderRadius: "var(--r)",
                background: `linear-gradient(135deg, ${withAlpha(skin.theme.primary, 0.15)}, ${withAlpha(skin.theme.accent, 0.18)})`,
              }}
            >
              <span style={{ fontFamily: skin.fonts.display, fontSize: "4.5rem", fontWeight: 800, color: withAlpha(skin.theme.primary, 0.45) }}>
                {business.name?.[0] || "B"}
              </span>
            </div>
          )}
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHead id="about" align="left" />
          <Reveal>
            <p className="whitespace-pre-line text-[16px] leading-[1.85] text-[var(--muted)]">{business.about}</p>
          </Reveal>

          {!!business.stats?.length && (
            <Reveal delay={0.1}>
              <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
                {business.stats.slice(0, 4).map((s, i) => (
                  <div key={i}>
                    <p
                      style={{
                        fontFamily: skin.fonts.display,
                        fontWeight: 700,
                        fontSize: "1.7rem",
                        lineHeight: 1,
                        color: "var(--p)",
                        textTransform: skin.heading.transform,
                      }}
                    >
                      {s.value}
                    </p>
                    <p className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
