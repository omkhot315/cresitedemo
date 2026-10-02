import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor, Tablet, Smartphone, Plus, Trash2, EyeOff, Rocket, Check, RefreshCw, Lock,
  Copy, ExternalLink, PartyPopper, AlertCircle, ChevronDown, GripVertical, Layers, Crown,
  X, Maximize2,
} from "lucide-react";
import { CATEGORIES, getCategory } from "../../data/categories.js";
import {
  templateForCategory, placeholdersFor, editorsFor, sectionListFor, defaultSectionIds,
} from "../../templates/registry.js";
import { useBusinesses } from "../../store/BusinessContext.jsx";
import { useAuth } from "../../store/AuthContext.jsx";
import BusinessWebsite from "../business/BusinessWebsite.jsx";
import { ImageField, GalleryField } from "./ImageUploader.jsx";
import CheckoutModal from "./CheckoutModal.jsx";
import PhoneInput from "../common/PhoneInput.jsx";
import { ICON_CHOICES } from "../common/BizIcon.jsx";
import { PLANS, getPlan } from "../../data/plans.js";
import { isValidSlug, slugify, withAlpha, PLATFORM_URL } from "../../utils/businessUtils.js";

/* ---------------------------------- atoms ---------------------------------- */
const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-black/25 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

/** Sections that can never be switched off. */
const REQUIRED = ["hero"];

function Field({ label, hint, children }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">{label}</span>
      )}
      {children}
      {hint && <span className="mt-1 block text-[11.5px] text-[#8E8E96]">{hint}</span>}
    </label>
  );
}

