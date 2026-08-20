import { Link } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import CallToAction from "@/components/CallToAction";
import { CITIES, IMAGES } from "@/lib/constants";

const COUNTIES = ["Medina County", "Wayne County", "Summit County"];

export default function ServiceArea() {
  return (
    <Layout>
      <PageHero
        label="Service Area"
        title="Concrete Contractor Serving Northeast Ohio"
        subtitle="Based in Wadsworth and serving homeowners and businesses across Medina, Wayne, and western Summit counties."
        image={IMAGES.drivewayWide}
      />

      <section className="depth-concrete">
        <div className="container-x py-20 md:py-28">
          <AnimatedSection className="max-w-3xl">
            <p className="eyebrow">Where We Work</p>
            <h2 className="display text-3xl md:text-5xl mt-3 text-steel">Local to Northeast Ohio</h2>
            <span className="mt-5 block rule-red" />
            <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
              We're a Wadsworth-based concrete and construction company, which means we know the soil,
              the permitting, and the freeze-thaw conditions in this part of Ohio. We serve communities
              within roughly a 30-mile radius of Wadsworth, spanning Medina, Wayne, and western Summit
              counties. Choose your town below for details on the services we offer there.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {COUNTIES.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 bg-brand/10 text-brand px-4 py-2 text-sm font-semibold uppercase tracking-wide">
                  <MapPin size={15} /> {c}
                </span>
              ))}
            </div>
          </AnimatedSection>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CITIES.map((c, i) => (
              <AnimatedSection key={c.slug} delay={i * 0.05}>
                <Link
                  href={`/service-area/${c.slug}`}
                  className="group block h-full bg-white border border-border p-7 hover:border-brand hover:-translate-y-1 transition-all duration-300"
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.county}</p>
                  <h3 className="font-display uppercase text-2xl tracking-wide text-steel mt-1 group-hover:text-brand transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed line-clamp-3">{c.intro}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-brand text-sm font-semibold uppercase tracking-wide">
                    Concrete in {c.name} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </Layout>
  );
}
