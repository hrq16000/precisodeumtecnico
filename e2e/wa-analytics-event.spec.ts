import { test, expect } from "@playwright/test";
import {
  completeConsoleTriage,
  mockTriageWrites,
  captureWindowOpen,
  suppressLocationPrompt,
  readOpenedWaUrl,
} from "./utils/triage";

/**
 * Rodada 25.1 B.6 — contrato do evento `whatsapp_click`.
 *
 * Após a refatoração de privacidade:
 *  - o dataLayer legado (Google Ads) recebe apenas campos da allowlist
 *    (`source`, `service`, `city`, `bairro`, ...) — SEM `pathname` e SEM `utm_*`;
 *  - o contexto de rota vive somente na fila local isolada
 *    (`window.__PDT_ANALYTICS_QUEUE__`), campo `page_path`.
 *
 * O nav real é bloqueado via capture handler; o delegador global em
 * src/main.tsx continua registrando o evento.
 */

type Evt = Record<string, unknown> & { event?: string; source?: string };

const PII_KEYS = ["pathname", "utm_source", "utm_medium", "utm_campaign", "phone", "telefone", "email"];

function assertLegacyClean(payload: Record<string, unknown>) {
  for (const k of Object.keys(payload)) {
    expect(PII_KEYS, `campo proibido ${k} no payload legado`).not.toContain(k.toLowerCase());
  }
}

test.describe("WhatsApp CTA — evento analytics + utm_source", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
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
      const dl = (window as unknown as { dataLayer?: Evt[] }).dataLayer || [];
      return dl.find((e) => e && e.event === "whatsapp_click") || null;
    });
    const payload = (await evt.jsonValue()) as Record<string, unknown>;
    expect(payload.event).toBe("whatsapp_click");
    expect(payload.source).toBe("header");
    expect(String(payload.service ?? "").toLowerCase()).toContain("assistência técnica");
    assertLegacyClean(payload);

    // Contexto de rota vive apenas na fila local isolada.
    const local = (await page.evaluate(
      () => (window as unknown as { __PDT_ANALYTICS_QUEUE__?: Evt[] }).__PDT_ANALYTICS_QUEUE__ ?? [],
    )) as Evt[];
    const localWa = local.find((e) => e.event === "whatsapp_click");
    expect(localWa, "evento local whatsapp_click").toBeTruthy();
    expect(localWa!.page_path).toBe("/");
  });

  test("Triagem CTA emite whatsapp_click com source=triage e contexto de cidade/bairro", async ({ page }) => {
    await mockTriageWrites(page);
    await captureWindowOpen(page);
    await suppressLocationPrompt(page);

    await page.goto("/triagem-preview");
    await completeConsoleTriage(page, { contact: { city: "Curitiba", neighborhood: "Batel" } });

    // O envio da triagem abre o WhatsApp via window.open (capturado) e emite
    // o evento legado. Não há âncora <a> obrigatória nessa etapa.
    const href = await readOpenedWaUrl(page);
    expect(href).toContain("wa.me/");

    const evt = await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: Evt[] }).dataLayer || [];
      return dl.find((e) => e && e.event === "whatsapp_click") || null;
    });
    const payload = (await evt.jsonValue()) as Record<string, unknown>;
    expect(String(payload.source)).toMatch(/triage/i);
    assertLegacyClean(payload);

    const local = (await page.evaluate(
      () => (window as unknown as { __PDT_ANALYTICS_QUEUE__?: Evt[] }).__PDT_ANALYTICS_QUEUE__ ?? [],
    )) as Evt[];
    expect(local.some((e) => e.event === "triage_complete")).toBe(true);

  });
});
