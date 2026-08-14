/**
 * Fonte única de og:image / twitter:image POR ROTA.
 *
 * Antes, a imagem social era uma tag estática única em index.html — toda rota
 * do portal compartilhava a mesma prévia. Agora o SEOHead resolve a imagem a
 * partir do canonical da rota, usando os binários já versionados em
 * `public/og/` (todos 1200x630, validados por `scripts/check-og-images.ts`).
 *
 * Ordem de resolução:
 *   1. `ogImage` explícito passado pela página (vence sempre);
 *   2. cidade nacional detectada no path → `/og/cidade/<slug>.jpg`;
 *   3. cluster temático detectado no path → `/og/<cluster>.jpg`;
 *   4. `/og/default.jpg`.
 */

export const OG_ORIGIN = "https://precisodeumtecnico.com";
export const DEFAULT_OG_IMAGE = `${OG_ORIGIN}/og/default.jpg`;

/** Cidades com arte OG dedicada em public/og/cidade/. */
export const OG_CITY_SLUGS = [
  "aracaju", "belem", "belo-horizonte", "boa-vista", "brasilia", "campinas",
  "campo-grande", "caxias-do-sul", "cuiaba", "florianopolis", "fortaleza",
  "goiania", "guarulhos", "joao-pessoa", "joinville", "londrina", "macapa",
  "maceio", "manaus", "maringa", "natal", "niteroi", "palmas", "porto-alegre",
  "porto-velho", "recife", "rio-branco", "rio-de-janeiro", "salvador", "santos",
  "sao-bernardo-do-campo", "sao-luis", "sao-paulo", "teresina", "vitoria",
] as const;

const CITY_SET = new Set<string>(OG_CITY_SLUGS);

/**
 * Clusters temáticos: primeiro padrão que casar com o path define a arte.
 * A ordem importa — padrões mais específicos vêm antes.
 */
const CLUSTERS: Array<{ test: RegExp; image: string }> = [
  { test: /(^|\/)(blog|guias?|artigos?)(\/|$)/, image: "blog" },
  { test: /(preco|precos|orcamento|quanto-custa|valor)/, image: "guias-precos" },
  { test: /(cftv|cameras?|seguranca|alarme|monitoramento)/, image: "cftv-seguranca" },
  { test: /(ar-condicionado|climatizacao|split)/, image: "ar-condicionado" },
  { test: /(celular|smartphone|iphone|tablet|troca-de-tela)/, image: "celulares" },
  { test: /(eletric|tomada|quadro-de-luz|chuveiro|instalacao-eletrica)/, image: "eletrica" },
  {
    test: /(informatica|computador|notebook|pc|formatacao|windows|wifi|wi-fi|rede|impressora|montagem)/,
    image: "informatica",
  },
];

function normalizePath(canonicalOrPath: string): string {
  let path = canonicalOrPath;
  try {
    if (/^https?:\/\//i.test(canonicalOrPath)) path = new URL(canonicalOrPath).pathname;
  } catch {
    /* mantém a string original */
  }
  return `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`.toLowerCase();
}

/** Caminho absoluto da imagem social correspondente à rota. */
export function resolveOgImage(canonicalOrPath: string, explicit?: string): string {
  if (explicit) {
    return /^https?:\/\//i.test(explicit)
      ? explicit
      : `${OG_ORIGIN}${explicit.startsWith("/") ? "" : "/"}${explicit}`;
  }

  const path = normalizePath(canonicalOrPath);
  if (path === "/") return DEFAULT_OG_IMAGE;

  for (const segment of path.split("/").filter(Boolean)) {
    if (CITY_SET.has(segment)) return `${OG_ORIGIN}/og/cidade/${segment}.jpg`;
  }

  for (const cluster of CLUSTERS) {
    if (cluster.test.test(path)) return `${OG_ORIGIN}/og/${cluster.image}.jpg`;
  }

  return DEFAULT_OG_IMAGE;
}
