import { test, expect } from "@playwright/test";

/**
 * Rodada 24.3 — Meta robots é fonte única (SEOHead/Helmet).
 * index.html não emite mais robots estático; cada rota deve renderizar
 * exatamente 1 <meta name="robots"> com a diretiva correta.
 */

const INDEXABLE = [
  "/",
  "/servico-em/curitiba/informatica",
  "/servico-em-nacional/sao-paulo/pinheiros/informatica",
];

const NOINDEX_MATRIX = [
  "/servico-em-nacional/cidade-inexistente/pinheiros/informatica",
  "/servico-em-nacional/sao-paulo/copacabana/informatica",
  "/servico-em-nacional/sao-paulo/pinheiros/servico-inexistente",
  "/servico-em-nacional/vitoria/praia-do-canto/informatica",
];

const NOINDEX_INTERNAL = ["/diagnostics", "/triagem-preview", "/auth"];

async function robots(page: import("@playwright/test").Page) {
  return page.evaluate(() =>
    [...document.head.querySelectorAll('meta[name="robots"]')].map((m) => m.getAttribute("content") || ""),
  );
}

for (const route of INDEXABLE) {
  test(`robots único indexável — ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const r = await robots(page);
    expect(r, `meta robots em ${route}`).toHaveLength(1);
    expect(r[0]).toMatch(/index/i);
    expect(r[0]).not.toMatch(/noindex/i);
  });
}

for (const route of [...NOINDEX_MATRIX, ...NOINDEX_INTERNAL]) {
  test(`robots único noindex — ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const r = await robots(page);
    expect(r, `meta robots em ${route}`).toHaveLength(1);
    expect(r[0]).toMatch(/noindex/i);
    expect(r[0]).not.toMatch(/(^|[^n])index[, ]/i); // sem "index," concorrente
  });
}
