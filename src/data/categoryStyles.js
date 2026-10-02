/**
 * Per-category visual identities.
 *
 * Template families (registry.js) decide WHICH sections a website renders.
 * These styles decide HOW it looks — palette, type, corner radius, button
 * shape and every section variant. They are merged over the family, so all
 * 32 categories get a genuinely distinct design while sharing one engine.
 *
 * Only the visual keys are allowed here — never `sections` or `sample`, which
 * stay owned by the family.
 */

const f = {
  inter: "'Inter', sans-serif",
  jakarta: "'Plus Jakarta Sans', sans-serif",
  grotesk: "'Space Grotesk', sans-serif",
  oswald: "'Oswald', sans-serif",
  bebas: "'Bebas Neue', sans-serif",
  fraunces: "'Fraunces', Georgia, serif",
  cormorant: "'Cormorant Garamond', Georgia, serif",
  playfair: "'Playfair Display', Georgia, serif",
  baskerville: "'Libre Baskerville', Georgia, serif",
  marcellus: "'Marcellus', Georgia, serif",
  manrope: "'Manrope', sans-serif",
  sora: "'Sora', sans-serif",
  poppins: "'Poppins', sans-serif",
  rubik: "'Rubik', sans-serif",
  dm: "'DM Sans', sans-serif",
  josefin: "'Josefin Sans', sans-serif",
  quicksand: "'Quicksand', sans-serif",
  outfit: "'Outfit', sans-serif",
};

/** Compact heading preset. */
const H = (weight, spacing = "-0.02em", transform = "none") => ({ weight, spacing, transform });
const UPPER = (weight = 600, spacing = "0.04em") => ({ weight, spacing, transform: "uppercase" });
const KICK = (spacing, weight = 600) => ({ transform: "uppercase", spacing, style: "normal", weight });

/* Shortcut builders for common visual "moods". */
const light = (primary, accent, extra = {}) => ({
  scheme: "light",
  theme: { primary, accent, bg: "#FFFFFF", card: "#FFFFFF", ink: "#14161A", muted: "#5E6672", line: "#E7EAEE", ...extra },
});
const tinted = (primary, accent, bg, card, ink, muted, line) => ({
  scheme: "warm",
  theme: { primary, accent, bg, card, ink, muted, line },
});
const dark = (primary, accent, bg, card, ink, muted, line, scheme = "dark") => ({
  scheme,
  theme: { primary, accent, bg, card, ink, muted, line },
});

