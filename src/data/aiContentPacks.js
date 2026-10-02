/**
 * Predefined "AI" content packs — one per business category.
 *
 * These power the **Generate with AI** tab: the generator picks the pack for
 * the chosen category, personalises it with the business name / city / contact
 * details, and fills every section of the matching template.
 *
 * Tokens available inside any string:
 *   {name} → business name        {city} → city (falls back to "your area")
 *
 * Compact tuple format keeps the file readable:
 *   services      [icon, title, description, price]
 *   features      [icon, title, description]
 *   team          [name, role, bio]
 *   testimonials  [name, role, text]
 *   faqs          [question, answer]
 *   stats         [value, label]
 *   hours         [day, time]
 *   cta           [title, subtitle]
 *   menu          [groupName, [[item, description, price, tag], …]]
 *   plans         [name, price, period, [features…], highlighted, ctaLabel]
 */

/* ------------------------------ health family ----------------------------- */
const CLINIC = {
  tagline: "Compassionate Care, Every Visit",
  about:
    "{name} has been caring for families in {city} with honest advice, modern equipment and unhurried consultations. Our doctors explain every diagnosis in plain language, so you always leave knowing exactly what happens next.",
  services: [
    ["Stethoscope", "General Consultation", "Unhurried check-ups with a detailed diagnosis and a clear treatment plan.", "₹500"],
    ["Activity", "Health Check-up Packages", "Full-body screening with same-day reports and a doctor's walkthrough.", "₹1,999"],
    ["ScanLine", "Diagnostics & Lab Tests", "In-house sample collection with accredited laboratory reporting.", "₹300"],
    ["HeartPulse", "Chronic Care Management", "Ongoing support for diabetes, blood pressure and thyroid conditions.", "₹800"],
    ["Baby", "Child & Vaccination Care", "Growth monitoring and the complete immunisation schedule.", "₹600"],
    ["ShieldCheck", "Preventive Wellness", "Diet, lifestyle and follow-up plans that keep problems away.", "₹700"],
  ],
  features: [
    ["ShieldCheck", "Strict Hygiene", "Sterilised instruments and single-use disposables for every patient."],
    ["Clock", "On-time Appointments", "Slot-based booking so your waiting time stays under ten minutes."],
    ["Wallet", "Transparent Pricing", "Written estimates before treatment — no surprise additions."],
    ["Users", "Experienced Doctors", "A senior team with decades of combined clinical practice."],
  ],
  team: [
    ["Dr. Asha Verma", "Chief Consultant, MD", "18 years of clinical experience in family medicine."],
    ["Dr. Rohan Kulkarni", "Senior Physician, MBBS", "Specialises in preventive care and chronic conditions."],
    ["Dr. Sneha Patil", "Paediatrician, DCH", "Gentle, patient care for infants and children."],
  ],
  testimonials: [
    ["Priya Deshmukh", "Patient", "The doctor actually listened instead of rushing me out. I finally understood my reports."],
    ["Amit Jadhav", "Regular visitor", "Clean, calm and always on time. Booking a slot takes a minute on WhatsApp."],
    ["Sunita Kulkarni", "Parent", "My daughter is no longer scared of doctors — that says everything about this place."],
  ],
  faqs: [
    ["Do I need an appointment?", "Walk-ins are welcome, but booking a slot means you'll barely wait. Call or WhatsApp us to reserve a time."],
    ["Do you accept insurance?", "Yes, we work with all major insurers and can help you with the paperwork for cashless claims."],
    ["Are reports available the same day?", "Most routine lab reports are ready within a few hours and are sent directly to your WhatsApp."],
  ],
  stats: [["18+", "Years of care"], ["25k+", "Patients treated"], ["4.9", "Google rating"], ["6", "Specialists"]],
  hours: [["Monday – Saturday", "9:00 AM – 1:00 PM, 5:00 – 9:00 PM"], ["Sunday", "Emergencies only"]],
  cta: ["Book Your Appointment Today", "Same-day slots available. Call or WhatsApp us — we'll find a time that suits you."],
};

const HOSPITAL = {
  ...CLINIC,
  tagline: "Advanced Care, Around the Clock",
  about:
    "{name} is a multi-speciality hospital in {city} offering 24×7 emergency response, modern operation theatres and critical care. Our departments work together so every patient receives coordinated, unhurried attention.",
  services: [
    ["HeartPulse", "24×7 Emergency & Trauma", "A fully staffed emergency department with ambulance support.", ""],
    ["Stethoscope", "Multi-speciality OPD", "Consultations across medicine, surgery, ortho, ENT and paediatrics.", ""],
    ["ScanLine", "Imaging & Diagnostics", "Digital X-ray, ultrasound, ECG and a fully accredited pathology lab.", ""],
    ["Activity", "Intensive Care Unit", "Ventilator-equipped ICU beds with round-the-clock intensivists.", ""],
    ["ShieldCheck", "Surgery & Operation Theatres", "Modular theatres with laparoscopic and general surgical facilities.", ""],
    ["Baby", "Maternity & Newborn Care", "Labour rooms, NICU support and complete antenatal programmes.", ""],
  ],
  features: [
    ["Clock", "24×7 Emergency", "Doctors on duty every hour of every day, including holidays."],
    ["ShieldCheck", "Accredited Standards", "Strict infection-control protocols across every ward."],
    ["Users", "Specialist Departments", "Consultants across more than a dozen clinical specialities."],
    ["Wallet", "Insurance & Cashless", "Empanelled with major insurers and government health schemes."],
  ],
  stats: [["24×7", "Emergency care"], ["120", "Inpatient beds"], ["40+", "Specialists"], ["4.7", "Google rating"]],
  hours: [["Emergency", "Open 24 hours"], ["OPD · Monday – Saturday", "9:00 AM – 8:00 PM"]],
  cta: ["We're Open 24×7", "For emergencies call us immediately — our team is always ready."],
};

const DENTAL = {
  ...CLINIC,
  tagline: "Healthy Smile, Happy Life",
  about:
    "{name} combines gentle, honest dentistry with modern equipment in {city}. From routine cleanings to full smile makeovers, every treatment is explained clearly and priced transparently before we begin.",
  services: [
    ["Sparkles", "Dental Cleaning & Polishing", "Ultrasonic scaling and stain removal for a fresh, healthy mouth.", "₹999"],
    ["Activity", "Root Canal Treatment", "Single-visit, microscope-assisted root canals that save natural teeth.", "₹4,500"],
    ["ShieldCheck", "Dental Implants", "Permanent, natural-looking tooth replacement with trusted systems.", "₹25,000"],
    ["Sun", "Teeth Whitening", "In-office whitening that brightens your smile by several shades.", "₹6,999"],
    ["Smile", "Braces & Clear Aligners", "Metal, ceramic and invisible aligner options for all ages.", "₹35,000"],
    ["Baby", "Kids Dentistry", "Friendly first visits, fluoride application and cavity care.", "₹799"],
  ],
  features: [
    ["ShieldCheck", "4-Step Sterilisation", "Instruments sterilised in an autoclave before every single use."],
    ["ScanLine", "Digital Dentistry", "Low-radiation digital X-rays and intraoral scanning."],
    ["HeartPulse", "Painless Protocols", "Computer-assisted anaesthesia for genuinely comfortable visits."],
    ["Wallet", "Easy EMI Options", "Split larger treatments into interest-free monthly instalments."],
  ],
  faqs: [
    ["Is root canal treatment painful?", "With modern anaesthesia and rotary instruments most patients feel little discomfort and return to work the same day."],
    ["How often should I get a check-up?", "Every six months. Regular scaling prevents most major — and expensive — dental problems."],
    ["Do you offer EMI?", "Yes. Treatments above ₹10,000 can be split into easy monthly instalments at 0% interest."],
  ],
  stats: [["12+", "Years of care"], ["15k+", "Happy patients"], ["4.9", "Google rating"], ["6", "Specialists"]],
  cta: ["Book Your Dental Visit", "Same-day appointments available. Your smile can't wait."],
};

/* ------------------------------- gym family ------------------------------- */
const GYM = {
  tagline: "Train Hard. Stay Humble.",
  about:
    "{name} is where {city} comes to get stronger. Serious equipment, coach-led programming and a community that shows up at 5 AM — no mirrors-only posing, just honest work and real results.",
  services: [
    ["Dumbbell", "Strength Training", "Progressive overload programming with proper form coaching.", ""],
    ["Flame", "Functional & HIIT", "High-intensity circuits that burn fat and build real conditioning.", ""],
    ["Target", "Boxing & Combat Fitness", "Bag work, pads and conditioning with experienced coaches.", ""],
    ["HeartPulse", "Cardio Zone", "Treadmills, assault bikes, rowers and a dedicated spin studio.", ""],
    ["UserCheck", "Personal Training", "One-on-one coaching with monthly body-composition tracking.", ""],
    ["Salad", "Nutrition Coaching", "Practical meal plans built around food you already eat.", ""],
  ],
  features: [
    ["Dumbbell", "Serious Equipment", "Calibrated plates, proper bars and a dedicated lifting platform."],
    ["Users", "Coach-led Floor", "Every floor hour is supervised — form checks are always free."],
    ["ShowerHead", "Clean Amenities", "Spotless showers, lockers and filtered drinking water."],
    ["Clock", "Early & Late Hours", "Open from 5 AM so training fits around your job, not the reverse."],
  ],
  team: [
    ["Vikram Sawant", "Head Coach · Strength", "Certified trainer with 12 years of competitive lifting."],
    ["Rahul Mane", "Conditioning & Boxing", "State-level boxer and certified conditioning coach."],
    ["Anjali Rao", "Women's Fitness Coach", "Specialises in strength training for beginners."],
  ],
  testimonials: [
    ["Snehal Patil", "Lost 18 kg in 8 months", "Coaches actually watch your form every session. The diet plan was food I already cook."],
    ["Omkar Bhosale", "Member since 2019", "Best-equipped gym in the city. Zero ego on the floor, everyone helps everyone."],
    ["Rutuja Kadam", "Morning batch", "Joined for fitness, stayed for the community. The 6 AM crew is family now."],
  ],
  faqs: [
    ["Do you offer a trial?", "Yes — come in for a free trial session and a fitness assessment before you commit to anything."],
    ["I'm a complete beginner. Is that okay?", "Perfect. Most of our members started exactly there. A coach will walk you through every machine."],
    ["Are there separate timings for women?", "We have dedicated women's hours in the morning and a female coach on the floor all day."],
  ],
  stats: [["1200+", "Active members"], ["40+", "Machines & rigs"], ["10", "Certified coaches"], ["4.8", "Google rating"]],
  hours: [["Monday – Saturday", "5:00 AM – 10:00 PM"], ["Sunday", "7:00 AM – 12:00 PM"]],
  plans: [
    ["Monthly", "₹1,000", "/month", ["Full gym access", "1 group class per week", "Locker access", "Fitness assessment"], false, "Start Monthly"],
    ["Quarterly", "₹2,500", "/3 months", ["Everything in Monthly", "Unlimited group classes", "1 free PT session", "Diet starter plan"], true, "Most Popular"],
    ["Annual", "₹8,000", "/year", ["Everything in Quarterly", "4 free PT sessions", "Custom nutrition plan", "Freeze anytime"], false, "Best Value"],
  ],
  cta: ["Claim Your Free Trial", "Full access, all classes and a fitness assessment. No card required."],
};

const FITNESS = {
  ...GYM,
  tagline: "Stronger Every Single Day",
  about:
    "{name} is a modern fitness centre in {city} built around coaching, not crowds. Small batches, structured programmes and trainers who remember your name and your goals.",
  cta: ["Start With a Free Session", "Try a class on us and see how the coaching feels."],
};

const YOGA = {
  ...GYM,
  tagline: "Breathe. Move. Belong.",
  about:
    "{name} is a calm studio in {city} for every body and every level. Our teachers focus on alignment and breath, so you build strength and stillness at a pace that respects you.",
  services: [
    ["HeartPulse", "Hatha Yoga", "Classical postures held with focus on alignment and breath.", ""],
    ["Flame", "Vinyasa Flow", "Dynamic sequences that build heat, strength and mobility.", ""],
    ["Flower2", "Restorative & Yin", "Slow, supported poses that release deep tension.", ""],
    ["Sparkles", "Pranayama & Meditation", "Breathwork and guided meditation for a quieter mind.", ""],
    ["Baby", "Prenatal Yoga", "Safe, gentle practice designed for every trimester.", ""],
    ["UserCheck", "Private Sessions", "One-to-one classes tailored to injuries or specific goals.", ""],
  ],
  features: [
    ["Users", "Small Batches", "Never more than twelve mats, so you always get corrections."],
    ["Leaf", "Calm Studio", "A quiet, naturally lit space designed to slow you down."],
    ["HeartPulse", "All Levels Welcome", "Beginners get modifications; regulars get deeper variations."],
    ["Clock", "Flexible Timings", "Morning, afternoon and evening batches through the week."],
  ],
  team: [
    ["Meera Joshi", "Founder & Lead Teacher", "500-hour certified with 14 years of teaching practice."],
    ["Kabir Nair", "Vinyasa & Mobility", "Focuses on strength, alignment and injury prevention."],
    ["Aditi Sharma", "Prenatal & Restorative", "Certified prenatal teacher and breathwork guide."],
  ],
  plans: [
    ["Drop-in Class", "₹400", "/class", ["Any single class", "Mats provided", "No commitment"], false, "Try a Class"],
    ["Monthly Unlimited", "₹2,500", "/month", ["Unlimited classes", "All styles included", "Free mat storage", "Workshop discounts"], true, "Most Popular"],
    ["Quarterly", "₹6,500", "/3 months", ["Everything in Monthly", "2 private sessions", "Nutrition guidance", "Freeze for 2 weeks"], false, "Best Value"],
  ],
  stats: [["14+", "Years teaching"], ["12", "Mats per class"], ["4.9", "Google rating"]],
  hours: [["Monday – Friday", "6:00 – 10:00 AM, 5:00 – 8:00 PM"], ["Saturday – Sunday", "7:00 – 10:00 AM"]],
  cta: ["Roll Out Your First Mat", "Your first class is on us — just bring comfortable clothes."],
};

/* ------------------------------- cafe family ------------------------------ */
const CAFE = {
  tagline: "Slow Coffee, Fast Friends",
  about:
    "{name} is a corner cafe in {city} pouring single-origin beans roasted in small weekly batches. Come for the pour-overs, stay for the window seats, the playlist and the smell of fresh croissants.",
  services: [],
  features: [
    ["Coffee", "Single-origin Beans", "Estate coffee roasted in small batches every week."],
    ["Croissant", "Baked Fresh Daily", "Croissants, sourdough and cakes out of the oven by 8 AM."],
    ["Wifi", "Work-friendly", "Fast wifi, plug points at every table and a no-rush policy."],
    ["PawPrint", "Pet Friendly", "Water bowls and treats for our four-legged regulars."],
  ],
  team: [],
  menu: [
    ["Espresso Bar", [
      ["Espresso", "Double shot, single-origin", "₹90", ""],
      ["Cappuccino", "Classic dry foam, dusted cocoa", "₹150", "Bestseller"],
      ["Cortado", "Equal parts espresso and steamed milk", "₹140", ""],
      ["Café Mocha", "Espresso, dark chocolate, cream", "₹170", ""],
    ]],
    ["Signature Brews", [
      ["Cold Brew Tonic", "18-hour cold brew with citrus tonic", "₹180", "Bestseller"],
      ["Hazelnut Latte", "House hazelnut praline, oat option", "₹190", ""],
      ["Vietnamese Iced Coffee", "Condensed milk, dark roast", "₹175", ""],
      ["Affogato", "Vanilla gelato, hot espresso pour", "₹160", ""],
    ]],
    ["From the Kitchen", [
      ["Butter Croissant", "Laminated with cultured butter", "₹110", ""],
      ["Pesto Chicken Panini", "Sourdough, basil pesto, mozzarella", "₹210", "Bestseller"],
      ["Sourdough Toastie", "Three cheeses and tomato jam", "₹195", ""],
      ["Banoffee Pie", "Banana, dulce de leche, cream", "₹160", ""],
    ]],
  ],
  testimonials: [
    ["Anika Shah", "Regular", "The cortado here ruined every other cafe for me. Perfect every single time."],
    ["Rohan Mistry", "Remote worker", "My unofficial office. Great wifi, better coffee, and they remember my order."],
    ["Meera Kulkarni", "Weekend bruncher", "Banoffee pie on the window seat is my entire personality now."],
  ],
  faqs: [
    ["Do you take table bookings?", "Weekday tables are first-come, but we happily hold a window seat on weekends if you call ahead."],
    ["Do you have vegan options?", "Yes — oat and almond milk at no extra charge, plus a rotating vegan bake every day."],
  ],
  stats: [["12", "Signature brews"], ["40+", "Cozy seats"], ["4.7", "Google rating"]],
  hours: [["Monday – Friday", "8:00 AM – 11:00 PM"], ["Saturday – Sunday", "8:00 AM – 11:30 PM"]],
  cta: ["The Kettle's Already On", "Window seats fill fast on weekends — call ahead and we'll keep one warm."],
};

const BAKERY = {
  ...CAFE,
  tagline: "Baked Fresh Before Sunrise",
  about:
    "{name} has been baking for {city} since the first batch went in the oven. Real butter, slow fermentation and absolutely no shortcuts — which is why the shelves empty by evening.",
  features: [
    ["Croissant", "Baked Every Morning", "Everything on the shelf was made fresh a few hours ago."],
    ["Leaf", "Honest Ingredients", "Real butter, unbleached flour and no artificial preservatives."],
    ["Crown", "Custom Celebration Cakes", "Birthdays, weddings and anniversaries baked to your brief."],
    ["Clock", "Same-day Orders", "Call before noon and most orders are ready by evening."],
  ],
  menu: [
    ["Breads", [
      ["Sourdough Loaf", "36-hour fermentation, crackling crust", "₹220", "Bestseller"],
      ["Multigrain Loaf", "Five seeds, soft crumb", "₹180", ""],
      ["Garlic Focaccia", "Rosemary, olive oil, sea salt", "₹160", ""],
    ]],
    ["Pastries", [
      ["Butter Croissant", "Laminated with cultured butter", "₹110", "Bestseller"],
      ["Chocolate Danish", "Dark chocolate batons, flaky layers", "₹130", ""],
      ["Almond Croissant", "Frangipane filling, toasted flakes", "₹150", ""],
    ]],
    ["Cakes & Desserts", [
      ["Classic Chocolate Truffle", "Belgian chocolate ganache", "₹650 / ½ kg", "Bestseller"],
      ["Red Velvet Cheesecake", "Cream cheese frosting", "₹750 / ½ kg", ""],
      ["Fresh Fruit Gateau", "Seasonal fruit, light cream", "₹700 / ½ kg", ""],
    ]],
  ],
  stats: [["20+", "Daily bakes"], ["5 AM", "Oven starts"], ["4.8", "Google rating"]],
  hours: [["Monday – Saturday", "7:00 AM – 9:30 PM"], ["Sunday", "7:00 AM – 2:00 PM"]],
  cta: ["Order Your Celebration Cake", "Call or WhatsApp us with your date — custom orders welcome."],
};

