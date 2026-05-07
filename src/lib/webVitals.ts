// Core Web Vitals reporter — initialised once at bootstrap. Forwards each
// metric to the analytics helper (dataLayer + GA4) and logs to console in dev.
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";
import { trackWebVital } from "./analytics";

let started = false;

export function initWebVitals() {
  if (started || typeof window === "undefined") return;
  started = true;

  const report = (m: Metric) => {
    trackWebVital({
      name: m.name,
      value: m.value,
      id: m.id,
      rating: m.rating,
      navigationType: m.navigationType,
    });
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug(`[web-vitals] ${m.name}: ${m.value.toFixed(2)} (${m.rating})`);
    }
  };

  onCLS(report);
  onINP(report);
  onLCP(report);
  onFCP(report);
  onTTFB(report);
}
