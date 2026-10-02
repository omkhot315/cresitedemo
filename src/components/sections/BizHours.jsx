import { Clock } from "lucide-react";
import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead } from "./primitives.jsx";
import { withAlpha } from "../../utils/businessUtils.js";

/** Opening hours as an elegant editorial list. */
export default function BizHours() {
  const { business, skin } = useBiz();
  const hours = business.hours || [];
  if (!hours.length) return null;

  return (
    <SectionShell id="hours" tone="alt">
      <SectionHead id="hours" />
      <Reveal>
        <div
          className="mx-auto max-w-2xl border p-6 sm:p-9"
          style={{ borderRadius: "var(--r)", background: "var(--card)", borderColor: "var(--line)" }}
        >
          <div className="mb-6 flex items-center gap-3 border-b pb-5" style={{ borderColor: "var(--line)" }}>
            <span
              className="grid h-11 w-11 place-items-center rounded-xl"
              style={{ background: withAlpha(skin.theme.primary, 0.12), color: "var(--p)" }}
            >
              <Clock size={19} />
            </span>
            <div>
              <p className="text-sm font-bold">Walk-ins & appointments</p>
              <p className="text-xs text-[var(--muted)]">Call ahead to skip the wait — we love being ready for you.</p>
            </div>
          </div>
          {hours.map((h, i) => (
            <div
              key={i}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-4 last:border-0 last:pb-0"
              style={{ borderColor: "var(--line)" }}
            >
              <span
                className="text-[14.5px] font-bold"
                style={{
                  fontFamily: skin.heading.transform === "uppercase" ? skin.fonts.display : undefined,
                  textTransform: skin.heading.transform === "uppercase" ? "uppercase" : undefined,
                  letterSpacing: skin.heading.transform === "uppercase" ? "0.06em" : undefined,
                }}
              >
                {h.day}
              </span>
              <span className="hidden flex-1 border-b border-dotted sm:mx-3 sm:block" style={{ borderColor: withAlpha(skin.theme.muted, 0.45) }} />
              <span className="text-[13.5px] text-[var(--muted)] sm:text-[14px]">{h.time}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}
