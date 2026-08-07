/**
 * Rodada 3T — gate das três páginas empresariais novas.
 *
 * Valida, para /servicos/manutencao-preventiva-empresas,
 * /servicos/backup-para-empresas e /servicos/redes-e-wifi:
 *  - CTA empresarial visível acima da dobra em 360/390/430;
 *  - hierarquia de CTA (triagem primária + WhatsApp rastreável);
 *  - JSON-LD: WebPage + BreadcrumbList (Início › Empresas › página) + FAQPage;
 *  - âncoras do sumário apontando para blocos existentes;
 *  - ausência de overflow horizontal e de erros de console;
 *  - vocabulário residencial/sintoma fora do corpo empresarial.
 */
import { test, expect, type Page } from "@playwright/test";

const PAGES = [
  "/servicos/manutencao-preventiva-empresas",
  "/servicos/backup-para-empresas",
  "/servicos/redes-e-wifi",
];

const VIEWPORTS = [
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
];

async function jsonLd(page: Page): Promise<Record<string, unknown>[]> {
  const raw = await page.locator('script[type="application/ld+json"]').allTextContents();
  const out: Record<string, unknown>[] = [];
  for (const r of raw) {
    try {
      const parsed = JSON.parse(r);
      Array.isArray(parsed) ? out.push(...parsed) : out.push(parsed);
    } catch {
      throw new Error(`JSON-LD inválido: ${r.slice(0, 120)}`);
    }
  }
  return out;
}

for (const path of PAGES) {
  test.describe(path, () => {
    test("schemas WebPage + BreadcrumbList + FAQPage íntegros", async ({ page }) => {
      await page.goto(path);
      await page.waitForSelector("h1");
      const blocks = await jsonLd(page);
      const types = blocks.map((b) => b["@type"]);
      expect(types).toContain("WebPage");
      expect(types).toContain("BreadcrumbList");
      expect(types).toContain("FAQPage");

      const crumb = blocks.find((b) => b["@type"] === "BreadcrumbList") as {
        itemListElement: { name: string; position: number }[];
      };
      expect(crumb.itemListElement[0].name).toBe("Início");
      expect(crumb.itemListElement[1].name).toBe("Empresas");
      expect(crumb.itemListElement.length).toBeGreaterThanOrEqual(3);

      const faq = blocks.find((b) => b["@type"] === "FAQPage") as {
        mainEntity: { name: string; acceptedAnswer: { text: string } }[];
      };
      expect(faq.mainEntity.length).toBeGreaterThanOrEqual(6);
      for (const q of faq.mainEntity) {
        expect(q.name.length).toBeGreaterThan(10);
        expect(q.acceptedAnswer.text.length).toBeGreaterThan(30);
      }

      // Canonical único e coerente com a rota (sem alteração de URL).
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe(`https://precisodeumtecnico.com${path}`);
    });

    test("CTA empresarial acima da dobra e sem overflow em mobile", async ({ page }) => {
      for (const vp of VIEWPORTS) {
        await page.setViewportSize(vp);
        await page.goto(path);
        await page.waitForSelector("h1");

        const cta = page.locator("[data-triage-cta]").first();
        await expect(cta).toBeVisible();
        const box = await cta.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.y).toBeLessThan(750);
        expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 1);

        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollW).toBeLessThanOrEqual(vp.width + 1);
      }
    });

    test("WhatsApp do hero é rastreável e preserva contexto", async ({ page }) => {
      await page.goto(path);
      const wa = page.locator('[data-wa-tracked="b2b_hero"]').first();
      await expect(wa).toBeVisible();
      const href = await wa.getAttribute("href");
      expect(href).toContain("wa.me");
      expect(decodeURIComponent(href || "")).toContain("utm_source=whatsapp");

      await page.evaluate(() => {
        (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
      });
      await wa.evaluate((el: HTMLElement) => {
        el.setAttribute("target", "_self");
        el.setAttribute("href", "javascript:void(0)");
        el.click();
      });
      const events = await page.evaluate(
        () => ((window as unknown as { dataLayer: { event?: string }[] }).dataLayer || []).map((e) => e.event),
      );
      expect(events).toContain("whatsapp_click");
    });

    test("âncoras do sumário navegam para blocos existentes", async ({ page }) => {
      await page.goto(path);
      const anchors = page.locator('[data-page-toc] a[href^="#"]');
      const count = await anchors.count();
      expect(count).toBeGreaterThan(3);
      for (let i = 0; i < count; i++) {
        const href = await anchors.nth(i).getAttribute("href");
        const id = (href || "").replace("#", "");
        expect(id.length).toBeGreaterThan(0);
        await expect(page.locator(`#${id}`)).toHaveCount(1);
      }
    });

    test("sem erros de console e sem vocabulário residencial no corpo", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => {
        // Ignora avisos de dev do React vindos de componentes globais (Logo/Helmet).
        if (m.type() === "error" && !m.text().startsWith("Warning:")) errors.push(m.text());
      });
      await page.goto(path);
      await page.waitForSelector("h1");
      expect(errors).toEqual([]);

      const body = (await page.locator("article").innerText()).toLowerCase();
      for (const banned of ["ilimitado", "garantia vitalícia", "melhor preço", "seu notebook não liga"]) {
        expect(body).not.toContain(banned);
      }
      await expect(page.locator("h1")).toHaveCount(1);
    });
  });
}
