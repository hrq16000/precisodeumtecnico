import { test, expect } from "@playwright/test";
import { getJsonLdBlocks, findByType } from "./utils/jsonld";

/**
 * Auditoria ampla de SEO estrutural — amostra representativa de TODAS as famílias
 * de rota (home, hubs, serviços Curitiba, nacional cidade/bairro, matriz
 * serviço×cidade×bairro, institucional).
 *
 * Contratos validados por rota:
 *  - H1 único e não vazio
 *  - canonical absoluto e auto-referente
 *  - og:title / og:description / og:url / twitter:card presentes
 *  - BreadcrumbList presente (exceto home)
 *  - ZERO aggregateRating / reviewCount / ratingValue fabricados
 */

const BASE_RE = /^https:\/\/(www\.)?precisodeumtecnico\.com/;

interface RouteSpec {
  path: string;
  breadcrumb?: boolean;
}

const ROUTES: RouteSpec[] = [
  { path: "/", breadcrumb: false },
  { path: "/servicos" },
  { path: "/precos" },
  { path: "/areas-atendidas" },
  { path: "/assistencia-tecnica-curitiba" },
  { path: "/servicos/conserto-de-som-e-audio-curitiba" },
  { path: "/atendimento-nacional", breadcrumb: false },
  { path: "/atendimento-nacional/sao-paulo" },
  { path: "/atendimento-nacional/rio-de-janeiro" },
  { path: "/atendimento-nacional/brasilia" },
  { path: "/atendimento-nacional/salvador" },
  { path: "/atendimento-nacional/campinas" },
  { path: "/atendimento-nacional/sao-paulo/pinheiros" },
  { path: "/atendimento-nacional/rio-de-janeiro/copacabana" },
  { path: "/servico-em-nacional/sao-paulo/pinheiros/informatica" },
  { path: "/servico-em-nacional/rio-de-janeiro/ipanema/notebooks" },
  { path: "/servico-em-nacional/brasilia/asa-sul/redes" },
  { path: "/servico-em-nacional/salvador/pituba/cftv" },
  { path: "/servico-em-nacional/campinas/cambui/recuperacao-dados" },
  { path: "/termos-orcamento" },
];

/**
 * Proibido: agregados fabricados. `ratingValue` só é aceito dentro de
 * `reviewRating` de um Review individual real (depoimento com autor).
 */
const FORBIDDEN_AGG = /"(aggregateRating|reviewCount)"/;

for (const r of ROUTES) {
  test(`auditoria estrutural: ${r.path}`, async ({ page }) => {
    test.slow();
    await page.goto(r.path, { waitUntil: "domcontentloaded" });

    // H1 único
    const h1 = page.locator("h1");
    await expect(h1.first()).toBeVisible({ timeout: 20_000 });
    expect(await h1.count(), `H1 único em ${r.path}`).toBe(1);
    expect(((await h1.first().textContent()) ?? "").trim().length).toBeGreaterThan(3);

    // Canonical absoluto e auto-referente
    const canonical = await page
      .locator('link[rel="canonical"]')
      .first()
      .getAttribute("href", { timeout: 20_000 });
    expect(canonical, `canonical em ${r.path}`).toBeTruthy();
    expect(canonical!, `canonical absoluto em ${r.path}`).toMatch(BASE_RE);
    const canonicalPath = new URL(canonical!).pathname.replace(/\/$/, "") || "/";
    expect(canonicalPath, `canonical auto-referente em ${r.path}`).toBe(
      r.path.replace(/\/$/, "") || "/",
    );

    // Social meta
    for (const sel of [
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[name="twitter:card"]',
    ]) {
      const c = await page.locator(sel).first().getAttribute("content", { timeout: 20_000 });
      expect(c && c.trim().length > 0, `${sel} em ${r.path}`).toBeTruthy();
    }
    const ogUrl = await page.locator('meta[property="og:url"]').first().getAttribute("content");
    expect(new URL(ogUrl!).pathname.replace(/\/$/, "") || "/", `og:url self em ${r.path}`).toBe(
      r.path.replace(/\/$/, "") || "/",
    );

    // Structured data
    const blocks = await getJsonLdBlocks(page);
    expect(blocks.length, `JSON-LD presente em ${r.path}`).toBeGreaterThan(0);

    if (r.breadcrumb !== false) {
      const bc = findByType<{ itemListElement?: unknown[] }>(blocks, "BreadcrumbList");
      expect(bc, `BreadcrumbList em ${r.path}`).toBeTruthy();
      expect((bc!.itemListElement ?? []).length).toBeGreaterThanOrEqual(2);
    }

    // Sem ratings fabricados em nenhum bloco
    const raw = JSON.stringify(blocks);
    expect(FORBIDDEN_AGG.test(raw), `agregado fabricado em ${r.path}`).toBe(false);
    // ratingValue solto (fora de reviewRating) também é proibido
    const strayRating = raw.replace(/"reviewRating":\{[^}]*\}/g, "");
    expect(/"ratingValue"/.test(strayRating), `ratingValue solto em ${r.path}`).toBe(false);
  });
}
