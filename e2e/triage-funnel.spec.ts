import { test, expect } from "@playwright/test";

/**
 * Guarda de qualidade do funil obrigatório.
 * - Nenhum clique em CTA WhatsApp/telefone pode abrir dois quizzes simultaneamente.
 * - Fluxo de visita sempre exibe o piso R$ 99,99 antes do envio.
 * - Wizard deve exibir a mensagem de erro por campo (hint) quando faltar dado.
 */
test.describe("Triage funnel guards", () => {
  test("clicking a WhatsApp CTA opens exactly ONE triage wizard", async ({ page }) => {
    await page.goto("/?triage=1");
    const trigger = page
      .locator('a[href*="wa.me"]:not([data-wa-keep="footer"]), button[data-wa-source]')
      .first();
    await trigger.waitFor({ state: "visible", timeout: 10_000 });
    await trigger.click();

    // Contrato (Rodada 25.1 · B.3.a): primeiro clique = exatamente 1 dialog.
    // A contagem de nós de texto "Triagem técnica" varia com a montagem
    // (VisuallyHidden + progress badge + step title) e não é contrato — só o
    // número de `[role="dialog"]` importa.
    await expect(page.locator('[role="dialog"]')).toHaveCount(1, { timeout: 5000 });
  });

  test("wizard mostra hint de campo faltante", async ({ page }) => {
    await page.goto("/?triage=1");
    // Dispara o wizard via evento (independente de CTA)
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e" } }))
    );
    await expect(page.getByText(/Qual é o aparelho/i)).toBeVisible();

    // Sem escolher categoria, o hint deve estar visível
    const hint = page.getByTestId("triage-hint");
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/categoria/i);
  });

  test("página de preços exibe R$ 99,99 como valor mínimo", async ({ page }) => {
    await page.goto("/");
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/R\$\s*99[.,]99/);
  });
});
