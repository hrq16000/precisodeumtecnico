import { test, expect } from "@playwright/test";
import {
  mockTriageWrites,
  captureWindowOpen,
  blockPopups,
  emulateSlowNetwork,
  readOpenedWaUrl,
  decodeWaText,
  suppressLocationPrompt,
  completeConsoleTriage,
} from "./utils/triage";

/**
 * Contratos da entrega final da triagem:
 *  1. a mensagem do WhatsApp é URL-encoded corretamente (equipamento,
 *     problema, cidade e bairro sobrevivem ao encode/decode);
 *  2. quando o popup é bloqueado, o fallback de cópia aparece com a MESMA
 *     mensagem e o mesmo deep-link;
 *  3. o funil continua completável em rede lenta (~Slow 3G).
 */

const CONTACT = {
  name: "Cliente Teste",
  phone: "(41) 99999-0000",
  email: "cliente@example.com",
  city: "São José dos Pinhais",
  neighborhood: "Afonso Pena",
};

test.describe("triagem — encoding da mensagem e fallback de popup", () => {
  test.beforeEach(async ({ page }) => {
    await mockTriageWrites(page);
    await suppressLocationPrompt(page);
  });

  test("mensagem do WhatsApp é URL-encoded com todos os campos", async ({ page }) => {
    test.setTimeout(120_000);
    await captureWindowOpen(page);
    await page.goto("/triagem-preview");

    await completeConsoleTriage(page, { contact: CONTACT });

    const href = await readOpenedWaUrl(page);
    expect(href).toContain("https://wa.me/");

    // A query precisa estar encodada: nada de espaço/acento/quebra crus.
    const raw = href.split("?text=")[1] ?? "";
    expect(raw.length).toBeGreaterThan(20);
    expect(raw).not.toMatch(/[ \n"<>#]/);
    expect(raw).not.toMatch(/[À-ÿ]/);
    expect(raw).toContain("%20");

    // E o decode precisa devolver exatamente o contexto informado.
    const text = decodeWaText(href);
    expect(text).toContain("Equipamento: Videogame");
    expect(text).toContain("Não lê disco");
    expect(text).toContain(CONTACT.city);
    expect(text).toContain(CONTACT.neighborhood);

    // Idempotência: encodar o texto decodificado reproduz a query original.
    expect(encodeURIComponent(text)).toBe(raw);

  });

  test("popup bloqueado exibe fallback de cópia com o mesmo deep-link", async ({ page }) => {
    test.setTimeout(120_000);
    await blockPopups(page);
    await page.goto("/triagem-preview");

    await completeConsoleTriage(page, { contact: CONTACT });

    const fallback = page.getByTestId("triage-wa-fallback");
    await expect(fallback).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("triage-wa-fallback-copy")).toBeVisible();

    const attempted = await readOpenedWaUrl(page);
    const link = page.getByTestId("triage-wa-fallback-link");
    const href = await link.getAttribute("href");
    expect(href).toBe(attempted);

    const shown = (await page.getByTestId("triage-wa-fallback-message").innerText()).trim();
    expect(decodeWaText(attempted).trim()).toBe(shown);

    // Telemetria do bloqueio deve ter sido registrada.
    const events = await page.evaluate(
      () =>
        (
          (window as unknown as { __PDT_ANALYTICS_QUEUE__?: Array<{ event: string }> }).__PDT_ANALYTICS_QUEUE__ ??
          []
        ).map((e) => e.event),
    );
    expect(events).toContain("triage_popup_blocked");
  });

  test("funil completa em rede lenta (Slow 3G)", async ({ page }) => {
    test.setTimeout(180_000);
    await captureWindowOpen(page);
    await emulateSlowNetwork(page);
    await page.goto("/triagem-preview", { waitUntil: "domcontentloaded" });

    await completeConsoleTriage(page, { contact: CONTACT });

    const text = decodeWaText(await readOpenedWaUrl(page));
    expect(text).toContain("Equipamento: Videogame");
    expect(text).toContain(CONTACT.neighborhood);
  });
});
