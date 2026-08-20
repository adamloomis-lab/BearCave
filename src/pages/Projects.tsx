import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import CallToAction from "@/components/CallToAction";
import FeaturedVideo from "@/components/FeaturedVideo";
import ProjectCarousel from "@/components/ProjectCarousel";
import { PROJECT_GALLERY, IMAGES } from "@/lib/constants";

export default function Projects() {
  return (
    <Layout>
      <PageHero
        label="Our Work"
        title="Project Gallery"
        subtitle="A look at recent stamped patios, driveways, walkways, retaining walls, and commercial concrete completed across Northeast Ohio."
        image={IMAGES.stampedGray}
      />

      {/* Featured project video */}
      <section className="depth-steel text-white">
        <div className="container-x py-20 md:py-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection direction="left">
            <p className="eyebrow text-brand-glow">Watch Our Crew</p>
            <h2 className="display text-3xl md:text-5xl mt-3">A Driveway &amp; Patio, Start to Finish</h2>
            <span className="mt-5 block rule-red" />
            <p className="text-white/75 text-lg mt-6 leading-relaxed">
              See what goes into a Kelley concrete pour, from prepping and forming the base to
              placing, screeding, and finishing a fresh driveway and patio. It's the same care and
              experienced crew you'll get on your project.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 bg-brand text-white font-semibold uppercase tracking-wide px-7 py-3.5 hover:bg-brand-light transition-colors"
            >
              Start Your Project <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <FeaturedVideo
              src="/videos/driveway-patio-project.mp4"
              poster="/videos/driveway-patio-project-poster.jpg"
              label="Watch the Pour"
            />
          </AnimatedSection>
        </div>
      </section>
      {/* Project gallery — interactive card fan */}
      <section className="depth-concrete relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
        </div>
        <div className="container-x pt-16 md:pt-20 pb-10 relative text-center">
          <p className="eyebrow">Recent Work</p>
          <h2 className="display text-3xl md:text-5xl mt-3 text-steel">A Closer Look at the Work</h2>
          <span className="mt-5 block rule-red mx-auto" />
          <p className="text-muted-foreground mt-5 max-w-xl mx-auto">
            Hover any card to spotlight it. Drag through the deck to browse recent stamped patios,
            driveways, walkways, and commercial pours from across Northeast Ohio.
          </p>
        </div>
        <div className="container-x">
          <ProjectCarousel
            images={PROJECT_GALLERY.map((p) => ({ src: p.src, alt: p.alt }))}
          />
        </div>
        <div className="pb-12 md:pb-20" />
      </section>
      <CallToAction heading="Want Results Like These?" />
    </Layout>
  );
}
