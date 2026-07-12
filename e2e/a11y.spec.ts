import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Rodada 25.2 — cobertura Axe sem filtros enganosos.
 *
 * - Não usa disableRules.
 * - Não usa `include` vazio.
 * - Aguarda hidratação real (form/CTA principal presentes).
 * - Falha em qualquer violação critical ou serious.
 * - Cobre home + contato em desktop e mobile.
 * - Asserções diretas para nome acessível de botões, SelectTrigger,
 *   Checkbox e labels de formulário.
 */

const DESKTOP = { width: 1280, height: 1800 };
const MOBILE = { width: 390, height: 844 };

async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0.001s !important;
        animation-delay: 0s !important;
        transition-duration: 0.001s !important;
        transition-delay: 0s !important;
      }
      .animate-fade-up { opacity: 1 !important; transform: none !important; }
    `,
  });
  await page.waitForTimeout(300);
}

async function waitHomeHydrated(page: Page) {
  await page.locator("h1").first().waitFor({ state: "visible", timeout: 10_000 });
  await page.locator('[data-wa-source="hero"]').first().waitFor({ state: "visible", timeout: 10_000 });
  await disableAnimations(page);
}

async function waitContatoHydrated(page: Page) {
  await page.locator("h1").first().waitFor({ state: "visible", timeout: 10_000 });
  await page.locator("form").first().waitFor({ state: "attached", timeout: 10_000 });
  await page.locator("#terms-contact").waitFor({ state: "attached", timeout: 10_000 });
  await disableAnimations(page);
}

function assertNoCriticalOrSerious(violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"], label: string) {
  const filtered = violations.filter((v) => ["critical", "serious"].includes(v.impact ?? ""));
  const summary = filtered.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => ({ target: n.target, failureSummary: n.failureSummary?.slice(0, 200) })),
  }));
  expect(filtered, `${label}\n${JSON.stringify(summary, null, 2)}`).toEqual([]);
}

for (const [name, vp] of [["desktop", DESKTOP], ["mobile", MOBILE]] as const) {
  test.describe(`axe home — ${name}`, () => {
    test(`home ${name}: zero critical/serious`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await waitHomeHydrated(page);
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      assertNoCriticalOrSerious(res.violations, `home@${name}`);
    });
  });

  test.describe(`axe contato — ${name}`, () => {
    test(`contato ${name}: zero critical/serious`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto("/contato", { waitUntil: "domcontentloaded" });
      await waitContatoHydrated(page);
      const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      assertNoCriticalOrSerious(res.violations, `contato@${name}`);
    });
  });
}

test.describe("asserções diretas de nomes acessíveis", () => {
  test("home: todo botão tem nome acessível", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitHomeHydrated(page);
    const offenders = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll(
        'button, [role="button"], [role="checkbox"], [role="combobox"]',
      ));
      return nodes
        .filter((el) => {
          const label = (el.getAttribute("aria-label") || "").trim();
          const labelledby = el.getAttribute("aria-labelledby");
          const text = (el.textContent || "").trim();
          const title = (el.getAttribute("title") || "").trim();
          return !label && !labelledby && !text && !title;
        })
        .map((el) => (el as HTMLElement).outerHTML.slice(0, 200));
    });
    expect(offenders, `Botões sem nome:\n${offenders.join("\n")}`).toEqual([]);
  });

  test("contato: SelectTrigger + Checkbox + submit possuem nome; form tem labels", async ({ page }) => {
    await page.goto("/contato", { waitUntil: "domcontentloaded" });
    await waitContatoHydrated(page);
    // SelectTriggers
    const triggers = await page.locator('[role="combobox"]').all();
    expect(triggers.length).toBeGreaterThanOrEqual(2);
    for (const t of triggers) {
      const label = await t.getAttribute("aria-label");
      const labelledby = await t.getAttribute("aria-labelledby");
      expect(label || labelledby, "SelectTrigger sem nome").toBeTruthy();
    }
    // Checkbox terms
    const cb = page.locator("#terms-contact");
    expect((await cb.getAttribute("aria-label")) || (await cb.getAttribute("aria-labelledby")))
      .toBeTruthy();
    // Submit button
    const submit = page.locator('form button[type="submit"]').first();
    const submitText = ((await submit.textContent()) || "").trim();
    const submitLabel = await submit.getAttribute("aria-label");
    expect(submitText || submitLabel).toBeTruthy();
    // Todos os inputs/textarea têm label associada
    const orphanFields = await page.evaluate(() => {
      const fields = Array.from(document.querySelectorAll("form input:not([type=hidden]), form textarea"));
      return fields
        .filter((el) => {
          const id = el.getAttribute("id");
          const hasLabel = id && document.querySelector(`label[for="${id}"]`);
          const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
          const hidden = el.getAttribute("aria-hidden") === "true";
          return !hasLabel && !aria && !hidden;
        })
        .map((el) => (el as HTMLElement).outerHTML.slice(0, 200));
    });
    expect(orphanFields, `Campos sem label:\n${orphanFields.join("\n")}`).toEqual([]);
  });

  test("home: hierarquia — exatamente um H1 e sem H3 antes de H2 na hero", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitHomeHydrated(page);
    const h1s = await page.locator("h1").count();
    expect(h1s).toBe(1);
    // Sequência de headings deve começar com H1 e nunca pular níveis para baixo
    const levels = await page.evaluate(() =>
      Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((h) => Number(h.tagName[1])),
    );
    let last = 0;
    for (const lvl of levels) {
      if (last === 0) expect(lvl).toBe(1);
      else expect(lvl - last, `heading pulou de h${last} para h${lvl}`).toBeLessThanOrEqual(1);
      last = lvl;
    }
  });
});
