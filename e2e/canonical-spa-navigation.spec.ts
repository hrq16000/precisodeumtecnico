import { test, expect } from "@playwright/test";

/**
 * Rodada 25.1 · B.3.a — Canonical em navegação SPA.
 *
 * Contrato:
 *  - rotas indexáveis: exatamente 1 <link rel="canonical">, com href igual à URL absoluta da rota;
 *  - após navegação SPA (sem reload), o canonical anterior deve ter sido substituído;
 *  - combinações inválidas de /atendimento-nacional/* apontam para /atendimento-nacional (fallback noindex);
 *  - back/forward preservam o canonical correto de cada estado do histórico.
 */

const BASE = "https://precisodeumtecnico.com";

async function readCanonicals(page: import("@playwright/test").Page) {
  return page.$$eval('link[rel="canonical"]', (els) => els.map((e) => (e as HTMLLinkElement).href));
}

async function expectSingleCanonical(page: import("@playwright/test").Page, expected: string) {
  await expect.poll(async () => (await readCanonicals(page)).length, { timeout: 5000 }).toBe(1);
  await expect.poll(async () => (await readCanonicals(page))[0], { timeout: 5000 }).toBe(expected);
}

test.describe("Canonical SPA navigation", () => {
  test("/servicos direto: 1 canonical apontando para /servicos", async ({ page }) => {
    await page.goto("/servicos");
    await expectSingleCanonical(page, `${BASE}/servicos`);
  });

  test("SPA: home → /servicos substitui canonical", async ({ page }) => {
    await page.goto("/");
    await expectSingleCanonical(page, `${BASE}/`);
    await page.evaluate(() => window.history.pushState({}, "", "/servicos"));
    // Navegação real via link — clique interno
    await page.goto("/");
    await page.getByRole("link", { name: /Serviços/i }).first().click();
    await page.waitForURL("**/servicos");
    await expectSingleCanonical(page, `${BASE}/servicos`);
  });

  test("SPA: /servicos → /sobre substitui canonical", async ({ page }) => {
    await page.goto("/servicos");
    await expectSingleCanonical(page, `${BASE}/servicos`);
    await page.getByRole("link", { name: /^Sobre$/i }).first().click();
    await page.waitForURL("**/sobre");
    await expectSingleCanonical(page, `${BASE}/sobre`);
  });

  test("Combinação inválida de /atendimento-nacional aponta para /atendimento-nacional", async ({ page }) => {
    await page.goto("/atendimento-nacional/xxx-invalido/yyy-invalido/informatica");
    // fallback deve emitir canonical apontando para o hub
    await expectSingleCanonical(page, `${BASE}/atendimento-nacional`);
    // e não deve manter canonical de outra rota
    const canonicals = await readCanonicals(page);
    expect(canonicals).toHaveLength(1);
  });

  test("Back/forward preserva canonical correspondente", async ({ page }) => {
    await page.goto("/servicos");
    await expectSingleCanonical(page, `${BASE}/servicos`);
    await page.goto("/sobre");
    await expectSingleCanonical(page, `${BASE}/sobre`);
    await page.goBack();
    await expectSingleCanonical(page, `${BASE}/servicos`);
    await page.goForward();
    await expectSingleCanonical(page, `${BASE}/sobre`);
  });
});
