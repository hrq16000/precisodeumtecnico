import { test, expect } from "@playwright/test";

/**
 * Rodada 28.1 — A etapa curta de qualificação (nome, bairro, urgência, sintoma)
 * precisa chegar ao analytics local antes de abrir o WhatsApp.
 */
test("qualificação da triagem envia campos para analytics", async ({ page }) => {
  await page.goto("/formatacao-de-computador-curitiba?e2e=1");

  await page.locator("[data-triage-cta]").first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // Evento de abertura registrado com a origem correta
  const events = await page.evaluate(
    () =>
      (window as unknown as { __PDT_ANALYTICS_QUEUE__?: Record<string, unknown>[] })
        .__PDT_ANALYTICS_QUEUE__ ?? [],
  );
  const open = events.find((e) => e.event === "triage_open");
  expect(open, "triage_open não registrado").toBeTruthy();
  expect(String(open!.source ?? "")).toContain("keyword_formatacao");
  expect(open!.page_path).toBe("/formatacao-de-computador-curitiba");
});
