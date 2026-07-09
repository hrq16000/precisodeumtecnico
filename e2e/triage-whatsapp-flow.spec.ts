import { test, expect, type Page } from "@playwright/test";

function decodeWaText(href: string): string {
  return decodeURIComponent(new URL(href).searchParams.get("text") || "");
}

async function mockTriageWrites(page: Page) {
  await page.route("https://ipwho.is/**", (route) => route.fulfill({ status: 503, body: "{}" }));
  await page.route("https://ipapi.co/json/**", (route) => route.fulfill({ status: 503, body: "{}" }));
  await page.route("**/rest/v1/leads**", (route) =>
    route.fulfill({ status: 201, contentType: "application/json", body: "[]" }),
  );
  await page.route("**/rest/v1/terms_acceptances**", (route) =>
    route.fulfill({ status: 201, contentType: "application/json", body: "[]" }),
  );
  await page.route("**/rest/v1/wa_bypass_events**", (route) =>
    route.fulfill({ status: 201, contentType: "application/json", body: "[]" }),
  );
  await page.route("**/functions/v1/send-lead-notification**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
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

  const checkboxes = page.getByRole("checkbox");
  for (let i = 0; i < await checkboxes.count(); i += 1) {
    await checkboxes.nth(i).check();
  }
  await page.getByRole("button", { name: /Enviar triagem/i }).click();
  await expect(page.getByRole("heading", { name: /Triagem enviada/i })).toBeVisible({ timeout: 10_000 });
}

test.describe("Triage WhatsApp flow", () => {
  test("triagem completa usa cidade/bairro salvos e gera CTA WhatsApp com contexto", async ({ page }) => {
    await mockTriageWrites(page);
    await page.goto("/triagem-preview");
    await page.evaluate(() => {
      window.localStorage.setItem("user_location_full_v1", JSON.stringify({
        source: "gps",
        city: "Curitiba",
        uf: "PR",
        neighborhood: "Batel",
      }));
    });
    await page.reload();

    await completeConsoleTriage(page);

    const cta = page.getByRole("link", { name: /Continuar atendimento técnico no WhatsApp/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("data-wa-source", "triage");
    await expect(cta).toHaveAttribute("data-service", /assistencia-tecnica/);
    await expect(cta).toHaveAttribute("data-city", "Curitiba");
    await expect(cta).toHaveAttribute("data-neighborhood", "Batel");
    await expect(cta).toHaveAttribute("aria-label", /triagem/i);

    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me/");
    const text = decodeWaText(href!);
    expect(text).toContain("Serviço: Assistência técnica");
    expect(text).toContain("Equipamento/Categoria: Console");
    expect(text).toContain("Problema: PS5 ejetando o disco sozinho");
    expect(text).toContain("Cidade: Curitiba");
    expect(text).toContain("Bairro: Batel");
    expect(text).toContain("source=triage");
    expect(text).toContain("service=assistencia-tecnica");
    expect(text).toContain("utm_source=whatsapp_cta");
    expect(text).toMatch(/page=\/[^\s]*/);
  });

  test("triagem sem localização não inventa Curitiba e mantém WhatsApp funcional", async ({ page }) => {
    await mockTriageWrites(page);
    await page.goto("/triagem-preview");
    await page.evaluate(() => {
      window.localStorage.removeItem("user_location_full_v1");
      window.localStorage.removeItem("user_region_v1");
    });
    await page.reload();

    await completeConsoleTriage(page);

    const cta = page.getByRole("link", { name: /Continuar atendimento técnico no WhatsApp/i });
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me/");
    const text = decodeWaText(href!);
    expect(text).toContain("Serviço: Assistência técnica");
    expect(text).toContain("Problema: PS5 ejetando o disco sozinho");
    expect(text).toContain("source=triage");
    expect(text).toContain("utm_source=whatsapp_cta");
    expect(text).not.toContain("Cidade: Curitiba");
  });

  test("debug de payload não aparece no fluxo de build/produção", async ({ page }) => {
    await mockTriageWrites(page);
    await page.goto("/triagem-preview");
    await completeConsoleTriage(page);
    await expect(page.getByText(/Ver payload de teste \(debug\)/i)).toHaveCount(0);
  });
});