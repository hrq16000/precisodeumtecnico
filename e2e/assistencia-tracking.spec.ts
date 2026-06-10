import { test, expect, type Page } from "@playwright/test";

const UTM_URL =
  "/assistencia-tecnica?utm_source=google&utm_medium=cpc&utm_campaign=assist_br&utm_term=ps5&utm_content=hero&gclid=TESTBRGCLID";

async function dataLayer(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    return w.dataLayer ?? [];
  });
}

test.describe("/assistencia-tecnica — WhatsApp CTA tracking", () => {
  test("every wa.me anchor pushes whatsapp_click with utm_*/gclid", async ({ page, context }) => {
    await context.route("**/wa.me/**", (route) => route.fulfill({ status: 200, body: "ok" }));
    await page.addInitScript(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    });

    await page.goto(UTM_URL);
    await page.waitForLoadState("networkidle");

    const anchors = page.locator('a[href*="wa.me"]');
    const count = await anchors.count();
    expect(count, "at least 1 WhatsApp CTA").toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      await anchors.nth(i).evaluate((el) => {
        el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      });
    }

    const events = (await dataLayer(page)).filter((e) => e.event === "whatsapp_click");
    expect(events.length, "whatsapp_click fired").toBeGreaterThanOrEqual(1);
    for (const ev of events) {
      expect(ev.utm_source).toBe("google");
      expect(ev.utm_campaign).toBe("assist_br");
      expect(ev.gclid).toBe("TESTBRGCLID");
    }
  });
});
