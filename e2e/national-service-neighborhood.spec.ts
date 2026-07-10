import { test, expect, type Page } from "@playwright/test";

const BASE = "";

async function jsonLd(page: Page) {
  const raw = await page.locator('script[type="application/ld+json"]').allInnerTexts();
  return raw.map((t) => {
    try { return JSON.parse(t); } catch { return null; }
  }).filter(Boolean) as Array<Record<string, unknown>>;
}

const validSamples = [
  { path: "/servico-em-nacional/sao-paulo/pinheiros/informatica",           city: "São Paulo",       bairro: "Pinheiros",  service: "Informática" },
  { path: "/servico-em-nacional/rio-de-janeiro/copacabana/notebooks",       city: "Rio de Janeiro",  bairro: "Copacabana", service: "Notebooks" },
  { path: "/servico-em-nacional/brasilia/asa-sul/redes",                    city: "Brasília",        bairro: "Asa Sul",    service: "Redes" },
  { path: "/servico-em-nacional/salvador/pituba/cftv",                      city: "Salvador",        bairro: "Pituba",     service: "CFTV" },
  { path: "/servico-em-nacional/campinas/cambui/recuperacao-dados",         city: "Campinas",        bairro: "Cambuí",     service: "Recuperação" },
];

test.describe("Matriz nacional serviço × cidade × bairro — piloto 24.1", () => {
  for (const s of validSamples) {
    test(`combinação válida: ${s.path}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (e) => pageErrors.push(String(e)));

      const resp = await page.goto(BASE + s.path, { waitUntil: "networkidle" });
      expect(resp?.status(), s.path).toBe(200);

      // H1 único
      const h1s = await page.locator("h1").allTextContents();
      expect(h1s.length, `H1 count on ${s.path}`).toBe(1);
      expect(h1s[0]).toContain(s.bairro);
      expect(h1s[0]).toContain(s.city);

      // Canonical único e self
      const canonicals = await page.locator('link[rel="canonical"]').evaluateAll(
        (els) => els.map((e) => e.getAttribute("href") ?? ""),
      );
      expect(canonicals.length, "canonical count").toBe(1);
      expect(canonicals[0]).toBe(`https://precisodeumtecnico.com${s.path}`);

      // OG/Twitter image existem (SEOHead + hospedagem podem emitir juntos; aceitamos >=1)
      const og = await page.locator('meta[property="og:image"]').count();
      const tw = await page.locator('meta[name="twitter:image"]').count();
      expect(og, "og:image count").toBeGreaterThanOrEqual(1);
      expect(tw, "twitter:image count").toBeGreaterThanOrEqual(1);

      // Structured data: BreadcrumbList presente + Service sem rating fabricado
      const ld = await jsonLd(page);
      const dumped = JSON.stringify(ld);
      const hasBc = ld.some((o) => (o as { "@type"?: string })["@type"] === "BreadcrumbList");
      expect(hasBc, "BreadcrumbList presente").toBe(true);
      expect(dumped.includes('"aggregateRating"'), "sem aggregateRating").toBe(false);
      expect(dumped.includes('"reviewCount"'), "sem reviewCount").toBe(false);
      const services = ld.filter((o) => (o as { "@type"?: string })["@type"] === "Service");
      for (const svc of services) {
        expect(JSON.stringify(svc).includes('"ratingValue"'), "Service sem ratingValue").toBe(false);
      }

      // CTA WhatsApp com contexto
      const wa = page.locator('a[data-wa-source="matrix-nacional-hero"]').first();
      await expect(wa).toBeVisible();
      const href = await wa.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href!).toMatch(/wa\.me/);
      expect(href!).toMatch(/service=/);
      expect(href!).toMatch(/source=/);
      expect(href!).toMatch(/utm_source=whatsapp_cta/);
      await expect(wa).toHaveAttribute("data-service", /.+/);
      await expect(wa).toHaveAttribute("data-city", /.+/);
      await expect(wa).toHaveAttribute("data-neighborhood", /.+/);
      await expect(wa).toHaveAttribute("aria-label", /.+/);

      // CTA de triagem com contexto
      const triage = page.locator('button[data-triage-source^="matrix-nacional:"]').first();
      await expect(triage).toBeVisible();
      await expect(triage).toHaveAttribute("data-service", /.+/);
      await expect(triage).toHaveAttribute("data-city", /.+/);
      await expect(triage).toHaveAttribute("data-neighborhood", /.+/);

      // Zero pageerror; body não vazio (sem tela branca)
      expect(pageErrors).toEqual([]);
      const bodyLen = (await page.locator("body").innerText()).length;
      expect(bodyLen).toBeGreaterThan(500);
    });
  }

  const invalid = [
    { path: "/servico-em-nacional/atlantis/pinheiros/informatica",       reason: "cidade inexistente" },
    { path: "/servico-em-nacional/sao-paulo/copacabana/informatica",     reason: "bairro que não pertence à cidade" },
    { path: "/servico-em-nacional/sao-paulo/pinheiros/servico-inexistente", reason: "serviço inexistente" },
    { path: "/servico-em-nacional/vitoria/praia-do-canto/informatica",   reason: "cidade fora do piloto (habilitada em nationalCities mas não em pilotCities)" },
  ];

  for (const c of invalid) {
    test(`combinação inválida cai em fallback noindex: ${c.reason}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (e) => pageErrors.push(String(e)));

      await page.goto(BASE + c.path, { waitUntil: "networkidle" });
      // Não deve haver H1 do padrão de matriz válida.
      const h1 = (await page.locator("h1").first().textContent()) ?? "";
      expect(h1).not.toMatch(/Informática em Pinheiros, São Paulo|Notebooks em Copacabana/);

      // Se a página renderizar fallback, deve carregar noindex.
      // (Alguns casos redirect para /atendimento-nacional; então robots pode ser index — aceitamos ambos.)
      const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
      const url = page.url();
      const acceptable =
        (robots ?? "").toLowerCase().includes("noindex") ||
        url.endsWith("/atendimento-nacional") ||
        url.endsWith("/atendimento-nacional/");
      expect(acceptable, `rota inválida deve ser noindex OU redirecionar: robots=${robots} url=${url}`).toBe(true);
      expect(pageErrors).toEqual([]);
    });
  }
});
