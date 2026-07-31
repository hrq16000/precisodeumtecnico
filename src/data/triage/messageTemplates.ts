/**
 * Templates de mensagem do WhatsApp por categoria/equipamento (Rodada 28).
 *
 * Objetivo: linguagem profissional e específica por intenção de busca, mantendo
 * os marcadores parseáveis (`cat`, `sym`, `cidade`, `bairro`) e a URL de origem.
 * Uma única fonte de verdade — o motor da triagem consome daqui.
 */
import type { EquipmentId } from "@/data/triage/config";

export interface MessageTemplate {
  /** Primeira linha da mensagem (abertura). */
  intro: string;
  /** Linha de fechamento antes do bloco de rastreio. */
  closing: string;
}

const DEFAULT_TEMPLATE: MessageTemplate = {
  intro: "Olá! Concluí a triagem obrigatória pelo site e gostaria de agendar o atendimento técnico.",
  closing: "Fico no aguardo da confirmação de horário e das orientações do técnico responsável.",
};

const TEMPLATES: Partial<Record<EquipmentId | string, MessageTemplate>> = {
  pc_notebook: {
    intro: "Olá! Concluí a triagem pelo site para atendimento de computador/notebook.",
    closing: "Preciso do equipamento operacional o quanto antes — aguardo a confirmação da agenda.",
  },
  tv: {
    intro: "Olá! Concluí a triagem pelo site para reparo de TV.",
    closing: "Aguardo a orientação sobre coleta/entrega e a confirmação do prazo de bancada.",
  },
  celular: {
    intro: "Olá! Concluí a triagem pelo site para reparo de celular/smartphone.",
    closing: "Aguardo a confirmação do procedimento e do prazo estimado de reparo.",
  },
  videogame: {
    intro: "Olá! Concluí a triagem pelo site para manutenção de console/videogame.",
    closing: "Aguardo a confirmação da agenda e das condições de atendimento.",
  },
  console: {
    intro: "Olá! Concluí a triagem pelo site para manutenção de console/videogame.",
    closing: "Aguardo a confirmação da agenda e das condições de atendimento.",
  },
  som_audio: {
    intro: "Olá! Concluí a triagem pelo site para atendimento de equipamento de som/áudio.",
    closing: "Aguardo a confirmação de horário para o atendimento.",
  },
  rede_wifi: {
    intro: "Olá! Concluí a triagem pelo site para atendimento de rede/Wi-Fi.",
    closing: "Aguardo a confirmação da visita técnica e do horário disponível.",
  },
  cftv: {
    intro: "Olá! Concluí a triagem pelo site para atendimento de CFTV/câmeras.",
    closing: "Aguardo a confirmação da visita técnica e do horário disponível.",
  },
  eletrica: {
    intro: "Olá! Concluí a triagem pelo site para atendimento elétrico.",
    closing: "Aguardo a confirmação da visita técnica e do horário disponível.",
  },
  ar_condicionado: {
    intro: "Olá! Concluí a triagem pelo site para atendimento de ar-condicionado.",
    closing: "Aguardo a confirmação da visita técnica e do horário disponível.",
  },
};

export function getMessageTemplate(equipment?: string): MessageTemplate {
  if (!equipment) return DEFAULT_TEMPLATE;
  return TEMPLATES[equipment] ?? DEFAULT_TEMPLATE;
}
