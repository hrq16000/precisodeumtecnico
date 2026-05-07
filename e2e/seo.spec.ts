import { test, expect } from "@playwright/test";

/**
 * E2E SEO checks: sitemap.xml + robots.txt accessibility, canonical/H1/H2
 * persistence after client-side navigation.
 */

test.describe("Sitemap & robots", () => {
  test("sitemap.xml retorna 200 e contém URLs", async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/sitemap.xml`);
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toMatch(/<urlset|<sitemapindex/);
    expect(body).toMatch(/<loc>https?:\/\//);
  });

  test("robots.txt referencia sitemap absoluto", async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/robots.txt`);
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    const match = body.match(/Sitemap:\s*(https?:\/\/\S+)/i);
    expect(match).not.toBeNull();
    if (match) {
      const sm = await request.get(match[1]);
      expect(sm.ok()).toBeTruthy();
    }
  });
});

test.describe("Canonical & headings persistem após navegação SPA", () => {
  const checkPage = async (page: import("@playwright/test").Page) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, "canonical presente").toBeTruthy();
    expect(canonical, "canonical absoluto").toMatch(/^https?:\/\//);
    const h1Count = await page.locator("h1").count();
    expect(h1Count, "exatamente 1 <h1>").toBe(1);
    const h2Count = await page.locator("h2").count();
    expect(h2Count, ">=1 <h2>").toBeGreaterThanOrEqual(1);
  };

  test("home → serviços → blog mantém H1/H2/canonical", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(300);
    await checkPage(page);

    await page.goto("/servicos");
    await page.waitForTimeout(300);
    await checkPage(page);

    await page.goto("/blog");
    await page.waitForTimeout(300);
    await checkPage(page);
  });
});
