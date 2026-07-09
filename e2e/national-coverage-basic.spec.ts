import { test, expect, type Page } from "@playwright/test";

/**
 * Rodada 22.1 — cobertura básica das novas rotas nacionais.
 *
 * Valida em amostra estratificada (capitais + metro + bairros âncora):
 *  - rota carrega sem tela branca / sem pageerror;
 *  - H1 único;
 *  - canonical único e self-referente;
 *  - og:title/description/url únicos;
 *  - CTA WhatsApp com data-wa-source/data-service/aria-label;
 *  - texto WhatsApp contém cidade e bairro quando disponível;
 *  - rota inválida cai em NotFound/sugestões.
 */

const CAPITALS = [
  { slug: "sao-paulo", name: "São Paulo" },
  { slug: "brasilia", name: "Brasília" },
  { slug: "salvador", name: "Salvador" },
];

const METROS = [
  { slug: "campinas", name: "Campinas" },
  { slug: "niteroi", name: "Niterói" },
  { slug: "joinville", name: "Joinville" },
];

const BAIRROS = [
  { city: "sao-paulo", cityName: "São Paulo", bairro: "pinheiros", bairroName: "Pinheiros" },
  { city: "rio-de-janeiro", cityName: "Rio de Janeiro", bairro: "copacabana", bairroName: "Copacabana" },
  { city: "brasilia", cityName: "Brasília", bairro: "asa-sul", bairroName: "Asa Sul" },
];

async function collectErrors(page: Page): Promise<string[]> {
  const errs: string[] = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(e.message));
  return errs;
}

async function assertUnique(page: Page, sel: string, path: string) {
  const count = await page.locator(sel).count();
  expect(count, `${sel} deveria ser único em ${path}, encontrado ${count}`).toBe(1);
}

for (const cap of CAPITALS) {
  test(`cidade capital: /atendimento-nacional/${cap.slug}`, async ({ page }) => {
    const errs = await collectErrors(page);
    const resp = await page.goto(`/atendimento-nacional/${cap.slug}`, { waitUntil: "networkidle" });
    expect(resp?.status()).toBeLessThan(400);
    await expect(page.locator("main").first()).toBeVisible();
    expect(await page.locator("h1").count()).toBeGreaterThan(0);
    expect(errs.filter((e) => /ChunkLoadError|Minified React/i.test(e))).toEqual([]);
    const body = await page.locator("body").innerText();
    expect(body).toContain(cap.name);
  });
}

for (const m of METROS) {
  test(`cidade metro: /atendimento-nacional/${m.slug}`, async ({ page }) => {
    const errs = await collectErrors(page);
    const resp = await page.goto(`/atendimento-nacional/${m.slug}`, { waitUntil: "networkidle" });
    expect(resp?.status()).toBeLessThan(400);
    await expect(page.locator("main").first()).toBeVisible();
    expect(errs.filter((e) => /ChunkLoadError|Minified React/i.test(e))).toEqual([]);
  });
}

for (const b of BAIRROS) {
  const path = `/atendimento-nacional/${b.city}/${b.bairro}`;
  test(`bairro nacional: ${path}`, async ({ page }) => {
    const errs = await collectErrors(page);
    const resp = await page.goto(path, { waitUntil: "networkidle" });
    expect(resp?.status()).toBeLessThan(400);
    await expect(page.locator("main").first()).toBeVisible();
    expect(errs.filter((e) => /ChunkLoadError|Minified React/i.test(e))).toEqual([]);

    // H1 único e contém bairro
    await assertUnique(page, "h1", path);
    const h1 = (await page.locator("h1").first().innerText()).trim();
    expect(h1).toContain(b.bairroName);
    expect(h1).toContain(b.cityName);

    // Canonical único e self
    await assertUnique(page, 'link[rel="canonical"]', path);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(`https://precisodeumtecnico.com${path}`);

    // og:* únicos e coerentes
    await assertUnique(page, 'meta[property="og:title"]', path);
    await assertUnique(page, 'meta[property="og:description"]', path);
    await assertUnique(page, 'meta[property="og:url"]', path);
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
    expect(ogUrl).toBe(canonical);

    // BreadcrumbList presente
    const jsonlds = await page.locator('script[type="application/ld+json"]').allTextContents();
    const hasBreadcrumb = jsonlds.some((t) => /"@type"\s*:\s*"BreadcrumbList"/.test(t));
    expect(hasBreadcrumb, "BreadcrumbList JSON-LD ausente").toBe(true);
    const hasService = jsonlds.some((t) => /"@type"\s*:\s*"Service"/.test(t));
    expect(hasService, "Service JSON-LD ausente").toBe(true);
    // Sem aggregateRating/reviewCount fabricado
    expect(jsonlds.join(" ")).not.toMatch(/aggregateRating|reviewCount|ratingValue/i);

    // CTA WhatsApp: atributos + texto com cidade+bairro
    const cta = page.locator('a[href^="https://wa.me/"][data-wa-source]').first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("data-service", /assistencia|assist/i);
    await expect(cta).toHaveAttribute("data-city", b.cityName);
    await expect(cta).toHaveAttribute("data-neighborhood", b.bairroName);
    await expect(cta).toHaveAttribute("aria-label", /whatsapp/i);
    const href = (await cta.getAttribute("href")) ?? "";
    const text = decodeURIComponent(href.split("?text=")[1] ?? "");
    expect(text).toContain(b.cityName);
    expect(text).toContain(b.bairroName);
    expect(text).toContain("utm_source=whatsapp_cta");
  });
}

test("bairro inexistente cai em página de sugestões, não em tela branca", async ({ page }) => {
  const errs = await collectErrors(page);
  const resp = await page.goto("/atendimento-nacional/sao-paulo/bairro-inexistente-xyz", {
    waitUntil: "networkidle",
  });
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator("main").first()).toBeVisible();
  // Deve haver sugestões (chips) e CTA para a central
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/não catalogado|não/i);
  expect(errs.filter((e) => /ChunkLoadError|Minified React/i.test(e))).toEqual([]);
});

test("cidade inexistente redireciona para /atendimento-nacional", async ({ page }) => {
  await page.goto("/atendimento-nacional/cidade-inexistente/bairro-x", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/atendimento-nacional$/);
});
