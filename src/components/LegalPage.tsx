import type { ReactNode } from "react";
import Layout from "./Layout";
import PageHero from "./PageHero";

export default function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <Layout>
      <PageHero title={title} />
      <section className="depth-frost">
        <div className="container-x py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              Last updated: {lastUpdated}
            </p>
            <span className="mt-3 block rule-ice" />
            <div className="legal-prose mt-8 text-foreground leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
