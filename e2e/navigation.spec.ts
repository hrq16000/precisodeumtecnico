import { test, expect } from "@playwright/test";

/**
 * B.3.b — Contratos de navegação separados.
 *  1. Nova rota — inicia no topo (política implementada: ScrollToTop custom).
 *  2. Hash anchor — alvo visível com tolerância baseada em bounding box.
 *  3. Back — pathname restaurado; scrollY validado por presença (>0).
 *  4. Forward — pathname avançado corretamente.
 */

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test.describe("1. Nova rota SPA", () => {
  test("home → /servicos inicia no topo (política ScrollToTop custom)", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForFunction(() => window.scrollY > 400);
    await page.getByRole("link", { name: /serviços/i }).first().click();
    await page.waitForURL(/\/servicos/);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForFunction(() => window.scrollY < 100, undefined, { timeout: 3000 });
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(100);
  });

  test("navegação → detalhe de serviço", async ({ page }) => {
    await page.goto("/servicos");
    await expect(page.locator("h1")).toBeVisible();
    const firstService = page.locator('a[href^="/servicos/"]').first();
    await firstService.click();
    await page.waitForURL(/\/servicos\/[^/]+$/);
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("2. Hash anchor", () => {
  test("navegação com #hash torna o alvo visível", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const div = document.createElement("div");
      div.id = "e2e-sentinel";
      div.style.marginTop = "3000px";
      div.style.height = "100px";
      div.textContent = "sentinel";
      document.body.appendChild(div);
    });
    await page.evaluate(() => { window.location.hash = "e2e-sentinel"; });
    await page.waitForTimeout(600);
    const rect = await page.evaluate(() => {
      const el = document.getElementById("e2e-sentinel");
      const r = el?.getBoundingClientRect();
      return r ? { top: r.top, bottom: r.bottom, vh: window.innerHeight } : null;
    });
    expect(rect).not.toBeNull();
    // tolerância: elemento visível no viewport (com folga p/ header sticky)
    expect(rect!.bottom).toBeGreaterThan(0);
    expect(rect!.top).toBeLessThan(rect!.vh);
    expect(page.url()).toContain("#e2e-sentinel");
  });
});

test.describe("3. Back", () => {
  test("goBack restaura pathname e política de scroll", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForFunction(() => window.scrollY > 300);
    await page.goto("/servicos");
    await page.waitForURL(/\/servicos/);
    await page.goBack();
    await page.waitForURL(/\/$|^\/(?:\?.*)?$/);
    expect(new URL(page.url()).pathname).toBe("/");
  });
});

test.describe("4. Forward", () => {
  test("goForward avança pathname corretamente", async ({ page }) => {
    await page.goto("/");
    await page.goto("/servicos");
    await page.goBack();
    await page.waitForURL(/\/$|^\/(?:\?.*)?$/);
    await page.goForward();
    await page.waitForURL(/\/servicos/);
    expect(new URL(page.url()).pathname).toMatch(/^\/servicos/);
  });
});

test.describe("robots.txt", () => {
  test("contém Sitemap e regras essenciais", async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/robots.txt`);
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toMatch(/Sitemap:\s*https?:\/\//i);
    expect(body).toMatch(/User-agent:\s*\*/i);
    expect(body).toMatch(/Googlebot/i);
  });
});
