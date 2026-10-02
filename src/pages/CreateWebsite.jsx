import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, PencilRuler, Check, RefreshCw } from "lucide-react";
import PlatformNav from "../components/common/PlatformNav.jsx";
import BusinessForm from "../components/dashboard/BusinessForm.jsx";
import AiGeneratePanel from "../components/dashboard/AiGeneratePanel.jsx";
import BusinessTypeStep from "../components/dashboard/BusinessTypeStep.jsx";
import BizIcon from "../components/common/BizIcon.jsx";
import { draftFromCategory, templateForCategory } from "../templates/registry.js";
import { CATEGORIES, getCategory } from "../data/categories.js";
import { withAlpha } from "../utils/businessUtils.js";

/**
 * /create — the business creation flow.
 *
 *   Step 1  "What type of business do you have?" — type it in plain words
 *           and we resolve it to one of the 86 categories automatically,
 *           so the category dropdown is skipped entirely.
 *   Step 2  Generate with AI, or build it yourself. Both land in the same
 *           editor, so generated content stays fully editable.
 */
export default function CreateWebsite() {
  const [params] = useSearchParams();
  const catParam = params.get("category");
  /* A ?category= link (from the homepage cards) skips straight to step 2. */
  const presetCategory = CATEGORIES.some((c) => c.id === catParam) ? catParam : null;

  const [category, setCategory] = useState(presetCategory);
  const [tab, setTab] = useState("ai");
  /** Set once AI generation finishes; otherwise the editor starts empty. */
  const [aiDraft, setAiDraft] = useState(null);

  const emptyDraft = useMemo(() => (category ? draftFromCategory(category) : null), [category]);
  const cat = category ? getCategory(category) : null;
  const template = category ? templateForCategory(category) : null;
  const draft = aiDraft || emptyDraft;
  const formKey = aiDraft ? `ai-${aiDraft.id}` : `blank-${category}`;

  const pickType = (categoryId) => {
    setCategory(categoryId);
    setAiDraft(null);
    setTab("ai");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeType = () => {
    setCategory(null);
    setAiDraft(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openInEditor = (generated) => {
    setAiDraft(generated);
    setTab("manual");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const switchTab = (next) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#101014]">
      <PlatformNav />
      <main className="mx-auto max-w-[92rem] px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#77777F] transition hover:text-[#101014]"
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>

        {/* ============================= STEP 1 ============================= */}
        {!category ? (
          <div className="py-8 sm:py-12">
            <BusinessTypeStep onSelect={pickType} />
          </div>
        ) : (
          <>
            {/* ---------------------- chosen type summary ---------------------- */}
            <div className="mb-7 mt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                  style={{ background: withAlpha(template.theme.primary, 0.12), color: template.theme.primary }}
                >
                  <BizIcon name={cat.icon} size={22} />
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-display text-xl font-bold sm:text-2xl">
                    {cat.label}
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      <Check size={10} strokeWidth={3} /> Selected
                    </span>
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#77777F]">
                    Its own design, layout and content are ready to go.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={changeType}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2.5 text-[12.5px] font-bold transition hover:border-indigo-400 hover:text-indigo-600"
              >
                <RefreshCw size={13} /> Change business type
              </button>
            </div>

            {/* --------------------------- step 2 tabs -------------------------- */}
            <div className="mb-8 flex w-full max-w-md overflow-hidden rounded-full bg-black/5 p-1">
              {[
                { id: "ai", label: "Generate with AI", icon: Sparkles },
                { id: "manual", label: aiDraft ? "Editor" : "Build it myself", icon: PencilRuler },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => switchTab(t.id)}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[13.5px] font-bold transition ${
                    tab === t.id ? "bg-white shadow" : "text-[#77777F] hover:text-[#101014]"
                  }`}
                >
                  <t.icon size={14} /> {t.label}
                </button>
              ))}
            </div>

            {tab === "ai" ? (
              <AiGeneratePanel category={category} onCategoryChange={setCategory} onGenerated={openInEditor} />
            ) : (
              <>
                {aiDraft && (
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/60 px-5 py-3.5">
                    <p className="flex items-center gap-2 text-[12.5px] text-[#55555E]">
                      <Sparkles size={14} className="shrink-0 text-indigo-600" />
                      AI-generated content loaded — review and edit anything before saving.
                    </p>
                    <button
                      onClick={() => setAiDraft(null)}
                      className="rounded-full border border-black/15 px-3.5 py-1.5 text-[11.5px] font-bold transition hover:border-black/30"
                    >
                      Start empty instead
                    </button>
                  </div>
                )}
                <BusinessForm mode="create" initial={draft} key={formKey} />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
