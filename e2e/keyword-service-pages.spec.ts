import { test, expect } from "@playwright/test";

/**
 * Rodada 28.1 — Landing pages por keyword.
 * Cada rota deve ter H1 único, meta description iniciando com verbo de ação,
 * Service + FAQPage em JSON-LD e CTA de triagem pré-classificado.
 */
const PAGES = [
  { path: "/formatacao-de-computador-curitiba", keyword: "formatação de computador" },
  { path: "/remocao-de-virus-curitiba", keyword: "remoção de vírus" },
  { path: "/upgrade-ssd-curitiba", keyword: "SSD" },
  { path: "/upgrade-memoria-ram-curitiba", keyword: "memória RAM" },
  { path: "/conserto-de-notebook-curitiba", keyword: "notebook" },
  { path: "/suporte-tecnico-remoto", keyword: "remoto" },
  { path: "/assistencia-tecnica-empresas-curitiba", keyword: "empresas" },
];

const ACTION_VERBS = [
  "Formate", "Remova", "Acelere", "Amplie", "Conserte", "Resolva", "Contrate",
];

const seenTitles = new Set<string>();
const seenDescriptions = new Set<string>();

for (const p of PAGES) {
  test(`landing ${p.path}: estrutura SEO e CTA`, async ({ page }) => {
    await page.goto(p.path);

    // H1 único
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText(new RegExp(p.keyword, "i"));

    // Title e description únicos, description começa com verbo de ação
    const title = await page.title();
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(title.length).toBeGreaterThan(20);
    expect(description!.length).toBeGreaterThan(60);
    expect(seenTitles.has(title)).toBe(false);
    expect(seenDescriptions.has(description!)).toBe(false);
    seenTitles.add(title);
    seenDescriptions.add(description!);
    expect(
      ACTION_VERBS.some((v) => description!.startsWith(v)),
      `description deve começar com verbo de ação: "${description}"`,
    ).toBe(true);

    // Canonical self-referente
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(`https://precisodeumtecnico.com${p.path}`);

    // JSON-LD: Service + FAQPage
    const types = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.flatMap((n) => {
        try {
          const parsed = JSON.parse(n.textContent ?? "");
          return [String(parsed["@type"])];
        } catch {
          return [];
        }
      }),
    );
    expect(types).toContain("Service");
    expect(types).toContain("FAQPage");
    expect(types).toContain("BreadcrumbList");

    // CTA de triagem pré-classificado
    const cta = page.locator("[data-triage-cta]").first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("data-triage-category", /.+/);

    // Imagem com alt descritivo
    const img = page.locator("main img, img").first();
    const alt = await img.getAttribute("alt");
    expect((alt ?? "").length).toBeGreaterThan(20);
  });
}
