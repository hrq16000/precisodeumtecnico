// Auto-generated long-tail satellite blog posts: bairro × service.
// Keeps blog.ts focused on pillar/cluster posts; this file provides
// dozens of satellite pages for hub-and-spoke internal linking.

import type { BlogPost } from "./blog";

interface BairroEntry {
  bairro: string;
  city: string; // city slug used in routes
  cityLabel: string;
}

// Curated, high-search bairros from the metro region.
const bairros: BairroEntry[] = [
  { bairro: "Batel", city: "curitiba", cityLabel: "Curitiba" },
  { bairro: "Água Verde", city: "curitiba", cityLabel: "Curitiba" },
  { bairro: "Bigorrilho", city: "curitiba", cityLabel: "Curitiba" },
  { bairro: "Centro", city: "curitiba", cityLabel: "Curitiba" },
  { bairro: "Boqueirão", city: "curitiba", cityLabel: "Curitiba" },
  { bairro: "Cabral", city: "curitiba", cityLabel: "Curitiba" },
  { bairro: "Portão", city: "curitiba", cityLabel: "Curitiba" },
  { bairro: "Santa Felicidade", city: "curitiba", cityLabel: "Curitiba" },
  { bairro: "Centro", city: "sao-jose-dos-pinhais", cityLabel: "São José dos Pinhais" },
  { bairro: "Centro", city: "pinhais", cityLabel: "Pinhais" },
];

interface ServiceEntry {
  slug: string; // matches servicesData key
  category: string; // blog category
  short: string; // short label
  long: string; // long noun phrase
  keyword: string; // primary keyword
  faqs: { question: string; answer: string }[];
  bullets: string[];
}

const services: ServiceEntry[] = [
  {
    slug: "informatica",
    category: "informatica",
    short: "técnico de informática",
    long: "assistência técnica em informática",
    keyword: "técnico de informática",
    bullets: [
      "Formatação de Windows 11 com backup completo",
      "Remoção de vírus, adware e ransomware",
      "Upgrade de SSD e memória RAM",
      "Limpeza interna e troca de pasta térmica",
      "Recuperação de arquivos apagados",
    ],
    faqs: [
      { question: "Qual o preço de um técnico de informática a domicílio?", answer: "Visita técnica + diagnóstico a partir de R$ 99,99. Serviços comuns como formatação ficam entre R$ 150,00 e R$ 250,00 dependendo da máquina." },
      { question: "Em quanto tempo o técnico chega?", answer: "Para chamados em até 5 km do bairro, normalmente em até 2 horas em horário comercial. Casos urgentes 24h via WhatsApp." },
    ],
  },
  {
    slug: "redes",
    category: "redes-wifi",
    short: "técnico de redes Wi-Fi",
    long: "instalação e configuração de redes Wi-Fi",
    keyword: "instalação Wi-Fi",
    bullets: [
      "Análise de cobertura e zonas mortas",
      "Instalação de sistemas mesh (TP-Link Deco, Eero, Asus)",
      "Cabeamento estruturado CAT6",
      "Configuração de canais e segurança WPA3",
      "Atualização de firmware e diagnóstico de interferência",
    ],
    faqs: [
      { question: "Mesh ou repetidor é melhor?", answer: "Em casas grandes, mesh é sempre superior — mantém uma única rede com roaming inteligente. Repetidores cortam a velocidade pela metade." },
      { question: "Vocês instalam Wi-Fi 6?", answer: "Sim. Trabalhamos com roteadores e mesh Wi-Fi 6 (AX) e Wi-Fi 6E para internet acima de 300 Mbps." },
    ],
  },
  {
    slug: "cftv",
    category: "cftv-seguranca",
    short: "instalador de CFTV",
    long: "instalação de câmeras de segurança CFTV",
    keyword: "instalação de câmeras",
    bullets: [
      "Projetos residenciais e comerciais",
      "Câmeras IP 4MP, 4K e Starlight",
      "DVR/NVR Intelbras, Hikvision, Dahua",
      "Acesso remoto pelo celular configurado",
      "Manutenção preventiva e troca de HD",
    ],
    faqs: [
      { question: "Quantas câmeras preciso para uma casa?", answer: "Em média, 4 câmeras cobrem uma residência de até 150m². Casas maiores ou com mais entradas podem exigir 6 a 8 pontos." },
      { question: "Posso assistir as câmeras pelo celular?", answer: "Sim. Configuramos os apps oficiais (Hik-Connect, gDMSS, iSIC Intelbras Cloud) com senha forte e acesso 24h." },
    ],
  },
  {
    slug: "eletrica",
    category: "eletrica",
    short: "eletricista",
    long: "serviços elétricos residenciais",
    keyword: "eletricista",
    bullets: [
      "Troca de disjuntores e DR",
      "Instalação de pontos novos e tomadas",
      "Reformas de quadro de distribuição",
      "Instalação de chuveiros e duchas",
      "Atendimento NR-10 com nota fiscal",
    ],
    faqs: [
      { question: "Vocês têm certificação NR-10?", answer: "Sim. Toda a equipe técnica possui treinamento NR-10 vigente, exigido por norma para qualquer serviço elétrico." },
      { question: "Há garantia no serviço elétrico?", answer: "Sim, garantia mínima de 90 dias em mão de obra e nota fiscal emitida em todos os atendimentos." },
    ],
  },
  {
    slug: "ar-condicionado",
    category: "ar-condicionado",
    short: "técnico de ar-condicionado",
    long: "instalação e manutenção de ar-condicionado",
    keyword: "técnico de ar-condicionado",
    bullets: [
      "Instalação de splits 9.000 a 36.000 BTUs",
      "Limpeza profunda com lavagem química",
      "Recarga de gás R32 e R410A",
      "Diagnóstico de vazamento e troca de capacitor",
      "Manutenção preventiva semestral",
    ],
    faqs: [
      { question: "Quanto custa instalar um split em um bairro?", answer: "A partir de R$ 450,00 para splits de 9.000 a 12.000 BTUs em distância padrão de até 3 metros, incluindo materiais básicos." },
      { question: "De quanto em quanto tempo limpar o ar-condicionado?", answer: "Limpeza simples a cada 6 meses; lavagem química completa anualmente para manter eficiência e evitar problemas respiratórios." },
    ],
  },
];

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Spread publish dates so lastmod looks natural
const baseDate = new Date("2026-04-01").getTime();
const dayMs = 24 * 60 * 60 * 1000;
let counter = 0;

