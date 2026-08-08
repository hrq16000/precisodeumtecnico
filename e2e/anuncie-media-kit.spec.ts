import { test, expect, devices } from "@playwright/test";

/**
 * Contrato comercial de /anuncie (alias /patrocinadores e /publicidade):
 * - metadados sociais (og:image / twitter:image) presentes e absolutos
 * - mídia kit em PDF baixável (página e rodapé)
 * - formulário de proposta funcional em mobile e desktop
 */

const VIEWPORTS = [
  { name: "mobile", viewport: devices["Pixel 5"].viewport },
  { name: "desktop", viewport: { width: 1280, height: 900 } },
];

for (const { name, viewport } of VIEWPORTS) {
  test.describe(`anuncie · ${name}`, () => {
    test.use({ viewport });

    test("og:image e twitter:image presentes e absolutos", async ({ page }) => {
      await page.goto("/patrocinadores");
      await expect(page).toHaveURL(/\/anuncie$/);

      const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
      const tw = await page
        .locator('meta[name="twitter:image"]')
        .first()
        .getAttribute("content");

      expect(og).toBeTruthy();
      expect(tw).toBeTruthy();
      expect(og!).toMatch(/^https:\/\//);
      expect(tw!).toMatch(/^https:\/\//);

      const res = await page.request.get(og!);
      expect(res.status()).toBeLessThan(400);
    });

    test("download do mídia kit responde como PDF", async ({ page }) => {
      await page.goto("/anuncie");
      const link = page.getByTestId("media-kit-download");
      await expect(link).toBeVisible();
      const href = await link.getAttribute("href");
      expect(href).toBe("/midia-kit.pdf");

      const res = await page.request.get(href!);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"] ?? "").toContain("pdf");
    });

    test("link do mídia kit no rodapé aponta para o mesmo PDF", async ({ page }) => {
      await page.goto("/anuncie");
      const footerLink = page.getByTestId("media-kit-download-footer");
      await expect(footerLink).toHaveAttribute("href", "/midia-kit.pdf");
    });

    test("formulário de proposta valida campos obrigatórios", async ({ page }) => {
      await page.goto("/anuncie#proposta");
      const submit = page.getByRole("button", { name: /Enviar por WhatsApp/i });
      await expect(submit).toBeDisabled();

      await page.getByLabel(/Segmento do anunciante/i).fill("Loja de peças");
      await page.getByLabel(/Cidade e\/ou bairro/i).fill("Curitiba - Batel");
      await expect(submit).toBeEnabled();
    });

    test("quadro de disponibilidade lista territórios", async ({ page }) => {
      await page.goto("/anuncie");
      await expect(page.getByRole("heading", { name: /Disponibilidade por cidade e bairro/i })).toBeVisible();
      await expect(page.getByRole("rowheader", { name: /Curitiba \(por bairro\)/i })).toBeVisible();
    });
  });
}