/* ---------------------------- restaurant family --------------------------- */
const RESTAURANT = {
  tagline: "Made Fresh, Served Warm",
  about:
    "{name} brings {city} a dining room built around flavour and generosity. Regional recipes, produce from local markets and a kitchen that still tastes everything before it leaves the pass.",
  services: [],
  features: [
    ["Flame", "Live Kitchen", "Watch your food cooked to order over real flame."],
    ["Leaf", "Fresh Local Produce", "Vegetables and meat sourced from markets every morning."],
    ["Users", "Family & Group Dining", "Comfortable seating for celebrations of every size."],
    ["KeyRound", "Private Dining", "A separate room for parties, with a custom menu on request."],
  ],
  team: [
    ["Chef Omkar Narvekar", "Executive Chef", "Two decades across hotel kitchens and regional cuisine."],
    ["Chef Nikhil D'Souza", "Sous Chef", "Runs the grill line and the daily specials board."],
  ],
  menu: [
    ["Starters", [
      ["Paneer Tikka", "Char-grilled, mint chutney", "₹325", ""],
      ["Chicken 65", "Crisp, curry leaf tempering", "₹345", "Spicy"],
      ["Veg Manchurian", "Indo-Chinese classic, dry or gravy", "₹295", ""],
      ["Tandoori Platter", "Assorted grills for the table", "₹495", "Chef's Special"],
    ]],
    ["Main Course", [
      ["Butter Chicken", "Charcoal tikka in tomato-makhan gravy", "₹425", "Bestseller"],
      ["Dal Makhani", "Slow-cooked overnight, finished with butter", "₹295", ""],
      ["Veg Biryani", "Aged basmati, saffron, fried onion", "₹345", ""],
      ["Mutton Rogan Josh", "Slow-braised in Kashmiri spices", "₹475", "Chef's Special"],
    ]],
    ["Breads & Desserts", [
      ["Butter Naan", "Tandoor-baked, brushed with butter", "₹60", ""],
      ["Gulab Jamun", "Warm, cardamom syrup", "₹145", "Bestseller"],
      ["Gajar Halwa", "Slow-cooked carrot, ghee, nuts", "₹165", ""],
    ]],
  ],
  testimonials: [
    ["Karishma Jain", "Anniversary dinner", "The food arrived hot, the staff anticipated everything, and the bill was fair."],
    ["Farhan Akhtar", "Weekend regular", "Consistently good. The butter chicken is the benchmark in this city."],
    ["Vishal Rane", "Family celebration", "Booked the private room for twenty people — zero stress, great food."],
  ],
  faqs: [
    ["Do you take reservations?", "Yes, and we recommend them on weekends. Call or WhatsApp us and we'll hold your table."],
    ["Do you have Jain and vegan options?", "We do — tell us when ordering and the kitchen will adjust the preparation."],
    ["Is there parking?", "Yes, valet parking is available during dinner service."],
  ],
  stats: [["120", "Covers"], ["45+", "Dishes"], ["4.8", "Google rating"]],
  hours: [["Lunch · All days", "12:00 PM – 3:30 PM"], ["Dinner · All days", "7:00 PM – 11:30 PM"]],
  cta: ["Reserve Your Table", "Weekends book out fast — a quick call secures your spot."],
};

const HOTEL = {
  tagline: "Rest Well, Wake Happy",
  about:
    "{name} offers calm, comfortable stays in {city} — spotless rooms, warm hospitality and a breakfast worth waking up for. Whether you're here for work or a weekend, you'll be looked after.",
  services: [
    ["BedDouble", "Deluxe Rooms", "Air-conditioned rooms with premium linen and fast wifi.", "₹2,400 / night"],
    ["Crown", "Executive Suites", "Separate living area, work desk and complimentary breakfast.", "₹4,200 / night"],
    ["UtensilsCrossed", "In-house Restaurant", "Multi-cuisine dining with all-day room service.", ""],
    ["Users", "Banquet & Events", "Halls for weddings, conferences and family functions.", ""],
    ["Car", "Airport Transfers", "Pick-up and drop arranged on request.", ""],
    ["ShieldCheck", "24×7 Front Desk", "Someone is always available, whatever time you arrive.", ""],
  ],
  features: [
    ["Sparkles", "Spotless Rooms", "Deep-cleaned and inspected before every single check-in."],
    ["Wifi", "Fast Free Wifi", "Reliable high-speed internet throughout the property."],
    ["Clock", "Flexible Check-in", "Early check-in and late check-out subject to availability."],
    ["Headset", "Warm Service", "A team that remembers your name and your coffee order."],
  ],
  team: [],
  testimonials: [
    ["Rahul Mehta", "Business traveller", "Quiet, clean and genuinely comfortable. The wifi actually works."],
    ["Deepa Krishnan", "Family stay", "Staff went out of their way for our kids. Breakfast was excellent."],
    ["Sameer Shaikh", "Weekend guest", "Great location, fair price and a spotless room. Will return."],
  ],
  faqs: [
    ["What are check-in and check-out times?", "Check-in is from 12 PM and check-out is 11 AM. Early or late requests are usually accommodated."],
    ["Is breakfast included?", "Breakfast is complimentary with suites and available as an add-on with all other rooms."],
    ["Do you allow pets?", "Small pets are welcome in selected rooms — please tell us when booking."],
  ],
  stats: [["45", "Rooms & suites"], ["24×7", "Front desk"], ["4.6", "Google rating"]],
  hours: [["Front desk", "Open 24 hours"], ["Restaurant", "7:00 AM – 11:00 PM"]],
  cta: ["Book Your Stay", "Call or WhatsApp us directly for the best available rate."],
};

/* ------------------------------ salon family ------------------------------ */
const SALON = {
  tagline: "Where Elegance Meets Artistry",
  about:
    "{name} is a studio in {city} built on consultation-first service. Precision cuts, dimensional colour and bridal artistry — we'll tell you honestly what will suit you before anyone picks up the scissors.",
  services: [
    ["Scissors", "Signature Haircut", "Consultation, precision cut, wash and blow-dry finish.", "₹699"],
    ["Palette", "Global Colour", "Full-head colour with bond-protecting treatment.", "₹2,999"],
    ["Wand2", "Balayage & Highlights", "Hand-painted dimension with toner and gloss.", "₹4,499"],
    ["Sparkles", "Keratin Hair Spa", "Deep-repair ritual for frizz control and shine.", "₹1,899"],
    ["Flower2", "Classic Facial", "Cleanse, exfoliate, massage and mask for instant glow.", "₹1,299"],
    ["Crown", "Bridal Makeup", "HD or airbrush artistry with a trial session included.", "₹9,999"],
  ],
  features: [
    ["Wand2", "Consultation First", "Face-shape analysis and honest advice before a single snip."],
    ["Leaf", "Gentle Products", "Ammonia-free colour and cruelty-free product lines."],
    ["Sparkles", "Hygiene Obsessed", "Fresh towels and sterilised tools for every client."],
    ["Crown", "Bridal Specialists", "A dedicated bridal suite and on-location teams."],
  ],
  team: [
    ["Riya Kapoor", "Creative Director", "Eleven years of editorial and bridal work."],
    ["Ananya Joshi", "Senior Stylist", "Precision cutting specialist trained in advanced technique."],
    ["Kabir Sheikh", "Colour Specialist", "Balayage and colour-correction artist."],
  ],
  testimonials: [
    ["Shruti Menon", "Bridal client", "My trial was so good I cried. On the day the makeup lasted fourteen hours."],
    ["Neha Bhandari", "Colour client", "They fixed a box-dye disaster and turned it into a beautiful caramel balayage."],
    ["Aditi Rao", "Monthly regular", "They once talked me out of a cut that wouldn't suit me. Honest artists."],
  ],
  faqs: [
    ["Do I need an appointment?", "Walk-ins are welcome on weekdays, but weekends book out — reserve your chair by call or WhatsApp."],
    ["How long does bridal makeup take?", "Plan for two to three hours on the day, plus a separate trial session booked in advance."],
    ["Which products do you use?", "Only professional, cruelty-free brands. We'll happily show you everything before we start."],
  ],
  stats: [["20k+", "Makeovers"], ["9", "Years of craft"], ["4.9", "Google rating"]],
  hours: [["Tuesday – Sunday", "10:00 AM – 8:30 PM"], ["Monday", "Closed"]],
  cta: ["Book Your Glow Up", "Weekend chairs go fast — reserve yours and skip the wait."],
};

const BEAUTY = {
  ...SALON,
  tagline: "Look Lovely, Feel Lovelier",
  about:
    "{name} is a neighbourhood beauty parlour in {city} offering honest advice and careful, unhurried service — from everyday threading to complete bridal packages.",
  services: [
    ["Sparkles", "Facial & Clean-up", "Deep cleansing and brightening for fresh, glowing skin.", "₹899"],
    ["Scissors", "Threading & Waxing", "Precise shaping with gentle, skin-friendly products.", "₹149"],
    ["Palette", "Hair Colour", "Root touch-ups and full colour with ammonia-free options.", "₹1,499"],
    ["Flower2", "Manicure & Pedicure", "Relaxing hand and foot care with polish finish.", "₹799"],
    ["Crown", "Bridal Package", "Complete pre-bridal programme with makeup on the day.", "₹14,999"],
    ["Wand2", "Party Makeup", "Occasion-ready looks that last all evening.", "₹2,499"],
  ],
  stats: [["10k+", "Happy clients"], ["12", "Years of service"], ["4.8", "Google rating"]],
  cta: ["Book Your Appointment", "Tell us the occasion and we'll plan the perfect look."],
};

const SPA = {
  ...SALON,
  tagline: "Unwind. Restore. Glow.",
  about:
    "{name} is a quiet retreat in {city} — warm towels, skilled hands and treatments that genuinely release tension. Step in stressed, step out lighter.",
  services: [
    ["Flower2", "Aromatherapy Massage", "Full-body massage with essential oils chosen for you.", "₹2,200"],
    ["Flame", "Deep Tissue Therapy", "Firm pressure work that releases stubborn knots.", "₹2,600"],
    ["Leaf", "Ayurvedic Abhyanga", "Traditional warm-oil therapy for deep relaxation.", "₹2,800"],
    ["Sparkles", "Facial Rituals", "Hydrating and brightening facials for every skin type.", "₹1,800"],
    ["ShowerHead", "Steam & Sauna", "Detoxifying heat therapy before or after your treatment.", "₹600"],
    ["Crown", "Couples Package", "Side-by-side treatments in a private suite.", "₹5,500"],
  ],
  features: [
    ["Leaf", "Trained Therapists", "Certified practitioners with years of hands-on experience."],
    ["Sparkles", "Fresh Linen Always", "Clean towels, robes and sheets for every single guest."],
    ["Flower2", "Calm Private Rooms", "Soundproofed suites with dimmed lighting."],
    ["HeartPulse", "Personalised Pressure", "Tell us what hurts — the therapist adjusts throughout."],
  ],
  stats: [["8", "Treatment rooms"], ["15+", "Therapies"], ["4.9", "Google rating"]],
  hours: [["All days", "10:00 AM – 9:00 PM"]],
  cta: ["Book Your Escape", "Reserve a slot and arrive ten minutes early to settle in."],
};

/* --------------------------- professional family -------------------------- */
const COACHING = {
  tagline: "Learn Better. Score Higher.",
  about:
    "{name} has been guiding students in {city} with small batches, patient teachers and relentless doubt-clearing. We track every student individually, so nobody quietly falls behind.",
  services: [
    ["GraduationCap", "Foundation Batch (VIII–X)", "Concept-first teaching aligned to the school syllabus.", "₹1,500/mo"],
    ["BookOpen", "Science & Maths (XI–XII)", "Board plus competitive preparation in one structured course.", "₹2,500/mo"],
    ["Target", "JEE / NEET Preparation", "Two-year programme with weekly mock tests and analysis.", "₹4,500/mo"],
    ["UserCheck", "Doubt-clearing Sessions", "Dedicated daily slots where no question is too small.", ""],
    ["Award", "Test Series", "Exam-pattern papers with detailed performance reports.", "₹2,000"],
    ["Users", "Parent Counselling", "Regular updates so families stay part of the progress.", ""],
  ],
  features: [
    ["Users", "Small Batches", "Capped at twenty students so everyone gets attention."],
    ["Award", "Proven Results", "Consistent board toppers and competitive-exam selections."],
    ["Clock", "Flexible Timings", "Morning and evening batches that fit around school."],
    ["BookOpen", "Complete Study Material", "Printed notes, worksheets and past papers included."],
  ],
  team: [
    ["Prof. Sanjay Kulkarni", "Physics", "22 years of teaching and a JEE mentor since 2010."],
    ["Dr. Nandini Rao", "Chemistry", "PhD in organic chemistry with a gift for simplifying concepts."],
    ["Prof. Amit Sharma", "Mathematics", "Known for making calculus genuinely enjoyable."],
  ],
  testimonials: [
    ["Rohit Pawar", "NEET 2024 qualifier", "The doubt sessions made the difference. Teachers never made me feel slow."],
    ["Sneha Kulkarni", "Class XII student", "Small batches mean you actually get to ask questions. My marks jumped 20%."],
    ["Mrs. Deshpande", "Parent", "Regular updates and honest feedback. They tell you what needs work."],
  ],
  faqs: [
    ["Is there a demo class?", "Yes — attend a free demo lecture before enrolling so your child can see if the teaching style fits."],
    ["What is the batch size?", "We cap batches at twenty students to keep individual attention possible."],
    ["Do you provide study material?", "Yes, printed notes, worksheets and a full test series are included in the fee."],
  ],
  stats: [["95%", "Pass rate"], ["20", "Max batch size"], ["15+", "Years teaching"], ["4.9", "Parent rating"]],
  hours: [["Monday – Saturday", "7:00 AM – 12:00 PM, 4:00 – 9:00 PM"], ["Sunday", "Test series only"]],
  cta: ["Book a Free Demo Class", "See the teaching before you decide. Call us to reserve a seat."],
};

const CONSULTANCY = {
  tagline: "Clear Advice, Real Outcomes",
  about:
    "{name} helps businesses in {city} make confident decisions. We work in plain language, share honest assessments and stay accountable for the results we recommend.",
  services: [
    ["Briefcase", "Business Strategy", "Market positioning and growth planning grounded in your numbers.", ""],
    ["TrendingUp", "Financial Advisory", "Cash-flow planning, budgeting and investment structuring.", ""],
    ["BadgeCheck", "Compliance & Registration", "GST, company incorporation and statutory filings handled end to end.", ""],
    ["Users", "HR & Recruitment", "Hiring processes, policies and organisational structure.", ""],
    ["Settings", "Process Improvement", "Finding and removing the bottlenecks costing you money.", ""],
    ["Headset", "Ongoing Retainer", "A trusted advisor on call whenever decisions get difficult.", ""],
  ],
  features: [
    ["BadgeCheck", "Qualified Team", "Chartered accountants and MBAs with sector experience."],
    ["Wallet", "Transparent Fees", "Fixed quotes agreed upfront — no open-ended billing."],
    ["Clock", "Responsive Support", "Queries answered within one working day, always."],
    ["ShieldCheck", "Complete Confidentiality", "Your data and strategy never leave our office."],
  ],
  team: [
    ["Anil Deshmukh", "Founder & Principal Consultant", "CA with 20 years advising SMEs and family businesses."],
    ["Priya Nair", "Finance Lead", "Specialises in cash-flow turnaround and fundraising."],
    ["Rahul Verma", "Compliance Head", "Handles registrations, audits and statutory filings."],
  ],
  testimonials: [
    ["Manish Gupta", "Manufacturing client", "They found leakages in our process that paid their fee ten times over."],
    ["Kavita Rane", "Startup founder", "Explained our finances in language I could actually act on."],
    ["Suresh Iyer", "Retail chain owner", "Reliable, responsive and honest even when the news isn't good."],
  ],
  faqs: [
    ["How does the first meeting work?", "The first consultation is free. We understand your situation, then send a written scope and fixed quote."],
    ["Do you work with small businesses?", "Most of our clients are small and family-run. We scale the engagement to your size and budget."],
    ["How are fees structured?", "Either a fixed project fee or a monthly retainer — agreed in writing before any work starts."],
  ],
  stats: [["200+", "Clients advised"], ["20", "Years experience"], ["4.8", "Client rating"]],
  hours: [["Monday – Friday", "10:00 AM – 7:00 PM"], ["Saturday", "10:00 AM – 2:00 PM"]],
  cta: ["Book a Free Consultation", "Tell us the challenge — we'll tell you honestly if we can help."],
};

const REAL_ESTATE = {
  tagline: "Finding You the Right Address",
  about:
    "{name} helps families and investors in {city} buy, sell and rent with confidence. Verified listings, honest pricing guidance and paperwork handled properly from start to registration.",
  services: [
    ["Building2", "Residential Sales", "Apartments, villas and plots matched to your budget and needs.", ""],
    ["KeyRound", "Rentals & Leasing", "Verified tenants and landlords with agreements drafted properly.", ""],
    ["Briefcase", "Commercial Property", "Offices, shops and warehouses in established locations.", ""],
    ["BadgeCheck", "Legal & Documentation", "Title verification, registration and loan coordination.", ""],
    ["TrendingUp", "Investment Advisory", "Locality analysis and realistic return expectations.", ""],
    ["Camera", "Property Site Visits", "Guided visits scheduled around your availability.", ""],
  ],
  features: [
    ["ShieldCheck", "Verified Listings", "Every property physically visited and documents checked."],
    ["Wallet", "Honest Pricing", "Real market rates, not inflated numbers to win your listing."],
    ["BadgeCheck", "RERA Compliant", "Registered and fully compliant with regulatory requirements."],
    ["Headset", "End-to-end Support", "From first visit to registration, one person stays with you."],
  ],
  team: [
    ["Sandeep Joshi", "Founder & Principal Broker", "18 years and 900+ closed transactions in the city."],
    ["Pooja Shetty", "Residential Sales Head", "Specialises in family homes and first-time buyers."],
    ["Imran Khan", "Commercial Lead", "Office and retail leasing across prime corridors."],
  ],
  testimonials: [
    ["Vikas Agarwal", "Home buyer", "They showed me fewer properties but the right ones. Saved weeks of wasted visits."],
    ["Lata Menon", "Seller", "Priced it realistically and sold in five weeks. No games, no pressure."],
    ["Arjun Nair", "Investor", "Their locality advice was genuinely useful and turned out accurate."],
  ],
  faqs: [
    ["Do you charge buyers a fee?", "Our brokerage is standard and disclosed upfront before any site visit — no hidden charges."],
    ["Can you help with home loans?", "Yes, we coordinate with multiple banks and help assemble the documentation."],
    ["Are listings verified?", "Every property is physically inspected and title documents checked before we list it."],
  ],
  stats: [["900+", "Deals closed"], ["18", "Years in market"], ["4.7", "Client rating"]],
  hours: [["Monday – Saturday", "10:00 AM – 7:30 PM"], ["Sunday", "Site visits by appointment"]],
  cta: ["Tell Us What You're Looking For", "Share your budget and area — we'll shortlist properties worth your time."],
};

const PHOTOGRAPHY = {
  tagline: "Moments, Kept Forever",
  about:
    "{name} photographs weddings, families and brands across {city}. Unposed, warm and honest images — the kind you actually print and hang, not just scroll past.",
  services: [
    ["Crown", "Wedding Photography", "Full-day coverage with candid and traditional styles.", "₹65,000"],
    ["Camera", "Pre-Wedding Shoots", "Relaxed outdoor sessions at locations you love.", "₹25,000"],
    ["Users", "Family Portraits", "Natural sessions at home or on location.", "₹12,000"],
    ["Baby", "Newborn & Maternity", "Gentle, patient shoots on your baby's schedule.", "₹15,000"],
    ["Briefcase", "Product & Brand", "Clean commercial imagery for catalogues and online stores.", "₹8,000"],
    ["Award", "Event Coverage", "Birthdays, corporate events and celebrations of every size.", "₹20,000"],
  ],
  features: [
    ["Camera", "Professional Equipment", "Full-frame cameras, prime lenses and backup gear on every shoot."],
    ["Clock", "Fast Delivery", "Edited previews within a week, full gallery within a month."],
    ["Sparkles", "Careful Retouching", "Colour-graded by hand — never batch-processed presets."],
    ["ShieldCheck", "Backed Up Twice", "Your files stored on redundant drives and cloud backup."],
  ],
  team: [
    ["Aditya Rane", "Lead Photographer", "Twelve years and over 300 weddings documented."],
    ["Sara Fernandes", "Portrait Specialist", "Known for putting nervous subjects instantly at ease."],
  ],
  testimonials: [
    ["Ritu & Karan", "Wedding clients", "They caught moments we didn't even know happened. We cried at the gallery."],
    ["Anjali Bose", "Family session", "Wonderful with our toddler. Endless patience and gorgeous photos."],
    ["Nikhil Traders", "Product client", "Our catalogue looks professional for the first time. Sales went up."],
  ],
  faqs: [
    ["How far in advance should we book?", "Wedding dates book six to twelve months ahead, especially in season. Other shoots need two weeks."],
    ["When do we get our photos?", "A preview set within a week and the complete edited gallery within four weeks."],
    ["Do you travel for shoots?", "Yes, across the state and beyond. Travel and stay are added at actuals."],
  ],
  stats: [["300+", "Weddings shot"], ["12", "Years behind the lens"], ["4.9", "Client rating"]],
  hours: [["Monday – Saturday", "10:00 AM – 7:00 PM"], ["Sunday", "Shoots only"]],
  cta: ["Check Your Date", "Tell us when and where — we'll send packages and availability."],
};

