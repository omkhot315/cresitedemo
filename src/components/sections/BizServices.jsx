import { ArrowRight } from "lucide-react";
import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead } from "./primitives.jsx";
import BizIcon from "../common/BizIcon.jsx";
import { withAlpha } from "../../utils/businessUtils.js";

/**
 * Services in three flavours:
 *   cards — clinic / professional (icon cards, price chips)
 *   tiles — gym (numbered dark tiles)
 *   rows  — salon (editorial price list with dotted leaders)
 */
export default function BizServices() {
  const { business, skin } = useBiz();
  const items = business.services || [];
  if (!items.length) return null;

  const v = skin.servicesVariant;
  const tone = v === "cards" ? "alt" : "base";

  return (
    <SectionShell id="services" tone={tone}>
      <SectionHead id="services" />

      {v === "rows" && (
        <div className="mx-auto grid max-w-5xl gap-x-14 lg:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={i} delay={(i % 2) * 0.05}>
              <div className="flex items-start gap-4 border-b py-6" style={{ borderColor: "var(--line)" }}>
                <span
                  className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full"
                  style={{ background: withAlpha(skin.theme.primary, 0.1), color: "var(--p)" }}
                >
                  <BizIcon name={it.icon} size={17} />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 style={{ fontFamily: skin.fonts.display, fontSize: "1.2rem", fontWeight: 600 }}>{it.title}</h3>
                    <span className="hidden flex-1 border-b border-dotted sm:block" style={{ borderColor: withAlpha(skin.theme.muted, 0.55) }} />
                    {it.price && (
                      <span className="ml-auto whitespace-nowrap font-bold sm:ml-0" style={{ fontFamily: skin.fonts.display, color: "var(--p)", fontSize: "1.1rem" }}>
                        {it.price}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)]">{it.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {v === "cards" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={i} delay={(i % 3) * 0.06} className="h-full">
              <div
                className="group relative flex h-full flex-col border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                style={{ borderRadius: "var(--r)", background: "var(--card)", borderColor: "var(--line)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="grid h-12 w-12 place-items-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: withAlpha(skin.theme.primary, 0.1), color: "var(--p)", borderRadius: 14 }}
                  >
                    <BizIcon name={it.icon} size={21} />
                  </span>
                  {it.price && (
                    <span
                      className="rounded-full px-3 py-1 text-[12px] font-bold"
                      style={{ background: withAlpha(skin.theme.primary, 0.1), color: "var(--p)" }}
                    >
                      {it.price}
                    </span>
                  )}
                </div>
                <h3 className="mt-5" style={{ fontFamily: skin.fonts.display, fontWeight: 700, fontSize: "1.06rem" }}>
                  {it.title}
                </h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[var(--muted)]">{it.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold opacity-0 transition-all duration-300 group-hover:opacity-100" style={{ color: "var(--p)" }}>
                  Ask about this <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {v === "tiles" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={i} delay={(i % 3) * 0.06} className="h-full">
              <div
                className="group relative h-full overflow-hidden border p-6 transition-all duration-300 hover:-translate-y-1.5"
                style={{ borderRadius: "var(--r)", background: "var(--card)", borderColor: "var(--line)" }}
              >
                <span
                  className="pointer-events-none absolute -right-1 -top-3 select-none"
                  style={{ fontFamily: skin.fonts.display, fontWeight: 700, fontSize: "4.2rem", color: withAlpha(skin.theme.ink, 0.07) }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid h-11 w-11 place-items-center" style={{ background: withAlpha(skin.theme.primary, 0.14), color: "var(--p)", borderRadius: 8 }}>
                  <BizIcon name={it.icon} size={20} />
                </span>
                <h3
                  className="mt-5"
                  style={{ fontFamily: skin.fonts.display, fontWeight: 600, fontSize: "1.08rem", textTransform: "uppercase", letterSpacing: "0.05em" }}
                >
                  {it.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{it.description}</p>
                <span className="mt-5 block h-0.5 w-8 transition-all duration-300 group-hover:w-16" style={{ background: "var(--p)" }} />
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
