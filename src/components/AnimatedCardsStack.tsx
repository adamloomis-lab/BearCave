import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

// Adapted from the original "animated-cards-stack" component for the Kelley
// project: imports from framer-motion (not motion/react), uses the project's
// own design tokens for variants, and always calls every motion hook so the
// hook order is stable across renders.

const cardVariants = cva("absolute will-change-transform", {
  variants: {
    variant: {
      dark: "flex size-full flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-steel-dark/90 p-7 backdrop-blur-md text-white",
      light:
        "flex size-full flex-col items-center justify-center gap-6 rounded-2xl border border-border bg-background/95 p-7 backdrop-blur-md text-foreground",
    },
  },
  defaultVariants: {
    variant: "light",
  },
});

interface ReviewProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxRating?: number;
}

interface CardStickyProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  arrayLength: number;
  index: number;
  incrementY?: number;
  incrementZ?: number;
  incrementRotation?: number;
}

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined);

function useContainerScrollContext() {
  const ctx = React.useContext(ContainerScrollContext);
  if (!ctx) {
    throw new Error(
      "useContainerScrollContext must be used inside <ContainerScroll>",
    );
  }
  return ctx;
}

export const ContainerScroll: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, style, className, ...props }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative w-full", className)}
        style={{ perspective: "1000px", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};
ContainerScroll.displayName = "ContainerScroll";

export const CardsContainer: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, style, ...props }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ perspective: "1000px", ...style }}
      {...props}
    >
      {children}
    </div>
  );
};
CardsContainer.displayName = "CardsContainer";

export const CardTransformed = React.forwardRef<
  HTMLDivElement,
  CardStickyProps
>(function CardTransformed(
  {
    arrayLength,
    index,
    incrementY = 10,
    incrementZ = 10,
    incrementRotation,
    className,
    variant,
    style,
    ...props
  },
  ref,
) {
  const { scrollYProgress } = useContainerScrollContext();

  const start = index / (arrayLength + 1);
  const end = (index + 1) / (arrayLength + 1);
  const range = React.useMemo(() => [start, end] as const, [start, end]);
  const rotateRange = React.useMemo(
    () => [range[0] - 1.5, range[1] / 1.5] as const,
    [range],
  );

  const rotationFrom = incrementRotation ?? -index + 90;

  const y = useTransform(scrollYProgress, [...range], ["0%", "-180%"]);
  const rotate = useTransform(
    scrollYProgress,
    [...rotateRange],
    [rotationFrom, 0],
  );
  const dx = useTransform(scrollYProgress, [...rotateRange], [4, 0]);
  const dy = useTransform(scrollYProgress, [...rotateRange], [4, 12]);
  const blur = useTransform(scrollYProgress, [...rotateRange], [2, 24]);
  const alpha = useTransform(scrollYProgress, [...rotateRange], [0.15, 0.2]);

  // Always call useMotionTemplate so hook order is stable.
  const transform = useMotionTemplate`translateZ(${
    index * incrementZ
  }px) translateY(${y}) rotate(${rotate}deg)`;
  const dropShadow = useMotionTemplate`drop-shadow(${dx}px ${dy}px ${blur}px rgba(0,0,0,${alpha}))`;
  const filter = variant === "dark" ? "none" : dropShadow;

  return (
    <motion.div
      layout="position"
      ref={ref}
      style={{
        top: index * incrementY,
        transform,
        backfaceVisibility: "hidden",
        zIndex: (arrayLength - index) * incrementZ,
        filter,
        ...style,
      }}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  );
});

export const ReviewStars = React.forwardRef<HTMLDivElement, ReviewProps>(
  function ReviewStars({ rating, maxRating = 5, className, ...props }, ref) {
    const filled = Math.floor(rating);
    const frac = rating - filled;
    const empty = maxRating - filled - (frac > 0 ? 1 : 0);
    const gradId = React.useId();

    return (
      <div
        className={cn("flex items-center gap-2", className)}
        ref={ref}
        {...props}
      >
        <div className="flex items-center gap-0.5">
          {Array.from({ length: filled }).map((_, i) => (
            <svg
              key={`f-${i}`}
              className="size-4 text-inherit"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
          {frac > 0 && (
            <svg
              className="size-4 text-inherit"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id={gradId}>
                  <stop offset={`${frac * 100}%`} stopColor="currentColor" />
                  <stop offset={`${frac * 100}%`} stopColor="rgb(209 213 219)" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#${gradId})`}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
              />
            </svg>
          )}
          {Array.from({ length: empty }).map((_, i) => (
            <svg
              key={`e-${i}`}
              className="size-4 text-concrete-light"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
        </div>
        <span className="sr-only">{rating} out of {maxRating} stars</span>
      </div>
    );
  },
);
