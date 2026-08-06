// Fonte única das etapas públicas da Ordem de Serviço.
// O cliente consulta por protocolo em /status-os; nenhum dado pessoal é exposto.

export const OS_STAGES = [
  {
    key: "recebido",
    label: "Solicitação recebida",
    description: "Sua solicitação entrou na fila e o protocolo foi gerado.",
    slaText: "Retorno em até 1 dia útil",
  },
  {
    key: "agendado",
    label: "Atendimento agendado",
    description: "Data e período de visita, bancada ou coleta confirmados com você.",
    slaText: "Conforme período combinado",
  },
  {
    key: "diagnostico",
    label: "Diagnóstico técnico",
    description: "Equipamento em análise para identificar a causa real do defeito.",
    slaText: "1 a 3 dias úteis",
  },
  {
    key: "orcamento",
    label: "Orçamento enviado",
    description: "Escopo, peças e prazo enviados para sua aprovação antes de qualquer execução.",
    slaText: "Aguardando sua aprovação",
  },
  {
    key: "execucao",
    label: "Serviço em execução",
    description: "Reparo, montagem ou configuração em andamento após sua aprovação.",
    slaText: "2 a 5 dias úteis",
  },
  {
    key: "testes",
    label: "Testes finais",
    description: "Checklist de testes (estabilidade, temperatura, rede e periféricos) antes da entrega.",
    slaText: "Até 1 dia útil",
  },
  {
    key: "concluido",
    label: "Concluído / entregue",
    description: "Serviço finalizado, equipamento entregue e garantia registrada.",
    slaText: "Avaliação liberada",
  },
] as const;

export type OsStageKey = (typeof OS_STAGES)[number]["key"];

export interface ServiceOrderStatus {
  protocol: string;
  service: string | null;
  equipment: string | null;
  city: string | null;
  neighborhood: string | null;
  status: string;
  public_note: string | null;
  eta_date: string | null;
  created_at: string;
  updated_at: string;
}

export function stageIndex(status: string): number {
  const idx = OS_STAGES.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

/** Normaliza o protocolo digitado pelo cliente (aceita com/sem hífen e espaços). */
export function normalizeProtocol(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function formatEta(eta: string | null): string | null {
  if (!eta) return null;
  const [y, m, d] = eta.split("-");
  if (!y || !m || !d) return null;
  return `${d}/${m}/${y}`;
}
