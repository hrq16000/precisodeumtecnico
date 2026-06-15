/**
 * Catálogo inicial de sintomas para Curitiba.
 * Alimenta:
 *  - SymptomFAQ (JSON-LD FAQPage)
 *  - TriageWizard (Fase B): pré-classificação automática
 *  - Hubs /sintomas/:slug (Fase C)
 *
 * Cada sintoma tem regra técnica que o TriageWizard irá ler:
 *  - mode: 'bancada' | 'visita' | 'coleta'
 *  - ticketMin/ticketMax: pré-orçamento em R$
 *  - slaMinDays/slaMaxDays: prazo realista
 *  - mediaRequired: foto/vídeo obrigatório
 */
export type ServiceMode = "bancada" | "visita" | "coleta";

export interface Symptom {
  slug: string;
  category: "tv" | "celular" | "console" | "notebook" | "pc" | "som";
  label: string;
  shortDescription: string;
  faq: { q: string; a: string }[];
  triage: {
    mode: ServiceMode;
    ticketMin: number;
    ticketMax: number;
    slaMinDays: number;
    slaMaxDays: number;
    mediaRequired: boolean;
  };
}

export const SYMPTOMS: Symptom[] = [
  {
    slug: "tv-nao-liga-led-pisca",
    category: "tv",
    label: "TV não liga e LED fica piscando",
    shortDescription:
      "LED de stand-by piscando indica, na maioria dos casos, falha na fonte ou na placa principal (T-CON).",
    faq: [
      { q: "TV com LED piscando tem conserto?", a: "Sim. Na maioria dos modelos LED/QLED é falha na fonte ou capacitores. O conserto é em bancada, com coleta e devolução." },
      { q: "Quanto custa consertar TV que não liga em Curitiba?", a: "A faixa real é de R$ 300 a R$ 500 para troca de fonte e R$ 450 a R$ 900 para placa principal. Diagnóstico + coleta R$ 99,99, abatido se aprovar." },
      { q: "Quanto tempo demora o reparo?", a: "Entre 15 e 60 dias, conforme disponibilidade da peça. SLA realista, sem promessa furada." },
    ],
    triage: { mode: "coleta", ticketMin: 300, ticketMax: 900, slaMinDays: 15, slaMaxDays: 60, mediaRequired: true },
  },
  {
    slug: "celular-tela-quebrada",
    category: "celular",
    label: "Celular com tela trincada",
    shortDescription: "Troca de display original ou nacional, com garantia.",
    faq: [
      { q: "Vocês trocam tela na hora?", a: "Sim, para a maioria dos modelos populares. Modelos premium (iPhone, Galaxy S/Note) podem levar 1 a 3 dias se a peça precisar ser solicitada." },
      { q: "Tem garantia?", a: "90 dias para defeito de peça, conforme CDC." },
    ],
    triage: { mode: "bancada", ticketMin: 250, ticketMax: 1800, slaMinDays: 0, slaMaxDays: 3, mediaRequired: true },
  },
  {
    slug: "ps5-ejetando-disco-sozinho",
    category: "console",
    label: "PS5 ejetando o disco sozinho",
    shortDescription: "Falha clássica do sensor do leitor de disco — reparo em bancada.",
    faq: [
      { q: "Tem conserto sem perder garantia da Sony?", a: "Se o aparelho ainda estiver na garantia oficial, recomendamos acionar a Sony. Fora da garantia, fazemos o reparo em bancada." },
      { q: "Quanto custa?", a: "Entre R$ 350 e R$ 600 conforme o componente afetado." },
    ],
    triage: { mode: "bancada", ticketMin: 350, ticketMax: 600, slaMinDays: 3, slaMaxDays: 10, mediaRequired: false },
  },
  {
    slug: "notebook-nao-liga",
    category: "notebook",
    label: "Notebook não liga",
    shortDescription: "Pode ser fonte, bateria, BIOS ou chip de alimentação na placa.",
    faq: [
      { q: "Vale a pena consertar notebook antigo?", a: "Avaliamos sem compromisso. Se o orçamento passar de 60% do valor de mercado, indicamos não reparar." },
      { q: "Faz a domicílio?", a: "Diagnóstico inicial em visita (R$ 99,99). Reparo de placa é sempre em bancada." },
    ],
    triage: { mode: "visita", ticketMin: 150, ticketMax: 1200, slaMinDays: 1, slaMaxDays: 15, mediaRequired: false },
  },
];

export function getSymptomBySlug(slug: string): Symptom | undefined {
  return SYMPTOMS.find((s) => s.slug === slug);
}