const TRAVEL = {
  tagline: "Journeys Planned, Worries Packed Away",
  about:
    "{name} plans trips for travellers from {city} — honest itineraries, verified hotels and real support while you're away. No hidden costs and no rushing you through a checklist of sights.",
  services: [
    ["Plane", "International Packages", "Curated itineraries with visas, flights and stays handled.", ""],
    ["Car", "Domestic Holidays", "Hill stations, beaches and heritage circuits across India.", ""],
    ["Crown", "Honeymoon Specials", "Romantic escapes with thoughtful upgrades arranged.", ""],
    ["Users", "Group & Family Tours", "Departures designed for larger groups and elders.", ""],
    ["BadgeCheck", "Visa Assistance", "Documentation, appointments and application guidance.", ""],
    ["ShieldCheck", "Travel Insurance", "Coverage options explained in plain language.", ""],
  ],
  features: [
    ["ShieldCheck", "Verified Hotels", "We've stayed in or inspected the properties we book."],
    ["Wallet", "No Hidden Costs", "Final quotes include taxes, transfers and entry fees."],
    ["Headset", "Support While Travelling", "A real person on WhatsApp for the whole trip."],
    ["Clock", "Flexible Itineraries", "Plans adjusted to your pace, not a fixed template."],
  ],
  team: [
    ["Nisha Kapoor", "Founder & Trip Designer", "Fifteen years planning journeys across 40 countries."],
    ["Ravi Menon", "Operations Manager", "Handles bookings, transfers and on-trip support."],
  ],
  testimonials: [
    ["The Shahs", "Family trip", "Every transfer was waiting, every hotel was as promised. Completely stress-free."],
    ["Priyanka & Dev", "Honeymoon", "They arranged a surprise room upgrade. Small touches made the trip."],
    ["Mohan Rao", "Senior traveller", "Paced the itinerary for our age without us even asking. Very thoughtful."],
  ],
  faqs: [
    ["How do payments work?", "A booking advance confirms your trip, with the balance due before departure. Everything is receipted."],
    ["What if I need to cancel?", "Cancellation terms are shared in writing with your quote, before you pay anything."],
    ["Do you customise itineraries?", "Always. Packages are starting points — we build the trip around your interests and budget."],
  ],
  stats: [["5000+", "Happy travellers"], ["40+", "Destinations"], ["4.8", "Google rating"]],
  hours: [["Monday – Saturday", "10:00 AM – 7:00 PM"], ["Sunday", "On call for travellers"]],
  cta: ["Plan Your Next Trip", "Tell us where and when — we'll send an itinerary and honest pricing."],
};

const AUTOMOBILE = {
  tagline: "Honest Repairs, Done Right",
  about:
    "{name} keeps vehicles in {city} running safely. We show you the worn part before replacing it, quote before we start and never recommend work your vehicle doesn't need.",
  services: [
    ["Car", "General Service", "Oil, filters, fluids and a complete multi-point inspection.", "₹2,500"],
    ["Settings", "Engine Diagnostics", "Computerised scanning to find the actual fault, fast.", "₹800"],
    ["ShieldCheck", "Brake & Suspension", "Pads, discs, shockers and full safety checks.", "₹3,500"],
    ["Zap", "Battery & Electricals", "Testing, replacement and wiring fault repair.", "₹1,200"],
    ["Sparkles", "Denting & Painting", "Panel repair with colour-matched finishing.", "₹4,000"],
    ["Clock", "Pick-up & Drop", "We collect your vehicle and return it serviced.", "Free"],
  ],
  features: [
    ["BadgeCheck", "Genuine Parts Only", "OEM and reputed brands with warranty on every part."],
    ["Wallet", "Quote Before Work", "You approve the estimate before a single spanner turns."],
    ["Users", "Trained Mechanics", "Factory-trained technicians across major vehicle brands."],
    ["Clock", "Same-day Service", "Most routine servicing returned the very same day."],
  ],
  team: [
    ["Prakash Jadhav", "Workshop Owner", "25 years under the bonnet, still does the final check himself."],
    ["Firoz Shaikh", "Senior Technician", "Diagnostics specialist across petrol and diesel engines."],
  ],
  testimonials: [
    ["Santosh Patil", "Regular customer", "They showed me the worn part instead of just charging me. Rare honesty."],
    ["Neha Wagh", "Car owner", "Picked up my car, serviced it and dropped it back the same evening."],
    ["Ganesh More", "Fleet owner", "I send all six of my vehicles here. Fair rates and work that lasts."],
  ],
  faqs: [
    ["How long does a service take?", "Routine servicing is usually done the same day. Larger repairs we'll estimate upfront."],
    ["Do you use genuine parts?", "Yes, OEM or reputed equivalents — and we show you the old part we removed."],
    ["Is there a warranty?", "All parts carry manufacturer warranty and our labour is guaranteed for three months."],
  ],
  stats: [["25", "Years in service"], ["10k+", "Vehicles serviced"], ["4.7", "Google rating"]],
  hours: [["Monday – Saturday", "9:00 AM – 8:00 PM"], ["Sunday", "10:00 AM – 2:00 PM"]],
  cta: ["Book a Service Slot", "Call or WhatsApp us — we'll arrange free pick-up from your doorstep."],
};

const FREELANCER = {
  tagline: "Thoughtful Work, Delivered on Time",
  about:
    "I'm {name}, working with clients in {city} and beyond. I care about clear communication, realistic timelines and work that actually solves the problem you hired me for.",
  services: [
    ["Laptop", "Web Design & Development", "Fast, responsive websites built to convert visitors.", "From ₹25,000"],
    ["Palette", "Brand & Identity", "Logos, colour systems and guidelines that stay consistent.", "From ₹15,000"],
    ["Camera", "Content & Photography", "Images and copy that make your brand look credible.", "From ₹10,000"],
    ["TrendingUp", "Digital Marketing", "Campaigns measured on leads, not vanity metrics.", "From ₹12,000/mo"],
    ["Settings", "Maintenance & Support", "Ongoing updates so things keep running smoothly.", "From ₹3,000/mo"],
    ["BadgeCheck", "Consultation", "A focused session to unblock a specific problem.", "₹2,000/hr"],
  ],
  features: [
    ["Clock", "On-time Delivery", "Realistic deadlines agreed upfront, and then respected."],
    ["Headset", "Direct Communication", "You talk to me, not an account manager or a queue."],
    ["Wallet", "Clear Pricing", "Fixed project quotes so the bill never surprises you."],
    ["BadgeCheck", "Revisions Included", "Two rounds of changes built into every project."],
  ],
  team: [],
  testimonials: [
    ["Rakesh Sharma", "Startup founder", "Delivered ahead of schedule and explained every decision clearly."],
    ["Divya Nair", "Boutique owner", "My bookings doubled after the new site. Worth every rupee."],
    ["Tanmay Kulkarni", "Agency partner", "Reliable, communicative and genuinely good at the craft."],
  ],
  faqs: [
    ["How do projects start?", "A short call to understand the brief, then a written proposal with scope, timeline and fixed cost."],
    ["What are your payment terms?", "Typically 50% to start and 50% on delivery, invoiced properly."],
    ["Do you offer ongoing support?", "Yes — monthly maintenance plans are available after handover."],
  ],
  stats: [["80+", "Projects delivered"], ["7", "Years freelancing"], ["100%", "On-time record"]],
  hours: [["Monday – Friday", "10:00 AM – 7:00 PM"], ["Saturday", "By appointment"]],
  cta: ["Let's Talk About Your Project", "Send me a note about what you need and I'll reply within a day."],
};

const OTHER = {
  tagline: "Quality You Can See, Service You Can Trust",
  about:
    "{name} has built its name in {city} one happy customer at a time. Expect clear communication, honest pricing and work we're proud to put our name on.",
  services: [
    ["BadgeCheck", "Free Consultation", "A no-obligation conversation to understand exactly what you need.", ""],
    ["Settings", "Core Service", "Our flagship offering, delivered end to end by our own team.", ""],
    ["TrendingUp", "Premium Package", "For regular customers — priority service and bundled savings.", ""],
    ["ShieldCheck", "Support & Maintenance", "Ongoing care so everything keeps running smoothly.", ""],
  ],
  features: [
    ["BadgeCheck", "Trusted Experts", "Experienced professionals who care about the details."],
    ["Wallet", "Honest Pricing", "Clear quotes upfront. No surprises, ever."],
    ["Clock", "On-time Delivery", "We respect your time and stick to our commitments."],
    ["Headset", "Always Reachable", "Quick responses on call and WhatsApp, six days a week."],
  ],
  team: [
    ["Founder", "Founder & Lead", "The person who started it all — and still checks every job."],
    ["Operations Lead", "Operations", "Keeps every project on schedule and every customer updated."],
  ],
  testimonials: [
    ["Happy Customer", "Repeat client", "Professional from the first call to the final delivery. Already recommended them."],
    ["Local Business Owner", "Client", "On time, on budget, and genuinely nice people to work with."],
    ["First-time Customer", "Client", "Clear communication throughout. I'll definitely return."],
  ],
  faqs: [
    ["How do I get started?", "Call or WhatsApp us with your requirement. We'll arrange a free consultation and share a clear quote."],
    ["What areas do you serve?", "We're based locally and cover all nearby areas. For larger jobs we're happy to travel."],
    ["Do you offer support afterwards?", "Yes — every job includes a free support window, with affordable plans after that."],
  ],
  stats: [["500+", "Jobs completed"], ["8+", "Years running"], ["4.8", "Google rating"]],
  hours: [["Monday – Saturday", "10:00 AM – 7:00 PM"]],
  cta: ["Get in Touch Today", "Tell us what you need — we'll get back to you the same day."],
};

/* ------------------------- newly added categories ------------------------ */
const INTERIOR = {
  tagline: "Spaces That Feel Like You",
  about:
    "{name} designs homes and workplaces in {city} that look beautiful and live beautifully. We listen first, plan on paper, then build — so what you move into is exactly what you imagined.",
  services: [
    ["Sofa", "Residential Interiors", "Complete design and turnkey execution for apartments and villas.", "₹1,800 / sq.ft"],
    ["Briefcase", "Commercial Spaces", "Offices, clinics and retail designed around how your team works.", "₹1,400 / sq.ft"],
    ["PencilRuler", "Design Consultation", "A detailed session with layout ideas, palette and budget guidance.", "₹5,000"],
    ["Palette", "3D Design & Walkthrough", "Photo-realistic views of your space before a single wall moves.", "₹25,000"],
    ["Hammer", "Turnkey Execution", "Civil work, carpentry, electrical and finishes under one contract.", ""],
    ["Lamp", "Furniture & Styling", "Curated furniture, lighting and decor sized to your rooms.", ""],
  ],
  features: [
    ["PencilRuler", "Design-first Process", "Nothing is built before you've seen and approved the 3D design."],
    ["Wallet", "Transparent Budget", "A line-by-line estimate before work starts, with no hidden additions."],
    ["Clock", "Committed Timelines", "A written completion date, with weekly progress photos."],
    ["Users", "One Point of Contact", "One project manager owns your site from demo to handover."],
  ],
  team: [
    ["Ananya Deshpande", "Principal Designer", "Eleven years designing homes across the city."],
    ["Rohit Bhatia", "Design Lead", "Specialises in compact apartments and smart storage."],
    ["Sneha Rao", "Project Manager", "Runs site execution and vendor coordination."],
  ],
  testimonials: [
    ["Mr. & Mrs. Kulkarni", "3BHK apartment", "The 3D views matched the finished home almost exactly. Zero surprises."],
    ["Dr. Amol Jagtap", "Clinic project", "They designed around patient flow, not just looks. Patients notice the difference."],
    ["Sneha & Vikram", "Villa interiors", "Finished two weeks early and on budget. That never happens."],
  ],
  faqs: [
    ["How long does a full home take?", "A 2–3 BHK typically takes three to five months from design sign-off to handover."],
    ["Do you work with an existing flat?", "Yes. We handle renovations and partial upgrades as well as complete fit-outs."],
    ["What does the consultation include?", "A walk-through of your space, layout suggestions, material palette and a realistic budget range."],
  ],
  stats: [["150+", "Projects delivered"], ["11", "Years designing"], ["4.9", "Client rating"]],
  hours: [["Monday – Saturday", "10:00 AM – 7:00 PM"], ["Sunday", "Site visits by appointment"]],
  cta: ["Book a Design Consultation", "Bring your floor plan — we'll share ideas and an honest budget on the spot."],
};

const JEWELLERY = {
  tagline: "Crafted to Be Worn Forever",
  about:
    "{name} has been crafting jewellery in {city} for generations. Certified stones, honest making charges and designs you can wear every day — not just on the biggest occasions.",
  services: [
    ["Gem", "Bridal & Wedding Collections", "Complete bridal sets designed around your outfit and budget.", ""],
    ["Diamond", "Diamond Jewellery", "Certified diamonds with a transparent break-up of stone and gold.", ""],
    ["Sparkles", "Gold & Polki", "Traditional and contemporary pieces in 22K and 18K.", ""],
    ["Palette", "Custom Design", "Bring a photo or a sketch — we'll craft it to your exact size.", ""],
    ["Gem", "Certified Gemstones", "Lab-certified rubies, emeralds and sapphires with reports.", ""],
    ["ShieldCheck", "Buy-back & Exchange", "Fair-value exchange on your old jewellery, any day.", ""],
  ],
  features: [
    ["BadgeCheck", "Hallmarked Always", "Every piece BIS hallmarked with a proper certificate."],
    ["Gem", "Certified Diamonds", "Independent lab certification on every stone above 0.20 ct."],
    ["Wallet", "Transparent Pricing", "Gold rate, stone value and making charges listed separately."],
    ["ShieldCheck", "Lifetime Care", "Free polishing and rhodium for as long as you own the piece."],
  ],
  team: [
    ["Rajesh Soni", "Master Karigar", "Third-generation goldsmith with forty years at the bench."],
    ["Priya Mehta", "Head of Design", "Trained in classical and contemporary jewellery design."],
  ],
  testimonials: [
    ["Aditi Kulkarni", "Bridal set", "They redesigned my mother's set into something I'll actually wear again."],
    ["Sanjay Agarwal", "Diamond purchase", "Showed me the certificate and the price break-up without me asking. Rare."],
    ["The Deshpande Family", "Regulars", "Three generations of our family have bought here. That says enough."],
  ],
  faqs: [
    ["Are your diamonds certified?", "Yes — every diamond above 0.20 carat comes with an independent laboratory certificate."],
    ["Can I exchange old jewellery?", "We offer fair-value exchange based on the day's rate and purity testing, done in front of you."],
    ["Do you make custom designs?", "Yes. Bring a photo, sketch or idea and we'll design, model and craft it to your size."],
  ],
  stats: [["3", "Generations"], ["40+", "Years at the bench"], ["4.9", "Customer rating"]],
  hours: [["Monday – Saturday", "11:00 AM – 8:30 PM"], ["Sunday", "11:00 AM – 6:00 PM"]],
  cta: ["Visit the Store", "Come see the collection, or WhatsApp us a design you'd like made."],
};

const CA = {
  tagline: "Numbers Handled, Worries Removed",
  about:
    "{name} is a chartered accountancy practice serving businesses and individuals in {city}. We explain compliance in plain language, file on time every time, and flag problems while they're still cheap to fix.",
  services: [
    ["Calculator", "Income Tax Filing", "Salary, capital gains and business returns prepared and filed.", "₹1,500"],
    ["Briefcase", "GST Registration & Filing", "Monthly, quarterly and annual GST returns with reconciliation.", "₹1,000 / month"],
    ["BadgeCheck", "Company Incorporation", "Private limited, LLP and proprietorship set up end to end.", "₹6,500"],
    ["Scale", "Audit & Assurance", "Statutory, tax and internal audits with clean documentation.", ""],
    ["Settings", "Bookkeeping & Payroll", "Monthly accounts, TDS and payroll handled for you.", "₹3,000 / month"],
    ["TrendingUp", "Business Advisory", "Structure, funding and tax planning as you grow.", ""],
  ],
  features: [
    ["BadgeCheck", "Qualified Team", "Chartered accountants and trained article clerks on every file."],
    ["Clock", "Always On Time", "Every deadline tracked, with reminders before they arrive."],
    ["Wallet", "Fixed Fee Structure", "Quoted upfront in writing — never an open-ended hourly bill."],
    ["ShieldCheck", "Complete Confidentiality", "Your financial data stays strictly inside the practice."],
  ],
  team: [
    ["CA. Anil Kulkarni", "Founder, FCA", "Twenty-two years in taxation and business advisory."],
    ["CA. Priya Nair", "Partner — Audit", "Specialises in statutory audit and internal controls."],
    ["CA. Rahul Desai", "Partner — GST", "Handles GST structuring for multi-state businesses."],
  ],
  testimonials: [
    ["Manoj Traders", "Business client", "They found a TDS error three years old and got it refunded. Thorough people."],
    ["Dr. Sneha Rao", "Individual filing", "Explained my capital gains in ten minutes after I'd struggled for weeks."],
    ["Shaikh Enterprises", "GST client", "Zero late filings in four years. They remind me before I remember."],
  ],
  faqs: [
    ["What do you need to file my return?", "Form 16, investment proofs and bank statements. Send them over WhatsApp and we take it from there."],
    ["Can you register my company?", "Yes — from name approval through incorporation, PAN, TAN and the first GST registration."],
    ["How are your fees charged?", "Fixed fees agreed in writing before work begins. No surprise hourly billing."],
  ],
  stats: [["22", "Years in practice"], ["800+", "Clients served"], ["4.9", "Client rating"]],
  hours: [["Monday – Friday", "10:00 AM – 7:00 PM"], ["Saturday", "10:00 AM – 3:00 PM"]],
  cta: ["Book a Free Consultation", "Bring your documents — the first meeting costs nothing."],
};

