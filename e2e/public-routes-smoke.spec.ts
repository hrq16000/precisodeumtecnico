import { test, expect, type ConsoleMessage } from "@playwright/test";

/**
 * Smoke pós code-splitting (React.lazy + Suspense).
 * Garante que rotas públicas principais:
 *  - carregam sem tela em branco (main visível + heading);
 *  - não disparam erro de chunk-loading nem erro React em runtime;
 *  - não regridem textos fabricados já bloqueados.
 */

const PUBLIC_ROUTES = [
  "/",
  "/servicos",
  "/assistencia-tecnica",
  "/assistencia-tecnica-curitiba",
  "/precos",
  "/sobre",
  "/contato",
  "/blog",
  "/regioes",
  "/atendimento-nacional",
  "/servicos/informatica",
  "/regioes/curitiba",
  "/servico-em/curitiba/informatica",
  "/regioes/curitiba/batel",
  "/termos-orcamento",
  "/termos-orcamento-pre-aprovado",
];

const FABRICATED = /523\s*avalia|15\.000\+\s*clientes|500\+\s*técnicos cadastrados|★★★★★/i;
const WHITE_SCREEN = /Cannot read properties of undefined|createContext.*undefined/i;

const isCriticalError = (msg: string) =>
  /ChunkLoadError|Loading chunk \d+ failed|Failed to fetch dynamically imported module|Minified React error/i.test(
    msg,
  );

for (const route of PUBLIC_ROUTES) {
  test(`smoke ${route}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (m: ConsoleMessage) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    page.on("pageerror", (e) => consoleErrors.push(e.message));

    const resp = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(resp?.status(), `status ${route}`).toBeLessThan(400);

    await page.waitForLoadState("networkidle");

    // Conteúdo principal visível
    await expect(page.locator("main, [role='main']").first()).toBeVisible();
    // Pelo menos um heading renderizado (não ficou preso no Suspense fallback={null})
    expect(await page.locator("h1, h2").count()).toBeGreaterThan(0);

    // Nenhum texto fabricado bloqueado
    const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    expect(body).not.toMatch(FABRICATED);

    // Nenhum erro crítico de chunk / runtime
    const critical = consoleErrors.filter(isCriticalError);
    expect(critical, `console crítico em ${route}:\n${critical.join("\n")}`).toEqual([]);
  });
}

test("404 renderiza NotFound sem erro de chunk", async ({ page }) => {
  const errs: string[] = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(e.message));

  await page.goto("/rota-inexistente-xyz", { waitUntil: "networkidle" });
  await expect(page.getByText("404")).toBeVisible();
  expect(errs.filter(isCriticalError)).toEqual([]);
});

test("SEO/head preservado em rotas lazy chave", async ({ page }) => {
  const routes = [
    "/",
    "/servicos",
    "/assistencia-tecnica",
    "/assistencia-tecnica-curitiba",
    "/precos",
    "/servico-em/curitiba/informatica",
  ];
  for (const r of routes) {
    await page.goto(r, { waitUntil: "networkidle" });
    const title = await page.title();
    expect(title, `title em ${r}`).not.toMatch(/^Lovable( Generated)?( App| Project)?$/i);
    expect(title.length, `title em ${r}`).toBeGreaterThan(5);
    expect(await page.locator('link[rel="canonical"]').count(), `canonical em ${r}`).toBe(1);
  }
});

test("CTAs WhatsApp preservam contexto pós-lazy", async ({ page }) => {
  const routes = ["/assistencia-tecnica", "/assistencia-tecnica-curitiba", "/precos", "/contato"];
  for (const r of routes) {
    await page.goto(r, { waitUntil: "networkidle" });
    const waLinks = page.locator('a[href*="wa.me"]');
    const n = await waLinks.count();
    if (n === 0) continue; // algumas rotas só expõem CTA via triagem — ok
    for (let i = 0; i < n; i++) {
      const link = waLinks.nth(i);
      const href = await link.getAttribute("href");
      expect(href, `wa href em ${r}`).toMatch(/wa\.me\/\d+\?.*text=/);
      // Contexto na querystring (helper deve preencher pelo menos source ou service)
      expect(href!).toMatch(/text=[^&]*(source|service|utm)/i);
    }
  }
});
