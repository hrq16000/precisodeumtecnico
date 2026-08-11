import { test, expect, type Page } from "@playwright/test";

/**
 * Contrato do funil V2: ao concluir a triagem, o wizard abre o WhatsApp via
 * window.open com a mensagem já montada (equipamento, problema, cidade,
 * bairro e sufixo de tracking). Nunca inventa cidade/bairro.
 */

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

/** Intercepta window.open e guarda a URL em window.__WA_OPENED__. */
async function captureWindowOpen(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __WA_OPENED__?: string[]; open: typeof window.open };
    w.__WA_OPENED__ = [];
    w.open = ((url?: string | URL) => {
      if (url) w.__WA_OPENED__!.push(String(url));
      return { closed: false, focus() {}, close() {} } as unknown as Window;
    }) as typeof window.open;
  });
}

async function readOpenedWaUrl(page: Page): Promise<string> {
  await expect
    .poll(
      async () =>
        page.evaluate(
          () => ((window as unknown as { __WA_OPENED__?: string[] }).__WA_OPENED__ ?? []).length,
        ),
      { timeout: 15_000 },
    )
    .toBeGreaterThan(0);
  const urls = await page.evaluate(
    () => (window as unknown as { __WA_OPENED__?: string[] }).__WA_OPENED__ ?? [],
  );
  return urls.find((u) => u.includes("wa.me/")) ?? urls[0];
}

/** Percorre o wizard V2 (7 etapas) para o equipamento Videogame. */
async function completeConsoleTriage(page: Page) {
  await page.getByRole("button", { name: /^Videogame/ }).first().click();

  for (let i = 0; i < 14; i += 1) {
    if (await page.getByRole("button", { name: /Agendar agora/i }).count()) break;

    const named: [RegExp, string][] = [
      [/Qual videogame/i, "PS5"],
      [/^Nome/i, "Cliente Teste"],
      [/WhatsApp \(com DDD\)/i, "(41) 99999-0000"],
      [/E-?mail/i, "cliente@example.com"],
    ];
    for (const [label, value] of named) {
      const field = page.getByLabel(label);
      if ((await field.count()) && (await field.first().isVisible())) {
        if (!(await field.first().inputValue())) await field.first().fill(value);
      }
    }

    const preferred = page.getByRole("radio", { name: /^Não lê disco$/ });
    if ((await preferred.count()) && (await preferred.first().isVisible())) {
      await preferred.first().click().catch(() => undefined);
    }
    const groups = page.getByRole("radiogroup");
    const groupCount = await groups.count();
    for (let g = 0; g < groupCount; g += 1) {
      const group = groups.nth(g);
      if (!(await group.isVisible())) continue;
      const radios = group.getByRole("radio");
      const checked = await group.locator('[aria-checked="true"],[data-state="checked"]').count();
      if (checked === 0 && (await radios.count())) {
        await radios.first().click().catch(() => undefined);
      }
    }

    const checkboxes = page.getByRole("checkbox");
    const total = await checkboxes.count();
    for (let c = 0; c < total; c += 1) {
      const box = checkboxes.nth(c);
      if (await box.isVisible()) await box.check().catch(() => undefined);
    }

    const next = page.getByRole("button", { name: /Próxima etapa|Avançar|Continuar/i });
    if ((await next.count()) && (await next.first().isEnabled())) {
      await next.first().click().catch(() => undefined);
    }
    await page.waitForTimeout(400);
  }

  // Etapa 7 — contato obrigatório e envio.
  for (const [label, value] of [
    [/^Nome$/i, "Cliente Teste"],
    [/WhatsApp \(com DDD\)/i, "(41) 99999-0000"],
  ] as [RegExp, string][]) {
    const field = page.getByLabel(label);
    if ((await field.count()) && !(await field.first().inputValue())) {
      await field.first().fill(value);
    }
  }
  const submit = page.getByRole("button", { name: /Agendar agora/i });
  await expect(submit).toBeEnabled({ timeout: 10_000 });
  await submit.click();
}

test.describe("Triage WhatsApp flow (V2)", () => {
  test("triagem completa usa cidade/bairro salvos e monta a mensagem com contexto", async ({ page }) => {
    await mockTriageWrites(page);
    await captureWindowOpen(page);
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

    const href = await readOpenedWaUrl(page);
    expect(href).toContain("wa.me/");
    const text = decodeWaText(href);
    expect(text).toContain("Equipamento: Videogame");
    expect(text).toContain("Problema: Não lê disco");
    expect(text).toContain("Cidade: Curitiba");
    expect(text).toContain("Bairro: Batel");
    expect(text).toContain("cat=videogame");
  });

  test("triagem sem localização não inventa Curitiba", async ({ page }) => {
    await mockTriageWrites(page);
    await captureWindowOpen(page);
    await page.goto("/triagem-preview");
    await page.evaluate(() => {
      window.localStorage.removeItem("user_location_full_v1");
      window.localStorage.removeItem("user_region_v1");
    });
    await page.reload();

    await completeConsoleTriage(page);

    const href = await readOpenedWaUrl(page);
    const text = decodeWaText(href);
    expect(text).toContain("Equipamento: Videogame");
    expect(text).toContain("Problema: Não lê disco");
    expect(text).not.toContain("Cidade: Curitiba");
  });

  test("debug de payload não aparece no fluxo de build/produção", async ({ page }) => {
    await mockTriageWrites(page);
    await captureWindowOpen(page);
    await page.goto("/triagem-preview");
    await completeConsoleTriage(page);
    await expect(page.getByText(/Ver payload de teste \(debug\)/i)).toHaveCount(0);
  });
});
