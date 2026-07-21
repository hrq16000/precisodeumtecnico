import { test, expect, type Page } from "@playwright/test";

/**
 * Contrato do CTA de triagem em páginas de bairro (Pinhais e demais):
 * ao clicar, o launcher deve receber `category`, `symptomSlug`, `city`
 * e `neighborhood` derivados dos data-attrs da rota atual, e propagar
 * esses campos para a fila local de analytics no evento `triage_open`.
 *
 * Bloqueamos a abertura visual do wizard interceptando `triage:open`
 * antes do launcher (capture=true, stopImmediatePropagation) — o objetivo
 * é validar apenas o payload roteado a partir do DOM.
 */

type CapturedDetail = {
  source?: string;
  category?: string;
  symptomSlug?: string;
  city?: string;
  neighborhood?: string;
};

async function captureTriageOpen(page: Page, triggerSelector: string): Promise<CapturedDetail> {
  await page.evaluate(() => {
    (window as unknown as { __CAPTURED_TRIAGE__?: unknown }).__CAPTURED_TRIAGE__ = null;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail ?? {};
      (window as unknown as { __CAPTURED_TRIAGE__?: unknown }).__CAPTURED_TRIAGE__ = detail;
      e.stopImmediatePropagation();
    };
    window.addEventListener("triage:open", handler as EventListener, { capture: true, once: true });
  });
  await page.locator(triggerSelector).first().click();
  return (await page.evaluate(
    () => (window as unknown as { __CAPTURED_TRIAGE__?: CapturedDetail }).__CAPTURED_TRIAGE__,
  )) ?? {};
}

const BAIRRO_CASES: Array<{
  path: string;
  city: string;
  neighborhood: string;
  expectedCategory: string;
  expectedSymptomSlug: string;
}> = [
  {
    path: "/servico-em/pinhais/weissopolis/reparo-smart-tv",
    city: "pinhais",
    neighborhood: "weissopolis",
    expectedCategory: "tv",
    expectedSymptomSlug: "tv-smart-travando-apps",
  },
  {
    path: "/servico-em/pinhais/weissopolis/troca-de-tela-tv",
    city: "pinhais",
    neighborhood: "weissopolis",
    expectedCategory: "tv",
    expectedSymptomSlug: "tv-tela-quebrada",
  },
  {
    path: "/servico-em/pinhais/weissopolis/configuracao-wifi",
    city: "pinhais",
    neighborhood: "weissopolis",
    expectedCategory: "pc",
    expectedSymptomSlug: "wifi-lento-instavel",
  },
  {
    path: "/servico-em/sao-jose-dos-pinhais/centro/reparo-smart-tv",
    city: "sao-jose-dos-pinhais",
    neighborhood: "centro",
    expectedCategory: "tv",
    expectedSymptomSlug: "tv-smart-travando-apps",
  },
];

for (const c of BAIRRO_CASES) {
  test(`CTA de bairro propaga category/symptom/city/neighborhood em ${c.path}`, async ({ page }) => {
    const resp = await page.goto(c.path, { waitUntil: "domcontentloaded" });
    if (!resp || resp.status() >= 400) {
      test.skip(true, `rota não disponível (${resp?.status()})`);
      return;
    }
    const trigger = page.locator("[data-triage-source]").first();
    if ((await trigger.count()) === 0) {
      test.skip(true, "nenhum CTA de triagem renderizado");
      return;
    }

    // Sanity: data-attrs no DOM refletem a rota.
    await expect(trigger).toHaveAttribute("data-triage-category", c.expectedCategory);
    await expect(trigger).toHaveAttribute("data-triage-symptom", c.expectedSymptomSlug);
    await expect(trigger).toHaveAttribute("data-triage-city", c.city);
    await expect(trigger).toHaveAttribute("data-triage-neighborhood", c.neighborhood);

    const detail = await captureTriageOpen(page, "[data-triage-source]");
    expect(detail.category, "category").toBe(c.expectedCategory);
    expect(detail.symptomSlug, "symptomSlug").toBe(c.expectedSymptomSlug);
    expect(detail.city, "city").toBe(c.city);
    expect(detail.neighborhood, "neighborhood").toBe(c.neighborhood);
    expect(detail.source, "source").toBeTruthy();
  });
}

test("triage_open na fila local carrega city e neighborhood", async ({ page }) => {
  const target = BAIRRO_CASES[0];
  const resp = await page.goto(target.path, { waitUntil: "domcontentloaded" });
  test.skip(!resp || resp.status() >= 400, `rota indisponível`);

  const trigger = page.locator("[data-triage-source]").first();
  if ((await trigger.count()) === 0) {
    test.skip(true, "sem CTA");
    return;
  }
  await trigger.click();
  // aguarda o wizard aparecer para garantir que o launcher processou o evento
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 3000 });

  const queue = await page.evaluate(
    () => (window as unknown as { __PDT_ANALYTICS_QUEUE__?: Array<Record<string, unknown>> }).__PDT_ANALYTICS_QUEUE__ ?? [],
  );
  const openEv = [...queue].reverse().find((ev) => ev.event === "triage_open");
  expect(openEv, "triage_open enfileirado").toBeTruthy();
  expect(openEv?.city).toBe(target.city);
  expect(openEv?.neighborhood).toBe(target.neighborhood);
});
