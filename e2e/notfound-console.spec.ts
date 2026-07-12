import { test, expect } from "@playwright/test";

/**
 * Rodada 25.2 — NotFound deve ser silencioso em produção:
 * zero console.error, zero pageerror. A telemetria antes emitida via
 * console.error foi substituída por evento local sanitizado
 * (pushLocalAnalyticsEvent) sem querystring, referrer ou dados pessoais.
 */

test("NotFound: zero console.error e zero pageerror", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

  await page.goto("/rota-que-nao-existe-25-2-abc");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(600);

  // Filtra:
  //  - ruído externo (Google Ads / Analytics eventuais 404),
  //  - warnings do React DEV mode (`Warning:` só aparece em dev; produção
  //    minified não os emite). Objetivo é validar que o app não emite mais
  //    o `console.error("404 Error: User attempted…")` histórico.
  const appErrors = errors.filter(
    (e) =>
      !/googletagmanager|google-analytics|doubleclick/i.test(e) &&
      !e.startsWith("Warning:"),
  );
  expect(appErrors, `Erros do app em NotFound:\n${appErrors.join("\n")}`).toEqual([]);

  // Contrato: fila local recebeu virtual_page_view com route_type=not_found.
  const queued = await page.evaluate(() => {
    const q = (window as unknown as { __PDT_ANALYTICS_QUEUE__?: Array<Record<string, unknown>> }).__PDT_ANALYTICS_QUEUE__ ?? [];
    return q.filter((e) => e.route_type === "not_found");
  });
  expect(queued.length).toBeGreaterThanOrEqual(1);
  for (const e of queued) {
    // sem PII / querystring
    for (const [k, v] of Object.entries(e)) {
      expect(k.toLowerCase()).not.toMatch(/phone|email|referrer|utm|gclid|query/);
      if (typeof v === "string") expect(v).not.toContain("?");
    }
  }
});
