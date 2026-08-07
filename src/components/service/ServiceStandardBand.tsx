/**
 * Rodada 34 — Bloco padrão das páginas de serviço.
 * Renderiza a ficha obrigatória (valor inicial, tempo, incluso/não incluso,
 * acréscimos, observações, limitações e agendamento) a partir da fonte única
 * src/data/serviceStandards.ts. Sem valores hardcoded aqui.
 */
import { CheckCircle2, XCircle, Clock, Wallet, Info, AlertTriangle, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceStandard } from "@/data/serviceStandards";

interface Props {
  standard: ServiceStandard;
  className?: string;
}

function List({
  title,
  items,
  icon,
  tone,
  attr,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  tone: string;
  attr: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5" data-standard-block={attr}>
      <h3 className="mb-3 flex items-center gap-2 font-bold text-card-foreground">
        <span className={tone} aria-hidden="true">
          {icon}
        </span>
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceStandardBand({ standard, className = "" }: Props) {
  return (
    <section
      id="ficha-do-servico"
      data-service-standard={standard.slug}
      className={`mb-12 ${className}`}
      aria-labelledby="ficha-do-servico-title"
    >
      <h2
        id="ficha-do-servico-title"
        className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6"
      >
        Ficha do serviço
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <div className="rounded-xl border border-border/50 bg-card p-5" data-standard-block="valor-inicial">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-card-foreground">
            <Wallet className="h-5 w-5 text-primary" aria-hidden="true" />
            Valor inicial
          </h3>
          <p className="text-2xl font-bold text-foreground" data-standard-price>
            {standard.startingPriceLabel}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{standard.startingPriceNote}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-5" data-standard-block="tempo-estimado">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-card-foreground">
            <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
            Tempo estimado
          </h3>
          <p className="text-sm text-muted-foreground">
            Diagnóstico: <strong className="text-foreground">{standard.diagnosisDurationLabel}</strong>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Execução após aprovação:{" "}
            <strong className="text-foreground">{standard.executionSlaLabel}</strong>
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <List
          title="O que está incluso"
          items={standard.included}
          icon={<CheckCircle2 className="h-5 w-5" />}
          tone="text-success"
          attr="incluso"
        />
        <List
          title="O que não está incluso"
          items={standard.notIncluded}
          icon={<XCircle className="h-5 w-5" />}
          tone="text-destructive"
          attr="nao-incluso"
        />
        <List
          title="Possíveis acréscimos"
          items={standard.surcharges}
          icon={<Info className="h-5 w-5" />}
          tone="text-primary"
          attr="acrescimos"
        />
        <List
          title="Observações e limitações"
          items={[...standard.notes, ...standard.limitations]}
          icon={<AlertTriangle className="h-5 w-5" />}
          tone="text-accent"
          attr="observacoes"
        />
      </div>

      <div
        className="mt-4 rounded-xl border border-border bg-muted/40 p-5"
        data-standard-block="agendamento"
      >
        <h3 className="mb-2 flex items-center gap-2 font-bold text-foreground">
          <CalendarCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          Agendamento
        </h3>
        <p className="mb-3 text-sm text-muted-foreground">{standard.scheduling.description}</p>
        <Button
          size="lg"
          className="min-h-11 max-w-full whitespace-normal text-left leading-snug"
          data-triage-cta
          data-triage-source={standard.scheduling.source}
          data-triage-category={standard.scheduling.category}
        >
          {standard.scheduling.label}
        </Button>
      </div>
    </section>
  );
}
