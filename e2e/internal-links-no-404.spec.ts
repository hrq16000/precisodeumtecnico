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
  "/servicos/conserto-de-notebook/curitiba/batel",
  "/atendimento-nacional",
  "/atendimento-nacional/sao-paulo",
  "/faq",
  "/precos",
  "/politica-de-cookies",
];

/** Limite de destinos visitados por execução — mantém o spec sob o timeout. */
const MAX_TARGETS = 220;

const SKIP = (href: string) =>
  href.startsWith("//") ||
  href.startsWith("/#") ||
  href.includes("://") ||
  href.startsWith("/api/") ||
  href.endsWith(".xml") ||
  href.endsWith(".txt") ||
  href.endsWith(".json");

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

async function isNotFound(page: Page): Promise<boolean> {
  const title = await page.title();
  if (/Página Não Encontrada/i.test(title)) return true;
  const robots =
    (await page.locator('meta[name="robots"]').first().getAttribute("content")) ?? "";
  const has404 = await page.getByText("Página Não Encontrada", { exact: false }).count();
  return robots.toLowerCase().includes("noindex") && has404 > 0;
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
