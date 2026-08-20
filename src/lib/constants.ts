// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for business data, services, service-area cities,
// and testimonials. Content scraped from kelleyconstructionohio.com.
//
// Address, hours, and Google Business Profile confirmed by the client (2026-05-21).
// Email is intentionally omitted — all inquiries route through the contact form.
// ─────────────────────────────────────────────────────────────────────────

export const BUSINESS = {
  name: "Kelley Concrete and Construction",
  legalName: "Kelley Construction LLC",
  shortName: "Kelley",
  owner: "Mike Kelley",
  tagline: "Built on Experience. Known for Quality.",
  founded: 2004, // "over 20 years of experience"
  yearsExperience: "20+",
  blurb:
    "Reliable concrete and construction services across Northeast Ohio. With more than 20 years of experience, Kelley Concrete and Construction has built a reputation for dependable residential and commercial concrete work.",
  phone: "(330) 608-7957",
  // Email intentionally NOT published — inquiries route through the contact form.
  serviceRadiusMiles: 30,
  address: {
    street: "223 W. Bergey St",
    city: "Wadsworth",
    state: "OH",
    county: "Medina County",
    zip: "44281",
  },
  hours: [
    { day: "Monday", value: "7:00 AM - 5:00 PM" },
    { day: "Tuesday", value: "7:00 AM - 5:00 PM" },
    { day: "Wednesday", value: "7:00 AM - 5:00 PM" },
    { day: "Thursday", value: "7:00 AM - 5:00 PM" },
    { day: "Friday", value: "7:00 AM - 5:00 PM" },
    { day: "Saturday", value: "8:00 AM - 12:00 PM" },
    { day: "Sunday", value: "Closed" },
  ],
  // For schema.org openingHoursSpecification
  hoursSpec: {
    weekdays: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "17:00" },
    saturday: { days: ["Saturday"], opens: "08:00", closes: "12:00" },
  },
  social: {
    facebook: "https://www.facebook.com/kelleyconstructionco",
    instagram: "https://www.instagram.com/kelleyconstructionco/",
  },
  googleBusinessProfile: "https://share.google/lwkJ1FZMWbgrj0DDx",
  googlePlaceId: "ChIJ9U293zrNMIgR-nF9OHKokwE",
  googleMapsUri:
    "https://maps.google.com/?cid=113619624141877754",
  geo: { lat: 41.0256, lng: -81.7298 }, // Wadsworth, OH centroid (approx)
} as const;

// Baked from Google Places API on 2026-06-01. The Reviews component SSRs these
// (so search crawlers + first paint always have real content) and swaps in
// live data from /api/reviews on mount. Refreshed on each rebuild.
export const GOOGLE_RATING = {
  value: 4.5,
  count: 11,
  fetchedAt: "2026-06-01",
} as const;

