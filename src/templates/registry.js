/**
 * Template registry — the visual DNA of every business category.
 *
 * Instead of duplicating page components per category (ClinicWebsite.jsx etc.),
 * each family below declares *configuration*: fonts, palette tokens, layout
 * variants, section order/copy and sample content. The shared section
 * components read this config and render dramatically different designs.
 *
 * Adding support for a new look = adding one entry here. Zero new components.
 */
import { getCategory, categoryLabel } from "../data/categories.js";
import { CATEGORY_STYLES } from "../data/categoryStyles.js";
import { uid } from "../utils/businessUtils.js";

const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

/* Shared portrait pool for team members */
const PORTRAITS = {
  doctorF: px(33680700),
  doctorM: px(38740728),
  doctorF2: px(7717254),
  coach1: px(14950779),
  coach2: px(6102841),
  coach3: px(30269649),
  stylist1: px(34930167),
  stylist2: px(6497114),
  stylist3: px(35490803),
  chef1: px(33799456),
};

export const TEMPLATES = {
  /* ------------------------------------------------------------------ */
  clinic: {
    id: "clinic",
    name: "Clinic & Healthcare",
    scheme: "light",
    fonts: { display: "'Plus Jakarta Sans', 'Inter', sans-serif", body: "'Inter', sans-serif" },
    heading: { weight: 800, spacing: "-0.02em", transform: "none" },
    kicker: { transform: "uppercase", spacing: "0.18em", style: "normal", weight: 700 },
    radius: "1.5rem",
    button: "pill",
    theme: {
      primary: "#0E7490",
      secondary: "#164E63",
      accent: "#14B8A6",
      bg: "#F7FAFB",
      card: "#FFFFFF",
      ink: "#0C2231",
      muted: "#55707E",
      line: "#E3EAF0",
    },
    navVariant: "floating",
    heroVariant: "split",
    servicesVariant: "cards",
    teamVariant: "cards",
    galleryVariant: "grid",
    testimonialsVariant: "cards",
    ctaLabel: "Book Appointment",
    ctaTarget: "contact",
    sections: [
      { id: "hero", nav: "Home" },
      { id: "about", nav: "About", kicker: "About Us", title: "Care that puts you first" },
      { id: "features", nav: "Why Us", kicker: "Why Choose Us", title: "Healthcare you can trust" },
      { id: "services", nav: "Treatments", kicker: "What We Treat", title: "Treatments & services", subtitle: "Advanced, gentle and honest care for every member of your family." },
      { id: "team", nav: "Doctors", kicker: "Our Specialists", title: "Meet our doctors" },
      { id: "gallery", nav: "Gallery", kicker: "Inside Our Clinic", title: "A calm, modern space" },
      { id: "testimonials", nav: "Reviews", kicker: "Patient Stories", title: "Smiles we have shaped" },
      { id: "faq", nav: "FAQ", kicker: "Good To Know", title: "Frequently asked questions" },
      { id: "cta" },
      { id: "contact", nav: "Contact", kicker: "Visit Us", title: "Book your visit" },
    ],
    sample: {
      tagline: "Healthy Smile, Happy Life",
      about:
        "For over a decade our practice has combined gentle, honest dentistry with modern equipment. From routine check-ups to full smile makeovers, every treatment plan is explained clearly and priced transparently.",
      stats: [
        { value: "12+", label: "Years of care" },
        { value: "15k+", label: "Happy patients" },
        { value: "4.9", label: "Google rating" },
        { value: "6", label: "Specialists" },
      ],
      features: [
        { icon: "ShieldCheck", title: "Strict Sterilization", description: "4-step instrument sterilization and single-use disposables for every patient." },
        { icon: "ScanLine", title: "Digital Dentistry", description: "Low-radiation digital X-rays and intraoral scanners for precise diagnosis." },
        { icon: "Wallet", title: "Transparent Pricing", description: "Written estimates before treatment and easy EMI options on major procedures." },
        { icon: "HeartPulse", title: "Painless Protocols", description: "Computer-assisted anaesthesia and gentle techniques for anxious patients." },
      ],
      services: [
        { icon: "Sparkles", title: "Dental Cleaning & Polishing", description: "Ultrasonic scaling and stain removal for a fresh, healthy mouth.", price: "₹999" },
        { icon: "Activity", title: "Root Canal Treatment", description: "Single-visit, microscope-assisted root canals that save natural teeth.", price: "₹4,500" },
        { icon: "ShieldCheck", title: "Dental Implants", description: "Permanent, natural-looking tooth replacement with Swiss implant systems.", price: "₹25,000" },
        { icon: "Sun", title: "Teeth Whitening", description: "In-office whitening that brightens your smile by up to 8 shades.", price: "₹6,999" },
        { icon: "Smile", title: "Braces & Clear Aligners", description: "Metal, ceramic and invisible aligner options for all ages.", price: "₹35,000" },
        { icon: "Baby", title: "Kids Dentistry", description: "Friendly first visits, fluoride application and cavity care for children.", price: "₹799" },
      ],
      team: [
        { name: "Dr. Asha Verma", role: "Chief Dental Surgeon, MDS", bio: "12+ years in conservative and cosmetic dentistry.", photo: PORTRAITS.doctorF },
        { name: "Dr. Rohan Kulkarni", role: "Implantologist, MDS", bio: "Fellow of the International Congress of Oral Implantologists.", photo: PORTRAITS.doctorM },
        { name: "Dr. Sneha Patil", role: "Orthodontist, MDS", bio: "Certified clear-aligner provider, braces for all ages.", photo: PORTRAITS.doctorF2 },
      ],
      testimonials: [
        { name: "Priya Deshmukh", role: "Root canal patient", rating: 5, text: "I was terrified of root canals. The doctor explained everything and it was genuinely painless. Best dental experience I've had." },
        { name: "Amit Jadhav", role: "Aligner patient", rating: 5, text: "Transparent pricing, no pushing of unnecessary treatments. My aligner journey was tracked with photos at every visit." },
        { name: "Sunita Kulkarni", role: "Parent", rating: 5, text: "My 6-year-old actually looks forward to dental visits now. The team is wonderful with kids." },
      ],
      faqs: [
        { q: "Do I need an appointment, or can I walk in?", a: "Walk-ins are welcome for emergencies, but we recommend booking so you never have to wait. You can call or WhatsApp us to reserve a slot." },
        { q: "Is root canal treatment painful?", a: "With modern anaesthesia and rotary instruments, most patients feel little to no discomfort and return to work the same day." },
        { q: "Do you offer EMI or payment plans?", a: "Yes. Treatments above ₹10,000 can be split into easy monthly instalments at 0% interest." },
        { q: "How often should I get a dental check-up?", a: "Every six months. Regular scaling and check-ups prevent most major — and expensive — dental problems." },
      ],
      hours: [
        { day: "Monday – Saturday", time: "10:00 AM – 1:30 PM, 5:00 – 9:00 PM" },
        { day: "Sunday", time: "Closed · Emergencies on call" },
      ],
      images: { hero: px(4269265), about: px(7800666), gallery: [px(5355863), px(4269268), px(3845729), px(8260433)] },
    },
  },

  /* ------------------------------------------------------------------ */
  gym: {
    id: "gym",
    name: "Gym & Fitness",
    scheme: "dark",
    fonts: { display: "'Oswald', 'Inter', sans-serif", body: "'Inter', sans-serif" },
    heading: { weight: 600, spacing: "0.01em", transform: "uppercase" },
    kicker: { transform: "uppercase", spacing: "0.3em", style: "normal", weight: 600 },
    radius: "0.6rem",
    button: "sharp",
    theme: {
      primary: "#D8FF3E",
      secondary: "#17171A",
      accent: "#FF5A1F",
      bg: "#0B0B0D",
      card: "#141417",
      ink: "#F4F4F2",
      muted: "#9C9CA3",
      line: "#242429",
    },
    navVariant: "bar",
    heroVariant: "full",
    servicesVariant: "tiles",
    teamVariant: "dark",
    galleryVariant: "masonry",
    testimonialsVariant: "cards",
    ctaLabel: "Start Free Trial",
    ctaTarget: "pricing",
    sections: [
      { id: "hero", nav: "Home" },
      { id: "about", nav: "About", kicker: "Since 2016", title: "More than a gym" },
      { id: "services", nav: "Programs", kicker: "Train Your Way", title: "Programs built for results", subtitle: "Whatever your goal — strength, fat loss or fight-ready fitness — there's a program with your name on it." },
      { id: "pricing", nav: "Membership", kicker: "No Lock-ins", title: "Membership plans", subtitle: "Simple pricing. Cancel anytime. Every plan includes a free fitness assessment." },
      { id: "team", nav: "Trainers", kicker: "The Coaches", title: "Meet your trainers" },
      { id: "gallery", nav: "Gallery", kicker: "Inside The Arena", title: "Where the work happens" },
      { id: "testimonials", nav: "Results", kicker: "Member Stories", title: "Real people. Real results." },
      { id: "hours", nav: "Timings", kicker: "Gym Timings", title: "When we train" },
      { id: "cta" },
      { id: "contact", nav: "Contact", kicker: "Get Started", title: "Claim your free trial" },
    ],
    sample: {
      tagline: "Train Hard. Stay Humble.",
      about:
        "6,000 sq. ft. of iron, sweat and community. Since 2016 we've helped over a thousand members get stronger with coach-led programming, serious equipment and zero judgement.",
      stats: [
        { value: "1200+", label: "Active members" },
        { value: "40+", label: "Machines & rigs" },
        { value: "10", label: "Certified coaches" },
        { value: "4.8", label: "Google rating" },
      ],
      features: [
        { icon: "Dumbbell", title: "Serious Iron", description: "Eleiko bars, calibrated plates and a dedicated deadlift platform." },
        { icon: "Users", title: "Coach-led Training", description: "Every floor hour is supervised — form checks are always free." },
        { icon: "ShowerHead", title: "Premium Amenities", description: "Steam room, filtered water, lockers and spotless showers." },
        { icon: "Salad", title: "Nutrition Support", description: "Custom Indian meal plans built around your training split." },
      ],
      services: [
        { icon: "Dumbbell", title: "Strength Training", description: "Powerlifting-style programming with progressive overload tracking." },
        { icon: "Flame", title: "Functional & HIIT", description: "High-intensity circuits that torch fat and build engine." },
        { icon: "Target", title: "Boxing & MMA Fitness", description: "Bag work, pads and conditioning with fight-experienced coaches." },
        { icon: "HeartPulse", title: "Cardio Zone", description: "Treadmills, assault bikes, rowers and a spin studio." },
        { icon: "UserCheck", title: "Personal Training", description: "1-on-1 coaching with monthly body-composition tracking." },
        { icon: "Salad", title: "Nutrition Coaching", description: "Macro plans, habit coaching and supplement guidance." },
      ],
      plans: [
        { name: "Monthly", price: "₹1,000", period: "/month", features: ["Full gym access", "1 group class / week", "Locker access", "Fitness assessment"], highlighted: false, cta: "Start Monthly" },
        { name: "Quarterly", price: "₹2,500", period: "/3 months", features: ["Everything in Monthly", "Unlimited group classes", "1 PT session free", "Diet starter plan"], highlighted: true, cta: "Most Popular" },
        { name: "Annual", price: "₹8,000", period: "/year", features: ["Everything in Quarterly", "4 PT sessions free", "Custom nutrition plan", "Freeze anytime"], highlighted: false, cta: "Best Value" },
      ],
      team: [
        { name: "Vikram Sawant", role: "Head Coach · Strength", bio: "K11 certified, 12 years of competitive powerlifting.", photo: PORTRAITS.coach1 },
        { name: "Rahul Mane", role: "Conditioning · Boxing", bio: "State-level boxer, CrossFit L2 trainer.", photo: PORTRAITS.coach2 },
        { name: "Suresh Pawar", role: "Strength & Conditioning", bio: "30 years on the platform, mentors all new coaches.", photo: PORTRAITS.coach3 },
      ],
      testimonials: [
        { name: "Snehal Patil", role: "Lost 18 kg in 8 months", rating: 5, text: "Coaches actually watch your form every single session. The nutrition plan was food I already cook at home." },
        { name: "Omkar Bhosale", role: "Member since 2019", rating: 5, text: "Best-equipped gym in the city, period. Deadlift platforms, proper chalk policy and zero ego on the floor." },
        { name: "Rutuja Kadam", role: "Boxing program", rating: 5, text: "Joined for fitness, stayed for the community. The 6 AM batch is basically family now." },
      ],
      faqs: [],
      hours: [
        { day: "Monday – Saturday", time: "5:00 AM – 10:00 PM" },
        { day: "Sunday", time: "7:00 AM – 12:00 PM" },
      ],
      images: { hero: px(17956264), about: px(35540076), gallery: [px(31028213), px(35306851), px(31267847), px(29392543)] },
    },
  },

  /* ------------------------------------------------------------------ */
  cafe: {
    id: "cafe",
    name: "Cafe & Coffee",
    scheme: "warm",
    fonts: { display: "'Fraunces', Georgia, serif", body: "'Inter', sans-serif" },
    heading: { weight: 600, spacing: "-0.01em", transform: "none" },
    kicker: { transform: "uppercase", spacing: "0.26em", style: "normal", weight: 600 },
    radius: "1.75rem",
    button: "pill",
    theme: {
      primary: "#7C4A2D",
      secondary: "#3C2A1E",
      accent: "#C98F52",
      bg: "#FAF4EA",
      card: "#FFFDF8",
      ink: "#2E211A",
      muted: "#8A7568",
      line: "#EADFD0",
    },
    navVariant: "floating",
    heroVariant: "center",
    servicesVariant: "cards",
    teamVariant: "circle",
    galleryVariant: "grid",
    testimonialsVariant: "spotlight",
    ctaLabel: "Plan Your Visit",
    ctaTarget: "contact",
    sections: [
      { id: "hero", nav: "Home" },
      { id: "about", nav: "Our Story", kicker: "Our Story", title: "Brewed with intention" },
      { id: "features", nav: "Why Us", kicker: "The Difference", title: "Why people stay a while" },
      { id: "menu", nav: "Menu", kicker: "Taste The Good Stuff", title: "The menu", subtitle: "Single-origin brews, slow bakes and plates made for lingering." },
      { id: "gallery", nav: "Gallery", kicker: "Daily Moments", title: "From the counter" },
      { id: "testimonials", nav: "Reviews", kicker: "Kind Words", title: "What regulars say" },
      { id: "hours", nav: "Hours", kicker: "Opening Hours", title: "When the kettle's on" },
      { id: "cta" },
      { id: "contact", nav: "Find Us", kicker: "Find Us", title: "Come say hello" },
    ],
    sample: {
      tagline: "Slow Coffee, Fast Friends",
      about:
        "A 40-seater corner cafe roasting single-origin Indian beans in small weekly batches. Come for the pour-overs, stay for the playlist, the window seats and the smell of fresh croissants.",
      stats: [
        { value: "12", label: "Signature brews" },
        { value: "40+", label: "Cozy seats" },
        { value: "4.7", label: "Google rating" },
      ],
      features: [
        { icon: "Coffee", title: "Single-origin Beans", description: "Chikmagalur and Coorg estates, roasted in-house every week." },
        { icon: "Croissant", title: "Baked Fresh Daily", description: "Croissants, sourdough and pies out of the oven by 8 AM." },
        { icon: "Wifi", title: "Work-friendly", description: "Fast wifi, plug points at every wall table and no rush policy." },
        { icon: "PawPrint", title: "Pet Friendly", description: "Water bowls and treats for four-legged regulars." },
      ],
      services: [],
      menu: [
        {
          category: "Espresso Bar",
          items: [
            { name: "Espresso / Doppio", description: "Double shot, single-origin Coorg", price: "₹90", tag: "" },
            { name: "Cortado", description: "Equal parts espresso and steamed milk", price: "₹140", tag: "" },
            { name: "Cappuccino", description: "Classic dry foam, dusted cocoa", price: "₹150", tag: "Bestseller" },
            { name: "Café Mocha", description: "Espresso, dark chocolate, cream", price: "₹170", tag: "" },
          ],
        },
        {
          category: "Signature Brews",
          items: [
            { name: "Cold Brew Tonic", description: "18-hr cold brew, citrus tonic", price: "₹180", tag: "Bestseller" },
            { name: "Hazelnut Latte", description: "House hazelnut praline, oat option", price: "₹190", tag: "" },
            { name: "Vietnamese Iced Coffee", description: "Condensed milk, dark robusta", price: "₹175", tag: "" },
            { name: "Affogato", description: "Vanilla bean gelato, espresso pour", price: "₹160", tag: "" },
          ],
        },
        {
          category: "From the Kitchen",
          items: [
            { name: "Butter Croissant", description: " laminated with cultured butter", price: "₹110", tag: "" },
            { name: "Pesto Chicken Panini", description: "Sourdough, basil pesto, mozzarella", price: "₹210", tag: "Bestseller" },
            { name: "Sourdough Toastie", description: "Three-cheese, tomato jam", price: "₹195", tag: "" },
            { name: "Banoffee Pie", description: "Banana, dulce de leche, cream", price: "₹160", tag: "" },
          ],
        },
      ],
      team: [],
      testimonials: [
        { name: "Anika Shah", role: "Regular since 2020", rating: 5, text: "The cortado here ruined every other cafe for me. Perfect temperature, perfect ratio, every single time." },
        { name: "Rohan Mistry", role: "Remote worker", rating: 5, text: "My unofficial office. Great wifi, better coffee, and they remember my order on day two." },
        { name: "Meera Kulkarni", role: "Weekend bruncher", rating: 5, text: "Banoffee pie + cold brew tonic on the window seat is my entire personality now." },
      ],
      faqs: [],
      hours: [
        { day: "Monday – Friday", time: "8:00 AM – 11:00 PM" },
        { day: "Saturday – Sunday", time: "8:00 AM – 11:30 PM" },
      ],
      images: { hero: px(765162), about: px(16536171), gallery: [px(17305195), px(35976193), px(15100116), px(37034126)] },
    },
  },

  /* ------------------------------------------------------------------ */
  salon: {
    id: "salon",
    name: "Salon & Beauty",
    scheme: "luxe",
    fonts: { display: "'Cormorant Garamond', Georgia, serif", body: "'Inter', sans-serif" },
    heading: { weight: 600, spacing: "0.01em", transform: "none" },
    kicker: { transform: "uppercase", spacing: "0.32em", style: "normal", weight: 500 },
    radius: "2rem",
    button: "pill",
    theme: {
      primary: "#B76E79",
      secondary: "#1C1614",
      accent: "#D9A5A0",
      bg: "#FBF4F2",
      card: "#FFFFFF",
      ink: "#211513",
      muted: "#8A6F6A",
      line: "#F0DEDA",
    },
    navVariant: "floating",
    heroVariant: "center",
    servicesVariant: "rows",
    teamVariant: "arch",
    galleryVariant: "grid",
    testimonialsVariant: "spotlight",
    ctaLabel: "Book Your Glow Up",
    ctaTarget: "contact",
    sections: [
      { id: "hero", nav: "Home" },
      { id: "about", nav: "The Studio", kicker: "The Studio", title: "Where elegance meets artistry" },
      { id: "services", nav: "Services", kicker: "Menu of Services", title: "Services & pricing", subtitle: "Every service begins with a consultation and ends with a finish you'll love." },
      { id: "features", nav: "Promise", kicker: "Our Promise", title: "The experience, elevated" },
      { id: "team", nav: "Artists", kicker: "The Artists", title: "Meet our stylists" },
      { id: "gallery", nav: "Lookbook", kicker: "The Lookbook", title: "Recent transformations" },
      { id: "testimonials", nav: "Reviews", kicker: "Client Love", title: "Kind words" },
      { id: "hours", nav: "Hours", kicker: "Studio Hours", title: "When we're open" },
      { id: "cta" },
      { id: "contact", nav: "Book", kicker: "Reserve Your Chair", title: "Book an appointment" },
    ],
    sample: {
      tagline: "Where Elegance Meets Artistry",
      about:
        "A luxe unisex studio specialising in precision cuts, dimensional colour and bridal artistry. Nine years, twenty thousand makeovers, and one promise — you leave feeling like the best version of yourself.",
      stats: [
        { value: "20k+", label: "Makeovers" },
        { value: "9", label: "Years of craft" },
        { value: "4.9", label: "Google rating" },
      ],
      features: [
        { icon: "Wand2", title: "Consultation First", description: "Face-shape analysis and honest advice before a single snip." },
        { icon: "Leaf", title: "Ammonia-free Colour", description: "Premium cruelty-free colour lines that respect your hair." },
        { icon: "Sparkles", title: "Hygiene Obsessed", description: "Fresh towels, sterilised tools and single-use kits, always." },
        { icon: "Crown", title: "Bridal Specialists", description: "Dedicated bridal suite and on-location artistry teams." },
      ],
      services: [
        { icon: "Scissors", title: "Signature Haircut", description: "Consultation, precision cut, wash and style finish.", price: "₹699" },
        { icon: "Palette", title: "Global Colour", description: "Full-head colour with bond-protect treatment.", price: "₹2,999" },
        { icon: "Wand2", title: "Balayage / Highlights", description: "Hand-painted dimension, toner and gloss included.", price: "₹4,499" },
        { icon: "Sparkles", title: "Keratin Hair Spa", description: "Deep-repair ritual for frizz control and shine.", price: "₹1,899" },
        { icon: "Flower2", title: "Classic Facial", description: "Cleanse, exfoliate, massage and mask for instant glow.", price: "₹1,299" },
        { icon: "Crown", title: "Bridal Makeup", description: "HD or airbrush artistry with trial session included.", price: "₹9,999" },
      ],
      team: [
        { name: "Riya Kapoor", role: "Creative Director", bio: "L'Oréal-trained, 11 years of editorial and bridal work.", photo: PORTRAITS.stylist1 },
        { name: "Ananya Joshi", role: "Senior Stylist", bio: "Precision cutting specialist, Vidal Sassoon alumni.", photo: PORTRAITS.stylist2 },
        { name: "Kabir Sheikh", role: "Colour Specialist", bio: "Balayage and colour-correction artist.", photo: PORTRAITS.stylist3 },
      ],
      testimonials: [
        { name: "Shruti Menon", role: "Bridal client", rating: 5, text: "My bridal trial was so good I cried a little. On the day, the makeup lasted 14 hours of hugging and happy tears." },
        { name: "Neha Bhandari", role: "Balayage client", rating: 5, text: "Kabir fixed a box-dye disaster and turned it into the most beautiful caramel balayage. Trust them completely." },
        { name: "Aditi Rao", role: "Monthly regular", rating: 5, text: "The consultation-first approach is real. They once talked me OUT of a cut that wouldn't suit my face. Honest artists." },
      ],
      faqs: [],
      hours: [
        { day: "Tuesday – Sunday", time: "10:00 AM – 8:30 PM" },
        { day: "Monday", time: "Closed · Deep-clean day" },
      ],
      images: { hero: px(7750103), about: px(14615063), gallery: [px(7195803), px(7755216), px(3065209), px(19664876)] },
    },
  },

  /* ------------------------------------------------------------------ */
  restaurant: {
    id: "restaurant",
    name: "Restaurant & Dining",
    scheme: "dark-elegant",
    fonts: { display: "'Playfair Display', Georgia, serif", body: "'Inter', sans-serif" },
    heading: { weight: 700, spacing: "0em", transform: "none" },
    kicker: { transform: "uppercase", spacing: "0.3em", style: "normal", weight: 500 },
    radius: "1rem",
    button: "soft",
    theme: {
      primary: "#E0A526",
      secondary: "#141210",
      accent: "#C4492E",
      bg: "#131110",
      card: "#1C1917",
      ink: "#F1EAE0",
      muted: "#A79C8D",
      line: "#2A2622",
    },
    navVariant: "bar",
    heroVariant: "full",
    servicesVariant: "cards",
    teamVariant: "circle",
    galleryVariant: "grid",
    testimonialsVariant: "spotlight",
    ctaLabel: "Reserve a Table",
    ctaTarget: "contact",
    sections: [
      { id: "hero", nav: "Home" },
      { id: "about", nav: "Story", kicker: "Fire & Flavour", title: "A kitchen built around flame" },
      { id: "features", nav: "Why Us", kicker: "The Craft", title: "Why tables book out" },
      { id: "menu", nav: "Menu", kicker: "The Menu", title: "Signature plates", subtitle: "Regional Indian recipes reimagined over live charcoal." },
      { id: "team", nav: "Chefs", kicker: "From The Pass", title: "Meet the chefs" },
      { id: "gallery", nav: "Gallery", kicker: "Plates & Places", title: "From our kitchen" },
      { id: "testimonials", nav: "Reviews", kicker: "Word of Mouth", title: "What diners say" },
      { id: "hours", nav: "Hours", kicker: "Service Hours", title: "When we serve" },
      { id: "cta" },
      { id: "contact", nav: "Reserve", kicker: "Reservations", title: "Book your table" },
    ],
    sample: {
      tagline: "Modern Indian, Fired by Flame",
      about:
        "A 120-cover dining room built around a live charcoal grill. Regional recipes from across India, reimagined with modern technique, local produce and a craft mocktail bar.",
      stats: [
        { value: "120", label: "Covers" },
        { value: "45+", label: "Signature plates" },
        { value: "4.8", label: "Google rating" },
      ],
      features: [
        { icon: "Flame", title: "Live Charcoal Kitchen", description: "Every grill plate kissed by real mango-wood charcoal." },
        { icon: "Leaf", title: "Farm-to-Table", description: "Produce from 14 partner farms within 80 km." },
        { icon: "Martini", title: "Craft Mocktail Bar", description: "Zero-proof cocktails built on shrubs, smoke and spice." },
        { icon: "KeyRound", title: "Private Dining", description: "A 16-seat private room with a custom tasting menu." },
      ],
      services: [],
      menu: [
        {
          category: "Small Plates",
          items: [
            { name: "Smoked Paneer Tikka", description: "Charcoal-smoked, mint chutney soil", price: "₹325", tag: "" },
            { name: "Bhut Jolokia Wings", description: "Ghost-pepper glaze, cooling ranch", price: "₹345", tag: "Spicy" },
            { name: "Keema Pav", description: "Old-Delhi style, buttered pav", price: "₹295", tag: "" },
            { name: "Burrata Chaat", description: "Papur, tamarind, sev — our cult classic", price: "₹315", tag: "Chef's Special" },
          ],
        },
        {
          category: "Mains",
          items: [
            { name: "Old Delhi Butter Chicken", description: "Charcoal tikka, tomato-makhan gravy", price: "₹425", tag: "Bestseller" },
            { name: "Jackfruit Biryani", description: "Kathal slow-cooked sous-vide, saffron rice", price: "₹365", tag: "" },
            { name: "Truffle Dal Makhani", description: "48-hr black dal, truffle butter finish", price: "₹345", tag: "" },
            { name: "Coastal Prawn Curry", description: "Mangalorean gassi, neer dosa", price: "₹475", tag: "Chef's Special" },
          ],
        },
        {
          category: "Desserts",
          items: [
            { name: "Gulab Jamun Cheesecake", description: "Baked, cardamom crumb", price: "₹245", tag: "Bestseller" },
            { name: "Smoked Chocolate Fondant", description: "70% dark, charcoal ice cream", price: "₹265", tag: "" },
            { name: "Kesari Phirni", description: "Saffron rice cream, pistachio", price: "₹195", tag: "" },
          ],
        },
      ],
      team: [
        { name: "Chef Omkar Narvekar", role: "Executive Chef", bio: "Ex-Taj kitchens; obsessed with regional Indian fire cooking.", photo: PORTRAITS.chef1 },
        { name: "Chef Nikhil D'Souza", role: "Sous Chef · Grill", bio: "Runs the charcoal line; 9 years across Goa and Mumbai.", photo: PORTRAITS.doctorM },
      ],
      testimonials: [
        { name: "Karishma Jain", role: "Anniversary dinner", rating: 5, text: "The burrata chaat sounds wrong and tastes like genius. Service anticipated everything before we asked." },
        { name: "Farhan Akhtar", role: "Food blogger", rating: 5, text: "Finally, a modern Indian kitchen that respects the roots. The truffle dal makhani is a masterpiece." },
        { name: "Vishal Rane", role: "Regular", rating: 5, text: "Private dining room for my parents' 40th — custom menu, zero stress, standing ovation from the family." },
      ],
      faqs: [],
      hours: [
        { day: "Lunch · All days", time: "12:00 PM – 3:30 PM" },
        { day: "Dinner · All days", time: "7:00 PM – 11:30 PM" },
      ],
      images: { hero: px(36904788), about: px(36430088), gallery: [px(23947763), px(37726979), px(15671277), px(18812048)] },
    },
  },

  /* ------------------------------------------------------------------ */
  business: {
    id: "business",
    name: "Professional Business",
    scheme: "professional",
    fonts: { display: "'Space Grotesk', 'Inter', sans-serif", body: "'Inter', sans-serif" },
    heading: { weight: 700, spacing: "-0.02em", transform: "none" },
    kicker: { transform: "uppercase", spacing: "0.2em", style: "normal", weight: 600 },
    radius: "1.25rem",
    button: "soft",
    theme: {
      primary: "#4F46E5",
      secondary: "#312E81",
      accent: "#F59E0B",
      bg: "#F8FAFC",
      card: "#FFFFFF",
      ink: "#0F172A",
      muted: "#64748B",
      line: "#E2E8F0",
    },
    navVariant: "floating",
    heroVariant: "split",
    servicesVariant: "cards",
    teamVariant: "cards",
    galleryVariant: "grid",
    testimonialsVariant: "cards",
    ctaLabel: "Get in Touch",
    ctaTarget: "contact",
    sections: [
      { id: "hero", nav: "Home" },
      { id: "about", nav: "About", kicker: "Who We Are", title: "Built on trust and results" },
      { id: "features", nav: "Why Us", kicker: "Why Choose Us", title: "The right partner for the job" },
      { id: "services", nav: "Services", kicker: "What We Do", title: "Our services", subtitle: "Everything you need, delivered with care and professionalism." },
      { id: "team", nav: "Team", kicker: "The People", title: "Meet the team" },
      { id: "gallery", nav: "Work", kicker: "Our Work", title: "Recent highlights" },
      { id: "testimonials", nav: "Reviews", kicker: "Client Words", title: "What clients say" },
      { id: "cta" },
      { id: "contact", nav: "Contact", kicker: "Let's Talk", title: "Start the conversation" },
    ],
    sample: {
      tagline: "Quality you can see, service you can trust",
      about:
        "We've built our name one happy customer at a time. Expect clear communication, honest pricing and work we're proud to put our name on.",
      stats: [
        { value: "500+", label: "Projects done" },
        { value: "8+", label: "Years running" },
        { value: "4.8", label: "Google rating" },
      ],
      features: [
        { icon: "BadgeCheck", title: "Trusted Experts", description: "Experienced professionals who care about the details." },
        { icon: "Wallet", title: "Honest Pricing", description: "Clear quotes upfront. No surprises, ever." },
        { icon: "Clock", title: "On-time Delivery", description: "We respect your time and stick to our commitments." },
        { icon: "Headset", title: "Always Reachable", description: "Quick responses on call and WhatsApp, 6 days a week." },
      ],
      services: [
        { icon: "BadgeCheck", title: "Consultation", description: "A free first conversation to understand exactly what you need.", price: "" },
        { icon: "Settings", title: "Core Service", description: "Our flagship offering, delivered end-to-end by our team.", price: "" },
        { icon: "TrendingUp", title: "Growth Package", description: "For regular clients — priority support and bundled savings.", price: "" },
        { icon: "ShieldCheck", title: "AMC & Support", description: "Ongoing maintenance so everything keeps running smoothly.", price: "" },
      ],
      team: [
        { name: "Founder Name", role: "Founder & Lead", bio: "The person who started it all — and still checks every job.", photo: PORTRAITS.chef1 },
        { name: "Team Member", role: "Operations", bio: "Keeps every project on schedule and every client updated.", photo: PORTRAITS.doctorF },
        { name: "Team Member", role: "Specialist", bio: "Deep expertise, friendly attitude.", photo: PORTRAITS.coach2 },
      ],
      testimonials: [
        { name: "Happy Client", role: "Repeat customer", rating: 5, text: "Professional from the first call to the final delivery. I've already recommended them to two friends." },
        { name: "Local Business Owner", role: "Client", rating: 5, text: "On time, on budget, and genuinely nice people to work with." },
        { name: "First-time Customer", role: "Client", rating: 5, text: "Clear communication throughout. Will absolutely return." },
      ],
      faqs: [
        { q: "How do I get started?", a: "Just call or WhatsApp us with your requirement. We'll schedule a free consultation and share a clear quote." },
        { q: "What areas do you serve?", a: "We're based locally and serve all nearby areas. For larger projects we're happy to travel." },
        { q: "Do you offer support after delivery?", a: "Yes — every job includes a free support window, and affordable plans after that." },
      ],
      hours: [{ day: "Monday – Saturday", time: "10:00 AM – 7:00 PM" }],
      images: { hero: null, about: null, gallery: [] },
    },
  },
};

