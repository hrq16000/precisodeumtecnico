/**
 * Bridge exposto apenas quando `?e2e=1` está presente na URL.
 * Publica utilitários determinísticos em `window` para permitir asserções
 * E2E sem exigir a jornada completa do wizard nem depender de rede/Supabase.
 *
 * NÃO é montado em produção: o gate `?e2e=1` é verificado em runtime a
 * cada mount; usuários reais nunca acionam este componente.
 */
import { useEffect } from "react";
import { buildTriageWaUrlSynthetic, buildTriageContextSuffix, parseCityBairroFromPathname } from "@/lib/triage/engine";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

declare global {
  interface Window {
    __PDT_E2E__?: {
      buildTriageWaUrl: (opts: { equipment: string; symptomSlug: string; pathname?: string }) => string;
      parseCityBairro: (pathname: string) => { city?: string; bairro?: string };
      contextSuffix: (opts: { equipment?: string; symptomSlug?: string; pathname?: string }) => string;
    };
  }
}

function isE2E(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("e2e") === "1";
  } catch {
    return false;
  }
}

export function E2ETriageBridge() {
  useEffect(() => {
    if (!isE2E()) return;
    window.__PDT_E2E__ = {
      buildTriageWaUrl: ({ equipment, symptomSlug, pathname }) =>
        buildTriageWaUrlSynthetic({
          equipment,
          symptomSlug,
          pathname: pathname ?? window.location.pathname,
          whatsappNumber: WHATSAPP_NUMBER,
        }),
      parseCityBairro: parseCityBairroFromPathname,
      contextSuffix: buildTriageContextSuffix,
    };
    return () => { delete window.__PDT_E2E__; };
  }, []);
  return null;
}
