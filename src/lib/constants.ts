// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for Bear Cave business data.
//
// Sources: client-approved Manus site (April 2026), Google Business Profile
// (fetched 2026-08-20: place ChIJrxEv0lfMMIgRtWOnSWlwmzQ, rating 4.7/17),
// and the client's own pole signage (beverage catering) photographed at the
// store. Hours follow the GBP, which differs from the old site's table;
// flagged to Adam at build time. No invented facts.
// Email intentionally omitted: inquiries route through the contact form.
// ─────────────────────────────────────────────────────────────────────────

export const BUSINESS = {
  name: "Bear Cave Drive Thru",
  shortName: "Bear Cave",
  tagline: "Wadsworth's Best Drive-Thru",
  blurb:
    "Bear Cave is Wadsworth's drive-thru beverage store. Pull in for the coldest beer in town, wine, seltzers, soda, snacks, candy, lottery, and tobacco without leaving your car. Locally owned and operated at 474 College St.",
  phone: "(330) 334-3887",
  phoneDigits: "3303343887",
  address: {
    street: "474 College St",
    city: "Wadsworth",
    state: "OH",
    county: "Medina County",
    zip: "44281",
  },
  // Google Business Profile hours (2026-08-20).
  hours: [
    { day: "Monday", value: "8:00 AM - 9:00 PM" },
    { day: "Tuesday", value: "8:00 AM - 9:00 PM" },
    { day: "Wednesday", value: "8:00 AM - 9:00 PM" },
    { day: "Thursday", value: "8:00 AM - 10:00 PM" },
    { day: "Friday", value: "8:00 AM - 10:00 PM" },
    { day: "Saturday", value: "9:00 AM - 10:00 PM" },
    { day: "Sunday", value: "10:00 AM - 9:00 PM" },
  ],
  hoursSpec: [
    { days: ["Monday", "Tuesday", "Wednesday"], opens: "08:00", closes: "21:00" },
    { days: ["Thursday", "Friday"], opens: "08:00", closes: "22:00" },
    { days: ["Saturday"], opens: "09:00", closes: "22:00" },
    { days: ["Sunday"], opens: "10:00", closes: "21:00" },
  ],
  social: {
    facebook: "https://www.facebook.com/BEARCAVEWADSWORTH",
    facebookHandle: "@BEARCAVEWADSWORTH",
  },
  googlePlaceId: "ChIJrxEv0lfMMIgRtWOnSWlwmzQ",
  googleMapsUri: "https://maps.google.com/?cid=3790747108871988149",
  geo: { lat: 41.0257551, lng: -81.7434362 },
} as const;

// Baked from Google Places API on 2026-08-20. The Reviews component SSRs
// these and swaps in live data from /api/reviews on mount.
export const GOOGLE_RATING = {
  value: 4.7,
  count: 17,
  fetchedAt: "2026-08-20",
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
    author: "RoseMarie Reed",
    rating: 5,
    text: "BEST STAFF EVER!!!! This is family strong and local. Great service, prices are normal. Owners and staff are incredibly friendly, makes you feel like family. Worth a try 100%",
    timeAgo: "2 years ago",
    publishTime: "2023-12-29T23:31:57Z",
  },
  {
    author: "Dave Sword",
    rating: 5,
    text: "Great beverage drive-thru. Very friendly employees. Clean and easy to get in and out.",
    timeAgo: "2 years ago",
    publishTime: "2024-05-22T22:18:55Z",
  },
  {
    author: "Denise",
    rating: 5,
    text: "Fast & Friendly service!",
    timeAgo: "2 months ago",
    publishTime: "2026-05-24T12:33:42Z",
  },
  {
    author: "Joker Greathouse",
    rating: 5,
    text: "Very friendly staff that make you feel like family I would recommend it to anyone.",
    timeAgo: "4 years ago",
    publishTime: "2022-05-31T01:45:56Z",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Catering", href: "/catering" },
  { label: "Jobs", href: "/jobs" },
  { label: "Contact", href: "/contact" },
] as const;

