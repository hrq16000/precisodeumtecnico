/**
 * Bridge fila local → dataLayer (B.6).
 *
 * A fila local (`localAnalytics`) é isolada e nunca sai do tab por padrão.
 * Este bridge só drena eventos para o `window.dataLayer` quando:
 *   1. a flag `BRIDGE_ENABLED` estiver ligada (só após CMP homologada); e
 *   2. o visitante tiver consentido `analytics` (Consent Mode v2).
 *
 * Enquanto `BRIDGE_ENABLED = false`, `startAnalyticsBridge()` é no-op —
 * nenhum evento local é exportado.
 */

import { getConsentPrefs } from "./consent";
import { readLocalAnalyticsQueue, type LocalAnalyticsEvent } from "./localAnalytics";

/** Trava mestra — ativar somente após a CMP estar habilitada em produção. */
export const BRIDGE_ENABLED = false;

/** Campos exportáveis ao dataLayer (subset categórico, sem PII). */
const EXPORT_FIELDS = [
  "event",
  "page_path",
  "route_type",
  "surface",
  "cta_id",
  "source",
  "service",
  "city",
  "neighborhood",
  "step_id",
  "step_index",
  "completion_status",
  "destination",
] as const;

let cursor = 0;
let timer: ReturnType<typeof setInterval> | null = null;

export function bridgeAllowed(): boolean {
  if (!BRIDGE_ENABLED) return false;
  if (typeof window === "undefined") return false;
  return getConsentPrefs()?.analytics === true;
}

function toDataLayerPayload(ev: LocalAnalyticsEvent): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of EXPORT_FIELDS) {
    const v = (ev as unknown as Record<string, unknown>)[key];
    if (v === undefined || v === null || v === "") continue;
    if (typeof v !== "string" && typeof v !== "number" && typeof v !== "boolean") continue;
    out[key] = v;
  }
  return out;
}

/** Drena eventos ainda não exportados. Retorna quantos foram enviados. */
export function flushAnalyticsBridge(): number {
  if (!bridgeAllowed()) return 0;
  const queue = readLocalAnalyticsQueue();
  if (cursor > queue.length) cursor = 0; // fila truncada (MAX_QUEUE)
  const pending = queue.slice(cursor);
  if (!pending.length) return 0;
  if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
  for (const ev of pending) window.dataLayer.push(toDataLayerPayload(ev));
  cursor = queue.length;
  return pending.length;
}

/** Inicia o dreno periódico. No-op enquanto a CMP não estiver habilitada. */
export function startAnalyticsBridge(intervalMs = 2000): void {
  if (!BRIDGE_ENABLED || timer !== null) return;
  timer = setInterval(() => {
    flushAnalyticsBridge();
  }, intervalMs);
}

export function stopAnalyticsBridge(): void {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

/** Helper de teste. */
export function __resetAnalyticsBridgeForTests(): void {
  cursor = 0;
  stopAnalyticsBridge();
}
