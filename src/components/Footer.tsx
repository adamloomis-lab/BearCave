import { Link } from "wouter";
import { Facebook, Instagram, MapPin, Phone, Clock } from "lucide-react";
import { BUSINESS, SERVICES, CITIES, IMAGES } from "@/lib/constants";

// Footer — preserves every piece of information from the prior structure
// (services, service-area cities, full NAP, hours, social, legal, agency
// credit). Adapted visual treatment: ambient brand-red gradient orbs in the
// background, gradient cream→glow brand wordmark, and a subtle glass card
// containing the 4-column grid for depth.

const tel = `tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`;

export default function Footer() {
  const a = BUSINESS.address;
  const mapsQuery = encodeURIComponent(
    [a.street, `${a.city}, ${a.state} ${a.zip}`].filter(Boolean).join(", "),
  );
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-steel-dark text-white/75">
      {/* Ambient brand-red glow orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute -top-40 left-1/5 h-80 w-80 rounded-full bg-brand/35 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-brand-dark/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[28rem] w-[28rem] rounded-full bg-brand-glow/10 blur-3xl" />
      </div>

      {/* Decorative top stripe */}
      <div aria-hidden="true" className="relative h-1 stripe-red" />

      <div className="relative container-x pt-16 pb-6">
        {/* Glass card containing the main columns */}
        <div className="rounded-2xl border border-white/10 bg-steel/35 backdrop-blur-md shadow-2xl p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link href="/" aria-label={`${BUSINESS.name} home`} className="inline-block">
                <img src={IMAGES.logoWhite} alt={BUSINESS.name} className="h-16 w-auto" />
              </Link>
              <p className="mt-4 font-display uppercase tracking-wide text-lg bg-gradient-to-r from-white via-white to-brand-glow bg-clip-text text-transparent">
                {BUSINESS.tagline}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                Dependable residential &amp; commercial concrete across Northeast Ohio for over 20 years.
              </p>
              <div className="flex gap-3 mt-6">
                <a
                  href={BUSINESS.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex items-center justify-center size-10 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-brand-glow hover:border-brand-glow/60 hover:bg-brand/15 transition"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href={BUSINESS.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex items-center justify-center size-10 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-brand-glow hover:border-brand-glow/60 hover:bg-brand/15 transition"
                >
                  <Instagram size={18} />
                </a>
                {BUSINESS.googleBusinessProfile && (
                  <a
                    href={BUSINESS.googleBusinessProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Google Business Profile"
                    className="flex items-center justify-center size-10 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-brand-glow hover:border-brand-glow/60 hover:bg-brand/15 transition text-sm font-bold"
                  >
                    G
                  </a>
                )}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="eyebrow text-brand-glow">Services</h4>
              <ul className="mt-5 space-y-2.5 text-sm">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-white/70 hover:text-brand-glow transition-colors"
                    >
                      {s.navTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Area */}
            <div>
              <h4 className="eyebrow text-brand-glow">Service Area</h4>
              <ul className="mt-5 space-y-2.5 text-sm columns-2 gap-x-4">
                {CITIES.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/service-area/${c.slug}`}
                      className="text-white/70 hover:text-brand-glow transition-colors"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-white/45">
                Plus surrounding communities within {BUSINESS.serviceRadiusMiles} miles of Wadsworth.
              </p>
            </div>

            {/* Get in Touch */}
            <div>
              <h4 className="eyebrow text-brand-glow">Get in Touch</h4>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href={`https://maps.google.com/?q=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 text-white/75 hover:text-brand-glow transition-colors"
                  >
                    <MapPin size={18} className="shrink-0 mt-0.5 text-brand-glow" />
                    <span>
                      {a.street && <>{a.street}<br /></>}
                      {a.city}, {a.state} {a.zip}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={tel}
                    className="flex items-center gap-2.5 text-white/75 hover:text-brand-glow transition-colors"
                  >
                    <Phone size={18} className="shrink-0 text-brand-glow" />
                    {BUSINESS.phone}
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-2.5">
                    <Clock size={18} className="shrink-0 mt-0.5 text-brand-glow" />
                    <div className="space-y-0.5">
                      <p className="text-white/80">Mon-Fri 7:00 AM - 5:00 PM</p>
                      <p className="text-white/60">Sat 8:00 AM - 12:00 PM</p>
                      <p className="text-white/60">Sun Closed</p>
                    </div>
                  </div>
                </li>
                <li className="pt-1">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-brand text-white font-semibold uppercase tracking-wide text-xs px-5 py-2.5 hover:bg-brand-light transition-colors"
                  >
                    Request a Free Quote
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-xs text-white/45">
            <span>
              © {year} {BUSINESS.name} · Wadsworth, Ohio · Northeast Ohio Concrete Contractor
            </span>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <Link href="/privacy" className="hover:text-brand-glow transition-colors">Privacy Policy</Link>
              <span className="opacity-30">·</span>
              <Link href="/terms" className="hover:text-brand-glow transition-colors">Terms of Use</Link>
              <span className="opacity-30">·</span>
              <Link href="/accessibility" className="hover:text-brand-glow transition-colors">Accessibility</Link>
            </nav>
            <span>
              Website by{" "}
              <a
                href="https://adamloomismarketing.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-glow transition-colors"
              >
                Adam Loomis Marketing
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
