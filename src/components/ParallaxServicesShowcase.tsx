import { useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SERVICES, type Service } from "@/lib/constants";

// Adapted from the parallax-scroll-feature-section pattern.
// IMPORTANT: the original component calls useRef / useScroll / useTransform
// inside .map(), which breaks React's Rules of Hooks. Here each row is its own
// component so its hooks are called once at the top level.

function ParallaxServiceRow({
  service,
  reverse,
}: {
  service: Service;
  reverse: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  const imageOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const imageClip = useTransform(
    scrollYProgress,
    [0, 0.7],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const textY = useTransform(scrollYProgress, [0, 1], [-50, 0]);

  return (
    <div
      ref={ref}
      className={`py-12 md:py-0 md:min-h-[80vh] flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 lg:gap-28 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div style={{ y: textY }} className="max-w-md w-full">
        <p className="eyebrow text-brand-glow">{service.navTitle}</p>
        <h3 className="display text-3xl md:text-5xl mt-3 text-white">
          {service.title}
        </h3>
        <span className="mt-5 block rule-red" />
        <p className="text-white/70 mt-6 leading-relaxed">{service.intro}</p>
        <Link
          href={`/services/${service.slug}`}
          className="mt-8 inline-flex items-center gap-2 text-brand-glow font-semibold uppercase tracking-wide text-sm hover:gap-3 transition-all"
        >
          Learn more <ArrowRight size={16} />
        </Link>
      </motion.div>

      <motion.div
        style={{ opacity: imageOpacity, clipPath: imageClip }}
        className="relative w-full max-w-sm md:max-w-md"
      >
        <img
          src={service.image}
          alt={`${service.title} by Kelley Concrete and Construction`}
          className="w-full aspect-square object-cover shadow-2xl"
          loading="lazy"
          decoding="async"
        />
      </motion.div>
    </div>
  );
}

export default function ParallaxServicesShowcase() {
  return (
    <section className="depth-steel text-white overflow-hidden">
      <div className="container-x pt-20 md:pt-28">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand-glow">What We Do</p>
          <h2 className="display text-3xl md:text-5xl mt-3">
            Concrete &amp; Construction Services
          </h2>
          <span className="mt-5 block rule-red" />
          <p className="text-white/70 mt-6 leading-relaxed">
            Scroll through the work we do every day across Northeast Ohio, from
            stamped concrete patios to commercial parking lots.
          </p>
        </div>
      </div>

      <div className="container-x mt-10 flex flex-col">
        {SERVICES.map((service, i) => (
          <ParallaxServiceRow
            key={service.slug}
            service={service}
            reverse={i % 2 === 1}
          />
        ))}
      </div>

      <div className="container-x pb-20 md:pb-28 flex justify-center">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 bg-brand text-white font-semibold uppercase tracking-wide px-7 py-3.5 hover:bg-brand-light transition-colors"
        >
          See all services <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
