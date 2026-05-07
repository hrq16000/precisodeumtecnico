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
    // Ensure dataLayer exists so GTM picks events even if loaded later.
    if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
    window.dataLayer.push({ event: eventName, ...clean });
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, clean);
    }
  } catch {
    // swallow — analytics must never break UX
  }
}

// --- Terms popup events (GA4 / GTM) ---
export function trackTermsOpen(source: string) {
  trackEvent("terms_open", { source });
}
export function trackTermsAccept(source: string) {
  trackEvent("terms_accept", { source });
}
export function trackTermsFullPageClick(source: string) {
  trackEvent("terms_full_page_click", { source });
}

// --- Terms acceptance persistence (sessionStorage by default) ---
const TERMS_KEY = "pdt_terms_accepted_v1";

export function getStoredTermsAcceptance(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return (
      window.sessionStorage?.getItem(TERMS_KEY) === "1" ||
      window.localStorage?.getItem(TERMS_KEY) === "1"
    );
  } catch {
    return false;
  }
}

export function setStoredTermsAcceptance(accepted: boolean): void {
  try {
    if (typeof window === "undefined") return;
    if (accepted) {
      window.sessionStorage?.setItem(TERMS_KEY, "1");
    } else {
      window.sessionStorage?.removeItem(TERMS_KEY);
      window.localStorage?.removeItem(TERMS_KEY);
    }
  } catch {
    // ignore storage errors
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
