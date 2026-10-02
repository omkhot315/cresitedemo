import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead } from "./primitives.jsx";
import { withAlpha } from "../../utils/businessUtils.js";

/** Categorised menu with dotted price leaders — cafe & restaurant families. */
export default function BizMenu() {
  const { business, skin } = useBiz();
  const groups = (business.menu || []).filter((g) => g.items?.length);
  if (!groups.length) return null;

  const dark = skin.scheme === "dark-elegant";
  const chipColor = dark ? skin.theme.accent : skin.theme.primary;

  return (
    <SectionShell id="menu" tone={dark ? "base" : "alt"}>
      <SectionHead id="menu" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((g, gi) => (
          <Reveal key={gi} delay={gi * 0.07} className="h-full">
            <div
              className="h-full border p-6 sm:p-7"
              style={{ borderRadius: "var(--r)", background: "var(--card)", borderColor: "var(--line)" }}
            >
              <div className="flex items-end justify-between">
                <h3 style={{ fontFamily: skin.fonts.display, fontWeight: 700, fontSize: "1.35rem" }}>{g.category}</h3>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {String(g.items.length).padStart(2, "0")} items
                </span>
              </div>
              <div className="mt-3 h-px w-12" style={{ background: "var(--a)" }} />

              <ul className="mt-6 flex flex-col gap-5">
                {g.items.map((item, i) => (
                  <li key={i}>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-[14.5px] font-semibold">{item.name}</span>
                      {item.tag && (
                        <span
                          className="whitespace-nowrap rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em]"
                          style={{ background: withAlpha(chipColor, 0.15), color: chipColor }}
                        >
                          {item.tag}
                        </span>
                      )}
                      <span className="mx-1 hidden flex-1 border-b border-dotted sm:block" style={{ borderColor: withAlpha(skin.theme.muted, 0.5) }} />
                      <span className="ml-auto text-[14px] font-bold sm:ml-0" style={{ color: "var(--p)" }}>
                        {item.price}
                      </span>
                    </div>
                    {item.description && <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--muted)]">{item.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
