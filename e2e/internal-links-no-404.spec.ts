import { test, expect, type Page } from "@playwright/test";

/**
 * Guard de links internos — nenhum link do portal pode cair no NotFound.
 *
 * Faz uma varredura em largura a partir de páginas semente que representam
 * cada família de rota (home, serviços, cidade, bairro, bairro×serviço, FAQ,
 * páginas legais). Coleta todos os <a href="/..."> renderizados, deduplica e
 * visita cada destino verificando que a página resolvida NÃO é o 404.
 *
 * O 404 é identificado pelo contrato do NotFound: título da SEOHead
 * "Página Não Encontrada" + meta robots noindex.
 */

const SEEDS = [
  "/",
  "/servicos",
  "/regioes",
  "/regioes/curitiba",
  "/regioes/curitiba/batel",
  "/regioes/sao-jose-dos-pinhais/centro",
  "/servicos/reparo-smart-tv/curitiba/batel",
  "/atendimento-nacional",
  "/atendimento-nacional/sao-paulo",
  "/faq",
  "/precos",
  "/politica-de-cookies",
];

/** Limite de destinos visitados por execução — mantém o spec sob o timeout. */
const MAX_TARGETS = 220;

/**
 * Não são rotas do app: âncoras, externos, endpoints e arquivos estáticos
 * (o navegador inicia download em vez de navegar — não há página para avaliar).
 */
const ASSET_EXT =
  /\.(xml|txt|json|pdf|zip|csv|png|jpe?g|webp|avif|svg|gif|ico|mp4|webm|mp3|woff2?)$/i;

const SKIP = (href: string) =>
  href.startsWith("//") ||
  href.startsWith("/#") ||
  href.includes("://") ||
  href.startsWith("/api/") ||
  ASSET_EXT.test(href.split("#")[0].split("?")[0]);

function normalize(href: string): string {
  const [path] = href.split("#");
  const clean = path.split("?")[0];
  if (!clean.startsWith("/")) return "";
  return clean.length > 1 && clean.endsWith("/") ? clean.slice(0, -1) : clean;
}

async function collectLinks(page: Page, path: string): Promise<string[]> {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  const hrefs = await page.$$eval("a[href]", (as) =>
    as.map((a) => a.getAttribute("href") ?? ""),
  );
  return hrefs
    .filter((h) => h.startsWith("/") && !SKIP(h))
    .map(normalize)
    .filter(Boolean);
}

/**
 * Detecção determinística do 404 do app.
 *
 * Fonte primária: o marcador estrutural `[data-testid="not-found"]` renderizado
 * apenas pelo NotFound, lido em um único `evaluate` sobre o DOM já estável
 * (sem locator com auto-wait). `meta[name="robots"]` é evidência complementar
 * — não é invariante do projeto (páginas indexáveis podem não emitir a tag),
 * então esperar por ela causava timeout em página válida, não falha real.
 */
async function isNotFound(page: Page): Promise<boolean> {
  const state = await page.evaluate(() => ({
    title: document.title,
    marker: document.querySelectorAll('[data-testid="not-found"]').length > 0,
    robots:
      document.querySelector('meta[name="robots"]')?.getAttribute("content")?.toLowerCase() ?? "",
  }));
  if (state.marker) return true;
  if (/Página Não Encontrada/i.test(state.title)) return true;
  return false;
}

test.describe("links internos", () => {
  test.setTimeout(15 * 60_000);

  test("nenhum link interno resolve para 404", async ({ page }) => {
    const targets = new Set<string>();

    for (const seed of SEEDS) {
      for (const href of await collectLinks(page, seed)) targets.add(href);
    }

    // Sementes também são validadas (garante que a família de rota existe).
    for (const seed of SEEDS) targets.add(normalize(seed));

    const list = [...targets].sort().slice(0, MAX_TARGETS);
    expect(list.length, "deve haver links internos coletados").toBeGreaterThan(30);

    const broken: string[] = [];
    for (const path of list) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      if (await isNotFound(page)) broken.push(path);
    }

    expect(broken, `links internos quebrados: ${broken.join(", ")}`).toEqual([]);
  });
});
