/**
 * Rodada 3S — faixa de critérios das páginas empresariais.
 *
 * Substitui o TrustStrip residencial nas landings B2B. Só usa fatos já
 * publicados no repositório (ano de atuação, valor antes da execução,
 * garantia conforme o serviço) somados a critérios de processo verificáveis
 * na própria página (aprovação registrada, protocolo de OS).
 */
import { CalendarCheck, ClipboardCheck, FileCheck2, Wallet } from "lucide-react";
import { COMPANY } from "@/data/companyInfo";

const ITEMS = [
  { icon: CalendarCheck, label: "Atuação em informática desde", value: String(COMPANY.foundingYear) },
  { icon: Wallet, label: "Valor informado", value: "antes da execução" },
  { icon: ClipboardCheck, label: "Escopo", value: "aprovado por escrito" },
  { icon: FileCheck2, label: "Acompanhamento", value: "por protocolo de OS" },
];

export function B2BCriteriaBand({ className = "" }: { className?: string }) {
  return (
    <ul
      data-b2b-criteria
      data-trust-strip
      className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
      aria-label="Critérios do atendimento empresarial"
    >
      {ITEMS.map(({ icon: Icon, label, value }) => (
        <li
          key={label}
          className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 text-sm"
        >
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="text-card-foreground">
            <span className="text-muted-foreground">{label} </span>
            <strong className="font-semibold">{value}</strong>
          </span>
        </li>
      ))}
    </ul>
  );
}
