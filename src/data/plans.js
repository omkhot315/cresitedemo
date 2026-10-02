/**
 * Pricing plans for the platform.
 *
 * These are the customer-facing plans shown on the landing page and chosen
 * during sign-up / website creation. `custom` is quoted per project and always
 * routes the customer to a conversation.
 */
export const PLANS = [
  {
    id: "basic",
    name: "Website",
    price: 999,
    priceLabel: "₹999",
    per: "/year",
    blurb: "A complete website on your own Cresite link.",
    features: [
      "1 business website",
      "cresite.in/your-brand link",
      "All sections — menu, team, gallery, reviews, FAQs",
      "WhatsApp & call buttons",
      "Unlimited edits, any time",
      "Mobile, tablet & desktop design",
    ],
    customDomain: false,
    highlighted: false,
  },
  {
    id: "domain",
    name: "Website + Domain",
    price: 2999,
    priceLabel: "₹2,999",
    per: "/year",
    blurb: "Everything above, on your very own domain name.",
    features: [
      "Everything in Website",
      "Your own domain — yourbrand.com",
      "Free domain for the first year",
      "Business email setup help",
      "Advanced SEO controls",
      "Remove Cresite branding",
    ],
    customDomain: true,
    highlighted: true,
  },
  {
    id: "custom",
    name: "Custom Website",
    price: null,
    priceLabel: "Custom",
    per: "quote",
    blurb: "Something bigger, stranger or fully bespoke? Let's talk.",
    features: [
      "Completely custom design",
      "Any features you need — booking, payments, catalogues",
      "Multi-page & multi-language sites",
      "Content written for you",
      "Photo & logo assistance",
      "Dedicated support & priority turnaround",
    ],
    customDomain: true,
    highlighted: false,
  },
];

export const getPlan = (id) => PLANS.find((p) => p.id === id) || null;
export const DEFAULT_PLAN = "basic";
