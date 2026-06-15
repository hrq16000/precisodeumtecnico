/**
 * Feature flag central do TriageWizard.
 *
 * Fonte:
 *  - VITE_TRIAGE_ENABLED=true|false (build time)
 *  - querystring ?triage=1 / ?triage=0 (runtime override, útil para QA)
 *  - localStorage.triage = "1" | "0" (persistente para o admin testar)
 *
 * O wizard só é exposto em CTAs públicos quando `isTriageEnabled()` é true.
 * A rota /triagem-preview ignora a flag e sempre renderiza para validação visual.
 */
export function isTriageEnabled(): boolean {
  // 1) querystring
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

  // 3) env (default false — Fase B em rollout controlado)
  const v = import.meta.env.VITE_TRIAGE_ENABLED;
  return v === "true" || v === true;
}
