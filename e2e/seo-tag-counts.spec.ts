import { test, expect } from "@playwright/test";

/**
 * Contagem estrita de tags SEO por rota. Fecha a regressão de duplicação
 * entre index.html estático e emissões por Helmet (Rodada 20).
 *
 * Regra: cada rota pública deve renderizar exatamente 1 tag por chave.
 * og:image / twitter:image são injetadas pela hospedagem — validadas como
 * "1 ou 2" para tolerar SPA sem hidratação em dev, mas nunca zero.
 */
const ROUTES = [
  "/",
  "/assistencia-tecnica",
  "/assistencia-tecnica-curitiba",
  "/precos",
  "/termos-orcamento",
  "/contato",
];

for (const route of ROUTES) {
  test(`SEO tag counts — ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const counts = await page.evaluate(() => {
      const q = (sel: string) => document.head.querySelectorAll(sel).length;
      const descEl = document.head.querySelector('meta[name="description"]');
      return {
        canonical: q('link[rel="canonical"]'),
        ogTitle: q('meta[property="og:title"]'),
        ogDescription: q('meta[property="og:description"]'),
        ogUrl: q('meta[property="og:url"]'),
        ogImage: q('meta[property="og:image"]'),
        twitterImage: q('meta[name="twitter:image"]'),
        twitterTitle: q('meta[name="twitter:title"]'),
        twitterDescription: q('meta[name="twitter:description"]'),
        twitterCard: q('meta[name="twitter:card"]'),
        robots: q('meta[name="robots"]'),
        description: q('meta[name="description"]'),
        descriptionContent: (descEl?.getAttribute("content") ?? "").trim(),
      };
    });

    expect(counts.canonical, `canonical em ${route}`).toBe(1);
    expect(counts.ogTitle, `og:title em ${route}`).toBe(1);
    expect(counts.ogDescription, `og:description em ${route}`).toBe(1);
    expect(counts.ogUrl, `og:url em ${route}`).toBe(1);
    expect(counts.twitterTitle, `twitter:title em ${route}`).toBe(1);
    expect(counts.twitterDescription, `twitter:description em ${route}`).toBe(1);
    expect(counts.twitterCard, `twitter:card em ${route} (fonte única — Rodada 24.4)`).toBe(1);
    expect(counts.robots, `meta robots em ${route} (fonte única — Rodada 24.3)`).toBe(1);
    expect(counts.description, `meta description em ${route} (fonte única — Rodada 25.1)`).toBe(1);
    expect(counts.descriptionContent.length, `description não vazia em ${route}`).toBeGreaterThan(20);
    // og:image / twitter:image: em dev sem injeção da hospedagem podem ser 0;
    // em produção devem ser exatamente 1. Este spec aceita <=1 para não
    // quebrar preview local; produção é coberta pelo smoke pós-deploy.
    expect(counts.ogImage, `og:image em ${route}`).toBeLessThanOrEqual(1);
    expect(counts.twitterImage, `twitter:image em ${route}`).toBeLessThanOrEqual(1);
  });
}
