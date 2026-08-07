/**
 * Propagação contextual do padrão empresarial para montagem de PC.
 *
 * Reaproveita a linguagem de processo das páginas B2B (escopo aprovado,
 * valor antes da execução, protocolo de OS) sem transformar a montagem em
 * serviço mensal ou ilimitado: montagem é execução por projeto, com começo,
 * checklist e entrega. Nenhum preço, prazo ou compromisso novo é introduzido.
 */
import { ClipboardCheck, PackageCheck, Wallet, Wrench } from "lucide-react";

const CRITERIA = [
  { icon: ClipboardCheck, label: "Escopo", value: "aprovado antes da montagem" },
  { icon: Wallet, label: "Valor", value: "informado antes da execução" },
  { icon: Wrench, label: "Execução", value: "por projeto, com checklist" },
  { icon: PackageCheck, label: "Entrega", value: "com testes registrados" },
];

const LIMITS = [
  "Montagem é serviço de execução pontual: não é plano mensal, assinatura nem suporte ilimitado.",
  "Atendimentos posteriores (ajustes, upgrades, reinstalação) são novos chamados, com escopo e valor próprios.",
  "Peças fornecidas pelo cliente seguem a política publicada de compatibilidade, procedência e garantia.",
];

export function AssemblyScopeBand({ className = "" }: { className?: string }) {
  return (
    <div data-assembly-scope className={className}>
      <ul
        data-b2b-criteria
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Critérios da montagem"
      >
        {CRITERIA.map(({ icon: Icon, label, value }) => (
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

      <div className="mt-6 rounded-xl border border-border bg-muted/30 p-5">
        <h3 className="font-bold text-foreground mb-2">Limites do escopo da montagem</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {LIMITS.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
