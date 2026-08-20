import type { ReactNode } from "react";
import Layout from "./Layout";
import PageHero from "./PageHero";
import { IMAGES } from "@/lib/constants";

export default function LegalPage({
  label,
  title,
  lastUpdated,
  children,
}: {
  label: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <Layout>
      <PageHero label={label} title={title} image={IMAGES.stampedGray} />
      <section className="depth-concrete">
        <div className="container-x py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              Last updated: {lastUpdated}
            </p>
            <span className="mt-3 block w-12 h-0.5 bg-brand" />
            <div className="legal-prose mt-8 text-foreground leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