/* ------------------------------------------------------------------ */
/*  Health family                                                      */
/* ------------------------------------------------------------------ */
const clinic = {
  ...light("#0E7490", "#14B8A6", { bg: "#F6FAFB" }),
  fonts: { display: f.jakarta, body: f.inter },
  heading: H(800), kicker: KICK("0.18em", 700), radius: "1.5rem", button: "pill",
  navVariant: "floating", heroVariant: "split", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const hospital = {
  ...light("#15417E", "#C0392B", { bg: "#F7F9FC", line: "#E2E8F2" }),
  fonts: { display: f.manrope, body: f.inter },
  heading: H(700, "-0.015em"), kicker: KICK("0.2em", 700), radius: "0.5rem", button: "sharp",
  navVariant: "bar", heroVariant: "full", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const dental = {
  ...tinted("#0BA5A5", "#7C3AED", "#F2FBFC", "#FFFFFF", "#0E2C33", "#5C7A80", "#D8EEF0"),
  fonts: { display: f.sora, body: f.dm },
  heading: H(700), kicker: KICK("0.22em", 700), radius: "2rem", button: "pill",
  navVariant: "floating", heroVariant: "center", servicesVariant: "cards",
  teamVariant: "circle", galleryVariant: "grid", testimonialsVariant: "spotlight",
};

/* ------------------------------------------------------------------ */
/*  Fitness family                                                     */
/* ------------------------------------------------------------------ */
const gym = {
  ...dark("#D8FF3E", "#FF5A1F", "#0B0B0D", "#141417", "#F4F4F2", "#9C9CA3", "#242429"),
  fonts: { display: f.oswald, body: f.inter },
  heading: UPPER(600, "0.01em"), kicker: KICK("0.3em", 600), radius: "0.6rem", button: "sharp",
  navVariant: "bar", heroVariant: "full", servicesVariant: "tiles",
  teamVariant: "dark", galleryVariant: "masonry", testimonialsVariant: "cards",
};
const fitness = {
  ...dark("#FF4D4D", "#FFB020", "#101014", "#1A1A20", "#FAFAFA", "#A0A0AA", "#282830"),
  fonts: { display: f.bebas, body: f.rubik },
  heading: UPPER(400, "0.03em"), kicker: KICK("0.34em", 600), radius: "0.4rem", button: "sharp",
  navVariant: "bar", heroVariant: "full", servicesVariant: "tiles",
  teamVariant: "dark", galleryVariant: "masonry", testimonialsVariant: "cards",
};
const yoga = {
  ...tinted("#5B7C6D", "#C9A227", "#F7F5F0", "#FFFFFF", "#25302A", "#6E7B72", "#E6E2D8"),
  fonts: { display: f.cormorant, body: f.dm },
  heading: H(600, "0.01em"), kicker: KICK("0.3em", 500), radius: "2.25rem", button: "pill",
  navVariant: "floating", heroVariant: "center", servicesVariant: "cards",
  teamVariant: "arch", galleryVariant: "grid", testimonialsVariant: "spotlight",
};

/* ------------------------------------------------------------------ */
/*  Food family                                                        */
/* ------------------------------------------------------------------ */
const cafe = {
  ...tinted("#7C4A2D", "#C98F52", "#FAF4EA", "#FFFDF8", "#2E211A", "#8A7568", "#EADFD0"),
  fonts: { display: f.fraunces, body: f.inter },
  heading: H(600, "-0.01em"), kicker: KICK("0.26em", 600), radius: "1.75rem", button: "pill",
  navVariant: "floating", heroVariant: "center", servicesVariant: "cards",
  teamVariant: "circle", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const bakery = {
  ...tinted("#C0567A", "#E8A33D", "#FFF6F8", "#FFFFFF", "#3B1F2B", "#8A6B77", "#F4DFE6"),
  fonts: { display: f.josefin, body: f.quicksand },
  heading: H(600, "0em"), kicker: KICK("0.24em", 600), radius: "2.5rem", button: "pill",
  navVariant: "floating", heroVariant: "center", servicesVariant: "cards",
  teamVariant: "circle", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const restaurant = {
  ...dark("#E0A526", "#C4492E", "#131110", "#1C1917", "#F1EAE0", "#A79C8D", "#2A2622", "dark-elegant"),
  fonts: { display: f.playfair, body: f.inter },
  heading: H(700, "0em"), kicker: KICK("0.3em", 500), radius: "1rem", button: "soft",
  navVariant: "bar", heroVariant: "full", servicesVariant: "cards",
  teamVariant: "circle", galleryVariant: "grid", testimonialsVariant: "spotlight",
};

/* ------------------------------------------------------------------ */
/*  Beauty family                                                      */
/* ------------------------------------------------------------------ */
const salon = {
  ...tinted("#B76E79", "#D9A5A0", "#FBF4F2", "#FFFFFF", "#211513", "#8A6F6A", "#F0DEDA"),
  fonts: { display: f.cormorant, body: f.inter },
  heading: H(600, "0.01em"), kicker: KICK("0.32em", 500), radius: "2rem", button: "pill",
  navVariant: "floating", heroVariant: "center", servicesVariant: "rows",
  teamVariant: "arch", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const spa = {
  ...tinted("#3E6B5A", "#A8BFA0", "#F4F7F3", "#FFFFFF", "#1E2A24", "#67786F", "#E1EAE2"),
  fonts: { display: f.marcellus, body: f.dm },
  heading: H(400, "0.02em"), kicker: KICK("0.3em", 500), radius: "2.5rem", button: "pill",
  navVariant: "floating", heroVariant: "center", servicesVariant: "rows",
  teamVariant: "arch", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const beauty = {
  ...tinted("#DB2777", "#F472B6", "#FFF5FA", "#FFFFFF", "#3B0F26", "#8B5A72", "#FBDCEA"),
  fonts: { display: f.poppins, body: f.dm },
  heading: H(700, "-0.01em"), kicker: KICK("0.2em", 700), radius: "1.75rem", button: "pill",
  navVariant: "floating", heroVariant: "split", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};

/* ------------------------------------------------------------------ */
/*  Professional family                                                */
/* ------------------------------------------------------------------ */
const hotel = {
  ...dark("#C8A75A", "#8C6D2F", "#1B1A22", "#25242C", "#F5F1E8", "#A9A29A", "#34333B", "dark-elegant"),
  fonts: { display: f.playfair, body: f.inter },
  heading: H(700, "0em"), kicker: KICK("0.3em", 500), radius: "0.25rem", button: "sharp",
  navVariant: "bar", heroVariant: "full", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const coaching = {
  ...light("#1D4ED8", "#F97316", { bg: "#F5F8FF", line: "#E0E8F7" }),
  fonts: { display: f.poppins, body: f.inter },
  heading: H(700, "-0.015em"), kicker: KICK("0.16em", 700), radius: "1rem", button: "soft",
  navVariant: "floating", heroVariant: "split", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const consultancy = {
  ...light("#334155", "#2563EB", { bg: "#F8FAFC", line: "#E2E8F0" }),
  fonts: { display: f.grotesk, body: f.inter },
  heading: H(700, "-0.02em"), kicker: KICK("0.2em", 600), radius: "0.75rem", button: "soft",
  navVariant: "floating", heroVariant: "split", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const realEstate = {
  ...tinted("#0F3D3E", "#B08D57", "#F7F8F7", "#FFFFFF", "#16211F", "#5E6C69", "#E3E8E5"),
  fonts: { display: f.marcellus, body: f.manrope },
  heading: H(400, "0.01em"), kicker: KICK("0.26em", 600), radius: "0.5rem", button: "soft",
  navVariant: "bar", heroVariant: "full", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const photography = {
  ...dark("#FFFFFF", "#E11D48", "#0A0A0A", "#131313", "#FAFAFA", "#8E8E8E", "#262626"),
  fonts: { display: f.manrope, body: f.inter },
  heading: H(800, "-0.03em"), kicker: KICK("0.36em", 500), radius: "0", button: "sharp",
  navVariant: "bar", heroVariant: "full", servicesVariant: "tiles",
  teamVariant: "dark", galleryVariant: "masonry", testimonialsVariant: "cards",
};
const travel = {
  ...tinted("#0369A1", "#FB923C", "#F2F9FD", "#FFFFFF", "#0C2434", "#5B7484", "#DCEBF4"),
  fonts: { display: f.outfit, body: f.dm },
  heading: H(700, "-0.02em"), kicker: KICK("0.2em", 700), radius: "1.5rem", button: "pill",
  navVariant: "floating", heroVariant: "full", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "masonry", testimonialsVariant: "cards",
};
const automobile = {
  ...dark("#F97316", "#EF4444", "#121316", "#1B1D21", "#F5F5F4", "#9A9CA3", "#2A2D33"),
  fonts: { display: f.rubik, body: f.inter },
  heading: UPPER(700, "0.02em"), kicker: KICK("0.24em", 700), radius: "0.5rem", button: "sharp",
  navVariant: "bar", heroVariant: "full", servicesVariant: "tiles",
  teamVariant: "dark", galleryVariant: "grid", testimonialsVariant: "cards",
};
const freelancer = {
  ...tinted("#7C3AED", "#06B6D4", "#FBFAFF", "#FFFFFF", "#1C1533", "#6A6486", "#EBE6FA"),
  fonts: { display: f.sora, body: f.dm },
  heading: H(700, "-0.025em"), kicker: KICK("0.18em", 700), radius: "1.75rem", button: "pill",
  navVariant: "floating", heroVariant: "split", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "masonry", testimonialsVariant: "spotlight",
};
const interior = {
  ...tinted("#A85832", "#6B705C", "#FAF7F2", "#FFFFFF", "#2B211B", "#7C716A", "#EBE4DA"),
  fonts: { display: f.baskerville, body: f.inter },
  heading: H(700, "0em"), kicker: KICK("0.28em", 500), radius: "0", button: "sharp",
  navVariant: "bar", heroVariant: "full", servicesVariant: "rows",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const jewellery = {
  ...dark("#E5C07B", "#F5E6C8", "#16141A", "#201E25", "#F8F4EC", "#A79E92", "#332F38", "dark-elegant"),
  fonts: { display: f.cormorant, body: f.josefin },
  heading: H(600, "0.04em"), kicker: KICK("0.4em", 500), radius: "0", button: "sharp",
  navVariant: "bar", heroVariant: "full", servicesVariant: "cards",
  teamVariant: "circle", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const charteredAccountant = {
  ...light("#1E3A5F", "#0E7490", { bg: "#F7F9FB", line: "#E4EAF0" }),
  fonts: { display: f.manrope, body: f.inter },
  heading: H(700, "-0.01em"), kicker: KICK("0.18em", 700), radius: "0.5rem", button: "soft",
  navVariant: "floating", heroVariant: "split", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const architect = {
  ...light("#111827", "#F59E0B", { bg: "#F5F5F4", card: "#FFFFFF", line: "#E5E5E4" }),
  fonts: { display: f.grotesk, body: f.inter },
  heading: UPPER(700, "0.06em"), kicker: KICK("0.32em", 600), radius: "0", button: "sharp",
  navVariant: "bar", heroVariant: "full", servicesVariant: "tiles",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const acRepair = {
  ...tinted("#0284C7", "#38BDF8", "#F4FBFF", "#FFFFFF", "#0B2434", "#5A7484", "#DCEFF9"),
  fonts: { display: f.rubik, body: f.dm },
  heading: H(700, "-0.02em"), kicker: KICK("0.14em", 700), radius: "1rem", button: "soft",
  navVariant: "floating", heroVariant: "split", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const cleaning = {
  ...tinted("#0891B2", "#22D3EE", "#F3FCFE", "#FFFFFF", "#0E2A33", "#5B7780", "#DCF1F6"),
  fonts: { display: f.dm, body: f.inter },
  heading: H(700, "-0.02em"), kicker: KICK("0.2em", 700), radius: "1.5rem", button: "pill",
  navVariant: "floating", heroVariant: "split", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const laundry = {
  ...tinted("#4F46E5", "#818CF8", "#F7F8FF", "#FFFFFF", "#1B1B33", "#66668A", "#E4E6F8"),
  fonts: { display: f.quicksand, body: f.dm },
  heading: H(700, "-0.01em"), kicker: KICK("0.18em", 700), radius: "2rem", button: "pill",
  navVariant: "floating", heroVariant: "center", servicesVariant: "cards",
  teamVariant: "circle", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const eventPlanner = {
  ...tinted("#7E22CE", "#EC4899", "#FDF7FF", "#FFFFFF", "#2A0F3D", "#7A5E8C", "#F0E1F8"),
  fonts: { display: f.sora, body: f.poppins },
  heading: H(700, "-0.025em"), kicker: KICK("0.22em", 700), radius: "2rem", button: "pill",
  navVariant: "floating", heroVariant: "full", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "masonry", testimonialsVariant: "spotlight",
};
const caterer = {
  ...tinted("#B45309", "#DC2626", "#FFFDF6", "#FFFFFF", "#331F0B", "#87694C", "#F3E6D3"),
  fonts: { display: f.fraunces, body: f.manrope },
  heading: H(700, "-0.01em"), kicker: KICK("0.24em", 700), radius: "1.25rem", button: "soft",
  navVariant: "bar", heroVariant: "full", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const nutritionist = {
  ...tinted("#3F8F4F", "#84CC16", "#F6FBF4", "#FFFFFF", "#1B2E1E", "#5F7A63", "#DFEEDD"),
  fonts: { display: f.dm, body: f.inter },
  heading: H(700, "-0.02em"), kicker: KICK("0.18em", 700), radius: "1.75rem", button: "pill",
  navVariant: "floating", heroVariant: "split", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const makeupArtist = {
  ...tinted("#9D174D", "#F9A8D4", "#FFF8FB", "#FFFFFF", "#340B21", "#8A5A6E", "#F7DEE9"),
  fonts: { display: f.cormorant, body: f.poppins },
  heading: H(600, "0.02em"), kicker: KICK("0.34em", 500), radius: "2.25rem", button: "pill",
  navVariant: "floating", heroVariant: "center", servicesVariant: "rows",
  teamVariant: "arch", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const other = {
  ...light("#4F46E5", "#F59E0B", { bg: "#F8FAFC", line: "#E2E8F0" }),
  fonts: { display: f.grotesk, body: f.inter },
  heading: H(700, "-0.02em"), kicker: KICK("0.2em", 600), radius: "1.25rem", button: "soft",
  navVariant: "floating", heroVariant: "split", servicesVariant: "cards",
  teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};

/* ------------------------------------------------------------------ */
/*  Added business categories — each still visually distinct           */
/* ------------------------------------------------------------------ */
const carDetailing = {
  ...dark("#38BDF8", "#F43F5E", "#0C1017", "#151B24", "#F1F5F9", "#93A1B0", "#243040"),
  fonts: { display: f.rubik, body: f.inter }, heading: UPPER(700, "0.02em"), kicker: KICK("0.22em", 700),
  radius: "0.75rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "dark", galleryVariant: "masonry", testimonialsVariant: "cards",
};
const bikeService = {
  ...dark("#FB923C", "#FACC15", "#131316", "#1C1D22", "#FAFAF9", "#9EA0A8", "#2B2D34"),
  fonts: { display: f.bebas, body: f.rubik }, heading: UPPER(400, "0.03em"), kicker: KICK("0.32em", 600),
  radius: "0.4rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "dark", galleryVariant: "grid", testimonialsVariant: "cards",
};
const carRental = {
  ...tinted("#1E40AF", "#F59E0B", "#F6F8FD", "#FFFFFF", "#111A33", "#5B6780", "#E1E7F4"),
  fonts: { display: f.outfit, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.18em", 700),
  radius: "1.25rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const bikeRental = {
  ...tinted("#16A34A", "#0EA5E9", "#F4FBF6", "#FFFFFF", "#0E2A1B", "#5C7A69", "#DCEFE3"),
  fonts: { display: f.poppins, body: f.dm }, heading: H(700, "-0.015em"), kicker: KICK("0.2em", 700),
  radius: "1.75rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "cards", teamVariant: "circle", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const mobileRepair = {
  ...tinted("#4338CA", "#06B6D4", "#F8F8FF", "#FFFFFF", "#191735", "#66668A", "#E7E6F8"),
  fonts: { display: f.sora, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.16em", 700),
  radius: "0.75rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const laptopRepair = {
  ...tinted("#0F766E", "#6366F1", "#F4FBFA", "#FFFFFF", "#0E2A28", "#5A7A77", "#D8F0ED"),
  fonts: { display: f.manrope, body: f.inter }, heading: H(700, "-0.015em"), kicker: KICK("0.18em", 700),
  radius: "1rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const applianceRepair = {
  ...tinted("#EA580C", "#0891B2", "#FFF9F5", "#FFFFFF", "#33200F", "#8A6F5C", "#F6E3D6"),
  fonts: { display: f.rubik, body: f.dm }, heading: H(700, "-0.02em"), kicker: KICK("0.2em", 700),
  radius: "1rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const roService = {
  ...tinted("#0369A1", "#67E8F9", "#F2FAFE", "#FFFFFF", "#0B2434", "#5A7484", "#DBF0F9"),
  fonts: { display: f.dm, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.2em", 700),
  radius: "2rem", button: "pill", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const pestControl = {
  ...tinted("#4D7C0F", "#FACC15", "#F9FBF2", "#FFFFFF", "#24310D", "#6E7A57", "#E8F0D8"),
  fonts: { display: f.poppins, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.18em", 700),
  radius: "0.5rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const packersMovers = {
  ...tinted("#B45309", "#1D4ED8", "#FFF9F2", "#FFFFFF", "#33210C", "#8A7157", "#F6E6D2"),
  fonts: { display: f.outfit, body: f.inter }, heading: H(800, "-0.025em"), kicker: KICK("0.16em", 700),
  radius: "0.5rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const waterproofing = {
  ...tinted("#155E75", "#22D3EE", "#F3FAFC", "#FFFFFF", "#0E2B33", "#5A7480", "#DCEEF4"),
  fonts: { display: f.grotesk, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.2em", 700),
  radius: "0.5rem", button: "sharp", navVariant: "bar", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const homeRenovation = {
  ...tinted("#92400E", "#65A30D", "#FBF9F4", "#FFFFFF", "#2E230F", "#7E745F", "#EFE7D6"),
  fonts: { display: f.baskerville, body: f.inter }, heading: H(700, "0em"), kicker: KICK("0.26em", 500),
  radius: "0", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "rows", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const modularKitchen = {
  ...tinted("#334155", "#0EA5E9", "#F7F9FB", "#FFFFFF", "#141C2B", "#5D6B7D", "#E2E8F0"),
  fonts: { display: f.marcellus, body: f.manrope }, heading: H(400, "0.02em"), kicker: KICK("0.28em", 600),
  radius: "0.5rem", button: "soft", navVariant: "bar", heroVariant: "full",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const furnitureShop = {
  ...tinted("#78350F", "#D97706", "#FBF7F2", "#FFFFFF", "#2B1D10", "#7E6E5C", "#EDE2D4"),
  fonts: { display: f.fraunces, body: f.inter }, heading: H(600, "-0.01em"), kicker: KICK("0.24em", 600),
  radius: "0.25rem", button: "soft", navVariant: "bar", heroVariant: "full",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "masonry", testimonialsVariant: "spotlight",
};
const tilesSanitary = {
  ...tinted("#0E7490", "#F59E0B", "#F5FBFC", "#FFFFFF", "#0E262E", "#5A7480", "#DCEEF2"),
  fonts: { display: f.grotesk, body: f.manrope }, heading: H(700, "-0.02em"), kicker: KICK("0.2em", 700),
  radius: "0.5rem", button: "sharp", navVariant: "bar", heroVariant: "split",
  servicesVariant: "tiles", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const hardwareShop = {
  ...tinted("#B91C1C", "#F97316", "#FDF7F5", "#FFFFFF", "#33110E", "#8A5F58", "#F6DFDA"),
  fonts: { display: f.oswald, body: f.rubik }, heading: UPPER(600, "0.03em"), kicker: KICK("0.24em", 600),
  radius: "0.4rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const paintDealer = {
  ...tinted("#7C3AED", "#EC4899", "#FCFAFF", "#FFFFFF", "#241040", "#6E5A8C", "#EDE2FA"),
  fonts: { display: f.poppins, body: f.dm }, heading: H(700, "-0.02em"), kicker: KICK("0.2em", 700),
  radius: "2rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "cards", teamVariant: "circle", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const solarInstallation = {
  ...dark("#FBBF24", "#0EA5E9", "#0D1117", "#161D27", "#F8FAFC", "#94A3B8", "#242F3E"),
  fonts: { display: f.outfit, body: f.inter }, heading: H(800, "-0.025em"), kicker: KICK("0.22em", 700),
  radius: "1rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const gardening = {
  ...tinted("#15803D", "#84CC16", "#F5FBF3", "#FFFFFF", "#122B18", "#5B7A62", "#DCEEDD"),
  fonts: { display: f.quicksand, body: f.dm }, heading: H(700, "-0.01em"), kicker: KICK("0.2em", 700),
  radius: "2.25rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "cards", teamVariant: "arch", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const waterSupplier = {
  ...tinted("#0284C7", "#7DD3FC", "#F4FAFE", "#FFFFFF", "#0B2434", "#5A7484", "#DCEFF9"),
  fonts: { display: f.manrope, body: f.inter }, heading: H(800, "-0.02em"), kicker: KICK("0.2em", 700),
  radius: "1.75rem", button: "pill", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const weddingDecoration = {
  ...tinted("#BE185D", "#F9A8D4", "#FFF7FB", "#FFFFFF", "#3B0F26", "#8A5A72", "#F8DEEA"),
  fonts: { display: f.cormorant, body: f.poppins }, heading: H(600, "0.03em"), kicker: KICK("0.36em", 500),
  radius: "2.5rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "rows", teamVariant: "arch", galleryVariant: "masonry", testimonialsVariant: "spotlight",
};
const mandapDecoration = {
  ...tinted("#B45309", "#DC2626", "#FFFDF4", "#FFFFFF", "#33200B", "#8A6B4C", "#F5E6CC"),
  fonts: { display: f.playfair, body: f.manrope }, heading: H(700, "0em"), kicker: KICK("0.3em", 600),
  radius: "0.25rem", button: "soft", navVariant: "bar", heroVariant: "full",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "masonry", testimonialsVariant: "spotlight",
};
const djSound = {
  ...dark("#A855F7", "#22D3EE", "#0B0B14", "#151524", "#F5F3FF", "#9B9AB8", "#26263C"),
  fonts: { display: f.bebas, body: f.rubik }, heading: UPPER(400, "0.04em"), kicker: KICK("0.36em", 600),
  radius: "0", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "dark", galleryVariant: "masonry", testimonialsVariant: "cards",
};
const tentHouse = {
  ...tinted("#166534", "#CA8A04", "#F7FBF4", "#FFFFFF", "#12290F", "#5F7A5B", "#DFEEDA"),
  fonts: { display: f.oswald, body: f.inter }, heading: UPPER(600, "0.03em"), kicker: KICK("0.24em", 600),
  radius: "0.5rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const florist = {
  ...tinted("#DB2777", "#10B981", "#FEF8FB", "#FFFFFF", "#3B0F26", "#8A5A72", "#FADFEA"),
  fonts: { display: f.fraunces, body: f.quicksand }, heading: H(600, "-0.01em"), kicker: KICK("0.28em", 600),
  radius: "2.5rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "cards", teamVariant: "arch", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const sweetShop = {
  ...tinted("#C2410C", "#F59E0B", "#FFF9F2", "#FFFFFF", "#3B1B08", "#8A6B4C", "#F7E5D0"),
  fonts: { display: f.josefin, body: f.dm }, heading: H(600, "0em"), kicker: KICK("0.26em", 600),
  radius: "2rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "cards", teamVariant: "circle", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const tiffinService = {
  ...tinted("#EA580C", "#16A34A", "#FFF9F4", "#FFFFFF", "#33200F", "#8A7157", "#F8E8D8"),
  fonts: { display: f.poppins, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.18em", 700),
  radius: "1.5rem", button: "pill", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const cloudKitchen = {
  ...dark("#F97316", "#FACC15", "#131110", "#1D1B18", "#FAF7F2", "#A29A8E", "#2C2924", "dark-elegant"),
  fonts: { display: f.fraunces, body: f.inter }, heading: H(600, "-0.01em"), kicker: KICK("0.28em", 600),
  radius: "1.25rem", button: "soft", navVariant: "bar", heroVariant: "full",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const foodTruck = {
  ...tinted("#DC2626", "#FACC15", "#FFF8F5", "#FFFFFF", "#3B100E", "#8A5C58", "#FADFD8"),
  fonts: { display: f.bebas, body: f.rubik }, heading: UPPER(400, "0.03em"), kicker: KICK("0.3em", 600),
  radius: "0.75rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const petGrooming = {
  ...tinted("#0891B2", "#F472B6", "#F4FCFE", "#FFFFFF", "#0E2B33", "#5A7480", "#D9F1F8"),
  fonts: { display: f.quicksand, body: f.dm }, heading: H(700, "-0.01em"), kicker: KICK("0.2em", 700),
  radius: "2.25rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "cards", teamVariant: "arch", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const petBoarding = {
  ...tinted("#7C2D12", "#FBBF24", "#FDF8F4", "#FFFFFF", "#33200F", "#8A7157", "#F2E4D6"),
  fonts: { display: f.manrope, body: f.inter }, heading: H(800, "-0.02em"), kicker: KICK("0.18em", 700),
  radius: "1.75rem", button: "pill", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "masonry", testimonialsVariant: "cards",
};
const petTraining = {
  ...tinted("#1D4ED8", "#22C55E", "#F5F8FF", "#FFFFFF", "#121F3D", "#5B6780", "#DFE7F8"),
  fonts: { display: f.outfit, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.18em", 700),
  radius: "1.25rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const physiotherapy = {
  ...tinted("#0E7490", "#F43F5E", "#F4FAFC", "#FFFFFF", "#0E262E", "#5A7480", "#DAEEF4"),
  fonts: { display: f.jakarta, body: f.inter }, heading: H(800, "-0.02em"), kicker: KICK("0.16em", 700),
  radius: "1.25rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const eyeCare = {
  ...tinted("#1E3A8A", "#06B6D4", "#F5F8FF", "#FFFFFF", "#101B33", "#5B6780", "#DFE7F6"),
  fonts: { display: f.sora, body: f.manrope }, heading: H(700, "-0.02em"), kicker: KICK("0.2em", 700),
  radius: "1.5rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const pharmacy = {
  ...tinted("#16A34A", "#EF4444", "#F6FCF6", "#FFFFFF", "#0E2A16", "#5A7A62", "#DCF0DE"),
  fonts: { display: f.dm, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.16em", 700),
  radius: "0.5rem", button: "sharp", navVariant: "bar", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const homeTutor = {
  ...tinted("#4338CA", "#F59E0B", "#F8F8FF", "#FFFFFF", "#191735", "#66668A", "#E6E5F8"),
  fonts: { display: f.poppins, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.18em", 700),
  radius: "1.5rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const musicDance = {
  ...tinted("#7E22CE", "#F43F5E", "#FDF7FF", "#FFFFFF", "#2A0F3D", "#7A5E8C", "#F0E1F8"),
  fonts: { display: f.playfair, body: f.poppins }, heading: H(700, "0em"), kicker: KICK("0.3em", 600),
  radius: "1.75rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "cards", teamVariant: "arch", galleryVariant: "masonry", testimonialsVariant: "spotlight",
};
const drivingSchool = {
  ...tinted("#0369A1", "#F97316", "#F4F9FD", "#FFFFFF", "#0C2434", "#5B7484", "#DCEBF4"),
  fonts: { display: f.rubik, body: f.dm }, heading: H(700, "-0.02em"), kicker: KICK("0.16em", 700),
  radius: "0.75rem", button: "sharp", navVariant: "bar", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const computerTraining = {
  ...tinted("#0F766E", "#6366F1", "#F4FBFA", "#FFFFFF", "#0E2A28", "#5A7A77", "#D6EFEC"),
  fonts: { display: f.grotesk, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.2em", 600),
  radius: "0.75rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const languageInstitute = {
  ...tinted("#B45309", "#0EA5E9", "#FFF9F3", "#FFFFFF", "#33200C", "#8A7157", "#F5E6D4"),
  fonts: { display: f.josefin, body: f.inter }, heading: H(600, "0em"), kicker: KICK("0.26em", 600),
  radius: "2rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "cards", teamVariant: "circle", galleryVariant: "grid", testimonialsVariant: "spotlight",
};
const studyAbroad = {
  ...tinted("#1E40AF", "#0D9488", "#F5F8FD", "#FFFFFF", "#111A33", "#5B6780", "#E0E7F4"),
  fonts: { display: f.manrope, body: f.inter }, heading: H(800, "-0.02em"), kicker: KICK("0.18em", 700),
  radius: "1rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const educationConsultant = {
  ...tinted("#312E81", "#F59E0B", "#F7F8FD", "#FFFFFF", "#1A1935", "#66688A", "#E4E5F5"),
  fonts: { display: f.marcellus, body: f.manrope }, heading: H(400, "0.02em"), kicker: KICK("0.28em", 600),
  radius: "0.5rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const digitalMarketing = {
  ...dark("#22D3EE", "#F43F5E", "#0B0F17", "#141B26", "#F1F5F9", "#8FA0B3", "#222C3D"),
  fonts: { display: f.sora, body: f.inter }, heading: H(700, "-0.025em"), kicker: KICK("0.22em", 700),
  radius: "1rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "dark", galleryVariant: "masonry", testimonialsVariant: "cards",
};
const printing = {
  ...tinted("#334155", "#0EA5E9", "#F7F9FB", "#FFFFFF", "#141C2B", "#5D6B7D", "#E2E8F0"),
  fonts: { display: f.oswald, body: f.inter }, heading: UPPER(600, "0.03em"), kicker: KICK("0.22em", 600),
  radius: "0.4rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const signboard = {
  ...dark("#FACC15", "#F43F5E", "#101014", "#1A1A20", "#FAFAFA", "#9C9CA6", "#282830"),
  fonts: { display: f.bebas, body: f.rubik }, heading: UPPER(400, "0.05em"), kicker: KICK("0.34em", 600),
  radius: "0", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const graphicDesign = {
  ...tinted("#7C3AED", "#22D3EE", "#FCFAFF", "#FFFFFF", "#241040", "#6E5A8C", "#EDE2FA"),
  fonts: { display: f.outfit, body: f.dm }, heading: H(700, "-0.03em"), kicker: KICK("0.24em", 700),
  radius: "2rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "cards", teamVariant: "circle", galleryVariant: "masonry", testimonialsVariant: "spotlight",
};
const videoProduction = {
  ...dark("#F8FAFC", "#EF4444", "#0A0A0C", "#141418", "#FAFAFA", "#8E8E96", "#24242A"),
  fonts: { display: f.manrope, body: f.inter }, heading: H(800, "-0.03em"), kicker: KICK("0.32em", 500),
  radius: "0.5rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "dark", galleryVariant: "masonry", testimonialsVariant: "cards",
};
const socialMedia = {
  ...tinted("#DB2777", "#8B5CF6", "#FEF8FC", "#FFFFFF", "#3B0F26", "#8A5A72", "#FADFEA"),
  fonts: { display: f.poppins, body: f.dm }, heading: H(700, "-0.02em"), kicker: KICK("0.2em", 700),
  radius: "2rem", button: "pill", navVariant: "floating", heroVariant: "center",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "masonry", testimonialsVariant: "spotlight",
};
const securityService = {
  ...dark("#0EA5E9", "#F8FAFC", "#0D1117", "#161D27", "#F1F5F9", "#93A1B0", "#243040"),
  fonts: { display: f.oswald, body: f.inter }, heading: UPPER(600, "0.04em"), kicker: KICK("0.26em", 600),
  radius: "0.25rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "dark", galleryVariant: "grid", testimonialsVariant: "cards",
};
const manpowerRecruitment = {
  ...tinted("#1E3A5F", "#0E7490", "#F7F9FB", "#FFFFFF", "#14202E", "#5D6B7D", "#E2E8F0"),
  fonts: { display: f.manrope, body: f.inter }, heading: H(800, "-0.02em"), kicker: KICK("0.18em", 700),
  radius: "0.75rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const constructionContractor = {
  ...tinted("#B45309", "#FBBF24", "#FDF8F2", "#FFFFFF", "#33200C", "#8A7157", "#F2E4D0"),
  fonts: { display: f.oswald, body: f.rubik }, heading: UPPER(600, "0.03em"), kicker: KICK("0.24em", 600),
  radius: "0.25rem", button: "sharp", navVariant: "bar", heroVariant: "full",
  servicesVariant: "tiles", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const civilContractor = {
  ...tinted("#57534E", "#0EA5E9", "#FAF9F7", "#FFFFFF", "#1C1917", "#6E6A64", "#E7E5E1"),
  fonts: { display: f.grotesk, body: f.inter }, heading: H(700, "-0.02em"), kicker: KICK("0.22em", 600),
  radius: "0", button: "sharp", navVariant: "bar", heroVariant: "split",
  servicesVariant: "tiles", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const courier = {
  ...tinted("#EA580C", "#1D4ED8", "#FFF9F5", "#FFFFFF", "#33200F", "#8A7157", "#F8E4D6"),
  fonts: { display: f.outfit, body: f.inter }, heading: H(800, "-0.025em"), kicker: KICK("0.16em", 700),
  radius: "1rem", button: "soft", navVariant: "floating", heroVariant: "split",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "grid", testimonialsVariant: "cards",
};
const tourOperator = {
  ...tinted("#0F766E", "#FB923C", "#F3FBFA", "#FFFFFF", "#0E2A28", "#5A7A77", "#D6EFEC"),
  fonts: { display: f.fraunces, body: f.dm }, heading: H(600, "-0.01em"), kicker: KICK("0.24em", 600),
  radius: "1.75rem", button: "pill", navVariant: "floating", heroVariant: "full",
  servicesVariant: "cards", teamVariant: "cards", galleryVariant: "masonry", testimonialsVariant: "spotlight",
};

/** categoryId → visual identity. Every category in data/categories.js is covered. */
export const CATEGORY_STYLES = {
  clinic, hospital, dental,
  gym, fitness, yoga,
  cafe, bakery, restaurant,
  salon, spa, beauty,
  hotel, coaching, consultancy, "real-estate": realEstate, photography, travel,
  automobile, freelancer, interior, jewellery, ca: charteredAccountant, architect,
  "ac-repair": acRepair, cleaning, laundry, event: eventPlanner, caterer,
  nutritionist, makeup: makeupArtist,

  /* Added categories */
  "car-detailing": carDetailing, "bike-service": bikeService, "car-rental": carRental, "bike-rental": bikeRental,
  "mobile-repair": mobileRepair, "laptop-repair": laptopRepair, "appliance-repair": applianceRepair,
  "ro-service": roService, "pest-control": pestControl, "packers-movers": packersMovers,
  waterproofing, "home-renovation": homeRenovation, "modular-kitchen": modularKitchen,
  "furniture-shop": furnitureShop, "tiles-sanitary": tilesSanitary, "hardware-shop": hardwareShop,
  "paint-dealer": paintDealer, "solar-installation": solarInstallation, gardening,
  "water-supplier": waterSupplier, "wedding-decoration": weddingDecoration,
  "mandap-decoration": mandapDecoration, "dj-sound": djSound, "tent-house": tentHouse,
  florist, "sweet-shop": sweetShop, "tiffin-service": tiffinService, "cloud-kitchen": cloudKitchen,
  "food-truck": foodTruck, "pet-grooming": petGrooming, "pet-boarding": petBoarding,
  "pet-training": petTraining, physiotherapy, "eye-care": eyeCare, pharmacy, "home-tutor": homeTutor,
  "music-dance": musicDance, "driving-school": drivingSchool, "computer-training": computerTraining,
  "language-institute": languageInstitute, "study-abroad": studyAbroad,
  "education-consultant": educationConsultant, "digital-marketing": digitalMarketing,
  printing, signboard, "graphic-design": graphicDesign, "video-production": videoProduction,
  "social-media": socialMedia, "security-service": securityService,
  "manpower-recruitment": manpowerRecruitment, "construction-contractor": constructionContractor,
  "civil-contractor": civilContractor, courier, "tour-operator": tourOperator,
  other,
};

export const getCategoryStyle = (categoryId) => CATEGORY_STYLES[categoryId] || other;
