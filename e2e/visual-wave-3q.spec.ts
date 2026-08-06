import { test, expect } from "@playwright/test";

/**
 * Rodada 3Q — gate do padrão visual propagado às páginas comerciais.
 * Valida estrutura comum (resumo, confiança, sumário, caixas, 3 CTAs) e as
 * regras semânticas específicas de cada serviço.
 */
const PAGES = [
  "/formatacao-de-computador-curitiba",
  "/remocao-de-virus-curitiba",
  "/upgrade-ssd-curitiba",
  "/upgrade-memoria-ram-curitiba",
  "/suporte-tecnico-remoto",
  "/assistencia-tecnica-empresas-curitiba",
  "/conserto-de-notebook-curitiba",
];

for (const path of PAGES) {
  test(`padrão comum em ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);

    // Sumário único, com âncoras que existem na página.
    const toc = page.locator("[data-page-toc]");
    await expect(toc).toHaveCount(1);
    const links = await toc.locator("a[href^='#']").evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!.slice(1)),
    );
    expect(links.length).toBeGreaterThan(2);
    for (const id of links) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    // Faixa de confiança aparece uma única vez.
    await expect(page.getByText("Atuação em informática desde 1998")).toHaveCount(1);

    // Exatamente três CTAs de triagem (hero, meio, final).
    await expect(page.locator("[data-triage-cta]")).toHaveCount(3);

    // CTA principal dentro dos primeiros 750px.
    const box = await page.locator("[data-triage-cta]").first().boundingBox();
    expect(box!.y).toBeLessThan(750);

    // FAQ preservada.
    await expect(page.locator("#perguntas-frequentes")).toHaveCount(1);
  });
}

test("formatação destaca backup e não promete correção de hardware", async ({ page }) => {
  await page.goto("/formatacao-de-computador-curitiba");
  await expect(page.getByText("Antes da formatação")).toBeVisible();
  await expect(page.getByText(/Backup é etapa combinada/i)).toBeVisible();
});

test("remoção de vírus publica limites de segurança", async ({ page }) => {
  await page.goto("/remocao-de-virus-curitiba");
  await expect(page.getByText("Limites da remoção")).toBeVisible();
  const body = (await page.locator("main, body").first().innerText()).toLowerCase();
  expect(body).not.toContain("segurança absoluta");
  expect(body).not.toContain("proteção garantida");
});

test("upgrade não usa promessa numérica de desempenho", async ({ page }) => {
  for (const path of ["/upgrade-ssd-curitiba", "/upgrade-memoria-ram-curitiba"]) {
    await page.goto(path);
    await expect(page.getByText("Compatibilidade antes da compra")).toBeVisible();
    const body = (await page.locator("body").innerText()).toLowerCase();
    expect(body).not.toMatch(/\d+\s*(vezes|x)\s*mais r[áa]pido/);
  }
});
