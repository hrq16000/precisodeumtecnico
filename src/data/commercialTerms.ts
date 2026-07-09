/**
 * Fonte única de termos comerciais oficiais.
 * Qualquer texto público sobre orçamento pré-aprovado, taxa de diagnóstico,
 * fila mínima ou peças/materiais adicionais DEVE derivar destas constantes.
 */

export const COMMERCIAL_TERMS = {
  /** Taxa cobrada em caso de cancelamento/desistência após diagnóstico. */
  diagnosisFee: {
    priceBRL: 99.99,
    priceLabel: "R$ 99,99",
  },

  /** Valor mínimo do Orçamento Pré-Aprovado (não inclui peças/materiais). */
  preApprovedBudget: {
    minBRL: 299.99,
    minLabel: "R$ 299,99",
    includes: [
      "Logística com seguro",
      "Diagnóstico técnico",
      "Tentativa de reparos compatíveis com a situação",
      "Procedimentos técnicos possíveis sem substituição de peças ou materiais adicionais",
    ] as const,
    excludes: [
      "Peças",
      "Componentes",
      "Materiais",
      "Itens adicionais",
    ] as const,
  },

  /** Fila mínima operacional. */
  minimumQueue: {
    label: "3 dias úteis ou 72 horas úteis",
    description:
      "Prazo mínimo operacional, sujeito à fila técnica, disponibilidade da equipe, logística e complexidade do atendimento.",
  },

  /** Texto oficial da política de Orçamento Pré-Aprovado. */
  preApprovedPolicyText:
    "O valor mínimo de Orçamento Pré-Aprovado é de R$ 299,99. Esse valor não inclui peças, componentes, materiais ou itens adicionais. O valor contempla logística com seguro, diagnóstico técnico e tentativa de reparos compatíveis com a situação do equipamento ou serviço, sempre dentro das possibilidades técnicas sem substituição de peças ou materiais adicionais. Caso seja identificada a necessidade de peça, componente, material ou item adicional, o valor será informado separadamente e somente seguirá mediante aprovação do cliente.",

  /** Texto oficial de cancelamento/desistência. */
  cancellationText:
    "Caso o cliente opte por cancelar o serviço ou desistir do reparo após o diagnóstico — seja em bancada, após a coleta ou após levar o equipamento a um dos nossos parceiros — será cobrada taxa de diagnóstico no valor de R$ 99,99.",

  /** Texto oficial de fila mínima. */
  minimumQueueText:
    "Os atendimentos seguem fila mínima de 3 dias úteis ou 72 horas úteis, conforme volume técnico, disponibilidade da equipe, logística e complexidade do serviço.",
} as const;