export type GoogleReview = {
  author: string;
  rating: number;
  text: string;
  timeAgo: string;
  publishTime: string;
};

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    author: "Frank Myers",
    rating: 5,
    text: "We live in a condominium community in Wadsworth, Ohio. Mike and his team came in and demolished and redid our entire court in around two weeks. They leveled and reinforced the ground with gravel, wire mesh, and poured six inches of concrete. They were very hands-on with the community, very polite and professional. They will be back to do some personal work for me at a later date.",
    timeAgo: "11 months ago",
    publishTime: "2025-09-11T19:49:24Z",
  },
  {
    author: "Sara Miller",
    rating: 5,
    text: "The entire crew was incredible. Communication, the job they did, the ability to be personal and kind with customers, the affordability compared to others in the game (we got 10 quotes from local companies and this was the best). I will be using them in the future if we ever need anything done again, and would recommend to anyone. We are so happy and can't wait to enjoy our patio and driveway for years to come. Thank you Kelley Construction.",
    timeAgo: "1 year ago",
    publishTime: "2025-06-26T18:42:57Z",
  },
  {
    author: "Tim Evans",
    rating: 5,
    text: "I highly recommend Kelley Construction LLC. Mike and his team are terrific to work with. They provide exceptional work ethic and skill.",
    timeAgo: "2 years ago",
    publishTime: "2024-05-01T19:38:35Z",
  },
  {
    author: "Mike Yost",
    rating: 5,
    text: "Kelley Construction is highly recommended. They are professional, always get right back to you when you have any questions, and deliver high quality work. I had them out to give me an estimate on a gravel pad for our camper, and within one week they had me on the schedule and the job was complete. I couldn't be happier and will continue to go to them for any type of concrete or stone driveway needs.",
    timeAgo: "5 years ago",
    publishTime: "2021-03-09T02:56:50Z",
  },
  {
    author: "Harold Neal",
    rating: 5,
    text: "Great service, they did a great job.",
    timeAgo: "5 years ago",
    publishTime: "2020-10-18T15:05:23Z",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Service Area", href: "/service-area" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const IMAGES = {
  logo: "/images/kelley-logo.png",
  logoWhite: "/images/logo-white-clean.png",
  // heroes / features
  heroStampedSteps: "/images/stamped-patio-steps.webp",
  stampedTan: "/images/stamped-patio-tan.webp",
  stampedGray: "/images/stamped-patio-gray.webp",
  stampedCharcoalBorder: "/images/stamped-patio-charcoal-border.webp",
  stampedDeck: "/images/stamped-patio-deck.webp",
  stampedDusk: "/images/stamped-patio-dusk.jpg",
  stampedDark: "/images/stamped-patio-dark.jpg",
  stampedFinishing: "/images/stamped-finishing.webp",
  stampedWalkway: "/images/stamped-walkway.webp",
  drivewayBroom: "/images/driveway-broom.webp",
  drivewayWide: "/images/driveway-wide.jpg",
  walkwayCurved: "/images/walkway-curved.webp",
  retainingWall: "/images/retaining-wall.webp",
  commercialPour: "/images/commercial-pour.webp",
  concreteRepair: "/images/concrete-repair.jpg",
  demolitionService: "/images/demolition-service.jpg",
} as const;

