import { test, expect } from "@playwright/test";

/**
 * Contrato de atributos de rastreio nas páginas de bairro nacional
 * `/atendimento-nacional/:city/:bairro`:
 *   - Todo CTA de WhatsApp deve carregar `data-wa-source`, `data-service`
 *     e `data-neighborhood` (além de `data-city` quando existir).
 *   - Cobertura em amostra representativa (SP + RJ + BH), garantindo que
 *     o tracking sobrevive a mudanças de layout/copy.
 */
const samples = [
  { city: "sao-paulo", bairro: "pinheiros" },
  { city: "rio-de-janeiro", bairro: "copacabana" },
  { city: "belo-horizonte", bairro: "savassi" },
];

for (const { city, bairro } of samples) {
  test(`/atendimento-nacional/${city}/${bairro} → CTAs carregam data-wa-source/data-service/data-neighborhood`, async ({ page }) => {
    await page.goto(`/atendimento-nacional/${city}/${bairro}`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();

    const ctas = page.locator("a[data-wa-source]");
    const count = await ctas.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const el = ctas.nth(i);
      await expect(el).toHaveAttribute("data-wa-source", /.+/);
      await expect(el).toHaveAttribute("data-service", /.+/);
      await expect(el).toHaveAttribute("data-neighborhood", /.+/);
      // href sempre para WhatsApp
      const href = await el.getAttribute("href");
      expect(href).toMatch(/^https?:\/\/(wa\.me|api\.whatsapp\.com)/);
    }
  });
}
