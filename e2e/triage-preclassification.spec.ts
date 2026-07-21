import { test, expect } from "@playwright/test";

/**
 * Pré-classificação da triagem
 * -----------------------------
 * Cada botão "Iniciar triagem" das páginas de serviço Curitiba deve
 * disparar `triage:open` com `category` e `symptomSlug` corretos, sem
 * mapeamentos trocados (ex.: página de Wi-Fi enviando categoria `tv`).
 *
 * Bloqueamos a abertura do wizard V2 substituindo o listener na página
 * e apenas coletamos o evento CustomEvent.detail.
 */

type CapturedTriageEvent = {
  source?: string;
  category?: string;
  symptomSlug?: string;
};

async function captureNextTriageEvent(
  page: import("@playwright/test").Page,
  triggerSelector: string,
): Promise<CapturedTriageEvent> {
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
  const detail = await page.evaluate(
    () => (window as unknown as { __CAPTURED_TRIAGE__?: CapturedTriageEvent }).__CAPTURED_TRIAGE__,
  );
  return detail ?? {};
}

const CASES: Array<{
  path: string;
  triggerSelector: string;
  expectedCategory: string;
  expectedSymptomSlug: string;
}> = [
  {
    path: "/servicos/troca-de-tela-tv-curitiba",
    triggerSelector: '[data-triage-source="servicos_troca_tela_tv_curitiba"]',
    expectedCategory: "tv",
    expectedSymptomSlug: "tv-tela-quebrada",
  },
  {
    path: "/servicos/reparo-smart-tv-curitiba",
    triggerSelector: '[data-triage-source="servicos_reparo_smart_tv_curitiba"]',
    expectedCategory: "tv",
    expectedSymptomSlug: "tv-smart-travando-apps",
  },
  {
    path: "/servicos/configuracao-wifi-curitiba",
    triggerSelector: '[data-triage-source="servicos_configuracao_wifi_curitiba"]',
    expectedCategory: "pc",
    expectedSymptomSlug: "wifi-lento-instavel",
  },
];

// Rodada 27.3 — replicação regional (SJP, Pinhais, Colombo)
const REGIONAL_CITIES = ["sao-jose-dos-pinhais", "pinhais", "colombo"] as const;
const REGIONAL_SERVICES = [
  { path: "reparo-smart-tv", category: "tv", symptom: "tv-smart-travando-apps" },
  { path: "troca-de-tela-tv", category: "tv", symptom: "tv-tela-quebrada" },
  { path: "configuracao-wifi", category: "pc", symptom: "wifi-lento-instavel" },
] as const;
for (const svc of REGIONAL_SERVICES) {
  for (const city of REGIONAL_CITIES) {
    const source = `servicos_${svc.path.replace(/-/g, "_")}_${city.replace(/-/g, "_")}`;
    CASES.push({
      path: `/servicos/${svc.path}/${city}`,
      triggerSelector: `[data-triage-source="${source}"]`,
      expectedCategory: svc.category,
      expectedSymptomSlug: svc.symptom,
    });
  }
}

for (const c of CASES) {
  test(`pré-classificação correta em ${c.path}`, async ({ page }) => {
    await page.goto(c.path, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(c.triggerSelector);
    const detail = await captureNextTriageEvent(page, c.triggerSelector);
    expect(detail.category, "category").toBe(c.expectedCategory);
    expect(detail.symptomSlug, "symptomSlug").toBe(c.expectedSymptomSlug);
    expect(detail.source, "source").toBeTruthy();
  });
}

test("cards do catálogo de sintomas em /assistencia-tecnica-curitiba passam symptomSlug", async ({ page }) => {
  await page.goto("/assistencia-tecnica-curitiba", { waitUntil: "domcontentloaded" });
  const trigger = page.locator("[data-symptom-slug]").first();
  if ((await trigger.count()) === 0) {
    test.skip(true, "Nenhum card de sintoma renderizado — cobertura opcional");
    return;
  }
  const expectedSlug = await trigger.getAttribute("data-symptom-slug");
  const detail = await captureNextTriageEvent(page, "[data-symptom-slug]");
  expect(detail.symptomSlug).toBe(expectedSlug);
  expect(detail.category).toBeTruthy();
});