export type Service = {
  slug: string;
  title: string;
  navTitle: string;
  short: string;
  image: string;
  intro: string;
  bullets: string[];
  body: string[];
  faqs: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "stamped-concrete",
    title: "Stamped & Decorative Concrete",
    navTitle: "Stamped Concrete",
    short:
      "Patios, walkways, and pool decks stamped and colored to mimic stone, slate, or brick, at a fraction of the cost.",
    image: IMAGES.heroStampedSteps,
    intro:
      "Add character to your home with stamped and decorative concrete. We stamp, color, and seal patios, walkways, and pool decks to replicate the look of natural stone, slate, brick, or wood, with the durability and value of poured concrete.",
    bullets: [
      "Stamped patios, walkways & pool decks",
      "Custom colors, borders & banding",
      "Slate, ashlar, cobblestone & wood-plank textures",
      "Sealing & long-term maintenance",
    ],
    body: [
      "Stamped concrete delivers the high-end look of pavers or natural stone without the seams, weeds, and shifting that come with them. Because it is poured as a single monolithic slab, a stamped patio resists settling and is far easier to clean and maintain over the years.",
      "Every decorative project starts with a conversation about the pattern, color, and border that will complement your home. We pour, stamp, and hand-detail each surface, then apply a protective sealer to lock in the color and guard against Ohio's freeze-thaw cycles.",
    ],
    faqs: [
      {
        q: "How long does stamped concrete last?",
        a: "A properly poured and sealed stamped concrete surface typically lasts 25+ years. Resealing every 2-3 years keeps the color vibrant and protects against Northeast Ohio's freeze-thaw weather.",
      },
      {
        q: "Is stamped concrete cheaper than pavers?",
        a: "In most cases, yes. Stamped concrete usually costs less to install than natural stone or pavers and has lower long-term maintenance because there are no individual joints to weed, re-level, or re-sand.",
      },
    ],
  },
  {
    slug: "concrete-driveways",
    title: "Concrete Driveways & Flatwork",
    navTitle: "Driveways & Flatwork",
    short:
      "New driveways, garage floors, sidewalks, and flatwork poured and finished to last decades.",
    image: IMAGES.drivewayWide,
    intro:
      "A concrete driveway is one of the best investments you can make in your property. We design, pour, and finish residential and commercial driveways, garage floors, and flatwork built to carry years of Ohio weather and daily use.",
    bullets: [
      "New & replacement driveways",
      "Garage & shop floors",
      "Sidewalks & approaches",
      "Proper base prep, grading & drainage",
    ],
    body: [
      "The difference between a driveway that lasts decades and one that cracks in a few winters is what happens before the pour. We excavate to the correct depth, install and compact a stone base, set the grade for proper drainage, and reinforce the slab so it holds up to heavy vehicles and freeze-thaw movement.",
      "Choose a classic broom finish for traction and a clean look, or upgrade to exposed aggregate or a stamped border for curb appeal. Either way, you get a smooth, properly jointed slab finished by a crew with 20+ years of experience.",
    ],
    faqs: [
      {
        q: "How long before I can drive on a new concrete driveway?",
        a: "You can usually walk on it after 24-48 hours, but we recommend waiting 7 days before driving and parking on it so the concrete reaches enough strength to avoid surface damage.",
      },
      {
        q: "How thick should a concrete driveway be?",
        a: "We pour residential driveways at a minimum of 4 inches, and 5-6 inches where heavier vehicles or RVs will be parked, over a properly compacted stone base.",
      },
    ],
  },
  {
    slug: "patios-and-walkways",
    title: "Patios & Walkways",
    navTitle: "Patios & Walkways",
    short:
      "Backyard patios, sidewalks, steps, and curved walkways that connect and elevate your outdoor space.",
    image: IMAGES.walkwayCurved,
    intro:
      "Turn your backyard into a place you actually use. We build concrete patios, walkways, steps, and sitting areas (broom-finished, exposed-aggregate, or stamped) designed around how you live outdoors.",
    bullets: [
      "Patios & sitting areas",
      "Sidewalks & garden paths",
      "Steps & landings",
      "Curved & freeform layouts",
    ],
    body: [
      "Whether you want a simple, clean patio off the back door or a curved walkway winding through the landscaping, we lay out every project to fit your yard and drain water away from your foundation.",
      "We'll walk the space with you, recommend the finish and shape that fits your home, and pour a patio that's ready for furniture, grills, and gatherings for decades to come.",
    ],
    faqs: [
      {
        q: "Can you match a patio to my existing concrete?",
        a: "Yes. We do our best to match the color, finish, and jointing of existing flatwork, and we'll be upfront when a brand-new pour will look slightly different as it cures and weathers in.",
      },
    ],
  },
  {
    slug: "concrete-repair",
    title: "Concrete Repair & Maintenance",
    navTitle: "Concrete Repair",
    short:
      "Crack repair, resurfacing, sealing, and replacement to extend the life of your existing concrete.",
    image: IMAGES.concreteRepair,
    intro:
      "Not every concrete problem needs a full tear-out. We assess cracked, settled, or worn concrete and recommend the most cost-effective fix, from sealing and resurfacing to targeted replacement.",
    bullets: [
      "Crack & joint repair",
      "Resurfacing & overlays",
      "Sealing & protection",
      "Section replacement",
    ],
    body: [
      "Ohio's freeze-thaw cycle is hard on concrete. Small cracks let water in, and water is what turns a small crack into a big one. Sealing and timely repairs protect the investment you already have in your driveway, patio, or walkway.",
      "When a slab is too far gone to save, we'll tell you straight and give you a fair price to replace just the failed sections rather than the whole surface where possible.",
    ],
    faqs: [
      {
        q: "Is it worth repairing concrete or should I replace it?",
        a: "It depends on the cause and extent of the damage. Surface cracks and minor settling are often worth sealing or resurfacing. Heaving, deep structural cracks, or widespread crumbling usually mean replacement is the better long-term value. We'll give you an honest assessment.",
      },
      {
        q: "How often should concrete be sealed?",
        a: "Most exterior concrete benefits from resealing every 2-3 years in Northeast Ohio, and stamped or decorative surfaces a bit more often to keep the color and protective layer intact.",
      },
    ],
  },
  {
    slug: "demolition-masonry-excavation",
    title: "Demolition, Masonry & Excavation",
    navTitle: "Demolition & Excavation",
    short:
      "Tear-out, site prep, grading, retaining walls, and masonry to get the job done from the ground up.",
    image: IMAGES.demolitionService,
    intro:
      "We handle the work that happens before and around the concrete (demolition of old slabs, excavation and grading, masonry, and segmental retaining walls) so your project is managed by one experienced crew from start to finish.",
    bullets: [
      "Concrete & slab demolition",
      "Excavation, grading & site prep",
      "Segmental & block retaining walls",
      "Masonry & hardscape work",
    ],
    body: [
      "Removing old concrete, regrading a site, or building a retaining wall takes the right equipment and the experience to do it without damaging what stays. We handle demolition and haul-off, excavate and compact to grade, and build retaining walls that hold back soil and direct water where it should go.",
      "Keeping demolition, excavation, and the finished concrete under one roof means fewer subcontractors, a cleaner job site, and one company accountable for the result.",
    ],
    faqs: [
      {
        q: "Do you haul away the old concrete and debris?",
        a: "Yes. Demolition includes breaking out the old material, loading, and hauling it off so you're left with a clean, graded site ready for the next phase.",
      },
    ],
  },
  {
    slug: "commercial-concrete",
    title: "Commercial Concrete",
    navTitle: "Commercial Concrete",
    short:
      "Parking lots, dock walls, floor drains, and commercial flatwork for Northeast Ohio businesses.",
    image: IMAGES.commercialPour,
    intro:
      "Businesses across Medina, Wayne, and Summit counties rely on us for durable commercial concrete. We pour parking lots, approaches, dock walls, parking blocks, floor drains, and interior slabs, scheduled around your operations.",
    bullets: [
      "Parking lots & approaches",
      "Dock walls & loading areas",
      "Floor drains & interior slabs",
      "Parking blocks & site concrete",
    ],
    body: [
      "Commercial concrete has to stand up to constant traffic, heavy loads, and tight schedules. Our crew has more than 20 years pouring durable commercial flatwork and structures, and we plan the work to minimize downtime for your business.",
      "From a single dock wall to a full parking lot, you get a properly engineered base, reinforced slabs, and clean finishes, managed by one accountable contractor.",
    ],
    faqs: [
      {
        q: "Can you work around our business hours?",
        a: "Yes. We routinely phase commercial pours and schedule around operating hours (including early mornings and weekends) to keep your parking, loading, and access disruptions to a minimum.",
      },
    ],
  },
];

