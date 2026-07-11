import { test, expect, Page } from "@playwright/test";

/**
 * Rodada 25.1 — Fase 2. Valida que <meta name="description"> tem fonte única
 * por rota (Helmet via SEOHead ou Helmet local), com conteúdo coerente à URL
 * e sem herança da descrição legada de Curitiba nas rotas nacionais.
 *
 * Não usa comparação de frase inteira; valida termos obrigatórios/proibidos.
 */

async function readDescription(page: Page) {
  return await page.evaluate(() => {
    const nodes = document.head.querySelectorAll('meta[name="description"]');
    return {
      count: nodes.length,
      content: (nodes[0]?.getAttribute("content") ?? "").trim(),
    };
  });
}

async function readRobots(page: Page) {
  return await page.evaluate(() => {
    const nodes = document.head.querySelectorAll('meta[name="robots"]');
    return {
      count: nodes.length,
      content: (nodes[0]?.getAttribute("content") ?? "").trim().toLowerCase(),
    };
  });
}

async function readCanonical(page: Page) {
  return await page.evaluate(() => {
    const nodes = document.head.querySelectorAll('link[rel="canonical"]');
    return {
      count: nodes.length,
      href: nodes[0]?.getAttribute("href") ?? "",
    };
  });
}

test("A · home / — description única e coerente", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const desc = await readDescription(page);
  expect(desc.count).toBe(1);
  expect(desc.content.length).toBeGreaterThan(30);
  // não deve conter tokens de outras rotas nacionais
  expect(desc.content).not.toMatch(/Pinheiros|Asa Norte|Copacabana|Pituba/i);
});

test("B · /servico-em/curitiba/informatica — RMC, informática, Curitiba", async ({ page }) => {
  await page.goto("/servico-em/curitiba/informatica", { waitUntil: "networkidle" });
  const desc = await readDescription(page);
  expect(desc.count).toBe(1);
  expect(desc.content).toMatch(/inform[áa]tica/i);
  expect(desc.content).toMatch(/curitiba/i);
  expect(desc.content).not.toMatch(/Pinheiros|Asa Norte|Copacabana|Brasília/i);
});

test("C · matriz São Paulo / Pinheiros / informática", async ({ page }) => {
  await page.goto("/servico-em-nacional/sao-paulo/pinheiros/informatica", { waitUntil: "networkidle" });
  const desc = await readDescription(page);
  expect(desc.count).toBe(1);
  expect(desc.content).toMatch(/inform[áa]tica/i);
  expect(desc.content).toMatch(/pinheiros/i);
  expect(desc.content).toMatch(/s[ãa]o paulo/i);
  // regressão: descrição legada genérica de Curitiba não pode vazar
  expect(desc.content).not.toMatch(/Assist[êe]ncia t[ée]cnica em Curitiba e regi[ãa]o/i);
  expect(desc.content).not.toMatch(/Bras[íi]lia|Asa Norte|CFTV/i);
});

test("D · matriz Brasília / Asa Norte / CFTV", async ({ page }) => {
  await page.goto("/servico-em-nacional/brasilia/asa-norte/cftv", { waitUntil: "networkidle" });
  const desc = await readDescription(page);
  expect(desc.count).toBe(1);
  expect(desc.content).toMatch(/CFTV|c[âa]meras/i);
  expect(desc.content).toMatch(/asa norte/i);
  expect(desc.content).toMatch(/bras[íi]lia/i);
  expect(desc.content).not.toMatch(/curitiba/i);
  expect(desc.content).not.toMatch(/pinheiros|s[ãa]o paulo/i);
  // "informática" pode aparecer em links relacionados — não asserimos ausência
  // no doc inteiro, apenas garantimos que a description tem CFTV como foco.
  expect(desc.content).not.toMatch(/^Rede nacional de t[ée]cnicos verificados para assist[êe]ncia t[ée]cnica em inform[áa]tica/i);
});

test("E · combinação inválida — noindex e sem cobertura fabricada", async ({ page }) => {
  await page.goto("/servico-em-nacional/cidade-inexistente/pinheiros/informatica", {
    waitUntil: "networkidle",
  });
  const desc = await readDescription(page);
  const robots = await readRobots(page);
  const canonical = await readCanonical(page);

  expect(desc.count).toBeLessThanOrEqual(1);
  expect(desc.count).toBeGreaterThanOrEqual(0);
  if (desc.count === 1) {
    // fallback nacional: não afirmar cobertura na cidade inexistente
    expect(desc.content).not.toMatch(/cidade-inexistente/i);
  }
  expect(robots.count).toBe(1);
  expect(robots.content).toContain("noindex");
  expect(robots.content).toContain("nofollow");
  // canonical não pode apontar para a URL inválida
  expect(canonical.href).not.toContain("cidade-inexistente");
});

test("F · rota interna /auth — sem duplicidade e noindex", async ({ page }) => {
  await page.goto("/auth", { waitUntil: "networkidle" });
  const desc = await readDescription(page);
  const robots = await readRobots(page);

  expect(desc.count).toBeLessThanOrEqual(1);
  expect(robots.count).toBe(1);
  expect(robots.content).toContain("noindex");
  expect(robots.content).toContain("nofollow");
});
