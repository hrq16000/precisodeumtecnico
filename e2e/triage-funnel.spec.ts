import { test, expect } from "@playwright/test";

/**
 * B.3.b — Guarda de qualidade do funil obrigatório.
 * Cada teste roda em contexto isolado (beforeEach limpa storage).
 * Contratos:
 *   - primeiro clique em CTA = exatamente 1 [role="dialog"];
 *   - clique fora NÃO fecha (onPointerDownOutside/onInteractOutside bloqueados);
 *   - ESC fecha, botão X fecha;
 *   - após fechar, dialogs=0 e body clicável de novo;
 *   - hint por campo aparece quando faltar dado.
 */

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test.describe("Triage funnel guards", () => {
  test("clicking a WhatsApp CTA opens exactly ONE triage wizard", async ({ page }) => {
    await page.goto("/?triage=1");
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    const trigger = page
      .locator('a[href*="wa.me"]:not([data-wa-keep="footer"]), button[data-wa-source]')
      .first();
    await trigger.waitFor({ state: "visible", timeout: 10_000 });
    await trigger.click();
    await expect(page.locator('[role="dialog"]')).toHaveCount(1, { timeout: 5000 });
  });

  test("clique fora do dialog NÃO fecha (contrato B.3.a)", async ({ page }) => {
    await page.goto("/?triage=1");
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e" } })),
    );
    await expect(page.locator('[role="dialog"]')).toHaveCount(1);
    // clique no overlay/backdrop
    await page.mouse.click(5, 5);
    await page.waitForTimeout(300);
    await expect(page.locator('[role="dialog"]')).toHaveCount(1);
  });

  test("ESC fecha e body volta clicável", async ({ page }) => {
    await page.goto("/?triage=1");
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e" } })),
    );
    await expect(page.locator('[role="dialog"]')).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"]')).toHaveCount(0, { timeout: 3000 });
    // body deve estar sem pointer-events lock
    const style = await page.evaluate(() => getComputedStyle(document.body).pointerEvents);
    expect(style).not.toBe("none");
  });

  test("fechar e reabrir volta ao passo inicial", async ({ page }) => {
    await page.goto("/?triage=1");
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e" } })),
    );
    await expect(page.getByText(/Qual é o aparelho/i)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"]')).toHaveCount(0, { timeout: 3000 });
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e" } })),
    );
    await expect(page.getByText(/Qual é o aparelho/i)).toBeVisible();
  });

  test("wizard mostra hint de campo faltante", async ({ page }) => {
    await page.goto("/?triage=1");
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e" } })),
    );
    await expect(page.getByText(/Qual é o aparelho/i)).toBeVisible();
    const hint = page.getByTestId("triage-hint");
    await expect(hint).toBeVisible();
    await expect(hint).toContainText(/categoria/i);
  });

  test("página inicial exibe R$ 99,99 como valor mínimo", async ({ page }) => {
    await page.goto("/");
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/R\$\s*99[.,]99/);
  });
});
