// Rascunho do funil de triagem: mantém respostas entre re-renderizações,
// navegação e recarregamentos para reduzir desistência.
//
// Regras:
// - sessionStorage (dado sensível não sobrevive ao fechamento do navegador);
// - TTL curto (6h) para nunca reaproveitar contexto antigo;
// - falha silenciosa: qualquer erro descarta o rascunho (fail-closed).

import type { TriageStateV2 } from "@/lib/triage/engine";

export const TRIAGE_DRAFT_KEY = "pdt_triage_draft_v1";
export const TRIAGE_DRAFT_TTL_MS = 6 * 60 * 60 * 1000;

interface DraftEnvelope {
  savedAt: number;
  state: TriageStateV2;
}

export function saveTriageDraft(state: TriageStateV2): void {
  try {
    if (typeof window === "undefined") return;
    const envelope: DraftEnvelope = { savedAt: Date.now(), state };
    window.sessionStorage.setItem(TRIAGE_DRAFT_KEY, JSON.stringify(envelope));
  } catch {
    /* noop */
  }
}

export function readTriageDraft(): TriageStateV2 | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem(TRIAGE_DRAFT_KEY);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as DraftEnvelope;
    if (!envelope?.state || typeof envelope.savedAt !== "number") return null;
    if (Date.now() - envelope.savedAt > TRIAGE_DRAFT_TTL_MS) {
      clearTriageDraft();
      return null;
    }
    return envelope.state;
  } catch {
    clearTriageDraft();
    return null;
  }
}

export function clearTriageDraft(): void {
  try {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(TRIAGE_DRAFT_KEY);
  } catch {
    /* noop */
  }
}

/** Mescla o rascunho no estado inicial sem perder campos novos do engine. */
export function mergeTriageDraft(initial: TriageStateV2, draft: TriageStateV2 | null): TriageStateV2 {
  if (!draft) return initial;
  return {
    ...initial,
    ...draft,
    contact: { ...initial.contact, ...(draft.contact ?? {}) },
    deviceDetails: { ...initial.deviceDetails, ...(draft.deviceDetails ?? {}) },
    contextualAnswers: { ...initial.contextualAnswers, ...(draft.contextualAnswers ?? {}) },
    scheduling: { ...(initial.scheduling ?? {}), ...(draft.scheduling ?? {}) },
    // Erros de validação nunca são restaurados.
    validationErrors: {},
  };
}