/**
 * Resolve the complete template for a category.
 *
 * The family (TEMPLATES) owns WHICH sections render and the sample content.
 * The category style (CATEGORY_STYLES) owns HOW it looks — palette, type,
 * radius, button shape and every section variant. Merging them gives all 32
 * categories a distinct design from one shared engine.
 */
export function templateForCategory(categoryId) {
  const cat = getCategory(categoryId);
  const family = TEMPLATES[cat.template] || TEMPLATES.business;
  const style = CATEGORY_STYLES[categoryId];

  if (!style) return family;

  return {
    ...family,
    ...style,
    /* Never let a style override the family's structure or sample content. */
    sections: family.sections,
    sample: family.sample,
    theme: { ...family.theme, ...style.theme },
    name: `${cat.label} Design`,
  };
}

/** Section meta lookup for a template: { [sectionId]: {nav, kicker, title, subtitle} } */
export function sectionMetaFor(template) {
  const meta = {};
  template.sections.forEach((s) => {
    meta[s.id] = s;
  });
  return meta;
}

/**
 * Build a brand-new EMPTY business draft for a category.
 *
 * Nothing is pre-filled: every word, price, photo and team member must be
 * entered by the admin creating the website. The template only decides which
 * sections exist and how they look — never the content. Sections with no data
 * simply don't render, so a site never ships with placeholder filler.
 */
