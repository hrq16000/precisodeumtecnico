import { test, expect } from "@playwright/test";

const TERMS_ROUTES = ["/termos-orcamento", "/termos-orcamento-pre-aprovado"];

const LEGACY_PRICE = [/R\$\s?90(?!\d)/, /R\$\s?90,00/, /R\$\s?50,00/, /R\$\s?300,00/];

test.describe("Termos de orçamento – rotas públicas", () => {
  for (const route of TERMS_ROUTES) {
    test(`${route} responde 200 e renderiza os termos oficiais`, async ({ page }) => {
      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res?.status()).toBe(200);

      await expect(page.locator("h1")).toHaveCount(1);
      const body = (await page.locator("main, body").first().innerText()).toLowerCase();

      for (const term of ["peças", "componentes", "materiais"]) {
        expect(body, `faltou o termo "${term}" em ${route}`).toContain(term);
      }

      expect(body).toContain("r$ 99,99");
      expect(body).toContain("r$ 299,99");
      for (const legacy of LEGACY_PRICE) {
        expect(body, `valor legado ${legacy} em ${route}`).not.toMatch(legacy);
      }
    });
  }
});

test.describe("/obrigado – pós-conversão", () => {
  test("responde 200, tem FAQPage e LocalBusiness e não reinicia o funil", async ({ page }) => {
    const res = await page.goto("/obrigado?modalidade=coleta&origem=triagem", {
      waitUntil: "domcontentloaded",
    });
    expect(res?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByTestId("obrigado-origem")).toBeVisible();

    // O wizard de triagem não pode abrir sozinho nesta rota.
    await expect(page.getByRole("dialog")).toHaveCount(0);

    const types = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.flatMap((n) => {
        try {
          const parsed = JSON.parse(n.textContent ?? "{}");
          return (Array.isArray(parsed) ? parsed : [parsed]).map(
            (x: { "@type"?: string }) => x["@type"],
          );
        } catch {
          return [];
        }
      }),
    );
    expect(types).toContain("FAQPage");
    expect(types).toContain("LocalBusiness");

    const body = (await page.locator("body").innerText()).toLowerCase();
    expect(body).toContain("r$ 299,99");
    for (const legacy of LEGACY_PRICE) expect(body).not.toMatch(legacy);
  });

  test("modalidades distintas geram mensagens diferentes", async ({ page }) => {
    await page.goto("/obrigado?modalidade=visita", { waitUntil: "domcontentloaded" });
    const visita = await page.locator("h1").innerText();

    await page.goto("/obrigado?modalidade=coleta", { waitUntil: "domcontentloaded" });
    const coleta = await page.locator("h1").innerText();

    expect(visita).not.toEqual(coleta);
  });
});
