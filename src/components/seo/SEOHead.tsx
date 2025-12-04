import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: "website" | "article" | "service";
  schema?: object;
}

export function SEOHead({ 
  title, 
  description, 
  canonical = "https://precisodeumtecnico.com",
  ogImage = "https://precisodeumtecnico.com/og-image.jpg",
  type = "website",
  schema
}: SEOHeadProps) {
  const fullTitle = title.includes("Preciso de Um Técnico") 
    ? title 
    : `${title} | Preciso de Um Técnico`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Preciso de Um Técnico",
    "description": "Assistência técnica especializada em Curitiba e Região Metropolitana. Informática, elétrica, CFTV, notebooks, ar-condicionado e muito mais.",
    "url": "https://precisodeumtecnico.com",
    "telephone": "+55-41-99745-2053",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Curitiba",
      "addressRegion": "PR",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-25.4284",
      "longitude": "-49.2733"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Curitiba" },
      { "@type": "City", "name": "São José dos Pinhais" },
      { "@type": "City", "name": "Pinhais" },
      { "@type": "City", "name": "Colombo" },
      { "@type": "City", "name": "Araucária" }
    ],
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "15000"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Preciso de Um Técnico" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Preciso de Um Técnico" />
      <meta name="geo.region" content="BR-PR" />
      <meta name="geo.placename" content="Curitiba" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema || localBusinessSchema)}
      </script>
    </Helmet>
  );
}
