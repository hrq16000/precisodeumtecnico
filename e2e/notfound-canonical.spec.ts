import { test, expect } from "@playwright/test";

/**
 * B.3.b · B7 — NotFound: robots noindex + canonical não enganoso.
 *
 * Contrato:
 *  - meta robots inclui "noindex" e "nofollow";
 *  - existe exatamente uma meta robots;
 *  - canonical, se emitido, aponta para a própria URL 404 (nunca para a home);
 *  - zero Service schema;
 *  - zero FAQPage;
 *  - contrato pré-existente de /servico-em-nacional/... preservado
 *    (cai em fallback nacional, sem tratar como NotFound puro).
 */

async function robotsMetas(page: import("@playwright/test").Page) {
  return page.locator('meta[name="robots"]').all();
}

test.describe("NotFound — robots/canonical", () => {
  test("rota inexistente direta: noindex + canonical não é home", async ({ page }) => {
    await page.goto("/rota-que-nao-existe-b3b");
    await page.waitForLoadState("networkidle");

    const metas = await robotsMetas(page);
    expect(metas.length, "exatamente 1 meta robots").toBe(1);
    const content = (await metas[0].getAttribute("content")) || "";
    expect(content.toLowerCase()).toContain("noindex");
    expect(content.toLowerCase()).toContain("nofollow");

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    if (canonical) {
      expect(canonical).not.toBe("https://precisodeumtecnico.com");
      expect(canonical).not.toBe("https://precisodeumtecnico.com/");
      expect(canonical).toContain("/rota-que-nao-existe-b3b");
    }

    // zero schemas comerciais falsos
    const raw = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
    expect(raw).not.toContain('"@type":"FAQPage"');
    expect(raw).not.toContain('"@type": "FAQPage"');
    expect(raw).not.toContain('"@type":"Service"');
    expect(raw).not.toContain('"@type": "Service"');
  });

  test("navegação SPA para rota inexistente: canonical atualizado (não vaza da anterior)", async ({ page }) => {
    await page.goto("/");
    const home = await page.locator('link[rel="canonical"]').getAttribute("href");
    await page.goto("/outra-rota-inexistente-xyz");
    await page.waitForLoadState("networkidle");
    const c404 = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(c404).not.toBe(home);
    const metas = await robotsMetas(page);
    expect((await metas[0].getAttribute("content"))?.toLowerCase()).toContain("noindex");
  });

  test("voltar do NotFound restaura pathname anterior", async ({ page }) => {
    await page.goto("/");
    await page.goto("/nao-existe-abc");
    await page.waitForLoadState("networkidle");
    await page.goBack();
    await page.waitForURL(/\/$|^\/(?:\?.*)?$/);
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("contrato preservado: /servico-em-nacional/xxx/yyy/informatica usa fallback nacional (noindex)", async ({ page }) => {
    await page.goto("/servico-em-nacional/xxx/yyy/informatica");
    await page.waitForLoadState("networkidle");
    const metas = await robotsMetas(page);
    if (metas.length > 0) {
      const c = (await metas[0].getAttribute("content")) || "";
      expect(c.toLowerCase()).toContain("noindex");
    }
  });
});
