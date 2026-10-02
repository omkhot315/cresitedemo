import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead } from "./primitives.jsx";
import { withAlpha, initials } from "../../utils/businessUtils.js";

/**
 * Team — four layouts driven by the family:
 *   cards  (clinic / professional) · dark (gym) · arch (salon) · circle (restaurant)
 */
export default function BizTeam() {
  const { business, skin } = useBiz();
  const team = business.team || [];
  if (!team.length) return null;

  const v = skin.teamVariant;

  const Photo = ({ member, className = "", style = {} }) =>
    member.photo ? (
      <img src={member.photo} alt={member.name} loading="lazy" className={`object-cover ${className}`} style={style} />
    ) : (
      <div
        className={`grid place-items-center ${className}`}
        style={{ ...style, background: withAlpha(skin.theme.primary, 0.14), color: "var(--p)", fontFamily: skin.fonts.display, fontWeight: 700, fontSize: "1.8rem" }}
      >
        {initials(member.name)}
      </div>
    );

  return (
    <SectionShell id="team" tone={v === "dark" ? "alt" : "base"}>
      <SectionHead id="team" />
      <div className="flex flex-wrap justify-center gap-6">
        {team.map((m, i) => (
          <Reveal
            key={i}
            delay={(i % 3) * 0.07}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] lg:max-w-sm"
          >
            {v === "cards" && (
              <div
                className="h-full border p-4 pb-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                style={{ borderRadius: "var(--r)", background: "var(--card)", borderColor: "var(--line)" }}
              >
                <Photo member={m} className="aspect-[4/5] w-full" style={{ borderRadius: "calc(var(--r) * 0.65)" }} />
                <h3 className="mt-4" style={{ fontFamily: skin.fonts.display, fontWeight: 700, fontSize: "1.1rem" }}>
                  {m.name}
                </h3>
                <p className="mt-1 text-[12.5px] font-bold" style={{ color: "var(--p)" }}>
                  {m.role}
                </p>
                <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-[var(--muted)]">{m.bio}</p>
              </div>
            )}

            {v === "dark" && (
              <div
                className="group h-full overflow-hidden border transition-all duration-300 hover:-translate-y-1.5"
                style={{ borderRadius: "var(--r)", background: "var(--card)", borderColor: "var(--line)" }}
              >
                <div className="overflow-hidden">
                  <Photo
                    member={m}
                    className="aspect-[3/4] w-full grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <div className="p-5">
                  <h3 style={{ fontFamily: skin.fonts.display, fontWeight: 600, fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {m.name}
                  </h3>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--p)" }}>
                    {m.role}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">{m.bio}</p>
                </div>
              </div>
            )}

            {v === "arch" && (
              <div className="h-full px-4 pb-2 text-center">
                <div className="relative mx-auto max-w-[240px]">
                  <div
                    className="absolute inset-0 translate-x-3 translate-y-3 rounded-b-3xl rounded-t-[999px]"
                    style={{ border: `2px solid ${withAlpha(skin.theme.accent, 0.65)}` }}
                  />
                  <Photo member={m} className="relative aspect-[3/4] w-full rounded-b-3xl rounded-t-[999px]" />
                </div>
                <h3 className="mt-5" style={{ fontFamily: skin.fonts.display, fontWeight: 600, fontSize: "1.35rem" }}>
                  {m.name}
                </h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--p)" }}>
                  {m.role}
                </p>
                <p className="mx-auto mt-2 max-w-[240px] text-[13px] leading-relaxed text-[var(--muted)]">{m.bio}</p>
              </div>
            )}

            {v === "circle" && (
              <div className="h-full px-4 pb-2 text-center">
                <Photo
                  member={m}
                  className="mx-auto aspect-square w-40 rounded-full"
                  style={{ boxShadow: `0 0 0 4px var(--bg), 0 0 0 6px ${withAlpha(skin.theme.accent, 0.8)}` }}
                />
                <h3 className="mt-5" style={{ fontFamily: skin.fonts.display, fontWeight: 700, fontSize: "1.25rem" }}>
                  {m.name}
                </h3>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--a)" }}>
                  {m.role}
                </p>
                <p className="mx-auto mt-2 max-w-[250px] text-[13px] leading-relaxed text-[var(--muted)]">{m.bio}</p>
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
