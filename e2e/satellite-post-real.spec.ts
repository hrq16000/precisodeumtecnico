import { test, expect } from "@playwright/test";

/**
 * Rodada 25.2 — valida um post satélite INDIVIDUAL real (não uma categoria).
 * Slug real gerado em src/data/satellitePosts.ts (primeiro service × bairro).
 */

const SLUG = "informatica-em-batel-curitiba";
const URL = `/blog/${SLUG}`;

test.describe("post satélite individual real", () => {
  test(`${URL}: H1, canonical próprio, description, data ≤ 2026-06-11, conteúdo`, async ({ page }) => {
    const res = await page.goto(URL, { waitUntil: "domcontentloaded" });
    expect(res?.status(), `status HTTP para ${URL}`).toBeLessThan(400);

    // H1
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const h1Text = ((await h1.textContent()) || "").trim();
    expect(h1Text.length).toBeGreaterThan(10);
    expect(h1Text.toLowerCase()).toContain("batel");

    // canonical próprio
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical, "canonical presente").toBeTruthy();
    expect(canonical).toContain(SLUG);

    // description própria
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc, "description presente").toBeTruthy();
    expect((desc || "").length).toBeGreaterThan(50);

    // conteúdo presente
    const paragraphs = await page.locator("main p, article p").count();
    expect(paragraphs).toBeGreaterThanOrEqual(3);

    // data ≤ 2026-06-11 (via JSON-LD Article ou time[datetime])
    const dates: string[] = [];
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const s of scripts) {
      try {
        const parsed = JSON.parse(s);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const it of items) {
          const t = (it as Record<string, unknown>)["@type"];
          if (t === "Article" || t === "BlogPosting") {
            const d = (it as Record<string, unknown>).datePublished;
            if (typeof d === "string") dates.push(d.slice(0, 10));
          }
        }
      } catch { /* ignore */ }
    }
    const timeAttrs = await page.locator("time[datetime]").evaluateAll((els) =>
      els.map((e) => (e.getAttribute("datetime") || "").slice(0, 10)),
    );
    dates.push(...timeAttrs);
    expect(dates.length, "alguma data publicada encontrada").toBeGreaterThan(0);
    for (const d of dates) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        expect(d <= "2026-06-11", `data ${d} deve ser ≤ 2026-06-11`).toBe(true);
      }
    }
  });
});
