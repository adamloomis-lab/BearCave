import { BUSINESS, SERVICES, CITIES, GOOGLE_RATING, GOOGLE_REVIEWS, IMAGES } from "./constants";

// Production domain (cutover 2026-06-01). The netlify.app subdomain still serves
// the site as an alias, but all canonicals / OG / JSON-LD reference the real domain.
export const SITE_URL = "https://kelleyconstructionohio.com";

export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

// Page URLs are served with a trailing slash by Netlify's pretty-URLs, so
// canonical / breadcrumb / sitemap URLs must match to avoid redirect mismatches.
export const pageUrl = (path: string) =>
  abs(path === "/" ? "/" : path.endsWith("/") ? path : `${path}/`);

// ~30-mile service radius around Wadsworth, plus the named cities we target.
const AREA_SERVED = [
  {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    geoRadius: "48280", // 30 miles in meters
  },
  ...CITIES.map((c) => ({ "@type": "City", name: `${c.name}, OH` })),
];

// Core GeneralContractor / LocalBusiness node, reused across pages.
export function localBusinessSchema() {
  const a = BUSINESS.address;
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    image: abs(IMAGES.heroStampedSteps),
    logo: abs(IMAGES.logo),
    telephone: BUSINESS.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street || undefined,
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
    areaServed: AREA_SERVED,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: BUSINESS.hoursSpec.weekdays.days,
        opens: BUSINESS.hoursSpec.weekdays.opens,
        closes: BUSINESS.hoursSpec.weekdays.closes,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: BUSINESS.hoursSpec.saturday.days,
        opens: BUSINESS.hoursSpec.saturday.opens,
        closes: BUSINESS.hoursSpec.saturday.closes,
      },
    ],
    sameAs: [BUSINESS.social.facebook, BUSINESS.social.instagram].filter(Boolean),
    foundingDate: String(BUSINESS.founded),
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
  if (BUSINESS.googleBusinessProfile) {
    (node.sameAs as string[]).push(BUSINESS.googleBusinessProfile);
  }
  return node;
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

