import { test, expect } from "@playwright/test";

/**
 * Gate da Rodada 3S — piloto do sistema visual empresarial.
 * Escopo fechado: hub (/empresa-de-ti-curitiba) e serviço
 * (/servicos/suporte-tecnico-empresarial). Valida diferenciação, CTA acima
 * da dobra, ausência de preço/SLA/nicho e preservação de JSON-LD.
 */
const HUB = "/empresa-de-ti-curitiba";
const SERVICE = "/servicos/suporte-tecnico-empresarial";

const FORBIDDEN = [
  /oferecemos suporte ilimitado/i,
  /\bsla\b/i,
  /chamados ilimitados/i,
  /atendimento prioritário/i,
  /mensalidade/i,
  /\bplano (básico|premium|empresarial)\b/i,
  /ti para (advogados|clínicas|contadores|arquitetos)/i,
];

for (const path of [HUB, SERVICE]) {
  for (const width of [360, 390, 430]) {
    test(`CTA empresarial acima de 750px em ${path} @${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      const cta = page.locator("[data-b2b-hero] [data-triage-cta]").first();
      const box = await cta.boundingBox();
      expect(box, `CTA visível em ${path}`).not.toBeNull();
      expect(box!.y).toBeLessThan(750);
      expect(await page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")).toBe(true);
    });
  }

  test(`conteúdo e claims em ${path}`, async ({ page }) => {
    await page.goto(path);

    // Máximo de três CTAs de triagem e faixa de confiança única.
    expect(await page.locator("[data-triage-cta]").count()).toBeLessThanOrEqual(3);
    await expect(page.locator("[data-trust-strip]")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("[data-page-toc]")).toHaveCount(1);

    const body = (await page.locator("article").innerText()).toLowerCase();
    for (const re of FORBIDDEN) {
      expect(re.test(body), `texto proibido ${re} em ${path}`).toBe(false);
    }
    // Zero preço novo nas páginas piloto.
    expect(/r\$\s*\d/.test(body)).toBe(false);

    // JSON-LD preservado.
    const types = await page.locator("script[type='application/ld+json']").evaluateAll((els) =>
      els.flatMap((e) => {
        const parsed = JSON.parse(e.textContent || "{}");
        return (Array.isArray(parsed) ? parsed : [parsed]).map((n) => n["@type"]);
      }),
    );
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("FAQPage");
  });
}

test("hub e serviço são visualmente distintos", async ({ page }) => {
  await page.goto(HUB);
  await expect(page.locator("[data-b2b-hero][data-b2b-variant='hub']")).toHaveCount(1);
  await expect(page.locator("[data-business-pillars]")).toHaveCount(1);
  await expect(page.locator("[data-business-service-map]")).toHaveCount(1);
  await expect(page.locator("[data-business-scope]")).toHaveCount(0);
  await expect(page.locator("[data-business-flow]")).toHaveCount(0);
  const hubCta = await page.locator("[data-b2b-hero] [data-triage-cta]").first().innerText();
  expect(hubCta).toContain("Descrever a necessidade da empresa");
  // Checklist não pede senha nem código de autenticação.
  const hubBody = await page.locator("article").innerText();
  expect(/não envie por mensagem/i.test(hubBody)).toBe(true);
  // Mapa de serviços com no máximo sete entradas e rotas internas válidas.
  const hrefs = await page
    .locator("[data-business-service-map] a")
    .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!));
  expect(hrefs.length).toBeLessThanOrEqual(7);
  for (const h of hrefs) expect(h.startsWith("/")).toBe(true);

  await page.goto(SERVICE);
  await expect(page.locator("[data-b2b-hero][data-b2b-variant='service']")).toHaveCount(1);
  await expect(page.locator("[data-business-scope]")).toHaveCount(1);
  await expect(page.locator("[data-business-flow]")).toHaveCount(1);
  await expect(page.locator("[data-business-pillars]")).toHaveCount(0);
  await expect(page.locator("[data-business-service-map]")).toHaveCount(0);
  const svcCta = await page.locator("[data-b2b-hero] [data-triage-cta]").first().innerText();
  expect(svcCta).toContain("Solicitar suporte para a empresa");

  const svcBody = await page.locator("article").innerText();
  expect(/avulso/i.test(svcBody)).toBe(true);
  expect(/recorrente/i.test(svcBody)).toBe(true);
  expect(/ilimitad/i.test(svcBody) ? /não\.?\s*o recorrente define escopo/i.test(svcBody) : true).toBe(true);
  expect(/fornecedor/i.test(svcBody)).toBe(true);
});

test("piloto não vaza para outras páginas empresariais e residenciais", async ({ page }) => {
  for (const path of [
    "/seguranca-dos-dados",
    "/guias/organizacao-de-ti-para-pequenos-escritorios",
    "/servicos/redes",
    "/conserto-de-notebook-curitiba",
  ]) {
    await page.goto(path);
    await expect(page.locator("[data-business-pillars]"), path).toHaveCount(0);
    await expect(page.locator("[data-business-service-map]"), path).toHaveCount(0);
    await expect(page.locator("[data-business-scope]"), path).toHaveCount(0);
    await expect(page.locator("[data-business-flow]"), path).toHaveCount(0);
  }
});
