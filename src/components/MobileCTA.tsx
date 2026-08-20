import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, FileText, ArrowRight } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const tel = `tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`;

// Two pieces of sticky-CTA furniture, both revealed once the user scrolls past
// the hero:
//   • an elevated floating capsule on mobile (Call glassy + Quote primary)
//   • a single floating pill on desktop linking to the quote page
export default function MobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Mobile: elevated floating capsule ───────────────────────── */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="lg:hidden fixed inset-x-3 bottom-3 z-40"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-steel-dark/85 p-2 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md">
              <a
                href={tel}
                aria-label={`Call ${BUSINESS.name}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/20 active:scale-[0.97]"
              >
                <Phone size={17} /> Call
              </a>
              <Link
                href="/contact"
                className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_8px_22px_-6px_rgba(108,23,25,0.8)] transition-transform active:scale-[0.97] motion-safe:animate-glow-pulse"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:sheen_0.9s_ease]" />
                <FileText size={17} /> Free Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop: floating primary-CTA pill ──────────────────────── */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="hidden lg:block fixed bottom-7 right-7 z-40"
          >
            <Link
              href="/contact"
              className="group relative flex items-center gap-2.5 overflow-hidden rounded-full bg-brand px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_16px_40px_-10px_rgba(108,23,25,0.7)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] motion-safe:animate-glow-pulse"
            >
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:sheen_0.9s_ease]" />
              <FileText size={17} /> Free Estimate
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
