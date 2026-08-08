/**
 * Índice de busca interna (/busca).
 *
 * Todas as entradas apontam para rotas que já existem em App.tsx — nada de
 * URLs geradas dinamicamente sem página real (anti 404 / soft-404).
 */
import { KEYWORD_SERVICE_PAGES } from "@/data/keywordServices";
import { CURATED_SERVICE_SLUGS } from "@/data/curatedServiceSlugs";
import { servicesData } from "@/data/services";
import { BAIRROS_CURITIBA_SERVICO, SERVICO_META, REGIAO_LABEL } from "@/data/bairrosCuritibaServico";
import { CIDADES_REGIAO } from "@/data/cidadesRegiao";

export type SearchEntryType = "servico" | "bairro" | "cidade" | "pagina";

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  path: string;
  type: SearchEntryType;
  service?: string;
  city?: string;
  bairro?: string;
  /** Termos adicionais para o match (sempre em minúsculas, sem acento). */
  keywords: string[];
}

export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    // sinônimos/variações comuns de digitação
    .replace(/\bwi fi\b/g, "wifi")
    .replace(/\bpc\b/g, "computador")
    .replace(/\bnote\b/g, "notebook")
    .trim();
}

const STATIC_PAGES: SearchEntry[] = [
  {
    id: "page-precos",
    title: "Preços e condições de atendimento",
    description: "Visita a partir de R$ 99,99 e coleta por R$ 299,99, com orçamento antes do reparo.",
    path: "/precos",
    type: "pagina",
    keywords: ["preco", "valor", "orcamento", "quanto custa", "tabela"],
  },
  {
    id: "page-areas",
    title: "Áreas atendidas: cidades e bairros",
    description: "Cobertura rota por rota em Curitiba, Região Metropolitana e atendimento nacional.",
    path: "/areas-atendidas",
    type: "pagina",
    keywords: ["cobertura", "bairros", "cidades", "atende", "perto de mim"],
  },
  {
    id: "page-como-funciona",
    title: "Como funciona o atendimento",
    description: "Passo a passo da triagem online até o reparo com garantia de 90 dias.",
    path: "/como-funciona",
    type: "pagina",
    keywords: ["como funciona", "passo a passo", "triagem", "garantia"],
  },
  {
    id: "page-assistencia-curitiba",
    title: "Assistência técnica em Curitiba",
    description: "Página principal de assistência técnica na capital, com serviços e prazos.",
    path: "/assistencia-tecnica-curitiba",
    type: "pagina",
    city: "Curitiba",
    keywords: ["assistencia tecnica", "curitiba", "tecnico"],
  },
  {
    id: "page-faq",
    title: "Perguntas frequentes",
    description: "Garantia, prazos, formas de pagamento e regras de orçamento.",
    path: "/faq",
    type: "pagina",
    keywords: ["duvidas", "faq", "garantia", "pagamento"],
  },
  {
    id: "page-status-os",
    title: "Consultar status da ordem de serviço",
    description: "Acompanhe o andamento do seu atendimento pelo protocolo.",
    path: "/status-os",
    type: "pagina",
    keywords: ["status", "protocolo", "ordem de servico", "acompanhar"],
  },
];

