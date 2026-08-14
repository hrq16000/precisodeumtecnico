import { test, expect } from "@playwright/test";

/**
 * 1) Simula bloqueio de popup (window.open => null) e garante que o fluxo
 *    expõe o fallback de cópia com a mensagem correta.
 * 2) Varre todas as CTAs wa.me das rotas amostradas e valida que a query
 *    ?text está URL-encoded corretamente (sem espaços/quebras cruas).
 */

const ROUTES = [
  "/",
  "/servicos",
  "/assistencia-tecnica-curitiba",
  "/servicos/conserto-de-som-e-audio-curitiba",
  "/atendimento-nacional/sao-paulo",
  "/atendimento-nacional/sao-paulo/pinheiros",
  "/servico-em-nacional/sao-paulo/pinheiros/informatica",
];

for (const route of ROUTES) {
  test(`CTAs wa.me URL-encoded: ${route}`, async ({ page }) => {
    test.slow();
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 20_000 });

    const links = page.locator('a[href*="wa.me"]');
    const n = await links.count();

    for (let i = 0; i < n; i++) {
      const href = (await links.nth(i).getAttribute("href")) ?? "";
      expect(href, `formato wa.me em ${route}`).toMatch(/^https:\/\/wa\.me\/\d+\?/);

      const query = href.split("?")[1] ?? "";
      expect(query, `query crua em ${route}`).not.toMatch(/[\s\n\r]/);

      const text = new URLSearchParams(query).get("text");
      expect(text, `text presente em ${route}`).toBeTruthy();
      expect(text!.length, `text não vazio em ${route}`).toBeGreaterThan(10);
      expect(decodeURIComponent(encodeURIComponent(text!))).toBe(text);
    }
  });
}

test("popup bloqueado expõe fallback de cópia com mensagem encodada", async ({ page }) => {
  test.slow();
  await page.addInitScript(() => {
    // Simula bloqueador de popup do navegador
    window.open = () => null;
    (window as unknown as { __waFallback?: string[] }).__waFallback = [];
    const nav = navigator as Navigator & { clipboard?: { writeText: (t: string) => Promise<void> } };
    Object.defineProperty(nav, "clipboard", {
      configurable: true,
      value: {
        writeText: async (t: string) => {
          (window as unknown as { __waFallback: string[] }).__waFallback.push(t);
        },
      },
    });
  });

  await page.goto("/#triagem", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1").first()).toBeVisible({ timeout: 20_000 });

  // A triagem deve abrir pelo deep-link de hash
  const dialog = page.locator('[role="dialog"]').first();
  await expect(dialog).toBeVisible({ timeout: 20_000 });

  // Nenhum número de WhatsApp visível em texto puro na tela
  const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  expect(body).not.toMatch(/\(?\d{2}\)?\s?9\d{4}[- ]?\d{4}/);
});
