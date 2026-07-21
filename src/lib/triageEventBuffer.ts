/**
 * Buffer persistente de eventos de triagem em localStorage.
 *
 * Motivação: eventos `triage_back`, `triage_auto_advance` e
 * `triage_cta_intercept` são úteis para diagnóstico do funil mesmo quando
 * o usuário sai da página antes de terminar o wizard. A fila em memória
 * (`window.__PDT_ANALYTICS_QUEUE__`) evapora nesse caso. Este buffer
 * espelha esses três eventos em localStorage e é drenado (flush) quando:
 *   - o wizard completa (triage_complete), ou
 *   - o wizard é fechado / desmonta.
 *
 * Sem PII: só campos categóricos já aceitos pela allowlist do
 * `localAnalytics`. Nunca envia payload — apenas expõe leitura para
 * o próprio código do app (e testes).
 */

export type BufferedTriageEvent = {
  event: "triage_back" | "triage_auto_advance" | "triage_cta_intercept";
  ts: number;
  source?: string;
  step_id?: string;
  page_path?: string;
  surface?: string;
};

const STORAGE_KEY = "pdt_triage_event_buffer_v1";
const MAX_BUFFER = 100;

function safeParse(raw: string | null): BufferedTriageEvent[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as BufferedTriageEvent[]) : [];
  } catch {
    return [];
  }
}

export function persistTriageEvent(ev: Omit<BufferedTriageEvent, "ts">): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const list = safeParse(window.localStorage.getItem(STORAGE_KEY));
    list.push({ ...ev, ts: Date.now() });
    while (list.length > MAX_BUFFER) list.shift();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* silencioso — telemetria nunca quebra UX */
  }
}

export function readBufferedTriageEvents(): BufferedTriageEvent[] {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    return safeParse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

/**
 * Drena o buffer. Devolve os eventos removidos para o chamador poder
 * empurrá-los para a fila em memória (dataLayer local) ou expor em
 * `window.__PDT_TRIAGE_BUFFER_FLUSHED__` para inspeção em testes.
 */
export function flushTriageEventBuffer(): BufferedTriageEvent[] {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    const list = safeParse(window.localStorage.getItem(STORAGE_KEY));
    window.localStorage.removeItem(STORAGE_KEY);
    (window as unknown as { __PDT_TRIAGE_BUFFER_FLUSHED__?: BufferedTriageEvent[] }).__PDT_TRIAGE_BUFFER_FLUSHED__ = list;
    return list;
  } catch {
    return [];
  }
}

/** Helper de teste. */
export function __resetTriageEventBufferForTests(): void {
  try {
    if (typeof window !== "undefined") {
      window.localStorage?.removeItem(STORAGE_KEY);
      delete (window as unknown as { __PDT_TRIAGE_BUFFER_FLUSHED__?: unknown }).__PDT_TRIAGE_BUFFER_FLUSHED__;
    }
  } catch {
    /* noop */
  }
}
