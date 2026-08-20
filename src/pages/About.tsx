import { CheckCircle2, Award, Users, ShieldCheck, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import CallToAction from "@/components/CallToAction";
import { BUSINESS, IMAGES } from "@/lib/constants";

const VALUES = [
  { icon: Award, title: "Experience", text: "Over 20 years pouring and finishing concrete across Northeast Ohio." },
  { icon: ShieldCheck, title: "Quality", text: "Proper prep, reinforcement, and finishing, built to last through Ohio winters." },
  { icon: Users, title: "Communication", text: "Clear, honest updates from estimate to final cleanup. No surprises." },
  { icon: MapPin, title: "Local", text: "Wadsworth-based and responsive. We know this region and the people in it." },
];

export default function About() {
  return (
    <Layout>
      <PageHero
        label="About Us"
        title="Built on Experience. Known for Quality."
        subtitle={`${BUSINESS.name} has been a trusted name in Northeast Ohio concrete for more than 20 years.`}
        image={IMAGES.commercialPour}
      />

      <section className="depth-concrete">
        <div className="container-x py-20 md:py-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection direction="left">
            <p className="eyebrow">Our Story</p>
            <h2 className="display text-3xl md:text-5xl mt-3 text-steel">A Reputation Poured One Job at a Time</h2>
            <span className="mt-5 block rule-red" />
            <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
              With more than 20 years of experience, {BUSINESS.name} has built a strong reputation for
              dependable residential and commercial concrete work throughout Wadsworth and Northeast Ohio.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Owner {BUSINESS.owner} leads a crew that takes pride in attention to detail, from the base
              prep you never see to the finish you'll look at every day. We handle the full job, from
              demolition and excavation through the final pour and seal, so you have one company
              accountable for the result.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Whether it's a stamped patio for your backyard or a parking lot for your business, we
              bring the same focus on quality, fair pricing, and clear communication to every project.
            </p>
            <ul className="mt-7 grid sm:grid-cols-2 gap-3">
              {["Residential & commercial", "Free, no-obligation quotes", "Full-service: demo to finish", "Honest, upfront pricing"].map((b) => (
                <li key={b} className="flex items-center gap-2 text-steel font-medium">
                  <CheckCircle2 size={18} className="text-brand shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <img
              src={IMAGES.commercialPour}
              alt={`${BUSINESS.owner} and the Kelley Concrete and Construction crew pouring a commercial slab`}
              className="w-full h-[460px] object-cover shadow-xl"
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="depth-steel text-white">
        <div className="container-x py-20 md:py-24">
          <AnimatedSection className="max-w-2xl">
            <p className="eyebrow text-brand-glow">What We Stand For</p>
            <h2 className="display text-3xl md:text-5xl mt-3">Our Values</h2>
            <span className="mt-5 block rule-red" />
          </AnimatedSection>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.08}>
                <div className="flex items-center justify-center w-14 h-14 bg-brand text-white mb-5">
                  <v.icon size={26} />
                </div>
                <h3 className="font-display uppercase text-lg tracking-wide">{v.title}</h3>
                <p className="text-white/65 text-sm mt-2 leading-relaxed">{v.text}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </Layout>
  );
}
