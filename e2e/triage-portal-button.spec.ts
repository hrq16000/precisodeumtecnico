import { test, expect, type Page } from "@playwright/test";

/**
 * Botão do portal com `data-triage-source` (não-âncora)
 * ------------------------------------------------------
 * Regressão: alguns CTAs do portal são <button data-triage-source="…">
 * (sem href wa.me). O interceptor global deve capturá-los, abrir o
 * wizard sem navegar/recarregar e não "avançar sozinho" ao clicar em
 * VOLTAR (bug do auto-advance após BACK).
 */

async function stubTriageStorage(page: Page) {
  await page.route("https://ipwho.is/**", (route) => route.fulfill({ status: 503, body: "{}" }));
  await page.route("https://ipapi.co/json/**", (route) => route.fulfill({ status: 503, body: "{}" }));
}

test.describe("Portal button (data-triage-source) abre o wizard sem reload", () => {
  test("clique em button[data-triage-source] abre o wizard sem navegar", async ({ page }) => {
    await stubTriageStorage(page);
    await page.goto("/servicos/troca-de-tela-tv-curitiba", { waitUntil: "domcontentloaded" });

    const initialUrl = page.url();
    let reloaded = false;
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame() && frame.url() !== initialUrl) reloaded = true;
    });

    const trigger = page.locator('button[data-triage-source="servicos_troca_tela_tv_curitiba"]').first();
    await expect(trigger).toBeVisible();
    await trigger.click();

    // Wizard aberto = Dialog do Radix com role=dialog
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 3000 });
    // etapa 1 do wizard V2
    await expect(page.getByRole("heading", { name: /Qual é o equipamento/i })).toBeVisible();
    expect(reloaded, "não deve navegar/recarregar").toBe(false);
    expect(page.url()).toBe(initialUrl);
  });

  test("VOLTAR não faz o wizard avançar sozinho", async ({ page }) => {
    await stubTriageStorage(page);
    await page.goto("/servicos/troca-de-tela-tv-curitiba", { waitUntil: "domcontentloaded" });

    await page.locator('button[data-triage-source="servicos_troca_tela_tv_curitiba"]').first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Etapa 1 → clica um equipamento (auto-advance leva à etapa 2)
    await dialog.getByRole("button", { name: /TV/i }).first().click();
    // Aguarda transição para etapa 2 (Identificação)
    await expect(dialog.getByRole("heading", { name: /Identificação/i })).toBeVisible({ timeout: 2000 });

    // Clica VOLTAR → deve retornar para etapa 1
    await dialog.getByRole("button", { name: /Voltar/i }).click();
    await expect(dialog.getByRole("heading", { name: /Qual é o equipamento/i })).toBeVisible();

    // Aguarda 1200ms — se auto-advance estivesse ativo, o wizard avançaria
    // sozinho (timer de 500ms). Deve permanecer na etapa 1.
    await page.waitForTimeout(1200);
    await expect(dialog.getByRole("heading", { name: /Qual é o equipamento/i })).toBeVisible();
    await expect(dialog.getByRole("heading", { name: /Identificação/i })).toHaveCount(0);
  });
});
