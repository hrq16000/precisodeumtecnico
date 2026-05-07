import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("TermsDialog – flow + a11y", () => {
  test("Quick form: blocks submit until terms accepted", async ({ page }) => {
    await page.goto("/");

    // Locate the quick quote form section and its submit button
    const submit = page.getByRole("button", {
      name: /Solicitar Orçamento via WhatsApp/i,
    });
    await submit.scrollIntoViewIfNeeded();

    // Fill required fields
    await page.getByPlaceholder("Seu nome completo").fill("Tester E2E");
    await page.getByPlaceholder(/9999/).first().fill("(41) 99999-9999");

    // Submit must be disabled (terms not accepted)
    await expect(submit).toBeDisabled();

    // Open the Terms popup from inside the form
    await page
      .locator("label[for='terms-quick']")
      .getByRole("button", { name: /Termos de Orçamento Pré-Aprovado/i })
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Accept terms — should close dialog and tick checkbox
    await dialog.getByTestId("terms-accept").click();
    await expect(dialog).toBeHidden();
    await expect(page.locator("#terms-quick")).toBeChecked();

    // Submit now enabled
    await expect(submit).toBeEnabled();
  });

  test("ESC closes the dialog and focus is trapped inside", async ({ page }) => {
    await page.goto("/");

    // Open via Hero terms link
    await page
      .getByRole("button", { name: /Consulte os termos de orçamento pré-aprovado/i })
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Focus must live inside the dialog
    const activeIsInside = await page.evaluate(() => {
      const d = document.querySelector("[role='dialog']");
      return !!d && d.contains(document.activeElement);
    });
    expect(activeIsInside).toBe(true);

    // Tabbing should stay inside the dialog (focus trap)
    for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
    const stillInside = await page.evaluate(() => {
      const d = document.querySelector("[role='dialog']");
      return !!d && d.contains(document.activeElement);
    });
    expect(stillInside).toBe(true);

    // ESC closes
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("dataLayer receives terms_open / terms_accept / terms_full_page_click", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    });
    await page.goto("/");

    // Open dialog via the contact-like Quick form trigger
    await page
      .locator("label[for='terms-quick']")
      .getByRole("button", { name: /Termos de Orçamento Pré-Aprovado/i })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Click full-page link (prevent navigation)
    await page.evaluate(() => {
      document
        .querySelectorAll("a[href='/termos-orcamento-pre-aprovado']")
        .forEach((a) =>
          a.addEventListener("click", (e) => e.preventDefault(), { once: true }),
        );
    });
    await dialog.getByRole("link", { name: /Abrir página completa/i }).click();

    // Accept
    await dialog.getByTestId("terms-accept").click();

    const events = await page.evaluate(
      () =>
        ((window as unknown as { dataLayer: Array<{ event?: string; source?: string }> })
          .dataLayer ?? []).map((e) => ({ event: e.event, source: e.source })),
    );
    const names = events.map((e) => e.event);
    expect(names).toContain("terms_open");
    expect(names).toContain("terms_full_page_click");
    expect(names).toContain("terms_accept");

    // Sources are from the standardized vocabulary
    const allowed = new Set([
      "hero",
      "contact_form",
      "quick_form",
      "quiz",
      "bairro_page",
      "footer",
      undefined,
    ]);
    for (const e of events) expect(allowed.has(e.source)).toBe(true);
  });

  test("axe: no critical a11y violations on open dialog", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: /Consulte os termos de orçamento pré-aprovado/i })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include("[role='dialog']")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(
      serious,
      JSON.stringify(serious.map((v) => ({ id: v.id, nodes: v.nodes.length })), null, 2),
    ).toEqual([]);
  });
});
