import { test, expect } from "@playwright/test";

// Guardrail: no fabricated review counts / rating badges should surface
// on public pages. Real testimonials (from src/data/testimonials.ts) remain
// allowed; we assert against known fabricated patterns only.

const ROUTES = [
  "/",
  "/servicos",
  "/assistencia-tecnica",
  "/assistencia-tecnica-curitiba",
  "/precos",
  "/contato",
  "/sobre",
  "/servicos/informatica/curitiba",
];

const FABRICATED_PATTERNS: RegExp[] = [
  /523\s*avalia/i,
  /15\.?000\s*atendimentos/i,
  /\+?\s*15\.?000\s*avalia/i,
  /4[.,]9\s*\/\s*5/i,
  /4[.,]9\s*★/i,
  /\(\s*523\s*\)/,
];

for (const route of ROUTES) {
  test(`sem prova social fabricada em ${route}`, async ({ page }) => {
    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    if (!res || res.status() >= 400) test.skip(true, `${route} indisponível`);
    const bodyText = await page.locator("body").innerText();
    for (const rx of FABRICATED_PATTERNS) {
      expect(bodyText, `padrão fabricado ${rx} em ${route}`).not.toMatch(rx);
    }

    // Nenhum JSON-LD deve conter reviewCount fabricado 523 ou 15000
    const jsonLdBlocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    for (const block of jsonLdBlocks) {
      expect(block).not.toMatch(/"reviewCount"\s*:\s*523\b/);
      expect(block).not.toMatch(/"reviewCount"\s*:\s*15000\b/);
    }
  });
}
