import { test, expect, type ConsoleMessage } from "@playwright/test";

/**
 * Contratos das rotas de contratação local /servicos/:servico/curitiba
 * (lote CORE completo). Valida, por rota:
 *  - render sem tela branca e sem console error crítico;
 *  - canonical próprio + BreadcrumbList + Service + LocalBusiness JSON-LD;
 *  - CTA de WhatsApp com service=, source=, utm_source=whatsapp_cta e cidade;
 *  - ausência de canibalização (link explícito para o guia global).
 */

const SLUGS = [
  "notebooks",
  "informatica",
  "redes",
  "recuperacao-dados",
  "pc-gamer",
  "servidores",
  "macbook",
  "impressoras",
  "tvs",
  "celulares",
  "games",
  "cftv",
];

const isCritical = (m: string) =>
  /ChunkLoadError|Failed to fetch dynamically imported module|Minified React error|Cannot read properties of undefined/i.test(
    m,
  );

async function jsonLd(page: import("@playwright/test").Page): Promise<Record<string, unknown>[]> {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
  return raw.flatMap((t) => {
    try {
      const parsed = JSON.parse(t);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  });
}

for (const slug of SLUGS) {
  test(`contratação local /servicos/${slug}/curitiba`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m: ConsoleMessage) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    const url = `/servicos/${slug}/curitiba`;
    const resp = await page.goto(url, { waitUntil: "networkidle" });
    expect(resp?.status(), `status ${url}`).toBeLessThan(400);

    // Conteúdo real (sem tela branca)
    await expect(page.locator("h1")).toBeVisible();
    const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    expect(body.length, `conteúdo em ${url}`).toBeGreaterThan(1200);
    expect(body).toContain("Curitiba");

    // Canonical próprio
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(`https://precisodeumtecnico.com/servicos/${slug}/curitiba`);
    expect(await page.locator('link[rel="canonical"]').count()).toBe(1);

    // og:url auto-referente + og:title
    expect(await page.locator('meta[property="og:url"]').getAttribute("content")).toBe(canonical);
    expect((await page.locator('meta[property="og:title"]').getAttribute("content"))!.length).toBeGreaterThan(10);

    // Schemas
    const schemas = await jsonLd(page);
    const types = schemas.map((s) => s["@type"]);
    expect(types, `Service em ${url}`).toContain("Service");
    expect(types, `LocalBusiness em ${url}`).toContain("LocalBusiness");
    expect(types, `BreadcrumbList em ${url}`).toContain("BreadcrumbList");
    expect(types, `FAQPage em ${url}`).toContain("FAQPage");

    const service = schemas.find((s) => s["@type"] === "Service") as Record<string, unknown>;
    const offers = service.offers as Record<string, unknown>;
    expect(offers.priceCurrency).toBe("BRL");
    expect(Number(offers.price)).toBeGreaterThan(0);

    const lb = schemas.find((s) => s["@type"] === "LocalBusiness") as Record<string, unknown>;
    expect((lb.address as Record<string, string>).addressLocality).toBe("Curitiba");

    // FAQ visível == FAQPage
    const faqPage = schemas.find((s) => s["@type"] === "FAQPage") as Record<string, unknown>;
    const questions = (faqPage.mainEntity as { name: string }[]).map((q) => q.name);
    for (const q of questions) expect(body).toContain(q.slice(0, 30));

    // CTA WhatsApp com contexto completo
    const wa = page.locator('a[href*="wa.me"]').first();
    await expect(wa).toHaveCount(1);
    const href = (await wa.getAttribute("href"))!;
    const text = decodeURIComponent(href.split("?text=")[1]);
    expect(text).toMatch(/service=/);
    expect(text).toMatch(/source=/);
    expect(text).toContain("utm_source=whatsapp_cta");
    expect(text).toContain("Curitiba");
    // Query URL-encoded (sem espaços/acentos crus)
    const rawQuery = href.split("?text=")[1];
    expect(rawQuery).not.toMatch(/[ \n"<>#]/);
    expect(rawQuery).not.toMatch(/[À-ÿ]/);

    // Link para o guia global (anti-canibalização)
    await expect(page.locator(`a[href="/servicos/${slug}"]`).first()).toBeVisible();

    expect(errors.filter(isCritical), `console em ${url}`).toEqual([]);
  });
}
