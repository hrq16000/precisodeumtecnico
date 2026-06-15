/**
 * Feature flag central do TriageWizard.
 *
 * Fonte:
 *  - VITE_TRIAGE_ENABLED=true|false (build time) — default agora é TRUE em produção
 *  - querystring ?triage=1 / ?triage=0 (runtime override, útil para QA)
 *  - localStorage.triage = "1" | "0" (persistente para o admin testar)
 *
 * Após Go-Live (Fase B), o wizard é o canal padrão de captação de leads.
 * O link direto do WhatsApp sobrevive APENAS no rodapé (data-wa-keep="footer")
 * para a regra "já sou cliente / orçamento aprovado".
 */
export function isTriageEnabled(): boolean {
  // 1) querystring (kill-switch manual)
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const qs = params.get("triage");
    if (qs === "1") return true;
    if (qs === "0") return false;

    // 2) localStorage
    try {
      const ls = window.localStorage.getItem("triage");
      if (ls === "1") return true;
      if (ls === "0") return false;
    } catch {
      /* ignore */
    }
  }

  // 3) env — default TRUE (go-live). Para desligar emergencialmente: VITE_TRIAGE_ENABLED=false
  const v = import.meta.env.VITE_TRIAGE_ENABLED;
  if (v === "false" || v === false) return false;
  return true;
}

/** Dispara o TriageWizard global. Use em CTAs que antes abriam o WhatsApp. */
export function openTriage(detail?: { source?: string; category?: string; symptomSlug?: string }) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("triage:open", { detail: detail ?? {} }));
}
