import { test, expect } from "@playwright/test";

// Rodada 33 — Geo status no hero + fechamento do menu desktop ao clicar fora.
test.describe("hero geo status e menu desktop", () => {
  test("chip de localização mostra Detectado/Confirmado", async ({ page }) => {
    await page.goto("/");
    const chip = page.getByTestId("geo-status-chip");
    await expect(chip).toBeVisible();
    await expect
      .poll(async () => chip.getAttribute("data-geo-status"), { timeout: 10_000 })
      .not.toBe("loading");
    await expect(chip).toContainText(/Detectado|Confirmado/);
  });

  test("geo_city_autofill_ip dispara no máximo uma vez por sessão", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer =
        (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
    });
    await page.goto("/");
    await page.getByTestId("geo-status-chip").waitFor();
    await page.waitForTimeout(1500);
    // navegação SPA + volta não pode duplicar o evento
    await page.getByRole("link", { name: /Preços/i }).first().click().catch(() => {});
    await page.waitForTimeout(500);
    await page.goBack();
    await page.waitForTimeout(1500);
    const count = await page.evaluate(() => {
      const dl = (window as unknown as { dataLayer?: Array<{ event?: string }> }).dataLayer ?? [];
      return dl.filter((e) => e && e.event === "geo_city_autofill_ip").length;
    });
    expect(count).toBeLessThanOrEqual(1);
  });

  test("menu desktop fecha ao clicar fora", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /Serviços/i }).first();
    if ((await trigger.count()) === 0) test.skip();
    await trigger.click();
    await expect.poll(async () => page.locator('[data-state="open"]').count()).toBeGreaterThan(0);
    await page.mouse.click(700, 900);
    await expect.poll(async () => page.locator('[data-state="open"]').count()).toBe(0);
  });
});
