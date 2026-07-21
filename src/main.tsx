import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initWebVitals } from "./lib/webVitals";
import { trackWhatsAppClick } from "./lib/analytics";
import { pushLocalAnalyticsEvent } from "./lib/localAnalytics";
import { initSentry, captureHandledError } from "./lib/sentry";
import { GlobalErrorBoundary } from "./components/system/GlobalErrorBoundary";

initSentry();

createRoot(document.getElementById("root")!).render(
  <GlobalErrorBoundary>
    <App />
  </GlobalErrorBoundary>,
);

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    captureHandledError(event.error ?? new Error(event.message), {
      source: "window.error",
      filename: event.filename,
    });
  });
  window.addEventListener("unhandledrejection", (event) => {
    captureHandledError(event.reason ?? new Error("unhandledrejection"), {
      source: "window.unhandledrejection",
    });
  });
}


initWebVitals();

// Global delegation: qualquer <a>/<button> com data-wa-source dispara:
//  (1) evento legado `whatsapp_click` no dataLayer/gtag (Google Ads).
//  (2) evento local isolado `whatsapp_click` na fila interna (sem PII).
// Ambos são idempotentes: o dedupe da fila local absorve delegator+onClick
// disparando no mesmo tick, e o legado já era o único emissor de whatsapp_click
// em muitas rotas.
if (typeof window !== "undefined") {
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as Element | null;
      const el = target?.closest?.("[data-wa-source]") as HTMLElement | null;
      if (!el) return;
      const source = el.dataset.waSource || "unknown";
      const service = el.dataset.service;
      const city = el.dataset.city;
      const neighborhood = el.dataset.neighborhood;
      const cta_id = el.dataset.ctaId || el.dataset.waSource || "wa_cta";
      const isWhatsAnchor =
        el.tagName.toLowerCase() === "a" &&
        (el.getAttribute("href") || "").includes("wa.me");
      try {
        trackWhatsAppClick({
          source,
          service,
          city,
          bairro: neighborhood,
          cta_label: el.getAttribute("aria-label") ?? undefined,
          source_component: el.tagName.toLowerCase(),
        });
      } catch {
        /* legado nunca quebra fluxo */
      }
      try {
        pushLocalAnalyticsEvent({
          event: "whatsapp_click",
          page_path: window.location.pathname,
          source,
          service,
          city,
          neighborhood,
          cta_id,
          destination: isWhatsAnchor ? "whatsapp" : undefined,
          surface: el.dataset.waSurface,
        });
      } catch {
        /* fila local nunca quebra fluxo */
      }
    },
    { capture: true },
  );
}
