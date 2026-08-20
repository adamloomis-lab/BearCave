import { Link } from "wouter";
import { ArrowRight, Navigation as NavArrow } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { BUSINESS, PRODUCTS } from "@/lib/constants";

const directions = `https://maps.google.com/?q=${encodeURIComponent(
  `${BUSINESS.name}, ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`,
)}`;

// Real photos from inside the store, labeled by what each cooler actually
// holds. Stock rotates, so copy stays at the category level.
const GALLERY: { src: string; alt: string; caption: string }[] = [
  {
    src: "/images/cooler-domestics.webp",
    alt: "Cooler door stocked with domestic beer cans and bottles",
    caption: "The domestics door: cans up top, six-packs below.",
  },
  {
    src: "/images/cooler-ohio-craft.webp",
    alt: "Cooler shelves of Ohio craft beer cans and twelve-packs",
    caption: "Ohio craft pulls its weight here.",
  },
  {
    src: "/images/cooler-imports-craft.webp",
    alt: "Cooler door of imported and craft bottles",
    caption: "Imports and bottle six-packs, floor to ceiling.",
  },
  {
    src: "/images/cooler-cocktails.webp",
    alt: "Cooler full of canned cocktails and hard seltzers",
    caption: "The canned-cocktail wall.",
  },
  {
    src: "/images/cooler-seasonal.webp",
    alt: "Cooler with summer beers, hard ciders, and ready-to-drink bottles",
    caption: "Seasonal rotation, always cold.",
  },
  {
    src: "/images/cooler-singles.webp",
    alt: "Cooler of single tall cans",
    caption: "Singles and tall boys when you just need one.",
  },
  {
    src: "/images/shelf-summer.webp",
    alt: "Shelf of summer beer six-packs",
    caption: "Summer stock on deck.",
  },
  {
    src: "/images/shelf-vodka-ades.webp",
    alt: "Vodka-ade variety packs on a cooler shelf",
    caption: "Vodka-ade variety packs on the shelf.",
  },
  {
    src: "/images/shelf-fall-seasonals.webp",
    alt: "Rack of fall seasonal beers and ciders",
    caption: "Fall seasonals roll in every year.",
  },
  {
    src: "/images/shelf-summer-12packs.webp",
    alt: "Twelve-packs of summer lagers and shandies stacked on a shelf",
    caption: "Twelve-packs, stacked and ready.",
  },
  {
    src: "/images/superlyte-can.webp",
    alt: "A hand holding a tall can of SuperLyte vodka-ade inside the store",
    caption: "A tall boy, straight out of the cooler.",
  },
];

export default function Products() {
  return (
    <Layout>
      <PageHero
        title="What's in the cave"
        subtitle="Every cooler in the building, from the domestics door to the canned-cocktail wall. Stock rotates with the season, so consider this a preview."
      />

      {/* Category grid */}
      <section className="depth-frost">
        <div className="container-x py-16 md:py-24">
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <AnimatedSection key={p.slug} delay={(i % 3) * 0.05}>
                <div className="flex h-full flex-col bg-white p-7">
                  <span className="display text-4xl text-brand-ice">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="display mt-3 text-2xl text-foreground">{p.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.short}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <p className="plaque mt-8">
            Valid ID required for alcohol &amp; tobacco · 21+
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="depth-ice">
        <div className="container-x py-16 md:py-24">
          <AnimatedSection className="max-w-2xl">
            <h2 className="display text-3xl md:text-5xl text-foreground">Inside the coolers</h2>
            <span className="mt-4 block rule-ice" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Shot on our phones between customers. This is what the cave looks like on a
              regular day.
            </p>
          </AnimatedSection>
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>figure]:mb-4 [&>figure]:break-inside-avoid">
            {GALLERY.map((g) => (
              <figure key={g.src} className="border border-border bg-white p-2">
                <img src={g.src} alt={g.alt} className="h-auto w-full" loading="lazy" />
                <figcaption className="px-1.5 py-2 text-xs text-muted-foreground">
                  {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="depth-cave text-white">
        <div className="container-x flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <AnimatedSection>
            <h2 className="display text-3xl text-white">The rest is behind the window.</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-white/70">
              If you're after something specific, call ahead and we'll tell you if it's in
              the cooler before you drive over.
            </p>
          </AnimatedSection>
          <AnimatedSection direction="right" className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-accent px-7 py-4 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent-deep"
            >
              <NavArrow size={16} /> Directions
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 border border-white/30 px-7 py-4 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
            >
              Hours &amp; Contact <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