const ARCHITECT = {
  tagline: "Designed Well, Built Right",
  about:
    "{name} designs buildings in {city} that respect both the site and the budget. We draw carefully, coordinate the engineers, and stay on site until the last detail matches the drawing.",
  services: [
    ["PencilRuler", "Residential Architecture", "Bungalows, row houses and apartment layouts from concept to detail.", "₹60 / sq.ft"],
    ["Building2", "Commercial Buildings", "Showrooms, offices and hospitality designed for footfall and function.", "₹70 / sq.ft"],
    ["PencilRuler", "Plans & Approvals", "Municipal drawings, submissions and sanction follow-up.", "₹25,000"],
    ["Lamp", "Interior Design", "Interior layouts, false ceilings, lighting and joinery details.", "₹45 / sq.ft"],
    ["Ruler", "Site Supervision", "Periodic site visits with quality checks and photo reports.", "₹15,000 / month"],
    ["Thermometer", "Vastu-compliant Design", "Layouts that respect vastu principles without wasting space.", ""],
  ],
  features: [
    ["PencilRuler", "Detailed Drawings", "Every drawing dimensioned for the contractor, not just a concept sketch."],
    ["Users", "Engineer Coordination", "Structural, electrical and plumbing consultants managed by us."],
    ["Wallet", "Budget-aware Design", "We design to your actual budget and flag cost overruns early."],
    ["Hammer", "On-site Presence", "Regular supervision so what's built is what was drawn."],
  ],
  team: [
    ["Ar. Sanjay Patil", "Principal Architect", "Twenty years across residential and institutional work."],
    ["Ar. Meera Kulkarni", "Senior Architect", "Specialises in climate-responsive residential design."],
    ["Er. Prakash Jadhav", "Structural Consultant", "RCC design and structural stability certification."],
  ],
  testimonials: [
    ["Mr. Suresh Bhosale", "Bungalow project", "The drawings were so detailed our contractor never had to guess once."],
    ["Kadam Family", "Home construction", "They caught a structural issue at the drawing stage that would have cost lakhs."],
    ["Verma Retail", "Showroom project", "Designed the space around customer movement. Footfall clearly improved."],
  ],
  faqs: [
    ["Do you handle municipal approvals?", "Yes — we prepare the submission drawings and follow up until you receive the sanction."],
    ["Can you work with my existing structure?", "We assess it first, then design around what can be retained safely."],
    ["How involved are you during construction?", "As much as you want. Site supervision visits can be added to any package."],
  ],
  stats: [["120+", "Projects designed"], ["20", "Years of practice"], ["4.8", "Client rating"]],
  hours: [["Monday – Saturday", "10:00 AM – 7:00 PM"], ["Sunday", "Site visits only"]],
  cta: ["Discuss Your Project", "Share your plot size and requirements — we'll tell you what's possible."],
};

const AC_REPAIR = {
  tagline: "Cool Air, Fixed Fast",
  about:
    "{name} keeps {city} comfortable with honest AC service. We diagnose before we quote, show you the faulty part, and never recommend a repair your unit doesn't need.",
  services: [
    ["Fan", "AC Installation", "Split and window units installed with proper piping and mounting.", "₹1,500"],
    ["Thermometer", "General Service & Gas Refill", "Deep cleaning, coil wash and gas top-up for full cooling.", "₹1,200"],
    ["Wrench", "Repair & Diagnostics", "Compressor, PCB, fan motor and cooling faults fixed right.", "₹400 + parts"],
    ["Wind", "Uninstallation & Shifting", "Safe removal and refitting when you move home or office.", "₹2,000"],
    ["ShieldCheck", "Annual Maintenance (AMC)", "Scheduled servicing with priority breakdown response.", "₹4,500 / year"],
    ["Building2", "Commercial & Ducted AC", "Cassette, ducted and VRF systems serviced by specialists.", ""],
  ],
  features: [
    ["BadgeCheck", "Genuine Spare Parts", "Only OEM or reputed-brand parts, with warranty on both."],
    ["Wallet", "Quote Before Repair", "You approve the estimate before we open the unit."],
    ["Clock", "Same-day Response", "Most service calls attended within the same day."],
    ["ShieldCheck", "30-day Workmanship Warranty", "If the same fault returns within a month, we fix it free."],
  ],
  team: [
    ["Imran Shaikh", "Lead Technician", "Fifteen years across split, ducted and VRF systems."],
    ["Dattatray More", "Service Technician", "Specialises in compressor and PCB diagnostics."],
  ],
  testimonials: [
    ["Sneha Patil", "Split AC repair", "Showed me the burnt capacitor instead of just replacing it. Honest work."],
    ["Rohit Enterprises", "AMC client", "Six office units under AMC — breakdowns get fixed the same day, always."],
    ["Mrs. Kulkarni", "Installation", "Neat piping, cleaned up after, and explained the settings properly."],
  ],
  faqs: [
    ["How often should an AC be serviced?", "Once a year for homes, twice a year where usage is heavy or dusty."],
    ["Why is my AC cooling poorly?", "Most often a dirty filter or low gas. A service visit diagnoses it in minutes."],
    ["Do you offer a warranty?", "All parts carry manufacturer warranty and our labour is guaranteed for thirty days."],
  ],
  stats: [["15", "Years experience"], ["4,000+", "Units serviced"], ["4.8", "Google rating"]],
  hours: [["Monday – Sunday", "9:00 AM – 8:00 PM"]],
  cta: ["Book a Service Visit", "Call or WhatsApp — same-day slots usually available."],
};

const CLEANING = {
  tagline: "Cleaner Spaces, Zero Effort",
  about:
    "{name} brings professional deep cleaning to homes and offices across {city}. Our teams arrive on time with their own supplies, work room by room, and leave only when you've inspected it.",
  services: [
    ["SprayCan", "Full Home Deep Cleaning", "Kitchen degreasing, bathroom descaling and every room detailed.", "₹4,500"],
    ["Building2", "Office & Commercial", "Workstations, washrooms and common areas on a fixed schedule.", ""],
    ["Droplets", "Sofa & Carpet Shampooing", "Deep extraction cleaning that lifts stains and dust mites.", "₹1,200"],
    ["Sparkles", "Move-in / Move-out", "Empty-property cleaning before you occupy or hand over.", "₹5,000"],
    ["Broom", "Bathroom & Kitchen Deep Clean", "Targeted descaling and degreasing for the two toughest rooms.", "₹1,800"],
    ["Droplets", "Water Tank Cleaning", "Overhead and underground tanks emptied, scrubbed and disinfected.", "₹1,500"],
  ],
  features: [
    ["BadgeCheck", "Trained Teams", "Background-checked staff trained on professional equipment."],
    ["Sparkles", "We Bring Everything", "Machines, chemicals and supplies — you provide nothing."],
    ["ShieldCheck", "Eco-friendly Products", "Child- and pet-safe cleaning agents as standard."],
    ["Clock", "Fixed Time Slots", "We arrive in the window we promised, or we tell you before."],
  ],
  team: [
    ["Sunanda Pawar", "Operations Manager", "Runs team scheduling and quality checks after every job."],
    ["Team of 24", "Cleaning Professionals", "Uniformed, trained and fully supervised staff."],
  ],
  testimonials: [
    ["Priya Deshmukh", "Deep cleaning", "My kitchen hadn't looked like that since we moved in. Genuinely impressive."],
    ["Innovate Solutions", "Office client", "Reliable weekly service and the same team every time. Very professional."],
    ["Ravi Menon", "Sofa shampooing", "Thought I'd need a new sofa. It came back looking nearly new."],
  ],
  faqs: [
    ["Do I need to be home during cleaning?", "It's your choice. Many clients hand over the keys and inspect on return."],
    ["Are your products safe for children and pets?", "Yes — we use eco-friendly, non-toxic products as standard on every job."],
    ["How long does a full home take?", "A 2 BHK typically takes four to six hours with a team of three."],
  ],
  stats: [["1,500+", "Homes cleaned"], ["24", "Trained staff"], ["4.8", "Google rating"]],
  hours: [["Monday – Sunday", "8:00 AM – 7:00 PM"]],
  cta: ["Get a Cleaning Quote", "Tell us your home size — we'll send a fixed price in minutes."],
};

const LAUNDRY = {
  tagline: "Fresh Clothes, One Less Chore",
  about:
    "{name} handles laundry and dry cleaning for {city} with proper care tags, honest pricing and on-time delivery. Your clothes come back pressed, folded and ready to wear.",
  services: [
    ["WashingMachine", "Wash & Fold", "Per-kilo laundry with washing, drying and neat folding.", "₹70 / kg"],
    ["Sparkles", "Dry Cleaning", "Sarees, suits, coats and delicate fabrics handled carefully.", "₹150 / piece"],
    ["Sparkles", "Ironing & Pressing", "Crisp pressing for shirts, trousers and school uniforms.", "₹15 / piece"],
    ["Shirt", "Stain Treatment", "Targeted removal for oil, ink and turmeric stains.", "₹50"],
    ["Crown", "Wedding & Bridal Wear", "Lehengas, sherwanis and heavy embroidery cleaned safely.", "₹800"],
    ["Wind", "Express Service", "Same-day turnaround when you're in a hurry.", "50% extra"],
  ],
  features: [
    ["BadgeCheck", "Care-tag Compliance", "Every garment washed to its own care instructions."],
    ["Clock", "On-time Delivery", "Free pick-up and drop within your promised slot."],
    ["ShieldCheck", "Damage Protection", "Garments checked and photographed at both handovers."],
    ["Wallet", "Honest Pricing", "Published rate card — no surprise charges at delivery."],
  ],
  team: [],
  testimonials: [
    ["Anjali Sharma", "Weekly customer", "Pick-up on schedule, everything neatly pressed. One chore off my list."],
    ["Sameer Kulkarni", "Dry cleaning", "My wedding sherwani came back perfect. They clearly know delicates."],
    ["The Joshi Family", "Regular", "School uniforms, office shirts — everything ready when they say."],
  ],
  faqs: [
    ["Is pick-up and delivery free?", "Yes, within the city. We collect and deliver within your chosen slot."],
    ["How long does dry cleaning take?", "Standard is two to three days. Express same-day service is available."],
    ["What if something gets damaged?", "Every garment is inspected and photographed at handover, so any issue is resolved fairly."],
  ],
  stats: [["300+", "Regular families"], ["24 hrs", "Turnaround"], ["4.7", "Google rating"]],
  hours: [["Monday – Saturday", "8:00 AM – 8:00 PM"], ["Sunday", "9:00 AM – 1:00 PM"]],
  cta: ["Schedule a Pick-up", "WhatsApp us your address — we'll be there in your slot."],
};

const EVENT = {
  tagline: "Your Day, Perfectly Planned",
  about:
    "{name} plans weddings, corporate events and celebrations across {city}. We handle vendors, timelines and the hundred small things — so you can actually enjoy your own event.",
  services: [
    ["PartyPopper", "Wedding Planning", "Full planning from venue and decor to catering and coordination.", "₹2,50,000"],
    ["Briefcase", "Corporate Events", "Conferences, launches and team offsites handled end to end.", "₹1,00,000"],
    ["PartyPopper", "Birthday & Private Parties", "Themes, decor, entertainment and food for all ages.", "₹40,000"],
    ["Palette", "Decor & Theming", "Stage, mandap, floral and lighting design built to your theme.", "₹75,000"],
    ["Users", "On-day Coordination", "A team on the ground managing the schedule and vendors.", "₹50,000"],
    ["Gem", "Destination Weddings", "Venue scouting, guest logistics and local vendor management.", ""],
  ],
  features: [
    ["Users", "One Dedicated Planner", "A single planner owns your event from first meeting to last dance."],
    ["Wallet", "Budget Discipline", "Written budgets and vendor quotes — no cost creeps past your limit."],
    ["Clock", "Run-sheet Precision", "A minute-by-minute plan shared with every vendor and family member."],
    ["ShieldCheck", "Backup Plans", "Weather, power and vendor contingencies prepared in advance."],
  ],
  team: [
    ["Nikita Rane", "Founder & Lead Planner", "Two hundred plus weddings planned across the state."],
    ["Amit Salvi", "Operations Head", "Manages vendors, logistics and on-day execution teams."],
    ["Pooja Hegde", "Decor Designer", "Creates themes and floral concepts for every scale of event."],
  ],
  testimonials: [
    ["Aarti & Rohit", "Wedding clients", "We actually watched our own wedding instead of stressing through it."],
    ["Zenith Technologies", "Annual conference", "Flawless execution for four hundred guests. Zero hiccups."],
    ["The Mistry Family", "60th birthday", "They noticed details we hadn't even thought of. Beautifully done."],
  ],
  faqs: [
    ["How far in advance should we book?", "Weddings ideally six to twelve months ahead. Smaller events need three to four weeks."],
    ["Do you work within a fixed budget?", "Yes. Tell us the number first and we plan backwards from it honestly."],
    ["Can we choose our own vendors?", "Absolutely. We're happy to coordinate vendors you've already booked."],
  ],
  stats: [["200+", "Events planned"], ["12", "Years of experience"], ["4.9", "Client rating"]],
  hours: [["Monday – Saturday", "10:00 AM – 8:00 PM"], ["Sunday", "Event days only"]],
  cta: ["Tell Us About Your Event", "Share your date and guest count — we'll send a plan and quote."],
};

const CATERER = {
  tagline: "Food Your Guests Will Remember",
  about:
    "{name} caters weddings, corporate events and family functions across {city}. Fresh ingredients, generous portions and live counters that smell as good as they taste.",
  services: [
    ["ChefHat", "Wedding Catering", "Multi-cuisine menus for large gatherings, served hot.", "₹450 / plate"],
    ["Briefcase", "Corporate Catering", "Boardroom lunches, seminars and office parties.", "₹250 / plate"],
    ["UtensilsCrossed", "Live Food Counters", "Chaat, tandoor, pasta and dosa stations with a chef.", "₹12,000"],
    ["Sparkles", "Buffet Setup & Service", "Crockery, serving staff and complete buffet dressing.", "₹15,000"],
    ["PartyPopper", "Small Gatherings", "House parties and family dinners from twenty guests.", "₹300 / plate"],
    ["ChefHat", "Custom Menu Design", "Menus built around your cuisine, budget and dietary needs.", ""],
  ],
  features: [
    ["Leaf", "Fresh Every Time", "Cooked close to service, never reheated from the morning batch."],
    ["Users", "Trained Serving Staff", "Uniformed, courteous staff who keep counters full and clean."],
    ["Sparkles", "Tasting Session", "Sample your menu before confirming the booking."],
    ["ShieldCheck", "Hygiene Standards", "Gloves, hair nets and temperature-controlled transport."],
  ],
  team: [
    ["Chef Raju Pawar", "Head Chef", "Twenty-five years of wedding and banquet catering."],
    ["Chef Farida Khan", "Continental & Bakes", "Handles continental menus, desserts and plated service."],
  ],
  testimonials: [
    ["The Deshmukh Family", "Wedding catering", "Guests are still talking about the live chaat counter a year later."],
    ["Aptech Solutions", "Corporate client", "Consistent quality for every monthly event. Punctual and tidy."],
    ["Sneha & Karan", "Reception dinner", "They adjusted the menu twice without complaint. Food was excellent."],
  ],
  faqs: [
    ["What is the minimum order?", "We cater from twenty guests for private events and fifty for buffets."],
    ["Can we taste before booking?", "Yes — a tasting session is included with every confirmed wedding booking."],
    ["Do you handle Jain and vegan menus?", "Happily. Separate preparation and clearly marked counters are arranged."],
  ],
  stats: [["500+", "Events catered"], ["25", "Years in the kitchen"], ["4.8", "Client rating"]],
  hours: [["Monday – Sunday", "7:00 AM – 10:00 PM"]],
  cta: ["Get a Catering Quote", "Tell us your guest count and cuisine — we'll design a menu to fit."],
};

const NUTRITIONIST = {
  tagline: "Eat Well, Feel Better",
  about:
    "{name} helps people in {city} build a healthy relationship with food. No fad diets, no banned foods — practical plans built around what you already cook and enjoy eating.",
  services: [
    ["Salad", "Weight Management", "Sustainable fat loss or weight gain plans with monthly reviews.", "₹2,500 / month"],
    ["Carrot", "Clinical Nutrition", "Diabetes, thyroid, PCOS and cholesterol management plans.", "₹3,000 / month"],
    ["Salad", "Sports & Fitness Nutrition", "Macro planning for gym-goers, runners and athletes.", "₹3,500 / month"],
    ["Baby", "Child & Teen Nutrition", "Picky eating, healthy growth and exam-time nutrition.", "₹2,000 / month"],
    ["HeartPulse", "Diet for Medical Conditions", "Renal, liver, gut and post-surgery therapeutic diets.", "₹3,500 / month"],
    ["Sparkles", "One-time Consultation", "A single detailed session with a written plan to follow.", "₹1,200"],
  ],
  features: [
    ["Users", "Qualified Dietitian", "Registered practitioner with clinical nutrition training."],
    ["Leaf", "Real Indian Food", "Plans built on home-cooked meals, not imported supplements."],
    ["Headset", "Weekly Check-ins", "Short reviews every week to adjust the plan before you stall."],
    ["Wallet", "No Forced Supplements", "Food first. Supplements recommended only when genuinely needed."],
  ],
  team: [
    ["Dt. Kavita Joshi", "Chief Dietitian", "RD qualified with nine years of clinical practice."],
    ["Dt. Rahul Mehta", "Sports Nutritionist", "Specialises in strength athletes and endurance training."],
  ],
  testimonials: [
    ["Priya Agarwal", "Lost 11 kg", "She built the plan around my own cooking. Nothing felt like a punishment."],
    ["Mr. Ramesh Shah", "Diabetes management", "My HbA1c dropped meaningfully in four months. She explained every choice."],
    ["Atharv Patil", "Strength athlete", "Protein and macros finally made sense. Lifts went up, weight stayed stable."],
  ],
  faqs: [
    ["Do I have to give up my normal food?", "No. Plans are built around the meals your family already cooks."],
    ["How are consultations held?", "At the clinic, or over video call if that's easier for you."],
    ["Will I need supplements?", "Only where a genuine deficiency exists, and never as a substitute for food."],
  ],
  stats: [["1,200+", "Clients guided"], ["9", "Years of practice"], ["4.9", "Client rating"]],
  hours: [["Monday – Saturday", "10:00 AM – 7:00 PM"], ["Sunday", "By appointment"]],
  cta: ["Book Your First Consultation", "Bring your reports — we'll start with what you actually eat."],
};

const MAKEUP = {
  tagline: "Look Like You, On Your Best Day",
  about:
    "{name} creates makeup for brides and celebrations across {city}. Skin-first prep, products that last through tears and dancing, and looks that photograph beautifully.",
  services: [
    ["Crown", "Bridal Makeup", "Full bridal look with draping, hairstyling and a trial session.", "₹15,000"],
    ["Paintbrush", "Engagement & Reception", "Occasion looks that hold through a full evening.", "₹8,000"],
    ["Sparkles", "Party & Event Makeup", "Guest-ready looks for birthdays, sangeet and festivals.", "₹3,500"],
    ["Users", "Family & Group Booking", "Rates for mothers, sisters and the whole wedding party.", "₹2,500 / person"],
    ["Camera", "Editorial & Portfolio", "Camera-ready makeup for shoots and campaigns.", "₹6,000"],
    ["Paintbrush", "Makeup Lessons", "One-on-one sessions on doing your own makeup well.", "₹5,000"],
  ],
  features: [
    ["BadgeCheck", "Professional Kit", "Cruelty-free, long-wear products suited to Indian skin tones."],
    ["Crown", "Trial Included", "Bridal bookings include a full trial so there are no surprises."],
    ["Clock", "On-time Arrival", "We reach the venue early and finish before the photographer needs you."],
    ["Sparkles", "Skin-first Prep", "Prep and priming tailored to your skin type, not a fixed routine."],
  ],
  team: [
    ["Sana Qureshi", "Lead Artist & Founder", "Eight years and over two hundred brides styled."],
    ["Neha Bakshi", "Hair & Draping Specialist", "Handles bridal hairstyling and saree draping."],
  ],
  testimonials: [
    ["Riya & Amit", "Bride & groom", "My makeup lasted fourteen hours, two ceremonies and a lot of crying."],
    ["Shalini Nair", "Reception client", "Looked like myself, just glowing. Exactly what I asked for."],
    ["The Kulkarni Family", "Group booking", "They handled six of us calmly and on time. Very professional."],
  ],
  faqs: [
    ["Do you travel to the venue?", "Yes, within the city and beyond. Travel beyond the city is charged at actuals."],
    ["Is a trial included for brides?", "Yes — every bridal booking includes a full trial session before the day."],
    ["Which products do you use?", "Professional, cruelty-free brands. I'll happily tell you exactly what suits your skin."],
  ],
  stats: [["200+", "Brides styled"], ["8", "Years of artistry"], ["4.9", "Client rating"]],
  hours: [["Monday – Sunday", "By appointment"]],
  cta: ["Check Your Date", "Tell us your occasion and date — we'll confirm availability and packages."],
};

