/**
 * Auditoria de cliques em CTAs WhatsApp/telefone.
 *
 * Todos os cliques passam por `GlobalTriageLauncher` e são registrados aqui.
 * - `bypass=false` → o click foi corretamente interceptado e o funil abriu.
 * - `bypass=true`  → o click ESCAPOU do funil (whitelist ou navegação direta).
 *
 * Falhas do insert são silenciosas (auditoria não pode quebrar UX).
 */
import { supabase } from "@/integrations/supabase/client";

export interface WaAuditPayload {
  source?: string;
  href?: string | null;
  kind?: "whatsapp" | "tel";
  category?: string | null;
  bypass: boolean;
  sessionId?: string | null;
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

export async function logWaEvent(p: WaAuditPayload): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("wa_bypass_events" as any) as any).insert({
      source: p.source ?? null,
      href: p.href ?? null,
      kind: p.kind ?? "whatsapp",
      category: p.category ?? null,
      bypass: p.bypass,
      page_path:
        typeof window !== "undefined" ? window.location.pathname + window.location.search : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
      session_id: p.sessionId ?? getSessionId(),
    });
  } catch {
    /* silent */
  }
}
