import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import {
  BUSINESS,
  GOOGLE_RATING,
  GOOGLE_REVIEWS,
  type GoogleReview,
} from "@/lib/constants";
import AnimatedSection from "./AnimatedSection";

// Animated testimonial area (split layout Adam picked): heading + dot
// navigation on the left, auto-rotating review cards on the right, Google
// logo beside the live rating. Renders the SSR-baked reviews (SEO + first
// paint) and swaps in fresh data from /api/reviews on mount. If the function
// is unavailable, the baked reviews stay put and nobody notices.

type ApiPayload = {
  configured?: boolean;
  found?: boolean;
  rating?: number;
  total?: number;
  mapsUri?: string;
  reviews?: Array<{
    author?: string;
    rating?: number;
    text?: string;
    when?: string;
    time?: string;
  }>;
};

function toReview(r: NonNullable<ApiPayload["reviews"]>[number]): GoogleReview | null {
  const author = r.author?.trim();
  const text = r.text?.trim();
  if (!author || !text) return null;
  return {
    author,
    rating: r.rating ?? 5,
    text,
    timeAgo: r.when ?? "",
    publishTime: r.time ?? "",
  };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google" role="img">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function StarRow({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1 text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          className={i < Math.round(rating) ? "" : "text-amber-500/30"}
        />
      ))}
    </div>
  );
}

const ROTATE_MS = 6000;

export default function Reviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>(GOOGLE_REVIEWS);
  const [rating, setRating] = useState<number>(GOOGLE_RATING.value);
  const [count, setCount] = useState<number>(GOOGLE_RATING.count);
  const [mapsUri, setMapsUri] = useState<string>(BUSINESS.googleMapsUri);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const paused = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/reviews?id=${BUSINESS.googlePlaceId}`);
        if (!res.ok) return;
        const data: ApiPayload = await res.json();
        if (cancelled || data.configured === false) return;
        if (typeof data.rating === "number") setRating(data.rating);
        if (typeof data.total === "number") setCount(data.total);
        if (data.mapsUri) setMapsUri(data.mapsUri);
        if (data.reviews?.length) {
          const fresh = data.reviews.map(toReview).filter(Boolean) as GoogleReview[];
          if (fresh.length) {
            setReviews(fresh.slice(0, 6));
            setActive(0);
          }
        }
      } catch {
        // Baked data stays.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-rotate; parked for reduced-motion users and while hovered.
  useEffect(() => {
    if (reduceMotion || reviews.length <= 1) return;
    const t = setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % reviews.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [reduceMotion, reviews.length]);

  return (
    <section className="depth-ice overflow-hidden">
      <div className="container-x py-20 md:py-28">
        <div className="grid gap-14 md:grid-cols-2 lg:gap-24">
          {/* Left: heading, rating, navigation */}
          <AnimatedSection direction="left" className="flex flex-col justify-center">
            <span className="plaque w-fit">
              <span className="inline-flex items-center gap-1.5">
                <Star size={12} className="fill-amber-500 text-amber-500" /> Google reviews
              </span>
            </span>
            <h2 className="display mt-5 text-3xl md:text-5xl text-foreground">
              What neighbors say on Google
            </h2>
            <div className="mt-6 flex items-center gap-3">
              <GoogleG className="size-8" />
              <StarRow rating={rating} />
              <span className="font-display text-xl text-foreground">{rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">from {count} reviews</span>
            </div>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              Fast and friendly come up again and again. Here they are in our
              neighbors' own words.
            </p>

            {/* Dot navigation */}
            <div className="mt-7 flex items-center gap-3">
              {reviews.map((r, index) => (
                <button
                  key={`${r.author}-${index}`}
                  onClick={() => setActive(index)}
                  className={`h-2.5 transition-all duration-300 ${
                    active === index ? "w-10 bg-brand" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                  aria-label={`View review ${index + 1}`}
                  aria-pressed={active === index}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
              <a
                href={mapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold uppercase tracking-wide text-brand-deep transition-colors hover:text-accent"
              >
                <GoogleG className="size-4" />
                Read all reviews on Google
              </a>
              <a
                href={`https://search.google.com/local/writereview?placeid=${BUSINESS.googlePlaceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-brand-deep"
              >
                Been through the lane? Leave a review
              </a>
            </div>
          </AnimatedSection>

          {/* Right: rotating review cards */}
          <AnimatedSection
            direction="right"
            className="relative min-h-[340px] md:min-h-[400px]"
          >
            <div
              className="absolute inset-0"
              onMouseEnter={() => {
                paused.current = true;
              }}
              onMouseLeave={() => {
                paused.current = false;
              }}
            >
              {reviews.map((r, index) => (
                <motion.div
                  key={`${r.author}-${r.publishTime || index}`}
                  className="absolute inset-0"
                  initial={false}
                  animate={
                    reduceMotion
                      ? { opacity: active === index ? 1 : 0 }
                      : {
                          opacity: active === index ? 1 : 0,
                          x: active === index ? 0 : 80,
                          scale: active === index ? 1 : 0.94,
                        }
                  }
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ zIndex: active === index ? 10 : 0, pointerEvents: active === index ? "auto" : "none" }}
                  aria-hidden={active !== index}
                >
                  <figure className="flex h-full flex-col border border-border bg-white p-8 shadow-[0_24px_60px_-30px_rgba(16,40,80,0.4)]">
                    <div className="flex items-center justify-between">
                      <StarRow rating={r.rating} size={20} />
                      <GoogleG className="size-5" />
                    </div>

                    <div className="relative mt-6 flex-1 overflow-y-auto">
                      <Quote className="absolute -left-2 -top-2 h-8 w-8 rotate-180 text-brand/15" aria-hidden />
                      <blockquote className="relative z-10 text-lg font-medium leading-relaxed text-foreground">
                        "{r.text}"
                      </blockquote>
                    </div>

                    <div className="my-4 h-px w-full shrink-0 bg-border" aria-hidden />

                    <figcaption className="flex items-center gap-4">
                      <span
                        aria-hidden
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-brand text-white font-display tracking-wider"
                      >
                        {initials(r.author)}
                      </span>
                      <div>
                        <span className="block font-display uppercase tracking-wide text-foreground">
                          {r.author}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          Google review{r.timeAgo ? ` · ${r.timeAgo}` : ""}
                        </span>
                      </div>
                    </figcaption>
                  </figure>
                </motion.div>
              ))}

              {/* Decorative corner blocks */}
              <div className="absolute -bottom-6 -left-6 -z-10 h-24 w-24 bg-brand/5" aria-hidden />
              <div className="absolute -right-6 -top-6 -z-10 h-24 w-24 bg-brand/5" aria-hidden />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
