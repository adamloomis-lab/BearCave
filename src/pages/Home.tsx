import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Users,
  ShieldCheck,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import CallToAction from "@/components/CallToAction";
import HomeHero from "@/components/HomeHero";
import Reviews from "@/components/Reviews";
import ParallaxServicesShowcase from "@/components/ParallaxServicesShowcase";
import { BUSINESS, CITIES, IMAGES, PROJECT_GALLERY } from "@/lib/constants";

const STATS = [
  { value: "20+", label: "Years of Experience" },
  { value: "Res. + Comm.", label: "Residential & Commercial" },
  { value: "Free", label: "No-Obligation Quotes" },
  { value: "3", label: "Counties Served" },
];

const WHY = [
  { icon: Award, title: "20+ Years of Experience", text: "Two decades of dependable concrete work across Northeast Ohio, and a reputation built one project at a time." },
  { icon: Users, title: "One Accountable Crew", text: "From demolition to the final finish, your project is handled by one experienced team, not a chain of subcontractors." },
  { icon: ShieldCheck, title: "Quality That Lasts", text: "Proper base prep, reinforcement, and finishing built to stand up to Ohio's freeze-thaw winters." },
  { icon: MapPin, title: "Local & Responsive", text: "Based in Wadsworth, serving Medina, Wayne, and western Summit counties. We answer the phone and show up." },
];

export default function Home() {
  return (
    <Layout>
      <HomeHero />

      {/* Stats band */}
      <section className="bg-brand text-white">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/15">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="py-8 px-4 text-center"
            >
              <div className="display text-2xl md:text-3xl">{s.value}</div>
              <div className="text-xs md:text-sm uppercase tracking-wider text-white/75 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Intro / value prop */}
      <section className="depth-concrete">
        <div className="container-x py-20 md:py-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection direction="left">
            <p className="eyebrow">Wadsworth's Concrete Specialists</p>
            <h2 className="display text-3xl md:text-5xl mt-3 text-steel">
              Reliable Concrete &amp; Construction in Northeast Ohio
            </h2>
            <span className="mt-5 block rule-red" />
            <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
              {BUSINESS.blurb}
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              From a single stamped patio to a full commercial parking lot, owner {BUSINESS.owner} and
              his crew bring the same focus on quality, clear communication, and fair pricing to every
              job.
            </p>
            <ul className="mt-7 grid sm:grid-cols-2 gap-3">
              {["Free, no-obligation quotes", "Residential & commercial", "Honest, upfront pricing", "Clean, professional crews"].map((b) => (
                <li key={b} className="flex items-center gap-2 text-steel font-medium">
                  <CheckCircle2 size={18} className="text-brand shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </AnimatedSection>
          <AnimatedSection direction="right" className="relative">
            <img
              src={IMAGES.stampedTan}
              alt="Stamped concrete patio with decorative border by Kelley Concrete and Construction"
              className="w-full h-[420px] object-cover shadow-xl"
            />
            <div className="hidden md:block absolute -bottom-6 -left-6 bg-steel text-white px-6 py-5 shadow-xl">
              <div className="display text-3xl text-brand-glow">{BUSINESS.yearsExperience}</div>
              <div className="text-xs uppercase tracking-wider text-white/75">Years in Business</div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services — parallax scroll showcase */}
      <ParallaxServicesShowcase />

      {/* Why choose us */}
      <section className="depth-white">
        <div className="container-x py-20 md:py-28">
          <AnimatedSection className="max-w-2xl">
            <p className="eyebrow">Why Kelley</p>
            <h2 className="display text-3xl md:text-5xl mt-3 text-steel">Built on Experience. Known for Quality.</h2>
            <span className="mt-5 block rule-red" />
          </AnimatedSection>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY.map((w, i) => (
              <AnimatedSection key={w.title} delay={i * 0.08}>
                <div className="flex items-center justify-center w-14 h-14 bg-brand/10 text-brand mb-5">
                  <w.icon size={26} />
                </div>
                <h3 className="font-display uppercase text-lg tracking-wide text-steel">{w.title}</h3>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{w.text}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="depth-concrete">
        <div className="container-x py-20 md:py-28">
          <AnimatedSection className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow">Recent Work</p>
              <h2 className="display text-3xl md:text-5xl mt-3 text-steel">Project Gallery</h2>
              <span className="mt-5 block rule-red" />
            </div>
            <Link href="/projects" className="inline-flex items-center gap-1.5 text-brand font-semibold uppercase tracking-wide text-sm hover:gap-3 transition-all">
              View All Projects <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
            {PROJECT_GALLERY.slice(0, 6).map((p, i) => (
              <AnimatedSection key={p.src} delay={i * 0.05}>
                <div className="relative overflow-hidden group aspect-[4/3]">
                  <img src={p.src} alt={p.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="depth-steel text-white">
        <div className="container-x py-20 md:py-24">
          <AnimatedSection className="max-w-2xl">
            <p className="eyebrow text-brand-glow">Service Area</p>
            <h2 className="display text-3xl md:text-5xl mt-3">Proudly Serving Northeast Ohio</h2>
            <span className="mt-5 block rule-red" />
            <p className="text-white/75 mt-6 text-lg">
              Based in Wadsworth and serving the surrounding communities within a 30-mile radius,
              across Medina, Wayne, and western Summit counties.
            </p>
          </AnimatedSection>
          <div className="mt-10 flex flex-wrap gap-3">
            {CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/service-area/${c.slug}`}
                className="bg-white/10 hover:bg-brand border border-white/15 px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Real Google reviews (SSR baked, live-refreshed on mount via /api/reviews) */}
      <Reviews />

      <CallToAction />
    </Layout>
  );
}
