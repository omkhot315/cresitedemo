import mongoose from "mongoose";

/**
 * Lead — one enquiry submitted from a business website's contact form.
 *
 * Every submission lands in the super admin's inbox so the platform owner can
 * see (and act on) demand across all the websites they host.
 */
const leadSchema = new mongoose.Schema(
  {
    /** Which website the enquiry came from. */
    businessSlug: { type: String, index: true, default: "" },
    businessName: { type: String, default: "" },
    category: { type: String, default: "" },

    name: { type: String, required: [true, "Name is required"], trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },

    /** read / unread for the dashboard inbox. */
    read: { type: Boolean, default: false, index: true },

    /** Where it came from, for filtering/spam triage. */
    source: { type: String, default: "contact-form" },
  },
  { timestamps: true }
);

leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model("Lead", leadSchema);
