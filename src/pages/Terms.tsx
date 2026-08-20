import { Link } from "wouter";
import LegalPage from "@/components/LegalPage";
import { BUSINESS } from "@/lib/constants";

export default function Terms() {
  return (
    <LegalPage label="Legal" title="Terms of Use" lastUpdated="June 1, 2026">
      <p>
        These Terms of Use govern your use of kelleyconstructionohio.com (the "Site"), operated by
        {" "}{BUSINESS.legalName} d/b/a {BUSINESS.name}. By accessing or using this Site, you agree to
        these Terms. If you do not agree, please do not use the Site.
      </p>

      <h2>The Site is informational</h2>
      <p>
        Content on this Site, including service descriptions, photos, pricing references, and
        timelines, is provided for general information only. Any project we perform is governed by
        a separate written estimate or agreement, not by the content of this Site.
      </p>

      <h2>No warranty</h2>
      <p>
        The Site is provided "as is" without warranties of any kind, express or implied. We make no
        guarantee that the Site will be available at all times, that information is current, or that
        the Site will be free of errors.
      </p>

      <h2>Submitting a quote request</h2>
      <p>
        Submitting a contact or quote form is a request for us to follow up. It does not by itself
        create a contract or an obligation on either side. Any work we perform is contingent on a
        site visit, a written estimate, and your acceptance of that estimate.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The {BUSINESS.name} name, logo, photographs of completed projects, and the layout and copy of
        this Site are our property or that of our licensors and are protected by copyright and
        trademark law. You may not copy, redistribute, or reuse them without written permission.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Site for any unlawful purpose.</li>
        <li>Submit false or misleading information through the contact form.</li>
        <li>Attempt to interfere with, probe, or disrupt the Site or its underlying services.</li>
        <li>Scrape, harvest, or republish content from the Site without permission.</li>
      </ul>

      <h2>Third-party links</h2>
      <p>
        This Site may link to third-party websites (for example, our Google Business Profile or
        social media). We do not control those sites and are not responsible for their content or
        practices.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {BUSINESS.name} will not be liable for any indirect,
        incidental, special, or consequential damages arising from your use of the Site.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of Ohio, without regard to its conflict of
        law principles. Any dispute relating to the Site will be brought in the state or federal
        courts located in Medina County, Ohio.
      </p>

      <h2>Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The "Last updated" date at the top of the page
        will show when they were last changed. Continued use of the Site after changes are posted
        means you accept the updated Terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms? Reach us through our{" "}
        <Link href="/contact">contact form</Link> or by phone at {BUSINESS.phone}.
      </p>
    </LegalPage>
  );
}