/* ========================================================================= */
/*  Added business categories                                                */
/* ========================================================================= */
const autoService = (tagline, about, services, cta, extra = {}) => ({
  tagline, about, services, features: [
    ["BadgeCheck", "Trained Technicians", "Certified staff who work on your vehicle every day."],
    ["Wallet", "Upfront Pricing", "Written estimate before any work begins."],
    ["Clock", "Same-day Service", "Most jobs finished and returned the same day."],
    ["ShieldCheck", "Workmanship Warranty", "Our work is guaranteed in writing."],
  ],
  team: [["Lead Technician", "Workshop Head", "Fifteen years of hands-on experience."]],
  testimonials: [
    ["Happy Customer", "Regular client", "Honest diagnosis, fair price, done on time. Exactly what I wanted."],
    ["Local Resident", "First-time customer", "Showed me the faulty part before replacing it. Very trustworthy."],
  ],
  faqs: [
    ["How long will my service take?", "Most standard jobs are completed the same day. We'll confirm timing when you book."],
    ["Do you provide a warranty?", "Yes — parts carry manufacturer warranty and our labour is guaranteed."],
  ],
  stats: [["15", "Years experience"], ["1,000+", "Jobs completed"], ["4.8", "Google rating"]],
  hours: [["Monday – Saturday", "9:00 AM – 8:00 PM"], ["Sunday", "10:00 AM – 2:00 PM"]],
  cta, ...extra,
});

const repairShop = (tagline, about, services, cta) => ({
  tagline, about, services, features: [
    ["Wrench", "Board-level Repairs", "Component-level diagnosis, not just part swapping."],
    ["Wallet", "Free Diagnosis", "We diagnose first and quote before repairing."],
    ["Clock", "Fast Turnaround", "Most repairs ready within 24 to 48 hours."],
    ["ShieldCheck", "Repair Warranty", "Every repair backed by a written warranty."],
  ],
  team: [["Senior Technician", "Repair Specialist", "Ten years of chip-level repair experience."]],
  testimonials: [
    ["Satisfied Customer", "Repair client", "Fixed what two other shops said was unrepairable."],
    ["Local Business Owner", "Regular client", "Reliable, quick and honest about what's worth fixing."],
  ],
  faqs: [
    ["Is diagnosis really free?", "Yes — we inspect and quote at no cost. You decide after seeing the price."],
    ["Do you use genuine parts?", "We offer both genuine and high-quality alternatives, clearly priced."],
  ],
  stats: [["10", "Years repairing"], ["2,000+", "Devices fixed"], ["4.9", "Customer rating"]],
  hours: [["Monday – Saturday", "10:00 AM – 8:30 PM"], ["Sunday", "11:00 AM – 5:00 PM"]],
  cta,
});

const serviceBusiness = (tagline, about, services, cta, extra = {}) => ({
  tagline, about, services, features: [
    ["Users", "Trained Team", "Background-checked, uniformed staff on every job."],
    ["ShieldCheck", "Safe Products", "Child- and pet-safe materials as standard."],
    ["Clock", "On-time Arrival", "We arrive in the slot we promised."],
    ["Wallet", "Fixed Quotes", "Price agreed before we start — no surprises."],
  ],
  team: [["Operations Manager", "Team Lead", "Supervises quality on every single job."]],
  testimonials: [
    ["Happy Customer", "Regular client", "Arrived on time, worked neatly and did exactly what they quoted."],
    ["Another Client", "One-time booking", "Professional from booking to finish. Would use again."],
  ],
  faqs: [
    ["Do I need to be present?", "It's your choice — many customers let our team work unattended."],
    ["How do I book?", "Call or WhatsApp us with your requirement and preferred time."],
  ],
  stats: [["500+", "Jobs completed"], ["8+", "Years running"], ["4.8", "Google rating"]],
  hours: [["Monday – Saturday", "8:00 AM – 7:00 PM"]],
  cta, ...extra,
});

const eduBusiness = (tagline, about, services, cta, extra = {}) => ({
  tagline, about, services, features: [
    ["Users", "Small Batches", "Limited seats so every student gets attention."],
    ["BookOpen", "Structured Curriculum", "A clear syllabus with progress tracking."],
    ["Award", "Proven Results", "Consistent improvement across our students."],
    ["Clock", "Flexible Timings", "Batches that fit around school and work."],
  ],
  team: [
    ["Lead Faculty", "Head Instructor", "Over a decade of teaching experience."],
    ["Assistant Faculty", "Trainer", "Patient, encouraging and highly qualified."],
  ],
  testimonials: [
    ["Student Name", "Current student", "The teaching finally made this subject click for me."],
    ["Parent Name", "Parent", "Regular feedback and genuine improvement in marks."],
  ],
  faqs: [
    ["Can I attend a demo class?", "Yes — your first class is free so you can judge the teaching yourself."],
    ["What are the batch timings?", "Morning and evening batches run through the week. Call us for the current schedule."],
  ],
  stats: [["500+", "Students taught"], ["10+", "Years teaching"], ["4.9", "Parent rating"]],
  hours: [["Monday – Saturday", "8:00 AM – 12:00 PM, 4:00 – 9:00 PM"], ["Sunday", "Test sessions only"]],
  cta, ...extra,
});

const creativeAgency = (tagline, about, services, cta, extra = {}) => ({
  tagline, about, services, features: [
    ["Palette", "Design-led Work", "Every deliverable crafted, never templated."],
    ["Clock", "Reliable Deadlines", "We commit to dates and then hit them."],
    ["Users", "One Point of Contact", "You work directly with the person doing the work."],
    ["TrendingUp", "Measurable Output", "We report on outcomes, not just activity."],
  ],
  team: [
    ["Creative Director", "Founder", "Sets direction on every project personally."],
    ["Senior Designer", "Design Lead", "Handles execution and quality control."],
  ],
  testimonials: [
    ["Client Name", "Brand owner", "Understood our brief quickly and delivered beyond it."],
    ["Another Client", "Marketing head", "Creative, responsive and genuinely easy to work with."],
  ],
  faqs: [
    ["How do projects start?", "A short call about your goals, then a written proposal with scope and fixed cost."],
    ["What are your payment terms?", "Typically 50% upfront and 50% on delivery, invoiced properly."],
  ],
  stats: [["150+", "Projects delivered"], ["7", "Years creating"], ["4.9", "Client rating"]],
  hours: [["Monday – Friday", "10:00 AM – 7:00 PM"], ["Saturday", "By appointment"]],
  cta, ...extra,
});

const foodBusiness = (tagline, about, menu, cta, extra = {}) => ({
  tagline, about, services: [], menu, features: [
    ["Leaf", "Fresh Ingredients", "Sourced daily and never stored beyond a day."],
    ["Sparkles", "Hygiene First", "Clean kitchen, gloves and covered storage."],
    ["Users", "Made to Order", "Everything prepared fresh after you order."],
    ["Wallet", "Fair Pricing", "Generous portions at honest prices."],
  ],
  team: [],
  testimonials: [
    ["Regular Customer", "Loyal patron", "Consistently good. The quality never dips."],
    ["First-time Visitor", "New customer", "Ordered on a recommendation and was not disappointed."],
  ],
  faqs: [
    ["Do you take bulk orders?", "Yes — advance notice is appreciated for large quantities."],
    ["Is home delivery available?", "Yes, within our delivery radius. Call to confirm your area."],
  ],
  stats: [["4.7", "Google rating"], ["100+", "Menu items"], ["Fresh", "Every day"]],
  hours: [["Monday – Sunday", "10:00 AM – 10:00 PM"]],
  cta, ...extra,
});

