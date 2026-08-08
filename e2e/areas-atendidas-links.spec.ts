import { test, expect, type Page } from "@playwright/test";

/**
 * /areas-atendidas — hub de SEO local.
 * Valida que os links de cidades e bairros abrem sem 404, em mobile e desktop.
 * O 404 é identificado pelo contrato do NotFound (title "Página Não Encontrada").
 */

const VIEWPORTS = [
  { label: "mobile", width: 390, height: 844 },
  { label: "desktop", width: 1280, height: 900 },
] as const;

/** Amostra determinística de links para manter o spec dentro do timeout. */
const SAMPLE = 14;

async function collectTargets(page: Page): Promise<string[]> {
  await page.goto("/areas-atendidas", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  const hrefs = await page.$$eval("main a[href], section a[href]", (as) =>
    as.map((a) => a.getAttribute("href") ?? ""),
  );
  const targets = hrefs
    .filter((h) => /^\/(regioes|atendimento-nacional)\//.test(h))
    .map((h) => h.split("#")[0].split("?")[0]);
  return Array.from(new Set(targets));
}

for (const vp of VIEWPORTS) {
  test.describe(`areas-atendidas · ${vp.label}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("lista cidades e bairros com links sem 404", async ({ page }) => {
      const targets = await collectTargets(page);
      expect(targets.length).toBeGreaterThan(10);

      const step = Math.max(1, Math.floor(targets.length / SAMPLE));
      const sample = targets.filter((_, i) => i % step === 0).slice(0, SAMPLE);

      for (const path of sample) {
        await page.goto(path, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle");
        const title = await page.title();
        expect(title, `404 em ${path}`).not.toContain("Página Não Encontrada");
      }
    });
  });
}
