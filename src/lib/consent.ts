/**
 * Consentimento de cookies (LGPD) — fonte única.
 *
 * Nenhuma tag do Google (gtag.js / Google Ads / GA4) é carregada antes do
 * aceite explícito. A camada local (`localAnalytics`) continua isolada e sem
 * PII, mas o carregamento externo só acontece após `setConsent("granted")`.
 */

export const CONSENT_KEY = "pdt_cookie_consent_v1";
export const GOOGLE_TAG_ID = "AW-16491950534";

export type ConsentValue = "granted" | "denied";

export function getConsent(): ConsentValue | null {
  try {
    const v = window.localStorage?.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue): void {
  try {
    window.localStorage?.setItem(CONSENT_KEY, value);
  } catch {
    /* storage indisponível — decisão vale apenas para a sessão atual */
  }
  if (value === "granted") loadGoogleTag();
}

let loaded = false;

/** Injeta o gtag.js apenas uma vez, e somente com consentimento. */
export function loadGoogleTag(): void {
  if (typeof document === "undefined" || loaded) return;
  if (getConsent() !== "granted") return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args as unknown as Record<string, unknown>);
  };
  window.gtag = gtag as unknown as Window["gtag"];

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", GOOGLE_TAG_ID);
}

/** Chamado no bootstrap: restaura o consentimento salvo de visitas anteriores. */
export function initConsent(): void {
  if (getConsent() === "granted") loadGoogleTag();
}
