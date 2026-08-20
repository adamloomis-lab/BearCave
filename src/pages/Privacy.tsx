import LegalPage from "@/components/LegalPage";
import { BUSINESS } from "@/lib/constants";

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="August 20, 2026">
      <p>
        {BUSINESS.name} ("we," "us," or "our") operates this website. This policy explains
        what information we collect when you visit, how we use it, and the choices you have.
      </p>

      <h2>Information We Collect</h2>
      <p>
        <strong>Information you give us.</strong> When you submit a form on this site (a
        message, a catering request, or a job application), we receive the details you enter,
        such as your name, phone number, email address, and message.
      </p>
      <p>
        <strong>Information collected automatically.</strong> Like most websites, we use
        basic analytics to understand how the site is used: pages visited, approximate
        location (city level), device and browser type, and how you found us. With your
        consent, we may also use session analytics tools that help us see how visitors
        interact with pages so we can improve them.
      </p>

      <h2>How We Use Information</h2>
      <ul>
        <li>To respond to your messages, catering requests, and job applications</li>
        <li>To operate, maintain, and improve the website</li>
        <li>To understand which pages are useful and which need work</li>
      </ul>

      <h2>What We Don't Do</h2>
      <ul>
        <li>We do not sell your personal information</li>
        <li>We do not share your information with third parties for their marketing</li>
        <li>We do not knowingly collect information from anyone under 21 through our forms</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        This site uses a small number of cookies and similar technologies to keep the site
        working and, with your consent, to power analytics. You can decline non-essential
        cookies in the banner when you first visit, and you can clear cookies at any time in
        your browser settings.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        Forms on this site are processed by Netlify, our hosting provider. The map on our
        contact page is provided by Google Maps, which may set its own cookies when loaded.
        Reviews shown on this site come from our public Google Business Profile.
      </p>

      <h2>Data Retention</h2>
      <p>
        Form submissions are kept only as long as needed to respond and follow up. You can
        ask us to delete your submission at any time.
      </p>

      <h2>Your Choices</h2>
      <p>
        You can browse this site without submitting any personal information. To ask what
        information we have about you, or to have it corrected or deleted, call us at{" "}
        <a href={`tel:${BUSINESS.phoneDigits}`}>{BUSINESS.phone}</a> or stop by the store.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        If we change this policy, we'll update the date at the top of this page. Meaningful
        changes will be reflected here before they take effect.
      </p>

      <h2>Contact</h2>
      <p>
        {BUSINESS.name}
        <br />
        {BUSINESS.address.street}, {BUSINESS.address.city}, {BUSINESS.address.state}{" "}
        {BUSINESS.address.zip}
        <br />
        <a href={`tel:${BUSINESS.phoneDigits}`}>{BUSINESS.phone}</a>
      </p>
    </LegalPage>
  );
}
