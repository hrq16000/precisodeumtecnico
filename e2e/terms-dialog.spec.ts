import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Helper: abre o TermsDialog via QuickQuoteForm (única instância pública do
 * gatilho na home). Nome atual do trigger: "Termos de Orçamento Pré-Aprovado".
 */
async function openTermsFromQuickForm(page: Page) {
  const trigger = page
    .locator("label[for='terms-quick']")
    .getByRole("button", { name: /Termos de Orçamento Pré-Aprovado/i });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
}

test.describe("TermsDialog – flow + a11y", () => {
  test("Quick form: blocks submit until terms accepted", async ({ page }) => {
    await page.goto("/");

    // Submit atual do QuickQuoteForm.
    const submit = page.getByRole("button", { name: "Iniciar Triagem Técnica", exact: true });
    await submit.scrollIntoViewIfNeeded();

    // Preenche campos obrigatórios.
    await page.getByPlaceholder("Seu nome completo").fill("Tester E2E");
    await page.getByPlaceholder(/9999/).first().fill("(41) 99999-9999");

    // Submit deve estar desabilitado enquanto os termos não forem aceitos.
    await expect(submit).toBeDisabled();

    await openTermsFromQuickForm(page);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Aceite fecha o dialog e marca o checkbox.
    await dialog.getByTestId("terms-accept").click();
    await expect(dialog).toBeHidden();
    await expect(page.locator("#terms-quick")).toBeChecked();

    // Ainda falta o serviço, mas o botão já pode habilitar pelo aceite.
    await expect(submit).toBeEnabled();
  });

  test("TermsDialog exibe R$ 99,99 e R$ 299,99 e nunca R$ 90", async ({ page }) => {
    await page.goto("/");
    await openTermsFromQuickForm(page);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const body = await dialog.innerText();

    // Valores oficiais presentes.
    expect(body).toContain("R$ 99,99");
    expect(body).toContain("R$ 299,99");

    // Nenhuma variação legada.
    expect(body).not.toMatch(/R\$\s?90,00/);
    expect(body).not.toMatch(/R\$\s?90(?!\d)/);

    // Cancelamento cobre bancada/coleta/parceiros.
    expect(body.toLowerCase()).toContain("parceiros");

    // Pré-aprovado exclui peças/componentes/materiais.
    expect(body.toLowerCase()).toMatch(/peças|componentes|materiais/);
  });

  test("ESC closes the dialog and focus is trapped inside", async ({ page }) => {
    await page.goto("/");
    await openTermsFromQuickForm(page);

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Foco inicial dentro do dialog.
    const activeIsInside = await page.evaluate(() => {
      const d = document.querySelector("[role='dialog']");
      return !!d && d.contains(document.activeElement);
    });
    expect(activeIsInside).toBe(true);

    // Foco não escapa ao tabular.
    for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
    const stillInside = await page.evaluate(() => {
      const d = document.querySelector("[role='dialog']");
      return !!d && d.contains(document.activeElement);
    });
    expect(stillInside).toBe(true);

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

    await openTermsFromQuickForm(page);
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Impede navegação real ao clicar em "página completa".
    await page.evaluate(() => {
      document
        .querySelectorAll("a[href='/termos-orcamento-pre-aprovado']")
        .forEach((a) =>
          a.addEventListener("click", (e) => e.preventDefault(), { once: true }),
        );
    });
    await dialog.getByRole("link", { name: /Abrir página completa/i }).click();

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
    await openTermsFromQuickForm(page);
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