export type City = {
  slug: string;
  name: string;
  county: string;
  intro: string;
  neighbors: string[];
};

// Per-city local landing pages targeting "concrete contractor <city> OH".
export const CITIES: City[] = [
  {
    slug: "wadsworth",
    name: "Wadsworth",
    county: "Medina County",
    intro:
      "Wadsworth is our home base. We pour driveways, patios, and stamped concrete throughout Wadsworth and the surrounding Medina County neighborhoods, and we know the soil, permitting, and freeze-thaw conditions here better than anyone.",
    neighbors: ["Rittman", "Norton", "Doylestown", "Sharon Center"],
  },
  {
    slug: "medina",
    name: "Medina",
    county: "Medina County",
    intro:
      "From historic Medina Square to the newer developments off Route 18, we provide concrete driveways, patios, and decorative flatwork for homeowners and businesses throughout the City of Medina.",
    neighbors: ["Montville", "Brunswick", "Seville", "Hinckley"],
  },
  {
    slug: "rittman",
    name: "Rittman",
    county: "Wayne County",
    intro:
      "We serve Rittman and the surrounding Wayne County communities with dependable residential and commercial concrete: driveways, patios, repairs, and excavation.",
    neighbors: ["Wadsworth", "Sterling", "Doylestown", "Orrville"],
  },
  {
    slug: "wooster",
    name: "Wooster",
    county: "Wayne County",
    intro:
      "As the Wayne County seat, Wooster keeps us busy with everything from residential driveways and stamped patios to commercial parking lots and flatwork.",
    neighbors: ["Orrville", "Apple Creek", "Smithville", "Rittman"],
  },
  {
    slug: "barberton",
    name: "Barberton",
    county: "Summit County",
    intro:
      "We bring our concrete and construction services to Barberton and western Summit County, handling driveways, patios, repairs, and commercial work across the Magic City.",
    neighbors: ["Norton", "Wadsworth", "Akron", "Clinton"],
  },
  {
    slug: "norton",
    name: "Norton",
    county: "Summit County",
    intro:
      "Norton sits right between our Wadsworth base and the greater Akron area, making it a community we serve often for driveways, patios, and stamped concrete.",
    neighbors: ["Wadsworth", "Barberton", "Doylestown", "Clinton"],
  },
  {
    slug: "brunswick",
    name: "Brunswick",
    county: "Medina County",
    intro:
      "Brunswick's many residential neighborhoods are a great fit for our driveway replacements, stamped patios, and concrete repair work in northern Medina County.",
    neighbors: ["Medina", "Hinckley", "Strongsville", "Valley City"],
  },
  {
    slug: "doylestown",
    name: "Doylestown",
    county: "Wayne County",
    intro:
      "We serve Doylestown and the Chippewa Lake area with residential and commercial concrete, from new driveways and patios to demolition and excavation.",
    neighbors: ["Rittman", "Wadsworth", "Norton", "Sterling"],
  },
];

