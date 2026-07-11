import { Helmet } from "react-helmet-async";

/**
 * Validate and stringify a structured-data object. Catches the most common
 * mistakes (missing @context/@type, FAQPage without mainEntity, BreadcrumbList
 * without itemListElement) and warns in development. Always returns a JSON
 * string in production so a misformed entry never breaks SSR/CSR rendering.
 */
function safeStringify(schema: unknown, idx: number): string | null {
  try {
    const obj = schema as Record<string, unknown>;
    if (import.meta.env.DEV && obj && typeof obj === "object") {
      if (!obj["@context"]) console.warn(`[SEO] schema[${idx}] missing @context`);
      if (!obj["@type"]) console.warn(`[SEO] schema[${idx}] missing @type`);
      if (obj["@type"] === "FAQPage" && !obj.mainEntity)
        console.warn(`[SEO] FAQPage schema[${idx}] missing mainEntity`);
      if (obj["@type"] === "BreadcrumbList" && !obj.itemListElement)
        console.warn(`[SEO] BreadcrumbList schema[${idx}] missing itemListElement`);
      if (obj["@type"] === "Article" && !obj.headline)
        console.warn(`[SEO] Article schema[${idx}] missing headline`);
    }
    return JSON.stringify(schema);
  } catch (e) {
    if (import.meta.env.DEV) console.error(`[SEO] failed to stringify schema[${idx}]`, e);
    return null;
  }
}

interface Breadcrumb { name: string; url: string; }
interface ServiceInfo {
  name: string;
  description?: string;
  priceMinBRL?: number;
  areaServed?: string;
}
interface FAQItem { question: string; answer: string; }

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: "website" | "article" | "service";
  schema?: object;
  /** Optional list of additional structured-data objects (FAQ, Breadcrumb, etc.) */
  structuredData?: object[];
  keywords?: string;
  /** Breadcrumbs; emitem BreadcrumbList schema. */
  breadcrumbs?: Breadcrumb[];
  /** Se presente, emite Service schema (páginas de serviço). */
  service?: ServiceInfo;
  /** Se presente, emite FAQPage schema. Deve corresponder às FAQs visíveis. */
  faq?: FAQItem[];
  /** Article publication metadata for blog posts */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  /** Se true, emite `<meta name="robots" content="noindex, nofollow">`. */
  noindex?: boolean;
}


export function SEOHead({
  title,
  description,
  canonical = "https://precisodeumtecnico.com",
  // ogImage é ignorado no Helmet: a hospedagem Lovable injeta og:image /
  // twitter:image server-side (fallback ou imagem do projeto). Emitir aqui
  // duplicaria a tag no <head>. Mantido no tipo para compat com callers.
  ogImage: _ogImage,
  type = "website",
  schema,
  structuredData,
  keywords,
  breadcrumbs,
  service,
  faq,
  article,
  noindex = false,
}: SEOHeadProps) {

  const fullTitle = title.includes("Preciso de Um Técnico")
    ? title
    : `${title} | Preciso de Um Técnico`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Preciso de Um Técnico",
    description:
      "Assistência técnica especializada em Curitiba e Região Metropolitana. Informática, elétrica, CFTV, notebooks, ar-condicionado e muito mais.",
    url: "https://precisodeumtecnico.com",
    taxID: "41.723.708/0001-58",
    foundingDate: "1998",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Curitiba",
      addressRegion: "PR",
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: "-25.4284", longitude: "-49.2733" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Curitiba" },
      { "@type": "City", name: "São José dos Pinhais" },
      { "@type": "City", name: "Pinhais" },
      { "@type": "City", name: "Colombo" },
      { "@type": "City", name: "Araucária" },
    ],
    priceRange: "$$",
  };

  const extra: object[] = [];
  if (breadcrumbs && breadcrumbs.length > 0) {
    extra.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    });
  }
  if (service) {
    extra.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.description,
      areaServed: service.areaServed ?? "Curitiba e Região Metropolitana",
      provider: { "@type": "LocalBusiness", name: "Preciso de Um Técnico" },
      ...(service.priceMinBRL
        ? {
            offers: {
              "@type": "Offer",
              price: service.priceMinBRL,
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
            },
          }
        : {}),
    });
  }
  if (faq && faq.length > 0) {
    extra.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  const baseSchemas = structuredData ?? (schema ? [schema] : [localBusinessSchema]);
  const schemas = [...baseSchemas, ...extra];


  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      {/* og:image / twitter:image são injetados pela hospedagem — não emitir aqui. */}
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Preciso de Um Técnico" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />



      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      <meta name="author" content="Preciso de Um Técnico" />
      <meta name="geo.region" content="BR-PR" />
      <meta name="geo.placename" content="Curitiba" />

      {schemas.map((s, i) => {
        const json = safeStringify(s, i);
        if (!json) return null;
        return (
          <script key={i} type="application/ld+json">
            {json}
          </script>
        );
      })}
    </Helmet>
  );
}
