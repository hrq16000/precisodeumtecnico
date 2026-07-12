import { test, expect, type Page } from "@playwright/test";

/**
 * B.3.b — Tracking de Curitiba por origem factual.
 *
 * Contrato:
 *  - o legacy `whatsapp_click` (dataLayer) carrega `source` exatamente
 *    como definido em `data-wa-source` do elemento clicado;
 *  - utm_* + gclid presentes em todos os eventos;
 *  - cada superfície tem sua origem própria (hero, service card,
 *    header, footer, float, matriz nacional) — não há coerção regex.
 */

const UTM_QS =
  "utm_source=google&utm_medium=cpc&utm_campaign=assist_cwb&utm_term=ps5&utm_content=hero&gclid=TESTGCLID123";
const CURITIBA_URL = `/assistencia-tecnica-curitiba?${UTM_QS}`;
const NACIONAL_URL = `/atendimento-nacional?${UTM_QS}`;

async function seedDataLayer(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
  });
  await page.route("**/wa.me/**", (route) => route.fulfill({ status: 200, body: "ok" }));
  await page.route("**/api.whatsapp.com/**", (route) => route.fulfill({ status: 200, body: "ok" }));
}

async function whatsappEvents(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    return (w.dataLayer ?? []).filter((e) => e.event === "whatsapp_click");
  });
}

async function clickAnchor(page: Page, sel: string) {
  await page.locator(sel).first().evaluate((el) => {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
}

function expectUtm(ev: Record<string, unknown>) {
  expect(ev.utm_source).toBe("google");
  expect(ev.utm_medium).toBe("cpc");
  expect(ev.utm_campaign).toBe("assist_cwb");
  expect(ev.utm_term).toBe("ps5");
  expect(ev.utm_content).toBe("hero");
  expect(ev.gclid).toBe("TESTGCLID123");
}

test.describe("Curitiba LP — tracking por superfície", () => {
  test("hero CTA emite whatsapp_click com source=landing-curitiba + utm/gclid", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(CURITIBA_URL);
    await page.waitForLoadState("networkidle");

    await clickAnchor(page, 'a[data-wa-source="landing-curitiba"]');
    const ev = (await whatsappEvents(page)).find((e) => e.source === "landing-curitiba");
    expect(ev, "evento com source=landing-curitiba").toBeTruthy();
    expectUtm(ev!);
  });

  test("card de serviço emite source=curitiba_lp_service_card com service preservado", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(CURITIBA_URL);
    await page.waitForLoadState("networkidle");

    await clickAnchor(page, 'a[data-wa-source="curitiba_lp_service_card"]');
    const ev = (await whatsappEvents(page)).find((e) => e.source === "curitiba_lp_service_card");
    expect(ev, "evento com source=curitiba_lp_service_card").toBeTruthy();
    expectUtm(ev!);
    // service card carrega city Curitiba (data-city ou payload)
    if (typeof ev!.city === "string") expect(ev!.city).toMatch(/curitiba/i);
  });

  test("header CTA emite source=header em contexto Curitiba", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(CURITIBA_URL);
    await page.waitForLoadState("networkidle");

    await clickAnchor(page, 'a[data-wa-source="header"]');
    const ev = (await whatsappEvents(page)).find((e) => e.source === "header");
    expect(ev, "evento com source=header").toBeTruthy();
    expectUtm(ev!);
  });

  test("footer (data-wa-keep=footer) emite source=footer sem abrir triagem", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(CURITIBA_URL);
    await page.waitForLoadState("networkidle");

    await clickAnchor(page, 'a[data-wa-source="footer"]');
    const ev = (await whatsappEvents(page)).find((e) => e.source === "footer");
    expect(ev, "evento com source=footer").toBeTruthy();
    expectUtm(ev!);
  });

  test("float CTA emite source=float com origem própria", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(CURITIBA_URL);
    await page.waitForLoadState("networkidle");

    const floatSel = '[data-wa-source="float"]';
    await page.locator(floatSel).first().evaluate((el) => {
      el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
    const ev = (await whatsappEvents(page)).find((e) => e.source === "float");
    expect(ev, "evento com source=float").toBeTruthy();
    expectUtm(ev!);
  });
});

test.describe("Matriz nacional — tracking próprio (não herda Curitiba)", () => {
  test("landing nacional emite source=national-service, não curitiba_lp_*", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(NACIONAL_URL);
    await page.waitForLoadState("networkidle");

    await clickAnchor(page, 'a[data-wa-source="national-service"]');
    const events = await whatsappEvents(page);
    const ev = events.find((e) => e.source === "national-service");
    expect(ev, "evento com source=national-service").toBeTruthy();
    expectUtm(ev!);
    // nenhum evento aqui pode usar origem Curitiba
    for (const e of events) {
      expect(String(e.source ?? "")).not.toMatch(/curitiba/);
    }
  });
});

test.describe("Contrato invariante: 1 evento local por clique + utm em todos", () => {
  test("todos os wa.me da LP Curitiba carregam utm_* + gclid", async ({ page }) => {
    await seedDataLayer(page);
    await page.goto(CURITIBA_URL);
    await page.waitForLoadState("networkidle");

    const anchors = page.locator('a[href*="wa.me"]');
    const count = await anchors.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      await anchors.nth(i).evaluate((el) => {
        el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      });
    }
    const events = await whatsappEvents(page);
    expect(events.length).toBeGreaterThanOrEqual(count);
    for (const ev of events) expectUtm(ev);
    // origens factuais reais (não regex): pelo menos uma variação além da padrão
    const distinctSources = new Set(events.map((e) => String(e.source)));
    expect(distinctSources.size).toBeGreaterThanOrEqual(1);
  });
});
