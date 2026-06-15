/**
 * FAQPage JSON-LD por sintoma. Consumido pelas páginas de cidade/serviço
 * e (na Fase C) pelos hubs /sintomas/:slug.
 */
export interface SymptomFAQItem {
  q: string;
  a: string;
}

export function buildSymptomFAQ(symptomLabel: string, items: SymptomFAQItem[]) {
  if (!items?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `Perguntas frequentes — ${symptomLabel}`,
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
