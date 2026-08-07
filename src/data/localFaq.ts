/**
 * FAQ local por bairro/cidade — Rodada 32.
 *
 * Objetivo: cada FAQPage precisa ser específico da localidade (Google ignora
 * blocos idênticos replicados em 170+ URLs). Aqui as perguntas são montadas a
 * partir de dados que EXISTEM no repositório para aquela localidade:
 *
 *   • tempo médio de deslocamento declarado no texto curado do bairro;
 *   • serviços realmente citados no texto curado (sem inventar demanda);
 *   • bairros vizinhos reais (lista de cobertura da cidade);
 *   • condições comerciais oficiais (src/data/commercialTerms.ts).
 *
 * Nenhuma alegação nova de nota fiscal, parcelamento ou prazo fixo de garantia
 * é emitida aqui — essas afirmações não têm fonte única no repositório.
 */

import { COMMERCIAL_TERMS } from "./commercialTerms";

export interface LocalFaqItem {
  question: string;
  answer: string;
}

/** Extrai "Tempo médio: 60-75 minutos" / "em 30-45 minutos" do texto curado. */
export function extractEtaRange(text?: string): string | null {
  if (!text) return null;
  const m = text.match(/(\d{2,3})\s*[-–a]\s*(\d{2,3})\s*minutos/i);
  return m ? `${m[1]} a ${m[2]} minutos` : null;
}

const FOCUS_RULES: { re: RegExp; label: string }[] = [
  { re: /formata/i, label: "formatação e reinstalação de sistema" },
  { re: /v[íi]rus|ransomware/i, label: "remoção de vírus" },
  { re: /mesh|wi-?fi|internet/i, label: "Wi-Fi e redes mesh" },
  { re: /cabeamento/i, label: "cabeamento estruturado" },
  { re: /cftv|c[âa]mera/i, label: "CFTV e câmeras" },
  { re: /notebook|tela/i, label: "reparo de notebook" },
  { re: /impressora/i, label: "impressora em rede" },
  { re: /automa[çc][ãa]o|smart-?home/i, label: "automação residencial" },
  { re: /backup|nuvem/i, label: "backup de dados" },
  { re: /el[ée]tric/i, label: "manutenção elétrica leve" },
  { re: /empresa|corporativ|escrit[óo]rio|com[ée]rcio|ind[úu]stri|pme|ti\b/i, label: "suporte para empresas e comércios" },
  { re: /upgrade|ssd/i, label: "upgrade de SSD e memória" },
];

/** Lista de serviços citados no texto curado da localidade. */
export function extractFocusServices(text?: string, fallback: string[] = []): string[] {
  if (!text) return fallback;
  const found = FOCUS_RULES.filter((r) => r.re.test(text)).map((r) => r.label);
  return found.length >= 2 ? found.slice(0, 5) : fallback;
}

