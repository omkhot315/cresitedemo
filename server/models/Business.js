import mongoose from "mongoose";

/**
 * Business — one document per hosted small-business website.
 * The shape mirrors the frontend data contract in src/data/seedBusinesses.js,
 * so the same payload flows end-to-end: React <-> API <-> MongoDB.
 */

const opts = { _id: false };

const hourSchema = new mongoose.Schema({ day: String, time: String }, opts);
const serviceSchema = new mongoose.Schema(
  { icon: String, title: String, description: String, price: { type: String, default: "" } },
  opts
);
const featureSchema = new mongoose.Schema({ icon: String, title: String, description: String }, opts);
const planSchema = new mongoose.Schema(
  { name: String, price: String, period: String, features: { type: [String], default: [] }, highlighted: Boolean, cta: String },
  opts
);
const menuSchema = new mongoose.Schema(
  {
    category: String,
    items: { type: [{ _id: false, name: String, description: String, price: String, tag: { type: String, default: "" } }], default: [] },
  },
  opts
);
const teamSchema = new mongoose.Schema({ name: String, role: String, bio: String, photo: String }, opts);
const testimonialSchema = new mongoose.Schema({ name: String, role: String, rating: { type: Number, default: 5 }, text: String }, opts);
const faqSchema = new mongoose.Schema({ q: String, a: String }, opts);
const statSchema = new mongoose.Schema({ value: String, label: String }, opts);

const businessSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "A URL slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and dashes"],
    },
    category: { type: String, required: true, default: "other", index: true },
    name: { type: String, required: [true, "Business name is required"], trim: true },
    tagline: { type: String, default: "" },
    about: { type: String, default: "" },
    logo: { type: String, default: null },
    heroImage: { type: String, default: null },
    aboutImage: { type: String, default: null },
    gallery: { type: [String], default: [] },

    contact: {
      phone: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
    },

    hours: { type: [hourSchema], default: [] },
    services: { type: [serviceSchema], default: [] },
    features: { type: [featureSchema], default: [] },
    plans: { type: [planSchema], default: [] },
    menu: { type: [menuSchema], default: [] },
    team: { type: [teamSchema], default: [] },
    testimonials: { type: [testimonialSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
    stats: { type: [statSchema], default: [] },

    social: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
    },

    /** Brand colour overrides (primary, accent, …) — flexible key/value bag */
    theme: { type: mongoose.Schema.Types.Mixed, default: {} },

    /** Optional custom section order; null => use the category template order */
    sections: { type: [String], default: null },

    cta: { title: { type: String, default: "" }, subtitle: { type: String, default: "" } },
    seo: { title: { type: String, default: "" }, description: { type: String, default: "" } },

    published: { type: Boolean, default: false, index: true },

    /**
     * Commercial plan chosen for this website.
     *   basic  → ₹999/yr, Cresite subdomain only
     *   domain → ₹2,999/yr, includes a custom domain
     *   custom → bespoke build, quoted per project
     */
    plan: {
      type: String,
      enum: ["basic", "domain", "custom", null],
      default: null,
    },
    /** Optional custom domain attached to a "domain"/"custom" plan. */
    customDomain: { type: String, default: "" },

    /** Payment state — set to true once Cashfree confirms a successful payment. */
    paid: { type: Boolean, default: false, index: true },
    paidAt: { type: Date, default: null },

    /**
     * 1-year subscription. On successful payment the website activates for
     * exactly one year; when it lapses the site is hidden publicly but ALL
     * customer data is preserved so a renewal restores it instantly.
     */
    subscriptionStatus: {
      type: String,
      enum: ["none", "active", "expiring", "expired"],
      default: "none",
      index: true,
    },
    subscriptionStart: { type: Date, default: null },
    subscriptionExpiry: { type: Date, default: null, index: true },
    /** How many completed 1-year terms this website has had. */
    subscriptionRenewals: { type: Number, default: 0 },
    /**
     * Cashfree order ids already applied to this subscription. Keeping this on
     * the website makes activation idempotent across retries and server restarts.
     */
    appliedSubscriptionOrderIds: { type: [String], default: [] },
    /** Last time an expiry-reminder email/notification was generated. */
    lastReminderAt: { type: Date, default: null },

    /**
     * Only websites CREATED by the super admin are exempt from payment.
     * These fields are server-managed and stripped from every client payload.
     */
    paymentExempt: { type: Boolean, default: false, index: true },
    paymentExemptReason: { type: String, default: "" },
    paymentExemptBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    paymentExemptAt: { type: Date, default: null },

    /**
     * Account that owns this website. Websites are private to their owner —
     * only the owner and the super admin can manage them (admins are not peers).
     */
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    ownerName: { type: String, default: "" },
    ownerEmail: { type: String, default: "" },

    /** Immutable audit trail: who originally created this website. */
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdByName: { type: String, default: "" },
    createdByEmail: { type: String, default: "" },
    createdByRole: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Business = mongoose.model("Business", businessSchema);
