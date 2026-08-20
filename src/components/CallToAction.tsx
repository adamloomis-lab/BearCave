import { Link } from "wouter";
import { Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import AnimatedSection from "./AnimatedSection";

const tel = `tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`;

export default function CallToAction({
  heading = "Ready to Get Started on Your Project?",
  text = "Planning a concrete or construction project? We'd be glad to help. Reach out for a free, no-obligation quote.",
}: {
  heading?: string;
  text?: string;
}) {
  return (
    <section className="depth-steel text-white">
      <div className="container-x py-16 md:py-20">
        <AnimatedSection className="max-w-3xl">
          <p className="eyebrow text-brand-glow">Free Quotes</p>
          <h2 className="display text-3xl md:text-5xl mt-3">{heading}</h2>
          <p className="text-white/75 text-lg mt-5">{text}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brand text-white font-semibold uppercase tracking-wide px-7 py-3.5 hover:bg-brand-light transition-colors"
            >
              Request a Free Quote
            </Link>
            <a
              href={tel}
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold uppercase tracking-wide px-7 py-3.5 hover:bg-white/10 transition-colors"
            >
              <Phone size={16} /> {BUSINESS.phone}
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
