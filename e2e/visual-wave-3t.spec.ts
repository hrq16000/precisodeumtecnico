/**
 * Gate da Rodada 3T — diferenciação das três páginas empresariais.
 *
 * Valida blocos exclusivos por página, ausência de promessa absoluta/plano/SLA,
 * CTA acima da dobra, teto de 3 CTAs, TrustStrip único, sumário navegável e
 * regressão do piloto 3S.
 */
import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
];

const PAGES = [
  "/servicos/manutencao-preventiva-empresas",
  "/servicos/backup-para-empresas",
  "/servicos/redes-e-wifi",
];

const BANNED = [
  "plano mensal",
  "mensalidade",
  "franquia de horas",
  "sla ",
  "monitoramento contínuo 24",
  "ilimitado",
  "segurança total",
  "nunca perca",
  "sempre protegid",
  "zero paradas",
  "backup infalível",
];

test.describe("3T — governança comum", () => {
  for (const path of PAGES) {
    test(`${path}: CTA acima da dobra, teto de CTAs e sumário`, async ({ page }) => {
      for (const vp of VIEWPORTS) {
        await page.setViewportSize(vp);
        await page.goto(path);
        await page.waitForSelector("h1");

        const cta = page.locator("[data-triage-cta]").first();
        await expect(cta).toBeVisible();
        const box = await cta.boundingBox();
        expect(box!.y).toBeLessThan(750);

        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollW).toBeLessThanOrEqual(vp.width + 1);
      }

      expect(await page.locator("[data-triage-cta]").count()).toBeLessThanOrEqual(3);
      expect(await page.locator("[data-trust-strip], [data-b2b-criteria]").count()).toBeLessThanOrEqual(1);
      await expect(page.locator("h1")).toHaveCount(1);

      const anchors = page.locator('[data-page-toc] a[href^="#"]');
      const count = await anchors.count();
      expect(count).toBeGreaterThan(3);
      for (let i = 0; i < count; i++) {
        const id = ((await anchors.nth(i).getAttribute("href")) || "").replace("#", "");
        await expect(page.locator(`#${id}`)).toHaveCount(1);
      }
    });

    test(`${path}: sem promessa absoluta, plano, SLA ou preço novo`, async ({ page }) => {
      await page.goto(path);
      await page.waitForSelector("h1");
      const body = (await page.locator("article").innerText()).toLowerCase();
      for (const term of BANNED) expect(body).not.toContain(term);
    });
  }

  test("as três páginas não compartilham o mesmo resumo nem o mesmo CTA", async ({ page }) => {
    const intros: string[] = [];
    const ctas: string[] = [];
    for (const path of PAGES) {
      await page.goto(path);
      await page.waitForSelector("h1");
      intros.push((await page.locator("article p").first().innerText()).trim());
      ctas.push((await page.locator("[data-triage-cta]").first().innerText()).trim());
    }
    expect(new Set(intros).size).toBe(3);
    expect(new Set(ctas).size).toBe(3);
  });
});

test.describe("3T — preventiva", () => {
  test("matriz de prioridades e limite explícito", async ({ page }) => {
    await page.goto("/servicos/manutencao-preventiva-empresas");
    await page.waitForSelector("#prioridades");
    const table = page.locator("#prioridades table");
    await expect(table).toHaveCount(1);
    for (const level of ["Imediata", "Programada", "Acompanhar", "Informativa"]) {
      await expect(table.getByText(level, { exact: true })).toHaveCount(1);
    }
    const limit = page.locator("[data-preventive-limit]");
    await expect(limit).toBeVisible();
    expect((await limit.innerText()).toLowerCase()).toContain("não elimina falhas inesperadas");
    // Blocos exclusivos das outras páginas não podem vazar.
    await expect(page.locator("[data-backup-concept]")).toHaveCount(0);
    await expect(page.locator("[data-network-printers]")).toHaveCount(0);
  });
});

test.describe("3T — backup", () => {
  test("sincronização, backup e recuperação são distintos", async ({ page }) => {
    await page.goto("/servicos/backup-para-empresas");
    await page.waitForSelector("#conceitos-backup");
    const cards = page.locator("[data-backup-concept]");
    await expect(cards).toHaveCount(3);
    const text = (await page.locator("#conceitos-backup").innerText()).toLowerCase();
    expect(text).toContain("sincronização");
    expect(text).toContain("não é backup");
    expect(text).toContain("recuperação de dados");
    const note = page.locator("[data-backup-restore-note]");
    await expect(note).toBeVisible();
    expect((await note.innerText()).toLowerCase()).toContain("restauração é testada");
    await expect(page.locator("[data-preventive-limit]")).toHaveCount(0);
  });
});

test.describe("3T — redes e Wi-Fi", () => {
  test("público misto, operadora delimitada e impressoras só em rede", async ({ page }) => {
    await page.goto("/servicos/redes-e-wifi");
    await page.waitForSelector("#contextos-rede");
    await expect(page.locator('[data-network-audience="residencial"]')).toBeVisible();
    await expect(page.locator('[data-network-audience="empresarial"]')).toBeVisible();
    await expect(page.locator("[data-network-coverage]")).toBeVisible();
    await expect(page.locator('[data-network-scope="operadora"]')).toBeVisible();

    const printers = (await page.locator("[data-network-printers]").innerText()).toLowerCase();
    expect(printers).toContain("configuração, comunicação e compartilhamento em rede");
    for (const banned of ["cabeçote", "fusor", "toner", "recarga"]) {
      expect(printers).not.toContain(banned);
    }
    await expect(page.locator("[data-backup-concept]")).toHaveCount(0);
  });
});

test.describe("3T — regressão do piloto 3S", () => {
  for (const path of ["/empresa-de-ti-curitiba", "/servicos/suporte-tecnico-empresarial"]) {
    test(`${path} intacto`, async ({ page }) => {
      await page.goto(path);
      await page.waitForSelector("h1");
      await expect(page.locator("[data-b2b-hero]")).toHaveCount(1);
      await expect(page.locator("[data-triage-cta]").first()).toBeVisible();
      await expect(page.locator("[data-preventive-limit]")).toHaveCount(0);
      await expect(page.locator("[data-network-printers]")).toHaveCount(0);
    });
  }
});