function serviceSchema(name: string, description: string, path: string, areaName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name: areaName ? `${name} in ${areaName}, OH` : name,
    description,
    url: pageUrl(path),
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: areaName ? { "@type": "City", name: `${areaName}, OH` } : AREA_SERVED,
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

const DEFAULT_OG = abs(IMAGES.heroStampedSteps);
const CITY_NAMES = CITIES.map((c) => c.name).join(", ");

// Resolve full SEO metadata for any route. Single source of truth for both
// the client <Seo> component and the build-time prerender script.
export function getPageMeta(rawPath: string): PageMeta {
  const path = rawPath !== "/" ? rawPath.replace(/\/$/, "") : "/";

  // /services/:slug
  if (path.startsWith("/services/")) {
    const slug = path.split("/")[2];
    const svc = SERVICES.find((s) => s.slug === slug);
    if (svc) {
      return {
        title: `${svc.title} in Wadsworth & Northeast Ohio | ${BUSINESS.name}`,
        description: `${svc.intro} Serving ${CITY_NAMES}. Free quotes. Call ${BUSINESS.phone}.`,
        canonical: pageUrl(path),
        ogImage: abs(svc.image),
        jsonLd: [
          localBusinessSchema(),
          serviceSchema(svc.title, svc.intro, path),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: svc.navTitle, path },
          ]),
          ...(svc.faqs.length ? [faqSchema(svc.faqs)] : []),
        ],
      };
    }
  }

  // /service-area/:city
  if (path.startsWith("/service-area/")) {
    const slug = path.split("/")[2];
    const city = CITIES.find((c) => c.slug === slug);
    if (city) {
      return {
        title: `Concrete Contractor in ${city.name}, OH | Driveways, Patios & Stamped Concrete`,
        description: `${BUSINESS.name} provides concrete driveways, stamped patios, repair, and commercial concrete in ${city.name}, ${city.county}. 20+ years of experience. Free quotes. Call ${BUSINESS.phone}.`,
        canonical: pageUrl(path),
        ogImage: DEFAULT_OG,
        jsonLd: [
          localBusinessSchema(),
          serviceSchema("Concrete Contractor", `Concrete driveways, patios, stamped concrete, repair, and commercial concrete in ${city.name}, ${city.county}.`, path, city.name),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Service Area", path: "/service-area" },
            { name: city.name, path },
          ]),
          faqSchema([
            {
              q: `Do you offer concrete services in ${city.name}, Ohio?`,
              a: `Yes. ${BUSINESS.name} serves ${city.name} and the surrounding ${city.county} area with concrete driveways, stamped patios, walkways, concrete repair, demolition, excavation, and commercial concrete.`,
            },
            {
              q: `How do I get a free concrete quote in ${city.name}?`,
              a: `Call ${BUSINESS.phone} or request a quote through our contact page. We'll schedule a visit, review your project, and provide a free, no-obligation estimate.`,
            },
          ]),
        ],
      };
    }
  }

  switch (path) {
    case "/":
      return {
        title: `${BUSINESS.name} | Concrete Contractor in Wadsworth, OH`,
        description: `${BUSINESS.blurb} Stamped concrete, driveways, patios, repair & commercial concrete. Free quotes. Call ${BUSINESS.phone}.`,
        canonical: pageUrl("/"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          { ...localBusinessSchema(), review: reviewNodes() },
          websiteSchema(),
        ],
      };
    case "/services":
      return {
        title: `Concrete & Construction Services | ${BUSINESS.name}`,
        description: `Stamped concrete, driveways & flatwork, patios & walkways, concrete repair, demolition & excavation, and commercial concrete across Northeast Ohio. Free quotes. Call ${BUSINESS.phone}.`,
        canonical: pageUrl("/services"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          localBusinessSchema(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ],
      };
    case "/service-area":
      return {
        title: `Service Area | Concrete Contractor Serving Medina, Wayne & Summit Counties`,
        description: `${BUSINESS.name} serves ${CITY_NAMES} and the wider Northeast Ohio region with residential and commercial concrete. Free quotes. Call ${BUSINESS.phone}.`,
        canonical: pageUrl("/service-area"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          localBusinessSchema(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Service Area", path: "/service-area" },
          ]),
        ],
      };
    case "/projects":
      return {
        title: `Project Gallery | ${BUSINESS.name}`,
        description: `See recent stamped concrete patios, driveways, walkways, retaining walls, and commercial concrete projects completed by ${BUSINESS.name} across Northeast Ohio.`,
        canonical: pageUrl("/projects"),
        ogImage: abs(IMAGES.stampedTan),
        jsonLd: [
          localBusinessSchema(),
          {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "Concrete Driveway & Patio Project, Kelley Concrete and Construction",
            description:
              "Time-lapse of the Kelley Concrete and Construction crew pouring and finishing a residential concrete driveway and patio in Northeast Ohio.",
            thumbnailUrl: abs("/videos/driveway-patio-project-poster.jpg"),
            contentUrl: abs("/videos/driveway-patio-project.mp4"),
            uploadDate: "2026-05-21",
            publisher: { "@id": `${SITE_URL}/#business` },
          },
        ],
      };
    case "/about":
      return {
        title: `About | ${BUSINESS.name}, 20+ Years in Wadsworth, Ohio`,
        description: `For more than 20 years, ${BUSINESS.name} has provided dependable residential and commercial concrete work across Northeast Ohio. Meet the team and our approach.`,
        canonical: pageUrl("/about"),
        ogImage: abs(IMAGES.commercialPour),
        jsonLd: [
          localBusinessSchema(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ],
      };
    case "/contact":
      return {
        title: `Contact & Free Quote | ${BUSINESS.name}`,
        description: `Request a free concrete quote from ${BUSINESS.name}. Call ${BUSINESS.phone} or send a message. Serving Wadsworth and Northeast Ohio.`,
        canonical: pageUrl("/contact"),
        ogImage: DEFAULT_OG,
        jsonLd: [
          localBusinessSchema(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ],
      };
    case "/privacy":
      return {
        title: `Privacy Policy | ${BUSINESS.name}`,
        description: `How ${BUSINESS.name} collects, uses, and protects information from visitors to kelleyconstructionohio.com.`,
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
        description: `Sorry, we couldn't find that page. ${BUSINESS.name} provides concrete and construction services across Northeast Ohio.`,
        canonical: pageUrl(path),
        ogImage: DEFAULT_OG,
        jsonLd: [localBusinessSchema()],
      };
  }
}

// Every path that should be prerendered to static HTML + listed in the sitemap.
export const ALL_ROUTES: string[] = [
  "/",
  "/services",
  ...SERVICES.map((s) => `/services/${s.slug}`),
  "/service-area",
  ...CITIES.map((c) => `/service-area/${c.slug}`),
  "/projects",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
];
