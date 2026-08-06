/**
 * Fonte única do fluxo de atendimento de montagem/configuração de desktops
 * e PC Gamer (confirmação operacional do proprietário — 2026-08-06).
 *
 * Regras fail-closed (iguais às de pcAssemblyPolicy.ts):
 * - Nenhum prazo aqui é promessa fechada: todo prazo é estimado e confirmado
 *   por escrito no orçamento do atendimento.
 * - Nada de FPS, ganho de desempenho, overclock ou preço fechado.
 */

export const PC_ASSEMBLY_PROCESS = {
  disclaimer:
    "Os prazos abaixo são estimativas de bancada e dependem da disponibilidade das peças, da fila de atendimento e da aprovação do orçamento. O prazo válido é sempre o registrado por escrito no orçamento do seu atendimento.",

  steps: [
    {
      id: "briefing",
      title: "1. Briefing e conferência da configuração",
      estimate: "No mesmo dia útil do contato",
      description:
        "Você envia o modelo pretendido ou a lista de peças pelo WhatsApp (ou pelo orçamento em 3 passos do site). Conferimos soquete, chipset, padrão de memória, conectores de energia, espaço do gabinete e capacidade da fonte antes de qualquer serviço.",
      output: "Retorno por escrito com pontos de incompatibilidade, se houver.",
    },
    {
      id: "orcamento",
      title: "2. Orçamento por escrito e aprovação",
      estimate: "Após a conferência da lista de peças",
      description:
        "Enviamos o orçamento com escopo, valor de mão de obra e o que fica de fora. Peças, componentes e materiais aparecem separados. Nada é executado sem sua aprovação registrada.",
      output: "Orçamento aprovado por escrito e ordem de serviço aberta.",
    },
    {
      id: "recebimento",
      title: "3. Recebimento das peças e do equipamento",
      estimate: "No dia combinado da entrega em bancada ou da coleta",
      description:
        "Toda peça é registrada em termo de recebimento com marca, modelo, número de série e fotos do estado aparente, assinado na entrada e na retirada. Peças sem comprovante de compra em nome do cliente não são montadas.",
      output: "Termo de recebimento assinado com registro fotográfico.",
    },
    {
      id: "montagem",
      title: "4. Montagem física e organização interna",
      estimate: "Etapa de bancada, iniciada após o recebimento",
      description:
        "Montagem completa do gabinete, instalação de air cooler ou water cooler selado (AIO), aplicação de pasta térmica, roteamento de cabos e ajuste do fluxo de ar.",
      output: "Máquina montada e conferida fisicamente.",
    },
    {
      id: "configuracao",
      title: "5. BIOS/UEFI, sistema e drivers oficiais",
      estimate: "Etapa de bancada, na sequência da montagem",
      description:
        "Configuração de BIOS/UEFI apenas dentro dos perfis oficiais do fabricante, instalação do sistema com licença válida apresentada por você e drivers baixados dos sites oficiais dos fabricantes.",
      output: "Sistema instalado e configuração registrada no laudo.",
    },
    {
      id: "testes",
      title: "6. Checklist final de testes",
      estimate: "Antes de liberar a entrega",
      description:
        "Executamos o mesmo checklist em todo atendimento: memória, saúde do armazenamento, temperatura em repouso e sob carga, estabilidade contínua e conferência de portas, vídeo, rede e áudio.",
      output: "Laudo dos testes executados, entregue com o equipamento.",
    },
    {
      id: "entrega",
      title: "7. Entrega, laudo e garantia delimitada",
      estimate: "Na retirada ou na entrega combinada",
      description:
        "Na entrega você recebe o laudo dos testes e o comprovante com o prazo de garantia da mão de obra e da configuração. A garantia da peça permanece com o fabricante ou vendedor.",
      output: "Comprovante de entrega com escopo e garantia registrados.",
    },
  ],

  faq: [
    {
      question: "Quanto tempo demora a montagem de um PC gamer?",
      answer:
        "O tempo de bancada depende da configuração e da fila de atendimento. Cada etapa tem uma estimativa própria e o prazo válido é o registrado por escrito no orçamento aprovado — não trabalhamos com prazo fechado antes de conferir as peças.",
    },
    {
      question: "Posso levar as peças que já comprei?",
      answer:
        "Sim. Conferimos a compatibilidade antes de montar e registramos cada peça em termo de recebimento com fotos. Peças sem comprovante de compra em nome do cliente não são montadas.",
    },
    {
      question: "Vocês fazem overclock ou garantem FPS?",
      answer:
        "Não. Aplicamos apenas perfis oficiais previstos pelo fabricante e não prometemos FPS, pontuação em benchmark ou desempenho em jogos específicos.",
    },
    {
      question: "O que acontece se uma peça chegar com defeito?",
      answer:
        "Devolvemos o item com o laudo dos testes executados para você acionar a garantia junto ao vendedor ou fabricante. Enquanto a troca ocorre, o equipamento aguarda em bancada por até 5 dias úteis.",
    },
    {
      question: "Como começo o atendimento?",
      answer:
        "Pelo orçamento em 3 passos do site: você informa modelo, uso pretendido, origem das peças e cidade/bairro, aceita os termos e a mensagem sai pronta para o WhatsApp com a ordem de serviço numerada.",
    },
  ],
} as const;

export type PcAssemblyProcess = typeof PC_ASSEMBLY_PROCESS;
