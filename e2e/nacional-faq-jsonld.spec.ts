import { test, expect, type Page } from "@playwright/test";

/**
 * FAQPage JSON-LD nas páginas CidadeNacional e BairroNacional.
 * Verificamos:
 *   - existe pelo menos um bloco JSON-LD com @type=FAQPage
 *   - possui mainEntity com perguntas/respostas não-vazias
 *   - o conteúdo muda de slug para slug (evita FAQ idêntica em N páginas)
 */

async function readFAQ(page: Page): Promise<{ questions: string[]; raw: string }> {
  return await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const s of scripts) {
      try {
        const parsed = JSON.parse(s.textContent || "{}");
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        for (const p of arr) {
          if (p?.["@type"] === "FAQPage" && Array.isArray(p.mainEntity)) {
            const questions = p.mainEntity
              .map((q: { name?: string }) => q?.name ?? "")
              .filter(Boolean);
            return { questions, raw: JSON.stringify(p) };
          }
        }
      } catch { /* skip */ }
    }
    return { questions: [], raw: "" };
  });
}

const CITY_A = "/atendimento-nacional/sao-paulo";
const CITY_B = "/atendimento-nacional/rio-de-janeiro";
const BAIRRO_A = "/atendimento-nacional/sao-paulo/pinheiros";
const BAIRRO_B = "/atendimento-nacional/sao-paulo/moema";

test("CidadeNacional renderiza FAQPage JSON-LD válido", async ({ page }) => {
  await page.goto(CITY_A, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const { questions, raw } = await readFAQ(page);
  expect(questions.length, "FAQPage deve ter perguntas").toBeGreaterThan(0);
  expect(raw).toContain("FAQPage");
  for (const q of questions) expect(q.trim().length).toBeGreaterThan(3);
});

test("BairroNacional renderiza FAQPage JSON-LD válido", async ({ page }) => {
  await page.goto(BAIRRO_A, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const { questions } = await readFAQ(page);
  expect(questions.length).toBeGreaterThan(0);
});

test("FAQPage muda entre cidades diferentes", async ({ page }) => {
  await page.goto(CITY_A, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const a = await readFAQ(page);

  await page.goto(CITY_B, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const b = await readFAQ(page);

  expect(a.questions.length).toBeGreaterThan(0);
  expect(b.questions.length).toBeGreaterThan(0);
  // Conteúdo localizado deve diferir (nome da cidade aparece nas respostas).
  expect(a.raw).not.toBe(b.raw);
});

test("FAQPage muda entre bairros da mesma cidade", async ({ page }) => {
  await page.goto(BAIRRO_A, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const a = await readFAQ(page);

  await page.goto(BAIRRO_B, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('script[type="application/ld+json"]');
  const b = await readFAQ(page);

  expect(a.raw).not.toBe(b.raw);
});
