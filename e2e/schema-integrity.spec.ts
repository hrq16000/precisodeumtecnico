import { test, expect } from "@playwright/test";

/**
 * Rodada 7 — Integridade de schema.org nas páginas públicas.
 * 1. Nenhum AggregateRating fabricado (523, 15000, valores fixos herdados).
 * 2. Sem duplicação de Service schema (mesmo name + areaServed emitido 2x).
 */

const PUBLIC_PAGES = [
  "/",
  "/assistencia-tecnica",
  "/assistencia-tecnica-curitiba",
  "/servico-em/curitiba/informatica",
  "/regioes/curitiba",
  "/regioes/curitiba/batel",
  "/servicos",
  "/precos",
];

async function collectSchemas(page: import("@playwright/test").Page) {
  const raws = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const out: Record<string, unknown>[] = [];
  for (const r of raws) {
    try {
      const parsed = JSON.parse(r);
      if (Array.isArray(parsed)) out.push(...parsed);
      else out.push(parsed);
    } catch {
      /* ignore malformed for this smoke */
    }
  }
  return out;
}

for (const path of PUBLIC_PAGES) {
  test(`schema integrity — ${path}`, async ({ page }) => {
    await page.goto(path);
    const schemas = await collectSchemas(page);
    const serialized = JSON.stringify(schemas);

    // 1) Sem contadores fabricados conhecidos
    expect(serialized).not.toContain('"reviewCount":"523"');
    expect(serialized).not.toContain('"reviewCount": "523"');
    expect(serialized).not.toContain('"reviewCount":"15000"');
    expect(serialized).not.toContain('"reviewCount": "15000"');

    // 2) Service schema não duplicado
    const services = schemas.filter(
      (s) => (s as { "@type"?: string })["@type"] === "Service",
    );
    const seen = new Set<string>();
    for (const s of services) {
      const o = s as { name?: string; areaServed?: unknown };
      const key = `${o.name}|${JSON.stringify(o.areaServed ?? "")}`;
      expect(seen.has(key), `Service duplicado: ${key} em ${path}`).toBeFalsy();
      seen.add(key);
    }
  });
}