export const satellitePosts: BlogPost[] = [];

for (const svc of services) {
  for (const b of bairros) {
    const slug = `${svc.slug}-em-${slugify(b.bairro)}-${b.city}`;
    const place = `${b.bairro}, ${b.cityLabel}`;
    const title = `${capitalize(svc.long)} em ${place}: como funciona e preços`;
    const metaTitle = `${capitalize(svc.short)} em ${b.bairro} ${b.cityLabel} | 24h`;
    const metaDescription = `${capitalize(svc.long)} em ${place}. Atendimento rápido, técnico ${b.bairro}, garantia, nota fiscal. Visita a partir de R$ 99,99 — chame no WhatsApp.`;
    const date = new Date(baseDate + counter * 3 * dayMs).toISOString().split("T")[0];
    counter++;

    satellitePosts.push({
      slug,
      title,
      metaTitle,
      metaDescription,
      excerpt: `Procurando ${svc.short} em ${place}? Veja como atendemos, o que está incluso e a tabela de preços atualizada.`,
      category: svc.category,
      tags: [svc.keyword, b.bairro.toLowerCase(), b.cityLabel.toLowerCase()],
      publishedAt: date,
      updatedAt: date,
      readingTime: 6,
      sections: [
        {
          paragraphs: [
            `Se você está em ${place} e precisa de um ${svc.short} de confiança, este guia explica exatamente como o atendimento funciona, quais serviços estão inclusos e a faixa de preços praticada na região.`,
            `Atendemos ${b.bairro} e bairros vizinhos com agendamento 24 horas via WhatsApp e visita técnica a partir de R$ 99,99 (deduzida do orçamento aprovado).`,
          ],
        },
        {
          heading: `Por que contratar um ${svc.short} local em ${b.bairro}`,
          paragraphs: [
            `Profissionais que atendem a região conhecem as particularidades dos imóveis, conseguem chegar mais rápido e oferecem garantia presencial. Nossa equipe está cadastrada, treinada e identificada — você sabe quem está entrando na sua casa ou empresa.`,
            `Em ${b.bairro}, recebemos chamados todos os dias para os serviços listados abaixo. Cada um é executado seguindo padrão técnico, com peças de marcas reconhecidas e nota fiscal emitida ao final.`,
          ],
        },
        {
          heading: "O que está incluso no atendimento",
          paragraphs: [`Nosso ${svc.short} em ${b.bairro} cobre os principais serviços da categoria:`],
          list: svc.bullets,
        },
        {
          heading: "Como agendar",
          paragraphs: [
            `Basta enviar uma mensagem no WhatsApp descrevendo o problema e o endereço aproximado em ${place}. Em poucos minutos confirmamos o horário disponível e enviamos o técnico responsável.`,
            `Para emergências (rede caída, câmera offline, queda total de energia), priorizamos chamadas em ${b.bairro} com janela de até 2 horas em horário comercial.`,
          ],
        },
        {
          heading: "Faixa de preços",
          paragraphs: [
            `Visita técnica + diagnóstico a partir de R$ 99,99. O valor é abatido se o serviço for aprovado no momento. Para serviços maiores, sempre formalizamos um orçamento por escrito antes de iniciar — nada de surpresas.`,
            `Confira nossa tabela completa de preços e exemplos por serviço em precisodeumtecnico.com/precos.`,
          ],
        },
      ],
      faqs: svc.faqs,
      relatedServices: [svc.slug],
      relatedCities: [b.city],
    });
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
