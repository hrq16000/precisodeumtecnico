import { test, expect, type Page } from "@playwright/test";

/**
 * Contratos de telemetria da triagem:
 *  - `triage_step_next` disparado UMA vez por avanço manual (botão Próximo),
 *     com `step_id` e `step_index` da etapa de origem.
 *  - `triage_abandoned` disparado no unmount do wizard quando o usuário
 *    fecha antes de concluir, com step_id/step_index do momento.
 */

type Evt = Record<string, unknown> & { event?: string };

async function readQueue(page: Page): Promise<Evt[]> {
  return page.evaluate(
    () => (window as unknown as { __PDT_ANALYTICS_QUEUE__?: Evt[] }).__PDT_ANALYTICS_QUEUE__ ?? [],
  );
}

async function stubGeoIP(page: Page) {
  await page.route("https://ipwho.is/**", (r) => r.fulfill({ status: 503, body: "{}" }));
  await page.route("https://ipapi.co/json/**", (r) => r.fulfill({ status: 503, body: "{}" }));
}

test.describe("Triage lifecycle events", () => {
  test("avanço manual emite triage_step_next exatamente uma vez com step_id/step_index", async ({ page }) => {
    await stubGeoIP(page);
    await page.goto("/servicos/troca-de-tela-tv-curitiba", { waitUntil: "domcontentloaded" });

    await page.locator('button[data-triage-source="servicos_troca_tela_tv_curitiba"]').first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Navega até a etapa `serviceRoute` (a única que exige clique manual,
    // sem auto-advance), passando por TV → LED → screen_broken → hoje.
    await dialog.getByRole("button", { name: /^TV$/i }).first().click();
    await dialog.getByRole("button", { name: /^LED$/i }).first().click();
    await dialog.getByRole("button", { name: /Tela quebrada/i }).first().click();
    await dialog.getByRole("button", { name: /^Hoje$/i }).first().click();

    // Aguarda a modalidade calculada (etapa 5 · Modalidade).
    await expect(dialog.getByRole("heading", { name: /Modalidade/i })).toBeVisible({ timeout: 10_000 });

    // Limpa fila para isolar o avanço manual seguinte.
    await page.evaluate(() => {
      (window as unknown as { __PDT_ANALYTICS_QUEUE__: Evt[] }).__PDT_ANALYTICS_QUEUE__ = [];
    });

    await dialog.getByRole("button", { name: /Próxima etapa/i }).click();

    await page.waitForFunction(() => {
      const q = (window as unknown as { __PDT_ANALYTICS_QUEUE__?: Evt[] }).__PDT_ANALYTICS_QUEUE__ ?? [];
      return q.some((e) => e.event === "triage_step_next");
    });

    const q = await readQueue(page);
    const stepNext = q.filter((e) => e.event === "triage_step_next");
    expect(stepNext.length).toBe(1);
    expect(stepNext[0].step_id).toBe("serviceRoute");
    expect(typeof stepNext[0].step_index).toBe("number");

  });

  test("fechar wizard antes de concluir emite triage_abandoned com step atual", async ({ page }) => {
    await stubGeoIP(page);
    await page.goto("/servicos/troca-de-tela-tv-curitiba", { waitUntil: "domcontentloaded" });

    await page.locator('button[data-triage-source="servicos_troca_tela_tv_curitiba"]').first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Avança para etapa 2 (symptom via auto-advance) e depois clica em um sintoma
    // para chegar em contextualAnswers (index 3).
    await dialog.getByRole("button", { name: /^TV$/i }).first().click();
    await expect(dialog.getByRole("heading", { name: /Identificação/i })).toBeVisible();

    // Limpa fila para isolar o abandono.
    await page.evaluate(() => {
      (window as unknown as { __PDT_ANALYTICS_QUEUE__: Evt[] }).__PDT_ANALYTICS_QUEUE__ = [];
    });

    // Fecha o wizard pelo botão X (aria-label "Fechar triagem").
    await dialog.getByRole("button", { name: /Fechar/i }).first().click();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await page.waitForFunction(() => {
      const q = (window as unknown as { __PDT_ANALYTICS_QUEUE__?: Evt[] }).__PDT_ANALYTICS_QUEUE__ ?? [];
      return q.some((e) => e.event === "triage_abandoned");
    });

    const q = await readQueue(page);
    const abandoned = q.filter((e) => e.event === "triage_abandoned");
    expect(abandoned.length).toBeGreaterThanOrEqual(1);
    expect(abandoned[0].step_id).toBeTruthy();
    expect(typeof abandoned[0].step_index).toBe("number");
    expect(abandoned[0].completion_status).toBe("abandoned");
  });
});
