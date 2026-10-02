/**
 * Business category catalog.
 * Each category maps to a template *family* — the underlying components stay
 * shared, while the family controls layout, typography, palette and sections.
 */

export const CATEGORIES = [
  { id: "clinic", label: "Clinic", icon: "Stethoscope", template: "clinic", blurb: "Appointments, treatments & doctors" },
  { id: "hospital", label: "Hospital", icon: "Hospital", template: "clinic", blurb: "Departments, emergency & OPD info" },
  { id: "dental", label: "Dental Clinic", icon: "Smile", template: "clinic", blurb: "Smiles, implants & orthodontics" },
  { id: "salon", label: "Salon", icon: "Scissors", template: "salon", blurb: "Stylists, services & bookings" },
  { id: "gym", label: "Gym", icon: "Dumbbell", template: "gym", blurb: "Memberships, trainers & classes" },
  { id: "fitness", label: "Fitness Center", icon: "Flame", template: "gym", blurb: "Programs, CrossFit & coaching" },
  { id: "cafe", label: "Cafe", icon: "Coffee", template: "cafe", blurb: "Menu, brews & cozy corners" },
  { id: "restaurant", label: "Restaurant", icon: "UtensilsCrossed", template: "restaurant", blurb: "Menus, chefs & reservations" },
  { id: "hotel", label: "Hotel", icon: "BedDouble", template: "business", blurb: "Rooms, amenities & bookings" },
  { id: "bakery", label: "Bakery", icon: "Croissant", template: "cafe", blurb: "Fresh bakes & custom cakes" },
  { id: "coaching", label: "Coaching Institute", icon: "GraduationCap", template: "business", blurb: "Courses, faculty & results" },
  { id: "consultancy", label: "Consultancy", icon: "Briefcase", template: "business", blurb: "Services, cases & expertise" },
  { id: "real-estate", label: "Real Estate", icon: "Building2", template: "business", blurb: "Listings, agents & site visits" },
  { id: "photography", label: "Photography", icon: "Camera", template: "business", blurb: "Portfolios, shoots & packages" },
  { id: "travel", label: "Travel Agency", icon: "Plane", template: "business", blurb: "Packages, tours & itineraries" },
  { id: "automobile", label: "Automobile / Garage", icon: "Car", template: "business", blurb: "Repairs, services & estimates" },
  { id: "spa", label: "Spa", icon: "Flower2", template: "salon", blurb: "Therapies, rituals & calm" },
  { id: "yoga", label: "Yoga Studio", icon: "HeartPulse", template: "gym", blurb: "Classes, teachers & retreats" },
  { id: "beauty", label: "Beauty Parlour", icon: "Sparkles", template: "salon", blurb: "Makeovers, bridal & care" },
  { id: "freelancer", label: "Freelancer / Portfolio", icon: "Laptop", template: "business", blurb: "Work, skills & contact" },
  { id: "interior", label: "Interior Designer", icon: "Sofa", template: "business", blurb: "Projects, styles & consultations" },
  { id: "jewellery", label: "Jewellery Shop", icon: "Gem", template: "business", blurb: "Collections, craftsmanship & bespoke" },
  { id: "ca", label: "CA / Tax Consultant", icon: "Calculator", template: "business", blurb: "Tax, audit & compliance services" },
  { id: "architect", label: "Architect", icon: "PencilRuler", template: "business", blurb: "Projects, drawings & planning" },
  { id: "ac-repair", label: "AC Repair Service", icon: "Fan", template: "business", blurb: "Installs, repairs & AMC plans" },
  { id: "cleaning", label: "Cleaning Service", icon: "SprayCan", template: "business", blurb: "Deep cleaning, homes & offices" },
  { id: "laundry", label: "Laundry", icon: "WashingMachine", template: "business", blurb: "Wash, dry-clean & express service" },
  { id: "event", label: "Event Planner", icon: "PartyPopper", template: "business", blurb: "Weddings, corporate & decor" },
  { id: "caterer", label: "Caterer", icon: "ChefHat", template: "business", blurb: "Menus, live counters & packages" },
  { id: "nutritionist", label: "Nutritionist / Dietitian", icon: "Salad", template: "business", blurb: "Diet plans & wellness coaching" },
  { id: "makeup", label: "Makeup Artist", icon: "Paintbrush", template: "business", blurb: "Bridal, party & editorial looks" },

  /* ------------------------- automotive & transport ------------------------ */
  { id: "car-detailing", label: "Car Detailing & Car Wash", icon: "Car", template: "business", blurb: "Wash, polish & ceramic coating" },
  { id: "bike-service", label: "Bike Service & Repair", icon: "Bike", template: "business", blurb: "Servicing, repairs & spares" },
  { id: "car-rental", label: "Car Rental Service", icon: "KeyRound", template: "business", blurb: "Self-drive & chauffeur rentals" },
  { id: "bike-rental", label: "Bike Rental Service", icon: "Bike", template: "business", blurb: "Hourly, daily & monthly rentals" },

  /* ------------------------------ repairs -------------------------------- */
  { id: "mobile-repair", label: "Mobile Repair Shop", icon: "Smartphone", template: "business", blurb: "Screen, battery & board level" },
  { id: "laptop-repair", label: "Computer / Laptop Repair", icon: "Laptop", template: "business", blurb: "Hardware, software & upgrades" },
  { id: "appliance-repair", label: "Home Appliance Repair", icon: "Refrigerator", template: "business", blurb: "Fridge, AC, washing machine" },
  { id: "ro-service", label: "RO Water Purifier Service", icon: "Droplets", template: "business", blurb: "Filter changes & AMC plans" },

  /* -------------------------- home & property ---------------------------- */
  { id: "pest-control", label: "Pest Control Service", icon: "Bug", template: "business", blurb: "Termites, cockroaches & mosquitoes" },
  { id: "packers-movers", label: "Packers & Movers", icon: "Truck", template: "business", blurb: "Home & office shifting" },
  { id: "waterproofing", label: "Waterproofing Service", icon: "ShieldCheck", template: "business", blurb: "Terrace, bathroom & basement" },
  { id: "home-renovation", label: "Home Renovation Service", icon: "Hammer", template: "business", blurb: "Repairs, upgrades & makeovers" },
  { id: "modular-kitchen", label: "Modular Kitchen Studio", icon: "UtensilsCrossed", template: "business", blurb: "Design, build & installation" },
  { id: "furniture-shop", label: "Furniture Shop / Custom Furniture", icon: "Armchair", template: "business", blurb: "Sofas, beds & bespoke pieces" },
  { id: "tiles-sanitary", label: "Tiles & Sanitary Shop", icon: "Bath", template: "business", blurb: "Tiles, fittings & bathware" },
  { id: "hardware-shop", label: "Hardware Shop", icon: "Wrench", template: "business", blurb: "Tools, fittings & materials" },
  { id: "paint-dealer", label: "Paint Dealer / Painting Service", icon: "Paintbrush", template: "business", blurb: "Paints, textures & painting" },
  { id: "solar-installation", label: "Solar Installation Service", icon: "Sun", template: "business", blurb: "Rooftop panels & net metering" },
  { id: "gardening", label: "Gardening / Landscaping Service", icon: "Sprout", template: "business", blurb: "Design, lawns & maintenance" },
  { id: "water-supplier", label: "Packaged Drinking Water Supplier", icon: "GlassWater", template: "business", blurb: "Cans, jars & doorstep delivery" },

  /* ------------------------------ events --------------------------------- */
  { id: "wedding-decoration", label: "Wedding Decoration", icon: "Flower", template: "business", blurb: "Themes, florals & stage decor" },
  { id: "mandap-decoration", label: "Mandap / Event Decoration", icon: "Tent", template: "business", blurb: "Mandaps, haldi & sangeet setups" },
  { id: "dj-sound", label: "DJ & Sound System", icon: "Music", template: "business", blurb: "Weddings, events & concerts" },
  { id: "tent-house", label: "Tent House", icon: "Tent", template: "business", blurb: "Shamianas, tables & chairs" },

  /* ------------------------------- food ---------------------------------- */
  { id: "florist", label: "Florist", icon: "Flower", template: "business", blurb: "Bouquets, events & subscriptions" },
  { id: "sweet-shop", label: "Sweet Shop", icon: "Candy", template: "business", blurb: "Fresh mithai & festival boxes" },
  { id: "tiffin-service", label: "Tiffin Service", icon: "Sandwich", template: "business", blurb: "Home-cooked meals, delivered" },
  { id: "cloud-kitchen", label: "Cloud Kitchen", icon: "ChefHat", template: "business", blurb: "Delivery-only food business" },
  { id: "food-truck", label: "Food Truck", icon: "Truck", template: "business", blurb: "Street food & event catering" },

  /* ------------------------------- pets ---------------------------------- */
  { id: "pet-grooming", label: "Pet Grooming", icon: "Scissors", template: "business", blurb: "Bathing, trims & spa care" },
  { id: "pet-boarding", label: "Pet Boarding", icon: "Dog", template: "business", blurb: "Day care & overnight stays" },
  { id: "pet-training", label: "Pet Training", icon: "PawPrint", template: "business", blurb: "Obedience & behaviour training" },

  /* ------------------------------ health --------------------------------- */
  { id: "physiotherapy", label: "Physiotherapy Center", icon: "Activity", template: "business", blurb: "Pain relief & rehab programs" },
  { id: "eye-care", label: "Eye Care / Optical Shop", icon: "Eye", template: "business", blurb: "Eye tests, frames & lenses" },
  { id: "pharmacy", label: "Pharmacy / Medical Store", icon: "Pill", template: "business", blurb: "Medicines & home delivery" },

  /* ---------------------------- education -------------------------------- */
  { id: "home-tutor", label: "Home Tutor", icon: "BookOpen", template: "business", blurb: "One-on-one teaching at home" },
  { id: "music-dance", label: "Music / Dance Academy", icon: "Music", template: "business", blurb: "Classes, grades & performances" },
  { id: "driving-school", label: "Driving School", icon: "Car", template: "business", blurb: "Two & four wheeler training" },
  { id: "computer-training", label: "Computer Training Institute", icon: "Monitor", template: "business", blurb: "Basics, Tally & programming" },
  { id: "language-institute", label: "Language Institute", icon: "Languages", template: "business", blurb: "Spoken English & foreign languages" },
  { id: "study-abroad", label: "Study Abroad Consultant", icon: "Plane", template: "business", blurb: "Visas, universities & admissions" },
  { id: "education-consultant", label: "Education Consultant", icon: "GraduationCap", template: "business", blurb: "Admissions & career guidance" },

  /* ---------------------------- creative & media -------------------------- */
  { id: "digital-marketing", label: "Digital Marketing Agency", icon: "Megaphone", template: "business", blurb: "SEO, ads & social growth" },
  { id: "printing", label: "Printing & Xerox Shop", icon: "Printer", template: "business", blurb: "Printing, binding & stationery" },
  { id: "signboard", label: "Signboard / Flex Printing", icon: "PanelTop", template: "business", blurb: "Boards, flex & glow signs" },
  { id: "graphic-design", label: "Graphic Design Studio", icon: "PenTool", template: "business", blurb: "Logos, branding & collateral" },
  { id: "video-production", label: "Video Production Studio", icon: "Clapperboard", template: "business", blurb: "Films, ads & reels" },
  { id: "social-media", label: "Social Media Agency", icon: "AtSign", template: "business", blurb: "Content, reels & management" },

  /* --------------------------- industry & trades -------------------------- */
  { id: "security-service", label: "Security Service Agency", icon: "ShieldCheck", template: "business", blurb: "Guards, bouncers & events" },
  { id: "manpower-recruitment", label: "Manpower / Recruitment Agency", icon: "Users", template: "business", blurb: "Hiring, staffing & payroll" },
  { id: "construction-contractor", label: "Construction Contractor", icon: "HardHat", template: "business", blurb: "Turnkey builds & civil work" },
  { id: "civil-contractor", label: "Civil Contractor", icon: "Ruler", template: "business", blurb: "Slabs, plaster & finishing" },
  { id: "courier", label: "Courier & Delivery Service", icon: "Package", template: "business", blurb: "Local, national & express" },
  { id: "tour-operator", label: "Tour Operator", icon: "Map", template: "business", blurb: "Group tours & fixed departures" },

  { id: "other", label: "Other Business", icon: "Store", template: "business", blurb: "Any local business, beautifully online" },
];

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES.find((c) => c.id === "other");

export const categoryLabel = (id) => getCategory(id).label;
