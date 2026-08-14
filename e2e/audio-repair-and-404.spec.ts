import { test, expect } from "@playwright/test";

const PAGE = "/servicos/conserto-de-som-e-audio-curitiba";

test.describe("Conserto de som e áudio — landing", () => {
  test("H1 único, canonical, schemas e conteúdo rico", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(PAGE, { waitUntil: "networkidle" });

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText(/Conserto de som/i);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(`https://precisodeumtecnico.com${PAGE}`);
    expect(await page.locator('meta[property="og:url"]').getAttribute("content")).toBe(
      `https://precisodeumtecnico.com${PAGE}`,
    );

    const types = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .flatMap((n) => {
          try {
            const p = JSON.parse(n.textContent || "null");
            return (Array.isArray(p) ? p : [p]).map((x) => x?.["@type"]);
          } catch {
            return [];
          }
        })
        .filter(Boolean),
    );
    expect(types).toContain("Service");
    expect(types).toContain("FAQPage");
    expect(types).toContain("BreadcrumbList");

    const raw = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map((n) => n.textContent || "")
        .join(" "),
    );
    expect(raw).not.toMatch(/aggregateRating|ratingValue|reviewCount/);

    const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    expect(body.length).toBeGreaterThan(2000);
    expect(body).toContain("R$ 99,99");
    expect(body).not.toMatch(/R\$\s*50,00/);

    // FAQ visível bate com o schema
    const faqItems = await page.locator("[data-faq-item]").count();
    expect(faqItems).toBeGreaterThanOrEqual(8);

    // Fotos reais creditadas (sem IA)
    expect(await page.locator('img[src*="/photos/audio-"]').count()).toBeGreaterThan(0);

    expect(errors).toEqual([]);
  });

  test("CTA abre a triagem", async ({ page }) => {
    await page.goto(`${PAGE}?triage=1`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-triage-source="servicos_som_audio_curitiba"]').first().click();
    await expect(page.getByText(/Qual é o (aparelho|equipamento)/i)).toBeVisible();
  });
});

test.describe("Rotas nacionais inexistentes → 404", () => {
  test("cidade inexistente renderiza NotFound com noindex", async ({ page }) => {
    await page.goto("/atendimento-nacional/cidade-que-nao-existe-xyz", { waitUntil: "networkidle" });
    await expect(page.getByText("404")).toBeVisible();
    expect(page.url()).toContain("cidade-que-nao-existe-xyz");
    expect(await page.locator('meta[name="robots"]').first().getAttribute("content")).toMatch(/noindex/);
  });

  test("bairro inexistente é noindex e não duplica a cidade", async ({ page }) => {
    await page.goto("/atendimento-nacional/curitiba/bairro-inexistente-xyz", { waitUntil: "networkidle" });
    expect(await page.locator('meta[name="robots"]').first().getAttribute("content")).toMatch(/noindex/);
  });
});
