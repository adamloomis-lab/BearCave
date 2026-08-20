import { Link } from "wouter";
import LegalPage from "@/components/LegalPage";
import { BUSINESS } from "@/lib/constants";

export default function Privacy() {
  return (
    <LegalPage label="Legal" title="Privacy Policy" lastUpdated="June 1, 2026">
      <p>
        {BUSINESS.name} ("we," "us," or "our") respects your privacy. This Privacy Policy
        explains what information we collect when you visit our website at
        kelleyconstructionohio.com, how we use that information, and the choices you have.
      </p>

      <h2>Information we collect</h2>
      <p>We collect only the information needed to respond to inquiries and operate this website:</p>
      <ul>
        <li>
          <strong>Information you provide.</strong> When you submit our contact or quote form, we
          collect your name, phone number, email address, and the details of your project.
        </li>
        <li>
          <strong>Information collected automatically.</strong> Our hosting provider (Netlify) logs
          standard server data such as IP address, browser type, referring page, and timestamps to
          help keep the site secure and reliable.
        </li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to your inquiry and provide a free quote.</li>
        <li>To schedule and complete the work you've asked us to do.</li>
        <li>To improve and secure the website.</li>
      </ul>
      <p>
        We do not sell, rent, or trade your personal information. We do not use your information for
        targeted advertising.
      </p>

      <h2>Cookies</h2>
      <p>
        This site uses essential cookies only: small files stored by your browser that help the
        site function and prevent abuse of the contact form. We do not use third-party advertising
        cookies or cross-site tracking.
      </p>

      <h2>Service providers</h2>
      <p>
        We use the following providers in the normal course of running this website. Each has its
        own privacy practices:
      </p>
      <ul>
        <li><strong>Netlify</strong>: website hosting and form submission delivery.</li>
        <li><strong>Google Fonts</strong>: web fonts served on this site.</li>
      </ul>

      <h2>How long we keep your information</h2>
      <p>
        Contact form submissions are retained for as long as needed to respond to your inquiry and
        complete any related project. You may request that we delete your information at any time.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>You can ask us what information we have about you.</li>
        <li>You can ask us to correct or delete your information.</li>
        <li>You can decline to provide information by not submitting the contact form, but we
          won't be able to follow up with a quote.</li>
      </ul>

      <h2>Children's privacy</h2>
      <p>
        This site is not directed to children under 13, and we do not knowingly collect personal
        information from anyone under 13.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last updated" date at the top of
        the page will show when it was last changed.
      </p>

      <h2>Contact</h2>
      <p>
        For any privacy-related question or request, contact us through our{" "}
        <Link href="/contact">contact form</Link> or by phone at {BUSINESS.phone}.{" "}
        {BUSINESS.name}, {BUSINESS.address.street}, {BUSINESS.address.city}, {BUSINESS.address.state}{" "}
        {BUSINESS.address.zip}.
      </p>
    </LegalPage>
  );
}