const CURITIBA_SERVICE_PAGES: SearchEntry[] = [
  {
    id: "svc-tv-curitiba",
    title: "Reparo de Smart TV em Curitiba",
    description: "Diagnóstico em bancada para TVs que não ligam, sem imagem ou sem som.",
    path: "/servicos/reparo-smart-tv-curitiba",
    type: "servico",
    service: "reparo-smart-tv",
    city: "Curitiba",
    keywords: ["tv", "smart tv", "televisao", "nao liga"],
  },
  {
    id: "svc-tela-tv-curitiba",
    title: "Troca de tela de TV em Curitiba",
    description: "Avaliação de viabilidade e regras de aceite antes de qualquer troca de painel.",
    path: "/servicos/troca-de-tela-tv-curitiba",
    type: "servico",
    service: "troca-de-tela-tv",
    city: "Curitiba",
    keywords: ["tela quebrada", "painel", "tv trincada"],
  },
  {
    id: "svc-wifi-curitiba",
    title: "Configuração de Wi-Fi em Curitiba",
    description: "Cobertura de sinal, roteadores, repetidores e rede estável em casa ou no escritório.",
    path: "/servicos/configuracao-wifi-curitiba",
    type: "servico",
    service: "configuracao-wifi",
    city: "Curitiba",
    keywords: ["wifi", "internet", "roteador", "sinal fraco", "rede"],
  },
];

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [...STATIC_PAGES, ...CURITIBA_SERVICE_PAGES];

  // Landing pages de keyword (/formatacao-de-computador-curitiba, etc.)
  for (const page of KEYWORD_SERVICE_PAGES) {
    entries.push({
      id: `kw-${page.slug}`,
      title: page.h1,
      description: page.description,
      path: `/${page.slug}`,
      type: "servico",
      service: page.keyword,
      city: page.city,
      keywords: [page.keyword, page.triageCategory],
    });
  }

  // Serviços curados em /servicos/:slug
  for (const slug of CURATED_SERVICE_SLUGS) {
    const svc = servicesData[slug];
    if (!svc) continue;
    entries.push({
      id: `svc-${slug}`,
      title: svc.title,
      description: svc.subtitle || svc.description,
      path: `/servicos/${slug}`,
      type: "servico",
      service: svc.title,
      keywords: svc.keywords ?? [],
    });
  }

  // Bairros de Curitiba com página dedicada por serviço
  for (const bairro of BAIRROS_CURITIBA_SERVICO) {
    for (const service of ["reparo-smart-tv", "configuracao-wifi"] as const) {
      entries.push({
        id: `bairro-${service}-${bairro.slug}`,
        title: `${SERVICO_META[service].label} em ${bairro.nome}, Curitiba`,
        description: `Atendimento na rota da região ${REGIAO_LABEL[bairro.regiao]} de Curitiba.`,
        path: `/servicos/${service}/curitiba/${bairro.slug}`,
        type: "bairro",
        service: SERVICO_META[service].label,
        city: "Curitiba",
        bairro: bairro.nome,
        keywords: [bairro.nome, "curitiba", SERVICO_META[service].label],
      });
    }
  }

  // Cidades da RMC com página por serviço
  for (const cidade of CIDADES_REGIAO) {
    for (const service of ["reparo-smart-tv", "configuracao-wifi"] as const) {
      entries.push({
        id: `cidade-${service}-${cidade.slug}`,
        title: `${SERVICO_META[service].label} em ${cidade.nome}`,
        description: cidade.prazoDeslocamento,
        path: `/servicos/${service}/${cidade.slug}`,
        type: "cidade",
        service: SERVICO_META[service].label,
        city: cidade.nome,
        keywords: [cidade.nome, SERVICO_META[service].label],
      });
    }
  }

  return entries;
}

export const SEARCH_INDEX: SearchEntry[] = buildIndex();

export interface SearchFilters {
  query: string;
  type?: SearchEntryType | "todos";
}

export function searchEntries(
  { query, type = "todos" }: SearchFilters,
  limit = 24,
): SearchEntry[] {
  const q = normalize(query);
  const pool = type === "todos" ? SEARCH_INDEX : SEARCH_INDEX.filter((e) => e.type === type);
  if (!q) return pool.slice(0, limit);

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = pool
    .map((entry) => {
      const haystack = normalize(
        [entry.title, entry.description, entry.city, entry.bairro, entry.service, ...entry.keywords]
          .filter(Boolean)
          .join(" "),
      );
      const titleHay = normalize(entry.title);
      let score = 0;
      for (const token of tokens) {
        if (!haystack.includes(token)) return null;
        score += titleHay.includes(token) ? 3 : 1;
        if (titleHay.startsWith(token)) score += 2;
      }
      return { entry, score };
    })
    .filter((r): r is { entry: SearchEntry; score: number } => r !== null)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((r) => r.entry);
}

/** Sugestões rápidas (cidades, bairros e serviços) para o autocomplete. */
export function suggestTerms(query: string, limit = 8): string[] {
  const q = normalize(query);
  const set = new Set<string>();
  for (const entry of SEARCH_INDEX) {
    for (const term of [entry.bairro, entry.city, entry.service].filter(Boolean) as string[]) {
      if (!q || normalize(term).includes(q)) set.add(term);
      if (set.size >= limit * 4) break;
    }
  }
  return Array.from(set).slice(0, limit);
}
