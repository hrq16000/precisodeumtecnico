import { test, expect, type Page } from "@playwright/test";

/**
 * Rodada 21 — Handoff final da triagem para diferentes contextos.
 *
 * Regra: o wa.me gerado pelo TriageWizard.success sempre carrega
 *  - source=triage
 *  - service=assistencia-tecnica
 *  - utm_source=whatsapp_cta
 *  - page=/… (preservado em campo separado, NUNCA sobrescrevendo source=triage)
 *
 * Rodamos a triagem em 3 cenários (com localização, sem localização,
 * com localização parcial) para garantir que o contrato do handoff
 * é estável independente do contexto do usuário.
 */

function decodeText(href: string): string {
  return decodeURIComponent(new URL(href).searchParams.get("text") || "");
}

async function mockWrites(page: Page) {
  await page.route("https://ipwho.is/**", (r) => r.fulfill({ status: 503, body: "{}" }));
  await page.route("https://ipapi.co/json/**", (r) => r.fulfill({ status: 503, body: "{}" }));
  await page.route("**/rest/v1/**", (r) => r.fulfill({ status: 201, contentType: "application/json", body: "[]" }));
  await page.route("**/functions/v1/**", (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
  );
}

async function completeConsoleTriage(page: Page) {
  await page.getByRole("button", { name: /Console/i }).click();
  await page.getByRole("button", { name: /Avançar/i }).click();
  await page.getByLabel("Marca").fill("Sony");
  await page.getByLabel("Modelo").fill("PS5");
  await page.getByRole("button", { name: /Avançar/i }).click();
  await page.getByRole("button", { name: /PS5 ejetando/i }).click();
  await page.getByRole("button", { name: /Avançar/i }).click();
  await page.getByLabel("Nome completo").fill("Cliente Teste");
  await page.getByRole("textbox", { name: "WhatsApp" }).fill("41999999999");
  await page.getByLabel("E-mail").fill("cliente@example.com");
  await page.getByRole("button", { name: /Avançar/i }).click();
  const cbs = page.getByRole("checkbox");
  for (let i = 0; i < (await cbs.count()); i += 1) await cbs.nth(i).check();
  await page.getByRole("button", { name: /Enviar triagem/i }).click();
  await expect(page.getByRole("heading", { name: /Triagem enviada/i })).toBeVisible({ timeout: 10_000 });
}

function assertTriageHandoff(text: string) {
  expect(text).toContain("source=triage");
  expect(text).toContain("service=assistencia-tecnica");
  expect(text).toContain("utm_source=whatsapp_cta");
  // page= sempre presente e separado de source=triage
  const pageMatch = text.match(/(?:^|\n|\s)(page|origin_page)=([^\s\n]+)/);
  expect(pageMatch, "page/origin_page ausente no handoff").not.toBeNull();
  expect(pageMatch![2]).not.toBe("triage");
  // source=triage não pode ter sido sobrescrito por page path
  expect(text).not.toMatch(/source=\//);
}

test.describe("Triage handoff — contrato do wa.me para diferentes origens", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("cenário 1: com localização GPS completa (Curitiba/Batel)", async ({ page }) => {
    await mockWrites(page);
    await page.goto("/triagem-preview");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "user_location_full_v1",
        JSON.stringify({ source: "gps", city: "Curitiba", uf: "PR", neighborhood: "Batel" }),
      );
    });
    await page.reload();
    await completeConsoleTriage(page);

    const cta = page.getByRole("link", { name: /Continuar atendimento técnico no WhatsApp/i });
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me/");
    const text = decodeText(href!);
    assertTriageHandoff(text);
    expect(text).toContain("Cidade: Curitiba");
    expect(text).toContain("Bairro: Batel");
  });

  test("cenário 2: sem localização armazenada", async ({ page }) => {
    await mockWrites(page);
    await page.goto("/triagem-preview");
    await page.evaluate(() => {
      window.localStorage.removeItem("user_location_full_v1");
      window.localStorage.removeItem("user_region_v1");
    });
    await page.reload();
    await completeConsoleTriage(page);

    const cta = page.getByRole("link", { name: /Continuar atendimento técnico no WhatsApp/i });
    const href = await cta.getAttribute("href");
    const text = decodeText(href!);
    assertTriageHandoff(text);
    expect(text).not.toContain("Cidade: Curitiba");
  });

  test("cenário 3: localização parcial (região manual apenas cidade)", async ({ page }) => {
    await mockWrites(page);
    await page.goto("/triagem-preview");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "user_region_v1",
        JSON.stringify({ source: "manual", city: "São José dos Pinhais" }),
      );
    });
    await page.reload();
    await completeConsoleTriage(page);

    const cta = page.getByRole("link", { name: /Continuar atendimento técnico no WhatsApp/i });
    const href = await cta.getAttribute("href");
    const text = decodeText(href!);
    assertTriageHandoff(text);
  });
});
