import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { TriageWizardV2 } from "@/components/triage/v2/TriageWizardV2";
import { TriageErrorBoundary } from "@/components/triage/v2/TriageErrorBoundary";
import { isTriageEnabled } from "@/lib/triageFlag";
import type { Category } from "@/components/triage/triageMachine";
import { logWaEvent } from "@/lib/waAudit";
import { pushLocalAnalyticsEvent } from "@/lib/localAnalytics";

/**
 * Global TriageWizard launcher.
 *
 * IMPORTANTE: cada abertura força REMOUNT do <TriageWizard> via `key={openCount}`
 * — resolve o bug em que o quiz reabria no passo final (state stale) e garante
 * que todo CTA principal sempre inicia do passo 1.
 *
 * No mobile o Dialog vira full-screen (100dvh) para foco total e sem overflow.
 */
export function GlobalTriageLauncher() {
  const [open, setOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [detail, setDetail] = useState<{ source?: string; category?: Category; symptomSlug?: string }>({});
  const location = useLocation();
  const enabled = isTriageEnabled();

  const openFresh = (
    d: { source?: string; category?: Category; symptomSlug?: string },
    href?: string,
    kind: "whatsapp" | "tel" = "whatsapp",
  ) => {
    setDetail(d ?? {});
    setOpenCount((n) => n + 1); // força remount → estado zerado
    setOpen(true);
    logWaEvent({ source: d?.source, href: href ?? null, kind, category: d?.category ?? null, bypass: false });
    pushLocalAnalyticsEvent({
      event: "triage_open",
      source: d?.source,
      surface: kind === "tel" ? "cta_tel" : "cta_whatsapp",
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  };

  useEffect(() => {
    if (!enabled) return;
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<{ source?: string; category?: Category; symptomSlug?: string }>;
      openFresh(ce.detail ?? {});
    };
    window.addEventListener("triage:open", onOpen);
    return () => window.removeEventListener("triage:open", onOpen);
  }, [enabled]);

  // Interceptor global (kill-switch p/ CTAs WhatsApp/telefone).
  useEffect(() => {
    if (!enabled) return;
    // Guarda anti-duplo-clique: bloqueia cliques em < 400ms.
    let lastClick = 0;
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

      if (target.dataset.waKeep === "footer") {
        logWaEvent({ source: source || "footer-keep", href, kind, bypass: true });
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (now - lastClick < 400) return; // dedupe
      lastClick = now;
      openFresh({ source, category }, href, kind);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [enabled]);

  // Fecha o modal ao navegar entre rotas.
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Marca <body> quando o modal está aberto — usado por CSS para esconder
  // botões flutuantes de WhatsApp e bloquear interação com o rodapé.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) document.body.setAttribute("data-triage-open", "true");
    else document.body.removeAttribute("data-triage-open");
    return () => document.body.removeAttribute("data-triage-open");
  }, [open]);

  if (!enabled) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="
          p-0 gap-0 border-0 bg-transparent shadow-none
          w-screen max-w-full h-[100dvh] rounded-none
          translate-x-0 translate-y-0 left-0 top-0
          sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]
          sm:w-full sm:max-w-[640px] sm:h-auto sm:rounded-lg
          overflow-hidden
          [&>button.absolute]:hidden
        "
      >
        <VisuallyHidden>
          <DialogTitle>Triagem técnica</DialogTitle>
          <DialogDescription>
            Assistente guiado para triagem obrigatória do seu equipamento em 7 etapas.
          </DialogDescription>
        </VisuallyHidden>
        <TriageErrorBoundary onReset={() => { setOpen(false); setTimeout(() => setOpenCount((n) => n + 1), 50); setTimeout(() => setOpen(true), 100); }}>
          <TriageWizardV2
            key={openCount}
            source={detail.source || "global-launcher"}
            onClose={() => setOpen(false)}
          />
        </TriageErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