/** Accessible on/off switch. */
function Switch({ on, onChange, label, disabled = false, size = "md" }) {
  const w = size === "sm" ? 36 : 44;
  const h = size === "sm" ? 20 : 24;
  const knob = size === "sm" ? 14 : 18;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      title={disabled ? "This section is always shown" : on ? "Shown — click to hide" : "Hidden — click to show"}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative shrink-0 rounded-full transition-colors ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}`}
      style={{ width: w, height: h, background: on ? "#22C55E" : "#D4D4D8" }}
    >
      <span
        className="absolute top-1/2 rounded-full bg-white shadow transition-all"
        style={{ width: knob, height: knob, left: on ? w - knob - 3 : 3, transform: "translateY(-50%)" }}
      />
    </button>
  );
}

/**
 * Collapsible content section.
 * When `onToggleHidden` is provided the header gains a show/hide switch that
 * controls whether the section appears on the published website.
 * Pass `open`/`onToggle` to control expansion from the parent (used by the
 * Plan card, which validation opens when no plan is chosen).
 */
function Card({
  title,
  sub,
  count,
  required,
  defaultOpen = true,
  hidden = false,
  onToggleHidden,
  open: controlledOpen,
  onToggle,
  children,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onToggle ?? setUncontrolledOpen;
  const filled = count === undefined ? null : count > 0;
  return (
    <section
      className={`overflow-hidden rounded-3xl border bg-white transition ${
        hidden ? "border-black/10 opacity-70" : "border-black/10"
      }`}
    >
      <div className="flex items-center gap-3 px-6 py-5 sm:px-7">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <div className="min-w-0 flex-1">
            <h3 className="flex flex-wrap items-center gap-2 font-display text-[16px] font-bold">
              {title}
              {required && <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">required</span>}
              {hidden ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  <EyeOff size={9} /> hidden
                </span>
              ) : (
                <>
                  {filled === true && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {count} added
                    </span>
                  )}
                  {filled === false && (
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-[#A1A1AA]">empty</span>
                  )}
                </>
              )}
            </h3>
            <p className="mt-1 text-[12.5px] text-[#77777F]">
              {hidden ? "Switched off — this section won't appear on your website." : sub}
            </p>
          </div>
          <ChevronDown size={18} className={`shrink-0 text-[#A1A1AA] transition ${open ? "rotate-180" : ""}`} />
        </button>
        {onToggleHidden && <Switch on={!hidden} onChange={onToggleHidden} label={`Show ${title} section`} />}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className={`space-y-4 px-6 pb-6 sm:px-7 ${hidden ? "pointer-events-none opacity-50" : ""}`}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Repeating list rows with add/remove — used by every content editor. */
function Repeater({ items, onAdd, addLabel, emptyText, children }) {
  return (
    <>
      {items.length === 0 && (
        <p className="rounded-xl border border-dashed border-black/15 bg-black/[0.02] px-4 py-5 text-center text-[12.5px] text-[#8E8E96]">
          {emptyText}
        </p>
      )}
      {children}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-black/20 px-4 py-2 text-[12px] font-bold text-[#55555E] transition hover:border-indigo-400 hover:text-indigo-600"
      >
        <Plus size={13} /> {addLabel}
      </button>
    </>
  );
}

function Row({ index, label, onRemove, children }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#FBFAF7] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-black/40">
          <GripVertical size={12} /> {label} {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="grid h-7 w-7 place-items-center rounded-lg text-black/35 transition hover:bg-red-50 hover:text-red-500"
          aria-label="Remove"
        >
          <Trash2 size={13} />
        </button>
      </div>
      {children}
    </div>
  );
}

function IconPicker({ value, onChange }) {
  return (
    <select className={inputCls} value={value || "Sparkles"} onChange={(e) => onChange(e.target.value)}>
      {ICON_CHOICES.map((i) => (
        <option key={i} value={i}>
          {i}
        </option>
      ))}
    </select>
  );
}

/* ------------------------- real responsive preview ------------------------- */
const DEVICES = {
  desktop: { width: 1200, label: "Desktop", icon: Monitor },
  tablet: { width: 834, label: "Tablet", icon: Tablet },
  mobile: { width: 390, label: "Mobile", icon: Smartphone },
};

/**
 * Copy the app's live styles into an iframe. React portals preserve context,
 * while the iframe gives CSS media queries a REAL device-width viewport.
 */
function preparePreviewDocument(frame) {
  const doc = frame?.contentDocument;
  if (!doc) return null;

  doc.documentElement.lang = "en";
  doc.documentElement.style.background = "#fff";
  doc.head.innerHTML = "";

  const base = doc.createElement("base");
  base.href = window.location.origin;
  doc.head.appendChild(base);

  document.head
    .querySelectorAll('style, link[rel="stylesheet"], link[rel="preconnect"]')
    .forEach((node) => doc.head.appendChild(node.cloneNode(true)));

  doc.body.innerHTML = '<div id="cresite-preview-root"></div>';
  doc.body.style.margin = "0";
  doc.body.style.minWidth = "0";
  doc.body.style.overflowX = "hidden";
  return doc.getElementById("cresite-preview-root");
}

function ResponsivePreview({ device, children, className = "h-[58vh] min-h-[430px]" }) {
  const outerRef = useRef(null);
  const frameRef = useRef(null);
  const [mount, setMount] = useState(null);
  const [scale, setScale] = useState(0.5);
  const [frameHeight, setFrameHeight] = useState(900);
  const { width } = DEVICES[device];

  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return undefined;
    const measure = () => {
      const availableWidth = Math.max(1, outer.clientWidth - 28);
      const availableHeight = Math.max(320, outer.clientHeight - 28);
      const nextScale = Math.min(1, availableWidth / width);
      setScale(nextScale);
      // The scaled iframe fills the visible panel; its own scrollbar scrolls the site.
      setFrameHeight(Math.max(360, Math.floor(availableHeight / nextScale)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [width]);

  useEffect(() => {
    setMount(null);
    const timer = setTimeout(() => {
      if (frameRef.current) setMount(preparePreviewDocument(frameRef.current));
    }, 0);
    return () => clearTimeout(timer);
  }, [device]);

  const visualWidth = width * scale;
  const visualHeight = frameHeight * scale;

  return (
    <div
      ref={outerRef}
      className={`w-full overflow-hidden rounded-2xl border border-black/10 bg-[#EAE8E2] p-3 sm:p-3.5 ${className}`}
    >
      <div
        className="relative mx-auto overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/10"
        style={{ width: visualWidth, height: visualHeight }}
      >
        <iframe
          key={device}
          ref={frameRef}
          title={`${DEVICES[device].label} website preview`}
          srcDoc="<!doctype html><html><head></head><body><div id='cresite-preview-root'></div></body></html>"
          onLoad={() => setMount(preparePreviewDocument(frameRef.current))}
          className="absolute left-0 top-0 border-0 bg-white"
          style={{
            width,
            height: frameHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
        {!mount && (
          <div className="absolute inset-0 grid place-items-center bg-white">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-indigo-500" />
          </div>
        )}
        {mount && createPortal(children, mount)}
      </div>
    </div>
  );
}

function DeviceTabs({ device, onChange, dark = false }) {
  return (
    <div className={`flex items-center gap-1 rounded-full p-1 ${dark ? "bg-white/10" : "bg-black/5"}`}>
      {Object.entries(DEVICES).map(([id, d]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-[11px] font-bold transition sm:px-3 ${
            device === id
              ? dark
                ? "bg-white text-[#101014] shadow"
                : "bg-white text-indigo-600 shadow"
              : dark
              ? "text-white/55 hover:text-white"
              : "text-black/35 hover:text-black/70"
          }`}
          aria-label={`${d.label} preview`}
          title={`${d.label} · ${d.width}px`}
        >
          <d.icon size={13} />
          <span className="hidden sm:inline">{d.label}</span>
        </button>
      ))}
    </div>
  );
}

function FullPreviewModal({ open, onClose, device, onDeviceChange, business }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex flex-col bg-[#15151A]"
        >
          <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 sm:px-6">
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-white">
                {business.name || "Your website"}
              </p>
              <p className="truncate font-mono text-[10.5px] text-white/40">
                {PLATFORM_URL}/{business.slug || "your-link"}
              </p>
            </div>
            <DeviceTabs device={device} onChange={onDeviceChange} dark />
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
          </header>

          <div className="min-h-0 flex-1 p-3 sm:p-5">
            <ResponsivePreview device={device} className="h-full min-h-0">
              <BusinessWebsite business={business} preview />
            </ResponsivePreview>
          </div>

          <footer className="flex h-9 shrink-0 items-center justify-center gap-2 text-[10.5px] text-white/35">
            <Maximize2 size={11} /> Actual responsive viewport · {DEVICES[device].width}px · Esc to close
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------- the form -------------------------------- */
export default function BusinessForm({ mode, initial, originalSlug }) {
  const { createBusiness, updateBusiness, businesses } = useBusinesses();
  const { isSuperAdmin } = useAuth();
  const [form, setForm] = useState(initial);
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [device, setDevice] = useState("desktop");
  const [fullPreview, setFullPreview] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const [copied, setCopied] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [payTarget, setPayTarget] = useState(null);
  /* The Plan card is controlled so validation can force it open. */
  const [planOpen, setPlanOpen] = useState(true);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setIn = (key, patch) => setForm((f) => ({ ...f, [key]: { ...f[key], ...patch } }));

  const template = templateForCategory(form.category);
  /**
   * Free publishing is attached to the website at creation time. This is true
   * for a new super-admin build or an existing payment-exempt website — not
   * merely because the current editor happens to be the super admin.
   */
  const isPaymentExempt =
    !!form.paymentExempt || form.createdByRole === "superadmin" || (mode === "create" && isSuperAdmin);
  const ph = useMemo(() => placeholdersFor(form.category), [form.category]);
  const show = useMemo(() => editorsFor(form.category), [form.category]);
  const slugTaken = mode === "create" && form.slug && !!businesses[form.slug];

  const previewBiz = useMemo(
    () => ({ ...form, gallery: (form.gallery || []).filter(Boolean), published: true }),
    [form]
  );

  const onName = (v) =>
    setForm((f) => ({ ...f, name: v, slug: mode === "create" && !slugEdited ? slugify(v) : f.slug }));

  const onSlug = (v) => {
    setSlugEdited(true);
    set({ slug: slugify(v) });
  };

  /* ------------------------ section visibility ------------------------ */
  const allSections = useMemo(() => sectionListFor(form.category), [form.category]);
  /** `sections === null` means "everything on" (the default for new drafts). */
  const enabledIds = useMemo(
    () => (Array.isArray(form.sections) ? form.sections : defaultSectionIds(form.category)),
    [form.sections, form.category]
  );
  const isOn = (id) => enabledIds.includes(id);

  const toggleSection = (id) => {
    if (REQUIRED.includes(id)) return;
    const all = defaultSectionIds(form.category);
    const next = new Set(enabledIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    set({ sections: all.filter((s) => next.has(s)) }); // keep template order
  };

  const setAllSections = (on) =>
    set({ sections: on ? defaultSectionIds(form.category) : defaultSectionIds(form.category).filter((s) => REQUIRED.includes(s)) });

  /** Switching category keeps typed content AND which sections were hidden. */
  const onCategory = (catId) =>
    setForm((f) => {
      if (!Array.isArray(f.sections)) return { ...f, category: catId };
      const off = new Set(defaultSectionIds(f.category).filter((s) => !f.sections.includes(s)));
      return { ...f, category: catId, sections: defaultSectionIds(catId).filter((s) => !off.has(s)) };
    });

  /* generic list helpers */
  const rows = (key) => form[key] || [];
  const editRow = (key, i, patch) =>
    setForm((f) => {
      const arr = [...(f[key] || [])];
      arr[i] = { ...arr[i], ...patch };
      return { ...f, [key]: arr };
    });
  const addRow = (key, row) => setForm((f) => ({ ...f, [key]: [...(f[key] || []), row] }));
  const removeRow = (key, i) => setForm((f) => ({ ...f, [key]: (f[key] || []).filter((_, x) => x !== i) }));

  /* nested menu helpers */
  const editGroup = (gi, patch) => editRow("menu", gi, patch);
  const addItem = (gi) =>
    setForm((f) => {
      const menu = [...f.menu];
      menu[gi] = { ...menu[gi], items: [...(menu[gi].items || []), { name: "", description: "", price: "", tag: "" }] };
      return { ...f, menu };
    });
  const editItem = (gi, ii, patch) =>
    setForm((f) => {
      const menu = [...f.menu];
      const items = [...menu[gi].items];
      items[ii] = { ...items[ii], ...patch };
      menu[gi] = { ...menu[gi], items };
      return { ...f, menu };
    });
  const removeItem = (gi, ii) =>
    setForm((f) => {
      const menu = [...f.menu];
      menu[gi] = { ...menu[gi], items: menu[gi].items.filter((_, x) => x !== ii) };
      return { ...f, menu };
    });

  /** Strip protocol and trailing slashes so "https://x.com/" becomes "x.com". */
  const normalizeDomain = (raw) => {
    let v = String(raw || "").trim();
    if (v.startsWith("https://")) v = v.slice(8);
    else if (v.startsWith("http://")) v = v.slice(7);
    while (v.endsWith("/")) v = v.slice(0, -1);
    return v;
  };

  /* plan feature bullets */
  const setPlanFeatures = (i, text) => editRow("plans", i, { features: text.split("\n") });

  /** Does a section have anything to render yet? Drives the toggle hints. */
  const hasContent = (id) => {
    switch (id) {
      case "hero":
        return !!(form.name.trim() || form.tagline.trim() || form.heroImage);
      case "about":
        return !!(form.about.trim() || rows("stats").length);
      case "features":
        return rows("features").length > 0;
      case "services":
        return rows("services").length > 0;
      case "menu":
        return rows("menu").some((g) => g.items?.length);
      case "pricing":
        return rows("plans").length > 0;
      case "team":
        return rows("team").length > 0;
      case "gallery":
        return rows("gallery").filter(Boolean).length > 0;
      case "testimonials":
        return rows("testimonials").length > 0;
      case "hours":
        return rows("hours").length > 0;
      case "faq":
        return rows("faqs").length > 0;
      case "contact":
        return !!(form.contact.phone || form.contact.email || form.contact.address);
      default:
        return true;
    }
  };

  /** What still needs content — hidden sections are skipped entirely. */
  const checklist = useMemo(() => {
    const c = [
      { label: "Plan selected", done: !!form.plan, required: true },
      { label: "Business name", done: !!form.name.trim() },
      { label: "Website link", done: !!form.slug && isValidSlug(form.slug) },
      { label: "Tagline", done: !!form.tagline.trim() },
      { label: "Hero image", done: !!form.heroImage },
      { label: "Phone or WhatsApp", done: !!(form.contact.phone || form.contact.whatsapp) },
    ];
    if (isOn("about")) c.push({ label: "About text", done: !!form.about.trim() });
    if (isOn("contact")) c.push({ label: "Address", done: !!form.contact.address.trim() });
    if (isOn("hours")) c.push({ label: "Opening hours", done: rows("hours").length > 0 });
    if (show.services && isOn("services")) c.push({ label: "Services", done: rows("services").length > 0 });
    if (show.menu && isOn("menu")) c.push({ label: "Menu items", done: rows("menu").some((g) => g.items?.length) });
    if (show.plans && isOn("pricing")) c.push({ label: "Plans", done: rows("plans").length > 0 });
    if (show.team && isOn("team")) c.push({ label: "Team members", done: rows("team").length > 0 });
    if (show.gallery && isOn("gallery")) c.push({ label: "Gallery photos", done: rows("gallery").filter(Boolean).length > 0 });
    if (show.testimonials && isOn("testimonials")) c.push({ label: "Reviews", done: rows("testimonials").length > 0 });
    if (show.faqs && isOn("faq")) c.push({ label: "FAQs", done: rows("faqs").length > 0 });
    return c;
  }, [form, show, enabledIds]);

  const doneCount = checklist.filter((c) => c.done).length;
  const progress = Math.round((doneCount / checklist.length) * 100);

  const save = async () => {
    setError("");
    if (!form.name.trim()) return setError("Please enter your business name.");
    if (!form.slug || !isValidSlug(form.slug))
      return setError("Choose a valid link — lowercase letters, numbers and dashes only (and not a reserved word).");
    /* A hosting plan is required before a website can be saved. */
    if (!form.plan) {
      setPlanOpen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return setError("Please choose a plan for your website before saving.");
    }
    setSaving(true);
    const cleaned = {
      ...form,
      name: form.name.trim(),
      gallery: (form.gallery || []).filter(Boolean),
      menu: (form.menu || []).filter((g) => g.category?.trim() || g.items?.length),
      plans: (form.plans || []).map((p) => ({ ...p, features: (p.features || []).filter(Boolean) })),
    };
    const res = mode === "create" ? await createBusiness(cleaned) : await updateBusiness(originalSlug, cleaned);
    setSaving(false);
    if (!res.ok) return setError(res.error);
    if (mode === "edit" && res.business.slug !== originalSlug) {
      window.history.replaceState(null, "", `/business/${res.business.slug}/edit`);
    }
    setSaved(res.business);

    /* Saved but unpaid → publishing is gated, so offer payment immediately. */
    const exempt = res.business.paymentExempt || res.business.createdByRole === "superadmin";
    if (
      !res.business.paid &&
      res.business.plan &&
      res.business.plan !== "custom" &&
      !exempt
    ) {
      setPayTarget(res.business);
      setCheckout(true);
    }
    return null;
  };

  const origin = typeof window !== "undefined" ? window.location.origin : `https://${PLATFORM_URL}`;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,470px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,540px)]">
      {/* ------------------------------- LEFT: INPUTS ------------------------------ */}
      <div className="min-w-0 space-y-5">
        {/* progress */}
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-[15px] font-bold">Content checklist</p>
            <span className="text-[12.5px] font-bold text-indigo-700">
              {doneCount} / {checklist.length} complete
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {checklist.map((c) => (
              <span
                key={c.label}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  c.done ? "bg-emerald-100 text-emerald-700" : "bg-white text-[#8E8E96]"
                }`}
              >
                {c.done ? <Check size={10} strokeWidth={3} /> : <AlertCircle size={10} />} {c.label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] text-[#55555E]">
            Nothing is pre-filled — every section below stays hidden on the live site until you add its content.
          </p>
        </div>


        {/* ---------------------------- plan ---------------------------- */}
        <Card
          title="Plan"
          required
          open={planOpen}
          onToggle={setPlanOpen}
          sub={
            isPaymentExempt
              ? "Super-admin-created websites publish free — pick a hosting type to continue."
              : "Choose how this website is hosted. A plan is required before you can save."
          }
          count={form.plan ? 1 : 0}
        >
          {isPaymentExempt && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <Crown size={15} />
              </span>
              <div>
                <p className="text-[13px] font-bold text-emerald-800">Free super admin website</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-emerald-700">
                  No Cashfree payment is needed. Save the website and it publishes immediately.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLANS.map((p) => {
              const on = form.plan === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => set({ plan: p.id, customDomain: p.customDomain ? form.customDomain : "" })}
                  className={`relative rounded-2xl border p-4 text-left transition ${
                    on ? "border-indigo-500 bg-indigo-50/60 shadow-sm" : "border-black/10 bg-white hover:border-indigo-300"
                  }`}
                >
                  {p.highlighted && (
                    <span className="absolute -top-2 right-3 rounded-full bg-[#101014] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      Popular
                    </span>
                  )}
                  <span className={`block font-display text-[13.5px] font-bold ${on ? "text-indigo-700" : ""}`}>{p.name}</span>
                  <span className="mt-1.5 flex items-baseline gap-1">
                    <span className="font-display text-xl font-bold">{p.priceLabel}</span>
                    <span className="text-[11px] text-[#77777F]">{p.per}</span>
                  </span>
                  <span className="mt-2 block text-[11.5px] leading-snug text-[#77777F]">{p.blurb}</span>
                  <span
                    className={`mt-3 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                      on ? "border-indigo-500 bg-indigo-500" : "border-black/20"
                    }`}
                  >
                    {on && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>

          {form.plan === "domain" && (
            <Field label="Your domain name" hint="We'll help you register it and connect it free for the first year.">
              <input
                className={inputCls}
                value={form.customDomain || ""}
                onChange={(e) => set({ customDomain: normalizeDomain(e.target.value) })}
                placeholder="yourbrand.com"
              />
            </Field>
          )}

          {form.plan === "custom" && !isPaymentExempt && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-800">
              Custom websites are quoted per project. Finish your site here to show us what you need, then{" "}
              <a href="/#contact" className="font-bold underline">
                talk to us
              </a>{" "}
              and we'll send a fixed price.
            </div>
          )}

          {form.plan && form.plan !== "custom" && !isPaymentExempt && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/60 px-4 py-3.5">
              <div>
                <p className="text-[13px] font-bold">
                  {getPlan(form.plan)?.priceLabel || "—"} · {getPlan(form.plan)?.name}
                </p>
                <p className="mt-0.5 text-[11.5px] text-[#55555E]">
                  {form.paid ? "Payment complete — plan active." : "Save your website first, then pay to activate it."}
                </p>
              </div>
              {form.paid ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  <Check size={12} strokeWidth={3} /> Paid
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setCheckout(true)}
                  disabled={!form.slug || !form.name.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5046E5] px-5 py-2.5 text-[12.5px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-40"
                  title={!form.slug || !form.name.trim() ? "Add a business name and link first" : undefined}
                >
                  <Lock size={13} /> Pay now
                </button>
              )}
            </div>
          )}
        </Card>

        {/* ------------------------ section visibility ------------------------ */}
        <Card
          title="Website sections"
          sub="Switch off anything you don't want — hidden sections disappear from the page and the menu."
          count={enabledIds.length}
          defaultOpen={false}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
            <p className="text-[12px] text-[#77777F]">
              {enabledIds.length} of {allSections.length} sections shown
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAllSections(true)}
                className="rounded-full border border-black/15 px-3.5 py-1.5 text-[11.5px] font-bold transition hover:border-indigo-400 hover:text-indigo-600"
              >
                Show all
              </button>
              <button
                type="button"
                onClick={() => setAllSections(false)}
                className="rounded-full border border-black/15 px-3.5 py-1.5 text-[11.5px] font-bold transition hover:border-red-300 hover:text-red-600"
              >
                Hide all
              </button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {allSections.map((s) => {
              const on = isOn(s.id);
              const empty = !hasContent(s.id);
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                    on ? "border-black/10 bg-white" : "border-black/10 bg-black/[0.03]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`flex items-center gap-1.5 text-[13px] font-bold ${on ? "" : "text-[#A1A1AA]"}`}>
                      {s.label}
                      {s.required && <Lock size={10} className="text-[#A1A1AA]" />}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#A1A1AA]">
                      {s.required
                        ? "Always shown"
                        : !on
                        ? "Hidden from your website"
                        : empty
                        ? "On — add content to make it appear"
                        : "Shown on your website"}
                    </p>
                  </div>
                  <Switch on={on} onChange={() => toggleSection(s.id)} disabled={s.required} label={`Show ${s.label}`} size="sm" />
                </div>
              );
            })}
          </div>

          <p className="flex items-start gap-2 rounded-xl bg-black/[0.03] px-4 py-3 text-[11.5px] text-[#55555E]">
            <Layers size={13} className="mt-0.5 shrink-0 text-indigo-500" />
            Your content is kept when a section is hidden — switch it back on any time and everything reappears.
          </p>
        </Card>

        {/* ---------------------------- basics ---------------------------- */}
        <Card title="The basics" sub="Drives your hero, browser tab and Google listing." required>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business name">
              <input className={inputCls} value={form.name} onChange={(e) => onName(e.target.value)} placeholder="e.g. PowerFit Gym" />
            </Field>
            <Field label="Category" hint="Changes the design only — your content is kept.">
              <select className={inputCls} value={form.category} onChange={(e) => onCategory(e.target.value)} disabled={mode === "edit"}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Website link" hint="Your free address on the platform — share it everywhere.">
            <div className="flex items-center overflow-hidden rounded-xl border border-black/10 bg-white focus-within:border-indigo-500">
              <span className="shrink-0 border-r border-black/10 bg-black/[0.03] px-3 py-2.5 text-[13px] font-medium text-black/40">
                {PLATFORM_URL}/
              </span>
              <input
                className="w-full px-3 py-2.5 font-mono text-[13px] outline-none"
                value={form.slug}
                onChange={(e) => onSlug(e.target.value)}
                placeholder="your-business"
              />
            </div>
            {form.slug && (
              <span className={`mt-1 block text-[11.5px] font-semibold ${slugTaken ? "text-red-500" : "text-emerald-600"}`}>
                {slugTaken ? "That link is already taken — try another." : "Nice — that link is available."}
              </span>
            )}
          </Field>

          <Field label="Tagline" hint="One short line shown large in your hero.">
            <input className={inputCls} value={form.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder={ph.tagline} />
          </Field>

          <Field label="About your business" hint="2–4 sentences about who you are and what makes you different.">
            <textarea rows={5} className={`${inputCls} resize-none`} value={form.about} onChange={(e) => set({ about: e.target.value })} placeholder={ph.about} />
          </Field>
        </Card>

        {/* ---------------------------- media ---------------------------- */}
        <Card title="Photos & branding" sub="Upload your own images — they go straight to Cloudinary.">
          <div className="grid gap-5 sm:grid-cols-2">
            <ImageField label="Hero image" value={form.heroImage} onChange={(v) => set({ heroImage: v })} hint="The big banner photo." />
            <ImageField label="About image" value={form.aboutImage} onChange={(v) => set({ aboutImage: v })} hint="Shown beside your story." />
          </div>
          <ImageField label="Logo (optional)" value={form.logo} onChange={(v) => set({ logo: v })} aspect="aspect-[3/1]" hint="Square or wide logo for the navbar." />

          <div>
            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">Brand colours</span>
            <div className="flex flex-wrap items-center gap-4">
              {[
                { key: "primary", label: "Primary" },
                { key: "accent", label: "Accent" },
              ].map((c) => (
                <label key={c.key} className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-2">
                  <input
                    type="color"
                    value={form.theme?.[c.key] || template.theme[c.key]}
                    onChange={(e) => setIn("theme", { [c.key]: e.target.value })}
                    className="h-8 w-10 cursor-pointer rounded-lg border border-black/10"
                  />
                  <span className="text-[12.5px] font-bold">{c.label}</span>
                </label>
              ))}
              <button
                type="button"
                onClick={() => set({ theme: {} })}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-[12px] font-bold text-[#55555E] transition hover:border-indigo-400 hover:text-indigo-600"
              >
                <RefreshCw size={12} /> Reset palette
              </button>
            </div>
          </div>
        </Card>

        {/* ---------------------------- contact ---------------------------- */}
        <Card title="Contact & opening hours" sub="Powers the call/WhatsApp buttons, map and footer." required count={rows("hours").length}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone">
              <PhoneInput
                value={form.contact.phone}
                onChange={(value) => setIn("contact", { phone: value })}
                className="border-black/10"
              />
            </Field>
            <Field label="WhatsApp number">
              <PhoneInput
                value={form.contact.whatsapp}
                onChange={(value) => setIn("contact", { whatsapp: value })}
                className="border-black/10"
                ariaLabel="WhatsApp number"
              />
            </Field>
          </div>
          <Field label="Email">
            <input className={inputCls} value={form.contact.email} onChange={(e) => setIn("contact", { email: e.target.value })} placeholder="you@business.com" />
          </Field>
          <Field label="Address" hint="Used to embed a live Google Map.">
            <textarea rows={2} className={`${inputCls} resize-none`} value={form.contact.address} onChange={(e) => setIn("contact", { address: e.target.value })} placeholder="Shop no, street, area, city, state — pincode" />
          </Field>

          <div className={`space-y-2 rounded-2xl border p-4 transition ${isOn("hours") ? "border-black/10" : "border-black/10 bg-black/[0.03]"}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#55555E]">
                Opening hours {!isOn("hours") && <span className="ml-1 text-amber-600">· hidden</span>}
              </span>
              <Switch on={isOn("hours")} onChange={() => toggleSection("hours")} label="Show opening hours section" size="sm" />
            </div>
            {rows("hours").map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className={inputCls} value={h.day} onChange={(e) => editRow("hours", i, { day: e.target.value })} placeholder={ph.hours.day || "Monday – Saturday"} />
                <input className={inputCls} value={h.time} onChange={(e) => editRow("hours", i, { time: e.target.value })} placeholder={ph.hours.time || "9:00 AM – 9:00 PM"} />
                <button type="button" onClick={() => removeRow("hours", i)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-black/10 text-black/40 transition hover:border-red-300 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <Repeater items={rows("hours")} onAdd={() => addRow("hours", { day: "", time: "" })} addLabel="Add hours row" emptyText="No hours added yet — the hours section stays hidden." />
          </div>
        </Card>

        {/* ---------------------------- stats ---------------------------- */}
        {show.stats && (
          <Card title="Key numbers" sub="Small stats shown near your story (years, customers, rating…)." count={rows("stats").length} defaultOpen={false} hidden={!isOn("about")} onToggleHidden={() => toggleSection("about")}>
            {rows("stats").map((s, i) => (
              <Row key={i} index={i} label="Stat" onRemove={() => removeRow("stats", i)}>
                <div className="grid gap-3 sm:grid-cols-[130px_1fr]">
                  <input className={inputCls} value={s.value} onChange={(e) => editRow("stats", i, { value: e.target.value })} placeholder={ph.stat.value || "12+"} />
                  <input className={inputCls} value={s.label} onChange={(e) => editRow("stats", i, { label: e.target.value })} placeholder={ph.stat.label || "Years of experience"} />
                </div>
              </Row>
            ))}
            <Repeater items={rows("stats")} onAdd={() => addRow("stats", { value: "", label: "" })} addLabel="Add a number" emptyText="No numbers added yet." />
          </Card>
        )}

        {/* ---------------------------- features ---------------------------- */}
        {show.features && (
          <Card title="Why choose us" sub="Short trust-building points with an icon." count={rows("features").length} defaultOpen={false} hidden={!isOn("features")} onToggleHidden={() => toggleSection("features")}>
            {rows("features").map((f, i) => (
              <Row key={i} index={i} label="Point" onRemove={() => removeRow("features", i)}>
                <div className="grid gap-3 sm:grid-cols-[170px_1fr]">
                  <IconPicker value={f.icon} onChange={(v) => editRow("features", i, { icon: v })} />
                  <input className={inputCls} value={f.title} onChange={(e) => editRow("features", i, { title: e.target.value })} placeholder={ph.feature.title || "Trusted experts"} />
                </div>
                <textarea rows={2} className={`${inputCls} mt-3 resize-none`} value={f.description} onChange={(e) => editRow("features", i, { description: e.target.value })} placeholder={ph.feature.description} />
              </Row>
            ))}
            <Repeater items={rows("features")} onAdd={() => addRow("features", { icon: "BadgeCheck", title: "", description: "" })} addLabel="Add a point" emptyText="No points added yet — this section stays hidden." />
          </Card>
        )}

        {/* ---------------------------- services ---------------------------- */}
        {show.services && (
          <Card title="Services" sub="What you offer, with optional pricing." count={rows("services").length} hidden={!isOn("services")} onToggleHidden={() => toggleSection("services")}>
            {rows("services").map((s, i) => (
              <Row key={i} index={i} label="Service" onRemove={() => removeRow("services", i)}>
                <div className="grid gap-3 sm:grid-cols-[170px_1fr_120px]">
                  <IconPicker value={s.icon} onChange={(v) => editRow("services", i, { icon: v })} />
                  <input className={inputCls} value={s.title} onChange={(e) => editRow("services", i, { title: e.target.value })} placeholder={ph.service.title || "Service name"} />
                  <input className={inputCls} value={s.price || ""} onChange={(e) => editRow("services", i, { price: e.target.value })} placeholder="₹ price" />
                </div>
                <textarea rows={2} className={`${inputCls} mt-3 resize-none`} value={s.description} onChange={(e) => editRow("services", i, { description: e.target.value })} placeholder={ph.service.description} />
              </Row>
            ))}
            <Repeater items={rows("services")} onAdd={() => addRow("services", { icon: "Sparkles", title: "", description: "", price: "" })} addLabel="Add a service" emptyText="No services added yet — this section stays hidden." />
          </Card>
        )}

        {/* ---------------------------- menu ---------------------------- */}
        {show.menu && (
          <Card
            title="Menu"
            sub="Group your dishes or drinks into sections, then add items."
            count={rows("menu").reduce((n, g) => n + (g.items?.length || 0), 0)}
            hidden={!isOn("menu")}
            onToggleHidden={() => toggleSection("menu")}
          >
            {rows("menu").map((g, gi) => (
              <div key={gi} className="rounded-2xl border border-black/10 bg-[#FBFAF7] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <input
                    className={`${inputCls} font-bold`}
                    value={g.category}
                    onChange={(e) => editGroup(gi, { category: e.target.value })}
                    placeholder={ph.menuGroup}
                  />
                  <button type="button" onClick={() => removeRow("menu", gi)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-black/10 text-black/40 transition hover:border-red-300 hover:text-red-500" aria-label="Remove section">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(g.items || []).map((it, ii) => (
                    <div key={ii} className="rounded-xl border border-black/10 bg-white p-3">
                      <div className="grid gap-2.5 sm:grid-cols-[1fr_110px_110px_auto]">
                        <input className={inputCls} value={it.name} onChange={(e) => editItem(gi, ii, { name: e.target.value })} placeholder={ph.menuItem.name || "Item name"} />
                        <input className={inputCls} value={it.price} onChange={(e) => editItem(gi, ii, { price: e.target.value })} placeholder="₹250" />
                        <input className={inputCls} value={it.tag || ""} onChange={(e) => editItem(gi, ii, { tag: e.target.value })} placeholder="Tag" />
                        <button type="button" onClick={() => removeItem(gi, ii)} className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 text-black/40 transition hover:border-red-300 hover:text-red-500" aria-label="Remove item">
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <input className={`${inputCls} mt-2.5`} value={it.description} onChange={(e) => editItem(gi, ii, { description: e.target.value })} placeholder={ph.menuItem.description || "Short description"} />
                    </div>
                  ))}
                  <button type="button" onClick={() => addItem(gi)} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-black/20 px-3.5 py-1.5 text-[11.5px] font-bold text-[#55555E] transition hover:border-indigo-400 hover:text-indigo-600">
                    <Plus size={12} /> Add item to “{g.category || "this section"}”
                  </button>
                </div>
              </div>
            ))}
            <Repeater items={rows("menu")} onAdd={() => addRow("menu", { category: "", items: [] })} addLabel="Add menu section" emptyText="No menu yet — add a section like “Starters” or “Hot Coffee”, then its items." />
          </Card>
        )}

        {/* ---------------------------- plans ---------------------------- */}
        {show.plans && (
          <Card title="Membership plans" sub="Pricing tiers shown as cards." count={rows("plans").length} hidden={!isOn("pricing")} onToggleHidden={() => toggleSection("pricing")}>
            {rows("plans").map((p, i) => (
              <Row key={i} index={i} label="Plan" onRemove={() => removeRow("plans", i)}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <input className={inputCls} value={p.name} onChange={(e) => editRow("plans", i, { name: e.target.value })} placeholder={ph.plan.name || "Monthly"} />
                  <input className={inputCls} value={p.price} onChange={(e) => editRow("plans", i, { price: e.target.value })} placeholder="₹1,000" />
                  <input className={inputCls} value={p.period} onChange={(e) => editRow("plans", i, { period: e.target.value })} placeholder="/month" />
                </div>
                <textarea
                  rows={4}
                  className={`${inputCls} mt-3 resize-none`}
                  value={(p.features || []).join("\n")}
                  onChange={(e) => setPlanFeatures(i, e.target.value)}
                  placeholder={"One benefit per line\nFull gym access\nLocker included"}
                />
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <input className={`${inputCls} max-w-[200px]`} value={p.cta || ""} onChange={(e) => editRow("plans", i, { cta: e.target.value })} placeholder="Button text" />
                  <label className="inline-flex items-center gap-2 text-[12.5px] font-semibold">
                    <input type="checkbox" checked={!!p.highlighted} onChange={(e) => editRow("plans", i, { highlighted: e.target.checked })} className="h-4 w-4 rounded" />
                    Highlight as most popular
                  </label>
                </div>
              </Row>
            ))}
            <Repeater items={rows("plans")} onAdd={() => addRow("plans", { name: "", price: "", period: "", features: [], cta: "", highlighted: false })} addLabel="Add a plan" emptyText="No plans added yet — this section stays hidden." />
          </Card>
        )}

        {/* ---------------------------- team ---------------------------- */}
        {show.team && (
          <Card title="Team" sub="Doctors, trainers, stylists, chefs — with photos." count={rows("team").length} defaultOpen={false} hidden={!isOn("team")} onToggleHidden={() => toggleSection("team")}>
            {rows("team").map((m, i) => (
              <Row key={i} index={i} label="Member" onRemove={() => removeRow("team", i)}>
                <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
                  <ImageField label="Photo" value={m.photo} onChange={(v) => editRow("team", i, { photo: v })} aspect="aspect-square" />
                  <div className="space-y-3">
                    <input className={inputCls} value={m.name} onChange={(e) => editRow("team", i, { name: e.target.value })} placeholder={ph.team.name || "Full name"} />
                    <input className={inputCls} value={m.role} onChange={(e) => editRow("team", i, { role: e.target.value })} placeholder={ph.team.role || "Role / qualification"} />
                    <textarea rows={3} className={`${inputCls} resize-none`} value={m.bio} onChange={(e) => editRow("team", i, { bio: e.target.value })} placeholder={ph.team.bio || "One line about them"} />
                  </div>
                </div>
              </Row>
            ))}
            <Repeater items={rows("team")} onAdd={() => addRow("team", { name: "", role: "", bio: "", photo: "" })} addLabel="Add team member" emptyText="No team members yet — this section stays hidden." />
          </Card>
        )}

        {/* ---------------------------- gallery ---------------------------- */}
        {show.gallery && (
          <Card title="Gallery" sub="Show your space, work or products." count={rows("gallery").filter(Boolean).length} defaultOpen={false} hidden={!isOn("gallery")} onToggleHidden={() => toggleSection("gallery")}>
            <GalleryField value={form.gallery} onChange={(v) => set({ gallery: v })} hint="Upload as many as you like — the first one is featured." />
          </Card>
        )}

        {/* ---------------------------- testimonials ---------------------------- */}
        {show.testimonials && (
          <Card title="Reviews" sub="Real words from real customers." count={rows("testimonials").length} defaultOpen={false} hidden={!isOn("testimonials")} onToggleHidden={() => toggleSection("testimonials")}>
            {rows("testimonials").map((t, i) => (
              <Row key={i} index={i} label="Review" onRemove={() => removeRow("testimonials", i)}>
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_90px]">
                  <input className={inputCls} value={t.name} onChange={(e) => editRow("testimonials", i, { name: e.target.value })} placeholder={ph.testimonial.name || "Customer name"} />
                  <input className={inputCls} value={t.role} onChange={(e) => editRow("testimonials", i, { role: e.target.value })} placeholder={ph.testimonial.role || "Regular customer"} />
                  <select className={inputCls} value={t.rating || 5} onChange={(e) => editRow("testimonials", i, { rating: Number(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} ★
                      </option>
                    ))}
                  </select>
                </div>
                <textarea rows={3} className={`${inputCls} mt-3 resize-none`} value={t.text} onChange={(e) => editRow("testimonials", i, { text: e.target.value })} placeholder={ph.testimonial.text} />
              </Row>
            ))}
            <Repeater items={rows("testimonials")} onAdd={() => addRow("testimonials", { name: "", role: "", rating: 5, text: "" })} addLabel="Add a review" emptyText="No reviews added yet — this section stays hidden." />
          </Card>
        )}

        {/* ---------------------------- faqs ---------------------------- */}
        {show.faqs && (
          <Card title="FAQs" sub="Answer the questions customers always ask." count={rows("faqs").length} defaultOpen={false} hidden={!isOn("faq")} onToggleHidden={() => toggleSection("faq")}>
            {rows("faqs").map((f, i) => (
              <Row key={i} index={i} label="Question" onRemove={() => removeRow("faqs", i)}>
                <input className={inputCls} value={f.q} onChange={(e) => editRow("faqs", i, { q: e.target.value })} placeholder={ph.faq.q || "A common question"} />
                <textarea rows={3} className={`${inputCls} mt-3 resize-none`} value={f.a} onChange={(e) => editRow("faqs", i, { a: e.target.value })} placeholder={ph.faq.a || "A clear, helpful answer"} />
              </Row>
            ))}
            <Repeater items={rows("faqs")} onAdd={() => addRow("faqs", { q: "", a: "" })} addLabel="Add a question" emptyText="No FAQs added yet — this section stays hidden." />
          </Card>
        )}

        {/* ---------------------------- cta / seo / social ---------------------------- */}
        <Card title="Call to action, SEO & social" sub="The closing banner, Google listing text and your profiles." defaultOpen={false} hidden={!isOn("cta")} onToggleHidden={() => toggleSection("cta")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CTA heading">
              <input className={inputCls} value={form.cta?.title || ""} onChange={(e) => setIn("cta", { title: e.target.value })} placeholder="Book your appointment today" />
            </Field>
            <Field label="CTA subtitle">
              <input className={inputCls} value={form.cta?.subtitle || ""} onChange={(e) => setIn("cta", { subtitle: e.target.value })} placeholder="Same-day slots available." />
            </Field>
          </div>
          <Field label="SEO title" hint="Shown in the browser tab and Google results.">
            <input className={inputCls} value={form.seo?.title || ""} onChange={(e) => setIn("seo", { title: e.target.value })} placeholder={`${form.name || "Business"} | Best ${getCategory(form.category).label}`} />
          </Field>
          <Field label="SEO description">
            <textarea rows={2} className={`${inputCls} resize-none`} value={form.seo?.description || ""} onChange={(e) => setIn("seo", { description: e.target.value })} placeholder="A short sentence describing your business for search engines." />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instagram URL">
              <input className={inputCls} value={form.social?.instagram || ""} onChange={(e) => setIn("social", { instagram: e.target.value })} placeholder="https://instagram.com/..." />
            </Field>
            <Field label="Facebook URL">
              <input className={inputCls} value={form.social?.facebook || ""} onChange={(e) => setIn("social", { facebook: e.target.value })} placeholder="https://facebook.com/..." />
            </Field>
          </div>
        </Card>
      </div>

      {/* ------------------------------ RIGHT: PREVIEW ----------------------------- */}
      <div className="min-w-0 lg:sticky lg:top-24">
        <div className="rounded-3xl border border-black/10 bg-white p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <p className="font-display text-[14px] font-bold">Live preview</p>
            </div>
            <DeviceTabs device={device} onChange={setDevice} />
          </div>

          <div className="mb-3 flex items-center gap-2 overflow-hidden">
            <span className="truncate rounded-lg bg-black/5 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#55555E]">
              {PLATFORM_URL}/{form.slug || "your-link"}
            </span>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: withAlpha(template.theme.primary, 0.12), color: template.theme.primary }}>
              {template.name.split(" ")[0]} design
            </span>
            <span className="ml-auto shrink-0 font-mono text-[10.5px] font-semibold text-[#A1A1AA]">
              {DEVICES[device].width}px
            </span>
          </div>

          <ResponsivePreview device={device}>
            <BusinessWebsite business={previewBiz} preview />
          </ResponsivePreview>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12.5px] font-semibold text-red-600">{error}</p>
          )}

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => setFullPreview(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-black/15 px-6 py-3.5 text-sm font-bold transition hover:border-black/35"
            >
              <Maximize2 size={16} /> Preview Website
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#5046E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA] disabled:opacity-60"
            >
              <Rocket size={16} />
              {saving ? "Saving…" : mode === "create" ? "Save Website" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* A real full-screen device preview, not just a scroll-to shortcut. */}
      <FullPreviewModal
        open={fullPreview}
        onClose={() => setFullPreview(false)}
        device={device}
        onDeviceChange={setDevice}
        business={previewBiz}
      />

      {/* ------------------------------ CHECKOUT ----------------------------- */}
      <CheckoutModal
        open={checkout}
        onClose={() => {
          setCheckout(false);
          setPayTarget(null);
        }}
        business={payTarget || { ...form, slug: form.slug || slugify(form.name) }}
      />

      {/* ------------------------------ SUCCESS MODAL ----------------------------- */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-black/50 px-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl sm:p-10"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", damping: 12 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"
              >
                <PartyPopper size={28} />
              </motion.span>
              <h2 className="mt-6 font-display text-2xl font-bold">
                {saved.published ? "Your website is live!" : mode === "create" ? "Website saved!" : "Changes saved!"}
              </h2>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#77777F]">
                {saved.published
                  ? `${saved.name} is published and ready to share with the world.`
                  : `${saved.name} is saved as a draft. Complete payment and it goes live automatically.`}
              </p>

              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-black/10 bg-[#FBFAF7] px-4 py-3">
                <span className="flex-1 truncate text-left font-mono text-[12.5px] font-semibold text-indigo-600">
                  {origin}/{saved.slug}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`${origin}/${saved.slug}`);
                    } catch {
                      /* noop */
                    }
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                  }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-black/10 text-black/50 transition hover:border-indigo-400 hover:text-indigo-600"
                  aria-label="Copy link"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="mt-6 grid gap-2.5">
                {saved.published ? (
                  <Link
                    to={`/${saved.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#101014] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#5046E5]"
                  >
                    <ExternalLink size={15} /> View live website
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setSaved(null);
                      setPayTarget(saved);
                      setCheckout(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5046E5] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-[#4338CA]"
                  >
                    <Lock size={15} /> Pay to publish
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2.5">
                  <Link to="/dashboard" className="rounded-full border border-black/15 px-5 py-3 text-[13px] font-bold transition hover:bg-black/5">
                    Dashboard
                  </Link>
                  <button onClick={() => setSaved(null)} className="rounded-full border border-black/15 px-5 py-3 text-[13px] font-bold transition hover:bg-black/5">
                    Keep editing
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
