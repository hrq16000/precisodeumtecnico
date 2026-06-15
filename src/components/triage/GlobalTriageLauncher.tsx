import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TriageWizard } from "@/components/triage/TriageWizard";
import { isTriageEnabled } from "@/lib/triageFlag";
import type { Category } from "@/components/triage/triageMachine";

/**
 * Global TriageWizard launcher:
 *  - Mounts a single Dialog at the app root.
 *  - Listens to window event "triage:open" with detail { source, category, symptomSlug }.
 *  - Intercepts ALL clicks on `a[href*="wa.me"]` (and `tel:`) EXCEPT links
 *    explicitly marked `data-wa-keep="footer"` — the kill-switch.
 *  - Disabled entirely when isTriageEnabled() === false.
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
    };
    window.addEventListener("triage:open", onOpen);
    return () => window.removeEventListener("triage:open", onOpen);
  }, [enabled]);

  // Global click interceptor (kill-switch para CTAs WhatsApp/telefone).
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.("a") as HTMLAnchorElement | null;
      if (!target) return;
      if (target.dataset.waKeep === "footer") return; // exceção explícita
      const href = target.getAttribute("href") || "";
      const isWhats = href.includes("wa.me") || href.includes("api.whatsapp.com") || href.startsWith("whatsapp:");
      const isTel = href.startsWith("tel:");
      if (!isWhats && !isTel) return;
      e.preventDefault();
      e.stopPropagation();
      const source = target.dataset.waSource || target.dataset.triageSource || "cta-intercept";
      const category = (target.dataset.triageCategory as Category | undefined) ?? undefined;
      setDetail({ source, category });
      setOpen(true);
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
