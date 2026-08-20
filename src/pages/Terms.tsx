import LegalPage from "@/components/LegalPage";
import { BUSINESS } from "@/lib/constants";

export default function Terms() {
  return (
    <LegalPage title="Terms of Use" lastUpdated="August 20, 2026">
      <p>
        Welcome to the {BUSINESS.name} website. By using this site, you agree to these
        terms. If you don't agree with them, please don't use the site.
      </p>

      <h2>About This Site</h2>
      <p>
        This site provides information about our store: what we carry, our hours, beverage
        catering, job openings, and how to reach us. It is not an online store; nothing on
        this site can be purchased, reserved, or paid for online.
      </p>

      <h2>Age-Restricted Products</h2>
      <p>
        We sell alcohol and tobacco at our physical location. Ohio law requires purchasers
        of these products to be 21 or older with valid identification. Nothing on this site
        is an offer to sell age-restricted products to anyone under 21, and all sales happen
        in person at the store with ID verification.
      </p>

      <h2>Accuracy of Information</h2>
      <p>
        We work to keep hours, product categories, and other details current, but stock
        rotates and hours can change around holidays. Product photos show real inventory on
        the day they were taken and don't guarantee a specific item is in stock today. When
        in doubt, call us at <a href={`tel:${BUSINESS.phoneDigits}`}>{BUSINESS.phone}</a>.
      </p>

      <h2>Use of the Site</h2>
      <ul>
        <li>Don't use the site in a way that could damage or disrupt it</li>
        <li>Don't submit forms with false, misleading, or abusive content</li>
        <li>Don't attempt to gain unauthorized access to any part of the site</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        The Bear Cave name, logo, photos, and content on this site belong to {BUSINESS.name}{" "}
        or are used with permission. Third-party brand names and product packaging visible in
        photos belong to their respective owners and appear only to show what the store
        carries.
      </p>

      <h2>Disclaimer</h2>
      <p>
        This site is provided "as is." We make no warranties about its availability or that
        it will be error-free. To the fullest extent permitted by law, {BUSINESS.name} is not
        liable for damages arising from your use of this site.
      </p>

      <h2>Links to Other Sites</h2>
      <p>
        This site links to third-party services like Google Maps and Facebook. We're not
        responsible for their content or privacy practices.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. The date at the top reflects the latest
        revision, and continued use of the site after changes means you accept them.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Call{" "}
        <a href={`tel:${BUSINESS.phoneDigits}`}>{BUSINESS.phone}</a> or visit us at{" "}
        {BUSINESS.address.street}, {BUSINESS.address.city}, {BUSINESS.address.state}{" "}
        {BUSINESS.address.zip}.
      </p>
    </LegalPage>
  );
}
