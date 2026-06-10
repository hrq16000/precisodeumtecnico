import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 },
];

/**
 * Layout guard: the H1 on /assistencia-tecnica-curitiba must wrap without
 * overflowing horizontally on mobile or desktop. Catches regressions when
 * SEO copy changes push the heading wider than its container.
 */
for (const vp of VIEWPORTS) {
  test(`H1 fits without overflow @ ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/assistencia-tecnica-curitiba");
    await page.waitForLoadState("networkidle");

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();

    const box = await h1.boundingBox();
    expect(box, "h1 has bounding box").not.toBeNull();
    if (!box) return;

    // Must not exceed viewport width (no horizontal scroll caused by H1)
    expect(box.width).toBeLessThanOrEqual(vp.width);

    // Detect ugly clipping: scrollWidth must equal clientWidth (no overflow).
    const overflow = await h1.evaluate((el) => ({
      scroll: (el as HTMLElement).scrollWidth,
      client: (el as HTMLElement).clientWidth,
    }));
    expect(overflow.scroll, `${vp.name}: H1 scrollWidth vs clientWidth`).toBeLessThanOrEqual(
      overflow.client + 1,
    );

    // Page itself must not horizontally overflow
    const bodyOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(bodyOverflow, `${vp.name}: no horizontal page overflow`).toBeLessThanOrEqual(1);
  });
}
