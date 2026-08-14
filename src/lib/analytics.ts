// Lightweight Google Analytics / GTM event tracking helpers.
// Safe to call when GA or dataLayer aren't loaded — no-op fallback.

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Params) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Allowlist rigorosa por evento legado (B.6).
 * Eventos listados aqui só trafegam as chaves declaradas — qualquer campo
 * novo (inclusive texto livre acidental) é descartado antes do dataLayer.
 */
const LEGACY_ALLOWLIST: Record<string, readonly string[]> = {
  location_flow: [
    "action", "source", "duration_ms", "from_cache", "has_city", "has_neighborhood",
    "has_address", "has_coords", "error", "reason", "status", "fallback", "accuracy_bucket",
  ],
  web_vital: ["metric_name", "metric_value", "metric_id", "metric_rating", "navigation_type"],
  terms_open: ["source"],
  terms_accept: ["source"],
  terms_full_page_click: ["source"],
  whatsapp_click: [
    "source", "service", "city", "bairro", "has_full_address",
    "source_component", "device_category", "traffic_channel",
  ],
};

/** Campos jamais permitidos em qualquer evento legado (PII / texto livre). */
const FORBIDDEN_KEYS = new Set([
  "problema", "problem", "descricao", "description", "mensagem", "message", "texto", "text",
  "telefone", "phone", "email", "endereco", "address", "rua", "numero", "complemento", "cep",
  "latitude", "longitude", "lat", "lng", "accuracy", "nome", "name", "cpf", "cnpj",
  "marca", "brand", "modelo", "model", "user_agent", "referrer", "form_data",
  "whatsapp_url", "wa_url", "lead_id", "user_id", "cta_label", "label",
]);

/** Texto livre é bloqueado por tamanho — rótulos curtos categóricos passam. */
const MAX_STRING_LEN = 60;

function filterParams(eventName: string, params: Params): Params {
  const allow = LEGACY_ALLOWLIST[eventName];
  const clean: Params = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (FORBIDDEN_KEYS.has(k.toLowerCase())) continue;
    if (allow && !allow.includes(k)) continue;
    if (typeof v === "string" && (v.length > MAX_STRING_LEN || /\s{2,}|[\n\r]/.test(v))) continue;
    clean[k] = v;
  }
  return clean;
}

export function trackEvent(eventName: string, params: Params = {}): void {
  try {
    if (typeof window === "undefined") return;
    const clean = filterParams(eventName, params);
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
  | "bairro_nacional"
  | "cidade_nacional"
  | "matrix_nacional"
  | "cta_section"
  | "blog"
  | "quiz"
  | "quick_form"
  | "advertising"
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
  // Legado (dataLayer + gtag → Google Ads preservado)
  trackEvent("cta_click", {
    surface: opts.surface,
    cta_id: opts.cta_id,
    label: opts.label,
    destination: opts.destination,
    service: opts.service,
    city: opts.city,
    bairro: opts.bairro,
    device_category: getDeviceCategory(),
    traffic_channel: getTrafficChannel(),
  });
  // Fila local isolada (sem PII, sem label/text livre)
  try {
    // Import lazy para evitar dependência circular com testes vitest.
    void import("@/lib/localAnalytics").then(({ pushLocalAnalyticsEvent }) => {
      pushLocalAnalyticsEvent({
        event: "cta_click",
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
        surface: opts.surface,
        cta_id: opts.cta_id,
        destination: opts.destination,
        service: opts.service,
        city: opts.city,
        neighborhood: opts.bairro,
      });
    });
  } catch {
    /* noop */
  }
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

/** Classificação simples do dispositivo para segmentação no GA4. */
export function getDeviceCategory(): "mobile" | "tablet" | "desktop" {
  try {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w < 768) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  } catch {
    return "desktop";
  }
}

/**
 * Origem do tráfego derivada de UTM/gclid e do referrer — usada para separar
 * Google Ads de SEO local nos eventos de conversão. Sem PII.
 */
export function getTrafficChannel(): "google_ads" | "paid" | "organic_search" | "social" | "referral" | "direct" {
  try {
    if (typeof window === "undefined") return "direct";
    const sp = new URLSearchParams(window.location.search);
    const attr = getAttributionParams();
    const medium = (sp.get("utm_medium") || attr.utm_medium || "").toLowerCase();
    if (sp.get("gclid") || attr.gclid || medium === "cpc" || medium === "ppc") return "google_ads";
    if (medium && /paid|display|cpm/.test(medium)) return "paid";
    const ref = document.referrer || "";
    if (!ref) return "direct";
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host === window.location.hostname) return "direct";
    if (/google\.|bing\.|duckduckgo\.|yahoo\./.test(host)) return "organic_search";
    if (/facebook\.|instagram\.|linkedin\.|t\.co|tiktok\./.test(host)) return "social";
    return "referral";
  } catch {
    return "direct";
  }
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

/**
 * B.6: `pathname`, `cta_label` e parâmetros UTM removidos do payload externo.
 * O caminho da página passa a existir apenas na fila local isolada
 * (`localAnalytics`), que nunca sai do tab sem consentimento (ver bridge).
 */
export function trackWhatsAppClick(opts: {
  source: string; // e.g. "hero", "quiz_result", "bairro_cta", "footer"
  service?: string;
  city?: string;
  bairro?: string;
  /** true se o usuário compartilhou endereço completo (rua/nº). Nunca envia o endereço em si. */
  has_full_address?: boolean;
  source_component?: string;
  /** Aceito por compatibilidade — nunca trafegado. */
  cta_label?: string;
  /** Somente fila local. */
  surface?: string;
  destination?: string;
  cta_id?: string;
}) {
  trackEvent("whatsapp_click", {
    source: opts.source,
    service: opts.service,
    city: opts.city,
    bairro: opts.bairro,
    has_full_address: opts.has_full_address ?? false,
    source_component: opts.source_component,
    device_category: getDeviceCategory(),
    traffic_channel: getTrafficChannel(),
  });
  try {
    void import("@/lib/localAnalytics").then(({ pushLocalAnalyticsEvent }) => {
      pushLocalAnalyticsEvent({
        event: "whatsapp_click",
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
        source: opts.source,
        service: opts.service,
        city: opts.city,
        neighborhood: opts.bairro,
        cta_id: opts.cta_id ?? opts.source,
        surface: opts.surface,
        destination: opts.destination,
      });
    });
  } catch {
    /* fila local nunca quebra fluxo */
  }
}




/**
 * B.1: `problema` (texto livre potencial) removido do payload legado.
 * Somente campos categóricos normalizados permanecem — service, urgencia
 * (enum curto), city/bairro. Nenhuma descrição, marca, modelo ou mensagem.
 */
export function trackQuizComplete(opts: {
  service: string;
  urgencia: string;
  city?: string;
  bairro?: string;
}) {
  trackEvent("quiz_complete", {
    service: opts.service,
    urgencia: opts.urgencia,
    city: opts.city,
    bairro: opts.bairro,
  });
}
