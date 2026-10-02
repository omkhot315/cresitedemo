import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead } from "./primitives.jsx";
import BizIcon from "../common/BizIcon.jsx";
import { withAlpha } from "../../utils/businessUtils.js";

/** "Why Choose Us" — icon feature grid, styled per family. */
export default function BizFeatures() {
  const { business, skin } = useBiz();
  const items = business.features || [];
  if (!items.length) return null;

  return (
    <SectionShell id="features" tone="alt">
      <SectionHead id="features" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((f, i) => (
          <Reveal key={i} delay={i * 0.06} className="h-full">
            <div
              className="group h-full border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              style={{ borderRadius: "var(--r)", background: "var(--card)", borderColor: "var(--line)" }}
            >
              <span
                className="mb-5 inline-grid h-12 w-12 place-items-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                style={{
                  background: withAlpha(skin.theme.primary, skin.scheme === "dark" ? 0.16 : 0.1),
                  color: "var(--p)",
                  borderRadius: skin.button === "sharp" ? 8 : 14,
                }}
              >
                <BizIcon name={f.icon} size={21} />
              </span>
              <h3
                style={{
                  fontFamily: skin.fonts.display,
                  fontWeight: 700,
                  fontSize: "1.02rem",
                  textTransform: skin.heading.transform,
                  letterSpacing: skin.heading.transform === "uppercase" ? "0.04em" : undefined,
                }}
              >
                {f.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{f.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
