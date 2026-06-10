import { test, expect } from "@playwright/test";

test.describe("/assistencia-tecnica — structured data & SEO basics", () => {
  test("emits LocalBusiness, BreadcrumbList, FAQPage, Service JSON-LD + single canonical/H1", async ({ page }) => {
    await page.goto("/assistencia-tecnica");
    await page.waitForLoadState("networkidle");

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);

    const types = new Set<string>();
    for (const raw of blocks) {
      const parsed = JSON.parse(raw) as { "@type"?: string };
      if (parsed["@type"]) types.add(parsed["@type"]);
    }
    for (const t of ["LocalBusiness", "BreadcrumbList", "FAQPage", "Service"]) {
      expect(types.has(t), `${t} present`).toBe(true);
    }

    const canonicals = await page.locator('link[rel="canonical"]').count();
    expect(canonicals, "single canonical").toBe(1);
    expect(await page.locator("h1").count(), "single H1").toBe(1);
  });
});
