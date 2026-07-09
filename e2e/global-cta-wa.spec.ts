import { test, expect } from "@playwright/test";

/**
 * Rodada 6 — CTAs globais de WhatsApp.
 * Garante que Header, CTASection (home) e FAQSection (home) sempre
 * renderizem data-wa-source, data-service e aria-label, e que o link
 * gerado contenha contexto real (nunca mensagem vazia).
 */

function decodeText(href: string): string {
  return decodeURIComponent(new URL(href).searchParams.get("text") || "");
}

test.describe("Global WhatsApp CTAs — Header/CTASection/FAQSection", () => {
  test("Header CTA tem data-wa-source, data-service, aria-label e contexto", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const cta = page.locator('a[data-wa-source="header"]').first();
    await expect(cta).toHaveAttribute("data-service", "assistência técnica");
    await expect(cta).toHaveAttribute("aria-label", /whatsapp/i);
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me/");
    expect(decodeText(href!).toLowerCase()).toContain("assistência técnica");
  });

  test("Home CTASection renderiza data-wa-source=cta-section com contexto", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator('a[data-wa-source="cta-section"]').first();
    await expect(cta).toHaveAttribute("data-service", "assistência técnica");
    await expect(cta).toHaveAttribute("aria-label", /whatsapp/i);
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me/");
    expect(decodeText(href!).toLowerCase()).toContain("assistência técnica");
  });

  test("Home FAQSection renderiza data-wa-source=faq-section com contexto", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator('a[data-wa-source="faq-section"]').first();
    await expect(cta).toHaveAttribute("data-service", /dúvidas/i);
    await expect(cta).toHaveAttribute("aria-label", /whatsapp/i);
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me/");
    expect(decodeText(href!).toLowerCase()).toContain("dúvidas");
  });

  test("Nenhum CTA global gera link sem contexto (?text= vazio)", async ({ page }) => {
    await page.goto("/");
    const anchors = page.locator("a[href*='wa.me']");
    const count = await anchors.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const href = await anchors.nth(i).getAttribute("href");
      if (!href) continue;
      const text = decodeText(href).trim();
      expect(text.length, `CTA ${i} sem contexto (${href})`).toBeGreaterThan(10);
    }
  });
});
