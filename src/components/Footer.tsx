import { Link } from "wouter";
import { Facebook, MapPin, Phone, Clock } from "lucide-react";
import { BUSINESS, NAV_LINKS, PRODUCTS, IMAGES } from "@/lib/constants";

// Cave-dark footer: big Clash wordmark, lane divider on top, three columns
// (visit / what's in the cave / pages), full NAP with every contact signal a
// real link, legal row + agency credit.

const tel = `tel:${BUSINESS.phoneDigits}`;

export default function Footer() {
  const a = BUSINESS.address;
  const mapsQuery = encodeURIComponent(
    `${BUSINESS.name}, ${a.street}, ${a.city}, ${a.state} ${a.zip}`,
  );
  const year = new Date().getFullYear();

  return (
    <footer className="relative depth-cave text-white/75">
      <div aria-hidden="true" className="rule-lane-dark" />

      <div className="container-x pt-14 pb-6">
        {/* Wordmark row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-8">
          <div className="flex items-center gap-3">
            <img src={IMAGES.logo} alt="" width={1248} height={1248} loading="lazy" className="h-14 w-auto" />
            <div>
              <p className="display text-3xl text-white">Bear Cave</p>
              <p className="text-sm text-white/60">{BUSINESS.tagline}</p>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            {a.street} · {a.city}, {a.state} {a.zip}
          </a>
        </div>

        <div className="grid gap-10 py-10 md:grid-cols-3">
          {/* Visit */}
          <div>
            <h4 className="display text-lg text-white">Visit the Cave</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`https://maps.google.com/?q=${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-white/75 hover:text-brand-ice transition-colors"
                >
                  <MapPin size={18} className="shrink-0 mt-0.5 text-brand-ice" />
                  <span>
                    {a.street}
                    <br />
                    {a.city}, {a.state} {a.zip}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={tel}
                  className="flex items-center gap-2.5 text-white/75 hover:text-brand-ice transition-colors"
                >
                  <Phone size={18} className="shrink-0 text-brand-ice" />
                  {BUSINESS.phone}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-white/75 hover:text-brand-ice transition-colors"
                >
                  <Facebook size={18} className="shrink-0 text-brand-ice" />
                  {BUSINESS.social.facebookHandle}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="display text-lg text-white">Hours</h4>
            <ul className="mt-5 space-y-2 text-sm">
              {BUSINESS.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 border-b border-white/10 pb-1.5">
                  <span className="text-white/60">{h.day}</span>
                  <span className="text-white/85">{h.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-2 text-xs text-white/50">
              <Clock size={13} /> Hours follow our Google listing.
            </p>
          </div>

          {/* Pages + products */}
          <div>
            <h4 className="display text-lg text-white">In the Cave</h4>
            <ul className="mt-5 space-y-2.5 text-sm">
              {PRODUCTS.map((p) => (
                <li key={p.slug} className="text-white/70">{p.title}</li>
              ))}
            </ul>
            <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-brand-ice hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-xs text-white/45">
            <span>
              © {year} {BUSINESS.name} · Wadsworth, Ohio
            </span>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <Link href="/privacy" className="hover:text-brand-ice transition-colors">Privacy Policy</Link>
              <span className="opacity-30">·</span>
              <Link href="/terms" className="hover:text-brand-ice transition-colors">Terms of Use</Link>
              <span className="opacity-30">·</span>
              <Link href="/accessibility" className="hover:text-brand-ice transition-colors">Accessibility</Link>
            </nav>
            <span>
              Website by{" "}
              <a
                href="https://adamloomismarketing.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-ice transition-colors"
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
