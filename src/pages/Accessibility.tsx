import LegalPage from "@/components/LegalPage";
import { BUSINESS } from "@/lib/constants";

export default function Accessibility() {
  return (
    <LegalPage title="Accessibility Statement" lastUpdated="August 20, 2026">
      <p>
        {BUSINESS.name} wants everyone in Wadsworth to be able to use this website,
        including people who rely on assistive technology.
      </p>

      <h2>Our Standard</h2>
      <p>
        This site is built to the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA.
        In practice, that means:
      </p>
      <ul>
        <li>Text and interface elements meet minimum contrast ratios</li>
        <li>Every interactive element can be reached and operated with a keyboard</li>
        <li>A visible focus indicator shows where you are on the page</li>
        <li>Images that carry information have text alternatives</li>
        <li>Pages are structured with proper headings and landmarks for screen readers</li>
        <li>Animation respects your system's reduced-motion preference</li>
        <li>The site works at 200% zoom and on small screens</li>
      </ul>

      <h2>Ongoing Work</h2>
      <p>
        Accessibility isn't a one-time checkbox. We review the site as we update it, and we
        test with keyboard navigation and screen-reader tooling as part of our build
        process.
      </p>

      <h2>Found a Problem?</h2>
      <p>
        If any part of this site is hard to use with your device or assistive technology,
        tell us and we'll fix it. Call{" "}
        <a href={`tel:${BUSINESS.phoneDigits}`}>{BUSINESS.phone}</a> or use the form on our
        contact page. Please mention the page and what got in your way.
      </p>

      <h2>At the Store</h2>
      <p>
        The drive-thru itself is a pretty accessible way to shop: you never have to leave
        your vehicle. If you need a hand with anything when you visit, just ask at the
        window.
      </p>
    </LegalPage>
  );
}
