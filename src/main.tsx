import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initWebVitals } from "./lib/webVitals";
import { trackWhatsAppClick } from "./lib/analytics";

createRoot(document.getElementById("root")!).render(<App />);

initWebVitals();

// Global delegation: qualquer <a>/<button> com data-wa-source dispara evento
// analytics padronizado sem exigir onClick por componente. Não dedupa com
// handlers explícitos — trackEvent é idempotente por payload/pathname.
if (typeof window !== "undefined") {
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as Element | null;
      const el = target?.closest?.("[data-wa-source]") as HTMLElement | null;
      if (!el) return;
      try {
        trackWhatsAppClick({
          source: el.dataset.waSource || "unknown",
          service: el.dataset.service,
          city: el.dataset.city,
          bairro: el.dataset.neighborhood,
          cta_label: el.getAttribute("aria-label") ?? undefined,
          source_component: el.tagName.toLowerCase(),
        });
      } catch {
        /* noop */
      }
    },
    { capture: true },
  );
}
