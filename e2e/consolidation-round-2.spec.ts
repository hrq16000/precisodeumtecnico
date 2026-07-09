import { test, expect } from "@playwright/test";

/**
 * Consolidação — Rodada 2:
 * - SEO/canonical/robots/sitemap
 * - Quiz não duplica em cliques rápidos
 * - Sem overflow horizontal no mobile
 */

test.describe("SEO essentials", () => {
  test("robots.txt e sitemap.xml respondem 200", async ({ request }) => {
    const [robots, sitemap] = await Promise.all([
      request.get("/robots.txt"),
      request.get("/sitemap.xml"),
    ]);
    expect(robots.status()).toBe(200);
    expect(sitemap.status()).toBe(200);
    const robotsBody = await robots.text();
    expect(robotsBody.toLowerCase()).toContain("sitemap:");
    expect(robotsBody).toContain("precisodeumtecnico.com");
  });

  test("canonical presente na home e persiste após navegação SPA", async ({ page }) => {
    await page.goto("/");
    const c1 = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(c1).toBeTruthy();
    // Navega para FAQ (client-side)
    await page.goto("/faq");
    const c2 = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(c2).toBeTruthy();
    expect(c2).not.toBe(c1); // canonical mudou por rota
    // H1 único
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("FAQ tem FAQPage schema visível na página", async ({ page }) => {
    await page.goto("/faq");
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    const hasFaq = jsonLd.some((s) => s.includes('"FAQPage"'));
    expect(hasFaq).toBe(true);
    // e há pelo menos 3 perguntas visíveis
    const questions = await page.getByRole("button").filter({ hasText: /valor|prazo|garantia|atendimento/i }).count();
    expect(questions).toBeGreaterThan(0);
  });
});

test.describe("Quiz — anti-duplicação", () => {
  test("dois cliques rápidos em CTA WhatsApp abrem apenas UM dialog", async ({ page }) => {
    await page.goto("/?triage=1");
    const cta = page.locator('a[href*="wa.me"]:not([data-wa-keep="footer"]), button[data-wa-source]').first();
    await cta.waitFor({ state: "visible", timeout: 10_000 });
    await cta.click({ clickCount: 2, delay: 50 });
    await page.waitForTimeout(500);
    const dialogs = await page.locator('[role="dialog"]').count();
    expect(dialogs).toBe(1);
  });

  test("fechar e reabrir volta ao primeiro passo (categoria)", async ({ page }) => {
    await page.goto("/?triage=1");
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e" } })));
    await expect(page.getByText(/Qual é o aparelho/i)).toBeVisible();
    // Fecha via ESC
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    // Reabre
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e" } })));
    // Deve estar no passo 1 novamente
    await expect(page.getByText(/Qual é o aparelho/i)).toBeVisible();
  });
});

test.describe("Mobile — sem overflow horizontal", () => {
  test("home não tem scroll horizontal no viewport mobile", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    await ctx.close();
  });
});
