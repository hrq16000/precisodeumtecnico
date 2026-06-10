import { test, expect } from "@playwright/test";

/**
 * Crawlability guard: internal links in the "Veja também" block on
 * /assistencia-tecnica-curitiba must NOT carry rel=nofollow / noindex
 * and must not duplicate or override the page canonical.
 */
test("Internal related links are crawlable and canonical is unique", async ({
  page,
  request,
  baseURL,
}) => {
  await page.goto("/assistencia-tecnica-curitiba");
  await page.waitForLoadState("networkidle");

  // Exactly ONE canonical, pointing at this page
  const canonicals = page.locator('link[rel="canonical"]');
  await expect(canonicals).toHaveCount(1);
  const canonicalHref = await canonicals.first().getAttribute("href");
  expect(canonicalHref).toContain("/assistencia-tecnica-curitiba");

  // No meta robots noindex
  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  expect((robots ?? "").toLowerCase()).not.toContain("noindex");

  // Inspect related links: they target internal app routes, not the same canonical
  const related = page.locator("a[href^='/servico-em/'], a[href^='/regioes/']");
  const count = await related.count();
  expect(count, "expected internal related links").toBeGreaterThanOrEqual(5);

  const seen = new Set<string>();
  for (let i = 0; i < count; i++) {
    const a = related.nth(i);
    const href = await a.getAttribute("href");
    const rel = (await a.getAttribute("rel")) ?? "";
    const target = await a.getAttribute("target");
    expect(href, "href").toBeTruthy();
    if (!href) continue;

    expect(rel.toLowerCase(), `${href}: rel must not nofollow`).not.toContain("nofollow");
    expect(target ?? "_self", `${href}: should not open in new tab`).not.toBe("_blank");
    expect(href, "internal link must not collide with canonical").not.toContain(
      "/assistencia-tecnica-curitiba",
    );
    seen.add(href);
  }

  // Spot-check the first few links return 200 (no broken internal links)
  const first = [...seen].slice(0, 4);
  for (const href of first) {
    const res = await request.get(`${baseURL}${href}`);
    expect(res.status(), `GET ${href}`).toBeLessThan(400);
  }
});
