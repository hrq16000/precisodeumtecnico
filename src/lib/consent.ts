/**
 * Consentimento de cookies (LGPD + Google Consent Mode v2) — fonte única.
 *
 * Nada de terceiros carrega antes do aceite explícito:
 *  - `analytics` libera o gtag.js (medição);
 *  - `ads` libera o script do AdSense e a personalização de anúncios.
 *
 * A telemetria local (`localAnalytics`) continua isolada e sem PII.
 */

export const CONSENT_KEY = "pdt_cookie_consent_v1";
export const CONSENT_PREFS_KEY = "pdt_consent_prefs_v1";
export const GOOGLE_TAG_ID = "AW-16491950534";
export const ADSENSE_CLIENT = "ca-pub-3762170279587706";

export type ConsentValue = "granted" | "denied";

export interface ConsentPrefs {
  analytics: boolean;
  ads: boolean;
  /** ISO da decisão — prova de captura do consentimento. */
  decidedAt: string;
  version: 1;
}

function safeRead(key: string): string | null {
  try {
    return window.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: string): void {
  try {
    window.localStorage?.setItem(key, value);
  } catch {
    /* storage indisponível — decisão vale apenas para a sessão atual */
  }
}

/** Preferências granulares salvas, ou `null` quando o visitante ainda não decidiu. */
export function getConsentPrefs(): ConsentPrefs | null {
  const raw = safeRead(CONSENT_PREFS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<ConsentPrefs>;
      if (typeof parsed?.analytics === "boolean" && typeof parsed?.ads === "boolean") {
        return {
          analytics: parsed.analytics,
          ads: parsed.ads,
          decidedAt: parsed.decidedAt ?? new Date(0).toISOString(),
          version: 1,
        };
      }
    } catch {
      /* valor corrompido — trata como indeciso */
    }
  }
  // Compatibilidade com a decisão binária anterior.
  const legacy = safeRead(CONSENT_KEY);
  if (legacy === "granted") return { analytics: true, ads: true, decidedAt: new Date(0).toISOString(), version: 1 };
  if (legacy === "denied") return { analytics: false, ads: false, decidedAt: new Date(0).toISOString(), version: 1 };
  return null;
}

/** Decisão agregada (compatível com a API anterior). */
export function getConsent(): ConsentValue | null {
  const prefs = getConsentPrefs();
  if (!prefs) return null;
  return prefs.analytics || prefs.ads ? "granted" : "denied";
}

/** Grava as preferências granulares e aplica imediatamente (Consent Mode v2). */
export function setConsentPrefs(prefs: { analytics: boolean; ads: boolean }): ConsentPrefs {
  const stored: ConsentPrefs = { ...prefs, decidedAt: new Date().toISOString(), version: 1 };
  safeWrite(CONSENT_PREFS_KEY, JSON.stringify(stored));
  safeWrite(CONSENT_KEY, prefs.analytics || prefs.ads ? "granted" : "denied");
  applyConsent(stored);
  return stored;
}

/** API anterior: aceite/recusa em bloco. */
export function setConsent(value: ConsentValue): void {
  setConsentPrefs({ analytics: value === "granted", ads: value === "granted" });
}

let bootstrapped = false;
let gtagLoaded = false;
let adsLoaded = false;

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args as unknown as Record<string, unknown>);
}

/** Define o estado padrão do Consent Mode v2 (tudo negado) antes de qualquer tag. */
function bootstrapConsentMode(): void {
  if (bootstrapped || typeof document === "undefined") return;
  bootstrapped = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag ?? (gtag as unknown as Window["gtag"]);
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
}

function loadGtagScript(): void {
  if (gtagLoaded) return;
  gtagLoaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;
  document.head.appendChild(script);
  gtag("js", new Date());
  gtag("config", GOOGLE_TAG_ID);
}

/** Injeta o script do AdSense — somente com consentimento de publicidade. */
export function loadAdsense(): void {
  if (adsLoaded || typeof document === "undefined") return;
  const prefs = getConsentPrefs();
  if (!prefs?.ads) return;
  adsLoaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  document.head.appendChild(script);
}

/** Compatibilidade: carrega o gtag.js quando houver consentimento de medição. */
export function loadGoogleTag(): void {
  if (typeof document === "undefined") return;
  const prefs = getConsentPrefs();
  if (!prefs?.analytics) return;
  bootstrapConsentMode();
  loadGtagScript();
}

function applyConsent(prefs: ConsentPrefs): void {
  if (typeof document === "undefined") return;
  bootstrapConsentMode();
  gtag("consent", "update", {
    ad_storage: prefs.ads ? "granted" : "denied",
    ad_user_data: prefs.ads ? "granted" : "denied",
    ad_personalization: prefs.ads ? "granted" : "denied",
    analytics_storage: prefs.analytics ? "granted" : "denied",
  });
  if (prefs.analytics) loadGtagScript();
  if (prefs.ads) loadAdsense();
}

/** Chamado no bootstrap: aplica o consentimento salvo de visitas anteriores. */
export function initConsent(): void {
  if (typeof document === "undefined") return;
  bootstrapConsentMode();
  const prefs = getConsentPrefs();
  if (prefs) applyConsent(prefs);
}

/** Reabre o banner de preferências (usado nos links de rodapé/políticas). */
export const CONSENT_CHANGE_EVENT = "pdt:open-consent-preferences";

export function openConsentPreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT));
}
