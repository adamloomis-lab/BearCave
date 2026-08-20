import { useEffect } from "react";
import { getPageMeta } from "@/lib/seo";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

// Keeps document <head> in sync on client-side route changes. The same metadata
// is baked into static HTML at build time by scripts/prerender.mjs, so crawlers
// that don't run JS still get correct per-page titles, descriptions, and JSON-LD.
export default function Seo({ path }: { path: string }) {
  useEffect(() => {
    const meta = getPageMeta(path);

    document.title = meta.title;
    setMeta("name", "description", meta.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = meta.canonical;

    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:url", meta.canonical);
    setMeta("property", "og:image", meta.ogImage);
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    setMeta("name", "twitter:image", meta.ogImage);

    // Replace any JSON-LD we previously injected so routes don't accumulate.
    document.head
      .querySelectorAll('script[data-seo="jsonld"]')
      .forEach((n) => n.remove());
    for (const node of meta.jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-seo", "jsonld");
      s.textContent = JSON.stringify(node);
      document.head.appendChild(s);
    }
  }, [path]);

  return null;
}
