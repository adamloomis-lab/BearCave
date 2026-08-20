import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  BUSINESS,
  GOOGLE_RATING,
  GOOGLE_REVIEWS,
  type GoogleReview,
} from "@/lib/constants";
import AnimatedSection from "./AnimatedSection";

// Renders the SSR-baked reviews (SEO + first paint) and swaps in fresh data
// from /api/reviews on mount when the Netlify function is configured. If the
// function is unavailable, the baked reviews stay put and nobody notices.

// Response shape returned by netlify/functions/reviews.mts (normalized from
// the raw Places API into this friendlier shape).
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

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-accent" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          className={i < Math.round(rating) ? "" : "text-accent/30"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>(GOOGLE_REVIEWS);
  const [rating, setRating] = useState<number>(GOOGLE_RATING.value);
  const [count, setCount] = useState<number>(GOOGLE_RATING.count);
  const [mapsUri, setMapsUri] = useState<string>(BUSINESS.googleMapsUri);

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
          if (fresh.length) setReviews(fresh);
        }
      } catch {
        // Baked data stays.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="depth-ice">
      <div className="container-x py-20 md:py-28">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <h2 className="display text-3xl md:text-5xl text-foreground">The Neighbors Have Spoken</h2>
          <span className="mt-5 block rule-ice mx-auto" />

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <StarRow rating={rating} />
            <span className="text-foreground font-display text-lg">
              {rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-sm">
              from {count} Google reviews
            </span>
          </div>
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((r, i) => (
            <AnimatedSection key={`${r.author}-${r.publishTime || i}`} delay={(i % 2) * 0.06}>
              <figure className="h-full bg-white border border-border p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between">
                  <StarRow rating={r.rating} />
                  <GoogleG className="size-4" />
                </div>
                <blockquote className="mt-4 text-foreground leading-relaxed text-sm flex-1">
                  {r.text}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 pt-4 border-t border-border/70">
                  <span
                    aria-hidden="true"
                    className="flex items-center justify-center size-9 bg-brand text-white font-display text-sm tracking-wider"
                  >
                    {initials(r.author)}
                  </span>
                  <div className="text-left">
                    <span className="block font-display uppercase tracking-wide text-foreground text-sm">
                      {r.author}
                    </span>
                    {r.timeAgo && (
                      <span className="block text-xs text-muted-foreground">{r.timeAgo}</span>
                    )}
                  </div>
                </figcaption>
              </figure>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href={mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-deep font-semibold uppercase tracking-wide hover:text-accent transition-colors"
          >
            <GoogleG className="size-4" />
            Read all reviews on Google
          </a>
          <span className="hidden sm:inline text-muted-foreground/60">·</span>
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJrxEv0lfMMIgRtWOnSWlwmzQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-brand-deep transition-colors"
          >
            Been through the lane? Leave a review
          </a>
        </div>
      </div>
    </section>
  );
}
