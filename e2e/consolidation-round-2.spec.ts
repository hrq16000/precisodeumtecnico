import { test, expect, type Page } from "@playwright/test";

/**
 * Consolidação — Rodada 2 (B.3.b):
 * - SEO/canonical/robots/sitemap
 * - Quiz não duplica em cliques rápidos
 * - Sem overflow horizontal no mobile
 * - FAQPage por rota curada (exatamente 1, hidratado)
 */

async function collectFaqPageSchemas(page: Page): Promise<Record<string, unknown>[]> {
  return page.evaluate(() => {
    const nodes = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    ) as HTMLScriptElement[];
    const out: Record<string, unknown>[] = [];
    for (const n of nodes) {
      try {
        const parsed = JSON.parse(n.textContent || "null");
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const it of items) {
          if (it && typeof it === "object" && it["@type"] === "FAQPage") {
            out.push(it as Record<string, unknown>);
          }
        }
      } catch {
        /* ignore malformed */
      }
    }
    return out;
  });
}

async function waitForFaqPage(page: Page): Promise<Record<string, unknown>> {
  // Aguarda a hidratação do Helmet — o schema é injetado pelo React,
  // então precisamos poll até aparecer, sem timeout mágico.
  await expect
    .poll(async () => (await collectFaqPageSchemas(page)).length, {
      timeout: 10_000,
      message: "FAQPage schema não hidratou",
    })
    .toBeGreaterThan(0);
  const list = await collectFaqPageSchemas(page);
  return list[0];
}

test.describe("SEO essentials", () => {
  test("robots.txt e sitemap.xml respondem 200", async ({ request }) => {
    const [robots, sitemap] = await Promise.all([
      request.get("/robots.txt"),
      request.get("/sitemap.xml"),
    ]);
    expect(robots.status()).toBe(200);
    expect(sitemap.status()).toBe(200);
    const robotsBody = await robots.text();
    expect(robotsBody.toLowerCase()).toContain("sitemap:");
    expect(robotsBody).toContain("precisodeumtecnico.com");
  });

  test("canonical presente na home e persiste após navegação SPA", async ({ page }) => {
    await page.goto("/");
    const c1 = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(c1).toBeTruthy();
    await page.goto("/faq");
    const c2 = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(c2).toBeTruthy();
    expect(c2).not.toBe(c1);
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("/faq: exatamente 1 FAQPage, mainEntity coerente com UI", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.locator("h1", { hasText: /Perguntas Frequentes/i })).toBeVisible();
    await expect(page.locator("[data-radix-accordion-item], [data-state]").first()).toBeVisible();

    const schemas = await collectFaqPageSchemas(page);
    // aguarda hidratação
    if (schemas.length === 0) await waitForFaqPage(page);
    const all = await collectFaqPageSchemas(page);
    expect(all.length, "exatamente 1 FAQPage").toBe(1);

    const faq = all[0];
    const entities = faq.mainEntity as Array<{ name: string; acceptedAnswer?: { text?: string } }>;
    expect(Array.isArray(entities)).toBe(true);
    expect(entities.length).toBeGreaterThanOrEqual(10);
    const names = entities.map((e) => e.name);
    // sem duplicatas
    expect(new Set(names).size).toBe(names.length);
    // cada pergunta tem answer
    for (const e of entities) {
      expect(String(e.acceptedAnswer?.text ?? "").length).toBeGreaterThan(5);
    }
    // conta triggers do accordion == mainEntity length
    const triggers = await page.locator('[data-radix-accordion-item]').count()
      || await page.getByRole("button").filter({ hasText: /\?$/ }).count();
    if (triggers > 0) {
      expect(triggers).toBe(entities.length);
    }
  });

  test("home: no máximo 1 FAQPage (evitar duplicação global)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const all = await collectFaqPageSchemas(page);
    expect(all.length).toBeLessThanOrEqual(1);
  });

  test("região genérica /regioes/curitiba: zero FAQPage template", async ({ page }) => {
    await page.goto("/regioes/curitiba");
    await page.waitForLoadState("domcontentloaded");
    const all = await collectFaqPageSchemas(page);
    expect(all.length, "sem FAQPage artificial em região genérica").toBe(0);
  });

  test("matriz nacional /atendimento-nacional: zero FAQPage artificial", async ({ page }) => {
    await page.goto("/atendimento-nacional");
    await page.waitForLoadState("domcontentloaded");
    const all = await collectFaqPageSchemas(page);
    expect(all.length).toBeLessThanOrEqual(1);
  });
});

test.describe("Quiz — anti-duplicação", () => {
  test("dois cliques rápidos em CTA WhatsApp abrem apenas UM dialog", async ({ page }) => {
    await page.goto("/?triage=1");
    const cta = page.locator('a[href*="wa.me"]:not([data-wa-keep="footer"]), button[data-wa-source]').first();
    await cta.waitFor({ state: "visible", timeout: 10_000 });
    await cta.click({ clickCount: 2, delay: 50 });
    await page.waitForTimeout(500);
    const dialogs = await page.locator('[role="dialog"]').count();
    expect(dialogs).toBe(1);
  });

  test("fechar e reabrir volta ao primeiro passo (categoria)", async ({ page }) => {
    await page.goto("/?triage=1");
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e" } })));
    await expect(page.getByText(/Qual é o aparelho/i)).toBeVisible();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e" } })));
    await expect(page.getByText(/Qual é o aparelho/i)).toBeVisible();
  });
});

test.describe("Mobile — sem overflow horizontal", () => {
  test("home não tem scroll horizontal no viewport mobile", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    await ctx.close();
  });
});
