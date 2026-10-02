/**
 * Business-type search.
 *
 * Website creation starts by asking "What type of business do you have?".
 * The visitor types something in their own words — "furniture", "dentist",
 * "cake shop", "AC repair" — and we resolve it to one of the 86 categories,
 * so they never have to hunt through a dropdown.
 *
 * ALIASES holds the words real business owners actually use, including
 * common Indian terms (mithai, tiffin, mandap, xerox, godown).
 */
import { CATEGORIES } from "./categories.js";

export const ALIASES = {
  clinic: ["clinic", "doctor", "physician", "medical clinic", "gp", "family doctor", "opd", "mbbs"],
  hospital: ["hospital", "nursing home", "multispeciality", "emergency", "icu", "maternity hospital"],
  dental: ["dental", "dentist", "teeth", "tooth", "orthodontist", "braces", "implants", "smile"],
  salon: ["salon", "hair salon", "unisex salon", "hairdresser", "haircut", "barber", "styling"],
  gym: ["gym", "fitness center", "workout", "weights", "bodybuilding", "crossfit", "health club"],
  fitness: ["fitness", "personal trainer", "aerobics", "zumba", "bootcamp", "training studio"],
  cafe: ["cafe", "coffee", "coffee shop", "espresso", "tea shop", "cafeteria", "coffee house"],
  restaurant: ["restaurant", "dhaba", "dining", "eatery", "family restaurant", "fine dining", "hotel food"],
  hotel: ["hotel", "resort", "homestay", "lodge", "guest house", "rooms", "stay", "accommodation"],
  bakery: ["bakery", "cake", "cake shop", "pastry", "bread", "bakers", "birthday cake", "confectionery"],
  coaching: ["coaching", "coaching class", "tuition class", "institute", "jee", "neet", "academy classes"],
  consultancy: ["consultancy", "consultant", "business consultant", "advisory", "management consulting"],
  "real-estate": ["real estate", "property", "broker", "realtor", "flats", "plots", "builder sales", "estate agent"],
  photography: ["photography", "photographer", "photo studio", "wedding photography", "shoot", "candid"],
  travel: ["travel agency", "travel agent", "ticketing", "visa", "holiday packages", "flight booking"],
  automobile: ["automobile", "garage", "car repair", "car service", "mechanic", "auto repair", "workshop"],
  spa: ["spa", "massage", "wellness spa", "ayurvedic massage", "therapy spa", "relaxation"],
  yoga: ["yoga", "yoga studio", "meditation", "pranayama", "asana", "yoga classes"],
  beauty: ["beauty parlour", "beauty parlor", "beautician", "facial", "threading", "waxing", "beauty salon"],
  freelancer: ["freelancer", "portfolio", "freelance", "personal website", "developer", "designer freelance"],
  interior: ["interior", "interior designer", "interior design", "home decor", "decorator", "interiors"],
  jewellery: ["jewellery", "jewelry", "jeweller", "gold", "silver", "diamond shop", "ornaments", "sonar"],
  ca: ["ca", "chartered accountant", "tax", "tax consultant", "gst", "accountant", "income tax", "audit", "itr"],
  architect: ["architect", "architecture", "building design", "naksha", "plan drawing", "architectural"],
  "ac-repair": ["ac repair", "ac", "air conditioner", "ac service", "hvac", "cooling", "air conditioning"],
  cleaning: ["cleaning", "deep cleaning", "house cleaning", "housekeeping", "office cleaning", "sofa cleaning"],
  laundry: ["laundry", "dry cleaning", "dry cleaner", "washing clothes", "ironing", "press", "dhobi"],
  event: ["event planner", "event management", "wedding planner", "event organiser", "party planner"],
  caterer: ["caterer", "catering", "catering service", "food catering", "banquet catering", "bhojan"],
  nutritionist: ["nutritionist", "dietitian", "dietician", "diet plan", "weight loss diet", "nutrition"],
  makeup: ["makeup artist", "makeup", "bridal makeup", "mua", "party makeup", "hd makeup"],
  "car-detailing": ["car detailing", "car wash", "car cleaning", "ceramic coating", "car polish", "car spa"],
  "bike-service": ["bike service", "bike repair", "two wheeler", "motorcycle repair", "scooter repair", "bike mechanic"],
  "car-rental": ["car rental", "rent a car", "self drive", "cab service", "taxi", "car hire", "travels car"],
  "bike-rental": ["bike rental", "rent a bike", "scooter rental", "two wheeler rental", "bike hire"],
  "mobile-repair": ["mobile repair", "phone repair", "mobile shop", "cell phone repair", "screen replacement", "smartphone repair"],
  "laptop-repair": ["laptop repair", "computer repair", "pc repair", "desktop repair", "computer service"],
  "appliance-repair": ["appliance repair", "fridge repair", "washing machine repair", "refrigerator", "microwave repair", "home appliance"],
  "ro-service": ["ro service", "ro", "water purifier", "aquaguard", "water filter", "purifier service"],
  "pest-control": ["pest control", "pest", "termite", "cockroach", "mosquito", "rodent", "fumigation"],
  "packers-movers": ["packers and movers", "packers", "movers", "shifting", "relocation", "house shifting", "transport goods"],
  waterproofing: ["waterproofing", "leakage", "seepage", "damp", "terrace leak", "water leakage"],
  "home-renovation": ["renovation", "home renovation", "remodeling", "house repair", "makeover", "refurbishment"],
  "modular-kitchen": ["modular kitchen", "kitchen design", "kitchen cabinets", "kitchen interior", "kitchen trolley"],
  "furniture-shop": ["furniture", "furniture shop", "sofa", "bed", "wardrobe", "carpenter", "custom furniture", "dining table"],
  "tiles-sanitary": ["tiles", "sanitary", "sanitaryware", "bathroom fittings", "marble", "tiles shop", "bathware"],
  "hardware-shop": ["hardware", "hardware shop", "tools", "nuts bolts", "building material", "cement shop"],
  "paint-dealer": ["paint", "painter", "painting service", "paint dealer", "wall painting", "asian paints"],
  "solar-installation": ["solar", "solar panel", "solar installation", "rooftop solar", "net metering", "solar energy"],
  gardening: ["gardening", "landscaping", "garden", "lawn", "nursery plants", "mali", "horticulture"],
  "water-supplier": ["water supplier", "drinking water", "water can", "mineral water", "water jar", "bisleri"],
  "wedding-decoration": ["wedding decoration", "wedding decor", "flower decoration", "stage decoration", "shaadi decor"],
  "mandap-decoration": ["mandap", "mandap decoration", "event decoration", "haldi decor", "pandal", "shamiana decor"],
  "dj-sound": ["dj", "sound system", "dj service", "music system", "sound and light", "orchestra"],
  "tent-house": ["tent house", "tent", "shamiana", "chairs tables", "pandal", "mandap tent", "decorators tent"],
  florist: ["florist", "flowers", "flower shop", "bouquet", "phool", "floral", "flower delivery"],
  "sweet-shop": ["sweet shop", "sweets", "mithai", "misthan", "halwai", "laddu", "kaju katli", "namkeen"],
  "tiffin-service": ["tiffin", "tiffin service", "dabba", "meal service", "lunch service", "home food delivery", "mess"],
  "cloud-kitchen": ["cloud kitchen", "delivery kitchen", "online food", "swiggy zomato", "ghost kitchen"],
  "food-truck": ["food truck", "street food", "food van", "food stall", "mobile kitchen"],
  "pet-grooming": ["pet grooming", "dog grooming", "pet salon", "dog bath", "pet spa", "cat grooming"],
  "pet-boarding": ["pet boarding", "dog boarding", "pet hostel", "dog day care", "pet sitting", "kennel"],
  "pet-training": ["pet training", "dog training", "obedience training", "dog trainer", "puppy training"],
  physiotherapy: ["physiotherapy", "physiotherapist", "physio", "rehab", "back pain", "sports injury"],
  "eye-care": ["eye care", "optical", "optician", "spectacles", "glasses", "eye test", "chashma", "contact lens"],
  pharmacy: ["pharmacy", "medical store", "chemist", "medicines", "druggist", "medical shop", "dawai"],
  "home-tutor": ["home tutor", "tutor", "tuition", "private teacher", "home tuition", "personal tutor"],
  "music-dance": ["music academy", "dance academy", "dance class", "music class", "singing", "guitar", "tabla", "kathak"],
  "driving-school": ["driving school", "driving class", "learn driving", "driving training", "licence training"],
  "computer-training": ["computer training", "computer class", "tally", "ms office", "programming class", "typing"],
  "language-institute": ["language institute", "spoken english", "english class", "german", "french", "ielts", "language class"],
  "study-abroad": ["study abroad", "overseas education", "foreign education", "student visa", "universities abroad"],
  "education-consultant": ["education consultant", "admission consultant", "career counselling", "college admission"],
  "digital-marketing": ["digital marketing", "seo", "google ads", "online marketing", "performance marketing", "marketing agency"],
  printing: ["printing", "xerox", "print shop", "photocopy", "binding", "stationery print", "digital printing"],
  signboard: ["signboard", "sign board", "flex printing", "glow sign", "banner printing", "hoarding", "acp board"],
  "graphic-design": ["graphic design", "logo design", "branding", "graphic designer", "design studio", "packaging design"],
  "video-production": ["video production", "videography", "film production", "video editing", "ad film", "reels shoot"],
  "social-media": ["social media", "social media agency", "instagram marketing", "content agency", "smm"],
  "security-service": ["security", "security agency", "security guard", "bouncer", "watchman", "guard service"],
  "manpower-recruitment": ["manpower", "recruitment", "hr agency", "staffing", "placement agency", "hiring agency", "job consultancy"],
  "construction-contractor": ["construction", "contractor", "builder", "construction company", "turnkey construction"],
  "civil-contractor": ["civil contractor", "civil work", "rcc", "slab", "plaster", "masonry", "mistri"],
  courier: ["courier", "delivery service", "parcel", "logistics", "shipping", "cargo", "transport parcel"],
  "tour-operator": ["tour operator", "tour package", "group tour", "yatra", "sightseeing", "tours"],
  other: ["other", "something else", "general business", "shop", "store"],
};

