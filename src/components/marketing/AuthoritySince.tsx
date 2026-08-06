/**
 * Rodada 3K — Parte C.
 * Faixa curta de autoridade factual. Somente fatos já comprovados na fonte
 * única (src/data/companyInfo.ts + política comercial vigente).
 * Sem superlativos, estrelas, avaliações ou números de clientes.
 */
import { CalendarCheck, Receipt, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/data/companyInfo";

export function AuthoritySince({ className = "" }: { className?: string }) {
  const items = [
    { icon: CalendarCheck, text: `Atuação em informática desde ${COMPANY.foundingYear}` },
    { icon: Receipt, text: "Valor informado antes da execução" },
    { icon: ShieldCheck, text: "Garantia conforme o serviço realizado" },
  ];

  return (
    <section
      aria-label="Sinais de confiança"
      className={`border-y border-border bg-muted/40 py-3 ${className}`}
    >
      <div className="container-custom">
        <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8">
          {items.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
