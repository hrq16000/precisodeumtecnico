// Lightweight Google Analytics / GTM event tracking helpers.
// Safe to call when GA or dataLayer aren't loaded — no-op fallback.

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Params) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(eventName: string, params: Params = {}): void {
  try {
    if (typeof window === "undefined") return;
    const clean: Params = {};
    for (const [k, v] of Object.entries(params)) if (v !== undefined) clean[k] = v;
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, clean);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...clean });
    }
  } catch {
    // swallow — analytics must never break UX
  }
}

export function trackWhatsAppClick(opts: {
  source: string; // e.g. "hero", "quiz_result", "bairro_cta", "footer"
  service?: string;
  city?: string;
  bairro?: string;
}) {
  trackEvent("whatsapp_click", {
    source: opts.source,
    service: opts.service,
    city: opts.city,
    bairro: opts.bairro,
  });
}

export function trackQuizComplete(opts: {
  problema: string;
  service: string;
  urgencia: string;
  city?: string;
  bairro?: string;
}) {
  trackEvent("quiz_complete", {
    problema: opts.problema,
    service: opts.service,
    urgencia: opts.urgencia,
    city: opts.city,
    bairro: opts.bairro,
  });
}
