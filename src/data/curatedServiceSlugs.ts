/**
 * Slugs de /servicos/:slug que possuem conteúdo curado em ServicoDetalhe.
 * Qualquer slug fora desta lista responde como NotFound (anti soft-404) e,
 * por isso, também não pode entrar no sitemap.
 */
export const CURATED_SERVICE_SLUGS = [
  "formatacao-computadores",
  "instalacao-cameras",
  "instalacao-ar-condicionado",
  "pc-gamer",
] as const;

export type CuratedServiceSlug = (typeof CURATED_SERVICE_SLUGS)[number];

export const isCuratedServiceSlug = (slug?: string): slug is CuratedServiceSlug =>
  !!slug && (CURATED_SERVICE_SLUGS as readonly string[]).includes(slug);