export type Testimonial = { quote: string; name: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We live in a condominium community in Wadsworth, Ohio. Mike and his team demolished and rebuilt our entire court in about two weeks. The work was done professionally, with great communication throughout the process. We were so impressed that we plan to hire them again for personal projects.",
    name: "Frank M.",
  },
  {
    quote:
      "The entire crew was great to work with. Communication was clear, the quality of work was excellent, and the pricing was fair compared to other local quotes. We are very happy with our patio and driveway and would absolutely recommend Kelley Construction.",
    name: "Sara M.",
  },
  {
    quote:
      "I highly recommend Kelley Construction LLC. Mike and his team are terrific to work with. They provide exceptional work ethic and skill.",
    name: "Tim E.",
  },
  {
    quote:
      "Kelley Construction is highly recommended. They were professional, responsive, and delivered high quality work. From estimate to completion, the process was quick and smooth, and we could not be happier with the results of our driveway projects.",
    name: "Mike Y.",
  },
];

export const PROJECT_GALLERY = [
  { src: IMAGES.heroStampedSteps, alt: "Stamped concrete patio with curved steps in Wadsworth, Ohio" },
  { src: IMAGES.stampedTan, alt: "Large tan stamped concrete patio with decorative border" },
  { src: IMAGES.stampedDark, alt: "Charcoal stamped concrete patio walkway" },
  { src: IMAGES.drivewayBroom, alt: "Broom-finished concrete driveway" },
  { src: IMAGES.walkwayCurved, alt: "Curved concrete walkway through a landscaped yard" },
  { src: IMAGES.retainingWall, alt: "Segmental block retaining wall beside a concrete pad" },
  { src: IMAGES.stampedDeck, alt: "Stamped concrete patio in front of a raised deck" },
  { src: IMAGES.stampedGray, alt: "Gray stamped concrete patio with charcoal banding" },
  { src: IMAGES.commercialPour, alt: "Commercial concrete pour with crew and concrete truck" },
] as const;
