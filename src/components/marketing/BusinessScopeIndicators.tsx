/**
 * Rodada 3S — indicadores de escopo da página de serviço empresarial.
 *
 * Bloco compacto, sem números inventados, sem SLA e sem promessa de
 * disponibilidade. Só reafirma fatos já publicados na própria página.
 */
const ITEMS = [
  "Computadores e usuários",
  "Remoto e presencial",
  "Avulso ou recorrente",
  "Escopo autorizado antes da execução",
];

export function BusinessScopeIndicators({ className = "" }: { className?: string }) {
  return (
    <ul
      data-business-scope
      className={`grid gap-2 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
      aria-label="Indicadores de escopo do suporte empresarial"
    >
      {ITEMS.map((i) => (
        <li
          key={i}
          className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-foreground"
        >
          {i}
        </li>
      ))}
    </ul>
  );
}
