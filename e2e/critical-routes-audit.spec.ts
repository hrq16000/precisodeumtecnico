import { test, expect } from "@playwright/test";

/**
 * Auditoria pós-publish — rotas críticas nacionais e locais.
 *
 * Valida em cada rota:
 *  1. canonical único, absoluto e sem query;
 *  2. og:title / og:description / og:url / twitter:card presentes e únicos;
 *  3. BreadcrumbList JSON-LD válido (itens com position/name/item);
 *  4. Service + Offer com preço oficial (99.99 / 299.99) quando houver Service;
 *  5. LocalBusiness com name/address quando houver.
 *
 * Rode contra produção com:
 *   E2E_BASE_URL=https://precisodeumtecnico.com bunx playwright test e2e/critical-routes-audit.spec.ts
 */

const CRITICAL_ROUTES = [
  // Nacionais / institucionais
  "/",
  "/servicos",
  "/precos",
  "/como-funciona",
  "/assistencia-tecnica",
  "/atendimento-nacional",
  // Cidade e bairro nacionais
  "/atendimento-nacional/sao-paulo",
  "/atendimento-nacional/rio-de-janeiro",
  // Locais Curitiba
  "/assistencia-tecnica-curitiba",
  "/regioes/curitiba",
  "/regioes/curitiba/batel",
  "/servicos/informatica/curitiba",
  "/servicos/notebooks/curitiba",
  "/servicos/tvs/curitiba",
  "/servico-em/curitiba/informatica",
];

const OFFICIAL_PRICES = new Set(["99.99", "299.99", "99,99", "299,99"]);

type Json = Record<string, unknown>;

async function jsonLd(page: import("@playwright/test").Page, rootOnly = false): Promise<Json[]> {
  const raws = await page.locator('script[type="application/ld+json"]').allTextContents();
  const out: Json[] = [];
  for (const raw of raws) {
    try {
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of list) {
        out.push(node as Json);
        const graph = (node as { "@graph"?: Json[] })["@graph"];
        if (Array.isArray(graph) && !rootOnly) out.push(...graph);
      }
    } catch {
      throw new Error(`JSON-LD inválido: ${raw.slice(0, 120)}`);
    }
  }
  return out;
}

const typeOf = (n: Json) => {
  const t = n["@type"];
  return Array.isArray(t) ? (t as string[]) : typeof t === "string" ? [t] : [];
};

function collectOffers(node: Json, acc: Json[] = []): Json[] {
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((v) => v && typeof v === "object" && collectOffers(v as Json, acc));
    else if (value && typeof value === "object") collectOffers(value as Json, acc);
  }
  if (typeOf(node).includes("Offer")) acc.push(node);
  return acc;
}

for (const route of CRITICAL_ROUTES) {
  test(`auditoria de schemas e metatags — ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `HTTP inesperado em ${route}`).toBeLessThan(400);
    await page.waitForSelector('script[type="application/ld+json"]', {
      state: "attached",
      timeout: 15_000,
    });

    // 1) Canonical (Helmet injeta após a hidratação)
    await page
      .waitForSelector('link[rel="canonical"]', { state: "attached", timeout: 15_000 })
      .catch(() => undefined);
    const canonicals = await page.locator('link[rel="canonical"]').evaluateAll((els) =>
      els.map((e) => (e as HTMLLinkElement).getAttribute("href") ?? ""),
    );
    expect(canonicals, `canonical ausente/duplicado em ${route}`).toHaveLength(1);
    expect(canonicals[0]).toMatch(/^https?:\/\//);
    expect(canonicals[0]).not.toContain("?");

    // 2) Open Graph / Twitter
    for (const sel of [
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[name="twitter:card"]',
    ]) {
      const values = await page
        .locator(sel)
        .evaluateAll((els) => els.map((e) => e.getAttribute("content")?.trim() ?? ""));
      expect(values.length, `${sel} ausente/duplicado em ${route}`).toBe(1);
      expect(values[0]!.length, `${sel} vazio em ${route}`).toBeGreaterThan(3);
    }

    const nodes = await jsonLd(page);
    const rootNodes = await jsonLd(page, true);

    // 3) BreadcrumbList (a home é a raiz e não exige trilha)
    const breadcrumbs = nodes.filter((n) => typeOf(n).includes("BreadcrumbList"));
    if (route !== "/") {
      expect(breadcrumbs.length, `BreadcrumbList ausente em ${route}`).toBeGreaterThan(0);
    }
    for (const bc of breadcrumbs) {
      const items = (bc.itemListElement ?? []) as Json[];
      expect(items.length, `BreadcrumbList vazio em ${route}`).toBeGreaterThan(0);
      items.forEach((item, i) => {
        expect(item.position, `posição ausente no breadcrumb ${i} de ${route}`).toBe(i + 1);
        expect(String(item.name ?? "").length).toBeGreaterThan(0);
      });
    }

    // 4) Service / Offer com preço oficial
    const services = nodes.filter((n) => typeOf(n).includes("Service"));
    for (const service of services) {
      expect(String(service.name ?? "").length, `Service sem name em ${route}`).toBeGreaterThan(0);
      for (const offer of collectOffers(service)) {
        if (offer.price === undefined) continue;
        expect(
          OFFICIAL_PRICES.has(String(offer.price)),
          `Offer com preço fora da política (${offer.price}) em ${route}`,
        ).toBeTruthy();
        expect(offer.priceCurrency, `Offer sem priceCurrency em ${route}`).toBe("BRL");
      }
    }

    // 5) LocalBusiness — todo nó de topo precisa de name e ao menos um deve
    // trazer o endereço completo da entidade.
    const localBusinesses = rootNodes.filter((n) => typeOf(n).some((t) => t.includes("LocalBusiness")));
    for (const lb of localBusinesses) {
      expect(String(lb.name ?? "").length, `LocalBusiness sem name em ${route}`).toBeGreaterThan(0);
    }
    if (localBusinesses.length > 0) {
      expect(
        localBusinesses.some((lb) => Boolean(lb.address)),
        `nenhum LocalBusiness com address em ${route}`,
      ).toBeTruthy();
    }
  });
}
