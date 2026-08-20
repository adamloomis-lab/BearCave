import type { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import MobileCTA from "./MobileCTA";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg focus:text-foreground"
      >
        Skip to content
      </a>
      <Navigation />
      {/* Offset for the fixed header (utility bar + nav row) */}
      <main id="main-content" className="pt-[104px]">{children}</main>
      <Footer />
      {/* Spacer so the floating mobile capsule never hides footer content */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
      <MobileCTA />
    </>
  );
}
