/**
 * dataLayer local — Rodada 25.1 Bloco B (Opção C: DESATIVADO).
 *
 * Camada tipada e sanitizada de eventos que grava exclusivamente em
 * `window.dataLayer` no navegador. NÃO carrega GTM, NÃO chama
 * `gtag("event", ...)`, NÃO faz requisição externa. A tag Google Ads
 * preexistente é preservada em paralelo, sem interação com esta camada.
 *
 * Regras:
 *  - Somente campos da allowlist são aceitos.
 *  - Valores `undefined`/vazios são removidos.
 *  - Dedupe: mesmo evento + mesma chave em janela de 400ms é descartado
 *    (protege Strict Mode + delegators globais + onClick por componente).
 *  - Nunca lança erro para a UI.
 */

export type CanonicalEvent =
  | "virtual_page_view"
  | "cta_click"
  | "whatsapp_click"
  | "triage_open"
  | "triage_step"
  | "triage_complete";

/** RouteType canônico — mantido em resolver dedicado (useRoutePageview). */
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

/** Allowlist estrita — qualquer campo fora desta lista é descartado. */
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

/** Campos explicitamente proibidos — bloqueio defensivo além da allowlist. */
const FORBIDDEN_FIELDS = new Set<string>([
  "name",
  "nome",
  "phone",
  "telefone",
  "email",
  "cpf",
  "cnpj",
  "address",
  "endereco",
  "endereço",
  "street",
  "rua",
  "numero",
  "número",
  "complemento",
  "cep",
  "latitude",
  "longitude",
  "lat",
  "lng",
  "gps_accuracy",
  "message",
  "mensagem",
  "whatsapp_url",
  "wa_url",
  "text",
  "texto",
  "problema",
  "problem",
  "brand",
  "marca",
  "model",
  "modelo",
  "photo",
  "photos",
  "media",
  "attachment",
  "lead_id",
  "form_data",
  "user_agent",
  "referrer",
]);

export interface DataLayerPayload {
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

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
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
    if (typeof value === "string" && value.length === 0) continue;
    out[key] = value;
  }
  return out;
}

// Dedupe em memória (400ms) por chave estável.
let _lastKey: string | null = null;
let _lastAt = 0;
const DEDUPE_MS = 400;

function stableKey(entry: Record<string, unknown>): string {
  const keys = Object.keys(entry).sort();
  return keys.map((k) => `${k}=${String(entry[k])}`).join("|");
}

/** Push seguro no dataLayer local. Nunca lança. */
export function pushDataLayerEvent(payload: DataLayerPayload): void {
  try {
    if (typeof window === "undefined") return;
    const clean = sanitize(payload as unknown as Record<string, unknown>);
    // Evento é obrigatório e não pode ser descartado pela sanitização.
    if (typeof payload.event !== "string" || !payload.event) return;
    clean.event = payload.event;

    const key = stableKey(clean);
    const now = Date.now();
    if (_lastKey === key && now - _lastAt < DEDUPE_MS) return;
    _lastKey = key;
    _lastAt = now;

    if (!Array.isArray(window.dataLayer)) window.dataLayer = [];
    window.dataLayer.push(clean);
  } catch {
    /* analytics nunca quebra UX */
  }
}

/** Helper interno para tests: limpa dedupe. */
export function __resetDataLayerDedupe(): void {
  _lastKey = null;
  _lastAt = 0;
}