const ADDED_PACKS = {
  "car-detailing": autoService(
    "Spotless Inside and Out",
    "{name} gives vehicles in {city} a proper deep clean — hand wash, paint correction and ceramic coating done by people who genuinely care about finish.",
    [["Sparkles", "Express Car Wash", "Exterior foam wash with interior vacuuming.", "₹499"],
     ["Car", "Interior Deep Cleaning", "Seats, carpets and dashboard detailed by hand.", "₹1,800"],
     ["Wand2", "Paint Polish & Wax", "Machine polish that removes swirls and restores gloss.", "₹3,500"],
     ["ShieldCheck", "Ceramic Coating", "Long-lasting paint protection with hydrophobic finish.", "₹12,000"],
     ["Settings", "Headlight Restoration", "Foggy lenses restored to near-new clarity.", "₹900"],
     ["Wind", "Engine Bay Cleaning", "Degreased and dressed engine compartment.", "₹700"]],
    ["Book Your Detailing Slot", "Call or WhatsApp — we'll confirm a time and what your car needs."]
  ),
  "bike-service": autoService(
    "Your Bike, Serviced Properly",
    "{name} services and repairs two-wheelers across {city} with honest advice and genuine spares. We tell you what's urgent and what can wait.",
    [["Wrench", "Periodic Service", "Oil change, filter, chain adjust and full inspection.", "₹650"],
     ["Zap", "Electrical Repairs", "Battery, wiring, and starting system faults.", "₹350"],
     ["Settings", "Brake & Clutch Work", "Pads, plates and cable replacement.", "₹550"],
     ["Activity", "Engine Work", "Top-end overhauls and gearbox repairs.", ""],
     ["Sparkles", "Body & Dent Work", "Panel repair and full repainting.", ""],
     ["ShieldCheck", "Free Pickup & Drop", "We collect your bike and return it serviced.", "Free"]],
    ["Book a Bike Service", "Free pickup and drop available — just tell us your location."]
  ),
  "car-rental": serviceBusiness(
    "Drive Anywhere, On Your Terms",
    "{name} offers well-maintained self-drive and chauffeur-driven cars in {city}. Transparent per-km pricing, no hidden charges and vehicles that are actually clean.",
    [["Car", "Self-drive Cars", "Hatchbacks, sedans and SUVs by the day.", "₹1,800 / day"],
     ["Users", "Chauffeur-driven", "Professional drivers for weddings and business travel.", "₹3,500 / day"],
     ["Plane", "Airport Transfers", "Fixed-price pickups with flight tracking.", "₹1,200"],
     ["Clock", "Outstation Trips", "Per-km packages for multi-day journeys.", "₹14 / km"],
     ["Crown", "Wedding Fleet", "Decorated cars for the wedding party.", ""],
     ["ShieldCheck", "Monthly Rentals", "Long-term corporate and personal leases.", ""]],
    ["Reserve Your Car", "Tell us the dates and vehicle type — we'll confirm availability and price."],
    { stats: [["50+", "Cars in fleet"], ["24×7", "Booking support"], ["4.8", "Customer rating"]] }
  ),
  "bike-rental": serviceBusiness(
    "Rent a Bike, Ride Free",
    "{name} rents well-serviced scooters and motorcycles in {city} by the hour, day or month. Helmets included, deposit friendly, no paperwork drama.",
    [["Bike", "Scooters", "Automatic scooters perfect for city commuting.", "₹350 / day"],
     ["Bike", "Motorcycles", "Commuter and premium bikes for longer rides.", "₹600 / day"],
     ["Clock", "Hourly Rentals", "Short rides around the city by the hour.", "₹80 / hour"],
     ["CalendarDays", "Monthly Rentals", "Unlimited-kilometre monthly plans for locals and students.", "₹5,500 / month"],
     ["Map", "Outstation Rides", "Bikes for weekend trips with luggage mounts.", ""],
     ["ShieldCheck", "Helmets Included", "Two certified helmets with every rental at no extra cost.", "Free"]],
    ["Book Your Ride", "WhatsApp us the dates — we'll hold a bike for you."],
    { stats: [["40+", "Bikes available"], ["2 hrs", "Quick booking"], ["4.7", "Google rating"]] }
  ),
  "mobile-repair": repairShop(
    "Your Phone, Fixed Today",
    "{name} repairs phones of every brand in {city} — screens, batteries, charging ports and board-level work, all with a written warranty.",
    [["Smartphone", "Screen Replacement", "Original-grade displays fitted while you wait.", "₹1,500"],
     ["Zap", "Battery Replacement", "Genuine-capacity batteries with health report.", "₹900"],
     ["Settings", "Charging Port Repair", "Port cleaning and replacement for fast charging.", "₹700"],
     ["Activity", "Water Damage Recovery", "Ultrasonic cleaning and board-level revival.", "₹1,200"],
     ["ShieldCheck", "Software & Unlocking", "OS reinstalls, data recovery and account issues.", "₹500"],
     ["Camera", "Camera & Speaker", "Module replacement for blurry photos or low volume.", "₹800"]],
    ["Get a Free Diagnosis", "Bring your phone in — we diagnose and quote at no charge."]
  ),
  "laptop-repair": repairShop(
    "Computers Repaired Right",
    "{name} fixes laptops and desktops across {city} — hardware faults, slow machines, upgrades and data recovery, handled by experienced technicians.",
    [["Laptop", "Hardware Repair", "Motherboard, keyboard, hinge and display repairs.", "₹800"],
     ["Zap", "Battery & Charging", "Battery replacement and DC jack repair.", "₹1,200"],
     ["Settings", "RAM & SSD Upgrade", "Make an old laptop genuinely fast again.", "₹2,500"],
     ["ShieldCheck", "Virus & OS Issues", "Clean reinstall with drivers and data backup.", "₹700"],
     ["Activity", "Data Recovery", "Recovering files from failed drives.", ""],
     ["Monitor", "Screen Replacement", "Original panels for all major brands.", "₹3,000"]],
    ["Book a Repair Slot", "Describe the problem — we'll tell you what it likely costs."]
  ),
  "appliance-repair": repairShop(
    "Home Appliances, Working Again",
    "{name} repairs refrigerators, washing machines, microwaves and air conditioners across {city}. We diagnose first and never recommend a repair you don't need.",
    [["Refrigerator", "Refrigerator Repair", "Cooling faults, gas charging and compressor work.", "₹500"],
     ["WashingMachine", "Washing Machine Repair", "Drum, motor, drainage and door faults.", "₹450"],
     ["Wind", "Air Conditioner Service", "Deep cleaning, gas top-up and repairs.", "₹1,200"],
     ["Zap", "Microwave Repair", "Heating, keypad and board faults.", "₹550"],
     ["Wrench", "Installation & Uninstalling", "Safe fitting and shifting of appliances.", "₹800"],
     ["ShieldCheck", "Annual Maintenance", "Scheduled servicing with priority breakdown response.", "₹3,500 / year"]],
    ["Book a Technician Visit", "Tell us the appliance and the fault — same-day slots available."]
  ),
  "ro-service": serviceBusiness(
    "Pure Water, Every Day",
    "{name} services and installs RO water purifiers across {city}. Genuine filters, honest AMC pricing and reminders before your filter is due.",
    [["Droplets", "Filter Replacement", "Sediment, carbon and RO membrane changes.", "₹1,200"],
     ["Settings", "Complete Service", "Membrane cleaning, sanitisation and flow check.", "₹600"],
     ["ShieldCheck", "Annual AMC", "Three visits a year with all filters included.", "₹3,500 / year"],
     ["Zap", "New Installation", "RO unit supply and professional fitting.", ""],
     ["Activity", "Leak & Noise Repair", "Fixing dripping taps and noisy pumps.", "₹400"],
     ["Droplets", "Water Quality Test", "TDS testing to check your purifier is working.", "Free"]],
    ["Book a Service Visit", "We'll test your water and tell you exactly what's needed."],
    { stats: [["3,000+", "Purifiers serviced"], ["Genuine", "Filters only"], ["4.9", "Customer rating"]] }
  ),
  "pest-control": serviceBusiness(
    "Pest-free, Guaranteed",
    "{name} provides safe, effective pest control for homes and offices in {city}. Odourless treatments, child-safe products and a written warranty on every service.",
    [["Bug", "General Pest Control", "Cockroaches, ants and spiders — odourless gel treatment.", "₹1,800"],
     ["ShieldCheck", "Termite Treatment", "Drilling and chemical barrier for long-term protection.", "₹6,500"],
     ["Wind", "Mosquito Control", "Fogging and larvicide for gardens and society premises.", "₹2,500"],
     ["Dog", "Bed Bug Treatment", "Two-visit programme for complete elimination.", "₹3,000"],
     ["PawPrint", "Rodent Control", "Baiting and proofing for homes and restaurants.", "₹2,200"],
     ["Building2", "Commercial Contracts", "Monthly AMC for restaurants, offices and hotels.", ""]],
    ["Get a Free Inspection", "We'll assess the infestation and quote a fixed price."],
    { stats: [["2,500+", "Homes treated"], ["Safe", "For kids & pets"], ["4.8", "Google rating"]] }
  ),
  "packers-movers": serviceBusiness(
    "Moving Made Simple",
    "{name} shifts homes and offices across {city} and nationwide. Careful packing, insured transport and a team that treats your belongings like their own.",
    [["Truck", "Home Shifting", "Full packing, loading, transport and unpacking.", "₹6,000"],
     ["Building2", "Office Relocation", "Weekend moves with IT equipment handling.", ""],
     ["Package", "Packing Service", "Professional packing with quality materials.", "₹3,000"],
     ["Car", "Vehicle Transport", "Car and bike shifting in enclosed carriers.", ""],
     ["ShieldCheck", "Transit Insurance", "Full-value protection for your belongings.", ""],
     ["Clock", "Express Moves", "Same-day shifting for smaller homes.", ""]],
    ["Get a Moving Quote", "Tell us your from and to locations — we'll quote a fixed price."],
    { stats: [["1,000+", "Moves completed"], ["Insured", "Every move"], ["4.8", "Customer rating"]] }
  ),
  waterproofing: serviceBusiness(
    "Dry Walls, Peace of Mind",
    "{name} solves leakage and damp problems across {city} with the right diagnosis — not a temporary patch. We find the source first, then treat it.",
    [["ShieldCheck", "Terrace Waterproofing", "Membrane and chemical treatment for leaking roofs.", "₹80 / sq.ft"],
     ["Bath", "Bathroom Waterproofing", "Tile grouting and injection for seepage walls.", "₹6,500"],
     ["Building2", "External Wall Treatment", "Elastomeric coating that blocks rain ingress.", "₹45 / sq.ft"],
     ["Droplets", "Basement Waterproofing", "Crystalline treatment for underground walls.", ""],
     ["Activity", "Leak Detection", "Moisture mapping to find the actual source.", "₹1,500"],
     ["Clock", "Monsoon Prep Package", "Pre-monsoon inspection and preventive sealing.", ""]],
    ["Book a Free Leak Inspection", "We'll find the source and quote before any work starts."],
    { stats: [["800+", "Leakages solved"], ["10", "Years experience"], ["4.9", "Customer rating"]] }
  ),
  "home-renovation": serviceBusiness(
    "Your Home, Renewed",
    "{name} handles home renovations across {city} — from a single bathroom to a full flat makeover. Clear quotes, real timelines and one person accountable throughout.",
    [["Hammer", "Full Home Renovation", "Civil, electrical, plumbing and finishing together.", ""],
     ["Bath", "Bathroom Remodelling", "Tiling, fittings and waterproofing in one package.", "₹85,000"],
     ["Settings", "Kitchen Upgrades", "Counter, tiling and appliance refitting.", "₹60,000"],
     ["Zap", "Electrical Rewiring", "Safe, compliant wiring with new points.", ""],
     ["Paintbrush", "Painting & Textures", "Interior and exterior painting with surface prep.", "₹18 / sq.ft"],
     ["Clock", "Repairs & Fixes", "Leaking taps, cracked walls and door repairs.", ""]],
    ["Discuss Your Renovation", "Share photos of the space — we'll send a realistic estimate."],
    { stats: [["300+", "Homes renovated"], ["12", "Years building"], ["4.8", "Client rating"]] }
  ),
  "modular-kitchen": serviceBusiness(
    "Kitchens Built Around You",
    "{name} designs and installs modular kitchens in {city}. We measure properly, design in 3D first, and build with hardware that actually lasts.",
    [["UtensilsCrossed", "Modular Kitchen Design", "3D design with layout and storage planning.", "₹25,000"],
     ["Settings", "Full Installation", "Carcass, shutters and countertop fitting.", "₹1,50,000"],
     ["Hammer", "Civil Work & Plumbing", "Platform, sink and chimney point work.", ""],
     ["Sparkles", "Hardware Upgrades", "Soft-close hinges, drawers and pull-outs.", "₹15,000"],
     ["ShieldCheck", "Countertop Supply", "Granite, quartz and composite options.", ""],
     ["Clock", "Island & Breakfast Counter", "Custom island units with seating.", ""]],
    ["Book a Design Consultation", "Bring your kitchen measurements — we'll design it free."],
    { stats: [["200+", "Kitchens built"], ["5-Year", "Warranty"], ["4.9", "Client rating"]] }
  ),
  "furniture-shop": serviceBusiness(
    "Furniture Made to Last",
    "{name} crafts and sells furniture in {city} from solid wood and honest materials. Custom sizes, no particle board passed off as wood.",
    [["Sofa", "Sofas & Seating", "Custom sofas in your fabric and size.", "₹25,000"],
     ["BedDouble", "Beds & Wardrobes", "Solid wood beds with storage options.", "₹35,000"],
     ["Armchair", "Dining Sets", "Tables and chairs built to your room.", "₹30,000"],
     ["Laptop", "Study & Office", "Desks, chairs and storage for home offices.", "₹15,000"],
     ["PenTool", "Custom Furniture", "Made to your drawing and dimensions.", ""],
     ["ShieldCheck", "Restoration", "Refinishing and repairing old pieces.", ""]],
    ["Visit Our Showroom", "Come see the wood quality, or WhatsApp us your design."],
    { stats: [["25", "Years crafting"], ["1,500+", "Pieces delivered"], ["4.8", "Customer rating"]] }
  ),
  "tiles-sanitary": serviceBusiness(
    "Everything for Your Bathroom",
    "{name} supplies tiles, sanitaryware and fittings across {city} — genuine brands, clear prices and delivery to your site.",
    [["Bath", "Wall & Floor Tiles", "Ceramic, vitrified and porcelain in every size.", ""],
     ["Droplets", "Sanitaryware", "WCs, basins and cisterns from trusted brands.", ""],
     ["Settings", "Faucets & Fittings", "Showers, mixers and accessories.", ""],
     ["Bath", "Bath Accessories", "Towel rails, mirrors and shelves.", ""],
     ["Hammer", "Free Layout Consultation", "We help plan tile layout and quantities.", "Free"],
     ["Truck", "Site Delivery", "Careful delivery to your construction site.", ""]],
    ["Browse Our Collection", "WhatsApp us your requirement list for a same-day quote."],
    { stats: [["500+", "Brands & designs"], ["Genuine", "Products only"], ["4.7", "Customer rating"]] }
  ),
  "hardware-shop": serviceBusiness(
    "Every Tool, Every Fitting",
    "{name} is the neighbourhood hardware store in {city} — tools, electricals, plumbing and building materials with honest prices and real advice.",
    [["Wrench", "Hand & Power Tools", "Drills, grinders and hand tools from good brands.", ""],
     ["Zap", "Electricals", "Wires, switches, MCBs and light fittings.", ""],
     ["Droplets", "Plumbing Materials", "Pipes, fittings, taps and valves.", ""],
     ["Hammer", "Building Materials", "Cement, putty, adhesives and fasteners.", ""],
     ["ShieldCheck", "Paint & Sundries", "Primers, putty and painting supplies.", ""],
     ["Truck", "Bulk Supply", "Contractor rates for larger quantities.", ""]],
    ["Check Stock & Prices", "Send your list on WhatsApp — we'll confirm price and availability."],
    { stats: [["5,000+", "Products stocked"], ["30", "Years serving"], ["4.8", "Customer rating"]] }
  ),
  "paint-dealer": serviceBusiness(
    "Colour, Done Properly",
    "{name} supplies paints and provides professional painting across {city}. Surface preparation done right, so the finish lasts for years.",
    [["Paintbrush", "Interior Painting", "Surface prep, primer and two finish coats.", "₹18 / sq.ft"],
     ["Building2", "Exterior Painting", "Weather-resistant coatings for outside walls.", "₹22 / sq.ft"],
     ["Palette", "Texture & Stucco", "Decorative textures for feature walls.", "₹120 / sq.ft"],
     ["Settings", "Waterproof Coatings", "Elastomeric paints for leaking terraces.", "₹35 / sq.ft"],
     ["Sparkles", "Wood & Metal Paint", "Enamel, polish and PU finishes.", "₹150 / piece"],
     ["ShieldCheck", "Colour Consultation", "We help you pick shades for your lighting.", "Free"]],
    ["Get a Painting Quote", "Tell us your room sizes — we'll quote including materials."],
    { stats: [["1,200+", "Homes painted"], ["15", "Years painting"], ["4.8", "Customer rating"]] }
  ),
  "solar-installation": serviceBusiness(
    "Power From Your Own Roof",
    "{name} installs rooftop solar across {city} — residential, commercial and society projects with net-metering handled end to end.",
    [["Sun", "Residential Solar", "1 kW to 10 kW rooftop systems for homes.", "₹65,000 / kW"],
     ["Building2", "Commercial Solar", "Larger installations for factories and offices.", ""],
     ["Zap", "Net Metering Setup", "Complete documentation and discom liaison.", "₹15,000"],
     ["ShieldCheck", "AMC & Monitoring", "Cleaning, checks and generation monitoring.", "₹8,000 / year"],
     ["Settings", "Inverter & Battery", "Hybrid systems with backup storage.", ""],
     ["Clock", "Free Site Survey", "Roof assessment and generation estimate.", "Free"]],
    ["Book a Free Site Survey", "We'll measure your roof and estimate your savings."],
    { stats: [["150+", "Installations"], ["25 Years", "Panel warranty"], ["4.9", "Customer rating"]] }
  ),
  gardening: serviceBusiness(
    "Gardens That Thrive",
    "{name} designs and maintains gardens across {city} — lawns, terrace gardens and balcony greenery that actually survive the season.",
    [["Sprout", "Garden Design", "Layout planning with the right plants for your light.", "₹15,000"],
     ["Leaf", "Lawn Development", "Soil prep, turfing and border edging.", "₹80 / sq.ft"],
     ["Sparkles", "Regular Maintenance", "Weekly or monthly care visits.", "₹3,000 / month"],
     ["Flower", "Seasonal Planting", "Flower beds rotated through the year.", "₹2,500"],
     ["Droplets", "Drip Irrigation", "Water-efficient watering systems.", "₹12,000"],
     ["Home", "Terrace & Balcony Gardens", "Container gardens for smaller spaces.", ""]],
    ["Get a Garden Consultation", "Tell us your space and sunlight — we'll suggest what will grow."],
    { stats: [["300+", "Gardens created"], ["10", "Years gardening"], ["4.9", "Client rating"]] }
  ),
  "water-supplier": serviceBusiness(
    "Clean Water at Your Door",
    "{name} supplies packaged drinking water across {city} — 20-litre cans, jars and bottles delivered on schedule, every time.",
    [["GlassWater", "20L Water Cans", "Purified drinking water in returnable cans.", "₹40 / can"],
     ["Package", "Jars & Bottles", "1L and 2L bottles for offices and events.", "₹15 / bottle"],
     ["CalendarDays", "Monthly Subscription", "Fixed daily delivery at a discounted rate.", "₹900 / month"],
     ["Truck", "Bulk Supply", "Tanker loads for events and construction sites.", ""],
     ["Building2", "Office Contracts", "Regular supply with dispenser options.", ""],
     ["ShieldCheck", "Free Dispenser", "Dispenser provided with regular subscriptions.", "Free"]],
    ["Start Your Water Supply", "Tell us your address and quantity — delivery starts tomorrow."],
    { stats: [["500+", "Daily deliveries"], ["ISI", "Certified water"], ["4.8", "Customer rating"]] }
  ),
  "wedding-decoration": serviceBusiness(
    "Decor That Tells Your Story",
    "{name} creates wedding decor in {city} that reflects the couple, not a catalogue. Florals, stages and themes designed around your colours and budget.",
    [["Flower", "Stage & Mandap Decor", "Floral and fabric stage designs.", "₹75,000"],
     ["Palette", "Theme Design", "Complete look and colour planning.", "₹25,000"],
     ["Sparkles", "Entrance & Pathway", "Gate, walkway and welcome decor.", "₹35,000"],
     ["Crown", "Haldi & Mehndi Setups", "Bright, traditional function decor.", "₹30,000"],
     ["Camera", "Photo Booth Corners", "Styled backdrops for pictures.", "₹18,000"],
     ["Users", "On-site Team", "Setup, changes and teardown handled.", ""]],
    ["Share Your Wedding Vision", "Tell us your date and theme — we'll design within your budget."],
    { stats: [["200+", "Weddings decorated"], ["8", "Years designing"], ["4.9", "Couple rating"]] }
  ),
  "mandap-decoration": serviceBusiness(
    "Sacred Spaces, Beautifully Made",
    "{name} builds mandaps and event setups across {city} — traditional wooden mandaps, floral arches and function decor with a setup team that arrives early.",
    [["Tent", "Traditional Mandap", "Carved wooden mandap with draping and florals.", "₹85,000"],
     ["Flower", "Floral Mandap", "Fresh flower arches and garland work.", "₹60,000"],
     ["Sparkles", "Haldi & Sangeet Decor", "Colourful setups for pre-wedding functions.", "₹30,000"],
     ["Tent", "Shamiana & Tenting", "Canopies and enclosures for guests.", "₹15,000"],
     ["Users", "Guest Seating", "Chairs, sofas and stage furniture.", "₹10,000"],
     ["Clock", "Same-day Setup", "Early-morning setup before your muhurat.", ""]],
    ["Book Your Mandap", "Share your date and venue — we'll confirm availability."],
    { stats: [["150+", "Mandaps built"], ["12", "Years experience"], ["4.9", "Family rating"]] }
  ),
  "dj-sound": serviceBusiness(
    "Sound That Fills the Night",
    "{name} provides DJ and sound systems for weddings and events across {city}. Professional equipment, experienced DJs and lighting that sets the mood.",
    [["Music", "Wedding DJ", "Full reception coverage with MC coordination.", "₹35,000"],
     ["Settings", "Sound Systems", "Speakers, mics and mixing for any crowd size.", "₹15,000"],
     ["Sparkles", "Lighting & Effects", "LED, moving heads and fog effects.", "₹12,000"],
     ["Music", "Sangeet & Party DJ", "High-energy sets for pre-wedding functions.", "₹25,000"],
     ["Building2", "Corporate Sound", "Conferences, launches and award nights.", ""],
     ["Zap", "LED Walls", "Big screens for visuals and live feeds.", ""]],
    ["Check Your Date", "Tell us your event date and venue for availability and pricing."],
    { stats: [["400+", "Events performed"], ["10", "Years behind decks"], ["4.9", "Client rating"]] }
  ),
  "tent-house": serviceBusiness(
    "Everything Your Event Needs",
    "{name} supplies tents, shamianas, furniture and event equipment across {city}. One call covers your seating, staging and shelter needs.",
    [["Tent", "Shamianas & Tents", "Decorated and plain canopies for any guest count.", "₹15,000"],
     ["Users", "Chairs & Tables", "Comfortable seating with covers.", "₹40 / chair"],
     ["Sparkles", "Stage & Flooring", "Raised stages with carpet and backdrop.", "₹20,000"],
     ["Settings", "Lighting & Fans", "Functional and decorative lighting.", "₹8,000"],
     ["Truck", "Delivery & Setup", "Transport, installation and removal included.", "Free"],
     ["Building2", "Pandal Contracts", "Complete community and festival setups.", ""]],
    ["Get a Tent House Quote", "Tell us your guest count — we'll suggest what you need."],
    { stats: [["800+", "Events equipped"], ["20", "Years supplying"], ["4.7", "Customer rating"]] }
  ),
  florist: serviceBusiness(
    "Flowers for Every Moment",
    "{name} crafts fresh bouquets and floral arrangements in {city} — daily deliveries, wedding flowers and event decor with stems sourced every morning.",
    [["Flower", "Bouquets", "Hand-tied bouquets for every occasion.", "₹500"],
     ["Crown", "Wedding Flowers", "Bridal bouquets, garlands and venue florals.", ""],
     ["Sparkles", "Event Decor", "Floral installations for functions.", "₹10,000"],
     ["CalendarDays", "Subscription Boxes", "Weekly fresh flowers for home and office.", "₹1,500 / week"],
     ["Gift", "Gift Hampers", "Flowers with chocolates, cakes and gifts.", "₹1,200"],
     ["Clock", "Same-day Delivery", "Order by 4 PM for delivery today.", ""]],
    ["Send Flowers Today", "Order by 4 PM for same-day delivery across the city."],
    { stats: [["Daily", "Fresh stock"], ["Same-day", "Delivery"], ["4.8", "Customer rating"]] }
  ),
  "sweet-shop": foodBusiness(
    "Fresh Mithai, Made Daily",
    "{name} has been making sweets in {city} with pure ghee and no shortcuts. Fresh batches every morning and festival boxes worth gifting.",
    [
      ["Fresh Mithai", [
        ["Kaju Katli", "Pure cashew, thin and silver-leafed", "₹900 / kg", "Bestseller"],
        ["Motichoor Laddoo", "Soft, ghee-rich, melt in mouth", "₹480 / kg", ""],
        ["Mix Mithai Box", "Assorted sweets, your selection", "₹650 / kg", ""],
      ]],
      ["Festival Specials", [
        ["Diwali Gift Box", "Dry fruits and mithai, gift wrapped", "₹1,200", "Seasonal"],
        ["Modak", "Fresh ukadiche and steamed", "₹600 / dozen", ""],
        ["Gulab Jamun", "Warm, cardamom syrup", "₹420 / kg", ""],
      ]],
      ["Namkeen & Snacks", [
        ["Chivda & Mixture", "Fresh namkeen, made weekly", "₹320 / kg", ""],
        ["Kachori & Samosa", "Fried fresh through the day", "₹20 / piece", ""],
      ]],
    ],
    ["Order Fresh Sweets", "Call ahead for bulk and festival orders — we'll prepare fresh."]
  ),
  "tiffin-service": foodBusiness(
    "Home-cooked, Delivered Daily",
    "{name} delivers home-style tiffins across {city} — fresh, simple food cooked in a clean kitchen, the way you'd make it at home.",
    [
      ["Daily Tiffin", [
        ["Veg Thali Tiffin", "Roti, rice, dal, sabzi, salad", "₹90 / meal", "Bestseller"],
        ["Non-veg Tiffin", "Chicken or egg with roti and rice", "₹130 / meal", ""],
        ["Monthly Plan", "Two meals a day, 30 days", "₹4,500 / month", "Popular"],
      ]],
      ["Weekly Plans", [
        ["Lunch Only", "Office delivery, five days a week", "₹1,100 / week", ""],
        ["Dinner Only", "Delivered between 7 and 9 PM", "₹1,100 / week", ""],
        ["Both Meals", "Lunch and dinner, every day", "₹2,000 / week", ""],
      ]],
      ["Specials", [
        ["Diet Tiffin", "Low-oil, high-protein options", "₹120 / meal", ""],
        ["Sunday Special", "Biryani or pulao with dessert", "₹150 / meal", ""],
      ]],
    ],
    ["Start Your Tiffin Plan", "Tell us your area — we'll confirm delivery and menu."]
  ),
  "cloud-kitchen": foodBusiness(
    "Great Food, Delivery Only",
    "{name} runs a delivery-only kitchen serving {city} — no dine-in, which means all our attention goes into the food and the packaging.",
    [
      ["Bestsellers", [
        ["Paneer Butter Masala", "Rich tomato-cashew gravy", "₹260", "Bestseller"],
        ["Chicken Biryani", "Dum-cooked with raita", "₹320", "Bestseller"],
        ["Dal Tadka", "Smoky, ghee-finished", "₹190", ""],
      ]],
      ["Combos", [
        ["Thali Combo", "Roti, rice, dal, two sabzis", "₹220", "Value"],
        ["Rice Bowl", "Flavoured rice with toppings", "₹180", ""],
        ["Family Pack", "Serves four, four dishes", "₹780", ""],
      ]],
      ["Sides & Desserts", [
        ["Garlic Naan", "Tandoor-baked, buttered", "₹50", ""],
        ["Gulab Jamun", "Two pieces, warm syrup", "₹90", ""],
      ]],
    ],
    ["Order Now", "Find us on your delivery app or order directly on WhatsApp."]
  ),
  "food-truck": foodBusiness(
    "Street Food, Serious Flavour",
    "{name} serves street food from a truck across {city} — fresh, fast and full of flavour. Find us at our daily spot or book us for your event.",
    [
      ["Signatures", [
        ["Loaded Fries", "Cheese, peri-peri or schezwan", "₹150", "Bestseller"],
        ["Grilled Sandwich", "Triple-layer, cheese burst", "₹130", ""],
        ["Frankie Rolls", "Veg or paneer with chutney", "₹110", ""],
      ]],
      ["Combos", [
        ["Meal Combo", "Main plus fries and a drink", "₹220", "Value"],
        ["Sharing Platter", "Four items, serves two", "₹350", ""],
      ]],
      ["Drinks", [
        ["Cold Coffee", "Thick, chocolate-topped", "₹90", ""],
        ["Masala Lemonade", "Fresh, spiced, refreshing", "₹60", ""],
      ]],
    ],
    ["Find Us Today", "Check today's location on Instagram, or book us for your event."],
    { stats: [["4.8", "Google rating"], ["Daily", "Fresh menu"], ["Events", "Bookings open"]] }
  ),
  "pet-grooming": serviceBusiness(
    "Happy, Clean, Comfortable Pets",
    "{name} grooms pets across {city} with patience and zero restraint. Cats, dogs and small animals handled gently by people who genuinely like animals.",
    [["Scissors", "Full Grooming", "Bath, dry, haircut and nail trim.", "₹1,200"],
     ["Sparkles", "Bath & Dry", "Medicated or regular shampoo with blow dry.", "₹600"],
     ["Scissors", "Haircut & Styling", "Breed-specific or your preferred look.", "₹800"],
     ["PawPrint", "Nail & Paw Care", "Trimming, filing and paw balm.", "₹300"],
     ["ShieldCheck", "De-shedding Treatment", "Reduces loose fur dramatically.", "₹900"],
     ["Home", "Home Service", "Grooming at your doorstep.", "₹500 extra"]],
    ["Book a Grooming Slot", "Tell us your pet's breed and size — we'll quote and book."],
    { stats: [["1,500+", "Pets groomed"], ["Gentle", "Handling always"], ["4.9", "Pet parent rating"]] }
  ),
  "pet-boarding": serviceBusiness(
    "A Home Away From Home",
    "{name} boards pets across {city} in clean, spacious runs with constant supervision. Daily updates and photos, so you travel without worry.",
    [["Dog", "Overnight Boarding", "Individual runs with beds and toys.", "₹600 / night"],
     ["Clock", "Day Care", "Play, rest and feeding through the day.", "₹350 / day"],
     ["PawPrint", "Exercise & Walks", "Two supervised walks every day.", "Included"],
     ["ShieldCheck", "Vet on Call", "Immediate veterinary access if needed.", "Included"],
     ["Camera", "Daily Updates", "Photos and videos on WhatsApp.", "Included"],
     ["Users", "Long-term Stays", "Discounted monthly rates.", ""]],
    ["Book a Boarding Slot", "Tell us your dates — we'll check availability."],
    { stats: [["800+", "Pets boarded"], ["Vet", "On call"], ["4.9", "Pet parent rating"]] }
  ),
  "pet-training": serviceBusiness(
    "Better Behaviour, Happier Homes",
    "{name} trains dogs across {city} using positive reinforcement — no harsh methods. Basic obedience, leash manners and behaviour problem solving.",
    [["PawPrint", "Basic Obedience", "Sit, stay, come and leash walking.", "₹6,000"],
     ["Target", "Leash Manners", "Loose-leash walking without pulling.", "₹4,000"],
     ["ShieldCheck", "Behaviour Correction", "Barking, aggression and anxiety issues.", "₹8,000"],
     ["Home", "Puppy Training", "Toilet training and socialisation.", "₹5,000"],
     ["Users", "Home Training Sessions", "One-on-one at your home.", "₹1,200 / session"],
     ["Award", "Advanced Training", "Tricks, agility and guard training.", ""]],
    ["Book a Training Assessment", "Tell us the issue — we'll assess and suggest a plan."],
    { stats: [["400+", "Dogs trained"], ["Positive", "Methods only"], ["4.9", "Owner rating"]] }
  ),
  physiotherapy: {
    tagline: "Move Better, Live Better",
    about:
      "{name} helps people in {city} recover from pain and injury with hands-on physiotherapy and structured rehab. We explain your condition properly and set realistic recovery goals.",
    services: [
      ["Activity", "Back & Neck Pain", "Manual therapy and posture correction.", "₹600 / session"],
      ["HeartPulse", "Post-surgery Rehab", "Structured recovery after joint replacement.", "₹800 / session"],
      ["Dumbbell", "Sports Injury Rehab", "Return-to-sport strengthening programmes.", "₹700 / session"],
      ["Settings", "Neuro Physiotherapy", "Stroke and neurological rehabilitation.", "₹900 / session"],
      ["Baby", "Paediatric Physiotherapy", "Gentle developmental therapy for children.", "₹700 / session"],
      ["ShieldCheck", "Home Visits", "Treatment at your home when you can't travel.", "₹900 / session"],
    ],
    features: [
      ["Users", "Qualified Physiotherapists", "Registered professionals with clinical training."],
      ["Activity", "Hands-on Treatment", "Real manual therapy, not just machines."],
      ["Target", "Written Recovery Plan", "Clear goals and a home exercise programme."],
      ["Clock", "Flexible Appointments", "Early morning and evening slots available."],
    ],
    team: [
      ["Dr. Neha Kulkarni", "Chief Physiotherapist", "MPT with nine years of clinical practice."],
      ["Dr. Amit Rane", "Sports Physiotherapist", "Works with athletes on return-to-play."],
    ],
    testimonials: [
      ["Patient Name", "Back pain", "Two weeks of treatment for pain I'd had for a year."],
      ["Post-surgery Patient", "Knee rehab", "Walked properly again far sooner than expected."],
    ],
    faqs: [
      ["Do I need a doctor's referral?", "No — you can book directly. We'll refer you onward if we find something that needs a doctor."],
      ["How many sessions will I need?", "It depends on your condition. We'll give you an honest estimate after the first assessment."],
    ],
    stats: [["2,000+", "Patients treated"], ["9", "Years practising"], ["4.9", "Patient rating"]],
    hours: [["Monday – Saturday", "8:00 AM – 1:00 PM, 4:00 – 9:00 PM"]],
    cta: ["Book an Assessment", "Tell us your pain — we'll explain what's causing it."],
  },
  "eye-care": {
    tagline: "See Clearly, Look Good",
    about:
      "{name} offers complete eye care in {city} — precise eye tests, quality lenses and frames that suit your face and your budget.",
    services: [
      ["Eye", "Comprehensive Eye Test", "Vision, pressure and eye health check.", "₹300"],
      ["ScanLine", "Contact Lens Fitting", "Trial, training and aftercare guidance.", "₹500"],
      ["Settings", "Prescription Glasses", "Lenses fitted to your exact prescription.", "₹1,500"],
      ["Sun", "Sunglasses & Blue-cut", "UV protection and screen-strain lenses.", "₹1,200"],
      ["ShieldCheck", "Diabetic Eye Screening", "Retinal checks for diabetic patients.", "₹600"],
      ["Baby", "Children's Vision", "Friendly checks and myopia control.", "₹400"],
    ],
    features: [
      ["BadgeCheck", "Qualified Optometrist", "Registered practitioner on every test."],
      ["ScanLine", "Digital Testing", "Accurate prescriptions with modern equipment."],
      ["Clock", "Glasses in a Day", "Most single-vision glasses ready same day."],
      ["Wallet", "Honest Pricing", "Lens options explained with real price differences."],
    ],
    team: [["Optometrist Name", "Chief Optometrist", "Twelve years of clinical refraction experience."]],
    testimonials: [
      ["Patient Name", "New glasses", "Proper eye test after years, and the prescription is finally right."],
      ["Parent Name", "Child's check", "Patient with my nervous daughter. Very kind manner."],
    ],
    faqs: [
      ["How often should I test my eyes?", "Every one to two years, and annually after forty or if you have diabetes."],
      ["Do you make glasses the same day?", "Most single-vision lenses are fitted within a few hours."],
    ],
    stats: [["5,000+", "Eyes tested"], ["Same-day", "Most glasses"], ["4.8", "Patient rating"]],
    hours: [["Monday – Saturday", "10:00 AM – 8:30 PM"], ["Sunday", "10:00 AM – 2:00 PM"]],
    cta: ["Book an Eye Test", "Walk in or call ahead — tests take about twenty minutes."],
  },
  pharmacy: {
    tagline: "Your Medicines, Always in Stock",
    about:
      "{name} is a fully licensed pharmacy in {city} stocking genuine medicines at fair prices. We track your repeats and deliver to your door.",
    services: [
      ["Pill", "Prescription Medicines", "Genuine, batch-verified stock.", ""],
      ["Package", "Home Delivery", "Free delivery within our radius.", "Free"],
      ["ShieldCheck", "Generic Alternatives", "Cheaper options explained honestly.", ""],
      ["Baby", "Baby & Mother Care", "Formula, diapers and supplements.", ""],
      ["Settings", "Health Devices", "BP monitors, glucometers and nebulisers.", ""],
      ["CalendarDays", "Repeat Reminders", "We remind you before your medicine runs out.", "Free"],
    ],
    features: [
      ["BadgeCheck", "Licensed Pharmacy", "Fully registered with qualified pharmacists."],
      ["ShieldCheck", "Genuine Stock", "Sourced only from authorised distributors."],
      ["Clock", "Open Late", "Open till late for after-hours needs."],
      ["Wallet", "Fair Prices", "Generic alternatives offered where they exist."],
    ],
    team: [["Pharmacist Name", "Registered Pharmacist", "Available for advice on dosage and interactions."]],
    testimonials: [
      ["Regular Customer", "Monthly medicines", "They remember my repeat order and deliver on time."],
      ["Local Resident", "Late-night need", "Open when I needed them at 11 PM. Very grateful."],
    ],
    faqs: [
      ["Do you deliver?", "Yes — free home delivery within our area. Send a photo of your prescription on WhatsApp."],
      ["Can I get a cheaper alternative?", "We always tell you if a generic equivalent is available and how much it saves."],
    ],
    stats: [["Open till", "11 PM"], ["10,000+", "Items stocked"], ["4.9", "Customer rating"]],
    hours: [["Monday – Sunday", "8:00 AM – 11:00 PM"]],
    cta: ["Order Medicines", "WhatsApp your prescription — we'll confirm price and deliver."],
  },
  "home-tutor": eduBusiness(
    "Personal Attention, Real Progress",
    "{name} provides one-on-one home tuition across {city}. Lessons built around how your child actually learns, with honest feedback after every session.",
    [["BookOpen", "Maths & Science", "Classes VI to XII with concept clarity first.", "₹600 / hour"],
     ["GraduationCap", "Board Exam Prep", "Focused coaching for Class X and XII boards.", "₹700 / hour"],
     ["Settings", "English & Languages", "Grammar, writing and spoken confidence.", "₹500 / hour"],
     ["Target", "Competitive Exam Basics", "Foundation work for JEE and NEET aspirants.", "₹800 / hour"],
     ["BookOpen", "All Subjects (Junior)", "Classes I to V across all subjects.", "₹450 / hour"],
     ["Clock", "Doubt-clearing Sessions", "Targeted help before tests and exams.", "₹500 / hour"]],
    ["Book a Free Trial Class", "First session free — see the teaching before you commit."]
  ),
  "music-dance": eduBusiness(
    "Learn, Perform, Belong",
    "{name} teaches music and dance in {city} with proper technique and regular performance opportunities. All ages welcome, from complete beginners up.",
    [["Music", "Vocal Music", "Classical and light vocal training.", "₹2,000 / month"],
     ["Music", "Instrumental", "Guitar, keyboard, tabla and harmonium.", "₹2,500 / month"],
     ["Users", "Dance Classes", "Classical, folk and Bollywood styles.", "₹1,800 / month"],
     ["Award", "Grade Exams", "Preparation for recognised certifications.", "₹3,000 / month"],
     ["Camera", "Performance Training", "Stage presence and competition prep.", "₹2,500 / month"],
     ["Users", "Kids Batch", "Fun, structured introduction for young children.", "₹1,500 / month"]],
    ["Book a Free Trial Class", "Come try a class — instruments provided for the first session."],
    { stats: [["600+", "Students trained"], ["Annual", "Stage shows"], ["4.9", "Parent rating"]] }
  ),
  "driving-school": eduBusiness(
    "Confident Behind the Wheel",
    "{name} teaches driving in {city} with patient instructors and well-maintained training cars. Licence assistance handled from start to finish.",
    [["Car", "Four-wheeler Training", "Complete course with traffic and parking practice.", "₹5,000"],
     ["Bike", "Two-wheeler Training", "Geared and non-geared bike lessons.", "₹2,500"],
     ["ShieldCheck", "Licence Assistance", "Learner's and permanent licence paperwork.", "₹1,500"],
     ["Clock", "Refresher Course", "For licence holders who lack confidence.", "₹2,000"],
     ["Target", "Test Preparation", "Practice on the actual RTO test track.", "₹1,800"],
     ["Users", "Defensive Driving", "Advanced road-safety techniques.", ""]],
    ["Book Your First Lesson", "Tell us your location — we'll pick you up for the lesson."],
    { stats: [["3,000+", "Drivers trained"], ["RTO", "Track practice"], ["4.8", "Student rating"]] }
  ),
  "computer-training": eduBusiness(
    "Skills That Get You Hired",
    "{name} provides computer training in {city} — from absolute basics to accounting software and programming, with placement assistance.",
    [["Monitor", "Computer Basics", "Windows, Office, internet and email.", "₹4,000"],
     ["Briefcase", "Tally with GST", "Complete accounting package with practical work.", "₹8,000"],
     ["Settings", "Advanced Excel", "Formulas, pivot tables and dashboards.", "₹6,000"],
     ["Laptop", "Programming", "Python, web development and C.", "₹12,000"],
     ["Award", "Typing & Data Entry", "Speed building for government exams.", "₹3,000"],
     ["Target", "Graphic Design Basics", "Photoshop and CorelDRAW fundamentals.", "₹9,000"]],
    ["Enroll for a Free Demo", "Sit in on a class before you pay anything."],
    { stats: [["2,000+", "Students trained"], ["Placement", "Assistance"], ["4.8", "Student rating"]] }
  ),
  "language-institute": eduBusiness(
    "Speak With Confidence",
    "{name} teaches spoken English and foreign languages in {city} in small, conversation-focused batches. Grammar taught in context, not from a book alone.",
    [["Languages", "Spoken English", "Fluency, pronunciation and confidence.", "₹3,500 / month"],
     ["Languages", "German / French", "A1 to B1 level with certification prep.", "₹6,000 / month"],
     ["Languages", "Hindi & Marathi", "Reading, writing and speaking.", "₹3,000 / month"],
     ["Target", "IELTS / PTE Coaching", "Band-focused preparation with mock tests.", "₹12,000"],
     ["Briefcase", "Business English", "Emails, presentations and meetings.", "₹5,000 / month"],
     ["Users", "Kids Conversation", "Fun, activity-based classes for children.", "₹2,500 / month"]],
    ["Book a Free Demo Class", "Join a session and see how much you speak from day one."],
    { stats: [["1,500+", "Learners fluent"], ["Small", "Batches"], ["4.9", "Student rating"]] }
  ),
  "study-abroad": eduBusiness(
    "Your Degree, Anywhere in the World",
    "{name} guides students from {city} through the entire study-abroad journey — university selection, applications, visas and pre-departure prep.",
    [["Plane", "Country & Course Selection", "Shortlisting based on your profile and budget.", "₹5,000"],
     ["GraduationCap", "Application Support", "SOPs, LORs and documentation.", "₹15,000"],
     ["ShieldCheck", "Visa Processing", "Complete filing and interview preparation.", "₹20,000"],
     ["Wallet", "Scholarship Guidance", "Finding and applying for funding.", "₹5,000"],
     ["Briefcase", "Education Loans", "Bank liaison and documentation help.", "₹3,000"],
     ["Plane", "Pre-departure Briefing", "Accommodation, travel and settling in.", "Free"]],
    ["Book a Free Counselling Session", "Bring your marksheets — we'll map out your options."],
    { stats: [["1,000+", "Students placed"], ["15+", "Countries covered"], ["4.9", "Student rating"]] }
  ),
  "education-consultant": eduBusiness(
    "Right Course, Right College",
    "{name} advises students and parents in {city} on admissions and careers. Honest guidance based on your marks, interests and budget.",
    [["GraduationCap", "Career Counselling", "Aptitude-based guidance for stream and course.", "₹2,500"],
     ["BookOpen", "College Admissions", "India and abroad, end-to-end support.", "₹10,000"],
     ["Target", "Entrance Exam Strategy", "Which exams to attempt and how to prepare.", "₹3,000"],
     ["Briefcase", "Course & Branch Selection", "Understanding what each course actually leads to.", "₹2,000"],
     ["Wallet", "Education Loan Guidance", "Understanding options and eligibility.", "₹2,000"],
     ["Clock", "Admission Deadline Tracking", "We track dates so you never miss one.", "Free"]],
    ["Book a Counselling Session", "First consultation free — bring your report card."],
    { stats: [["800+", "Students guided"], ["Honest", "Advice only"], ["4.9", "Parent rating"]] }
  ),
  "digital-marketing": creativeAgency(
    "Growth You Can Measure",
    "{name} runs digital marketing for businesses in {city} — campaigns judged on leads and sales, not likes. We report numbers that actually matter to you.",
    [["TrendingUp", "SEO", "Rank for the searches your customers make.", "₹15,000 / month"],
     ["Megaphone", "Google & Meta Ads", "Paid campaigns managed and optimised weekly.", "₹12,000 / month"],
     ["AtSign", "Social Media Management", "Content calendar, posts and community replies.", "₹10,000 / month"],
     ["Video", "Video & Reels", "Short-form content produced for you.", "₹20,000 / month"],
     ["Settings", "Website & Landing Pages", "Fast pages built to convert traffic.", "₹25,000"],
     ["BadgeCheck", "Analytics & Reporting", "Clear monthly reporting on what worked.", "Included"]],
    ["Get a Free Marketing Audit", "We'll review your current presence and show what's fixable."]
  ),
  printing: serviceBusiness(
    "Printed Well, Every Time",
    "{name} handles printing and xerox work across {city} — visiting cards to banners, done quickly and priced fairly.",
    [["Printer", "Digital Printing", "Cards, flyers, brochures and booklets.", ""],
     ["Package", "Xerox & Lamination", "Black-and-white and colour copying.", "₹2 / page"],
     ["BookOpen", "Binding & Project Work", "Spiral, hard binding and thesis printing.", "₹80"],
     ["Package", "Custom Stationery", "Letterheads, envelopes and invoices.", ""],
     ["Crown", "Wedding & Event Cards", "Invitations with design and printing.", ""],
     ["Clock", "Express Service", "Urgent jobs finished the same day.", ""]],
    ["Send Your Print File", "WhatsApp your file — we'll quote and confirm timing."],
    { stats: [["20", "Years printing"], ["Same-day", "Most jobs"], ["4.8", "Customer rating"]] }
  ),
  signboard: creativeAgency(
    "Signs That Get You Noticed",
    "{name} designs and manufactures signboards across {city} — glow signs, ACP boards and flex printing built to survive the weather.",
    [["PanelTop", "Glow Sign Boards", "Illuminated boards with long-life LEDs.", "₹450 / sq.ft"],
     ["Building2", "ACP & Metal Boards", "Premium cladding and fabricated letters.", "₹900 / sq.ft"],
     ["Printer", "Flex & Vinyl Printing", "Large-format prints for any size.", "₹35 / sq.ft"],
     ["Settings", "Installation", "Safe fitting with structural support.", "₹3,000"],
     ["Zap", "LED Displays", "Programmable moving-message boards.", ""],
     ["ShieldCheck", "Maintenance & Repair", "Ongoing care for existing boards.", ""]],
    ["Get a Signboard Quote", "Send your shop front photo and text — we'll design free."]
  ),
  "graphic-design": creativeAgency(
    "Design That Sticks",
    "{name} is a design studio in {city} building brand identities that people remember. Logos, packaging and collateral crafted properly, not templated.",
    [["PenTool", "Logo & Brand Identity", "Logo, colours, type and usage guide.", "₹15,000"],
     ["Package", "Packaging Design", "Labels and boxes designed for shelves.", "₹12,000"],
     ["Palette", "Marketing Collateral", "Brochures, cards and social templates.", "₹8,000"],
     ["Settings", "Brand Guidelines", "A document so everything stays consistent.", "₹6,000"],
     ["Camera", "Product Photography Art Direction", "Planning shoots that show your product well.", "₹5,000"],
     ["Clock", "Design Retainer", "Ongoing design support each month.", "₹20,000 / month"]],
    ["Let's Design Your Brand", "Tell us about your business — we'll suggest a direction."]
  ),
  "video-production": creativeAgency(
    "Stories Worth Watching",
    "{name} produces films, ads and reels in {city} — from concept and scripting to shoot and edit. Content that holds attention past the first three seconds.",
    [["Clapperboard", "Brand Films", "Two to three minute company stories.", "₹60,000"],
     ["Video", "Social Media Reels", "Short-form content, shot in batches.", "₹8,000 / reel"],
     ["Camera", "Product Videography", "Clean product shots that convert.", "₹20,000"],
     ["Video", "Event Coverage", "Weddings, launches and conferences.", "₹35,000"],
     ["Settings", "Editing & Post", "Cut, colour, sound and subtitles.", "₹10,000"],
     ["Clapperboard", "Scripting & Concept", "Ideas and scripts written for you.", "₹5,000"]],
    ["Start Your Video Project", "Tell us the goal — we'll script, shoot and deliver."]
  ),
  "social-media": creativeAgency(
    "Feeds That Actually Grow",
    "{name} manages social media for brands in {city} — consistent content, real engagement and reporting on follower growth that means something.",
    [["AtSign", "Account Management", "Daily posting and community replies.", "₹12,000 / month"],
     ["Video", "Reels & Short Video", "Concept, shoot and edit, in batches.", "₹18,000 / month"],
     ["Palette", "Content Calendar", "Planned monthly, approved by you.", "Included"],
     ["Megaphone", "Influencer Coordination", "Finding and managing local creators.", "₹8,000"],
     ["TrendingUp", "Growth Strategy", "Hashtag, timing and format strategy.", "Included"],
     ["BadgeCheck", "Monthly Reporting", "Honest numbers on reach and growth.", "Included"]],
    ["Get a Free Account Review", "We'll audit your profiles and share what's holding growth back."]
  ),
  "security-service": serviceBusiness(
    "Trusted People, Trained Properly",
    "{name} provides trained security guards across {city} for homes, offices, events and industrial sites. Verified staff, proper uniforms and real supervision.",
    [["ShieldCheck", "Static Guards", "Trained, uniformed guards for your premises.", "₹18,000 / month"],
     ["Users", "Event Security", "Crowd management for functions and shows.", ""],
     ["Dumbbell", "Bouncers", "For venues that need a stronger presence.", "₹2,500 / day"],
     ["Building2", "Industrial Security", "Gate keeping and material checking.", ""],
     ["Monitor", "CCTV Monitoring", "Remote monitoring with response protocol.", ""],
     ["ShieldCheck", "Background Verification", "Every guard police-verified before posting.", "Included"]],
    ["Request Security Staff", "Tell us your site and hours — we'll send verified personnel."],
    { stats: [["200+", "Guards deployed"], ["Police", "Verified staff"], ["4.8", "Client rating"]] }
  ),
  "manpower-recruitment": serviceBusiness(
    "The Right People, Faster",
    "{name} recruits for businesses across {city} — from entry-level roles to mid-management. We shortlist properly, so you interview fewer, better candidates.",
    [["Users", "Bulk Hiring", "Volume recruitment for retail and operations.", "₹8,000 / hire"],
     ["Briefcase", "Specialist Roles", "Mid and senior-level search.", ""],
     ["Settings", "Payroll & Compliance", "PF, ESIC and payroll handled for you.", "₹300 / employee"],
     ["BadgeCheck", "Background Checks", "Verification before you hire.", "₹1,500"],
     ["Clock", "Temp Staffing", "Short-term staff at short notice.", ""],
     ["Target", "Campus Drives", "Organising placement drives at colleges.", ""]],
    ["Send Us Your Requirement", "Share the role and count — we'll start shortlisting."],
    { stats: [["1,500+", "Placements made"], ["30 Days", "Average turnaround"], ["4.8", "Client rating"]] }
  ),
  "construction-contractor": serviceBusiness(
    "Built to Last, Built on Time",
    "{name} takes on construction projects across {city} — residential, commercial and turnkey builds with proper drawings and a written schedule.",
    [["HardHat", "Turnkey Construction", "From foundation to handover, one contract.", ""],
     ["Building2", "Commercial Buildings", "Shops, offices and small industrial units.", ""],
     ["Hammer", "Residential Projects", "Bungalows, row houses and renovations.", ""],
     ["Ruler", "Architectural Coordination", "Working with your architect and engineer.", ""],
     ["ShieldCheck", "Quality Materials", "Verified material bills shared with you.", ""],
     ["Clock", "Written Timeline", "Milestone schedule agreed before we start.", ""]],
    ["Discuss Your Project", "Share your plot size and plan — we'll quote realistically."],
    { stats: [["100+", "Projects built"], ["20", "Years building"], ["4.8", "Client rating"]] }
  ),
  "civil-contractor": serviceBusiness(
    "Strong Foundations, Solid Finish",
    "{name} handles civil work across {city} — slabs, plaster, brickwork and finishing, done by a mason team that takes pride in straight lines.",
    [["Ruler", "RCC Slabs & Columns", "Shuttering, steel and concrete work.", "₹280 / sq.ft"],
     ["Hammer", "Brickwork & Plaster", "Walls built and finished smooth.", "₹60 / sq.ft"],
     ["Settings", "Flooring & Tiling", "Marble, granite and tile laying.", "₹45 / sq.ft"],
     ["Droplets", "Plumbing & Sanitary", "Concealed piping and fittings.", "₹25,000"],
     ["Zap", "Electrical Conduiting", "Piping and wiring as per drawing.", "₹20,000"],
     ["Paintbrush", "Finishing Work", "Putty, primer and final paint.", "₹18 / sq.ft"]],
    ["Get a Civil Work Quote", "Tell us the scope — we'll quote labour and material separately."],
    { stats: [["300+", "Sites completed"], ["Skilled", "Mason teams"], ["4.7", "Client rating"]] }
  ),
  courier: serviceBusiness(
    "Delivered, On Time, Every Time",
    "{name} moves parcels across {city} and nationwide — same-day local, next-day regional and reliable tracking on every single shipment.",
    [["Package", "Local Same-day", "Within the city in a few hours.", "₹60"],
     ["Truck", "National Courier", "Next-day to major cities.", "₹120"],
     ["Package", "Bulk & Business Parcels", "Daily pickup for shops and sellers.", ""],
     ["ShieldCheck", "Fragile Handling", "Packed and carried with proper care.", "₹100"],
     ["Plane", "Express Overnight", "Guaranteed next-morning delivery.", "₹250"],
     ["Clock", "Pickup Service", "We collect from your home or office.", "Free"]],
    ["Book a Pickup", "Tell us the pickup and drop — we'll collect today."],
    { stats: [["10,000+", "Parcels moved"], ["Same-day", "Local delivery"], ["4.8", "Customer rating"]] }
  ),
  "tour-operator": serviceBusiness(
    "Hassle-free Holidays",
    "{name} operates guided group tours from {city} — fixed departures, decent hotels and itineraries that don't exhaust you. Everything arranged before you leave.",
    [["Map", "Group Tours", "Fixed-departure packages with a tour manager.", "₹18,000"],
     ["Plane", "Pilgrimage Yatras", "Well-organised religious circuits.", "₹15,000"],
     ["Mountain", "Hill Station Packages", "Family-friendly mountain holidays.", "₹12,000"],
     ["Plane", "International Tours", "Visa, flights and stays arranged.", ""],
     ["Users", "Custom Group Bookings", "Itineraries built for your own group.", ""],
     ["ShieldCheck", "All-inclusive Pricing", "Stays, travel and sightseeing included.", ""]],
    ["See Our Upcoming Tours", "Ask for the departure list — seats fill before long weekends."],
    { stats: [["150+", "Tours operated"], ["2,000+", "Happy travellers"], ["4.8", "Traveller rating"]] }
  ),
};

