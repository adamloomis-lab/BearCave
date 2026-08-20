import { Route, Switch, Router, useLocation } from "wouter";
import { useEffect } from "react";
import Seo from "@/components/Seo";
import CookieConsent from "@/components/CookieConsent";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import ServiceArea from "@/pages/ServiceArea";
import CityDetail from "@/pages/CityDetail";
import Projects from "@/pages/Projects";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Accessibility from "@/pages/Accessibility";
import NotFound from "@/pages/NotFound";

function Shell() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Seo path={location} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/services/:slug" component={ServiceDetail} />
        <Route path="/service-area" component={ServiceArea} />
        <Route path="/service-area/:slug" component={CityDetail} />
        <Route path="/projects" component={Projects} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/accessibility" component={Accessibility} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default function App({ ssrPath }: { ssrPath?: string }) {
  return (
    <>
      <div className="site-grain" aria-hidden="true" />
      <Router ssrPath={ssrPath}>
        <Shell />
      </Router>
      <CookieConsent />
    </>
  );
}
