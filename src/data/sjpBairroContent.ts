// Original content + FAQ + characteristics for each São José dos Pinhais neighborhood.
// Used by BairroDetalhe to render unique copy per bairro and reduce duplicate content.

export interface BairroContent {
  intro: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
}

const generic = (name: string): BairroContent => ({
  intro: `Atendimento técnico no bairro ${name}, em São José dos Pinhais, com visita em até 90 minutos para problemas comuns: PC lento, vírus, Wi-Fi caindo, formatação, instalação de câmeras e manutenção elétrica leve. Cobramos R$ 99,99 pela visita técnica com diagnóstico, valor abatido se aprovar o serviço.`,
  highlights: [
    `Técnico em ${name} em até 90 minutos em horário comercial`,
    "Pagamento somente após aprovação do orçamento",
    "Nota fiscal eletrônica e garantia escrita de 90 dias",
    "Peças com nota separada e garantia de fábrica",
    "Atendimento 24h via WhatsApp para emergências",
  ],
  faqs: [
    {
      question: `Quanto custa um técnico no ${name}?`,
      answer: "Visita técnica com diagnóstico no local: R$ 99,99. Esse valor é abatido se você aprovar o serviço. Formatação completa fica entre R$ 180 e R$ 280; remoção de vírus entre R$ 200 e R$ 350; upgrade de SSD a partir de R$ 380. Tudo com nota fiscal e garantia.",
    },
    {
      question: `Em quanto tempo o técnico chega no ${name}?`,
      answer: `O tempo médio para chegar no ${name} em horário comercial é de 60 a 90 minutos. Em emergências (ransomware, perda total) priorizamos atendimento em até 60 minutos quando há disponibilidade.`,
    },
    {
      question: "Quais serviços vocês atendem?",
      answer: "Informática (formatação, vírus, upgrade, manutenção), notebooks (tela, teclado, bateria), redes Wi-Fi e cabeamento, CFTV (câmeras, DVR), elétrica residencial, ar-condicionado e celulares.",
    },
    {
      question: "Vocês emitem nota fiscal e dão garantia?",
      answer: "Sim. Toda visita ou serviço é acompanhado de nota fiscal eletrônica. Garantia de 90 dias na mão de obra e garantia de fábrica nas peças (1 a 5 anos conforme o item).",
    },
    {
      question: "Atendem fora do horário comercial?",
      answer: "Sim. Plantão 24h via WhatsApp para suporte remoto e emergências. Visitas presenciais entre 8h e 22h, todos os dias.",
    },
  ],
});

const customByBairro: Record<string, Partial<BairroContent>> = {
  "centro": {
    intro:
      "O Centro de São José dos Pinhais é nosso bairro com maior volume de chamados — comércio, escritórios e residências. Conseguimos chegar em 30-45 minutos em horário comercial. Atendemos formatação, remoção de vírus, configuração de impressora em rede, Wi-Fi corporativo, CFTV e manutenção empresarial mensal.",
    highlights: [
      "Resposta em 30-45 minutos no Centro de SJP em horário comercial",
      "Atendimento empresarial com contrato mensal a partir de R$ 800",
      "Visitas para residências sem custo adicional de deslocamento",
      "Plantão noturno e finais de semana via WhatsApp",
    ],
  },
  "afonso-pena": {
    intro:
      "O bairro Afonso Pena, próximo ao aeroporto, concentra residências de classe média e empresas de logística e turismo. Atendemos Wi-Fi de alta densidade (com muitas redes vizinhas), instalação de CFTV residencial, formatação e upgrades para PCs e notebooks. Tempo médio de chegada: 45-60 minutos.",
  },
  "cidade-jardim": {
    intro:
      "Cidade Jardim é um dos bairros que mais cresce em SJP, com condomínios verticais e demanda forte por sistemas mesh, CFTV residencial, smart-home e atendimento de informática para home office. Tempo médio: 30-45 minutos.",
  },
  "boneca-do-iguacu": {
    intro:
      "Boneca do Iguaçu reúne perfil residencial e pequeno comércio. Atendemos manutenção de PCs domésticos, configuração de impressoras, Wi-Fi residencial e CFTV. Tempo médio de atendimento: 60 minutos.",
  },
  "sao-cristovao": {
    intro:
      "São Cristóvão tem grande concentração residencial. Atendemos formatação, remoção de vírus, Wi-Fi e troca de tela de notebook. Tempo médio: 60-75 minutos.",
  },
  "borda-do-campo": {
    intro:
      "Borda do Campo é um dos bairros mais extensos de SJP. Atendemos com técnicos próprios, sem terceirizar. Especialidade na região: redes mesh para residências grandes, CFTV residencial e manutenção preventiva. Tempo médio: 75-90 minutos.",
  },
  "guatupe": {
    intro:
      "Guatupê concentra residências e algumas pequenas empresas. Forte demanda por configuração de internet residencial, Wi-Fi e CFTV. Tempo médio: 75-90 minutos.",
  },
  "cruzeiro": {
    intro:
      "Cruzeiro tem perfil residencial misto. Atendemos do reparo emergencial à manutenção mensal de pequenos comércios. Tempo médio: 60-90 minutos.",
  },
  "ina": {
    intro:
      "Iná é bairro residencial em crescimento. Atendemos com prioridade para Wi-Fi, formatação e CFTV residencial. Tempo médio: 60-90 minutos.",
  },
  "rio-pequeno": {
    intro:
      "Rio Pequeno tem demanda crescente por internet bem configurada e CFTV residencial. Atendemos com técnico próprio e preço fixo da visita: R$ 99,99. Tempo médio: 60-90 minutos.",
  },
  "aviacao": {
    intro:
      "Aviação concentra moradia próxima ao aeroporto. Atendemos com agilidade — Wi-Fi, formatação, manutenção de notebook, CFTV. Tempo médio: 45-60 minutos.",
  },
};

export function getBairroContent(citySlug: string, bairroSlug: string, bairroName: string): BairroContent {
  const base = generic(bairroName);
  if (citySlug !== "sao-jose-dos-pinhais") return base;
  const custom = customByBairro[bairroSlug];
  if (!custom) return base;
  return {
    intro: custom.intro ?? base.intro,
    highlights: custom.highlights ?? base.highlights,
    faqs: custom.faqs ?? base.faqs,
  };
}