/** Category id → content pack. Every category in data/categories.js is covered. */
export const AI_CONTENT_PACKS = {
  clinic: CLINIC,
  hospital: HOSPITAL,
  dental: DENTAL,
  salon: SALON,
  gym: GYM,
  fitness: FITNESS,
  cafe: CAFE,
  restaurant: RESTAURANT,
  hotel: HOTEL,
  bakery: BAKERY,
  coaching: COACHING,
  consultancy: CONSULTANCY,
  "real-estate": REAL_ESTATE,
  photography: PHOTOGRAPHY,
  travel: TRAVEL,
  automobile: AUTOMOBILE,
  spa: SPA,
  yoga: YOGA,
  beauty: BEAUTY,
  freelancer: FREELANCER,
  interior: INTERIOR,
  jewellery: JEWELLERY,
  ca: CA,
  architect: ARCHITECT,
  "ac-repair": AC_REPAIR,
  cleaning: CLEANING,
  laundry: LAUNDRY,
  event: EVENT,
  caterer: CATERER,
  nutritionist: NUTRITIONIST,
  makeup: MAKEUP,

  /* Added categories */
  ...ADDED_PACKS,
  other: OTHER,
};

export const getContentPack = (categoryId) => AI_CONTENT_PACKS[categoryId] || OTHER;

