/**
 * Auditoria de cliques em CTAs WhatsApp/telefone.
 *
 * Todos os cliques passam por `GlobalTriageLauncher` e são registrados aqui.
 * - `bypass=false` → o click foi corretamente interceptado e o funil abriu.
 * - `bypass=true`  → o click ESCAPOU do funil (whitelist ou navegação direta).
 *
 * A tabela `wa_bypass_events` tem RLS com CHECK constraint no policy que
 * limita `kind ∈ {whatsapp, phone}` e tamanhos máximos. Fazemos validação
 * simétrica no cliente (truncate + normalize) para garantir que o insert
 * nunca seja rejeitado silenciosamente pelo Postgres.
 *
 * Falhas do insert são silenciosas (auditoria não pode quebrar UX).
 */
import { supabase } from "@/integrations/supabase/client";

export interface WaAuditPayload {
  source?: string;
  href?: string | null;
  /** API pública aceita "tel" (legado) — normalizado para "phone" no DB. */
  kind?: "whatsapp" | "tel" | "phone";
  category?: string | null;
  bypass: boolean;
  sessionId?: string | null;
}

/** Limites que espelham EXATAMENTE o CHECK do policy RLS. */
export const WA_AUDIT_LIMITS = {
  source: 120,
  href: 2048,
  category: 80,
  page_path: 2048,
  user_agent: 500,
  session_id: 128,
} as const;

/** Kinds aceitos pelo CHECK do banco. Qualquer outro valor é normalizado. */
export const WA_AUDIT_KINDS = ["whatsapp", "phone"] as const;
export type WaAuditKind = (typeof WA_AUDIT_KINDS)[number];

export function normalizeKind(k: WaAuditPayload["kind"]): WaAuditKind {
  if (k === "tel" || k === "phone") return "phone";
  return "whatsapp";
}

function trim(v: string | null | undefined, max: number): string | null {
  if (v == null) return null;
  const s = String(v);
  return s.length > max ? s.slice(0, max) : s;
}

function getSessionId(): string {
  try {
    const k = "wa_audit_sid";
    let v = sessionStorage.getItem(k);
    if (!v) {
      v =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID().replace(/-/g, "")
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(k, v);
    }
    return v;
  } catch {
    return "anon";
  }
}

export function buildWaAuditRow(p: WaAuditPayload) {
  return {
    source: trim(p.source, WA_AUDIT_LIMITS.source),
    href: trim(p.href, WA_AUDIT_LIMITS.href),
    kind: normalizeKind(p.kind),
    category: trim(p.category, WA_AUDIT_LIMITS.category),
    bypass: !!p.bypass,
    page_path:
      typeof window !== "undefined"
        ? trim(window.location.pathname + window.location.search, WA_AUDIT_LIMITS.page_path)
        : null,
    user_agent:
      typeof navigator !== "undefined"
        ? trim(navigator.userAgent, WA_AUDIT_LIMITS.user_agent)
        : null,
    session_id: trim(p.sessionId ?? getSessionId(), WA_AUDIT_LIMITS.session_id),
  };
}

export async function logWaEvent(p: WaAuditPayload): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("wa_bypass_events" as any) as any).insert(buildWaAuditRow(p));
  } catch {
    /* silent */
  }
}
