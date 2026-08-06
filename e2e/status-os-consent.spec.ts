import { test, expect, devices } from "@playwright/test";

/**
 * Rodada 3R — consentimento LGPD da consulta pública de OS.
 *
 * Contrato:
 *  - sem aceite, nenhuma requisição de consulta sai e nada da OS é exibido;
 *  - com aceite, a consulta é disparada;
 *  - o descarte limpa campos, query string e a autorização persistida;
 *  - vale em mobile (390px) e desktop.
 */

const VIEWPORTS = [
  { name: "mobile", size: devices["Pixel 5"].viewport },
  { name: "desktop", size: { width: 1280, height: 900 } },
];

for (const vp of VIEWPORTS) {
  test.describe(`status-os consent — ${vp.name}`, () => {
    test.use({ viewport: vp.size });

    test("bloqueia consulta sem aceite e não emite requisição", async ({ page }) => {
      const lookups: string[] = [];
      page.on("request", (r) => {
        if (/get_service_order/.test(r.url())) lookups.push(r.url());
      });

      await page.goto("/status-os", { waitUntil: "domcontentloaded" });
      await page.locator("#os-consent").waitFor({ state: "visible" });
      await expect(page.locator("#os-consent")).not.toBeChecked();

      await page.fill("#os-input", "OS-2026-0001");
      await page.getByRole("button", { name: /consultar/i }).click();

      await expect(page.getByRole("alert")).toContainText(/autoriza/i);
      await page.waitForTimeout(800);
      expect(lookups, "consulta não pode sair sem consentimento").toEqual([]);
      // Nenhum dado da OS na tela
      await expect(page.locator("[data-os-result]")).toHaveCount(0);
    });

    test("libera consulta após aceite e permite descartar os dados", async ({ page }) => {
      const lookups: string[] = [];
      page.on("request", (r) => {
        if (/get_service_order/.test(r.url())) lookups.push(r.url());
      });

      await page.goto("/status-os", { waitUntil: "domcontentloaded" });
      await page.locator("#os-consent").waitFor({ state: "visible" });
      await page.locator("#os-consent").click();
      await expect(page.locator("#os-consent")).toBeChecked();

      await page.fill("#os-input", "OS-2026-0001");
      await page.getByRole("button", { name: /consultar/i }).click();
      await page.waitForTimeout(2500);
      expect(lookups.length, "consulta deve ser disparada após o aceite").toBeGreaterThan(0);
      expect(page.url()).toContain("os=OS-2026-0001");

      // Persistência da autorização
      const stored = await page.evaluate(() => localStorage.getItem("pdt_os_lookup_consent_v1"));
      expect(stored).toBe("granted");

      // Descarte
      await page.getByRole("button", { name: /descartar consulta/i }).click();
      await expect(page.locator("#os-consent")).not.toBeChecked();
      await expect(page.locator("#os-input")).toHaveValue("");
      expect(page.url()).not.toContain("os=");
      const cleared = await page.evaluate(() => localStorage.getItem("pdt_os_lookup_consent_v1"));
      expect(cleared).toBeNull();
    });

    test("máscara de celular e aceite continuam válidos na aba por telefone", async ({ page }) => {
      await page.goto("/status-os", { waitUntil: "domcontentloaded" });
      await page.locator("#os-consent").waitFor({ state: "visible" });
      await page.getByRole("tab", { name: /celular/i }).click();
      await page.fill("#os-input", "5541999990000");
      await expect(page.locator("#os-input")).toHaveValue("(41) 99999-0000");
      await page.getByRole("button", { name: /consultar/i }).click();
      await expect(page.getByRole("alert")).toContainText(/autoriza/i);
    });
  });
}
