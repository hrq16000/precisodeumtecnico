// Conteúdo único por bairro (intro + highlights + FAQ) para Curitiba, SJP e
// principais bairros das cidades da Região Metropolitana. Usado por
// BairroDetalhe.tsx para gerar páginas locais com texto original e schema FAQPage.

export interface BairroContent {
  intro: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
}

const cityNameBySlug: Record<string, string> = {
  "curitiba": "Curitiba",
  "sao-jose-dos-pinhais": "São José dos Pinhais",
  "pinhais": "Pinhais",
  "colombo": "Colombo",
  "araucaria": "Araucária",
};

const generic = (name: string, cityName: string): BairroContent => ({
  intro: `Atendimento técnico no bairro ${name}, em ${cityName}, com visita em até 90 minutos para problemas comuns: PC lento, vírus, Wi-Fi caindo, formatação, instalação de câmeras e manutenção elétrica leve. Cobramos R$ 99,99 pela visita técnica com diagnóstico, valor abatido se aprovar o serviço.`,
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
      answer: `O tempo médio para chegar no ${name} em horário comercial é de 60 a 90 minutos. Em emergências (ransomware, perda total de acesso) priorizamos atendimento em até 60 minutos quando há disponibilidade.`,
    },
    {
      question: `Quais serviços vocês atendem em ${name}?`,
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

// ===== São José dos Pinhais =====
const sjpCustom: Record<string, Partial<BairroContent>> = {
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
  "afonso-pena": { intro: "O bairro Afonso Pena, próximo ao aeroporto, concentra residências de classe média e empresas de logística e turismo. Atendemos Wi-Fi de alta densidade (com muitas redes vizinhas), instalação de CFTV residencial, formatação e upgrades para PCs e notebooks. Tempo médio de chegada: 45-60 minutos." },
  "cidade-jardim": { intro: "Cidade Jardim é um dos bairros que mais cresce em SJP, com condomínios verticais e demanda forte por sistemas mesh, CFTV residencial, smart-home e atendimento de informática para home office. Tempo médio: 30-45 minutos." },
  "boneca-do-iguacu": { intro: "Boneca do Iguaçu reúne perfil residencial e pequeno comércio. Atendemos manutenção de PCs domésticos, configuração de impressoras, Wi-Fi residencial e CFTV. Tempo médio: 60 minutos." },
  "sao-cristovao": { intro: "São Cristóvão tem grande concentração residencial. Atendemos formatação, remoção de vírus, Wi-Fi e troca de tela de notebook. Tempo médio: 60-75 minutos." },
  "borda-do-campo": { intro: "Borda do Campo é um dos bairros mais extensos de SJP. Atendemos com técnicos próprios, sem terceirizar. Especialidade na região: redes mesh para residências grandes, CFTV residencial e manutenção preventiva. Tempo médio: 75-90 minutos." },
  "guatupe": { intro: "Guatupê concentra residências e algumas pequenas empresas. Forte demanda por configuração de internet residencial, Wi-Fi e CFTV. Tempo médio: 75-90 minutos." },
  "cruzeiro": { intro: "Cruzeiro tem perfil residencial misto. Atendemos do reparo emergencial à manutenção mensal de pequenos comércios. Tempo médio: 60-90 minutos." },
  "ina": { intro: "Iná é bairro residencial em crescimento. Atendemos com prioridade para Wi-Fi, formatação e CFTV residencial. Tempo médio: 60-90 minutos." },
  "rio-pequeno": { intro: "Rio Pequeno tem demanda crescente por internet bem configurada e CFTV residencial. Atendemos com técnico próprio e preço fixo da visita: R$ 99,99. Tempo médio: 60-90 minutos." },
};

// ===== Curitiba — bairros principais =====
const curitibaCustom: Record<string, Partial<BairroContent>> = {
  "centro": {
    intro: "O Centro de Curitiba concentra escritórios, lojas e prédios residenciais antigos. Atendemos formatação corporativa, redes Wi-Fi para escritório, impressoras em rede, CFTV comercial e suporte mensal para PMEs. Tempo médio em horário comercial: 30-45 minutos.",
    highlights: [
      "Resposta em 30-45 minutos no Centro de Curitiba",
      "Contratos mensais para escritórios a partir de R$ 800",
      "Atendimento residencial em prédios antigos (rede e elétrica)",
      "Plantão 24h via WhatsApp",
    ],
  },
  "batel": { intro: "Batel é referência em escritórios premium, clínicas e residencial alto padrão. Atendemos com discrição: configuração de redes mesh Wi-Fi 6, CFTV IP integrado a celular, automação residencial e suporte de TI para empresas. Tempo médio: 30-45 minutos." },
  "agua-verde": { intro: "Água Verde é o bairro mais populoso de Curitiba, com forte mix residencial e comercial. Atendemos formatação, vírus, Wi-Fi residencial em apartamentos, CFTV e manutenção elétrica. Tempo médio: 45-60 minutos." },
  "bigorrilho": { intro: "Bigorrilho concentra prédios novos, home offices e clínicas. Demanda forte por mesh Wi-Fi, suporte para Mac/Windows, backup em nuvem e CFTV residencial. Tempo médio: 30-45 minutos." },
  "cabral": { intro: "Cabral tem perfil residencial alto-médio com muitas casas. Atendemos cabeamento estruturado, mesh, CFTV externo e manutenção elétrica. Tempo médio: 45-60 minutos." },
  "centro-civico": { intro: "Centro Cívico abriga órgãos públicos, escritórios de advocacia e residências. Atendemos suporte corporativo, formatação rápida, redes e impressoras em rede. Tempo médio: 30-45 minutos." },
  "cristo-rei": { intro: "Cristo Rei é residencial com presença universitária forte. Atendemos formatação, vírus em notebooks, Wi-Fi para repúblicas e suporte para estudantes. Tempo médio: 45-60 minutos." },
  "juveve": { intro: "Juvevê tem perfil residencial tranquilo, próximo ao Cabral. Atendemos manutenção doméstica de PCs, Wi-Fi, CFTV residencial. Tempo médio: 45-60 minutos." },
  "merces": { intro: "Mercês é residencial alto padrão com casas grandes. Demanda por mesh Wi-Fi (cobertura de 200m²+), CFTV residencial completo e automação. Tempo médio: 45-60 minutos." },
  "portao": { intro: "Portão é um dos bairros mais densos de Curitiba, com muito comércio. Atendemos formatação rápida, suporte a comércios, Wi-Fi para lojas e CFTV. Tempo médio: 45-60 minutos." },
  "santa-felicidade": { intro: "Santa Felicidade tem casas grandes, vinícolas e restaurantes tradicionais. Atendemos cabeamento estruturado, redes para restaurantes, CFTV externo e manutenção residencial. Tempo médio: 60-75 minutos." },
  "boa-vista": { intro: "Boa Vista tem perfil residencial e comercial misto. Atendemos formatação, vírus, redes residenciais e suporte para pequenas empresas. Tempo médio: 45-60 minutos." },
  "cajuru": { intro: "Cajuru é grande, populoso e residencial. Atendemos manutenção de PCs, Wi-Fi residencial, CFTV e troca de tela de notebook. Tempo médio: 60-75 minutos." },
  "boqueirao": { intro: "Boqueirão é um dos bairros mais populosos. Atendemos formatação, remoção de vírus, Wi-Fi e CFTV residencial. Tempo médio: 60-75 minutos." },
  "sitio-cercado": { intro: "Sítio Cercado tem alto volume residencial. Atendemos com técnicos próprios — formatação, vírus, Wi-Fi e CFTV. Tempo médio: 60-75 minutos." },
  "pinheirinho": { intro: "Pinheirinho concentra residências e comércio de bairro. Atendemos manutenção de PCs, Wi-Fi e CFTV residencial. Tempo médio: 60-75 minutos." },
  "cidade-industrial": { intro: "Cidade Industrial (CIC) é o maior bairro da cidade. Atendemos suporte a indústrias, redes corporativas, CFTV de pátio externo, cabeamento estruturado e formatação. Tempo médio: 60-90 minutos." },
  "uberaba": { intro: "Uberaba é residencial e comercial. Atendemos formatação, Wi-Fi, CFTV e suporte a pequenas empresas. Tempo médio: 60-75 minutos." },
  "xaxim": { intro: "Xaxim é residencial com forte demanda por internet bem configurada e CFTV. Tempo médio: 60-75 minutos." },
  "capao-raso": { intro: "Capão Raso tem perfil residencial-comercial. Atendemos formatação, vírus, Wi-Fi e instalação de câmeras. Tempo médio: 60-75 minutos." },
  "fazendinha": { intro: "Fazendinha mistura residências e comércio. Atendemos manutenção doméstica e Wi-Fi residencial. Tempo médio: 60-75 minutos." },
  "novo-mundo": { intro: "Novo Mundo é residencial e bem populoso. Atendemos formatação, vírus e CFTV residencial. Tempo médio: 60-75 minutos." },
  "hauer": { intro: "Hauer tem perfil residencial. Atendemos manutenção de PCs, Wi-Fi e CFTV. Tempo médio: 60-75 minutos." },
  "rebouças": { intro: "Rebouças concentra escritórios, faculdades e residências. Atendemos suporte corporativo e formatação rápida. Tempo médio: 30-45 minutos." },
  "alto-da-rua-xv": { intro: "Alto da Rua XV é residencial alto padrão, próximo ao Centro. Atendemos com discrição — mesh Wi-Fi, CFTV residencial e suporte premium. Tempo médio: 30-45 minutos." },
  "jardim-botanico": { intro: "Jardim Botânico tem perfil residencial e turístico. Atendemos formatação, Wi-Fi e CFTV residencial. Tempo médio: 45-60 minutos." },
  "jardim-das-americas": { intro: "Jardim das Américas tem perfil universitário (UFPR) e residencial. Atendemos formatação, vírus, Wi-Fi para repúblicas e CFTV. Tempo médio: 45-60 minutos." },
  "bacacheri": { intro: "Bacacheri é amplo e residencial, com muitas casas. Atendemos cabeamento estruturado, mesh Wi-Fi e CFTV externo. Tempo médio: 45-60 minutos." },
  "tingui": { intro: "Tingui é residencial. Atendemos manutenção doméstica de PCs, Wi-Fi e CFTV. Tempo médio: 60-75 minutos." },
  "barreirinha": { intro: "Barreirinha tem perfil residencial. Atendemos formatação, vírus, Wi-Fi residencial e CFTV. Tempo médio: 60-75 minutos." },
  "santa-candida": { intro: "Santa Cândida é residencial. Atendemos manutenção de PCs, Wi-Fi e CFTV residencial. Tempo médio: 60-75 minutos." },
  "tarumã": { intro: "Tarumã é residencial alto padrão. Atendemos mesh Wi-Fi, CFTV residencial completo e automação. Tempo médio: 45-60 minutos." },
  "campo-comprido": { intro: "Campo Comprido tem perfil residencial e comercial. Atendemos formatação, Wi-Fi e CFTV. Tempo médio: 60-75 minutos." },
  "mossungue": { intro: "Mossunguê (próximo ao ParkShopping Barigui) tem perfil residencial alto padrão. Atendemos mesh Wi-Fi, CFTV e suporte residencial premium. Tempo médio: 30-45 minutos." },
  "campina-do-siqueira": { intro: "Campina do Siqueira é residencial premium próximo ao Barigui. Atendemos mesh, CFTV e suporte residencial. Tempo médio: 30-45 minutos." },
  "ahu": { intro: "Ahú é residencial tranquilo. Atendemos manutenção doméstica, Wi-Fi e CFTV. Tempo médio: 45-60 minutos." },
  "vila-izabel": { intro: "Vila Izabel é residencial. Atendemos formatação, Wi-Fi e CFTV residencial. Tempo médio: 45-60 minutos." },
  "guabirotuba": { intro: "Guabirotuba mistura residencial e universitário (PUC). Atendemos formatação, vírus e Wi-Fi para repúblicas. Tempo médio: 45-60 minutos." },
  "prado-velho": { intro: "Prado Velho concentra universidades e moradia estudantil. Atendemos formatação, vírus, Wi-Fi para repúblicas e suporte para estudantes. Tempo médio: 45-60 minutos." },
};

// ===== Pinhais =====
const pinhaisCustom: Record<string, Partial<BairroContent>> = {
  "centro": { intro: "O Centro de Pinhais concentra comércio e residências. Atendemos formatação, Wi-Fi, CFTV e suporte para comércios. Tempo médio: 45-60 minutos." },
  "alphaville-graciosa": { intro: "Alphaville Graciosa é condomínio fechado de alto padrão. Atendemos com agendamento — mesh Wi-Fi premium (Wi-Fi 6/6E), CFTV residencial completo, automação e suporte residencial. Tempo médio: 45-60 minutos." },
  "weissopolis": { intro: "Weissópolis tem perfil residencial em crescimento. Atendemos formatação, Wi-Fi residencial e CFTV. Tempo médio: 60-75 minutos." },
  "maria-antonieta": { intro: "Maria Antonieta é residencial. Atendemos manutenção doméstica, Wi-Fi e CFTV. Tempo médio: 60-75 minutos." },
  "emiliano-perneta": { intro: "Emiliano Perneta tem perfil residencial e comercial. Atendemos formatação, Wi-Fi e CFTV. Tempo médio: 60-75 minutos." },
  "atuba": { intro: "Atuba (Pinhais) tem perfil residencial. Atendemos formatação, Wi-Fi e CFTV residencial. Tempo médio: 60-75 minutos." },
};

// ===== Colombo =====
const colomboCustom: Record<string, Partial<BairroContent>> = {
  "centro": { intro: "O Centro de Colombo é o coração comercial da cidade. Atendemos suporte a comércios, formatação rápida, Wi-Fi e CFTV. Tempo médio: 60-75 minutos." },
  "maracana": { intro: "Maracanã é populoso e residencial. Atendemos formatação, vírus, Wi-Fi residencial e CFTV. Tempo médio: 60-75 minutos." },
  "atuba": { intro: "Atuba (Colombo) é residencial. Atendemos manutenção de PCs, Wi-Fi e CFTV. Tempo médio: 60-75 minutos." },
  "guaraituba": { intro: "Guaraituba tem perfil residencial em crescimento. Atendemos formatação, Wi-Fi e CFTV. Tempo médio: 60-75 minutos." },
  "sao-gabriel": { intro: "São Gabriel é residencial. Atendemos manutenção de PCs, Wi-Fi e CFTV residencial. Tempo médio: 60-90 minutos." },
  "roca-grande": { intro: "Roça Grande tem perfil residencial. Atendemos formatação, Wi-Fi e CFTV. Tempo médio: 60-90 minutos." },
};

// ===== Araucária =====
const araucariaCustom: Record<string, Partial<BairroContent>> = {
  "centro": { intro: "O Centro de Araucária mistura comércio e residências. Atendemos suporte a comércios, formatação, Wi-Fi e CFTV. Tempo médio: 60-75 minutos." },
  "industrial": { intro: "O Distrito Industrial de Araucária concentra grandes indústrias. Atendemos suporte a TI corporativa, redes industriais, CFTV de pátio, cabeamento estruturado e contratos de manutenção. Tempo médio: 60-90 minutos." },
  "iguaçu": { intro: "Iguaçu é residencial e comercial. Atendemos formatação, Wi-Fi e CFTV. Tempo médio: 60-90 minutos." },
  "fazenda-velha": { intro: "Fazenda Velha tem perfil residencial. Atendemos manutenção doméstica, Wi-Fi e CFTV. Tempo médio: 60-90 minutos." },
  "thomaz-coelho": { intro: "Thomaz Coelho é residencial. Atendemos formatação, Wi-Fi e CFTV residencial. Tempo médio: 60-90 minutos." },
  "porto-das-laranjeiras": { intro: "Porto das Laranjeiras tem perfil residencial. Atendemos formatação, Wi-Fi e CFTV. Tempo médio: 60-90 minutos." },
};

const customByCity: Record<string, Record<string, Partial<BairroContent>>> = {
  "sao-jose-dos-pinhais": sjpCustom,
  "curitiba": curitibaCustom,
  "pinhais": pinhaisCustom,
  "colombo": colomboCustom,
  "araucaria": araucariaCustom,
};

export function getBairroContent(citySlug: string, bairroSlug: string, bairroName: string): BairroContent {
  const cityName = cityNameBySlug[citySlug] ?? "Curitiba e Região Metropolitana";
  const base = generic(bairroName, cityName);
  const custom = customByCity[citySlug]?.[bairroSlug];
  if (!custom) return base;
  return {
    intro: custom.intro ?? base.intro,
    highlights: custom.highlights ?? base.highlights,
    faqs: custom.faqs ?? base.faqs,
  };
}
