import { test, expect } from "@playwright/test";

test.describe("/busca — busca interna", () => {
  test("filtra por bairro + serviço e leva a página existente", async ({ page }) => {
    await page.goto("/busca");
    await page.fill("[data-testid=busca-input]", "wifi batel");
    await page.waitForTimeout(800);
    const first = page.locator("[data-testid=busca-results] a").first();
    await expect(first).toBeVisible();
    const href = await first.getAttribute("href");
    expect(href).toBe("/servicos/configuracao-wifi/curitiba/batel");
    await first.click();
    await expect(page.locator("h1")).toContainText("Wi-Fi");
  });

  test("WhatsApp leva os filtros exatos da busca", async ({ page }) => {
    await page.goto("/busca?q=notebook");
    await page.fill("[data-testid=busca-input]", "notebook");
    const href = await page.locator("a[data-testid=busca-whatsapp]").getAttribute("href");
    expect(decodeURIComponent(href ?? "")).toContain("Busca: notebook");
    expect(decodeURIComponent(href ?? "")).toContain("Filtro: Tudo");
  });

  test("expõe SearchAction e breadcrumbs", async ({ page }) => {
    await page.goto("/busca");
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]')).some((e) =>
        (e.textContent || "").includes("BreadcrumbList"),
      ),
    );
    const types = await page.$$eval('script[type="application/ld+json"]', (els) =>
      els.map((e) => JSON.parse(e.textContent || "{}")["@type"]),
    );
    expect(types).toContain("WebSite");
    expect(types).toContain("BreadcrumbList");
    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    expect(canonical).toBe("https://precisodeumtecnico.com/busca");
  });

  test("estado vazio oferece caminhos acessíveis", async ({ page }) => {
    await page.goto("/busca");
    await page.fill("[data-testid=busca-input]", "zzzzqqq");
    await expect(page.locator("[data-testid=busca-empty]")).toBeVisible();
  });
});
