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

/** Normaliza telefone digitado (mantém apenas dígitos). */
export function normalizePhone(raw: string): string {
  return (raw || "").replace(/\D/g, "");
}

export function isValidPhone(raw: string): boolean {
  const d = normalizePhone(raw);
  return d.length >= 10 && d.length <= 13;
}

/** Percentual concluído da OS (0-100) com base na etapa atual. */
export function progressPercent(status: string): number {
  const i = stageIndex(status);
  return Math.round(((i + 1) / OS_STAGES.length) * 100);
}

export type SlaState = "ok" | "near" | "late" | "done" | "none";

/** Avalia o prazo estimado: no prazo, perto do prazo (<=1 dia) ou atrasado. */
export function slaState(order: { status: string; eta_date: string | null }, now = new Date()): SlaState {
  if (order.status === "concluido") return "done";
  if (!order.eta_date) return "none";
  const eta = new Date(`${order.eta_date}T23:59:59`);
  const diffDays = (eta.getTime() - now.getTime()) / 86_400_000;
  if (diffDays < 0) return "late";
  if (diffDays <= 1) return "near";
  return "ok";
}

export const SLA_LABEL: Record<SlaState, string> = {
  ok: "Dentro do prazo estimado",
  near: "Prazo estimado próximo do vencimento",
  late: "Prazo estimado excedido — acompanhamento em andamento",
  done: "Serviço concluído",
  none: "Prazo será definido após o diagnóstico",
};

/** Limite simples anti-abuso de consultas (client-side, por sessão). */
const RATE_KEY = "pdt_os_lookup_rate_v1";
export const LOOKUP_LIMIT = 8;
export const LOOKUP_WINDOW_MS = 60_000;

export function registerLookupAttempt(now = Date.now()): { allowed: boolean; retryInSeconds: number } {
  try {
    const raw = sessionStorage.getItem(RATE_KEY);
    const list: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = list.filter((t) => now - t < LOOKUP_WINDOW_MS);
    if (recent.length >= LOOKUP_LIMIT) {
      const retry = Math.ceil((LOOKUP_WINDOW_MS - (now - recent[0])) / 1000);
      return { allowed: false, retryInSeconds: Math.max(retry, 1) };
    }
    recent.push(now);
    sessionStorage.setItem(RATE_KEY, JSON.stringify(recent));
    return { allowed: true, retryInSeconds: 0 };
  } catch {
    return { allowed: true, retryInSeconds: 0 };
  }
}
