import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { IMAGES } from "@/lib/constants";

export default function NotFound() {
  return (
    <Layout>
      <section className="hero-frost">
        <div className="container-x flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
          <img src={IMAGES.logo} alt="" className="h-24 w-auto" />
          <h1 className="display mt-6 text-6xl text-foreground md:text-7xl">Wrong turn</h1>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            This page isn't in the cave. The lane back to the homepage is right here.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2.5 bg-accent px-8 py-4 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent-deep"
          >
            Back to Bear Cave <ArrowRight size={16} />
          </Link>
        </div>
        <div aria-hidden="true" className="rule-lane" />
      </section>
    </Layout>
  );
}
