import { test, expect } from "@playwright/test";

/**
 * Rodada 21 — Valida que o clique em qualquer CTA WhatsApp dispara evento
 * analytics no dataLayer contendo os data-attrs padronizados
 * (data-wa-source, data-service, data-city/data-neighborhood quando aplicável),
 * e que o href correspondente carrega utm_source=whatsapp_cta.
 *
 * O nav real é bloqueado via capture handler; o delegador global em
 * src/main.tsx continua registrando o evento no window.dataLayer.
 */

test.describe("WhatsApp CTA — evento analytics + utm_source", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // Pré-cria dataLayer para main.tsx anexar diretamente.
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
      // Bloqueia a navegação para wa.me/tel: sem interromper listeners de tracking.
      document.addEventListener(
        "click",
        (e) => {
          const a = (e.target as Element | null)?.closest?.("a") as HTMLAnchorElement | null;
          if (!a) return;
          const href = a.getAttribute("href") || "";
          if (href.includes("wa.me") || href.startsWith("tel:") || href.startsWith("whatsapp:")) {
            e.preventDefault();
          }
        },
        true,
      );
    });
  });

  test("Header CTA emite whatsapp_click com source/service e href com utm_source=whatsapp_cta", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const cta = page.locator('a[data-wa-source="header"]').first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me/");
    expect(decodeURIComponent(new URL(href!).searchParams.get("text") || "")).toContain("utm_source=whatsapp_cta");

    await cta.click({ force: true });

    const evt = await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: Array<{ event?: string }> }).dataLayer || [];
      return dl.find((e) => e && e.event === "whatsapp_click") || null;
    });
    const payload = (await evt.jsonValue()) as Record<string, unknown>;
    expect(payload.event).toBe("whatsapp_click");
    expect(payload.source).toBe("header");
    expect(String(payload.service ?? "").toLowerCase()).toContain("assistência técnica");
    expect(payload.pathname).toBe("/");
  });

  test("Triagem CTA emite whatsapp_click com source=triage, service assistência técnica e city/neighborhood", async ({ page }) => {
    await page.route("https://ipwho.is/**", (r) => r.fulfill({ status: 503, body: "{}" }));
    await page.route("https://ipapi.co/json/**", (r) => r.fulfill({ status: 503, body: "{}" }));
    await page.route("**/rest/v1/**", (r) => r.fulfill({ status: 201, contentType: "application/json", body: "[]" }));
    await page.route("**/functions/v1/**", (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) }),
    );

    await page.goto("/triagem-preview");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "user_location_full_v1",
        JSON.stringify({ source: "gps", city: "Curitiba", uf: "PR", neighborhood: "Batel" }),
      );
    });
    await page.reload();

    // Preenche triagem console PS5 (mesmo fluxo do triage-whatsapp-flow.spec).
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
    for (let i = 0; i < (await checkboxes.count()); i += 1) await checkboxes.nth(i).check();
    await page.getByRole("button", { name: /Enviar triagem/i }).click();

    const cta = page.getByRole("link", { name: /Continuar atendimento técnico no WhatsApp/i });
    await expect(cta).toBeVisible({ timeout: 10_000 });
    await expect(cta).toHaveAttribute("data-city", "Curitiba");
    await expect(cta).toHaveAttribute("data-neighborhood", "Batel");
    await expect(cta).toHaveAttribute("data-service", /assistencia-tecnica/);

    // Limpa dataLayer para isolar o clique do CTA de sucesso.
    await page.evaluate(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    });
    await cta.click({ force: true });

    const evt = await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: Array<{ event?: string; source?: string }> }).dataLayer || [];
      return dl.find((e) => e && e.event === "whatsapp_click" && e.source === "triage") || null;
    });
    const payload = (await evt.jsonValue()) as Record<string, unknown>;
    expect(payload.source).toBe("triage");
    expect(String(payload.service)).toContain("assistencia-tecnica");
    expect(payload.city).toBe("Curitiba");
    expect(payload.bairro).toBe("Batel");
  });
});
