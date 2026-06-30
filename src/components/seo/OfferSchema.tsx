/**
 * Schema.org Offer/Service JSON-LD para a oferta âncora R$ 99,99 (visita)
 * e R$ 90,00 (bancada). Use em páginas de cidade/bairro/serviço através
 * de <SEOHead structuredData={[..., buildOfferSchema(...)]} />.
 */
export interface OfferSchemaInput {
  serviceName: string;
  serviceSlug?: string;
  areaServed?: string | string[];
  url: string;
}

export function buildOfferSchema(input: OfferSchemaInput) {
  const areas = Array.isArray(input.areaServed)
    ? input.areaServed
    : input.areaServed
      ? [input.areaServed]
      : ["Curitiba"];

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.serviceName,
    provider: {
      "@type": "LocalBusiness",
      name: "Preciso de Um Técnico",
      url: "https://precisodeumtecnico.com",
    },
    areaServed: areas.map((a) => ({ "@type": "City", name: a })),
    url: input.url,
    offers: [
      {
        "@type": "Offer",
        name: "Visita técnica (30 min)",
        url: `${input.url}#visita-99`,
        priceCurrency: "BRL",
        price: "99.99",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "99.99",
          priceCurrency: "BRL",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: 30,
            unitCode: "MIN",
          },
        },
        availability: "https://schema.org/InStock",
        eligibleRegion: areas.map((a) => ({ "@type": "Place", name: a })),
      },
      {
        "@type": "Offer",
        name: "Atendimento em bancada",
        url: `${input.url}#bancada-90`,
        priceCurrency: "BRL",
        price: "90.00",
        availability: "https://schema.org/InStock",
        eligibleRegion: areas.map((a) => ({ "@type": "Place", name: a })),
      },
    ],
  };
}
