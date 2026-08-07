import { test, expect } from "@playwright/test";

// Rodada 32.2 — mídia real: formatos modernos, srcset responsivo e créditos.
test.describe("Fotos públicas · formatos e créditos", () => {
  test("faixa de fotos entrega AVIF/WebP com srcset e dimensões", async ({ page }) => {
    await page.goto("/regioes/curitiba/batel");
    const img = page.locator('img[src^="/photos/"]').first();
    await expect(img).toHaveAttribute("srcset", /-400\.jpg 400w/);
    await expect(img).toHaveAttribute("sizes", /vw/);
    await expect(img).toHaveAttribute("width", /\d+/);
    await expect(img).toHaveAttribute("height", /\d+/);
    await expect(img).toHaveAttribute("loading", "lazy");

    const avif = page.locator('source[type="image/avif"]').first();
    await expect(avif).toHaveAttribute("srcset", /\.avif 400w/);
    const webp = page.locator('source[type="image/webp"][srcset*="/photos/"]').first();
    await expect(webp).toHaveAttribute("srcset", /\.webp 400w/);
  });

  test("página de créditos lista todas as fotos com licença e fonte", async ({ page }) => {
    await page.goto("/creditos-de-imagens");
    await expect(page.locator("h1")).toHaveText(/Créditos de imagens/i);

    const figures = page.locator("figure");
    const count = await figures.count();
    expect(count).toBeGreaterThanOrEqual(13);

    for (let i = 0; i < count; i++) {
      const fig = figures.nth(i);
      await expect(fig.getByRole("link", { name: "Ver arquivo original" })).toHaveAttribute(
        "href",
        /wikimedia\.org|wikipedia\.org/,
      );
    }
  });

  test("rodapé aponta para os créditos em qualquer página", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "Créditos de imagens" });
    await expect(link).toHaveAttribute("href", "/creditos-de-imagens");
  });
});
