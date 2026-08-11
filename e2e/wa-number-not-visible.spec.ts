import { test, expect } from "@playwright/test";

/**
 * Gate: o número de WhatsApp nunca pode aparecer como texto visível.
 * Ele só é permitido dentro de href="https://wa.me/..." e em JSON-LD (NAP).
 */

const ROUTES = [
  "/",
  "/contato",
  "/areas-atendidas",
  "/precos",
  "/informatica-curitiba",
  "/atendimento-urgente",
  "/area-de-atendimento-curitiba",
  "/anuncie",
];

const VARIANTS = [
  "5541997452053",
  "41997452053",
  "997452053",
  "99745-2053",
  "(41) 99745-2053",
];

for (const route of ROUTES) {
  test(`sem número visível em ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("domcontentloaded");
    const visibleText = await page.evaluate(() => document.body.innerText || "");
    const normalized = visibleText.replace(/\s+/g, " ");
    for (const variant of VARIANTS) {
      expect(
        normalized.includes(variant),
        `Número "${variant}" visível em ${route}`,
      ).toBeFalsy();
    }
  });
}

test("links wa.me continuam funcionais com mensagem pronta", async ({ page }) => {
  await page.goto("/");
  const anchors = page.locator("a[href*='wa.me']");
  const count = await anchors.count();
  expect(count).toBeGreaterThan(0);
  const href = await anchors.first().getAttribute("href");
  expect(href).toContain("wa.me/");
  const text = decodeURIComponent(new URL(href!).searchParams.get("text") || "");
  expect(text.trim().length).toBeGreaterThan(10);
});
