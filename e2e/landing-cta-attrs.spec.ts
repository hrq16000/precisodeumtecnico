import { test, expect } from "@playwright/test";

/**
 * Rodada 7 — Cobertura E2E para as landings AssistenciaTecnica / Curitiba.
 * Valida data-wa-source/data-service nos CTAs wa.me dentro do <main> e
 * (para Curitiba) data-city="Curitiba". Também confirma que o helper
 * buildWhatsAppUrl injetou parâmetros de contexto no ?text=.
 */

function decodeText(href: string) {
  return decodeURIComponent(new URL(href).searchParams.get("text") || "");
}

const CASES = [
  { path: "/assistencia-tecnica", city: undefined as string | undefined },
  { path: "/assistencia-tecnica-curitiba", city: "Curitiba" },
];

for (const { path, city } of CASES) {
  test(`landing CTAs — ${path} — data-wa-source + contexto`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    const anchors = page.locator('main a[href*="wa.me"]');
    await anchors.first().waitFor({ state: "attached", timeout: 15000 });
    const count = await anchors.count();
    expect(count, "CTAs presentes em <main>").toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const a = anchors.nth(i);
      await expect(a, `CTA #${i} data-wa-source`).toHaveAttribute(
        "data-wa-source",
        /.+/,
      );
      await expect(a, `CTA #${i} data-service`).toHaveAttribute(
        "data-service",
        /.+/,
      );
      const href = await a.getAttribute("href");
      const text = decodeText(href!);
      expect(text.length, `CTA #${i} tem contexto (${href})`).toBeGreaterThan(10);
    }

    if (city) {
      // Pelo menos 1 CTA da landing precisa carregar data-city do contexto.
      const withCity = page.locator(`main a[href*="wa.me"][data-city="${city}"]`);
      expect(await withCity.count(), `CTA com data-city=${city}`).toBeGreaterThan(0);
    }
  });
}

test("landings: helper buildWhatsAppUrl injeta service no ?text=", async ({ page }) => {
  await page.goto("/assistencia-tecnica-curitiba");
  const href = await page
    .locator('main a[href*="wa.me"]')
    .first()
    .getAttribute("href");
  const text = decodeText(href!);
  expect(text.toLowerCase()).toContain("assistência");
});
