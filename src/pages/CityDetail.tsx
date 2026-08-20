import { Link, useParams } from "wouter";
import { ArrowRight, CheckCircle2, MapPin, Phone, Star } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import CallToAction from "@/components/CallToAction";
import NotFound from "./NotFound";
import { BUSINESS, CITIES, SERVICES, TESTIMONIALS, IMAGES } from "@/lib/constants";

const tel = `tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`;

export default function CityDetail() {
  const { slug } = useParams();
  const city = CITIES.find((c) => c.slug === slug);
  if (!city) return <NotFound />;

  return (
    <Layout>
      <PageHero
        label={`${city.county} · Northeast Ohio`}
        title={`Concrete Contractor in ${city.name}, Ohio`}
        subtitle={`Driveways, stamped patios, walkways, repair, and commercial concrete in ${city.name}, backed by 20+ years of experience.`}
        image={IMAGES.stampedDusk}
      />

      <section className="depth-concrete">
        <div className="container-x py-16 md:py-24 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <AnimatedSection>
              <p className="eyebrow">Serving {city.name}</p>
              <h2 className="display text-3xl md:text-4xl mt-2 text-steel">
                Your Local {city.name} Concrete Company
              </h2>
              <span className="mt-4 block rule-red" />
              <p className="text-lg text-steel leading-relaxed mt-6 font-medium">{city.intro}</p>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {BUSINESS.name} is based right here in Northeast Ohio, so {city.name} homeowners and
                businesses get a responsive, accountable crew that shows up, communicates clearly, and
                delivers quality concrete built to last through Ohio winters. Whether you need a new
                driveway, a stamped patio, concrete repair, or commercial flatwork, we'd be glad to
                provide a free, no-obligation quote.
              </p>

              <h3 className="display text-2xl mt-10 text-steel">Concrete Services in {city.name}</h3>
              <span className="mt-3 block rule-red" />
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="flex items-start gap-2 text-steel hover:text-brand transition-colors group"
                  >
                    <CheckCircle2 size={20} className="text-brand shrink-0 mt-0.5" />
                    <span className="font-medium group-hover:underline">{s.title}</span>
                  </Link>
                ))}
              </div>

              <p className="text-muted-foreground mt-8 leading-relaxed">
                We also serve nearby communities including {city.neighbors.join(", ")}. Not sure if
                you're in our service area? <Link href="/contact" className="text-brand font-semibold hover:underline">Get in touch</Link>. We're happy to help.
              </p>
            </AnimatedSection>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-steel text-white p-7">
                <span className="inline-flex items-center gap-1.5 text-brand-light text-xs font-bold uppercase tracking-wider">
                  <MapPin size={14} /> {city.name}, OH
                </span>
                <h3 className="font-display uppercase text-xl tracking-wide mt-2">Free Quotes in {city.name}</h3>
                <p className="text-white/70 text-sm mt-2">Call or send a message and we'll schedule a visit.</p>
                <Link href="/contact" className="mt-5 flex items-center justify-center gap-2 bg-brand text-white font-semibold uppercase tracking-wide px-5 py-3 hover:bg-brand-light transition-colors text-sm">
                  Request a Quote <ArrowRight size={15} />
                </Link>
                <a href={tel} className="mt-3 flex items-center justify-center gap-2 border border-white/25 text-white font-semibold uppercase tracking-wide px-5 py-3 hover:bg-white/10 transition-colors text-sm">
                  <Phone size={15} /> {BUSINESS.phone}
                </a>
              </div>
              <figure className="border border-border p-6 bg-white">
                <div className="flex gap-0.5 text-brand mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="text-steel text-sm leading-relaxed">"{TESTIMONIALS[0].quote}"</blockquote>
                <figcaption className="mt-3 font-display uppercase tracking-wide text-brand text-sm">{TESTIMONIALS[0].name}</figcaption>
              </figure>
            </div>
          </aside>
        </div>
      </section>

      <CallToAction heading={`Start Your ${city.name} Concrete Project`} />
    </Layout>
  );
}