/** Categories shown as quick-pick chips before the visitor types anything. */
export const POPULAR = [
  "restaurant", "cafe", "salon", "gym", "clinic", "furniture-shop",
  "real-estate", "photography", "bakery", "automobile", "interior", "event",
];

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Score how well a category matches the query.
 * Higher is better; 0 means no match.
 */
function scoreCategory(category, query) {
  const q = norm(query);
  if (!q) return 0;

  const label = norm(category.label);
  const aliases = (ALIASES[category.id] || []).map(norm);
  const haystack = [label, norm(category.id.replace(/-/g, " ")), ...aliases];

  let best = 0;
  for (const term of haystack) {
    if (!term) continue;
    if (term === q) best = Math.max(best, 100);                       // exact
    else if (term.startsWith(q)) best = Math.max(best, 85);           // prefix
    else if (term.split(" ").some((w) => w === q)) best = Math.max(best, 80); // whole word
    else if (term.includes(q)) best = Math.max(best, 65);             // substring
    else if (q.includes(term) && term.length > 3) best = Math.max(best, 55);
  }

  /* Also match when every word the visitor typed appears somewhere. */
  if (!best) {
    const words = q.split(" ").filter((w) => w.length > 2);
    if (words.length && words.every((w) => haystack.some((t) => t.includes(w)))) best = 45;
  }

  /* Nudge a whole-label match above an alias match of equal strength. */
  if (best && label.startsWith(q)) best += 3;
  return best;
}

/**
 * Resolve free text to matching categories, best first.
 * @returns {Array<{category, score}>}
 */
export function searchCategories(query, limit = 8) {
  const q = norm(query);
  if (!q) return [];
  return CATEGORIES
    .filter((c) => c.id !== "other")
    .map((category) => ({ category, score: scoreCategory(category, q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.category.label.localeCompare(b.category.label))
    .slice(0, limit);
}

/** The single best category for a query, or null. */
export function bestCategory(query) {
  return searchCategories(query, 1)[0]?.category || null;
}
