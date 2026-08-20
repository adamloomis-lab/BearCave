import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Navigation as NavArrow } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const tel = `tel:${BUSINESS.phoneDigits}`;
const directions = `https://maps.google.com/?q=${encodeURIComponent(
  `${BUSINESS.name}, ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`,
)}`;

// Sticky CTA furniture, revealed once the user scrolls past the hero:
//   • mobile: elevated floating capsule (Call + Directions)
//   • desktop: floating Directions button
// House standard: the bar "ducks" while the user is actively scrolling and
// returns ~550ms after scrolling stops, so it never rides over content.
export default function MobileCTA() {
  const [past, setPast] = useState(false);
  const [idle, setIdle] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setPast(window.scrollY > 480);
      setIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIdle(true), 550);
    };
    onScroll();
    setIdle(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const show = past && idle;

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
            <div className="flex items-center gap-2 border border-white/10 bg-cave-deep/90 p-2 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md">
              <a
                href={tel}
                aria-label={`Call ${BUSINESS.name}`}
                className="flex flex-1 items-center justify-center gap-2 border border-white/15 bg-white/10 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/20 active:scale-[0.97]"
              >
                <Phone size={17} /> Call
              </a>
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden bg-accent py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_8px_22px_-6px_rgba(150,40,30,0.8)] transition-transform active:scale-[0.97]"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:sheen_0.9s_ease]" />
                <NavArrow size={17} /> Directions
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop: floating Directions button ─────────────────────── */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="hidden lg:block fixed bottom-7 right-7 z-40"
          >
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2.5 overflow-hidden bg-accent px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_16px_40px_-10px_rgba(150,40,30,0.7)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:sheen_0.9s_ease]" />
              <NavArrow size={17} /> Get Directions
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
