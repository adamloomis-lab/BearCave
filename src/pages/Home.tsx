import { Link } from "wouter";
import { ArrowRight, Phone, Navigation as NavArrow } from "lucide-react";
import Layout from "@/components/Layout";
import AnimatedSection from "@/components/AnimatedSection";
import Reviews from "@/components/Reviews";
import Snow from "@/components/Snow";
import { BUSINESS, PRODUCTS, IMAGES, CATERING, GOOGLE_RATING } from "@/lib/constants";

const tel = `tel:${BUSINESS.phoneDigits}`;
const directions = `https://maps.google.com/?q=${encodeURIComponent(
  `${BUSINESS.name}, ${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`,
)}`;

const LANE_STEPS = [
  { n: "1", title: "Pull in", body: "The lane runs straight through the building at 474 College St." },
  { n: "2", title: "Tell us what you need", body: "Beer, wine, pop, snacks, a scratch-off. We grab it while you sit." },
  { n: "3", title: "Pay and go", body: "Cash or card at the window, IDs checked. Most trips take about a minute." },
];

const TICKER_ITEMS = [
  "Cold Beer",
  "Wine",
  "Seltzers",
  "Soda",
  "Snacks",
  "Candy",
  "Ohio Lottery",
  "Tobacco",
];

export default function Home() {
  return (
    <Layout>
      {/* ── Marquee hero ─────────────────────────────────────────── */}
      <section className="hero-frost relative">
        <Snow />
        <div className="container-x relative flex min-h-[62vh] flex-col justify-center py-16 md:py-24">
          <AnimatedSection>
            <p className="font-semibold uppercase tracking-[0.2em] text-brand-deep">
              Wadsworth's drive-thru beverage store
            </p>
            <h1 className="display mt-4 text-[13.5vw] leading-[0.92] text-foreground sm:text-7xl md:text-8xl lg:text-[7rem]">
              The coldest
              <br />
              beer in town.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Beer, wine, seltzers, pop, snacks, candy, and lottery, handed through your
              car window at {BUSINESS.address.street}. In and out in about a minute.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden bg-accent px-8 py-4 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent-deep"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:sheen_0.9s_ease]" />
                <NavArrow size={17} /> Get Directions
              </a>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2.5 border border-foreground/25 px-8 py-4 font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-brand-deep hover:text-brand-deep"
              >
                See What We Carry <ArrowRight size={16} />
              </Link>
            </div>
            <p className="mt-6 text-sm font-semibold text-muted-foreground">
              Rated {GOOGLE_RATING.value} stars by {GOOGLE_RATING.count} neighbors on Google
              · Locally owned
            </p>
          </AnimatedSection>
        </div>
        <div aria-hidden="true" className="rule-lane" />
      </section>

      {/* ── Product ticker ───────────────────────────────────────── */}
      <div className="overflow-hidden border-b border-border bg-white py-3.5" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0">
              {TICKER_ITEMS.map((item) => (
                <span
                  key={`${half}-${item}`}
                  className="display mx-6 flex items-center gap-6 whitespace-nowrap text-xl text-foreground/70"
                >
                  {item}
                  <span className="h-1.5 w-1.5 bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── The lane: how it works ───────────────────────────────── */}
      <section className="depth-frost">
        <div className="container-x grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
          <AnimatedSection direction="left">
            <h2 className="display text-3xl md:text-5xl text-foreground">
              A drink run shouldn't mean a parking lot
            </h2>
            <span className="mt-4 block rule-ice" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              The grocery store makes you park, walk the aisles, and stand in a checkout
              line just to grab a six-pack. After a long shift or on the way to the party,
              that's the last thing you want. We know the feeling, so we built the whole
              store around a lane your car drives through.
            </p>
            <ol className="mt-8 space-y-5">
              {LANE_STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="display flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-white text-lg text-brand-deep">
                    {s.n}
                  </span>
                  <span>
                    <span className="block font-display uppercase tracking-wide text-foreground">
                      {s.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                      {s.body}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <figure className="border border-border bg-white p-2 shadow-[0_18px_50px_-24px_rgba(20,40,70,0.35)]">
              <img
                src={IMAGES.building}
                alt="The Bear Cave drive-thru lane running through the light blue building at 474 College St"
                width={1920}
                height={1440}
                className="h-auto w-full"
                loading="lazy"
              />
              <figcaption className="px-2 py-2.5 text-xs text-muted-foreground">
                474 College St, Wadsworth. The lane runs straight through.
              </figcaption>
            </figure>
          </AnimatedSection>
        </div>
      </section>

      {/* ── What's in the cave ───────────────────────────────────── */}
      <section className="depth-ice">
        <div className="container-x py-20 md:py-28">
          <AnimatedSection className="max-w-2xl">
            <h2 className="display text-3xl md:text-5xl text-foreground">What's in the cave</h2>
            <span className="mt-4 block rule-ice" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Coolers run the length of the building and stay packed. Here's the short
              version; the long version is behind your car window.
            </p>
          </AnimatedSection>
          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <AnimatedSection key={p.slug} delay={(i % 3) * 0.05}>
                <div className="flex h-full flex-col bg-white p-6">
                  <h3 className="display text-xl text-foreground">{p.title}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.short}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-semibold uppercase tracking-wide text-brand-deep transition-colors hover:text-accent"
            >
              Look inside the coolers <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Catering band ────────────────────────────────────────── */}
      <section className="depth-cave text-white">
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-[1fr_auto] md:py-20">
          <AnimatedSection>
            <h2 className="display text-3xl md:text-4xl text-white">
              Drinks for your wedding, party, or office event
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/70">
              We cater beverages for {CATERING.occasions.join(", ").toLowerCase()}, and
              whatever else you're planning. Tell us the headcount and we'll handle the
              coolers.
            </p>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <Link
              href="/catering"
              className="inline-flex items-center gap-2.5 bg-white px-8 py-4 font-semibold uppercase tracking-wide text-cave transition-colors hover:bg-brand-ice"
            >
              Request Catering <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────── */}
      <Reviews />

      {/* ── Visit band ───────────────────────────────────────────── */}
      <section className="depth-frost">
        <div className="container-x grid items-center gap-10 py-20 md:grid-cols-2 md:py-24">
          <AnimatedSection direction="left">
            <figure className="border border-border bg-white p-2">
              <img
                src={IMAGES.buildingWide}
                alt="Bear Cave Drive Thru from College Street, with the beverage catering sign out front"
                width={1920}
                height={1440}
                className="h-auto w-full"
                loading="lazy"
              />
            </figure>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <h2 className="display text-3xl md:text-4xl text-foreground">
              Locally owned, easy to find
            </h2>
            <span className="mt-4 block rule-ice" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Pull in once and your drink run becomes the easiest errand of the week: cold
              drinks in the seat next to you, about a minute after you turned in. Or keep
              circling the grocery lot for the same six-pack. Your call.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              If you're tired of standing in line for a six-pack, pulling into Bear Cave
              is the right decision.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-accent px-7 py-3.5 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent-deep"
              >
                <NavArrow size={16} /> Get Directions
              </a>
              <a
                href={tel}
                className="inline-flex items-center justify-center gap-2.5 bg-brand px-7 py-3.5 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-deep"
              >
                <Phone size={16} /> Call {BUSINESS.phone}
              </a>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Not sure we carry what you're after?{" "}
              <Link href="/contact" className="font-semibold text-brand-deep underline underline-offset-2 hover:text-accent">
                Ask us a question
              </Link>{" "}
              and we'll check the coolers for you.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
