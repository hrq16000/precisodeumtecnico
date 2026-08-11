import { test, expect, type Page } from "@playwright/test";

/**
 * Contrato universal de pré-preenchimento do WhatsApp.
 *
 * Toda rota pública precisa garantir que os CTAs de WhatsApp saiam com:
 *  - serviço identificado (`service=`)
 *  - rastreio de campanha (`utm_source=whatsapp_cta`)
 *  - origem (`source=`)
 *  - localidade quando o visitante já tem geo salvo (opt-in)
 *
 * E, no fallback (geo/IP indisponível), a mensagem continua funcional e
 * NUNCA inventa cidade/bairro nem imprime `undefined`/`null`.
 */

const ROUTES = [
  "/",
  "/assistencia-tecnica-curitiba",
  "/atendimento-urgente",
  "/area-de-atendimento-curitiba",
  "/areas-atendidas",
  "/precos",
  "/como-funciona",
  "/checklists-de-reparo",
  "/faq",
  "/servicos",
];

const STORED_LOCATION = {
  source: "gps",
  city: "Curitiba",
  uf: "PR",
  neighborhood: "Batel",
};

function waTexts(hrefs: string[]): string[] {
  return hrefs
    .map((href) => {
      try {
        return decodeURIComponent(new URL(href).searchParams.get("text") || "");
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}

async function collectWaHrefs(page: Page): Promise<string[]> {
  return page.$$eval("a[href*='wa.me']", (els) =>
    els.map((el) => (el as HTMLAnchorElement).getAttribute("href") || "").filter(Boolean),
  );
}

async function seedLocation(page: Page, value: object | null) {
  await page.addInitScript((loc) => {
    try {
      window.localStorage.removeItem("user_region_v1");
      if (loc) {
        window.localStorage.setItem("user_location_full_v1", JSON.stringify(loc));
      } else {
        window.localStorage.removeItem("user_location_full_v1");
      }
    } catch {
      /* noop */
    }
  }, value);
  // Sem geo por IP nos testes: o fallback precisa se sustentar sozinho.
  await page.route("https://ipwho.is/**", (route) => route.fulfill({ status: 503, body: "{}" }));
  await page.route("https://ipapi.co/**", (route) => route.fulfill({ status: 503, body: "{}" }));
}

for (const route of ROUTES) {
  test(`WhatsApp pré-preenchido com serviço e tracking em ${route}`, async ({ page }) => {
    await seedLocation(page, STORED_LOCATION);
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    const hrefs = await collectWaHrefs(page);
    expect(hrefs.length, `Nenhum CTA de WhatsApp em ${route}`).toBeGreaterThan(0);

    for (const text of waTexts(hrefs)) {
      expect(text.trim().length, `Mensagem vazia em ${route}`).toBeGreaterThan(10);
      expect(text, `Sem service= em ${route}`).toMatch(/service=/);
      expect(text, `Sem utm_source em ${route}`).toContain("utm_source=whatsapp_cta");
      expect(text, `Sem source= em ${route}`).toMatch(/source=/);
      expect(text, `Placeholder vazado em ${route}`).not.toMatch(/undefined|null/);
    }
  });

  test(`WhatsApp com fallback de geo (sem localidade salva) em ${route}`, async ({ page }) => {
    await seedLocation(page, null);
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    const hrefs = await collectWaHrefs(page);
    expect(hrefs.length, `Nenhum CTA de WhatsApp em ${route}`).toBeGreaterThan(0);

    for (const text of waTexts(hrefs)) {
      expect(text.trim().length, `Mensagem vazia em ${route}`).toBeGreaterThan(10);
      expect(text, `Sem service= em ${route}`).toMatch(/service=/);
      expect(text, `Sem utm_source em ${route}`).toContain("utm_source=whatsapp_cta");
      expect(text, `Placeholder vazado em ${route}`).not.toMatch(/undefined|null/);
      // Fallback não pode inventar região nem imprimir região truncada.
      expect(text, `Região vazia impressa em ${route}`).not.toMatch(/Região aproximada:\s*[.,]/);
      expect(text, `Local vazio impresso em ${route}`).not.toMatch(/Local:\s*[.,—]/);
    }
  });
}
