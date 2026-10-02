import { Check } from "lucide-react";
import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead, BizButton } from "./primitives.jsx";

/** Membership / plan cards (gym family) with a highlighted centre plan. */
export default function BizPricing() {
  const { business, skin } = useBiz();
  const plans = business.plans || [];
  if (!plans.length) return null;

  return (
    <SectionShell id="pricing" tone="alt">
      <SectionHead id="pricing" />
      <div className="mx-auto grid max-w-5xl items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const hot = plan.highlighted;
          return (
            <Reveal key={i} delay={i * 0.07} className="h-full">
              <div
                className={`relative flex h-full flex-col border p-7 transition-all duration-300 hover:-translate-y-1.5 ${
                  hot ? "shadow-2xl md:-translate-y-3 md:scale-[1.02]" : "hover:shadow-xl"
                }`}
                style={{
                  borderRadius: "var(--r)",
                  background: hot ? "var(--p)" : "var(--card)",
                  color: hot ? "var(--onp)" : "var(--ink)",
                  borderColor: hot ? "transparent" : "var(--line)",
                }}
              >
                {hot && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ background: "var(--a)", color: "var(--ona)" }}
                  >
                    Most Popular
                  </span>
                )}
                <h3
                  style={{
                    fontFamily: skin.fonts.display,
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    opacity: 0.85,
                  }}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-end gap-1.5">
                  <span style={{ fontFamily: skin.fonts.display, fontWeight: 700, fontSize: "2.6rem", lineHeight: 1 }}>{plan.price}</span>
                  <span className="mb-1 text-sm opacity-70">{plan.period}</span>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-[13.5px]">
                      <Check size={16} strokeWidth={3} className="mt-0.5 shrink-0" style={{ color: hot ? "var(--onp)" : "var(--p)" }} />
                      <span className="opacity-85">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <BizButton href="#contact" variant={hot ? "inverted" : "outline"} className="w-full">
                    {plan.cta || "Choose Plan"}
                  </BizButton>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-8 text-center text-xs text-[var(--muted)]">Prices include GST · Pause or upgrade anytime · No hidden charges</p>
    </SectionShell>
  );
}
