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
