import { test, expect } from "@playwright/test";
import { getJsonLdBlocks, findByType } from "./utils/jsonld";
import { BAIRROS_BY_CIDADE, CIDADE_REGIAO_META } from "../src/data/bairrosCidadesRegiao";

/**
 * Rodada 27.9 — Contratos automatizados para TODOS os bairros de Pinhais.
 *
 * Lista de bairros derivada de src/data/bairrosCidadesRegiao.ts (fonte única),
 * de modo que qualquer novo bairro passa a ser coberto automaticamente.
 *
 * Para cada combinação bairro × serviço valida:
 *  - HTTP 200 + H1 com nome do bairro + serviço
 *  - Bloco FAQ/triagem visível (accordion + CTA)
 *  - CTA de triagem carrega category, symptomSlug, city e neighborhood
 *    (política Rodada 26: porta única de contato é a triagem — WhatsApp
 *    direto está desativado no front, então validamos o payload que alimenta
 *    o funil, equivalente semântico do link do WhatsApp pré-preenchido)
 *  - JSON-LD Service / BreadcrumbList / FAQPage com todos os campos
 *    obrigatórios preenchidos (nada nulo, indefinido ou vazio)
 *  - A11y básica: toda <img> tem `alt` e a ordem de headings não pula níveis
 */

const BAIRROS_PINHAIS = BAIRROS_BY_CIDADE.pinhais.map((b) => ({
  slug: b.slug,
  nome: b.nome,
}));

const SERVICE_LABEL: Record<string, { label: string; minFaq: number }> = {
  "reparo-smart-tv": { label: "Reparo de Smart TV", minFaq: 3 },
  "configuracao-wifi": { label: "Configuração de Wi-Fi", minFaq: 3 },
  "troca-de-tela-tv": { label: "Troca de Tela", minFaq: 3 },
};

const SERVICES = CIDADE_REGIAO_META.pinhais.services.map((key) => ({
  key,
  ...SERVICE_LABEL[key],
}));

function nonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

for (const svc of SERVICES) {
  for (const b of BAIRROS_PINHAIS) {
    test(`bairro Pinhais: ${svc.key} × ${b.slug}`, async ({ page }) => {
      const res = await page.goto(`/servicos/${svc.key}/pinhais/${b.slug}`, {
        waitUntil: "domcontentloaded",
      });
      expect(res?.status(), "http status").toBe(200);

      // ---- H1 ----
      const h1 = await page.locator("h1").first().textContent();
      expect(h1, "H1").toContain(svc.label);
      expect(h1, "H1").toContain(b.nome);

      // ---- FAQ + CTA visíveis ----
      await expect(page.locator('[data-testid="faq-accordion"]')).toBeVisible();
      const cta = page.locator('[data-testid="cta-triage-hero"]').first();
      await expect(cta).toBeVisible();

      // ---- CTA carrega os 4 parâmetros de pré-classificação ----
      const attrs = await cta.evaluate((el) => ({
        category: el.getAttribute("data-triage-category"),
        symptom: el.getAttribute("data-triage-symptom"),
        city: el.getAttribute("data-triage-city"),
        neighborhood: el.getAttribute("data-triage-neighborhood"),
        source: el.getAttribute("data-triage-source"),
      }));
      expect(attrs.category, "data-triage-category").toBeTruthy();
      expect(attrs.symptom, "data-triage-symptom").toBeTruthy();
      expect(attrs.city, "data-triage-city").toBe("pinhais");
      expect(attrs.neighborhood, "data-triage-neighborhood").toBe(b.slug);
      expect(attrs.source, "data-triage-source").toBeTruthy();

      // ---- JSON-LD estrito ----
      const blocks = await getJsonLdBlocks(page);
      const service = findByType<Record<string, unknown>>(blocks, "Service");
      const breadcrumb = findByType<Record<string, unknown>>(blocks, "BreadcrumbList");
      const faq = findByType<Record<string, unknown>>(blocks, "FAQPage");

      expect(service, "Service JSON-LD").toBeTruthy();
      expect(breadcrumb, "BreadcrumbList JSON-LD").toBeTruthy();
      expect(faq, "FAQPage JSON-LD").toBeTruthy();

      // Service: campos obrigatórios
      expect(service!["@context"], "Service @context").toBe("https://schema.org");
      expect(nonEmptyString(service!.name), "Service.name").toBe(true);
      expect(nonEmptyString(service!.serviceType), "Service.serviceType").toBe(true);
      const provider = service!.provider as Record<string, unknown> | undefined;
      expect(provider, "Service.provider").toBeTruthy();
      expect(nonEmptyString(provider?.name as string), "Service.provider.name").toBe(true);
      const area = service!.areaServed as { name?: string } | undefined;
      expect(nonEmptyString(area?.name), "Service.areaServed.name").toBe(true);
      expect(area!.name!, "areaServed contém bairro").toContain(b.nome);
      expect(area!.name!, "areaServed contém Pinhais").toContain("Pinhais");

      // BreadcrumbList: cada item precisa ter position/name/item
      const items = (breadcrumb!.itemListElement as Array<Record<string, unknown>>) ?? [];
      expect(items.length, "breadcrumb depth (Início > pai > cidade > bairro)").toBeGreaterThanOrEqual(4);
      items.forEach((it, i) => {
        expect(it["@type"], `crumb[${i}] @type`).toBe("ListItem");
        expect(typeof it.position, `crumb[${i}].position`).toBe("number");
        expect(it.position, `crumb[${i}].position ordinal`).toBe(i + 1);
        expect(nonEmptyString(it.name as string), `crumb[${i}].name`).toBe(true);
        expect(nonEmptyString(it.item as string), `crumb[${i}].item`).toBe(true);
        expect((it.item as string).startsWith("http"), `crumb[${i}].item absolute`).toBe(true);
      });

      // FAQPage: cada item precisa ter name + acceptedAnswer.text
      const mainEntity = (faq!.mainEntity as Array<Record<string, unknown>>) ?? [];
      expect(mainEntity.length, "FAQ min items").toBeGreaterThanOrEqual(svc.minFaq);
      mainEntity.forEach((q, i) => {
        expect(q["@type"], `faq[${i}] @type`).toBe("Question");
        expect(nonEmptyString(q.name as string), `faq[${i}].name`).toBe(true);
        const answer = q.acceptedAnswer as Record<string, unknown> | undefined;
        expect(answer, `faq[${i}].acceptedAnswer`).toBeTruthy();
        expect(answer?.["@type"], `faq[${i}].acceptedAnswer @type`).toBe("Answer");
        expect(nonEmptyString(answer?.text as string), `faq[${i}].acceptedAnswer.text`).toBe(true);
      });

      // ---- A11y: imagens sem alt ----
      const imgsSemAlt = await page.evaluate(() =>
        Array.from(document.querySelectorAll("img"))
          .filter((img) => !img.hasAttribute("alt"))
          .map((img) => (img as HTMLImageElement).src),
      );
      expect(imgsSemAlt, "<img> sem alt").toEqual([]);

      // ---- A11y: ordem de headings sem pular níveis ----
      const headingLevels = await page.evaluate(() =>
        Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) =>
          Number(h.tagName.substring(1)),
        ),
      );
      expect(headingLevels[0], "primeiro heading é H1").toBe(1);
      for (let i = 1; i < headingLevels.length; i++) {
        const jump = headingLevels[i] - headingLevels[i - 1];
        expect(
          jump,
          `heading em posição ${i} pulou de H${headingLevels[i - 1]} para H${headingLevels[i]}`,
        ).toBeLessThanOrEqual(1);
      }
    });
  }
}
