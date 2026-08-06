/**
 * Fonte única do termo de declaração de valor do equipamento.
 *
 * Usado em: página de Termos e Condições e na política de peças do cliente.
 * Objetivo: permitir que o cliente mensure e declare o valor do equipamento
 * (eletrônicos, informática, som, placas e componentes) e fique ciente de que
 * indenização de seguradora, venda no estado ou avaliação técnica podem
 * resultar em valor bastante inferior ao declarado.
 *
 * Regra fail-closed: nenhum texto público sobre valor declarado, depreciação
 * ou sinistro pode ser escrito fora deste arquivo.
 */

export const EQUIPMENT_VALUATION = {
  intro:
    "Antes da coleta, do envio ou da montagem, o cliente declara o valor de mercado atual do equipamento e das peças entregues. Essa declaração é usada apenas como referência de conferência na entrada e na saída — ela não é seguro, não é garantia de reposição e não fixa valor de indenização.",

  /** Categorias que o cliente deve mensurar separadamente. */
  categories: [
    {
      label: "Informática",
      examples:
        "Notebooks, desktops, all-in-one, monitores, impressoras, nobreaks e periféricos.",
    },
    {
      label: "Eletrônicos e áudio/vídeo",
      examples:
        "TVs, receivers, mesas e caixas de som, amplificadores, projetores e consoles.",
    },
    {
      label: "Placas e componentes",
      examples:
        "Placa-mãe, placa de vídeo, processador, memórias, fontes, SSD/HD, coolers e placas eletrônicas avulsas.",
    },
    {
      label: "Dados e mídia",
      examples:
        "Conteúdo armazenado em discos, cartões e unidades externas — deve ter cópia de segurança feita pelo cliente antes da entrega.",
    },
  ],

  /** Como chegar a um valor realista (referência de mensuração). */
  howToMeasure: [
    "Considere o valor de venda do mesmo modelo, no mesmo estado de conservação, no mercado de usados — não o valor pago na compra.",
    "Some separadamente as peças que já foram trocadas ou que o próprio cliente está fornecendo.",
    "Desconsidere o valor do conteúdo (dados, projetos, fotos): dados não têm valor de reposição e devem ter backup próprio.",
    "Registre marca, modelo e número de série de cada item no termo de recebimento.",
  ],

  /** Termo de ciência que o cliente aceita ao entregar o equipamento. */
  acknowledgement:
    "Declaro o valor acima por minha própria estimativa e estou ciente e de acordo que, em caso de eventual sinistro, dano, perda, extravio ou venda do equipamento no estado, o valor efetivamente pago por seguradora, transportadora ou comprador poderá ser inferior a 1/3 do valor declarado, conforme avaliação técnica do estado real, da idade e da depreciação do equipamento e de suas peças.",

  /** Pontos de atenção obrigatórios. */
  notices: [
    "A declaração de valor não cria cobertura de seguro por parte da assistência.",
    "Equipamentos sem peças, sem tampa, com corrosão, oxidação ou reparo anterior de terceiros são avaliados no estado em que chegam.",
    "Backup dos dados é responsabilidade do cliente antes da entrega do equipamento.",
    "Divergência entre o valor declarado e o estado real constatado em bancada é registrada em laudo e comunicada por escrito antes de qualquer serviço.",
  ],
} as const;
