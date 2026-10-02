import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead } from "./primitives.jsx";

/** Accordion FAQ — renders only when the business has questions. */
export default function BizFaq() {
  const { business } = useBiz();
  const faqs = business.faqs || [];
  const [open, setOpen] = useState(0);
  if (!faqs.length) return null;

  return (
    <SectionShell id="faq" tone="alt">
      <SectionHead id="faq" />
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={i} delay={i * 0.04}>
              <div
                className="overflow-hidden border transition-colors duration-300"
                style={{
                  borderRadius: "calc(var(--r) * 0.8)",
                  background: "var(--card)",
                  borderColor: isOpen ? "var(--p)" : "var(--line)",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="text-[14.5px] font-bold sm:text-[15px]">{f.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0 text-[var(--muted)]">
                    <ChevronDown size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-[var(--muted)] sm:px-6 sm:text-[14px]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
