/**
 * Fonte única de política de preços, prazos e condições comerciais.
 * Todos os componentes que exibem valores/prazos devem importar daqui.
 * Alterar aqui reflete no site inteiro sem risco de divergência.
 */

export const PRICING = {
  /** Diagnóstico em bancada / sem compromisso — sem visita */
  benchDiagnosis: {
    label: "Diagnóstico em bancada",
    priceBRL: 90,
    priceLabel: "R$ 90,00",
    description: "Diagnóstico sem compromisso em bancada.",
  },
  /** Visita técnica até 30 min */
  technicalVisit: {
    label: "Visita técnica (até 30 min)",
    priceBRL: 99.99,
    priceLabel: "R$ 99,99",
    minPriceBRL: 99.99,
    description: "Visita técnica no endereço do cliente, até 30 minutos.",
  },
  /** Coleta e entrega personalizada até 2h no endereço */
  pickupDelivery: {
    label: "Coleta e entrega personalizada",
    priceBRL: 299.99,
    priceLabel: "R$ 299,99",
    description:
      "Atendimento personalizado com coleta e entrega no endereço (até 2h), ou o cliente pode deixar/retirar no nosso endereço. Valor pré-aprovado.",
  },
} as const;

export const SLA = {
  /** Prazo mínimo em horas úteis para conclusão do atendimento */
  minBusinessHours: 72,
  minLabel: "72 horas úteis",
  /** Prazo máximo estimado */
  maxLabel: "3 semanas",
  disclaimer:
    "Prazos variam conforme equipamento, disponibilidade de peças e complexidade da situação.",
} as const;

export const COMMERCIAL = {
  installments: "Aceitamos em até 12x sem juros",
  experienceYears: 25,
  experienceLabel: "Mais de 25 anos de experiência",
  partnersLabel: "+5.000 parcerias no Brasil",
  partnersDisclaimer:
    "Parceiros podem praticar termos, condições, valores e prazos diferentes. Não somos responsáveis pelo tratamento direto com o parceiro.",
  triageRequirement:
    "Termos, condições, valores e prazos válidos somente com triagem completa e coleta/entrega diretamente com nossa central. Preenchimento obrigatório do formulário online com fotos e vídeos para iniciar o atendimento — sem cadastro, sem fotos e/ou vídeos prévios não é realizado o atendimento.",
} as const;

export const WHATSAPP = {
  /** Rótulo genérico usado em botões (número não deve aparecer) */
  ctaLabel: "WhatsApp 24h",
} as const;
