import { test, expect } from "@playwright/test";

/**
 * Regressão de conversão/responsividade: CTA de WhatsApp na primeira dobra,
 * banner de cookies sem sobreposição e âncoras do sumário navegáveis.
 */
const WIDTHS = [360, 390, 430, 1366, 1440];

for (const width of WIDTHS) {
  test.describe(`viewport ${width}px`, () => {
    test.use({ viewport: { width, height: width < 1000 ? 780 : 900 } });

    test("CTA principal da home fica na primeira dobra", async ({ page }) => {
      await page.goto("/");
      const cta = page.locator('[data-cta-label="hero_whatsapp"]').first();
      await expect(cta).toBeVisible();
      const box = await cta.boundingBox();
      const vh = page.viewportSize()!.height;
      expect(box).not.toBeNull();
      expect(box!.y + box!.height).toBeLessThanOrEqual(vh);
    });

    test("banner de cookies não cobre o CTA principal", async ({ page }) => {
      await page.goto("/");
      const banner = page.locator("[data-cookie-banner-root]").first();
      if ((await banner.count()) === 0 || !(await banner.isVisible())) return;
      const bannerBox = await banner.boundingBox();
      const ctaBox = await page.locator('[data-cta-label="hero_whatsapp"]').first().boundingBox();
      if (!bannerBox || !ctaBox) return;
      const overlaps =
        ctaBox.y < bannerBox.y + bannerBox.height && ctaBox.y + ctaBox.height > bannerBox.y;
      expect(overlaps).toBeFalsy();
    });

    test("sumário de preços leva às âncoras", async ({ page }) => {
      await page.goto("/precos");
      const toc = page.locator("[data-page-toc] a").first();
      if ((await toc.count()) === 0) return;
      const href = await toc.getAttribute("href");
      expect(href).toBeTruthy();
      const id = href!.replace("#", "");
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    });
  });
}
