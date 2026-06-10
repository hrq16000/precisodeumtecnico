import { test, expect } from "@playwright/test";

/**
 * E2E: ensure /assistencia-tecnica-curitiba renders the expected JSON-LD
 * (LocalBusiness, BreadcrumbList, FAQPage, Service) so it qualifies for
 * Google Rich Results.
 */
test.describe("/assistencia-tecnica-curitiba — structured data", () => {
  test("emits LocalBusiness, BreadcrumbList, FAQPage and Service JSON-LD", async ({ page }) => {
    await page.goto("/assistencia-tecnica-curitiba");
    await page.waitForLoadState("networkidle");

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length, "at least one JSON-LD block").toBeGreaterThan(0);

    const types = new Set<string>();
    for (const raw of blocks) {
      try {
        const parsed = JSON.parse(raw);
        const t = (parsed as { "@type"?: string })["@type"];
        if (t) types.add(t);
      } catch {
        throw new Error(`Invalid JSON-LD block: ${raw.slice(0, 120)}`);
      }
    }

    for (const required of ["LocalBusiness", "BreadcrumbList", "FAQPage", "Service"]) {
      expect(types.has(required), `${required} present`).toBe(true);
    }

    // Canonical + single H1
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/assistencia-tecnica-curitiba");
    expect(await page.locator("h1").count()).toBe(1);
  });
});
