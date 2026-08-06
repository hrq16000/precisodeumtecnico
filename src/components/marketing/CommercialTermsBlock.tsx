/**
 * Bloco reutilizável de condições comerciais.
 *
 * REGRA FAIL-CLOSED: todo texto aqui deriva exclusivamente das fontes únicas
 * `src/data/commercialTerms.ts` e `src/data/pricingPolicy.ts`.
 * É proibido acrescentar alegações não comprovadas (nota fiscal, parcelamento,
 * percentuais de garantia, prazos fixos). O guard `scripts/check-commercial-claims.ts`
 * bloqueia o deploy caso isso aconteça.
 */
import { Card } from "@/components/ui/card";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { PRICING, SLA } from "@/data/pricingPolicy";
import { COMPANY } from "@/data/companyInfo";
import { ClipboardCheck, Clock, ShieldCheck, Wallet } from "lucide-react";

interface Props {
  /** Título da seção (H2 por padrão). */
  title?: string;
  className?: string;
}

export function CommercialTermsBlock({
  title = "Orçamento, garantia e condições de pagamento",
  className = "",
}: Props) {
  const blocks = [
    {
      icon: ClipboardCheck,
      heading: "Orçamento antes da execução",
      body: COMMERCIAL_TERMS.preApprovedPolicyText,
    },
    {
      icon: Wallet,
      heading: "Diagnóstico e valores de referência",
      body: `${PRICING.benchDiagnosis.description} ${PRICING.technicalVisit.description} ${PRICING.pickupDelivery.description}`,
    },
    {
      icon: Clock,
      heading: "Prazos operacionais",
      body: `${COMMERCIAL_TERMS.minimumQueueText} ${SLA.disclaimer}`,
    },
    {
      icon: ShieldCheck,
      heading: "Cancelamento após diagnóstico",
      body: COMMERCIAL_TERMS.cancellationText,
    },
  ];

  return (
    <section
      aria-labelledby="condicoes-comerciais"
      className={`section-padding bg-secondary/30 ${className}`}
    >
      <div className="container-custom max-w-5xl">
        <h2
          id="condicoes-comerciais"
          className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3"
        >
          {title}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Condições publicadas a partir da nossa política comercial vigente. Atuação em
          informática desde {COMPANY.foundingYear}. Qualquer item fora do que está descrito
          abaixo é informado por escrito antes da execução.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {blocks.map(({ icon: Icon, heading, body }) => (
            <Card key={heading} className="p-5 h-full">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-1">{heading}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          {COMMERCIAL_TERMS.preApprovedBudget.minLabel} é o valor mínimo pré-aprovado e não
          inclui {COMMERCIAL_TERMS.preApprovedBudget.excludes.join(", ").toLowerCase()}.
        </p>
      </div>
    </section>
  );
}
