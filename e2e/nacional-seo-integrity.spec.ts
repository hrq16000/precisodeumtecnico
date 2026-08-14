import { test, expect } from "@playwright/test";

/**
 * Guard SEO das rotas /atendimento-nacional (cidade e bairro):
 *   - <title> presente, único e não default
 *   - meta description presente, não default, < 200 chars
 *   - exatamente 1 <h1>
 *   - pelo menos 1 bloco JSON-LD parseável
 * Falha o CI quando houver regressão.
 */
const routes = [
  { path: "/atendimento-nacional/sao-paulo", kind: "cidade" },
  { path: "/atendimento-nacional/rio-de-janeiro", kind: "cidade" },
  { path: "/atendimento-nacional/belo-horizonte", kind: "cidade" },
  { path: "/atendimento-nacional/sao-paulo/pinheiros", kind: "bairro" },
  { path: "/atendimento-nacional/rio-de-janeiro/copacabana", kind: "bairro" },
  { path: "/atendimento-nacional/belo-horizonte/savassi", kind: "bairro" },
];

const BAD_TITLES = /^(lovable app|preciso de um técnico)?$/i;
const BAD_DESCS = /lovable generated project/i;

for (const { path, kind } of routes) {
  test(`SEO integrity — ${kind} ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    // aguarda hidratação do Helmet
    await page.waitForFunction(() => document.title.length > 0);

    const title = await page.title();
    expect(title.length).toBeGreaterThan(15);
    expect(title).not.toMatch(BAD_TITLES);

    const desc = await page.locator('head > meta[name="description"]').getAttribute("content");
    expect(desc, "meta description missing").toBeTruthy();
    expect(desc!.length).toBeGreaterThan(50);
    expect(desc!.length).toBeLessThan(200);
    expect(desc!).not.toMatch(BAD_DESCS);

    // Rotas lazy: aguarda a hidratação do conteúdo antes de contar headings.
    await page.locator("h1").first().waitFor({ state: "attached", timeout: 15_000 });
    const h1Count = await page.locator("h1").count();
    expect(h1Count, "must have exactly one <h1>").toBe(1);

    const jsonldBlocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonldBlocks.length).toBeGreaterThan(0);
    for (const raw of jsonldBlocks) {
      expect(() => JSON.parse(raw)).not.toThrow();
    }
  });
}