export function draftFromCategory(categoryId) {
  return {
    id: uid(),
    slug: "",
    category: getCategory(categoryId).id,
    name: "",
    tagline: "",
    about: "",
    contact: { phone: "", whatsapp: "", email: "", address: "" },
    hours: [],
    services: [],
    features: [],
    plans: [],
    menu: [],
    team: [],
    gallery: [],
    heroImage: "",
    aboutImage: "",
    logo: "",
    testimonials: [],
    faqs: [],
    stats: [],
    social: { instagram: "", facebook: "", whatsapp: "" },
    cta: { title: "", subtitle: "" },
    seo: { title: "", description: "" },
    theme: {},
    sections: null,
    plan: null,
    customDomain: "",
    paid: false,
    paidAt: null,
    paymentExempt: false,
    published: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Example content for a category — used ONLY as greyed-out input placeholders
 * so admins know the tone/format expected. Never written into a website.
 */
export function placeholdersFor(categoryId) {
  const s = templateForCategory(categoryId).sample;
  return {
    tagline: s.tagline,
    about: s.about,
    service: s.services?.[0] || { title: "", description: "", price: "" },
    feature: s.features?.[0] || { title: "", description: "" },
    plan: s.plans?.[0] || { name: "", price: "", period: "", features: [] },
    menuGroup: s.menu?.[0]?.category || "Menu section",
    menuItem: s.menu?.[0]?.items?.[0] || { name: "", description: "", price: "" },
    team: s.team?.[0] || { name: "", role: "", bio: "" },
    testimonial: s.testimonials?.[0] || { name: "", role: "", text: "" },
    faq: s.faqs?.[0] || { q: "", a: "" },
    stat: s.stats?.[0] || { value: "", label: "" },
    hours: s.hours?.[0] || { day: "", time: "" },
  };
}

/** Friendly names for every section type, used by the visibility toggles. */
export const SECTION_LABELS = {
  hero: "Hero banner",
  about: "About / our story",
  features: "Why choose us",
  services: "Services",
  menu: "Menu",
  pricing: "Pricing & plans",
  team: "Team",
  gallery: "Gallery",
  testimonials: "Reviews",
  hours: "Opening hours",
  faq: "FAQs",
  cta: "Call-to-action banner",
  contact: "Contact & map",
};

/** Sections that can never be switched off — the page needs a headline. */
export const REQUIRED_SECTIONS = ["hero"];

/** Every section this category's template can render, in order. */
export function sectionListFor(categoryId) {
  return templateForCategory(categoryId).sections.map((s) => ({
    id: s.id,
    label: SECTION_LABELS[s.id] || s.id,
    nav: s.nav || null,
    required: REQUIRED_SECTIONS.includes(s.id),
  }));
}

/** Default state = every section enabled. */
export function defaultSectionIds(categoryId) {
  return templateForCategory(categoryId).sections.map((s) => s.id);
}

/**
 * Which content editors the Create/Edit form should show for a category,
 * derived from the sections its template actually renders.
 */
export function editorsFor(categoryId) {
  const ids = new Set(templateForCategory(categoryId).sections.map((s) => s.id));
  return {
    features: ids.has("features"),
    services: ids.has("services"),
    menu: ids.has("menu"),
    plans: ids.has("pricing"),
    team: ids.has("team"),
    gallery: ids.has("gallery"),
    testimonials: ids.has("testimonials"),
    faqs: ids.has("faq"),
    stats: ids.has("about"),
    cta: ids.has("cta"),
  };
}

export { categoryLabel };
