import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "kc.cookieConsent";

// Dismissible cookie notice. Renders nothing during prerender (useEffect-gated),
// so there's no flash of content on first paint. Sits above the mobile CTA bar.
export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setShow(true), 700);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage blocked (private mode) — show the banner anyway.
      const t = setTimeout(() => setShow(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // best-effort
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35 }}
          role="region"
          aria-label="Cookie consent"
          className="fixed z-50 inset-x-3 bottom-[68px] lg:inset-x-auto lg:left-4 lg:right-auto lg:bottom-4 lg:max-w-md bg-steel text-white shadow-2xl ring-1 ring-white/10 p-5"
        >
          <div className="flex items-start gap-3">
            <Cookie size={22} className="text-brand-glow shrink-0 mt-0.5" />
            <div className="flex-1 text-sm leading-relaxed text-white/85">
              This site uses cookies to keep things running smoothly. We never sell your data. See
              our{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-brand-glow">
                Privacy Policy
              </Link>{" "}
              for details.
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => dismiss("accepted")}
              className="flex-1 bg-brand text-white font-semibold uppercase tracking-wide text-sm py-2.5 hover:bg-brand-light transition-colors"
            >
              Got It
            </button>
            <button
              type="button"
              onClick={() => dismiss("declined")}
              className="flex-1 bg-white/10 text-white/80 font-semibold uppercase tracking-wide text-sm py-2.5 hover:bg-white/20 transition-colors"
            >
              No Thanks
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
