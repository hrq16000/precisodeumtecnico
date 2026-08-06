import { test, expect, devices } from "@playwright/test";

/**
 * Rodada 3R — navegação por teclado no sumário navegável.
 *
 * Cobre as páginas empresariais e de serviço que receberam o padrão visual:
 *  - links do sumário são alcançáveis por Tab e têm foco visível;
 *  - Enter navega para a seção e move o foco para o alvo;
 *  - o alvo não fica sob o header fixo (scroll-margin-top aplicado).
 */

const PAGES = [
  "/guias/como-organizar-informatica-de-um-escritorio",
  "/empresa-de-ti-curitiba",
  "/seguranca-dos-dados",
  "/servicos/suporte-tecnico-empresarial",
  "/conserto-de-notebook-curitiba",
];

const VIEWPORTS = [
  { name: "mobile", size: devices["Pixel 5"].viewport },
  { name: "desktop", size: { width: 1280, height: 900 } },
];

for (const vp of VIEWPORTS) {
  for (const path of PAGES) {
    test(`${vp.name} ${path}: sumário navegável por teclado`, async ({ page }) => {
      await page.setViewportSize(vp.size);
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const toc = page.locator("[data-page-toc]").first();
      await toc.waitFor({ state: "attached", timeout: 15_000 });

      // No mobile o sumário é um <details>; abre pelo summary via teclado.
      const summary = toc.locator("summary:visible").first();
      if (await summary.count()) {
        await summary.focus();
        const focusedSummary = await page.evaluate(
          () => document.activeElement?.tagName.toLowerCase() ?? "",
        );
        expect(focusedSummary).toBe("summary");
        await page.keyboard.press("Enter");
      }

      const link = toc.locator("a:visible").first();
      await link.waitFor({ state: "visible" });
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^#/);
      const id = (href ?? "").slice(1);

      await link.focus();
      // Foco visível: o link focado deve expor um outline/ring (classe focus-visible).
      const cls = await link.getAttribute("class");
      expect(cls).toContain("focus-visible:ring-2");

      await page.keyboard.press("Enter");
      await page.waitForTimeout(700);

      // O foco vai para a seção-alvo
      const activeId = await page.evaluate(() => document.activeElement?.id ?? "");
      expect(activeId).toBe(id);

      // scroll-margin-top aplicado (não fica sob o header fixo)
      const margin = await page.evaluate((anchorId) => {
        const el = document.getElementById(anchorId);
        return el ? parseFloat(getComputedStyle(el).scrollMarginTop || "0") : -1;
      }, id);
      expect(margin, "alvo precisa de scroll-margin-top").toBeGreaterThanOrEqual(64);

      // Alvo visível abaixo do header
      const box = await page.locator(`#${CSS.escape(id)}`).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y).toBeGreaterThanOrEqual(0);
    });
  }
}
