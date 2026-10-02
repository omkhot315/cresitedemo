import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Check, Loader2, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { getCategory } from "../../data/categories.js";
import { templateForCategory } from "../../templates/registry.js";
import { PLANS } from "../../data/plans.js";
import {
  generateBusinessDraft, summariseDraft, GENERATION_STEPS, TONES, cityFromAddress,
} from "../../services/aiGenerator.js";
import { withAlpha } from "../../utils/businessUtils.js";
import BizIcon from "../common/BizIcon.jsx";
import PhoneInput from "../common/PhoneInput.jsx";

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-black/25 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11.5px] text-[#8E8E96]">{hint}</span>}
    </label>
  );
}

/**
 * "Generate with AI" tab.
 *
 * Collects a handful of details, then fills the chosen category's template
 * with professionally written, personalised content. Everything it produces
 * stays fully editable in the builder afterwards.
 */
export default function AiGeneratePanel({ category, onCategoryChange, onGenerated }) {
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    tone: "professional",
    plan: "basic",
  });
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const cat = getCategory(category);
  const template = templateForCategory(category);

  const generate = () => {
    setError("");
    if (!form.name.trim()) {
      setError("Please enter your business name so we can write about it.");
      return;
    }
    if (!form.plan) {
      setError("Please choose a plan for your website.");
      return;
    }
    setBusy(true);
    setResult(null);
    setStep(0);

    /* Walk the progress steps, then hand the finished draft to the builder. */
    timers.current.forEach(clearTimeout);
    timers.current = GENERATION_STEPS.map((_, i) =>
      setTimeout(() => setStep(i), i * 320)
    );

    timers.current.push(
      setTimeout(() => {
        try {
          const draft = generateBusinessDraft({ ...form, category });
          setResult(draft);
          setBusy(false);
          setStep(GENERATION_STEPS.length);
        } catch (e) {
          setError(e.message || "Something went wrong while generating.");
          setBusy(false);
          setStep(-1);
        }
      }, GENERATION_STEPS.length * 320 + 250)
    );
  };

  const city = form.city || cityFromAddress(form.address);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      {/* ------------------------------- the form ------------------------------ */}
      <div className="space-y-5">
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50/60 p-6 sm:p-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600 shadow-sm">
            <Sparkles size={12} /> Generate with AI
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold">Your website, written for you</h2>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-[#55555E]">
            Answer a few questions and we'll fill your <strong>{cat.label}</strong> template with a headline, story,
            services, reviews, FAQs and photos — all tailored to your business and fully editable afterwards.
          </p>
        </div>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-7">
          <h3 className="font-display text-[16px] font-bold">Tell us about your business</h3>
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Business name" hint="Used throughout your new website.">
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="e.g. Smile Dental Care"
                  autoFocus
                />
              </Field>
              {/* Chosen in step 1 — shown here for confirmation, not re-picked. */}
              <Field label="Business type" hint="Chosen in the previous step.">
                <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-black/[0.03] px-4 py-2.5">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                    style={{ background: withAlpha(template.theme.primary, 0.14), color: template.theme.primary }}
                  >
                    <BizIcon name={cat.icon} size={14} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{cat.label}</span>
                  <Check size={15} className="shrink-0 text-emerald-600" />
                </div>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" hint="Mentioned naturally in your story.">
                <input
                  className={inputCls}
                  value={form.city}
                  onChange={(e) => set({ city: e.target.value })}
                  placeholder="e.g. Pune"
                />
              </Field>
              <Field label="Phone">
                <PhoneInput
                  value={form.phone}
                  onChange={(value) => set({ phone: value })}
                  className="border-black/10"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="WhatsApp (optional)">
                <PhoneInput
                  value={form.whatsapp}
                  onChange={(value) => set({ whatsapp: value })}
                  placeholder="Same as phone if blank"
                  className="border-black/10"
                  ariaLabel="WhatsApp number"
                />
              </Field>
              <Field label="Email (optional)">
                <input
                  className={inputCls}
                  value={form.email}
                  onChange={(e) => set({ email: e.target.value })}
                  placeholder="you@business.com"
                />
              </Field>
            </div>

            <Field label="Address (optional)" hint="Adds a live Google Map to your contact section.">
              <textarea
                rows={2}
                className={`${inputCls} resize-none`}
                value={form.address}
                onChange={(e) => set({ address: e.target.value })}
                placeholder="Shop no, street, area, city, state — pincode"
              />
            </Field>

            <div>
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">
                Plan <span className="text-red-500">· required</span>
              </span>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set({ plan: p.id })}
                    className={`relative rounded-2xl border p-3 text-left transition ${
                      form.plan === p.id
                        ? "border-indigo-500 bg-indigo-50/60 shadow-sm"
                        : "border-black/10 bg-white hover:border-indigo-300"
                    }`}
                  >
                    {p.highlighted && (
                      <span className="absolute -top-2 right-2 rounded-full bg-[#101014] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        Popular
                      </span>
                    )}
                    <span className={`block text-[12.5px] font-bold ${form.plan === p.id ? "text-indigo-700" : ""}`}>
                      {p.name}
                    </span>
                    <span className="mt-1 block font-display text-base font-bold">
                      {p.price === null ? "Custom" : `₹${p.price.toLocaleString("en-IN")}`}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#77777F]">{p.per}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">
                Writing tone
              </span>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => set({ tone: t.id })}
                    className={`rounded-2xl border p-3 text-left transition ${
                      form.tone === t.id
                        ? "border-indigo-500 bg-indigo-50/60 shadow-sm"
                        : "border-black/10 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <span className={`block text-[13px] font-bold ${form.tone === t.id ? "text-indigo-700" : ""}`}>
                      {t.label}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-[#77777F]">{t.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] font-semibold text-red-600">
                <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
              </p>
            )}

            <button
              type="button"
              onClick={generate}
              disabled={busy}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#5046E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA] disabled:opacity-60 sm:w-auto"
            >
              {busy ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Generating your website…
                </>
              ) : result ? (
                <>
                  <RefreshCw size={16} /> Generate again
                </>
              ) : (
                <>
                  <Wand2 size={16} /> Generate my website
                </>
              )}
            </button>
          </div>
        </section>
      </div>

      {/* ------------------------------ status panel ----------------------------- */}
      <div className="lg:sticky lg:top-24">
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <div className="flex items-center gap-2">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{ background: withAlpha(template.theme.primary, 0.12), color: template.theme.primary }}
            >
              <Sparkles size={17} />
            </span>
            <div>
              <p className="font-display text-[14.5px] font-bold">{template.name} template</p>
              <p className="text-[11.5px] text-[#77777F]">{cat.label}</p>
            </div>
          </div>

          {/* progress */}
          <div className="mt-5 space-y-2.5">
            {GENERATION_STEPS.map((label, i) => {
              const done = step > i || (!!result && !busy);
              const active = busy && step === i;
              return (
                <div key={label} className="flex items-center gap-2.5">
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition ${
                      done ? "bg-emerald-100 text-emerald-700" : active ? "bg-indigo-100 text-indigo-600" : "bg-black/5 text-[#C4C4CC]"
                    }`}
                  >
                    {done ? <Check size={11} strokeWidth={3} /> : active ? <Loader2 size={11} className="animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span className={`text-[12.5px] ${done || active ? "font-semibold text-[#101014]" : "text-[#A1A1AA]"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {result && !busy && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 border-t border-black/5 pt-5"
              >
                <p className="flex items-center gap-2 text-[13px] font-bold text-emerald-700">
                  <Check size={14} strokeWidth={3} /> Your website is ready
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[#55555E]">
                  <strong>{result.name}</strong> — “{result.tagline}”
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {summariseDraft(result).map((c) => (
                    <span key={c} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      {c}
                    </span>
                  ))}
                </div>
                {city && (
                  <p className="mt-3 text-[11.5px] text-[#8E8E96]">
                    Written for a business in <strong className="text-[#55555E]">{city}</strong>.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => onGenerated(result)}
                  className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#101014] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#5046E5]"
                >
                  Open in editor
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="mt-2.5 text-center text-[11px] text-[#A1A1AA]">
                  Every word and photo stays editable.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !busy && (
            <p className="mt-6 border-t border-black/5 pt-5 text-[12px] leading-relaxed text-[#77777F]">
              Nothing is published automatically. You'll review everything in the editor first.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
