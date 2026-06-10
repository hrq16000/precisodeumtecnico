import { test, expect, type Page } from "@playwright/test";

/**
 * E2E: every WhatsApp CTA on /assistencia-tecnica-curitiba must push a
 * `whatsapp_click` event into dataLayer carrying utm_* + gclid attribution.
 */

const UTM_URL =
  "/assistencia-tecnica-curitiba?utm_source=google&utm_medium=cpc&utm_campaign=assist_cwb&utm_term=ps5&utm_content=hero&gclid=TESTGCLID123";

async function captureDataLayer(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    return w.dataLayer ?? [];
  });
}

test.describe("WhatsApp CTA tracking — /assistencia-tecnica-curitiba", () => {
  test("every wa.me anchor click pushes whatsapp_click with utm_*/gclid", async ({
    page,
    context,
  }) => {
    // Prevent opening new tabs from target="_blank" anchors mid-test
    await context.route("**/wa.me/**", (route) => route.fulfill({ status: 200, body: "ok" }));

    await page.addInitScript(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    });

    await page.goto(UTM_URL);
    await page.waitForLoadState("networkidle");

    const anchors = page.locator('a[href*="wa.me"]');
    const count = await anchors.count();
    expect(count, "at least 3 WhatsApp CTAs present").toBeGreaterThanOrEqual(3);

    // Click each CTA via a JS dispatch so popups don't block the test.
    for (let i = 0; i < count; i++) {
      await anchors.nth(i).evaluate((el) => {
        el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      });
    }

    const events = (await captureDataLayer(page)).filter(
      (e) => e.event === "whatsapp_click",
    );
    expect(events.length, "one whatsapp_click per CTA").toBeGreaterThanOrEqual(count);

    for (const ev of events) {
      expect(ev.utm_source, "utm_source").toBe("google");
      expect(ev.utm_medium, "utm_medium").toBe("cpc");
      expect(ev.utm_campaign, "utm_campaign").toBe("assist_cwb");
      expect(ev.utm_term, "utm_term").toBe("ps5");
      expect(ev.utm_content, "utm_content").toBe("hero");
      expect(ev.gclid, "gclid").toBe("TESTGCLID123");
      expect(String(ev.source), "source label").toMatch(/^curitiba_lp_/);
    }
  });
});
