import { Route, Switch, Router, useLocation } from "wouter";
import { useEffect } from "react";
import Seo from "@/components/Seo";
import CookieConsent from "@/components/CookieConsent";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Catering from "@/pages/Catering";
import Jobs from "@/pages/Jobs";
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
        <Route path="/products" component={Products} />
        <Route path="/catering" component={Catering} />
        <Route path="/jobs" component={Jobs} />
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
      <Router ssrPath={ssrPath}>
        <Shell />
      </Router>
      <CookieConsent />
    </>
  );
}
