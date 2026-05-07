// Viral posts replicating the SJP model for Curitiba and other RMC cities.
// Each post is original, long-form, hyper-local and tied to services + cities.

import type { BlogPost } from "./blog";

const allCities = ["curitiba", "sao-jose-dos-pinhais", "pinhais", "colombo", "araucaria"];

function p(input: Omit<BlogPost, "updatedAt" | "relatedCities"> & { updatedAt?: string }): BlogPost {
  return {
    ...input,
    updatedAt: input.updatedAt ?? input.publishedAt,
    relatedCities: allCities,
  };
}

export const viralCwbPosts: BlogPost[] = [
  p({
    slug: "tecnico-de-informatica-curitiba-guia-definitivo",
    title: "Técnico de Informática em Curitiba: o guia definitivo (2026)",
    metaTitle: "Técnico de Informática em Curitiba 24h | Preços Reais 2026",
    metaDescription:
      "Tudo sobre contratar técnico de informática em Curitiba: preços reais, prazos por bairro, golpes para evitar e como escolher quem entende. Visita a partir de R$ 99,99.",
    excerpt:
      "Preços reais, tempo de atendimento por bairro, golpes mais comuns em Curitiba e o que diferencia um técnico profissional de um amador.",
    category: "informatica",
    tags: ["técnico curitiba", "assistência técnica curitiba", "manutenção pc curitiba"],
    publishedAt: "2026-05-05",
    readingTime: 12,
    sections: [
      { paragraphs: [
        "Curitiba tem 75 bairros e mais de 1,9 milhão de habitantes. Encontrar um técnico de informática sério no meio de tantos anúncios é tarefa árdua. Esse guia mostra preços reais praticados em 2026, tempos médios de atendimento por região e os erros mais comuns que custam caro.",
      ]},
      { heading: "Preços reais em Curitiba (2026)", paragraphs: [
        "Valores praticados por assistências sérias com nota fiscal e garantia:",
      ], list: [
        "Visita técnica + diagnóstico no local: R$ 99,99 (deduzido se aprovar)",
        "Formatação Windows 11 com backup: R$ 180 a R$ 280",
        "Remoção de vírus / ransomware: R$ 200 a R$ 350",
        "Upgrade SSD 480GB com clonagem: R$ 380 a R$ 520",
        "Troca de tela de notebook 15.6\": R$ 450 a R$ 850",
        "Limpeza interna + pasta térmica: R$ 150 a R$ 220",
        "Recuperação de arquivos: a partir de R$ 350",
      ]},
      { heading: "Tempo de atendimento por região", paragraphs: [
        "Tempo médio real (não promessa de marketing) em horário comercial:",
      ], list: [
        "Centro, Batel, Água Verde, Bigorrilho, Juvevê, Cabral, Mercês: 30-60 min",
        "Boqueirão, Pinheirinho, Sítio Cercado, Capão Raso, Fazendinha: 45-75 min",
        "CIC, Tatuquara, Caximba, Umbará: 60-90 min",
        "Santa Felicidade, Cascatinha, Butiatuvinha: 60-90 min",
        "Boa Vista, Bacacheri, Cajuru, Uberaba: 45-75 min",
      ]},
      { heading: "7 golpes comuns em Curitiba", paragraphs: [
        "Conheça para nunca cair:",
      ], list: [
        "1. Diagnóstico 'grátis' que vira fatura de R$ 800",
        "2. Troca de RAM/SSD bom por usado",
        "3. SSD recondicionado vendido como novo",
        "4. 'Resetou tudo' sem fazer backup e desaparece",
        "5. Cobra licenças piratas como originais",
        "6. Assinatura mensal escondida no antivírus",
        "7. Pen drive infectado plantado para criar 'novo serviço'",
      ]},
      { heading: "Como escolher um técnico de verdade", paragraphs: [
        "Cinco sinais não negociáveis: nota fiscal eletrônica, garantia escrita por 90 dias mínimo, peças com nota separada, atendimento por canal oficial (não DM no Instagram), e endereço fixo verificável.",
      ]},
    ],
    faqs: [
      { question: "Atendem qual região de Curitiba?", answer: "Todos os 75 bairros, com técnicos em até 30 minutos no centro expandido (Batel, Água Verde, Bigorrilho, Centro Cívico)." },
      { question: "Trabalham aos finais de semana?", answer: "Sim, atendimento 24h via WhatsApp e visitas técnicas das 8h às 22h todos os dias." },
    ],
    relatedServices: ["informatica", "notebooks"],
    internalLinks: [
      { label: "Atendimento em Curitiba", to: "/regioes/curitiba" },
      { label: "Tabela completa de preços", to: "/precos" },
      { label: "Serviços de informática", to: "/servicos/informatica" },
    ],
  }),

  p({
    slug: "wifi-fraco-curitiba-como-resolver",
    title: "Wi-Fi fraco em Curitiba: causas e soluções (apartamentos e casas)",
    metaTitle: "Wi-Fi Fraco em Curitiba: Como Resolver Apartamentos e Casas",
    metaDescription:
      "Sinal Wi-Fi caindo em Curitiba? Causas reais em prédios e casas, sistema mesh, troca de canal e cabeamento estruturado. Atendimento 24h.",
    excerpt:
      "Por que apartamentos no Batel, Água Verde e Centro têm Wi-Fi pior — e como resolver com menos de R$ 600.",
    category: "redes-wifi",
    tags: ["wifi curitiba", "rede mesh curitiba", "sinal fraco"],
    publishedAt: "2026-05-05",
    readingTime: 8,
    sections: [
      { paragraphs: [
        "Em prédios verticalizados de Curitiba (Batel, Água Verde, Bigorrilho, Cabral) é comum ter 40+ redes Wi-Fi competindo. Resultado: queda, lentidão e zona morta. Tem solução simples e tem solução profissional — ambas funcionam.",
      ]},
      { heading: "Apartamento: o que fazer primeiro", paragraphs: [
        "Trocar canal Wi-Fi manualmente (1, 6 ou 11 em 2.4GHz; 36-48 em 5GHz), priorizar 5GHz para dispositivos próximos, atualizar firmware do roteador.",
      ]},
      { heading: "Casa grande ou sobrado: mesh é obrigatório", paragraphs: [
        "Sistemas mesh (TP-Link Deco, Mercusys, Tenda Nova) cobrem 200-400m² com cobertura uniforme. Repetidor não resolve — corta velocidade pela metade.",
      ]},
      { heading: "Quando vale cabeamento", paragraphs: [
        "Em reforma ou construção, passar cabos CAT6 para sala, escritório e quarto principal custa pouco e resolve para sempre. Backhaul cabeado entre nós mesh é o padrão profissional.",
      ]},
    ],
    faqs: [
      { question: "Quanto custa instalar mesh em Curitiba?", answer: "Mão de obra: R$ 180 a R$ 350. Equipamento: R$ 600 a R$ 1.800 dependendo do tamanho da casa." },
    ],
    relatedServices: ["redes"],
    internalLinks: [
      { label: "Configuração de redes", to: "/servicos/redes" },
      { label: "Atendimento em Curitiba", to: "/regioes/curitiba" },
    ],
  }),

  p({
    slug: "tecnico-informatica-pinhais-colombo-araucaria",
    title: "Técnico de informática em Pinhais, Colombo e Araucária (preços e atendimento)",
    metaTitle: "Técnico em Pinhais, Colombo e Araucária | Informática RMC 2026",
    metaDescription:
      "Atendimento de informática em Pinhais, Colombo e Araucária com técnicos especializados. Preços, tempos e serviços disponíveis. A partir de R$ 99,99.",
    excerpt:
      "Como funciona o atendimento de informática nas cidades vizinhas a Curitiba — preços, tempos e bairros atendidos.",
    category: "informatica",
    tags: ["técnico pinhais", "técnico colombo", "técnico araucária"],
    publishedAt: "2026-05-06",
    readingTime: 9,
    sections: [
      { paragraphs: [
        "A Região Metropolitana de Curitiba concentra mais de 3,2 milhões de pessoas, mas o número de técnicos qualificados fora da capital é limitado. Atendemos Pinhais, Colombo e Araucária com a mesma estrutura de Curitiba: nota fiscal, garantia e técnicos certificados.",
      ]},
      { heading: "Pinhais", paragraphs: [
        "Bairros como Centro, Weissópolis, Maria Antonieta, Estância Pinhais e Alphaville Graciosa têm atendimento em até 60 minutos. Foco em manutenção residencial e pequenas empresas.",
      ]},
      { heading: "Colombo", paragraphs: [
        "Centro, Maracanã, Guaraituba, São Gabriel, São Dimas — atendimento em 60-90 minutos. Forte demanda por configuração de Wi-Fi e instalação de CFTV residencial.",
      ]},
      { heading: "Araucária", paragraphs: [
        "Centro, Iguaçu, Industrial, Sabiá, Tindiquera — atendimento residencial e industrial. Polo industrial demanda manutenção empresarial e cabeamento estruturado.",
      ]},
    ],
    faqs: [
      { question: "Cobram taxa extra fora de Curitiba?", answer: "Não. A visita técnica em Pinhais, Colombo e Araucária mantém o mesmo valor de R$ 99,99 da capital." },
    ],
    relatedServices: ["informatica", "redes", "cftv"],
    internalLinks: [
      { label: "Atendimento em Pinhais", to: "/regioes/pinhais" },
      { label: "Atendimento em Colombo", to: "/regioes/colombo" },
      { label: "Atendimento em Araucária", to: "/regioes/araucaria" },
    ],
  }),

  p({
    slug: "remocao-de-virus-curitiba-protocolo-profissional",
    title: "Remoção de vírus em Curitiba: protocolo profissional sem formatar",
    metaTitle: "Remoção de Vírus em Curitiba | Técnico 24h Sem Formatar",
    metaDescription:
      "Remoção profissional de vírus, ransomware e malware em Curitiba sem perder arquivos. Técnico 24h, R$ 200 a R$ 350 com garantia.",
    excerpt:
      "O passo a passo que técnicos sérios em Curitiba aplicam para remover vírus mantendo seus arquivos intactos.",
    category: "informatica",
    tags: ["remoção de vírus curitiba", "malware", "técnico"],
    publishedAt: "2026-05-06",
    readingTime: 9,
    sections: [
      { paragraphs: [
        "70% dos PCs com vírus em Curitiba não precisam de formatação. O protocolo abaixo é o mesmo que aplicamos em chamados no Centro, Batel, Água Verde e Boqueirão.",
      ]},
      { heading: "Identificação correta", paragraphs: [
        "Pop-ups, navegador estranho, antivírus desligado sozinho e HD em 100% são sinais clássicos. PC velho fica lento gradualmente; vírus muda comportamento de uma hora pra outra.",
      ]},
      { heading: "Combo de scanners", paragraphs: [
        "Microsoft Defender Offline + Malwarebytes + AdwCleaner + ESET Online em sequência cobre 95% das ameaças.",
      ]},
      { heading: "Limpeza de persistência", paragraphs: [
        "Inicializa de tarefas agendadas, registros do Windows, extensões de navegador e LSPs (Layered Service Providers) que malwares usam para sobreviver.",
      ]},
      { heading: "Quando formatar é mais seguro", paragraphs: [
        "Ransomware confirmado, rootkit detectado ou sistema instável após limpeza — formatar com backup é o caminho.",
      ]},
    ],
    faqs: [
      { question: "Garantia da limpeza?", answer: "30 dias de garantia escrita. Se voltar o mesmo malware, refazemos sem custo." },
    ],
    relatedServices: ["informatica"],
    internalLinks: [
      { label: "Atendimento em Curitiba", to: "/regioes/curitiba" },
      { label: "Tabela de preços", to: "/precos" },
    ],
  }),

  p({
    slug: "cftv-curitiba-instalar-cameras-protocolo-completo",
    title: "Instalar câmeras CFTV em Curitiba: protocolo completo para residências e comércios",
    metaTitle: "Instalação de CFTV em Curitiba | Câmeras 4MP, IP e Analógicas",
    metaDescription:
      "Instalação profissional de câmeras CFTV em Curitiba para residências e comércios. Kits 4-16 câmeras, acesso remoto, instalação e manutenção.",
    excerpt:
      "Como dimensionar o sistema de CFTV certo para sua casa ou comércio em Curitiba — sem desperdício e com cobertura real.",
    category: "cftv-seguranca",
    tags: ["cftv curitiba", "câmeras de segurança", "instalação cftv"],
    publishedAt: "2026-05-07",
    readingTime: 10,
    sections: [
      { paragraphs: [
        "Curitiba tem demanda crescente por CFTV depois de aumento de furtos em 2024-2025. Mas instalar errado é jogar dinheiro fora — câmera demais sem cobrir o ponto certo, qualidade ruim, sem acesso remoto.",
      ]},
      { heading: "Pontos essenciais a cobrir", paragraphs: [
        "Portão principal, garagem, fundo do quintal, área de serviço. Em comércio: caixa, entrada, estoque, área externa.",
      ]},
      { heading: "IP vs analógica", paragraphs: [
        "IP (4MP, 5MP, 8MP) tem qualidade superior, gravação em nuvem opcional, recursos inteligentes (detecção de pessoa, line crossing). Analógica Full HD ainda é viável para residências básicas com bom custo-benefício.",
      ]},
      { heading: "Acesso remoto pelo celular", paragraphs: [
        "Configuração de Hik-Connect, gDMSS, Intelbras Cloud, EZVIZ. Sempre trocando senha padrão e ativando autenticação em dois fatores.",
      ]},
      { heading: "Faixas de preço em Curitiba (2026)", paragraphs: [
        "Valores médios incluindo equipamento e instalação:",
      ], list: [
        "Kit 4 câmeras Full HD residencial: R$ 1.500 a R$ 2.200",
        "Kit 8 câmeras Full HD: R$ 2.700 a R$ 4.000",
        "Kit 8 câmeras IP 4MP comercial: R$ 4.800 a R$ 7.500",
        "Câmera adicional: R$ 250 a R$ 450 por ponto",
      ]},
    ],
    faqs: [
      { question: "Atendem em qual região de Curitiba?", answer: "Todos os 75 bairros, com instalação em até 48h após aprovação do orçamento." },
    ],
    relatedServices: ["cftv"],
    internalLinks: [
      { label: "Serviço de CFTV", to: "/servicos/cftv" },
      { label: "Atendimento em Curitiba", to: "/regioes/curitiba" },
    ],
  }),
];
