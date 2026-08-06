/**
 * Rodada 3R — governança do conteúdo de sintoma dentro das páginas curadas.
 *
 * O cluster /problemas/* NÃO existe neste projeto e a rodada proíbe criar
 * rotas. Portanto o gate valida:
 *  - que nenhuma URL /problemas/* foi criada;
 *  - que a página que carrega o sintoma "notebook não liga"
 *    (/conserto-de-notebook-curitiba) tem alerta de risco no HTML,
 *    sem procedimento invasivo, com CTA acima da dobra e no máximo 3 CTAs;
 *  - que as páginas de serviço vizinhas não sofreram regressão.
 */
import { test, expect } from "@playwright/test";

const NOTEBOOK = "/conserto-de-notebook-curitiba";

const INVASIVE = [
  "abrir o notebook",
  "remover a bateria interna",
  "reflow",
  "secador",
  "freezer",
  "curto nos pinos",
  "desmontar",
];

test.describe("Rodada 3R — sintoma notebook não liga", () => {
  test("não existe rota /problemas/*", async ({ request }) => {
    const res = await request.get("/problemas/notebook-nao-liga");
    const html = await res.text();
    // SPA devolve 200 com o shell; o que importa é não haver rota curada.
    expect(html).not.toContain('data-symptom-page="notebook-nao-liga"');
  });

  test("alerta de risco presente e sem procedimento invasivo", async ({ page }) => {
    await page.goto(NOTEBOOK);
    const alert = page.getByText("Quando não insistir em ligar", { exact: false });
    await expect(alert.first()).toBeVisible();

    const body = (await page.locator("main").innerText()).toLowerCase();
    for (const term of INVASIVE) {
      expect(body).not.toContain(term);
    }
  });

  test("CTA de triagem acima da dobra em 360/390/430", async ({ page }) => {
    for (const width of [360, 390, 430]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(NOTEBOOK);
      const cta = page.locator("[data-triage-cta]").first();
      const box = await cta.boundingBox();
      expect(box, `CTA ausente em ${width}px`).not.toBeNull();
      expect(box!.y, `CTA abaixo de 750px em ${width}px`).toBeLessThan(750);
    }
  });

  test("no máximo 3 CTAs de triagem e uma única faixa de confiança", async ({ page }) => {
    await page.goto(NOTEBOOK);
    expect(await page.locator("[data-triage-cta]").count()).toBeLessThanOrEqual(3);
    expect(await page.locator("[data-trust-strip]").count()).toBeLessThanOrEqual(1);
  });

  test("sumário navegável presente", async ({ page }) => {
    await page.goto(NOTEBOOK);
    await expect(page.locator("[data-page-toc]").first()).toBeVisible();
  });

  test("páginas de serviço vizinhas sem regressão", async ({ page }) => {
    for (const route of [
      "/formatacao-de-computador-curitiba",
      "/remocao-de-virus-curitiba",
      "/upgrade-ssd-curitiba",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("[data-triage-cta]").first()).toBeVisible();
    }
  });
});
