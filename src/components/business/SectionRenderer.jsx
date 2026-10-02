import BizHero from "../sections/BizHero.jsx";
import BizAbout from "../sections/BizAbout.jsx";
import BizFeatures from "../sections/BizFeatures.jsx";
import BizServices from "../sections/BizServices.jsx";
import BizMenu from "../sections/BizMenu.jsx";
import BizPricing from "../sections/BizPricing.jsx";
import BizTeam from "../sections/BizTeam.jsx";
import BizGallery from "../sections/BizGallery.jsx";
import BizTestimonials from "../sections/BizTestimonials.jsx";
import BizHours from "../sections/BizHours.jsx";
import BizFaq from "../sections/BizFaq.jsx";
import BizCta from "../sections/BizCta.jsx";
import BizContact from "../sections/BizContact.jsx";

/**
 * The registry of shared section components.
 * Adding a brand-new section type = one component + one map entry.
 * Businesses choose/ reorder sections via their `sections` array.
 */
export const SECTION_COMPONENTS = {
  hero: BizHero,
  about: BizAbout,
  features: BizFeatures,
  services: BizServices,
  menu: BizMenu,
  pricing: BizPricing,
  team: BizTeam,
  gallery: BizGallery,
  testimonials: BizTestimonials,
  hours: BizHours,
  faq: BizFaq,
  cta: BizCta,
  contact: BizContact,
};

export default function SectionRenderer({ order }) {
  return (
    <>
      {order.map((id) => {
        const Cmp = SECTION_COMPONENTS[id];
        return Cmp ? <Cmp key={id} /> : null;
      })}
    </>
  );
}
