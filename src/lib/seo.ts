import { BUSINESS, PRODUCTS, FAQS, GOOGLE_RATING, GOOGLE_REVIEWS, IMAGES } from "./constants";

// Staging domain until the client's domain cutover; canonicals flip then.
export const SITE_URL = "https://bear-cave-drive-thru.netlify.app";

export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// Page URLs are served with a trailing slash by Netlify's pretty-URLs, so
// canonical / breadcrumb / sitemap URLs must match to avoid redirect mismatches.
export const pageUrl = (path: string) =>
  abs(path === "/" ? "/" : path.endsWith("/") ? path : `${path}/`);

// Core LiquorStore / ConvenienceStore node, reused across pages.
export function localBusinessSchema() {
  const a = BUSINESS.address;
  return {
    "@context": "https://schema.org",
    "@type": ["LiquorStore", "ConvenienceStore", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    alternateName: BUSINESS.shortName,
    url: SITE_URL,
    image: abs(IMAGES.building),
    logo: abs(IMAGES.logo),
    telephone: BUSINESS.phone,
    priceRange: "$",
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.state,
      postalCode: a.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    areaServed: { "@type": "City", name: `${a.city}, OH` },
    openingHoursSpecification: BUSINESS.hoursSpec.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [BUSINESS.social.facebook],
    slogan: BUSINESS.tagline,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: GOOGLE_RATING.value,
      reviewCount: GOOGLE_RATING.count,
      bestRating: 5,
      worstRating: 1,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: BUSINESS.phone,
        areaServed: "US-OH",
        availableLanguage: ["en"],
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS.name,
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}

function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: pageUrl(it.path),
    })),
  };
}

function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function reviewNodes() {
  return GOOGLE_REVIEWS.map((r) => ({
    "@type": "Review",
    reviewBody: r.text,
    author: { "@type": "Person", name: r.author },
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    datePublished: r.publishTime.slice(0, 10),
  }));
}

export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  jsonLd: object[];
};

const DEFAULT_OG = abs(IMAGES.building);
const PRODUCT_NAMES = PRODUCTS.map((p) => p.title).join(", ");

// Resolve full SEO metadata for any route. Single source of truth for both
// the client <Seo> component and the build-time prerender script.
export function getPageMeta(rawPath: string): PageMeta {
  const path = rawPath !== "/" ? rawPath.replace(/\/$/, "") : "/";

  switch (path) {
    case "/":
      return {
        title: `${BUSINESS.name} | The Coldest Beer in Town, Without Leaving Your Car`,
        description: `Wadsworth's drive-thru beverage store. Beer, wine, seltzers, pop, snacks, candy, and lottery handed through your car window at 474 College St. In and out in about a minute. Open seven days.`,
        canonical: pageUrl("/"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          { ...localBusinessSchema(), review: reviewNodes() },
          websiteSchema(),
          faqSchema(FAQS),
        ],
      };
    case "/products":
      return {
        title: `What's in the Cave | ${BUSINESS.name}`,
        description: `${PRODUCT_NAMES} at Bear Cave in Wadsworth, OH. Cold coolers stocked seven days a week at 474 College St. Call ${BUSINESS.phone}.`,
        canonical: pageUrl("/products"),
        ogImage: abs(IMAGES.coolers),
        jsonLd: [
          localBusinessSchema(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
        ],
      };
    case "/catering":
      return {
        title: `Beverage Catering in Wadsworth, OH | ${BUSINESS.name}`,
        description: `Bear Cave supplies drinks for weddings, office events, and parties around Wadsworth. Tell us the headcount and we'll handle the coolers. Call ${BUSINESS.phone}.`,
        canonical: pageUrl("/catering"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          localBusinessSchema(),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Beverage catering",
            name: "Beverage Catering in Wadsworth, OH",
            description:
              "Drink supply for weddings, office events, and parties: beer, wine, seltzers, soda, and mixers, kept cold.",
            url: pageUrl("/catering"),
            provider: { "@id": `${SITE_URL}/#business` },
            areaServed: { "@type": "City", name: "Wadsworth, OH" },
          },
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Catering", path: "/catering" },
          ]),
        ],
      };
    case "/jobs":
      return {
        title: `Jobs at Bear Cave | ${BUSINESS.name}`,
        description: `Bear Cave in Wadsworth is hiring friendly, reliable people. Apply online, stop by 474 College St, or message us on Facebook.`,
        canonical: pageUrl("/jobs"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          localBusinessSchema(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Jobs", path: "/jobs" },
          ]),
        ],
      };
    case "/contact":
      return {
        title: `Hours, Directions & Contact | ${BUSINESS.name}`,
        description: `Find Bear Cave at 474 College St, Wadsworth, OH 44281. Open seven days. Call ${BUSINESS.phone} or send a message.`,
        canonical: pageUrl("/contact"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          localBusinessSchema(),
          faqSchema(FAQS),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ],
      };
    case "/privacy":
      return {
        title: `Privacy Policy | ${BUSINESS.name}`,
        description: `How ${BUSINESS.name} collects, uses, and protects information from visitors to this website.`,
        canonical: pageUrl("/privacy"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          localBusinessSchema(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy" },
          ]),
        ],
      };
    case "/terms":
      return {
        title: `Terms of Use | ${BUSINESS.name}`,
        description: `The terms that govern your use of the ${BUSINESS.name} website.`,
        canonical: pageUrl("/terms"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          localBusinessSchema(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Terms of Use", path: "/terms" },
          ]),
        ],
      };
    case "/accessibility":
      return {
        title: `Accessibility Statement | ${BUSINESS.name}`,
        description: `${BUSINESS.name} is committed to making this website accessible to everyone. Read our commitments and how to report issues.`,
        canonical: pageUrl("/accessibility"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          localBusinessSchema(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Accessibility", path: "/accessibility" },
          ]),
        ],
      };
    default:
      return {
        title: `Page Not Found | ${BUSINESS.name}`,
        description: `Sorry, we couldn't find that page. ${BUSINESS.name} is Wadsworth's drive-thru beverage store at 474 College St.`,
        canonical: pageUrl(path),
        ogImage: DEFAULT_OG,
        jsonLd: [localBusinessSchema()],
      };
  }
}

// Every path that should be prerendered to static HTML + listed in the sitemap.
export const ALL_ROUTES: string[] = [
  "/",
  "/products",
  "/catering",
  "/jobs",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
];
