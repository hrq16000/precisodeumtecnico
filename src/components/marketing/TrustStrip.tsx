/**
 * Rodada 3P — faixa de confiança com fatos já aprovados no repositório.
 * Não introduz claim novo: reutiliza ano de atuação, regra de valor antes da
 * execução e garantia conforme o serviço realizado.
 */
import { CalendarCheck, Wallet, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/data/companyInfo";

const ITEMS = [
  {
    icon: CalendarCheck,
    label: "Atuação em informática desde",
    value: String(COMPANY.foundingYear),
  },
  {
    icon: Wallet,
    label: "Valor informado",
    value: "antes da execução",
  },
  {
    icon: ShieldCheck,
    label: "Garantia",
    value: "conforme o serviço realizado",
  },
];

export function TrustStrip({ className = "" }: { className?: string }) {
  return (
    <ul
      data-trust-strip
      className={`grid gap-3 sm:grid-cols-3 ${className}`}
      aria-label="Condições de atendimento"
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
