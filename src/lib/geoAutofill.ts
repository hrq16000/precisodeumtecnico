/**
 * Telemetria de autopreenchimento geográfico.
 *
 * Regra: `geo_city_autofill_ip` deve disparar NO MÁXIMO uma vez por sessão,
 * mesmo com re-renderizações, StrictMode ou navegação SPA entre rotas.
 * O guard usa sessionStorage (persistente na aba) + um flag em memória
 * (cobre o caso de sessionStorage bloqueado por privacidade).
 */
import { trackEvent } from "@/lib/analytics";

const SESSION_KEY = "geo_city_autofill_ip_v1";
let firedInMemory = false;

export function trackGeoCityAutofillOnce(params: {
  city?: string;
  uf?: string;
  source?: string;
}): boolean {
  if (typeof window === "undefined") return false;
  if (!params.city) return false;
  if (firedInMemory) return false;
  try {
    if (sessionStorage.getItem(SESSION_KEY)) {
      firedInMemory = true;
      return false;
    }
  } catch {
    /* sessionStorage indisponível — o guard em memória cobre a sessão atual */
  }

  firedInMemory = true;
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* noop */
  }

  trackEvent("geo_city_autofill_ip", {
    city: params.city,
    uf: params.uf ?? "",
    geo_source: params.source ?? "ip",
  });
  return true;
}

/** Apenas para testes — reseta o guard em memória e da sessão. */
export function __resetGeoAutofillGuard() {
  firedInMemory = false;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* noop */
  }
}
