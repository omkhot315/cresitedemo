/**
 * "Generate with AI" — instant website content.
 *
 * Every category ships with a professionally written content pack
 * (see data/aiContentPacks.js). The generator picks the pack for the chosen
 * category, personalises it with the business name, city and contact details,
 * attaches the template's imagery, and returns a complete, editable draft.
 *
 * Nothing is sent to a third-party service: generation happens instantly and
 * offline, and every word remains fully editable afterwards.
 */
import { draftFromCategory, templateForCategory } from "../templates/registry.js";
import { getContentPack, getCategoryImages } from "../data/aiContentPacks.js";
import { getCategory } from "../data/categories.js";
import { slugify } from "../utils/businessUtils.js";

/** Fill {name} / {city} tokens in any pack string. */
const fill = (text, vars) =>
  String(text || "")
    .replaceAll("{name}", vars.name)
    .replaceAll("{city}", vars.city);

/** Pull a likely city out of a free-text address ("…, Pune, Maharashtra"). */
export function cityFromAddress(address = "") {
  const parts = address.split(",").map((s) => s.trim()).filter(Boolean);
  if (!parts.length) return "";
  return parts.length >= 2 ? parts[parts.length - 2].replace(/\s*[-–]?\s*\d{5,6}$/, "").trim() : parts[0];
}

/** Tone adjusts the opening line of the About section. */
const TONE_OPENERS = {
  professional: "",
  friendly: "We're glad you're here. ",
  premium: "Crafted with care. ",
};

export const TONES = [
  { id: "professional", label: "Professional", hint: "Clear and credible" },
  { id: "friendly", label: "Friendly", hint: "Warm and welcoming" },
  { id: "premium", label: "Premium", hint: "Polished and upscale" },
];

/**
 * Build a fully populated business draft.
 *
 * @param {object} input
 * @param {string} input.name      business name (required)
 * @param {string} input.category  category id
 * @param {string} [input.city]    city, otherwise derived from the address
 * @param {string} [input.address] full address
 * @param {string} [input.phone]   phone number
 * @param {string} [input.whatsapp]
 * @param {string} [input.email]
 * @param {string} [input.tone]    professional | friendly | premium
 * @param {string} [input.plan]    basic | domain | custom (required to save)
 * @returns {object} a complete draft ready for the builder + live preview
 */
export function generateBusinessDraft(input) {
  const category = getCategory(input.category).id;
  const template = templateForCategory(category);
  const pack = getContentPack(category);
  const base = draftFromCategory(category);
  /* A plan is required before a website can be saved. */
  const plan = ["basic", "domain", "custom"].includes(input.plan) ? input.plan : "basic";

  const name = (input.name || "").trim() || "Your Business";
  const city = (input.city || "").trim() || cityFromAddress(input.address) || "your area";
  const vars = { name, city };

  /* Category-specific photos win; otherwise inherit the template's imagery. */
  const images = getCategoryImages(category) || template.sample?.images || {};
  const teamPhotos = (template.sample?.team || []).map((t) => t.photo).filter(Boolean);

  const services = (pack.services || []).map(([icon, title, description, price]) => ({
    icon,
    title: fill(title, vars),
    description: fill(description, vars),
    price: price || "",
  }));

  const features = (pack.features || []).map(([icon, title, description]) => ({
    icon,
    title: fill(title, vars),
    description: fill(description, vars),
  }));

  const team = (pack.team || []).map(([memberName, role, bio], i) => ({
    name: memberName,
    role,
    bio: fill(bio, vars),
    photo: teamPhotos[i % Math.max(teamPhotos.length, 1)] || "",
  }));

  const testimonials = (pack.testimonials || []).map(([author, role, text]) => ({
    name: author,
    role,
    rating: 5,
    text: fill(text, vars),
  }));

  const faqs = (pack.faqs || []).map(([q, a]) => ({ q: fill(q, vars), a: fill(a, vars) }));
  const stats = (pack.stats || []).map(([value, label]) => ({ value, label }));
  const hours = (pack.hours || []).map(([day, time]) => ({ day, time }));

  const menu = (pack.menu || []).map(([groupName, items]) => ({
    category: groupName,
    items: (items || []).map(([itemName, description, price, tag]) => ({
      name: itemName,
      description,
      price,
      tag: tag || "",
    })),
  }));

  const plans = (pack.plans || []).map(([planName, price, period, planFeatures, highlighted, cta]) => ({
    name: planName,
    price,
    period,
    features: [...(planFeatures || [])],
    highlighted: !!highlighted,
    cta: cta || "Choose Plan",
  }));

  const about = (TONE_OPENERS[input.tone] || "") + fill(pack.about, vars);
  const [ctaTitle, ctaSubtitle] = pack.cta || [];
  const categoryLabel = getCategory(category).label;

  return {
    ...base,
    name,
    slug: slugify(name),
    category,
    plan,
    tagline: fill(pack.tagline, vars),
    about,
    heroImage: images.hero || "",
    aboutImage: images.about || "",
    gallery: [...(images.gallery || [])],
    contact: {
      phone: input.phone || "",
      whatsapp: input.whatsapp || input.phone || "",
      email: input.email || "",
      address: input.address || "",
    },
    hours,
    services,
    features,
    plans,
    menu,
    team,
    testimonials,
    faqs,
    stats,
    cta: { title: fill(ctaTitle, vars), subtitle: fill(ctaSubtitle, vars) },
    seo: {
      title: `${name} | ${categoryLabel}${city && city !== "your area" ? ` in ${city}` : ""}`,
      description: about.slice(0, 155),
    },
    /** Marks the draft as AI-assisted so the builder can show a notice. */
    generatedByAi: true,
  };
}

/** A short, honest summary of what a generated draft contains. */
export function summariseDraft(draft) {
  const counts = [
    draft.services?.length && `${draft.services.length} services`,
    draft.menu?.reduce((n, g) => n + (g.items?.length || 0), 0) &&
      `${draft.menu.reduce((n, g) => n + (g.items?.length || 0), 0)} menu items`,
    draft.plans?.length && `${draft.plans.length} plans`,
    draft.team?.length && `${draft.team.length} team profiles`,
    draft.testimonials?.length && `${draft.testimonials.length} reviews`,
    draft.faqs?.length && `${draft.faqs.length} FAQs`,
    draft.gallery?.length && `${draft.gallery.length} photos`,
  ].filter(Boolean);
  return counts;
}

/** Steps shown while generating, purely for feedback. */
export const GENERATION_STEPS = [
  "Reading your business details",
  "Choosing the right template",
  "Writing your headline and story",
  "Building services and pricing",
  "Adding reviews, FAQs and photos",
  "Polishing your website",
];
