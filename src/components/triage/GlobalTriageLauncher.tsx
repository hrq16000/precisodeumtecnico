import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TriageWizard } from "@/components/triage/TriageWizard";
import { isTriageEnabled } from "@/lib/triageFlag";
import type { Category } from "@/components/triage/triageMachine";
import { logWaEvent } from "@/lib/waAudit";

/**
 * Global TriageWizard launcher:
 *  - Um único Dialog na raiz.
 *  - Escuta `triage:open` com detail { source, category, symptomSlug }.
 *  - Intercepta cliques em `a[href*="wa.me"]`/`tel:` EXCETO os marcados com
 *    `data-wa-keep="footer"` (kill-switch legítimo do rodapé).
 *  - Auditoria: TODO clique é logado em `wa_bypass_events`.
 *      * bypass=false → interceptado e funil aberto.
 *      * bypass=true  → escapou (whitelist do rodapé) — dispara alerta no /admin.
 */
export function GlobalTriageLauncher() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<{ source?: string; category?: Category; symptomSlug?: string }>({});
  const location = useLocation();
  const enabled = isTriageEnabled();

  useEffect(() => {
    if (!enabled) return;
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<{ source?: string; category?: Category; symptomSlug?: string }>;
      setDetail(ce.detail ?? {});
      setOpen(true);
      logWaEvent({ source: ce.detail?.source, bypass: false, kind: "whatsapp" });
    };
    window.addEventListener("triage:open", onOpen);
    return () => window.removeEventListener("triage:open", onOpen);
  }, [enabled]);

  // Interceptor global (kill-switch p/ CTAs WhatsApp/telefone).
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.("a") as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute("href") || "";
      const isWhats = href.includes("wa.me") || href.includes("api.whatsapp.com") || href.startsWith("whatsapp:");
      const isTel = href.startsWith("tel:");
      if (!isWhats && !isTel) return;

      const source = target.dataset.waSource || target.dataset.triageSource || "cta-intercept";
      const category = (target.dataset.triageCategory as Category | undefined) ?? undefined;
      const kind: "whatsapp" | "tel" = isTel ? "tel" : "whatsapp";

      // Exceção do rodapé — clique passa direto, mas registra como BYPASS.
      if (target.dataset.waKeep === "footer") {
        logWaEvent({ source: source || "footer-keep", href, kind, bypass: true });
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      setDetail({ source, category });
      setOpen(true);
      logWaEvent({ source, href, kind, category, bypass: false });
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [enabled]);

  // Fecha o modal ao navegar entre rotas.
  useEffect(() => { setOpen(false); }, [location.pathname]);

  if (!enabled) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 border-0 bg-transparent shadow-none">
        <TriageWizard
          source={detail.source || "global-launcher"}
          initialCategory={detail.category}
          initialSymptomSlug={detail.symptomSlug}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
