import { Link, useParams } from "wouter";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import CallToAction from "@/components/CallToAction";
import NotFound from "./NotFound";
import { BUSINESS, SERVICES, PROJECT_GALLERY } from "@/lib/constants";

const tel = `tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`;

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return <NotFound />;

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <Layout>
      <PageHero label="Concrete Service" title={service.title} subtitle={service.short} image={service.image} />

      <section className="depth-concrete">
        <div className="container-x py-16 md:py-24 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <AnimatedSection>
              <p className="text-xl text-steel leading-relaxed font-medium">{service.intro}</p>
              {service.body.map((p) => (
                <p key={p.slice(0, 24)} className="text-muted-foreground mt-5 leading-relaxed">{p}</p>
              ))}

              <h2 className="display text-2xl md:text-3xl mt-10 text-steel">What's Included</h2>
              <span className="mt-3 block rule-red" />
              <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                {service.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-steel">
                    <CheckCircle2 size={20} className="text-brand shrink-0 mt-0.5" /> {b}
                  </li>
                ))}
              </ul>

              {service.faqs.length > 0 && (
                <>
                  <h2 className="display text-2xl md:text-3xl mt-12 text-steel">Frequently Asked Questions</h2>
                  <span className="mt-3 block rule-red" />
                  <div className="mt-6 divide-y divide-border border-y border-border">
                    {service.faqs.map((f) => (
                      <div key={f.q} className="py-5">
                        <h3 className="font-display uppercase tracking-wide text-lg text-steel">{f.q}</h3>
                        <p className="text-muted-foreground mt-2 leading-relaxed">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-steel text-white p-7">
                <h3 className="font-display uppercase text-xl tracking-wide">Get a Free Quote</h3>
                <p className="text-white/70 text-sm mt-2">Tell us about your project and we'll get you a fair, no-obligation estimate.</p>
                <Link href="/contact" className="mt-5 flex items-center justify-center gap-2 bg-brand text-white font-semibold uppercase tracking-wide px-5 py-3 hover:bg-brand-light transition-colors text-sm">
                  Request a Quote <ArrowRight size={15} />
                </Link>
                <a href={tel} className="mt-3 flex items-center justify-center gap-2 border border-white/25 text-white font-semibold uppercase tracking-wide px-5 py-3 hover:bg-white/10 transition-colors text-sm">
                  <Phone size={15} /> {BUSINESS.phone}
                </a>
              </div>
              <div className="border border-border p-7">
                <h3 className="font-display uppercase text-lg tracking-wide text-steel">Other Services</h3>
                <ul className="mt-4 space-y-3">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link href={`/services/${o.slug}`} className="flex items-center justify-between gap-2 text-steel hover:text-brand transition-colors group">
                        <span className="font-medium">{o.navTitle}</span>
                        <ArrowRight size={15} className="text-brand group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="bg-steel-dark">
        <div className="container-x py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PROJECT_GALLERY.slice(0, 4).map((p) => (
              <div key={p.src} className="overflow-hidden aspect-square group">
                <img src={p.src} alt={p.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </Layout>
  );
}
