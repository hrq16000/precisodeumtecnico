import { test, expect } from "@playwright/test";
import { getJsonLdBlocks, findByType } from "./utils/jsonld";

/**
 * Rodada 28.1 — Integridade do JSON-LD LocalBusiness.
 * Home, atendimento nacional (cidade/bairro), gestor e landing por keyword
 * precisam expor NAP, área atendida e horários consistentes.
 */
const ROUTES = [
  "/",
  "/atendimento-nacional/sao-paulo",
  "/gestor-responsavel",
  "/formatacao-de-computador-curitiba",
];

for (const route of ROUTES) {
  test(`LocalBusiness válido em ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForSelector('script[type="application/ld+json"]');

    const blocks = await getJsonLdBlocks(page);
    const lb = findByType<Record<string, unknown>>(blocks, "LocalBusiness");
    expect(lb, `LocalBusiness ausente em ${route}`).toBeTruthy();

    // NAP
    expect(lb!.name).toBeTruthy();
    const address = lb!.address as Record<string, string> | undefined;
    expect(address?.addressLocality).toBeTruthy();
    expect(address?.addressRegion).toBe("PR");
    expect(address?.addressCountry).toBe("BR");

    // Área atendida
    expect(lb!.areaServed).toBeTruthy();

    // Horários
    const hours = lb!.openingHoursSpecification as Array<Record<string, unknown>> | undefined;
    expect(Array.isArray(hours) && hours.length > 0).toBe(true);
    expect(hours![0].opens).toBeTruthy();
    expect(hours![0].closes).toBeTruthy();
  });

  test(`BreadcrumbList válido em ${route}`, async ({ page }) => {
    test.skip(route === "/", "Home não usa breadcrumb");
    await page.goto(route);
    await page.waitForSelector('script[type="application/ld+json"]');

    const blocks = await getJsonLdBlocks(page);
    const bc = findByType<Record<string, unknown>>(blocks, "BreadcrumbList");
    expect(bc, `BreadcrumbList ausente em ${route}`).toBeTruthy();

    const items = bc!.itemListElement as Array<Record<string, unknown>>;
    expect(items.length).toBeGreaterThanOrEqual(2);
    items.forEach((item, i) => {
      expect(item.position).toBe(i + 1);
      expect(item.name).toBeTruthy();
      expect(String(item.item)).toContain("https://precisodeumtecnico.com");
    });
  });
}

test("LocalBusiness aparece uma única vez por página", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('script[type="application/ld+json"]');
  const blocks = await getJsonLdBlocks(page);
  const count = blocks.filter(
    (b) => (b as { "@type"?: string })["@type"] === "LocalBusiness",
  ).length;
  expect(count).toBe(1);
});
