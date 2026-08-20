import { Link } from "wouter";
import { Home, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { SERVICES } from "@/lib/constants";

export default function NotFound() {
  return (
    <Layout>
      <section className="depth-steel text-white min-h-[70vh] flex items-center">
        <div className="container-x py-28 text-center">
          <p className="display text-7xl md:text-9xl text-brand-light">404</p>
          <h1 className="display text-3xl md:text-4xl mt-4">Page Not Found</h1>
          <p className="text-white/70 mt-4 max-w-lg mx-auto">
            We couldn't find that page. It may have moved. Try one of the links below or head back home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 bg-brand text-white font-semibold uppercase tracking-wide px-6 py-3 hover:bg-brand-light transition-colors">
              <Home size={16} /> Home
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold uppercase tracking-wide px-6 py-3 hover:bg-white/10 transition-colors">
              Services <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold uppercase tracking-wide px-6 py-3 hover:bg-white/10 transition-colors">
              Free Quote <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/60">
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="hover:text-brand-light transition-colors">
                {s.navTitle}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
