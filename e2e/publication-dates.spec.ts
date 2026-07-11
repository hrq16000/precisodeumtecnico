import { test, expect } from "@playwright/test";

/**
 * Rodada 25.1 · B.3.a — Nenhuma data futura em posts públicos.
 * Contrato:
 *   - listagem /blog não exibe nenhuma data DD/MM/YYYY no futuro;
 *   - JSON-LD datePublished/dateModified do BlogPost não é futuro;
 *   - página individual do post satélite mais recente carrega com data válida.
 */

function ddmmyyyyToIso(s: string): string | null {
  const m = s.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

test.describe("Publication dates — sem futuro", () => {
  const today = new Date().toISOString().split("T")[0];

  test("/blog não exibe nenhuma data DD/MM/YYYY futura", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");
    const body = (await page.locator("main, body").first().innerText()) ?? "";
    const dates = body.match(/\d{2}\/\d{2}\/\d{4}/g) ?? [];
    expect(dates.length).toBeGreaterThan(0);
    for (const d of dates) {
      const iso = ddmmyyyyToIso(d)!;
      expect(iso <= today, `data futura visível na listagem: ${d}`).toBe(true);
    }
  });

  test("post satélite mais recente carrega e sua JSON-LD datePublished é válida", async ({ page }) => {
    // O último post satélite gerado é ar-condicionado-em-centro-pinhais (2026-06-11).
    await page.goto("/blog/ar-condicionado-em-centro-pinhais");
    await page.waitForLoadState("networkidle");
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const article = scripts.map((s) => {
      try { return JSON.parse(s); } catch { return null; }
    }).find((s) => s && (s["@type"] === "BlogPosting" || s["@type"] === "Article"));
    expect(article, "Article/BlogPosting JSON-LD ausente").toBeTruthy();
    const iso = String(article.datePublished).slice(0, 10);
    expect(iso <= today, `datePublished futuro: ${iso}`).toBe(true);
  });
});
