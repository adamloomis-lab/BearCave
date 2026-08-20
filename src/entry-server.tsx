import { renderToString } from "react-dom/server";
import App from "./App";

export { getPageMeta, ALL_ROUTES, SITE_URL } from "./lib/seo";

export function render(path: string): string {
  return renderToString(<App ssrPath={path} />);
}
