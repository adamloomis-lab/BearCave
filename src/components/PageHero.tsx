// Interior-page header: typographic, frost surface, heading leads (no
// eyebrows per house standard), optional one-line subtitle.
export default function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="hero-frost border-b border-border">
      <div className="container-x pt-14 pb-12 md:pt-20 md:pb-16">
        <h1 className="display text-4xl sm:text-5xl md:text-6xl text-foreground max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      <div aria-hidden="true" className="rule-lane" />
    </section>
  );
}
