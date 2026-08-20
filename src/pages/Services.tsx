import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import CallToAction from "@/components/CallToAction";
import { SERVICES, IMAGES } from "@/lib/constants";

export default function Services() {
  return (
    <Layout>
      <PageHero
        label="What We Do"
        title="Concrete & Construction Services"
        subtitle="From stamped patios to commercial parking lots, one experienced crew handles the whole job, across Medina, Wayne, and Summit counties."
        image={IMAGES.stampedDark}
      />
      <section className="depth-concrete">
        <div className="container-x py-20 md:py-28 space-y-20">
          {SERVICES.map((s, i) => (
            <AnimatedSection key={s.slug}>
              <div className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <Link href={`/services/${s.slug}`} className="block overflow-hidden group">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-[340px] object-cover group-hover:scale-105 transition-transform duration-500 shadow-lg"
                  />
                </Link>
                <div>
                  <p className="eyebrow">Service {String(i + 1).padStart(2, "0")}</p>
                  <h2 className="display text-3xl md:text-4xl mt-2 text-steel">{s.title}</h2>
                  <span className="mt-4 block rule-red" />
                  <p className="text-muted-foreground text-lg mt-5 leading-relaxed">{s.intro}</p>
                  <ul className="mt-5 grid sm:grid-cols-2 gap-2.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-steel">
                        <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" /> {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-7 inline-flex items-center gap-2 bg-brand text-white font-semibold uppercase tracking-wide px-6 py-3 hover:bg-brand-dark transition-colors text-sm"
                  >
                    {s.navTitle} Details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
      <CallToAction />
    </Layout>
  );
}
