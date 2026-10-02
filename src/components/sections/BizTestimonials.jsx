import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead, Stars, InitialAvatar } from "./primitives.jsx";

/**
 * Testimonials — card grid (clinic/gym/professional) or an auto-rotating
 * serif "spotlight" quote (cafe/salon/restaurant).
 */
export default function BizTestimonials() {
  const { business, skin } = useBiz();
  const list = business.testimonials || [];
  if (!list.length) return null;

  return skin.testimonialsVariant === "spotlight" ? <Spotlight list={list} /> : <Cards list={list} />;
}

function Cards({ list }) {
  const { skin } = useBiz();
  const dark = skin.scheme === "dark" || skin.scheme === "dark-elegant";
  return (
    <SectionShell id="testimonials" tone={dark ? "alt" : "base"}>
      <SectionHead id="testimonials" />
      <div className="grid gap-5 md:grid-cols-3">
        {list.slice(0, 6).map((t, i) => (
          <Reveal key={i} delay={i * 0.07} className="h-full">
            <figure
              className="flex h-full flex-col border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              style={{ borderRadius: "var(--r)", background: "var(--card)", borderColor: "var(--line)" }}
            >
              <Stars n={t.rating || 5} />
              <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-[var(--muted)]">“{t.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <InitialAvatar name={t.name} size={42} />
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-[var(--muted)]">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function Spotlight({ list }) {
  const { skin } = useBiz();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % list.length), 6500);
    return () => clearInterval(t);
  }, [list.length]);

  const item = list[idx];

  return (
    <SectionShell id="testimonials">
      <SectionHead id="testimonials" />
      <Reveal className="mx-auto max-w-3xl text-center">
        <span
          className="mx-auto grid h-14 w-14 place-items-center rounded-full"
          style={{ background: "var(--p)", color: "var(--onp)" }}
        >
          <Quote size={22} />
        </span>
        <div className="relative mt-8 min-h-[170px] sm:min-h-[150px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="text-balance"
                style={{
                  fontFamily: skin.fonts.display,
                  fontStyle: "italic",
                  fontSize: "clamp(1.25rem, 2.6vw, 1.7rem)",
                  lineHeight: 1.4,
                }}
              >
                “{item.text}”
              </p>
              <Stars n={item.rating || 5} className="mt-6 justify-center" />
              <p className="mt-4 text-sm font-bold">{item.name}</p>
              <p className="text-xs text-[var(--muted)]">{item.role}</p>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setIdx((idx - 1 + list.length) % list.length)}
            className="grid h-10 w-10 place-items-center rounded-full border transition hover:scale-105"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            aria-label="Previous review"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Review ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === idx ? 22 : 6, background: i === idx ? "var(--p)" : "var(--line)" }}
              />
            ))}
          </div>
          <button
            onClick={() => setIdx((idx + 1) % list.length)}
            className="grid h-10 w-10 place-items-center rounded-full border transition hover:scale-105"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            aria-label="Next review"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </Reveal>
    </SectionShell>
  );
}
