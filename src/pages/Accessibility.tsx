import { Link } from "wouter";
import LegalPage from "@/components/LegalPage";
import { BUSINESS } from "@/lib/constants";

const phoneHref = `tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`;

export default function Accessibility() {
  return (
    <LegalPage label="Legal" title="Accessibility Statement" lastUpdated="June 2026">
      <h2>Our commitment</h2>
      <p>
        This site is built to conform to the{" "}
        <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer">
          Web Content Accessibility Guidelines (WCAG) 2.1
        </a>{" "}
        at Level AA, the standard referenced by the ADA for web accessibility. We review and
        update our accessibility practices on an ongoing basis.
      </p>

      <h2>What we have done</h2>
      <p>We have taken the following steps to make this site usable for everyone:</p>
      <ul>
        <li>
          Skip links are provided so keyboard and screen reader users can bypass navigation and
          get straight to the main content.
        </li>
        <li>
          A visible outline appears on every interactive element when navigated by keyboard, so
          focus position is always clear.
        </li>
        <li>
          Text colors meet the 4.5:1 minimum contrast ratio for readability by people with low
          vision.
        </li>
        <li>
          All form fields, buttons, and interactive elements have descriptive labels readable by
          screen readers.
        </li>
        <li>
          Animations automatically reduce for users who have the Reduce Motion preference enabled
          on their device.
        </li>
      </ul>

      <h2>Report an issue</h2>
      <p>
        If you encounter any accessibility barrier on this site, please contact us and we will
        address it promptly. You can reach us by phone at{" "}
        <a href={phoneHref}>{BUSINESS.phone}</a> or through our{" "}
        <Link href="/contact">contact form</Link>.
      </p>
    </LegalPage>
  );
}
