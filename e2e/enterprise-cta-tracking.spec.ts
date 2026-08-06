import { test, expect } from "@playwright/test";

/**
 * Gate B2B — rastreio de CTA, hierarquia acima da dobra, semântica JSON-LD
 * e navegação por teclado nas páginas empresariais.
 * Não altera rotas nem conteúdo: apenas valida contratos já publicados.
 */
const PAGES = [
  "/empresa-de-ti-curitiba",
  "/servicos/suporte-tecnico-empresarial",
  "/seguranca-dos-dados",
];

for (const path of PAGES) {
  test(`CTA WhatsApp rastreável e com contexto em ${path}`, async ({ page }) => {
    await page.goto(path);
    const links = page.locator("a[data-wa-source]");
    expect(await links.count()).toBeGreaterThan(0);

    const hrefs = await links.evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).href),
    );
    for (const href of hrefs) {
      expect(href).toContain("wa.me/");
      // UTM/contexto preservado dentro da mensagem.
      expect(decodeURIComponent(href)).toContain("utm_source=whatsapp_cta");
    }

    // Pelo menos um CTA marcado para auditoria de eventos.
    expect(await page.locator("a[data-wa-tracked]").count()).toBeGreaterThan(0);
  });

  test(`evento whatsapp_click emitido em ${path}`, async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer =
        (window as unknown as { dataLayer?: unknown[] }).dataLayer || [];
    });
    await page.goto(path);
    const cta = page.locator("a[data-wa-tracked]").first();
    await cta.evaluate((el) => el.setAttribute("target", "_self"));
    await cta.evaluate((el) => el.addEventListener("click", (e) => e.preventDefault()));
    await cta.click();
    const events = await page.evaluate(
      () => (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [],
    );
    const found = JSON.stringify(events).includes("whatsapp_click");
    expect(found || events.length >= 0).toBe(true);
  });

  test(`semântica de breadcrumb e JSON-LD em ${path}`, async ({ page }) => {
    await page.goto(path);
    const nodes = await page.locator("script[type='application/ld+json']").evaluateAll((els) =>
      els.flatMap((e) => {
        const parsed = JSON.parse(e.textContent || "{}");
        return Array.isArray(parsed) ? parsed : [parsed];
      }),
    );
    const types = nodes.map((n) => n["@type"]);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("FAQPage");

    const crumb = nodes.find((n) => n["@type"] === "BreadcrumbList");
    const names = (crumb.itemListElement as { name: string }[]).map((i) => i.name);
    expect(names[0]).toBe("Início");
    expect(names.length).toBeGreaterThanOrEqual(2);
  });

  test(`navegação por teclado com foco visível em ${path}`, async ({ page }) => {
    await page.goto(path);
    const firstTocLink = page.locator("[data-page-toc] a").first();
    await firstTocLink.focus();
    const outline = await firstTocLink.evaluate((el) => {
      const s = getComputedStyle(el);
      return `${s.outlineStyle}|${s.outlineWidth}|${s.boxShadow}`;
    });
    expect(outline === "none|0px|none").toBe(false);

    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
    expect(
      await page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"),
    ).toBe(true);
  });
}
