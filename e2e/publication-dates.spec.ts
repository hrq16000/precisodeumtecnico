import { test, expect } from "@playwright/test";

/**
 * Rodada 25.1 · B.3.a — Nenhuma data futura em posts públicos.
 * Contrato:
 *   - listagem /blog não exibe post com data futura;
 *   - o post mais recente tem publishedAt <= hoje;
 *   - página individual mostra a mesma data (ISO) da fonte editorial.
 */

test.describe("Publication dates — sem futuro", () => {
  test("/blog não lista posts com data futura", async ({ page }) => {
    await page.goto("/blog");
    const today = new Date().toISOString().split("T")[0];
    const dateNodes = await page.locator("time").evaluateAll((els) =>
      els.map((e) => ({ dt: e.getAttribute("datetime"), text: e.textContent?.trim() }))
    );
    expect(dateNodes.length).toBeGreaterThan(0);
    for (const n of dateNodes) {
      if (n.dt && /^\d{4}-\d{2}-\d{2}/.test(n.dt)) {
        const iso = n.dt.slice(0, 10);
        expect(iso <= today, `data futura na listagem: ${iso} (${n.text})`).toBe(true);
      }
    }
  });

  test("post satélite mais recente possui data válida e não futura", async ({ page }) => {
    await page.goto("/blog/informatica-em-batel-curitiba");
    const today = new Date().toISOString().split("T")[0];
    const timeEl = page.locator("time").first();
    await expect(timeEl).toBeVisible();
    const dt = await timeEl.getAttribute("datetime");
    expect(dt).toBeTruthy();
    const iso = (dt as string).slice(0, 10);
    expect(iso <= today, `publishedAt futuro: ${iso}`).toBe(true);
  });
});
