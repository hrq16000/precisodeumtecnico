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


// --- Generic CTA tracking (standardized parameters) ---
// Use this for any internal/external CTA: service cards, city/bairro chips,
// "Ver todos" buttons, footer links, header nav, etc.
export type CtaSurface =
  | "header"
  | "footer"
  | "hero"
  | "services_section"
  | "regions_section"
  | "service_page"
  | "city_page"
  | "bairro_page"
  | "cta_section"
  | "blog"
  | "quiz"
  | "quick_form"
  | "contact_form";

export function trackCtaClick(opts: {
  surface: CtaSurface;
  cta_id: string; // stable id, e.g. "service_card", "city_chip", "view_all_services"
  label?: string; // visible text
  destination?: string; // href / route
  service?: string;
  city?: string;
  bairro?: string;
}) {
  trackEvent("cta_click", {
    surface: opts.surface,
    cta_id: opts.cta_id,
    label: opts.label,
    destination: opts.destination,
    service: opts.service,
    city: opts.city,
    bairro: opts.bairro,
  });
}

// --- Core Web Vitals tracking ---
// Pushes CLS/LCP/INP/FCP/TTFB to dataLayer + GA4. Initialised once in main.tsx.
export function trackWebVital(metric: {
  name: string;
  value: number;
  id: string;
  rating?: string;
  navigationType?: string;
}) {
  trackEvent("web_vital", {
    metric_name: metric.name,
    metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
  });
}

export function getAttributionParams(): Record<string, string> {
  try {
    if (typeof window === "undefined") return {};
    const sp = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
    const out: Record<string, string> = {};
    for (const k of keys) {
      const v = sp.get(k);
      if (v) out[k] = v;
    }
    // Persist first-touch attribution for the session
    try {
      const stored = window.sessionStorage?.getItem("pdt_attr_v1");
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, string>;
        for (const [k, v] of Object.entries(parsed)) if (!out[k]) out[k] = v;
      }
      if (Object.keys(out).length) {
        window.sessionStorage?.setItem("pdt_attr_v1", JSON.stringify(out));
      }
    } catch {
      /* ignore */
    }
    return out;
  } catch {
    return {};
  }
}

export function trackWhatsAppClick(opts: {
  source: string; // e.g. "hero", "quiz_result", "bairro_cta", "footer"
  service?: string;
  city?: string;
  bairro?: string;
  /** true se o usuário compartilhou endereço completo (rua/nº). Nunca envia o endereço em si. */
  has_full_address?: boolean;
  source_component?: string;
  cta_label?: string;
}) {
  trackEvent("whatsapp_click", {
    source: opts.source,
    service: opts.service,
    city: opts.city,
    bairro: opts.bairro,
    has_full_address: opts.has_full_address ?? false,
    source_component: opts.source_component,
    cta_label: opts.cta_label,
    pathname: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...getAttributionParams(),
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
