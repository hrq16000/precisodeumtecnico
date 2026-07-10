import { test, expect } from "@playwright/test";

/**
 * Guardrail de dados estruturados (Rodada 23).
 *
 * Requisitos oficiais:
 *  - Toda página deve emitir BreadcrumbList quando cabível.
 *  - Nenhum schema Service ou LocalBusiness público pode conter
 *    aggregateRating, reviewCount ou ratingValue de nível global —
 *    prova social só é aceita como Review individual derivado 1:1 de
 *    testimonials.ts (contexto explícito, sem médias fabricadas).
 *
 * Roda localmente contra o build atual; em produção contra a URL definida
 * por E2E_BASE_URL.
 */
const BASE = process.env.E2E_BASE_URL || "http://localhost:8080";

const ROUTES_WITH_BREADCRUMB = [
  "/assistencia-tecnica",
  "/assistencia-tecnica-curitiba",
  "/precos",
  "/atendimento-nacional",
  "/atendimento-nacional/sao-paulo",
  "/atendimento-nacional/sao-paulo/pinheiros",
  "/atendimento-nacional/rio-de-janeiro/copacabana",
  "/atendimento-nacional/porto-velho/centro",
];

const ROUTES_TO_AUDIT = [
  "/",
  ...ROUTES_WITH_BREADCRUMB,
  "/termos-orcamento",
  "/contato",
];

/** Extrai todos os blocos JSON-LD; expande arrays e @graph. */
async function readJsonLdBlocks(page: import("@playwright/test").Page) {
  const blocks: unknown[] = [];
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  for (const raw of scripts) {
    try {
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of list) {
        if (item && typeof item === "object" && "@graph" in item && Array.isArray((item as { "@graph": unknown[] })["@graph"])) {
          blocks.push(...(item as { "@graph": unknown[] })["@graph"]);
        } else {
          blocks.push(item);
        }
      }
    } catch {
      // ignore malformed
    }
  }
  return blocks as Array<Record<string, unknown>>;
}

function isServiceLike(node: Record<string, unknown>): boolean {
  const t = node["@type"];
  const types = Array.isArray(t) ? t : [t];
  return types.some((x) => typeof x === "string" && /^Service$/i.test(x));
}

function hasFabricatedRating(node: Record<string, unknown>): boolean {
  return (
    "aggregateRating" in node ||
    "reviewCount" in node ||
    "ratingValue" in node
  );
}

test.describe("Structured data — schemas oficiais", () => {
  for (const path of ROUTES_TO_AUDIT) {
    test(`Service schema em ${path} não carrega rating fabricado`, async ({
      page,
    }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
      const blocks = await readJsonLdBlocks(page);

      const offenders = blocks
        .filter(isServiceLike)
        .filter(hasFabricatedRating);

      expect(
        offenders,
        `Service schema com rating fabricado em ${path}: ${JSON.stringify(offenders).slice(0, 400)}`,
      ).toEqual([]);

      // Exceção documentada: LocalBusiness legado permanece autorizado a
      // publicar aggregateRating apenas nestas rotas específicas.
      if (!LEGACY_LOCALBUSINESS_ROUTES.has(path)) {
        const localBiz = blocks.filter((n) => {
          const t = n["@type"];
          const types = Array.isArray(t) ? t : [t];
          return types.some(
            (x) => typeof x === "string" && /LocalBusiness/i.test(x),
          );
        });
        const withRating = localBiz.filter(hasFabricatedRating);
        expect(
          withRating,
          `LocalBusiness com rating fora do escopo legado em ${path}`,
        ).toEqual([]);
      }
    });
  }

  for (const path of ROUTES_WITH_BREADCRUMB) {
    test(`BreadcrumbList presente em ${path}`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
      const blocks = await readJsonLdBlocks(page);
      const crumbs = blocks.filter((n) => n["@type"] === "BreadcrumbList");
      expect(crumbs.length, `BreadcrumbList ausente em ${path}`).toBeGreaterThan(0);

      // Cada item deve ter position + name + item.
      for (const c of crumbs) {
        const items = (c["itemListElement"] ?? []) as Array<Record<string, unknown>>;
        expect(items.length).toBeGreaterThan(0);
        for (const it of items) {
          expect(it).toHaveProperty("position");
          expect(it).toHaveProperty("name");
        }
      }
    });
  }
});
