import { test, expect, type Page } from "@playwright/test";

/**
 * Rodada 7 — Cobertura E2E para as landings AssistenciaTecnica / Curitiba.
 * Valida data-wa-source/data-service/data-city em todos os CTAs wa.me e
 * que o helper buildWhatsAppUrl injetou parâmetros de contexto no ?text=.
 */

const PAGES: { path: string; city?: string }[] = [
  { path: "/assistencia-tecnica" },
  { path: "/assistencia-tecnica-curitiba", city: "Curitiba" },
];

function decodeText(href: string) {
  return decodeURIComponent(new URL(href).searchParams.get("text") || "");
}

for (const { path, city } of PAGES) {
  test.describe(`Landing CTAs — ${path}`, () => {
    test("todo wa.me tem data-wa-source/data-service e mensagem com contexto", async ({
      page,
    }) => {
      await page.goto(path);
      const anchors = page.locator('a[href*="wa.me"]');
      const count = await anchors.count();
      expect(count, "CTAs presentes").toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const a = anchors.nth(i);
        await expect(a, `CTA #${i} data-wa-source`).toHaveAttribute(
          "data-wa-source",
          /.+/,
        );
        await expect(a, `CTA #${i} data-service`).toHaveAttribute(
          "data-service",
          /.+/,
        );
        if (city) {
          await expect(a, `CTA #${i} data-city`).toHaveAttribute(
            "data-city",
            city,
          );
        }
        const href = await a.getAttribute("href");
        const text = decodeText(href!);
        expect(text.length, `CTA #${i} tem texto`).toBeGreaterThan(10);
      }
    });
  });
}

test.describe("whatsapp_click tracking — 1 evento por clique com contexto", () => {
  test("clique em CTA de landing dispara exatamente um whatsapp_click", async ({
    page,
    context,
  }) => {
    await context.route("**/wa.me/**", (r) =>
      r.fulfill({ status: 200, body: "ok" }),
    );
    await page.addInitScript(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    });

    await page.goto("/assistencia-tecnica-curitiba");
    const cta = page.locator('a[href*="wa.me"]').first();
    await cta.evaluate((el) =>
      el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
    );

    const events = await page.evaluate(() => {
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      return (w.dataLayer ?? []).filter((e) => e.event === "whatsapp_click");
    });
    expect(events.length, "exatamente 1 evento por clique").toBe(1);
    const ev = events[0];
    expect(String(ev.service ?? "").length).toBeGreaterThan(0);
    expect(ev.city).toBe("Curitiba");
  });
});
