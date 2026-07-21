// Centralized testimonials data + Review schema generation.
// Used by the homepage Testimonials section AND the Index page SEOHead so
// Google can pick up Review/AggregateRating markup.

export interface Testimonial {
  name: string;
  location: string;
  service: string;
  rating: number;
  text: string;
  /** ISO date string. Optional but improves schema quality. */
  date?: string;
}

export const testimonials: Testimonial[] = [
  { name: "Carlos Eduardo", location: "Curitiba - Batel", service: "Formatação de Notebook", rating: 5, text: "Excelente atendimento! O técnico chegou rápido, resolveu o problema do meu notebook em menos de 1 hora. Super recomendo!", date: "2026-01-08" },
  { name: "Ana Paula", location: "São José dos Pinhais", service: "Instalação de Câmeras", rating: 5, text: "Instalaram 4 câmeras na minha casa com muita qualidade. Serviço limpo e organizado. Garantia de 1 ano.", date: "2026-01-15" },
  { name: "Roberto Silva", location: "Curitiba - Água Verde", service: "Manutenção Elétrica", rating: 5, text: "Precisava urgente arrumar a parte elétrica. Chamei pelo WhatsApp às 20h e o técnico chegou em 40 minutos. Impressionante!", date: "2026-01-22" },
  { name: "Mariana Costa", location: "Colombo", service: "Conserto de PC", rating: 5, text: "Meu computador não ligava mais. O técnico trocou a fonte e fez uma limpeza completa. Voltou a funcionar perfeito!", date: "2026-02-03" },
  { name: "Fernando Martins", location: "Pinhais", service: "Instalação de Ar", rating: 5, text: "Preço justo e serviço de qualidade. Instalaram o ar-condicionado no mesmo dia que entrei em contato.", date: "2026-02-10" },
  { name: "Juliana Ferreira", location: "Curitiba - Portão", service: "Configuração de Rede", rating: 5, text: "O técnico configurou toda a rede Wi-Fi da minha casa. Agora tenho internet em todos os cômodos. Muito satisfeita!", date: "2026-02-19" },
];

/**
 * Rodada 23: nenhum aggregateRating/ratingValue/reviewCount é publicado em
 * schemas públicos. Prova social não é derivada de estatística global.
 * Cada Review é emitido individualmente e mapeia 1:1 para o array acima —
 * contexto explícito, sem médias fabricadas nem contagens globais.
 */
export function buildReviewsSchema() {
  if (!testimonials.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Preciso de Um Técnico",
    url: "https://precisodeumtecnico.com",
    review: testimonials.map((t) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: "5", worstRating: "1" },
      author: { "@type": "Person", name: t.name },
      reviewBody: t.text,
      datePublished: t.date,
      itemReviewed: { "@type": "Service", name: t.service },
    })),
  };
}

/** Normaliza string para matching de tokens (lowercase, sem acento, alfanum). */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ");
}

/** Stopwords PT-BR irrelevantes para matching de serviço. */
const STOPWORDS = new Set([
  "de", "do", "da", "e", "em", "para", "um", "uma", "com", "sem",
  "no", "na", "os", "as", "ar",
]);

function tokens(s: string): string[] {
  return normalize(s)
    .split(/[\s-]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

/**
 * Retorna depoimentos cujo `service` compartilha ao menos 1 token com o
 * slug OU título fornecido. Match honesto e determinístico — nenhum
 * depoimento fabricado ou reatribuído.
 */
export function getTestimonialsForService(
  slug: string | undefined,
  title?: string,
): Testimonial[] {
  if (!slug && !title) return [];
  const needle = new Set([
    ...tokens(slug ?? ""),
    ...tokens(title ?? ""),
  ]);
  if (needle.size === 0) return [];
  return testimonials.filter((t) => {
    const haystack = tokens(t.service);
    return haystack.some((tok) => needle.has(tok));
  });
}

/**
 * Schema Review individual por serviço. Mantém política Rodada 23 —
 * sem aggregateRating. Retorna null quando não há match.
 */
export function buildServiceReviewsSchema(
  serviceName: string,
  matches: Testimonial[],
): object | null {
  if (!matches.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    provider: { "@type": "LocalBusiness", name: "Preciso de Um Técnico" },
    review: matches.map((t) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: "5", worstRating: "1" },
      author: { "@type": "Person", name: t.name },
      reviewBody: t.text,
      datePublished: t.date,
    })),
  };
}
