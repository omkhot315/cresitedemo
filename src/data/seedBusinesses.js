/**
 * Demo businesses preloaded into the platform.
 * In production this data lives in MongoDB (see services/businessApi.js) —
 * the shape below is exactly what POST /api/businesses accepts.
 */
import { TEMPLATES } from "../templates/registry.js";

const T = TEMPLATES;

/** The demo staff account that owns the preloaded websites (see server/seed.js). */
export const DEMO_SITE_CREATOR = {
  name: "Platform Admin",
  email: "admin@cresite.in",
  role: "admin",
};

const RAW_BUSINESSES = [
  /* ============================== CLINIC ============================== */
  {
    id: "seed-smile-dental-care",
    slug: "smile-dental-care",
    category: "clinic",
    name: "Smile Dental Care",
    tagline: "Healthy Smile, Happy Life",
    about:
      "Located in Kothrud, Smile Dental Care has been Pune's family dental home since 2012. Six specialists, a fully digital setup and a strict painless protocol — because nobody should fear the dentist.",
    heroImage: T.clinic.sample.images.hero,
    aboutImage: T.clinic.sample.images.about,
    gallery: T.clinic.sample.images.gallery,
    contact: {
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      email: "care@smiledental.in",
      address: "2nd Floor, City Pride Building, Kothrud, Pune, Maharashtra 411038",
    },
    hours: T.clinic.sample.hours,
    services: T.clinic.sample.services,
    features: T.clinic.sample.features,
    plans: [],
    menu: [],
    team: T.clinic.sample.team,
    testimonials: T.clinic.sample.testimonials,
    faqs: T.clinic.sample.faqs,
    stats: T.clinic.sample.stats,
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      whatsapp: "",
    },
    theme: {},
    sections: null,
    plan: "basic",
    paid: true,
    customDomain: "",
    cta: {
      title: "Book Your Appointment Today",
      subtitle: "Same-day slots available. Call, WhatsApp or walk in — your smile can't wait.",
    },
    seo: {
      title: "Smile Dental Care | Best Dental Clinic in Pune",
      description:
        "Professional dental care in Pune — painless root canals, implants, braces & whitening. Book your appointment at Smile Dental Care today.",
    },
    published: true,
    createdAt: "2025-11-04T10:00:00.000Z",
  },

  /* ================================ GYM =============================== */
  {
    id: "seed-powerfit-fitness",
    slug: "powerfit-fitness",
    category: "gym",
    name: "PowerFit Fitness",
    tagline: "Train Hard. Stay Humble.",
    about:
      "PowerFit is 6,000 sq. ft. of serious training in the heart of Baner. Calibrated iron, coach-led programming, a boxing corner and a community that shows up at 5 AM — since 2016.",
    heroImage: T.gym.sample.images.hero,
    aboutImage: T.gym.sample.images.about,
    gallery: T.gym.sample.images.gallery,
    contact: {
      phone: "+91 98220 12345",
      whatsapp: "+91 98220 12345",
      email: "join@powerfit.in",
      address: "1st Floor, Apex Plaza, Baner Road, Pune, Maharashtra 411045",
    },
    hours: T.gym.sample.hours,
    services: T.gym.sample.services,
    features: T.gym.sample.features,
    plans: T.gym.sample.plans,
    menu: [],
    team: T.gym.sample.team,
    testimonials: T.gym.sample.testimonials,
    faqs: [],
    stats: T.gym.sample.stats,
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      whatsapp: "",
    },
    theme: {},
    sections: null,
    plan: "basic",
    paid: true,
    customDomain: "",
    cta: {
      title: "Start Your 7-Day Free Trial",
      subtitle: "Full access. All classes. A free fitness assessment. No card required.",
    },
    seo: {
      title: "PowerFit Fitness | Best Gym in Pune",
      description:
        "Pune's most-equipped gym — strength training, boxing, personal coaching & nutrition plans. Start your 7-day free trial at PowerFit Fitness.",
    },
    published: true,
    createdAt: "2025-11-04T10:05:00.000Z",
  },

  /* ================================ CAFE ============================== */
  {
    id: "seed-brew-and-bean",
    slug: "brew-and-bean",
    category: "cafe",
    name: "Brew & Bean",
    tagline: "Slow Coffee, Fast Friends",
    about:
      "A sun-lit corner cafe in Koregaon Park pouring single-origin Coorg and Chikmagalur beans roasted in-house every week. Window seats, a vinyl playlist, and croissants out of the oven by eight.",
    heroImage: T.cafe.sample.images.hero,
    aboutImage: T.cafe.sample.images.about,
    gallery: T.cafe.sample.images.gallery,
    contact: {
      phone: "+91 90110 45678",
      whatsapp: "+91 90110 45678",
      email: "hello@brewandbean.in",
      address: "Shop 3, Lane 6, Koregaon Park, Pune, Maharashtra 411001",
    },
    hours: T.cafe.sample.hours,
    services: [],
    features: T.cafe.sample.features,
    plans: [],
    menu: T.cafe.sample.menu,
    team: [],
    testimonials: T.cafe.sample.testimonials,
    faqs: [],
    stats: T.cafe.sample.stats,
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      whatsapp: "",
    },
    theme: {},
    sections: null,
    plan: "basic",
    paid: true,
    customDomain: "",
    cta: {
      title: "The Kettle's Already On",
      subtitle: "Window seats fill fast on weekends — call ahead and we'll keep one warm.",
    },
    seo: {
      title: "Brew & Bean | Specialty Coffee Cafe in Pune",
      description:
        "Single-origin coffee, fresh bakes and cozy window seats in Koregaon Park. Explore the Brew & Bean menu, hours and location.",
    },
    published: true,
    createdAt: "2025-11-04T10:10:00.000Z",
  },

  /* =============================== SALON ============================== */
  {
    id: "seed-glowup-salon",
    slug: "glowup-salon",
    category: "salon",
    name: "GlowUp Salon",
    tagline: "Where Elegance Meets Artistry",
    about:
      "GlowUp is a luxe unisex studio in Aundh — precision cuts, dimensional colour and bridal artistry, delivered consultation-first. Twenty thousand makeovers and counting since 2015.",
    heroImage: T.salon.sample.images.hero,
    aboutImage: T.salon.sample.images.about,
    gallery: T.salon.sample.images.gallery,
    contact: {
      phone: "+91 97400 78901",
      whatsapp: "+91 97400 78901",
      email: "book@glowupsalon.in",
      address: "1st Floor, Pearl Arcade, Aundh Road, Pune, Maharashtra 411007",
    },
    hours: T.salon.sample.hours,
    services: T.salon.sample.services,
    features: T.salon.sample.features,
    plans: [],
    menu: [],
    team: T.salon.sample.team,
    testimonials: T.salon.sample.testimonials,
    faqs: [],
    stats: T.salon.sample.stats,
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      whatsapp: "",
    },
    theme: {},
    sections: null,
    plan: "basic",
    paid: true,
    customDomain: "",
    cta: {
      title: "Book Your Glow Up",
      subtitle: "Weekend chairs go fast — reserve yours and skip the wait.",
    },
    seo: {
      title: "GlowUp Salon | Premium Salon & Bridal Studio in Pune",
      description:
        "Precision haircuts, balayage, keratin and bridal makeup in Pune. See services, pricing and book your chair at GlowUp Salon.",
    },
    published: true,
    createdAt: "2025-11-04T10:15:00.000Z",
  },

  /* ============================ RESTAURANT ============================ */
  {
    id: "seed-urban-bites",
    slug: "urban-bites",
    category: "restaurant",
    name: "Urban Bites",
    tagline: "Modern Indian, Fired by Flame",
    about:
      "A 120-cover dining room in Viman Nagar built around a live mango-wood charcoal grill. Regional Indian recipes, modern plating, farm produce from 14 local partners, and a zero-proof craft bar.",
    heroImage: T.restaurant.sample.images.hero,
    aboutImage: T.restaurant.sample.images.about,
    gallery: T.restaurant.sample.images.gallery,
    contact: {
      phone: "+91 93250 24680",
      whatsapp: "+91 93250 24680",
      email: "reserve@urbanbites.in",
      address: "Plot 18, Viman Nagar Main Road, Pune, Maharashtra 411014",
    },
    hours: T.restaurant.sample.hours,
    services: [],
    features: T.restaurant.sample.features,
    plans: [],
    menu: T.restaurant.sample.menu,
    team: T.restaurant.sample.team,
    testimonials: T.restaurant.sample.testimonials,
    faqs: [],
    stats: T.restaurant.sample.stats,
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      whatsapp: "",
    },
    theme: {},
    sections: null,
    plan: "basic",
    paid: true,
    customDomain: "",
    cta: {
      title: "Reserve Your Table",
      subtitle: "Fridays and Sundays book out by evening — a quick call secures your spot.",
    },
    seo: {
      title: "Urban Bites | Modern Indian Restaurant in Pune",
      description:
        "Charcoal-fired modern Indian cuisine in Pune. View the Urban Bites menu, reserve a table or book the private dining room.",
    },
    published: true,
    createdAt: "2025-11-04T10:20:00.000Z",
  },
];

/**
 * Every demo website is attributed to the demo admin account, so ownership
 * isolation behaves identically in API mode and offline mode.
 */
export const SEED_BUSINESSES = RAW_BUSINESSES.map((b) => ({
  ...b,
  ownerName: DEMO_SITE_CREATOR.name,
  ownerEmail: DEMO_SITE_CREATOR.email,
  createdByName: DEMO_SITE_CREATOR.name,
  createdByEmail: DEMO_SITE_CREATOR.email,
  createdByRole: DEMO_SITE_CREATOR.role,
}));