function joinPt(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

const DEFAULT_FOCUS = [
  "formatação e reinstalação de sistema",
  "remoção de vírus",
  "Wi-Fi e redes mesh",
  "CFTV e câmeras",
  "reparo de notebook",
];

export interface BairroFaqInput {
  bairroName: string;
  cityName: string;
  /** Texto curado do bairro (intro) — fonte do tempo médio e dos serviços. */
  intro?: string;
  /** Bairros vizinhos reais da mesma cidade. */
  nearby?: string[];
}

/** FAQ específica de um bairro — 5 perguntas, todas ancoradas na localidade. */
export function buildBairroFaqs({ bairroName, cityName, intro, nearby = [] }: BairroFaqInput): LocalFaqItem[] {
  const eta = extractEtaRange(intro);
  const focus = extractFocusServices(intro, DEFAULT_FOCUS);
  const vizinhos = nearby.slice(0, 5);

  const faqs: LocalFaqItem[] = [
    {
      question: `Em quanto tempo o técnico chega no ${bairroName}, em ${cityName}?`,
      answer: eta
        ? `O tempo médio de deslocamento até o ${bairroName} é de ${eta} em horário comercial, conforme a agenda do dia. Fora do horário comercial o atendimento começa pela triagem online, que já registra o chamado e define a modalidade (visita, bancada ou coleta).`
        : `O atendimento no ${bairroName}, em ${cityName}, é agendado pela triagem online: você descreve o problema e recebe a janela de deslocamento disponível para o bairro no mesmo dia útil, conforme a agenda da equipe.`,
    },
    {
      question: `Quais serviços vocês mais atendem no ${bairroName}?`,
      answer: `No ${bairroName} os chamados mais frequentes são ${joinPt(focus)}. Todos passam pela mesma triagem técnica, que classifica o caso antes de qualquer deslocamento até o bairro.`,
    },
    {
      question: `Quanto custa o diagnóstico para quem está no ${bairroName}?`,
      answer: `A taxa de diagnóstico é ${COMMERCIAL_TERMS.diagnosisFee.priceLabel}, o mesmo valor praticado em todo o atendimento em ${cityName}. Quando o equipamento precisa sair para bancada, o Orçamento Pré-Aprovado tem valor mínimo de ${COMMERCIAL_TERMS.preApprovedBudget.minLabel}, que não inclui peças, componentes ou materiais — esses são informados separadamente e só seguem com a sua aprovação.`,
    },
    {
      question: `Qual é o prazo quando o equipamento precisa sair do ${bairroName} para a bancada?`,
      answer: `O prazo mínimo operacional é de ${COMMERCIAL_TERMS.minimumQueue.label}. ${COMMERCIAL_TERMS.minimumQueue.description} A retirada e a devolução no ${bairroName} são combinadas na abertura do chamado.`,
    },
  ];

  if (vizinhos.length > 0) {
    faqs.push({
      question: `Vocês atendem os bairros vizinhos ao ${bairroName}?`,
      answer: `Sim. A partir do ${bairroName} a mesma equipe cobre ${joinPt(vizinhos)}, em ${cityName}, sem custo adicional de deslocamento entre bairros da mesma cidade.`,
    });
  } else {
    faqs.push({
      question: `Como faço para abrir um chamado no ${bairroName}?`,
      answer: `O atendimento começa pela triagem online: você informa o equipamento, o sintoma e o bairro (${bairroName}). A triagem define a modalidade de atendimento e envia o resumo do chamado direto para a equipe.`,
    });
  }

  return faqs;
}

export interface CityFaqInput {
  cityName: string;
  neighborhoods: string[];
  serviceAreas: string[];
  /** Descrição curada da cidade (src/data/regions.ts). */
  description?: string;
}

/** FAQ específica de uma cidade — ancorada na cobertura real de bairros. */
export function buildCityFaqs({ cityName, neighborhoods, serviceAreas, description }: CityFaqInput): LocalFaqItem[] {
  const total = neighborhoods.length;
  const amostra = neighborhoods.slice(0, 8);

  return [
    {
      question: `Quais bairros de ${cityName} vocês atendem?`,
      answer: total > 0
        ? `São ${total} bairros mapeados em ${cityName}, entre eles ${joinPt(amostra)}. Cada bairro tem página própria com o tempo médio de deslocamento e os serviços mais pedidos na região.`
        : `Atendemos toda a área urbana de ${cityName}. O bairro é confirmado na triagem online antes do agendamento.`,
    },
    {
      question: `Quais serviços estão disponíveis em ${cityName}?`,
      answer: serviceAreas.length > 0
        ? `Em ${cityName} atendemos ${joinPt(serviceAreas.map((s) => s.toLowerCase()))}. A modalidade (visita no local, bancada ou coleta) é definida pela triagem conforme o equipamento e o sintoma descritos.`
        : `Em ${cityName} atendemos informática, redes, CFTV, elétrica e eletroportáteis, sempre com a modalidade definida pela triagem técnica.`,
    },
    {
      question: `Quanto custa o atendimento em ${cityName}?`,
      answer: `A taxa de diagnóstico é ${COMMERCIAL_TERMS.diagnosisFee.priceLabel}. Para serviços que exigem bancada, o Orçamento Pré-Aprovado parte de ${COMMERCIAL_TERMS.preApprovedBudget.minLabel} e contempla ${joinPt([...COMMERCIAL_TERMS.preApprovedBudget.includes].map((s) => s.toLowerCase()))}. Peças, componentes e materiais são orçados à parte e dependem da sua aprovação.`,
    },
    {
      question: `Qual é o prazo de atendimento em ${cityName}?`,
      answer: `O prazo mínimo operacional é de ${COMMERCIAL_TERMS.minimumQueue.label}. ${COMMERCIAL_TERMS.minimumQueue.description}`,
    },
    {
      question: `Como abrir um chamado em ${cityName}?`,
      answer: `${description ? `${description} ` : ""}O chamado começa pela triagem online: você informa equipamento, sintoma e bairro em ${cityName}, e recebe na sequência a modalidade de atendimento e o resumo do caso para confirmar com a equipe.`,
    },
  ];
}
