import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { BUSINESS, PROJECT_GALLERY } from "@/lib/constants";

// Home page hero — adapted from the AnimatedMarqueeHero pattern:
//  - Centered text with a tagline pill, animated word-stagger title, two CTAs
//  - Infinite horizontal marquee of real Kelley project photos at the bottom
//  - Mask-faded edges so the strip blends into the page
//  - Respects prefers-reduced-motion (marquee stays static for those users)

const tel = `tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`;

const FADE_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 110, damping: 22 } as const,
  },
};

const TITLE_LINE_1 = "Concrete Built on Experience.";
const TITLE_LINE_2 = "Known for Quality.";

const TRUST = [
  "Free, no-obligation quotes",
  "Residential & commercial",
  "Honest, upfront pricing",
  `Serving NE Ohio for ${BUSINESS.yearsExperience} years`,
];

// Reuse real Kelley project photos in the marquee, duplicated for seamless loop.
const marqueeImages = PROJECT_GALLERY.map((p) => ({ src: p.src, alt: p.alt }));
const duplicatedImages = [...marqueeImages, ...marqueeImages];

export default function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full min-h-[92vh] overflow-hidden bg-background flex flex-col items-center justify-center text-center px-4 pt-32 pb-72 md:pb-80">
      {/* Subtle ambient brand glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-80 w-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow/15 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl">
        {/* Tagline pill */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_VARIANTS}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur-sm px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand"
        >
          <span className="size-1.5 rounded-full bg-brand animate-pulse" />
          Wadsworth, Ohio · {BUSINESS.yearsExperience} Years Experience
        </motion.div>

        {/* Word-stagger title (preserves a single H1 for SEO) */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="display text-steel text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02]"
        >
          {TITLE_LINE_1.split(" ").map((w, i) => (
            <motion.span key={`a-${i}`} variants={FADE_VARIANTS} className="inline-block">
              {w}&nbsp;
            </motion.span>
          ))}
          <br className="hidden sm:block" />
          {TITLE_LINE_2.split(" ").map((w, i) => (
            <motion.span key={`b-${i}`} variants={FADE_VARIANTS} className="inline-block text-brand">
              {w}&nbsp;
            </motion.span>
          ))}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_VARIANTS}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          Dependable residential and commercial concrete across Northeast Ohio. Stamped patios,
          driveways, walkways, repair, and commercial flatwork.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_VARIANTS}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand text-white font-semibold uppercase tracking-wide px-7 py-3.5 shadow-lg shadow-brand/25 hover:bg-brand-light hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-brand-glow transition-all"
          >
            Request a Free Quote <ArrowRight size={16} />
          </Link>
          <a
            href={tel}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-steel/20 text-steel font-semibold uppercase tracking-wide px-7 py-3.5 hover:border-brand hover:text-brand transition-colors"
          >
            <Phone size={16} /> {BUSINESS.phone}
          </a>
        </motion.div>

        {/* Trust signals */}
        <motion.ul
          initial="hidden"
          animate="show"
          variants={FADE_VARIANTS}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-steel/75"
        >
          {TRUST.map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-brand shrink-0" /> {t}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Image marquee */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full h-56 md:h-72 [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_82%,transparent_100%)]"
      >
        <motion.div
          className="flex gap-4 h-full items-center pl-4"
          animate={
            reduceMotion
              ? undefined
              : { x: ["-50%", "0%"], transition: { ease: "linear", duration: 60, repeat: Infinity } }
          }
        >
          {duplicatedImages.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] h-44 md:h-60 flex-shrink-0 shadow-xl"
              style={{ transform: `rotate(${i % 2 === 0 ? -2 : 4}deg)` }}
            >
              <img
                src={img.src}
                alt=""
                loading={i < 4 ? "eager" : "lazy"}
                className="w-full h-full object-cover rounded-2xl ring-1 ring-black/10"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
