import { test, expect } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL || "http://localhost:8080";

test.describe("Termos comerciais — alinhamento global", () => {
  test("/termos-orcamento-pre-aprovado expõe regra oficial completa", async ({ page }) => {
    await page.goto(`${BASE}/termos-orcamento-pre-aprovado`, { waitUntil: "networkidle" });
    const body = await page.locator("body").innerText();

    // Valores oficiais
    expect(body).toContain("R$ 299,99");
    expect(body).toContain("R$ 99,99");

    // Escopo pré-aprovado
    expect(body.toLowerCase()).toContain("não inclui peças");
    expect(body.toLowerCase()).toMatch(/materiais|componentes/);
    expect(body.toLowerCase()).toContain("logística com seguro");

    // Cancelamento cobre parceiros
    expect(body.toLowerCase()).toContain("parceiros");

    // Fila mínima
    expect(body).toMatch(/3 dias úteis|72 horas úteis/);
  });

  test("/precos mantém valores oficiais consistentes", async ({ page }) => {
    await page.goto(`${BASE}/precos`, { waitUntil: "networkidle" });
    const body = await page.locator("body").innerText();
    expect(body).toContain("R$ 99,99");
    // Não deve conter variações divergentes no contexto de visita/diagnóstico
    expect(body).not.toMatch(/visita.*R\$ ?99,00/i);
    expect(body).not.toMatch(/visita.*R\$ ?90(\D|$)/i);
  });

  test("landings públicas não anunciam peças inclusas no pré-aprovado", async ({ page }) => {
    for (const path of ["/assistencia-tecnica", "/assistencia-tecnica-curitiba"]) {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
      const body = (await page.locator("body").innerText()).toLowerCase();
      expect(body).not.toContain("peças inclusas");
      expect(body).not.toContain("materiais inclusos");
      expect(body).not.toContain("conserto garantido por r$");
    }
  });
});
