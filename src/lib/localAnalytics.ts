/**
 * Fila local de analytics — Rodada 25.1 Bloco B.1.
 *
 * ISOLADA de `window.dataLayer` (que pertence ao gtag.js do Google Ads).
 * Não chama `gtag()`, não injeta script externo, não persiste em
 * localStorage/sessionStorage/cookie/backend. Somente memória do tab.
 *
 * Ativação futura de GTM/GA4 exigirá bridge separado:
 *   fila local → consentimento → dataLayer/gtag.
 * Esse bridge NÃO existe nesta rodada.
 */

export type CanonicalEvent =
  | "virtual_page_view"
  | "cta_click"
  | "whatsapp_click"
  | "triage_open"
  | "triage_step"
  | "triage_complete";

export type RouteType =
  | "home"
  | "service"
  | "service_city"
  | "matrix_nacional"
  | "matrix_fallback"
  | "national_city"
  | "national_neighborhood"
  | "region"
  | "institutional"
  | "internal"
  | "not_found";

const ALLOWED_FIELDS = new Set<string>([
  "event",
  "page_path",
  "page_title",
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
]);

const FORBIDDEN_FIELDS = new Set<string>([
  "problem", "problema",
  "description", "descricao", "descrição",
  "message", "mensagem",
  "text", "texto",
  "phone", "telefone",
  "email",
  "address", "endereco", "endereço",
  "street", "rua", "numero", "número", "complemento",
  "cep",
  "latitude", "longitude", "lat", "lng", "accuracy", "gps_accuracy",
  "brand", "marca",
  "model", "modelo",
  "name", "nome",
  "cpf", "cnpj",
  "lead_id", "user_id",
  "photo", "foto", "photos", "media", "attachment",
  "whatsapp_url", "wa_url",
  "user_agent", "referrer",
  "form_data",
]);

export interface LocalAnalyticsEvent {
  event: CanonicalEvent;
  page_path?: string;
  page_title?: string;
  route_type?: RouteType;
  surface?: string;
  cta_id?: string;
  source?: string;
  service?: string;
  city?: string;
  neighborhood?: string;
  step_id?: string;
  step_index?: number;
  completion_status?: "started" | "in_progress" | "completed" | "abandoned";
  destination?: string;
}

const QUEUE_KEY = "__PDT_ANALYTICS_QUEUE__";
const MAX_QUEUE = 200;
// Dedupe temporal secundário (proteção StrictMode + delegator/handler).
const DEDUPE_MS = 400;
// Cache de identidade semântica por evento (bloqueia re-render mas permite
// segunda ocorrência legítima após "reset semântico" ex.: reabrir triagem).
const semanticSeen = new Map<string, number>();

interface QueueHost {
  [QUEUE_KEY]?: LocalAnalyticsEvent[];
}

function getQueue(): LocalAnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  const host = window as unknown as QueueHost;
  if (!Array.isArray(host[QUEUE_KEY])) host[QUEUE_KEY] = [];
  return host[QUEUE_KEY]!;
}

function isSerializable(v: unknown): v is string | number | boolean {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean";
}

function sanitize(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [rawKey, value] of Object.entries(input)) {
    const key = rawKey.trim();
    if (!key) continue;
    if (FORBIDDEN_FIELDS.has(key.toLowerCase())) continue;
    if (!ALLOWED_FIELDS.has(key)) continue;
    if (value === undefined || value === null) continue;
    if (!isSerializable(value)) continue;
    if (typeof value === "string" && value.trim().length === 0) continue;
    out[key] = value;
  }
  return out;
}

/**
 * Chave semântica de identidade para dedupe primário.
 * Estrutura por evento — permite reabertura legítima.
 */
function semanticKey(clean: Record<string, unknown>): string {
  const ev = String(clean.event);
  switch (ev) {
    case "virtual_page_view":
      return `pv|${clean.page_path ?? ""}`;
    case "triage_step":
      // step_id + step_index — permite voltar a passo anterior e reemitir.
      return `ts|${clean.step_id ?? ""}|${clean.step_index ?? ""}|${clean.source ?? ""}`;
    case "triage_open":
    case "triage_complete":
      // Sem chave semântica → dedupe apenas temporal (evita duplo re-render).
      return `${ev}|${clean.page_path ?? ""}|${clean.source ?? ""}`;
    case "cta_click":
    case "whatsapp_click":
      return `${ev}|${clean.page_path ?? ""}|${clean.cta_id ?? ""}|${clean.surface ?? ""}|${clean.source ?? ""}|${clean.destination ?? ""}`;
    default:
      return Object.keys(clean).sort().map((k) => `${k}=${String(clean[k])}`).join("|");
  }
}

/**
 * Enfileira evento na fila local isolada. Nunca lança. Nunca toca
 * `window.dataLayer`. Aplica allowlist + sanitização + dedupe.
 */
export function pushLocalAnalyticsEvent(payload: LocalAnalyticsEvent): void {
  try {
    if (typeof window === "undefined") return;
    if (typeof payload.event !== "string" || !payload.event) return;
    const clean = sanitize(payload as unknown as Record<string, unknown>);
    clean.event = payload.event;

    const key = semanticKey(clean);
    const now = Date.now();
    const prev = semanticSeen.get(key);
    if (prev !== undefined && now - prev < DEDUPE_MS) return;
    semanticSeen.set(key, now);

    const q = getQueue();
    q.push(clean as unknown as LocalAnalyticsEvent);
    while (q.length > MAX_QUEUE) q.shift();
  } catch {
    /* analytics nunca quebra UX */
  }
}

/** Reinicia identidade semântica para um evento específico (ex.: nova sessão de triagem). */
export function resetSemanticKey(prefix: string): void {
  for (const k of Array.from(semanticSeen.keys())) {
    if (k.startsWith(prefix)) semanticSeen.delete(k);
  }
}

/** Helper de teste. */
export function __resetLocalAnalyticsForTests(): void {
  semanticSeen.clear();
  if (typeof window !== "undefined") {
    (window as unknown as QueueHost)[QUEUE_KEY] = [];
  }
}

/** Leitura só-leitura da fila (para testes/inspeção). */
export function readLocalAnalyticsQueue(): LocalAnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  return [...getQueue()];
}
