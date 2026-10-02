import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Sparkles, X, CornerDownLeft } from "lucide-react";
import { CATEGORIES, getCategory } from "../../data/categories.js";
import { searchCategories, POPULAR } from "../../data/categoryKeywords.js";
import { templateForCategory } from "../../templates/registry.js";
import BizIcon from "../common/BizIcon.jsx";
import { withAlpha } from "../../utils/businessUtils.js";

/**
 * Step 1 of website creation: "What type of business do you have?"
 *
 * The visitor types in their own words ("furniture", "dentist", "mithai")
 * and we resolve it to one of the 86 categories — so they never scroll a
 * dropdown. Picking a match jumps straight to building the website.
 */
export default function BusinessTypeStep({ onSelect, initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => searchCategories(query, 8), [query]);
  const popular = useMemo(() => POPULAR.map((id) => getCategory(id)), []);
  const hasQuery = query.trim().length > 0;

  useEffect(() => setActive(0), [query]);

  const choose = (categoryId) => onSelect(categoryId);

  const onKeyDown = (e) => {
    if (!results.length) {
      if (e.key === "Enter" && hasQuery) choose("other");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active].category.id);
    }
  };

  /** A category tile with its own template colours, so the choice feels real. */
  const Tile = ({ category, highlighted, onClick }) => {
    const tpl = templateForCategory(category.id);
    return (
      <button
        type="button"
        onMouseEnter={onClick ? undefined : undefined}
        onClick={onClick}
        className={`group flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${
          highlighted
            ? "border-indigo-500 bg-indigo-50/70 shadow-sm"
            : "border-black/10 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
        }`}
      >
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105"
          style={{ background: withAlpha(tpl.theme.primary, 0.12), color: tpl.theme.primary }}
        >
          <BizIcon name={category.icon} size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-bold">{category.label}</span>
          <span className="block truncate text-[11.5px] text-[#77777F]">{category.blurb}</span>
        </span>
        <ArrowRight
          size={15}
          className={`shrink-0 transition ${highlighted ? "text-indigo-600" : "text-black/20 group-hover:text-indigo-500"}`}
        />
      </button>
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* ------------------------------- heading ------------------------------ */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
          <Sparkles size={12} /> Step 1 of 2
        </span>
        <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight sm:text-[2.6rem] sm:leading-tight">
          What type of business do you have?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#55555E]">
          Just type it in your own words — we'll pick the right design and write your content automatically.
        </p>
      </div>

      {/* ------------------------------- search ------------------------------- */}
      <div className="relative mt-8">
        <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A1AA]">
          <Search size={19} />
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="e.g. furniture, dentist, cake shop, AC repair…"
          className="w-full rounded-2xl border-2 border-black/10 bg-white py-4 pl-14 pr-12 text-[16px] font-medium shadow-sm outline-none transition placeholder:font-normal placeholder:text-black/25 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          aria-label="Search your business type"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-black/5 text-[#77777F] transition hover:bg-black/10"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ------------------------------- results ------------------------------ */}
      <AnimatePresence mode="wait">
        {hasQuery ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mt-5"
          >
            {results.length > 0 ? (
              <>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#77777F]">
                    {results.length} match{results.length === 1 ? "" : "es"}
                  </p>
                  <p className="hidden items-center gap-1.5 text-[11.5px] text-[#A1A1AA] sm:flex">
                    <CornerDownLeft size={12} /> Press Enter to pick the first
                  </p>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {results.map((r, i) => (
                    <Tile
                      key={r.category.id}
                      category={r.category}
                      highlighted={i === active}
                      onClick={() => choose(r.category.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center">
                <p className="font-display text-[16px] font-bold">No exact match for “{query}”</p>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[#77777F]">
                  That's fine — the general business template adapts to any trade, and you can edit every word.
                </p>
                <button
                  type="button"
                  onClick={() => choose("other")}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#5046E5] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA]"
                >
                  Continue with a general template <ArrowRight size={15} />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="popular"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mt-6"
          >
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#77777F]">
              Or pick a popular one
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {popular.map((category) => (
                <Tile key={category.id} category={category} onClick={() => choose(category.id)} />
              ))}
            </div>
            <p className="mt-5 text-center text-[12.5px] text-[#77777F]">
              {CATEGORIES.length} business types available ·{" "}
              <button
                type="button"
                onClick={() => choose("other")}
                className="font-bold text-[#5046E5] transition hover:text-[#4338CA]"
              >
                mine isn't listed
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
