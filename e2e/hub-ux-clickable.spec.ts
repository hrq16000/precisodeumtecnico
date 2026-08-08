import { test, expect, devices } from "@playwright/test";

/**
 * UX do hub /servicos: itens sem destino real NÃO podem parecer clicáveis.
 *
 * Regressão que este gate protege: cards informativos ganharem visual de link
 * (cursor pointer, seta, borda de hover) e levarem o usuário a clicar em algo
 * que não navega — ou pior, virarem link para rota inexistente.
 */

const VIEWPORTS = [
  { name: "mobile", viewport: devices["Pixel 5"].viewport },
  { name: "desktop", viewport: { width: 1280, height: 900 } },
];

for (const { name, viewport } of VIEWPORTS) {
  test.describe(`hub /servicos — ${name}`, () => {
    test.use({ viewport });

    test("itens sem href não parecem nem se comportam como link", async ({ page }) => {
      await page.goto("/servicos");
      await page.waitForLoadState("networkidle");

      const statics = page.locator('[data-testid="hub-service-static"]');
      const count = await statics.count();

      for (let i = 0; i < count; i++) {
        const item = statics.nth(i);
        await expect(item).toBeVisible();

        // Não é <a>, não está dentro de <a> e não tem role de link.
        const info = await item.evaluate((el) => ({
          tag: el.tagName.toLowerCase(),
          insideAnchor: Boolean(el.closest("a")),
          role: el.getAttribute("role"),
          cursor: getComputedStyle(el).cursor,
          tabindex: el.getAttribute("tabindex"),
        }));

        expect(info.tag).not.toBe("a");
        expect(info.insideAnchor).toBe(false);
        expect(info.role).not.toBe("link");
        expect(info.cursor).not.toBe("pointer");
        expect(info.tabindex).toBeNull();
      }
    });

    test("itens clicáveis têm destino real e navegam sem 404", async ({ page }) => {
      await page.goto("/servicos");
      await page.waitForLoadState("networkidle");

      const links = page.locator('[data-testid="hub-service-link"]');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);

      const hrefs: string[] = [];
      for (let i = 0; i < count; i++) {
        const href = await links.nth(i).getAttribute("href");
        expect(href, "card clicável sem href").toBeTruthy();
        expect(href!.startsWith("/")).toBe(true);
        if (!hrefs.includes(href!)) hrefs.push(href!);
      }

      for (const href of hrefs) {
        await page.goto(href);
        await page.waitForLoadState("domcontentloaded");
        await expect(page.locator('[data-testid="not-found"]')).toHaveCount(0);
      }
    });

    test("cluster prioritário de informática está presente no hub", async ({ page }) => {
      await page.goto("/servicos");
      await expect(page.locator("#cluster-informatica")).toBeVisible();
      await expect(page.locator('a[href="/assistencia-tecnica-curitiba"]').first()).toBeVisible();
      await expect(page.locator('a[href="/guia-tecnico-informatica"]').first()).toBeVisible();
    });
  });
}
