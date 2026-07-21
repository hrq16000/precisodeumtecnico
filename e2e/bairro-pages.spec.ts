import { test, expect } from "@playwright/test";
import { getJsonLdBlocks, findByType } from "./utils/jsonld";

/**
 * Rodada 27.5 — Contratos automatizados por bairro de Curitiba.
 * Valida os 10 bairros de 1ª camada para ambos os serviços:
 *  - HTTP 200 + H1 correto (contém nome do bairro + serviço)
 *  - Bloco FAQ/triagem visível (accordion + botão de triagem)
 *  - JSON-LD Service com areaServed contendo o bairro
 *  - JSON-LD BreadcrumbList com 3 níveis mínimos (Início > pai > bairro)
 *  - JSON-LD FAQPage com mainEntity com pelo menos 3 perguntas
 */

const BAIRROS_1A_CAMADA = [
  { slug: "batel", nome: "Batel" },
  { slug: "bigorrilho", nome: "Bigorrilho" },
  { slug: "agua-verde", nome: "Água Verde" },
  { slug: "cabral", nome: "Cabral" },
  { slug: "centro", nome: "Centro" },
  { slug: "ecoville", nome: "Ecoville" },
  { slug: "portao", nome: "Portão" },
  { slug: "reboucas", nome: "Rebouças" },
  { slug: "boa-vista", nome: "Boa Vista" },
  { slug: "champagnat", nome: "Champagnat" },
] as const;

const SERVICES = [
  {
    key: "reparo-smart-tv",
    label: "Reparo de Smart TV",
    minFaq: 3,
  },
  {
    key: "configuracao-wifi",
    label: "Configuração de Wi-Fi",
    minFaq: 3,
  },
] as const;

for (const svc of SERVICES) {
  for (const b of BAIRROS_1A_CAMADA) {
    test(`bairro page: ${svc.key} × ${b.slug}`, async ({ page }) => {
      const res = await page.goto(`/servicos/${svc.key}/curitiba/${b.slug}`, {
        waitUntil: "domcontentloaded",
      });
      expect(res?.status(), "http status").toBe(200);

      // H1
      const h1 = await page.locator("h1").first().textContent();
      expect(h1, "H1").toContain(svc.label);
      expect(h1, "H1").toContain(b.nome);

      // Bloco FAQ visível
      await expect(page.locator('[data-testid="faq-accordion"]')).toBeVisible();

      // Botão de triagem presente e clicável
      const cta = page.locator('[data-testid="cta-triage-hero"]').first();
      await expect(cta).toBeVisible();

      // JSON-LD
      const blocks = await getJsonLdBlocks(page);
      const service = findByType<Record<string, unknown>>(blocks, "Service");
      const breadcrumb = findByType<Record<string, unknown>>(blocks, "BreadcrumbList");
      const faq = findByType<Record<string, unknown>>(blocks, "FAQPage");

      expect(service, "Service JSON-LD").toBeTruthy();
      expect(breadcrumb, "BreadcrumbList JSON-LD").toBeTruthy();
      expect(faq, "FAQPage JSON-LD").toBeTruthy();

      // areaServed contém o nome do bairro
      const provider = (service as { provider?: { areaServed?: { name?: string } } })?.provider;
      const areaName = provider?.areaServed?.name ?? "";
      expect(areaName, "areaServed.name").toContain(b.nome);

      // BreadcrumbList com pelo menos 3 níveis
      const items = (breadcrumb as { itemListElement?: unknown[] }).itemListElement ?? [];
      expect(items.length, "breadcrumb depth").toBeGreaterThanOrEqual(3);

      // FAQPage com perguntas mínimas
      const mainEntity = (faq as { mainEntity?: unknown[] }).mainEntity ?? [];
      expect(mainEntity.length, "FAQ min items").toBeGreaterThanOrEqual(svc.minFaq);
    });
  }
}
