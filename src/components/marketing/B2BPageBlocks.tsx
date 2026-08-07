/**
 * Rodada 3T — blocos de diferenciação das três páginas empresariais.
 *
 * Cada página recebe um bloco visual próprio, sem repetir pilares, ordem ou
 * ícones das demais. Nada aqui introduz preço, prazo, SLA, plano mensal ou
 * capacidade nova: o conteúdo deriva do escopo já publicado nas landings.
 */
import {
  AlertTriangle,
  Building2,
  CopyCheck,
  Home,
  Printer,
  RefreshCw,
  Router,
  ShieldQuestion,
  Wrench,
} from "lucide-react";

/** Matriz de prioridade da preventiva — texto, não apenas cor, distingue os níveis. */
export function PreventivePriorityMatrix() {
  const rows: [string, string, string][] = [
    ["Imediata", "Risco de falha ou perda que exige avaliação", "Depende de autorização de escopo"],
    ["Programada", "Correção recomendada em prazo planejado", "Entra no próximo ciclo acordado"],
    ["Acompanhar", "Item funcional que merece monitoramento", "Registrado para comparação"],
    ["Informativa", "Melhoria possível sem urgência técnica", "Fica como recomendação"],
  ];
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">Níveis de prioridade usados no registro da preventiva</caption>
          <thead className="bg-muted/60">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground">Prioridade</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground">Significado</th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-foreground">Encaminhamento</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([p, s, e]) => (
              <tr key={p} className="border-t border-border">
                <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">{p}</th>
                <td className="px-4 py-3 text-muted-foreground">{s}</td>
                <td className="px-4 py-3 text-muted-foreground">{e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        data-preventive-limit
        className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm text-foreground"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
        <span>
          Manutenção preventiva reduz riscos, mas não elimina falhas inesperadas nem substitui backup,
          segurança e renovação de equipamentos. Nem toda recomendação é executada automaticamente:
          peça e intervenção dependem de autorização separada.
        </span>
      </p>
    </div>
  );
}

/** Backup — sincronização, backup e recuperação não são equivalentes. */
export function BackupConceptsBlock() {
  const cards = [
    {
      icon: RefreshCw,
      title: "Sincronização",
      text:
        "Replica alterações entre locais e pode replicar também exclusões ou corrupção de arquivo. Sozinha, não é backup.",
    },
    {
      icon: CopyCheck,
      title: "Backup",
      text:
        "Mantém cópias separadas, com versões ou retenção conforme a estratégia definida com a empresa.",
    },
    {
      icon: ShieldQuestion,
      title: "Recuperação de dados",
      text:
        "É uma tentativa posterior à perda, falha ou indisponibilidade — avaliada caso a caso, sem resultado prometido antes.",
    },
  ];
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} data-backup-concept className="rounded-xl border border-border bg-card p-4">
            <p className="mb-1 flex items-center gap-2 font-semibold text-card-foreground">
              <c.icon className="h-4 w-4 text-primary" aria-hidden="true" />
              {c.title}
            </p>
            <p className="text-sm text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>
      <p
        data-backup-restore-note
        className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-sm text-foreground"
      >
        Um backup só pode ser considerado confiável quando existe uma cópia separada e o processo de
        restauração é testado. O teste depende de disponibilidade, permissões, tamanho do conjunto,
        ambiente, aplicação, fornecedor e escopo contratado.
      </p>
    </div>
  );
}

/** Redes — público misto: contexto residencial e empresarial lado a lado (sem estado). */
export function NetworkAudienceBlocks() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div data-network-audience="residencial" className="rounded-xl border border-border bg-card p-4">
        <p className="mb-2 flex items-center gap-2 font-semibold text-card-foreground">
          <Home className="h-4 w-4 text-primary" aria-hidden="true" />
          Em casa ou home office
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Cobertura do sinal nos cômodos usados.</li>
          <li>Quedas durante chamadas e reuniões.</li>
          <li>Roteador, posicionamento e interferência.</li>
          <li>Vários dispositivos conectados ao mesmo tempo.</li>
        </ul>
      </div>
      <div data-network-audience="empresarial" className="rounded-xl border border-border bg-card p-4">
        <p className="mb-2 flex items-center gap-2 font-semibold text-card-foreground">
          <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
          No escritório ou empresa
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Vários usuários e uso simultâneo.</li>
          <li>Impressoras e pastas compartilhadas em rede.</li>
          <li>Access points, switch e cabeamento existente.</li>
          <li>Continuidade dos postos críticos.</li>
        </ul>
      </div>
    </div>
  );
}

/** Redes — cobertura ≠ velocidade, limites de operadora e escopo de impressoras. */
export function NetworkScopeLimits() {
  return (
    <div className="space-y-4">
      <div data-network-coverage className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
          <Router className="h-4 w-4 text-primary" aria-hidden="true" />
          Cobertura não é velocidade
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Sinal forte no aparelho não significa link contratado rápido.</li>
          <li>Link rápido não significa cobertura boa em todo o ambiente.</li>
          <li>Distância, parede, metal e interferência limitam qualquer equipamento.</li>
          <li>A operadora continua responsável pelo link externo.</li>
        </ul>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div data-network-scope="interno" className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-semibold text-card-foreground">
            <Wrench className="h-4 w-4 text-primary" aria-hidden="true" />
            Podemos verificar
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Rede local e Wi-Fi do ambiente.</li>
            <li>Cabos, portas e roteador existente.</li>
            <li>Dispositivos conectados e endereçamento.</li>
            <li>Configuração e compartilhamento interno.</li>
          </ul>
        </div>
        <div data-network-scope="operadora" className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 flex items-center gap-2 font-semibold text-card-foreground">
            <AlertTriangle className="h-4 w-4 text-primary" aria-hidden="true" />
            Depende da operadora
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Disponibilidade e sinal do link externo.</li>
            <li>Autenticação e equipamento do provedor.</li>
            <li>Manutenção externa na rua ou no prédio.</li>
            <li>Velocidade contratada efetivamente entregue.</li>
          </ul>
        </div>
      </div>

      <div data-network-printers className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
          <Printer className="h-4 w-4 text-primary" aria-hidden="true" />
          Impressoras e periféricos em rede
        </p>
        <p className="text-sm text-muted-foreground">
          O atendimento de impressoras e periféricos se limita à configuração, comunicação e
          compartilhamento em rede. Defeitos mecânicos ou eletrônicos dependem de assistência
          específica para o equipamento.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Abrange driver oficial, endereço IP, fila de impressão, descoberta na rede,
          compartilhamento, reconexão e scanner em rede compatível.
        </p>
      </div>
    </div>
  );
}
