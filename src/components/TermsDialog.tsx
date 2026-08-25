import { ReactNode, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Truck,
  Clock,
  Wrench,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Package,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import {
  trackEvent,
  trackTermsOpen,
  trackTermsAccept,
  trackTermsFullPageClick,
  setStoredTermsAcceptance,
} from "@/lib/analytics";

interface TermsDialogProps {
  /** Element used as trigger. If omitted, a default underlined link is rendered. */
  trigger?: ReactNode;
  triggerClassName?: string;
  triggerLabel?: string;
  /** Called when the user clicks "Li e aceito os termos" inside the popup. */
  onAccept?: () => void;
  /** Source label used for analytics (e.g. "hero", "contact_form", "quick_form", "quiz"). */
  source?: string;
}

/**
 * Standardized "Termos de Orçamento Pré-Aprovado" popup.
 * - Same title, description and CTAs across every entrypoint.
 * - Tracks open / accept / full-page-click via dataLayer + GA4.
 * - Radix Dialog provides focus trap, ESC-to-close and a11y by default.
 */
export function TermsDialog({
  trigger,
  triggerClassName,
  triggerLabel = "Termos de Orçamento Pré-Aprovado",
  onAccept,
  source = "unknown",
}: TermsDialogProps) {
  const [open, setOpen] = useState(false);
  // Guard so terms_open fires once per open and terms_accept once per confirmation.
  const openFiredRef = useRef(false);
  const acceptFiredRef = useRef(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      if (!openFiredRef.current) {
        trackTermsOpen(source);
        openFiredRef.current = true;
      }
      acceptFiredRef.current = false;
    } else {
      // Reset open guard so the next open re-fires once.
      openFiredRef.current = false;
    }
  };

  const handleAccept = () => {
    if (acceptFiredRef.current) return;
    acceptFiredRef.current = true;
    trackTermsAccept(source);
    setStoredTermsAcceptance(true);
    onAccept?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className={
              triggerClassName ??
              "text-primary font-semibold hover:underline underline-offset-2"
            }
          >
            {triggerLabel}
          </button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-w-3xl p-0 gap-0 overflow-hidden"
        aria-describedby="terms-dialog-description"
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold w-fit mb-2">
            <Shield className="h-3.5 w-3.5" />
            Transparência e Segurança
          </div>
          <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
            Termos de Orçamento Pré-Aprovado
          </DialogTitle>
          <DialogDescription
            id="terms-dialog-description"
            className="text-muted-foreground"
          >
            Política de diagnóstico, reparo, prazos e logística de serviços técnicos.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 py-6 space-y-8">
            {/* 1 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  1 – Política de Orçamento Pré-Aprovado
                </h3>
              </div>
              <div className="space-y-3 text-sm text-foreground/85 leading-relaxed">
                <p>
                  Para agilizar o atendimento e evitar atrasos no processo de diagnóstico
                  técnico, os equipamentos enviados para análise são cadastrados com
                  orçamento pré-aprovado mínimo no valor de:
                </p>
                <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-foreground/85 mb-1">
                    Orçamento pré-aprovado mínimo
                  </p>
                  <p className="text-3xl font-bold text-primary">{COMMERCIAL_TERMS.preApprovedBudget.minLabel}</p>
                </div>
                <p>
                  Esse valor representa uma{" "}
                  <strong className="text-foreground">autorização inicial</strong> para
                  diagnóstico técnico e possível reparo do equipamento.
                </p>
                <p>
                  Caso o valor final do reparo seja superior ao orçamento pré-aprovado
                  mínimo, o cliente será{" "}
                  <strong className="text-foreground">informado previamente</strong> para
                  aprovação antes da execução do serviço.
                </p>
                <div className="bg-accent/30 rounded-lg p-3 border border-border">
                  <p className="text-foreground/90 text-xs">
                    O valor <strong className="text-foreground">não inclui {COMMERCIAL_TERMS.preApprovedBudget.excludes.join(", ").toLowerCase()}</strong>. Contempla logística com seguro, diagnóstico técnico e tentativa de reparos compatíveis com a situação do equipamento. Qualquer adicional será informado separadamente e somente executado mediante aprovação do cliente.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-accent/40 rounded-lg p-3">
                  <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-foreground">
                    <strong>
                      Nenhum reparo adicional será realizado sem confirmação do cliente.
                    </strong>
                  </p>
                </div>
              </div>
            </section>


            {/* 2 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  2 – Logística de Coleta e Entrega
                </h3>
              </div>
              <div className="space-y-3 text-sm text-foreground/85 leading-relaxed">
                <p>
                  Para garantir organização e eficiência operacional, os atendimentos
                  seguem um sistema de{" "}
                  <strong className="text-foreground">logística programada</strong>.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-accent/40 rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-foreground text-sm">Coleta</h4>
                    </div>
                    <p className="text-xs">
                      Mediante{" "}
                      <strong className="text-foreground">agendamento prévio</strong>
                    </p>
                  </div>
                  <div className="bg-accent/40 rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-foreground text-sm">Entrega</h4>
                    </div>
                    <p className="text-xs">
                      Mediante{" "}
                      <strong className="text-foreground">
                        agendamento após conclusão
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">3 – Prazos de Serviço</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3 border-2 border-primary/20">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Fila mínima operacional</span>
                  </div>
                  <span className="font-bold text-primary">{COMMERCIAL_TERMS.minimumQueue.label}</span>
                </div>
                <div className="flex items-center justify-between bg-accent/40 rounded-lg p-3 border border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Diagnóstico</span>
                  </div>
                  <span className="font-bold text-primary">7 a 15 dias</span>
                </div>
                <div className="flex items-center justify-between bg-accent/40 rounded-lg p-3 border border-border">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Reparo</span>
                  </div>
                  <span className="font-bold text-primary">20 a 60 dias úteis</span>
                </div>
                <div className="flex items-center justify-between bg-accent/40 rounded-lg p-3 border border-border">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Entrega</span>
                  </div>
                  <span className="font-bold text-primary">5 a 7 dias úteis</span>
                </div>
                <p className="text-xs italic pt-1">
                  {COMMERCIAL_TERMS.minimumQueue.description}
                </p>
              </div>
            </section>

            {/* 4 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  4 – Compromisso com o Serviço
                </h3>
              </div>
              <div className="space-y-2 text-sm text-foreground/85 leading-relaxed">
                <p>
                  Os equipamentos enviados para análise devem ser encaminhados com{" "}
                  <strong className="text-foreground">real intenção de reparo</strong>.
                  Durante o diagnóstico podem ser realizados testes técnicos, desmontagem
                  parcial, análise de componentes e procedimentos de verificação elétrica
                  ou eletrônica.
                </p>
              </div>
            </section>

            {/* 5 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-5 w-5 text-destructive" />
                <h3 className="text-lg font-bold text-foreground">
                  5 – Cancelamento ou Desistência
                </h3>
              </div>
              <div className="space-y-3 text-sm text-foreground/85 leading-relaxed">
                <p>
                  Caso o cliente opte por cancelar o serviço ou desistir do reparo após o
                  diagnóstico — seja em bancada, após a coleta ou após levar o equipamento
                  a um dos nossos parceiros — será cobrada taxa de diagnóstico no valor de:
                </p>
                <div className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-4 text-center">
                  <p className="text-xs text-foreground/85 mb-1">Taxa de diagnóstico</p>
                  <p className="text-3xl font-bold text-destructive">{COMMERCIAL_TERMS.diagnosisFee.priceLabel}</p>
                </div>
                <p>
                  Cobre análise técnica, testes, tempo de diagnóstico e manipulação do
                  equipamento.
                </p>
              </div>
            </section>

            {/* 6 */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  6 – Aceitação dos Termos
                </h3>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">
                Ao solicitar coleta, diagnóstico, envio para análise, orçamento ou reparo,
                o cliente declara estar{" "}
                <strong className="text-foreground">ciente e de acordo</strong> com estes
                Termos e Condições de Serviço.
              </p>
            </section>

            {/* Standardized footer / CTAs */}
            <div className="pt-4 border-t border-border space-y-3">
              {onAccept && (
                <DialogClose asChild>
                  <button
                    type="button"
                    data-testid="terms-accept"
                    onClick={handleAccept}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-3 rounded-lg transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Li e aceito os Termos de Orçamento Pré-Aprovado
                  </button>
                </DialogClose>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href="/termos-orcamento-pre-aprovado"
                  onClick={() => trackTermsFullPageClick(source)}
                  className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2"
                >
                  Abrir página completa
                </a>
                <a
                  data-wa-source="terms"
                  data-service="condições e termos do orçamento"
                  aria-label="Falar no WhatsApp sobre os termos do orçamento"
                  href={buildWhatsAppUrl({ service: "assistência técnica" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("whatsapp_click", { source: `terms_${source}` })
                  }
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Tirar dúvidas no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
