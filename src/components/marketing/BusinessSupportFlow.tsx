/**
 * Rodada 3S — fluxo de atendimento e impacto operacional (serviço empresarial).
 *
 * Apresenta as etapas já descritas no conteúdo da página, sem afirmar que
 * todas acontecem em uma única visita e sem criar prioridade automática.
 */
import { AlertCircle } from "lucide-react";

const STEPS = [
  "Solicitação",
  "Triagem",
  "Impacto e equipamentos afetados",
  "Modalidade (remoto, presencial ou bancada)",
  "Diagnóstico",
  "Autorização do escopo",
  "Execução",
  "Registro em ordem de serviço e orientação",
];

const IMPACT = [
  "Um usuário afetado ou vários usuários",
  "Equipamento crítico para a operação",
  "Rede, impressão ou acesso a arquivos",
  "Acesso a sistema externo mantido por terceiros",
  "Existe alternativa temporária enquanto o chamado corre",
];

export function BusinessSupportFlow({ className = "" }: { className?: string }) {
  return (
    <div data-business-flow className={className}>
      <ol className="grid gap-2 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm text-card-foreground"
          >
            <span
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-sm text-muted-foreground">
        As etapas não acontecem necessariamente em uma única visita: diagnóstico, autorização e
        execução podem ocorrer em momentos diferentes.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
        <p className="mb-2 font-semibold text-foreground">Como descrever o impacto operacional</p>
        <ul className="mb-3 space-y-1 text-sm text-muted-foreground">
          {IMPACT.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="flex items-start gap-2 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
          <span>
            O impacto informado ajuda na triagem, mas prazo e prioridade dependem de
            disponibilidade, escopo e eventual contratação específica.
          </span>
        </p>
      </div>
    </div>
  );
}
