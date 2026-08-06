/**
 * Fonte única da política operacional de montagem e configuração de
 * desktops / PC Gamer (confirmação operacional do proprietário — 2026-08-06).
 *
 * Regras fail-closed:
 * - Nada aqui pode prometer FPS, ganho de desempenho, overclock ou preço fechado.
 * - Todo texto público sobre montagem, peças do cliente, garantia delimitada e
 *   checklist de testes DEVE derivar destas constantes.
 */

export const PC_ASSEMBLY_POLICY = {
  /** Escopo operacional confirmado. */
  scope: {
    buildsFromScratch: true,
    acceptsCustomerParts: true,
    summary:
      "Montamos desktops e PCs para jogos do zero, a partir de peças novas adquiridas pelo cliente ou fornecidas por ele, e também configuramos e revisamos máquinas já montadas.",
    included: [
      "Montagem física completa do gabinete e dos componentes",
      "Conferência de compatibilidade entre placa-mãe, processador, memória, armazenamento e gabinete",
      "Conferência do conector e da capacidade da fonte para os componentes recebidos",
      "Instalação de air cooler ou water cooler selado (AIO) e aplicação de pasta térmica",
      "Organização de cabos e fluxo de ar do gabinete",
      "Configuração de BIOS/UEFI dentro dos perfis oficiais do fabricante",
      "Instalação do sistema operacional com licença válida apresentada pelo cliente",
      "Instalação de drivers oficiais dos fabricantes dos componentes",
      "Testes finais de memória, temperatura, armazenamento e estabilidade",
    ],
    excluded: [
      "Overclock de processador, memória ou placa de vídeo",
      "Loop de water cooler aberto (custom)",
      "Promessa de FPS, pontuação em benchmark ou desempenho em jogos específicos",
      "Venda de peças com preço fechado sem orçamento por escrito",
      "Reparo eletrônico de componentes com defeito (encaminhamos à garantia do fornecedor)",
    ],
  },

  /** Política para peças fornecidas pelo cliente. */
  customerParts: {
    accepted: true,
    rules: [
      {
        title: "Compatibilidade",
        text: "Antes da montagem conferimos soquete, chipset, padrão de memória, conectores de energia, espaço interno do gabinete e capacidade da fonte. Se alguma peça for incompatível, a montagem é interrompida e informamos por escrito antes de qualquer cobrança adicional.",
      },
      {
        title: "Procedência",
        text: "Só aceitamos peças com nota ou comprovante de compra em nome do cliente. Peças sem comprovação de origem não são montadas.",
      },
      {
        title: "Integridade no recebimento",
        text: "Toda peça recebida é registrada em termo de recebimento com marca, modelo, número de série e fotos do estado aparente, assinado pelo cliente na entrada e na retirada.",
      },
      {
        title: "Peça com defeito",
        text: "Se a peça apresentar defeito nos testes, devolvemos o item com o laudo dos testes executados. O acionamento da garantia é feito pelo cliente junto ao vendedor ou fabricante — não substituímos nem trocamos peças de terceiros.",
      },
      {
        title: "Prazos de troca",
        text: "Enquanto o cliente aciona a troca junto ao fornecedor, o equipamento fica aguardando em bancada por até 5 dias úteis. Passado esse prazo sem retorno, devolvemos o equipamento no estado em que está, com o serviço já executado cobrado normalmente.",
      },
      {
        title: "Peças usadas",
        text: "Peças usadas podem ser montadas mediante registro expresso no termo de recebimento, sem qualquer garantia sobre o componente e sem garantia de estabilidade do conjunto.",
      },
    ],
  },

  /** Garantia delimitada: mão de obra x peça. */
  warranty: {
    labor: {
      title: "Garantia da montagem (mão de obra)",
      text: "Cobre exclusivamente o serviço executado: encaixe e fixação dos componentes, roteamento de cabos, aplicação de pasta térmica e instalação do cooler. Prazo registrado por escrito no comprovante de entrega de cada atendimento.",
    },
    configuration: {
      title: "Garantia da configuração",
      text: "Cobre a configuração entregue: perfis de BIOS/UEFI aplicados por nós, instalação do sistema e dos drivers oficiais. Não cobre alterações feitas depois da entrega pelo cliente ou por terceiros.",
    },
    parts: {
      title: "Garantia da peça",
      text: "É sempre do fabricante ou do vendedor da peça, inclusive quando a compra foi indicada por nós. Fornecemos o laudo dos testes para facilitar o acionamento.",
    },
    exclusions: [
      "Overclock, undervolt ou alteração de voltagem feita por terceiros",
      "Danos por queda, líquido, surto elétrico ou rede elétrica inadequada",
      "Uso em ambiente com poeira excessiva, sem ventilação ou fora das condições do fabricante",
      "Abertura do gabinete, troca de peças ou reaplicação de pasta térmica por terceiros",
      "Falha do próprio componente (tratada pela garantia da peça)",
      "Desempenho em jogos, softwares ou resoluções específicas",
    ],
  },

  /** Checklist final executado antes da entrega. */
  finalChecklist: [
    {
      group: "BIOS / UEFI",
      items: [
        "Verificação da versão de BIOS/UEFI instalada e registro no laudo",
        "Atualização de BIOS somente com autorização por escrito do cliente e com fonte oficial do fabricante da placa-mãe",
        "Configuração de data, hora, ordem de boot e modo do controlador de armazenamento",
        "Aplicação apenas de perfis oficiais de memória previstos pelo fabricante, sem ajuste manual de voltagem",
      ],
    },
    {
      group: "Sistema e drivers",
      items: [
        "Instalação do sistema com licença válida apresentada pelo cliente",
        "Drivers de chipset, vídeo, rede e áudio baixados dos sites oficiais dos fabricantes",
        "Atualizações do sistema aplicadas e reinício de validação",
      ],
    },
    {
      group: "Testes finais",
      items: [
        "Teste de memória: varredura completa sem erros registrados",
        "Teste de armazenamento: leitura do estado de saúde (S.M.A.R.T.) de cada unidade",
        "Teste de temperatura: leitura de processador e placa de vídeo em repouso e sob carga, comparada aos limites do fabricante",
        "Teste de estabilidade: carga contínua de processador e placa de vídeo sem desligamento, travamento ou reinício",
        "Conferência final de portas, vídeo, rede, áudio e ligar/desligar",
        "Laudo dos testes entregue junto com o equipamento",
      ],
    },
  ],
} as const;

export type PcAssemblyPolicy = typeof PC_ASSEMBLY_POLICY;
