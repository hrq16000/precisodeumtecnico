import { test, expect } from "@playwright/test";
import { getJsonLdBlocks, findByType } from "./utils/jsonld";

/**
 * Rodada 27.7 — Contratos automatizados por bairro de São José dos Pinhais.
 * Valida os 6 bairros de SJP para ambos os serviços:
 *  - HTTP 200 + H1 com nome do bairro + serviço
 *  - Bloco FAQ/triagem visível (accordion + CTA)
 *  - JSON-LD Service com areaServed contendo o bairro + "São José dos Pinhais"
 *  - JSON-LD BreadcrumbList com 4 níveis (Início > pai > cidade > bairro)
 *  - JSON-LD FAQPage com pelo menos 3 perguntas
 */

const BAIRROS_SJP = [
  { slug: "centro", nome: "Centro" },
  { slug: "afonso-pena", nome: "Afonso Pena" },
  { slug: "cidade-jardim", nome: "Cidade Jardim" },
  { slug: "guatupe", nome: "Guatupê" },
  { slug: "sao-cristovao", nome: "São Cristóvão" },
  { slug: "boneca-do-iguacu", nome: "Boneca do Iguaçu" },
] as const;

const SERVICES = [
  { key: "reparo-smart-tv", label: "Reparo de Smart TV", minFaq: 3 },
  { key: "configuracao-wifi", label: "Configuração de Wi-Fi", minFaq: 3 },
] as const;

for (const svc of SERVICES) {
  for (const b of BAIRROS_SJP) {
    test(`bairro SJP: ${svc.key} × ${b.slug}`, async ({ page }) => {
      const res = await page.goto(`/servicos/${svc.key}/sao-jose-dos-pinhais/${b.slug}`, {
        waitUntil: "domcontentloaded",
      });
      expect(res?.status(), "http status").toBe(200);

      const h1 = await page.locator("h1").first().textContent();
      expect(h1, "H1").toContain(svc.label);
      expect(h1, "H1").toContain(b.nome);

      await expect(page.locator('[data-testid="faq-accordion"]')).toBeVisible();
      await expect(page.locator('[data-testid="cta-triage-hero"]').first()).toBeVisible();

      const blocks = await getJsonLdBlocks(page);
      const service = findByType<Record<string, unknown>>(blocks, "Service");
      const breadcrumb = findByType<Record<string, unknown>>(blocks, "BreadcrumbList");
      const faq = findByType<Record<string, unknown>>(blocks, "FAQPage");

      expect(service, "Service JSON-LD").toBeTruthy();
      expect(breadcrumb, "BreadcrumbList JSON-LD").toBeTruthy();
      expect(faq, "FAQPage JSON-LD").toBeTruthy();

      const area = (service as { areaServed?: { name?: string } })?.areaServed;
      const areaName = area?.name ?? "";
      expect(areaName, "areaServed.name").toContain(b.nome);
      expect(areaName, "areaServed.name (cidade)").toContain("São José dos Pinhais");

      const items = (breadcrumb as { itemListElement?: unknown[] }).itemListElement ?? [];
      expect(items.length, "breadcrumb depth (Início > pai > cidade > bairro)").toBeGreaterThanOrEqual(4);

      const mainEntity = (faq as { mainEntity?: unknown[] }).mainEntity ?? [];
      expect(mainEntity.length, "FAQ min items").toBeGreaterThanOrEqual(svc.minFaq);
    });
  }
}