export const IMAGES = {
  logo: "/images/bear-cave-logo.webp",
  mascot: "/images/bear-mascot.webp",
  building: "/images/drive-thru-building.webp",
  buildingWide: "/images/products-exterior.webp",
  coolers: "/images/beer-coolers.webp",
  heroFrost: "/images/hero-frost-bg.webp",
  productsBg: "/images/products-bg.webp",
} as const;

// Product categories carried in the store. Confirmed by the client's own
// site copy; no brand names, prices, or specials are published because
// stock rotates and nothing unconfirmed ships.
export type ProductCategory = {
  slug: string;
  title: string;
  short: string;
};

export const PRODUCTS: ProductCategory[] = [
  {
    slug: "beer",
    title: "Beer",
    short: "Domestics, imports, and Ohio craft in singles, six-packs, and cases, all kept cold.",
  },
  {
    slug: "wine-seltzers",
    title: "Wine & Seltzers",
    short: "A wide wine selection plus hard seltzers and ready-to-drink cans.",
  },
  {
    slug: "soda-mixers",
    title: "Soda & Mixers",
    short: "Pop, water, energy drinks, and mixers, cold and ready to go.",
  },
  {
    slug: "snacks-candy",
    title: "Snacks & Candy",
    short: "Chips, candy, and grab-and-go snacks to ride along with the drinks.",
  },
  {
    slug: "lottery",
    title: "Ohio Lottery",
    short: "An official Ohio Lottery retailer. Scratch-offs and draw games at the window.",
  },
  {
    slug: "tobacco",
    title: "Tobacco",
    short: "Cigarettes, cigars, and other tobacco products for customers 21 and over.",
  },
];

// Confirmed by the client's pole sign at the store: "Beverage catering
// available: weddings, office events, parties... and more."
export const CATERING = {
  headline: "Beverage Catering",
  occasions: ["Weddings", "Office events", "Parties"],
} as const;

// FAQ answers are built strictly from confirmed facts (location, hours,
// drive-thru format, product list, catering signage, GBP).
export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Where is Bear Cave located?",
    a: "We're at 474 College St in Wadsworth, Ohio. Look for the light blue building with the drive-thru lane running straight through it.",
  },
  {
    q: "How does a drive-thru beverage store work?",
    a: "Pull your car into the lane and drive inside the building. Tell us what you're after, we grab it, you pay at the window, and you're back on the road. You never have to leave your seat.",
  },
  {
    q: "What time does Bear Cave close?",
    a: "We're open until 9 PM Sunday through Wednesday, and until 10 PM Thursday, Friday, and Saturday.",
  },
  {
    q: "Do you sell cold beer?",
    a: "That's the whole point of the cave. Our coolers keep the coldest beer in town ready to drink, in singles, six-packs, twelve-packs, and cases.",
  },
  {
    q: "Do you carry wine?",
    a: "Yes. We stock a wide selection of wine along with hard seltzers and other ready-to-drink options.",
  },
  {
    q: "Can I buy lottery tickets at the drive-thru?",
    a: "Yes. We're an official Ohio Lottery retailer, so you can grab scratch-offs and draw game tickets right at the window.",
  },
  {
    q: "Do you sell tobacco products?",
    a: "Yes, we carry cigarettes, cigars, and other tobacco products. You must be 21 or older with a valid ID.",
  },
  {
    q: "Do I need my ID?",
    a: "If you're buying alcohol or tobacco, yes. Ohio law requires us to check, so have a valid photo ID ready at the window.",
  },
  {
    q: "Can you supply drinks for my wedding or party?",
    a: "Yes. We offer beverage catering for weddings, office events, parties, and more. Call (330) 334-3887 or send us a message and we'll put together what you need.",
  },
  {
    q: "Is Bear Cave locally owned?",
    a: "Yes. We're locally owned and operated right here in Wadsworth, and we've built the place around fast, friendly service.",
  },
  {
    q: "Are you hiring?",
    a: "We're always looking for friendly, reliable people. Apply through the form on our Jobs page, stop by the store, or reach out on Facebook.",
  },
  {
    q: "Do you take walk-up customers?",
    a: "The drive-thru lane is the main event, but you don't need a car. Stop in during open hours and we'll take care of you the same way.",
  },
];
