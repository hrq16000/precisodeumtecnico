import { test, expect, devices } from "@playwright/test";

/**
 * /publicidade → /anuncie: valida canonical, og:url, og:image e twitter:image
 * self-referentes e absolutos, em mobile e desktop.
 */
const VIEWPORTS = [
  { name: "mobile", viewport: devices["Pixel 5"].viewport },
  { name: "desktop", viewport: { width: 1280, height: 900 } },
];

for (const { name, viewport } of VIEWPORTS) {
  test.describe(`anuncie · social meta · ${name}`, () => {
    test.use({ viewport });

    test("canonical e og:url self-referentes após redirect de /publicidade", async ({ page }) => {
      await page.goto("/publicidade");
      await expect(page).toHaveURL(/\/anuncie$/);
      await page.waitForLoadState("networkidle");

      const canonicals = page.locator('link[rel="canonical"]');
      expect(await canonicals.count(), "canonical único").toBe(1);
      const canonical = await canonicals.first().getAttribute("href");
      expect(canonical).toBe("https://precisodeumtecnico.com/anuncie");

      const ogUrl = await page
        .locator('meta[property="og:url"]')
        .first()
        .getAttribute("content");
      expect(ogUrl).toBe("https://precisodeumtecnico.com/anuncie");

      const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
      const tw = await page.locator('meta[name="twitter:image"]').first().getAttribute("content");
      expect(og).toMatch(/^https:\/\//);
      expect(tw).toMatch(/^https:\/\//);
    });
  });
}
