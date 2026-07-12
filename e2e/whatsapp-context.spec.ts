import { test, expect, type Page } from "@playwright/test";

/**
 * B.3.b — Schemas por tipo de rota. Substitui o contrato genérico anterior
 * que assumia `Service` em toda página regional.
 *
 * Contratos:
 *  A. /servico-em/:city/:service  → Service específico + BreadcrumbList
 *  B. /regioes/:city              → hub regional; schema institucional
 *                                    coerente (LocalBusiness/Service opcional
 *                                    conforme fonte da verdade). Não exigimos
 *                                    Service específico, mas verificamos
 *                                    ausência de ratings fabricados e de
 *                                    FAQPage template.
 *  C. /regioes/:city/:neighborhood → cobre CTA com bairro.
 */

function parseJsonLd(text: string): unknown | null {
  try { return JSON.parse(text); } catch { return null; }
}

async function jsonLds(page: Page): Promise<unknown[]> {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
  const out: unknown[] = [];
  for (const t of raw) {
    const parsed = parseJsonLd(t);
    if (Array.isArray(parsed)) out.push(...parsed);
    else if (parsed) out.push(parsed);
  }
  return out;
}

function byType<T = unknown>(items: unknown[], type: string): T[] {
  return items.filter(
    (o) => o && typeof o === "object" && (o as Record<string, unknown>)["@type"] === type,
  ) as T[];
}

test.describe("A. Serviço em cidade — /servico-em/curitiba/informatica", () => {
  test("emite ao menos 1 Service específico de Informática em Curitiba", async ({ page }) => {
    await page.goto("/servico-em/curitiba/informatica");
    await page.waitForLoadState("networkidle");

    const items = await jsonLds(page);
    const services = byType<Record<string, unknown>>(items, "Service");
    // Baseline institucional pode injetar Services genéricos (LocalBusiness);
    // exigimos ao menos 1 Service específico de Informática com areaServed Curitiba.
    const match = services.find((s) => {
      const name = String(s.name ?? "").toLowerCase();
      const area = JSON.stringify(s.areaServed ?? "").toLowerCase();
      return /inform[aá]tica/.test(name) && area.includes("curitiba");
    });
    expect(match, "Service específico Informática+Curitiba presente").toBeDefined();

    const breadcrumbs = byType(items, "BreadcrumbList");
    expect(breadcrumbs.length).toBeGreaterThanOrEqual(1);
  });


  test("CTA carrega service + city, sem ratings fabricados", async ({ page }) => {
    await page.goto("/servico-em/curitiba/informatica");
    const cta = page.locator('a[data-wa-source="service-city"]').first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    const text = decodeURIComponent(new URL(href!).searchParams.get("text") || "");
    expect(text.toLowerCase()).toContain("informática");
    expect(text).toContain("Curitiba");
    expect(text).not.toMatch(/rua|nº|número/i);
    await expect(cta).toHaveAttribute("data-service", /.+/);
    await expect(cta).toHaveAttribute("data-city", "Curitiba");

    const combined = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
    expect(combined).not.toContain('"reviewCount": "523"');
    expect(combined).not.toContain('"reviewCount": "15000"');
  });
});

test.describe("B. Região genérica — /regioes/curitiba", () => {
  test("emite schema institucional coerente sem FAQ template nem rating fabricado", async ({ page }) => {
    // NOTA: contrato antigo exigia Service em toda região; removido em B.3.b
    // porque a página é hub regional genérico e o schema Service específico
    // deve viver em /servico-em/:city/:service. A implementação atual
    // ainda emite Service via SEOHead — validamos apenas que o schema é
    // parseável e não contém template proibido.
    await page.goto("/regioes/curitiba");
    await page.waitForLoadState("networkidle");
    const items = await jsonLds(page);
    expect(items.length).toBeGreaterThan(0);

    // zero FAQPage template
    expect(byType(items, "FAQPage").length).toBe(0);

    // BreadcrumbList opcional; se presente, itemListElement é array
    const bl = byType<Record<string, unknown>>(items, "BreadcrumbList");
    for (const b of bl) expect(Array.isArray(b.itemListElement)).toBe(true);

    // sem ratings fabricados
    const combined = JSON.stringify(items);
    expect(combined).not.toContain('"reviewCount":"523"');
    expect(combined).not.toContain('"reviewCount":"15000"');
    expect(combined).not.toContain('"reviewCount": "523"');
    expect(combined).not.toContain('"reviewCount": "15000"');
  });
});

test.describe("C. Bairro — /regioes/curitiba/batel", () => {
  test("CTA neighborhood-detail carrega city + bairro no texto", async ({ page }) => {
    await page.goto("/regioes/curitiba/batel");
    const cta = page.locator('a[data-wa-source="neighborhood-detail"]').first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    const text = decodeURIComponent(new URL(href!).searchParams.get("text") || "");
    expect(text).toContain("Curitiba");
    expect(text.toLowerCase()).toContain("batel");
    await expect(cta).toHaveAttribute("data-city", "Curitiba");
    await expect(cta).toHaveAttribute("data-neighborhood", /.+/);
  });
});
