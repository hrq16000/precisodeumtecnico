/**
 * WebPage schema canônico por rota.
 * Usado por páginas que montam o <head> diretamente com Helmet
 * (o componente SEOHead já emite o seu próprio automaticamente).
 */
export function buildWebPageSchema(params: {
  url: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${params.url}#webpage`,
    url: params.url,
    name: params.name,
    description: params.description,
    inLanguage: "pt-BR",
    isPartOf: {
      "@type": "WebSite",
      name: "Preciso de Um Técnico",
      url: "https://precisodeumtecnico.com",
    },
  };
}
