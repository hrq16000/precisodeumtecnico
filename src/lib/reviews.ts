// Fonte única do fluxo de avaliação pós-atendimento.
// Nenhum claim comercial é derivado daqui: apenas avaliações reais, aprovadas
// e com autorização explícita de publicação chegam ao site e ao JSON-LD.

export const REVIEW_PATH = "/avaliar";
export const SITE_ORIGIN = "https://precisodeumtecnico.com";

export interface PublishedReview {
  id: string;
  name: string;
  city: string | null;
  neighborhood: string | null;
  service: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

/** Monta o link rastreável de avaliação enviado no WhatsApp após a OS. */
export function buildReviewLink(params: {
  protocol?: string;
  service?: string;
  city?: string;
  neighborhood?: string;
  source?: string;
}): string {
  const url = new URL(REVIEW_PATH, SITE_ORIGIN);
  if (params.protocol) url.searchParams.set("os", params.protocol);
  if (params.service) url.searchParams.set("servico", params.service);
  if (params.city) url.searchParams.set("cidade", params.city);
  if (params.neighborhood) url.searchParams.set("bairro", params.neighborhood);
  url.searchParams.set("utm_source", "whatsapp");
  url.searchParams.set("utm_medium", "review_request");
  url.searchParams.set("utm_campaign", params.source ?? "pos_atendimento");
  return url.toString();
}

/** Review JSON-LD gerado somente a partir de avaliações aprovadas. */
export function buildPublishedReviewsSchema(reviews: PublishedReview[]) {
  if (!reviews.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Preciso de Um Técnico",
    url: SITE_ORIGIN,
    review: reviews.map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
        worstRating: "1",
      },
      author: { "@type": "Person", name: r.name },
      ...(r.comment ? { reviewBody: r.comment } : {}),
      datePublished: r.created_at.slice(0, 10),
      ...(r.service ? { itemReviewed: { "@type": "Service", name: r.service } } : {}),
    })),
  };
}

export function formatReviewLocation(r: PublishedReview): string {
  return [r.city, r.neighborhood].filter(Boolean).join(" - ");
}
