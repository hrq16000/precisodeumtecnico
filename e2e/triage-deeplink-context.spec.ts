import { test, expect } from "@playwright/test";

/**
 * Rodada 4J — Pré-seleção de contexto no deep-link #agendamento.
 * O contexto é gravado em sessionStorage (pdt_triage_deeplink_v1) e no
 * rascunho do wizard (pdt_triage_draft_v1), sem inventar cidade/bairro.
 */

test("deep-link pré-seleciona equipamento/sintoma pela rota do cluster", async ({ page }) => {
  await page.goto("/formatacao-de-computador-curitiba#agendamento");
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 15_000 });

  const ctx = await page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem("pdt_triage_deeplink_v1") ?? "null"),
  );
  expect(ctx?.context?.equipment).toBe("pc_notebook");
  expect(ctx?.context?.symptom).toBeTruthy();
  // Nunca inventa localidade
  expect(ctx?.context?.city).toBeUndefined();

  const draft = await page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem("pdt_triage_draft_v1") ?? "null"),
  );
  expect(draft?.state?.equipment).toBe("pc_notebook");
});

test("querystring define cidade/bairro e o contexto sobrevive ao reload", async ({ page }) => {
  await page.goto("/?cidade=Curitiba&bairro=Merc%C3%AAs&servico=virus#triagem");
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 15_000 });

  const ctx = await page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem("pdt_triage_deeplink_v1") ?? "null"),
  );
  expect(ctx?.context?.city).toBe("Curitiba");
  expect(ctx?.context?.neighborhood).toBe("Mercês");
  expect(ctx?.context?.equipment).toBe("pc_notebook");

  await page.reload();
  const after = await page.evaluate(() =>
    JSON.parse(window.sessionStorage.getItem("pdt_triage_deeplink_v1") ?? "null"),
  );
  expect(after?.context?.city).toBe("Curitiba");
  expect(after?.context?.neighborhood).toBe("Mercês");
});

test("abertura por deep-link registra analytics com superfície própria", async ({ page }) => {
  await page.goto("/precos#agendamento");
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 15_000 });

  const events = await page.evaluate(
    () =>
      (window as unknown as { __PDT_ANALYTICS_QUEUE__?: Record<string, unknown>[] })
        .__PDT_ANALYTICS_QUEUE__ ?? [],
  );
  const open = events.find((e) => e.event === "triage_open" && e.surface === "deeplink_hash");
  expect(open, "triage_open com surface deeplink_hash não registrado").toBeTruthy();
  expect(open!.page_path).toBe("/precos");
});
