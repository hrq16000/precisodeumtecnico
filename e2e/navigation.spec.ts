import { test, expect } from "@playwright/test";

/**
 * E2E tests for SPA navigation, scroll-to-top, hash anchors, and back/forward.
 * Run with: bun run e2e (requires `bunx playwright install chromium` once).
 */

test.describe("Navegação interna", () => {
  test("home → serviços → detalhe → voltar", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/técnico|preciso/i);

    await page.getByRole("link", { name: /serviços/i }).first().click();
    await page.waitForURL(/\/servicos/);
    await expect(page.locator("h1")).toBeVisible();

    // Click first service card link.
    const firstService = page.locator('a[href^="/servicos/"]').first();
    await firstService.click();
    await page.waitForURL(/\/servicos\/[^/]+$/);
    await expect(page.locator("h1")).toBeVisible();

    await page.goBack();
    await page.waitForURL(/\/servicos\/?$/);
  });
});

test.describe("Rolagem ao topo em navegação", () => {
  test("scroll volta ao topo ao trocar de rota", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(400);

    await page.getByRole("link", { name: /serviços/i }).first().click();
    await page.waitForURL(/\/servicos/);
    // Allow smooth scroll to settle.
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });
});

test.describe("Âncoras #hash", () => {
  test("rolagem por âncora dentro da página", async ({ page }) => {
    await page.goto("/");
    // Inject a sentinel anchor far down to ensure deterministic test.
    await page.evaluate(() => {
      const div = document.createElement("div");
      div.id = "e2e-sentinel";
      div.style.marginTop = "3000px";
      div.style.height = "100px";
      div.textContent = "sentinel";
      document.body.appendChild(div);
    });
    await page.evaluate(() => { window.location.hash = "e2e-sentinel"; });
    await page.waitForTimeout(500);
    const y = await page.evaluate(() => {
      const el = document.getElementById("e2e-sentinel");
      return el ? el.getBoundingClientRect().top : 9999;
    });
    expect(Math.abs(y)).toBeLessThan(150);
  });
});

test.describe("Back / Forward", () => {
  test("posição de scroll é restaurada ao voltar", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(200);

    await page.goto("/servicos");
    await page.waitForTimeout(400);

    await page.goBack();
    await page.waitForTimeout(600);
    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeGreaterThan(300);
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
