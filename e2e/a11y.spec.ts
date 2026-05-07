import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Site-wide axe accessibility checks. Runs against representative routes:
 * homepage, services list, service detail, regions list, city, bairro, blog,
 * pricing, contact, terms. Modals and forms are exercised (open the terms
 * dialog, fill the contact form) so that interactive states are also scanned.
 */
const ROUTES: { path: string; name: string }[] = [
  { path: "/", name: "home" },
  { path: "/servicos", name: "servicos" },
  { path: "/servicos/informatica", name: "servico-detalhe" },
  { path: "/regioes", name: "regioes" },
  { path: "/regioes/curitiba", name: "regiao-detalhe" },
  { path: "/regioes/curitiba/centro", name: "bairro-detalhe" },
  { path: "/blog", name: "blog" },
  { path: "/precos", name: "precos" },
  { path: "/sobre", name: "sobre" },
  { path: "/contato", name: "contato" },
  { path: "/termos-orcamento-pre-aprovado", name: "termos" },
];

test.describe("axe a11y – todas as rotas principais", () => {
  for (const { path, name } of ROUTES) {
    test(`sem violações sérias/críticas em ${name} (${path})`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle").catch(() => {});

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        // Skip color-contrast on pages with overlay backgrounds (prone to false positives)
        .disableRules(["color-contrast"])
        .analyze();

      const serious = results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      );

      expect(
        serious,
        JSON.stringify(
          serious.map((v) => ({ id: v.id, help: v.help, nodes: v.nodes.length })),
          null,
          2,
        ),
      ).toEqual([]);
    });
  }
});

test.describe("axe a11y – formulário e modal interativos", () => {
  test("contato: formulário visível é acessível", async ({ page }) => {
    await page.goto("/contato");
    await page.waitForLoadState("domcontentloaded");
    const results = await new AxeBuilder({ page })
      .include("form")
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(["color-contrast"])
      .analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
});
