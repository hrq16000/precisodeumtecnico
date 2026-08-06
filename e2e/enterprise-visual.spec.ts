import { test, expect } from "@playwright/test";

/**
 * Padrão visual das páginas empresariais (guias e landings B2B).
 * Valida hero mobile, sumário navegável a partir de headings reais,
 * faixa de confiança e integridade de SEO/JSON-LD após a mudança visual.
 */
const PAGES = [
  "/guias/organizacao-de-ti-para-pequenos-escritorios",
  "/guias/como-escolher-uma-workstation",
  "/empresa-de-ti-curitiba",
  "/seguranca-dos-dados",
  "/servicos/suporte-tecnico-empresarial",
];

for (const path of PAGES) {
  for (const width of [360, 390, 430]) {
    test(`CTA acima de 750px em ${path} @${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      const cta = page.locator("[data-triage-cta], a[data-wa-source$='-hero']").first();
      const box = await cta.boundingBox();
      expect(box, `CTA visível em ${path}`).not.toBeNull();
      expect(box!.y).toBeLessThan(750);
      expect(await page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")).toBe(true);
    });
  }

  test(`sumário, confiança e SEO em ${path}`, async ({ page }) => {
    await page.goto(path);

    const toc = page.locator("[data-page-toc]");
    await expect(toc).toHaveCount(1);
    const ids = await toc.locator("a[href^='#']").evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!.slice(1)),
    );
    expect(ids.length).toBeGreaterThan(3);
    for (const id of ids) {
      const target = page.locator(`#${id}`);
      await expect(target, `âncora #${id} em ${path}`).toHaveCount(1);
      // scroll-margin-top evita heading escondido sob o header fixo.
      const sm = await target.evaluate((el) => getComputedStyle(el).scrollMarginTop);
      expect(parseFloat(sm)).toBeGreaterThan(0);
    }

    await expect(page.locator("[data-trust-strip]")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("link[rel='canonical']")).toHaveCount(1);

    // JSON-LD continua parseável e sem tipos perdidos.
    const types = await page.locator("script[type='application/ld+json']").evaluateAll((els) =>
      els.flatMap((e) => {
        const parsed = JSON.parse(e.textContent || "{}");
        return (Array.isArray(parsed) ? parsed : [parsed]).map((n) => n["@type"]);
      }),
    );
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("FAQPage");
  });
}