/* -------------------------------------------------------------------------- */
/*  Category imagery                                                          */
/*                                                                            */
/*  Categories that share a visual template (clinic / gym / cafe / salon /    */
/*  restaurant) inherit that template's photos. The professional template     */
/*  ships without imagery, so these categories bring their own — meaning      */
/*  every generated website arrives with a hero, an about image and a gallery.*/
/* -------------------------------------------------------------------------- */
const pxl = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

export const CATEGORY_IMAGES = {
  hotel: {
    hero: pxl(6758532),
    about: pxl(7821349),
    gallery: [pxl(6758531), pxl(15621208), pxl(14022362), pxl(7031581)],
  },
  coaching: {
    hero: pxl(8419210),
    about: pxl(18870256),
    gallery: [pxl(35745677), pxl(7396377), pxl(18870246), pxl(18870256)],
  },
  consultancy: {
    hero: pxl(20752572),
    about: pxl(5921552),
    gallery: [pxl(7413974), pxl(8124222), pxl(8815836), pxl(20752572)],
  },
  "real-estate": {
    hero: pxl(7031600),
    about: pxl(8482510),
    gallery: [pxl(7587470), pxl(7031581), pxl(7937748), pxl(8482510)],
  },
  photography: {
    hero: pxl(16135656),
    about: pxl(39164922),
    gallery: [pxl(16135635), pxl(16135648), pxl(7588025), pxl(39164922)],
  },
  travel: {
    hero: pxl(38017210),
    about: pxl(36899275),
    gallery: [pxl(37938667), pxl(10970025), pxl(38151912), pxl(36899275)],
  },
  automobile: {
    hero: pxl(33814734),
    about: pxl(4116170),
    gallery: [pxl(8985923), pxl(4480505), pxl(4116170), pxl(33814734)],
  },
  freelancer: {
    hero: pxl(7652541),
    about: pxl(12662809),
    gallery: [pxl(3640629), pxl(3987016), pxl(3847606), pxl(7652541)],
  },
  other: {
    hero: pxl(20752572),
    about: pxl(8815836),
    gallery: [pxl(5921552), pxl(8124222), pxl(7413974), pxl(20752572)],
  },

  /* Newly added categories */
  interior: {
    hero: pxl(6980724),
    about: pxl(13490221),
    gallery: [pxl(7195558), pxl(6296919), pxl(6489117), pxl(13490221)],
  },
  jewellery: {
    hero: pxl(28146843),
    about: pxl(3871582),
    gallery: [pxl(28146841), pxl(3641056), pxl(6098253), pxl(3871582)],
  },
  ca: {
    hero: pxl(8296970),
    about: pxl(7821914),
    gallery: [pxl(7680748), pxl(8296977), pxl(7680744), pxl(7821914)],
  },
  architect: {
    hero: pxl(9616959),
    about: pxl(8086373),
    gallery: [pxl(5583253), pxl(4458205), pxl(9618112), pxl(8086373)],
  },
  "ac-repair": {
    hero: pxl(7347538),
    about: pxl(33671149),
    gallery: [pxl(27134985), pxl(14522790), pxl(33925031), pxl(33671149)],
  },
  cleaning: {
    hero: pxl(6197121),
    about: pxl(7513163),
    gallery: [pxl(6197109), pxl(7513165), pxl(5591928), pxl(7513163)],
  },
  laundry: {
    hero: pxl(8774451),
    about: pxl(5901627),
    gallery: [pxl(4109759), pxl(5202801), pxl(29226682), pxl(5901627)],
  },
  event: {
    hero: pxl(34389342),
    about: pxl(33469001),
    gallery: [pxl(12584803), pxl(9965895), pxl(38380085), pxl(33469001)],
  },
  caterer: {
    hero: pxl(31405633),
    about: pxl(28736731),
    gallery: [pxl(33419113), pxl(16007538), pxl(28736727), pxl(28736731)],
  },
  nutritionist: {
    hero: pxl(20929210),
    about: pxl(5966438),
    gallery: [pxl(27969847), pxl(6740535), pxl(6740518), pxl(5966438)],
  },
  makeup: {
    hero: pxl(13933220),
    about: pxl(6954939),
    gallery: [pxl(7514849), pxl(8091883), pxl(7514865), pxl(6954939)],
  },

  /* ---- Added categories ---- */
  "car-detailing": {
    hero: pxl(7154634), about: pxl(4870702),
    gallery: [pxl(4870737), pxl(7154634), pxl(4870702), pxl(33814734)],
  },
  "bike-service": {
    hero: pxl(33814734), about: pxl(4116170),
    gallery: [pxl(8985923), pxl(4480505), pxl(7154634), pxl(33814734)],
  },
  "car-rental": { hero: pxl(27134985), about: pxl(8482510), gallery: [pxl(7031581), pxl(7587470), pxl(7937748), pxl(8482510)] },
  "bike-rental": { hero: pxl(8985923), about: pxl(4480505), gallery: [pxl(33814734), pxl(4116170), pxl(4870737), pxl(8985923)] },
  "mobile-repair": {
    hero: pxl(31862950), about: pxl(10963256),
    gallery: [pxl(31862953), pxl(31862950), pxl(10963256), pxl(31862953)],
  },
  "laptop-repair": {
    hero: pxl(3640629), about: pxl(3987016),
    gallery: [pxl(7652541), pxl(3847606), pxl(12662809), pxl(3640629)],
  },
  "appliance-repair": { hero: pxl(33671149), about: pxl(7347538), gallery: [pxl(27134985), pxl(14522790), pxl(33925031), pxl(33671149)] },
  "ro-service": { hero: pxl(38017210), about: pxl(36899275), gallery: [pxl(10970025), pxl(37938667), pxl(38151912), pxl(36899275)] },
  "pest-control": { hero: pxl(6197121), about: pxl(7513163), gallery: [pxl(6197109), pxl(7513165), pxl(5591928), pxl(7513163)] },
  "packers-movers": {
    hero: pxl(7203849), about: pxl(4506272),
    gallery: [pxl(4246269), pxl(7203849), pxl(4506272), pxl(4246269)],
  },
  waterproofing: { hero: pxl(6296919), about: pxl(6489117), gallery: [pxl(6980724), pxl(7195558), pxl(13490221), pxl(6296919)] },
  "home-renovation": { hero: pxl(15406034), about: pxl(6082416), gallery: [pxl(38867950), pxl(15406034), pxl(6082416), pxl(38867950)] },
  "modular-kitchen": { hero: pxl(6980724), about: pxl(7195558), gallery: [pxl(6296919), pxl(6489117), pxl(13490221), pxl(6980724)] },
  "furniture-shop": { hero: pxl(7195558), about: pxl(13490221), gallery: [pxl(6980724), pxl(6296919), pxl(6489117), pxl(13490221)] },
  "tiles-sanitary": { hero: pxl(6489117), about: pxl(6980724), gallery: [pxl(7195558), pxl(6296919), pxl(13490221), pxl(6489117)] },
  "hardware-shop": { hero: pxl(6082416), about: pxl(15406034), gallery: [pxl(38867950), pxl(6082416), pxl(15406034), pxl(33814734)] },
  "paint-dealer": { hero: pxl(13490221), about: pxl(6296919), gallery: [pxl(6980724), pxl(7195558), pxl(6489117), pxl(13490221)] },
  "solar-installation": {
    hero: pxl(11645008), about: pxl(38171120),
    gallery: [pxl(17965455), pxl(11645008), pxl(38171120), pxl(17965455)],
  },
  gardening: { hero: pxl(7031581), about: pxl(7031600), gallery: [pxl(7587470), pxl(10970025), pxl(7031581), pxl(7031600)] },
  "water-supplier": { hero: pxl(38017210), about: pxl(36899275), gallery: [pxl(10970025), pxl(37938667), pxl(38151912), pxl(38017210)] },
  "wedding-decoration": {
    hero: pxl(30190562), about: pxl(34389342),
    gallery: [pxl(12584803), pxl(9965895), pxl(38380085), pxl(30190562)],
  },
  "mandap-decoration": { hero: pxl(33469001), about: pxl(34389342), gallery: [pxl(12584803), pxl(9965895), pxl(38380085), pxl(33469001)] },
  "dj-sound": { hero: pxl(38380085), about: pxl(33469001), gallery: [pxl(34389342), pxl(12584803), pxl(9965895), pxl(38380085)] },
  "tent-house": { hero: pxl(12584803), about: pxl(9965895), gallery: [pxl(34389342), pxl(38380085), pxl(33469001), pxl(12584803)] },
  florist: {
    hero: pxl(17034946), about: pxl(30191049),
    gallery: [pxl(30190562), pxl(17034946), pxl(30191049), pxl(30190562)],
  },
  "sweet-shop": {
    hero: pxl(19151502), about: pxl(8819771),
    gallery: [pxl(8819843), pxl(19151502), pxl(8819771), pxl(8819843)],
  },
  "tiffin-service": { hero: pxl(31405633), about: pxl(33419113), gallery: [pxl(16007538), pxl(28736727), pxl(28736731), pxl(33419113)] },
  "cloud-kitchen": { hero: pxl(28736731), about: pxl(31405633), gallery: [pxl(33419113), pxl(16007538), pxl(28736727), pxl(28736731)] },
  "food-truck": { hero: pxl(16007538), about: pxl(28736727), gallery: [pxl(33419113), pxl(31405633), pxl(28736731), pxl(16007538)] },
  "pet-grooming": {
    hero: pxl(19145874), about: pxl(19145895),
    gallery: [pxl(19145883), pxl(19145874), pxl(19145895), pxl(19145883)],
  },
  "pet-boarding": { hero: pxl(19145883), about: pxl(19145874), gallery: [pxl(19145895), pxl(19145883), pxl(19145874), pxl(19145895)] },
  "pet-training": { hero: pxl(19145895), about: pxl(19145883), gallery: [pxl(19145874), pxl(19145895), pxl(19145883), pxl(19145874)] },
  physiotherapy: { hero: pxl(4269265), about: pxl(7800666), gallery: [pxl(5355863), pxl(4269268), pxl(3845729), pxl(4269265)] },
  "eye-care": { hero: pxl(33799456), about: pxl(33680700), gallery: [pxl(7717254), pxl(38740728), pxl(6497114), pxl(33799456)] },
  pharmacy: { hero: pxl(8296970), about: pxl(7821914), gallery: [pxl(7680748), pxl(8296977), pxl(7680744), pxl(7821914)] },
  "home-tutor": { hero: pxl(8419210), about: pxl(18870256), gallery: [pxl(35745677), pxl(7396377), pxl(18870246), pxl(8419210)] },
  "music-dance": { hero: pxl(38380085), about: pxl(12584803), gallery: [pxl(34389342), pxl(9965895), pxl(33469001), pxl(38380085)] },
  "driving-school": { hero: pxl(27134985), about: pxl(7347538), gallery: [pxl(8482510), pxl(7031581), pxl(7587470), pxl(27134985)] },
  "computer-training": { hero: pxl(3640629), about: pxl(7652541), gallery: [pxl(3987016), pxl(3847606), pxl(12662809), pxl(3640629)] },
  "language-institute": { hero: pxl(8419210), about: pxl(35745677), gallery: [pxl(18870256), pxl(7396377), pxl(18870246), pxl(35745677)] },
  "study-abroad": { hero: pxl(38017210), about: pxl(36899275), gallery: [pxl(10970025), pxl(38151912), pxl(37938667), pxl(38017210)] },
  "education-consultant": { hero: pxl(20752572), about: pxl(5921552), gallery: [pxl(7413974), pxl(8124222), pxl(8815836), pxl(20752572)] },
  "digital-marketing": { hero: pxl(20752572), about: pxl(5921552), gallery: [pxl(8124222), pxl(8815836), pxl(7413974), pxl(20752572)] },
  printing: { hero: pxl(8124222), about: pxl(7413974), gallery: [pxl(7821914), pxl(7680744), pxl(7680748), pxl(8124222)] },
  signboard: { hero: pxl(8815836), about: pxl(20752572), gallery: [pxl(5921552), pxl(8124222), pxl(7413974), pxl(8815836)] },
  "graphic-design": { hero: pxl(7514865), about: pxl(13933220), gallery: [pxl(7514849), pxl(8091883), pxl(6954939), pxl(7514865)] },
  "video-production": { hero: pxl(16135656), about: pxl(39164922), gallery: [pxl(16135635), pxl(16135648), pxl(7588025), pxl(39164922)] },
  "social-media": { hero: pxl(13933220), about: pxl(7514865), gallery: [pxl(6954939), pxl(7514849), pxl(8091883), pxl(13933220)] },
  "security-service": { hero: pxl(15406034), about: pxl(38867950), gallery: [pxl(6082416), pxl(15406034), pxl(38867950), pxl(6082416)] },
  "manpower-recruitment": { hero: pxl(20752572), about: pxl(5921552), gallery: [pxl(7413974), pxl(8815836), pxl(8124222), pxl(20752572)] },
  "construction-contractor": {
    hero: pxl(15406034), about: pxl(6082416),
    gallery: [pxl(38867950), pxl(15406034), pxl(6082416), pxl(38867950)],
  },
  "civil-contractor": { hero: pxl(6082416), about: pxl(38867950), gallery: [pxl(15406034), pxl(6082416), pxl(38867950), pxl(15406034)] },
  courier: { hero: pxl(7203849), about: pxl(4506272), gallery: [pxl(4246269), pxl(7203849), pxl(4506272), pxl(4246269)] },
  "tour-operator": { hero: pxl(38017210), about: pxl(36899275), gallery: [pxl(10970025), pxl(38151912), pxl(37938667), pxl(38017210)] },
};

export const getCategoryImages = (categoryId) => CATEGORY_IMAGES[categoryId] || null;
