import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  ArrowRight,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  FileText,
} from "lucide-react";
import { BUSINESS, NAV_LINKS, IMAGES } from "@/lib/constants";

const tel = `tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [location] = useLocation();

  // Re-arm the staggered link reveal on every open (double rAF) so it fires
  // reliably on first open AND after open -> close -> reopen.
  useEffect(() => {
    if (!mobileOpen) {
      setRevealed(false);
      return;
    }
    setRevealed(false);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRevealed(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock + Escape close while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location === href || location.startsWith(href + "/");

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">
        {/* Steel utility bar — collapses on scroll */}
        <div
          className="depth-steel text-white/85 overflow-hidden transition-all duration-500 ease-out"
          style={{ maxHeight: scrolled ? 0 : 40, opacity: scrolled ? 0 : 1 }}
        >
          <div className="container-x flex items-center justify-between py-2 text-[12px] tracking-wide">
            <span className="hidden sm:inline uppercase tracking-[0.15em] text-white/70">
              Serving Wadsworth &amp; Northeast Ohio · {BUSINESS.yearsExperience} Years Experience
            </span>
            <a href={tel} className="flex items-center gap-2 font-semibold hover:text-white">
              <Phone size={13} /> {BUSINESS.phone}
            </a>
          </div>
        </div>

        {/* White nav row */}
        <nav
          className={`bg-white border-b transition-all duration-300 ${
            scrolled ? "border-border shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : "border-transparent"
          }`}
        >
          <div
            className={`container-x flex items-center justify-between transition-all duration-300 ${
              scrolled ? "py-2.5" : "py-3.5"
            }`}
          >
            <Link href="/" className="shrink-0" aria-label={`${BUSINESS.name} home`}>
              <img
                src={IMAGES.logo}
                alt={BUSINESS.name}
                className={`w-auto transition-all duration-300 ${scrolled ? "h-10 md:h-11" : "h-12 md:h-14"}`}
              />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[13px] font-semibold tracking-wide uppercase transition-colors relative group ${
                      active ? "text-brand" : "text-steel hover:text-brand"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-[2px] bg-brand transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
              <Link
                href="/contact"
                className="bg-brand text-white text-[13px] font-semibold uppercase tracking-wide px-5 py-2.5 hover:bg-brand-dark transition-colors"
              >
                Free Quote
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-steel p-1.5"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            {/* Blurred dark backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-steel-dark/70 backdrop-blur-sm"
            />

            {/* Right slide-in panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="depth-steel absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto shadow-[0_0_60px_rgba(0,0,0,0.6)]"
            >
              {/* Header: logo + close */}
              <div className="flex items-center justify-between px-6 pt-6">
                <img src={IMAGES.logoWhite} alt={BUSINESS.name} className="h-11 w-auto" />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Trust badge with pulsing dot */}
              <div className="mx-6 mt-6 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-glow/70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-glow" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                  Licensed &amp; Insured · {BUSINESS.yearsExperience} Years in NE Ohio
                </span>
              </div>

              {/* Nav links */}
              <nav className="mt-7 flex flex-col px-6">
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <div
                      key={link.label}
                      className="transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
                      style={{
                        transform: revealed ? "translateX(0)" : "translateX(24px)",
                        transitionDelay: `${80 + i * 50}ms`,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`group flex items-center justify-between border-b border-white/10 py-4 text-xl font-semibold uppercase tracking-wide transition-colors ${
                          active ? "text-brand-glow" : "text-white hover:text-brand-glow"
                        }`}
                      >
                        {link.label}
                        <ArrowRight
                          size={18}
                          className="text-white/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand-glow"
                        />
                      </Link>
                    </div>
                  );
                })}
              </nav>

              {/* Primary actions */}
              <div className="mt-7 flex flex-col gap-3 px-6">
                <a
                  href={tel}
                  className="flex items-center justify-center gap-2 bg-brand px-6 py-3.5 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
                >
                  <Phone size={17} /> {BUSINESS.phone}
                </a>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 border border-white/30 px-6 py-3.5 font-semibold uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  <FileText size={17} /> Free Estimate
                </Link>
              </div>

              {/* Contact footer */}
              <div className="mt-auto space-y-4 px-6 pb-8 pt-8 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-brand-glow" />
                  <span>
                    {BUSINESS.address.street}, {BUSINESS.address.city}, {BUSINESS.address.state}{" "}
                    {BUSINESS.address.zip}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-brand-glow" />
                  <span>Mon-Fri 7AM-5PM · Sat 8AM-12PM · Sun closed</span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={BUSINESS.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-brand-glow transition-colors hover:bg-white/10"
                  >
                    <Facebook size={16} />
                  </a>
                  <a
                    href={BUSINESS.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-brand-glow transition-colors hover:bg-white/10"
                  >
                    <Instagram size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
