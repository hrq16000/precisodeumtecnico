/**
 * Gate da Rodada 3U — propagação contextual final.
 *
 * Três páginas com contratos distintos:
 *  - /suporte-tecnico-remoto  (modalidade de atendimento, público misto)
 *  - /seguranca-dos-dados     (institucional/educativa, WebPage — nunca Service)
 *  - /servicos/pc-gamer       (serviço comercial de montagem)
 *
 * Governança: zero rota nova, zero preço novo, zero SLA, zero plano mensal.
 */
import { test, expect } from "@playwright/test";

const REMOTE = "/suporte-tecnico-remoto";
const SECURITY = "/seguranca-dos-dados";
const ASSEMBLY = "/servicos/pc-gamer";

const SCOPE = [REMOTE, SECURITY, ASSEMBLY];

const BANNED = [
  "plano mensal",
  "mensalidade",
  "franquia de horas",
  "sla ",
  "ilimitado",
  "segurança total",
  "100% seguro",
  "nunca perca",
  "desempenho garantido",
  "fps garantid",
  "conformidade garantida",
  "em conformidade com a lgpd",
];

/**
 * Cláusulas de negação são conteúdo desejado (limite explícito), não claim.
 * São removidas antes da varredura para evitar falso positivo.
 */
const NEGATIONS = [
  /não é plano mensal[^.·]*/g,
  /acesso permanente não é mantido[^.·]*/g,
  /não prometemos[^.·]*/g,
  /sem promessa de[^.·]*/g,
];

async function bodyText(page: import("@playwright/test").Page) {
  return (await page.locator("body").innerText()).toLowerCase().replace(/\s+/g, " ");
}

async function claimText(page: import("@playwright/test").Page) {
  let text = await bodyText(page);
  for (const re of NEGATIONS) text = text.replace(re, " ");
  return text;
}

test.describe("3U — governança comum", () => {
  for (const path of SCOPE) {
    test(`${path}: sem claim proibido e sem preço novo`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const text = await claimText(page);
      for (const term of BANNED) {
        expect(text, `termo proibido em ${path}: ${term}`).not.toContain(term);
      }
      // Somente os valores oficiais publicados podem aparecer.
      const prices = text.match(/r\$\s?[\d.]+,\d{2}/g) ?? [];
      for (const p of prices) {
        expect(["r$ 99,99", "r$ 299,99"]).toContain(p.replace(/\s+/g, " "));
      }
    });

    test(`${path}: HTML estático com H1 único e canonical próprio`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toHaveCount(1);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toContain(path);
    });
  }
});

test.describe("3U — atendimento remoto", () => {
  test("elegibilidade, autorização, fluxo e limite presencial", async ({ page }) => {
    await page.goto(REMOTE);
    await page.waitForLoadState("networkidle");
    const text = await bodyText(page);
    expect(text).toContain("autoriza");
    // Acesso permanente só pode aparecer em negação explícita.
    if (text.includes("acesso permanente")) {
      expect(text).toMatch(/acesso permanente não é mantido/);
    }
    expect(text).toContain("conexão");
    expect(text).toMatch(/não pode ser (feito )?remot|precisa de atendimento presencial|presencial/);
    await expect(page.locator("#fluxo-remoto")).toBeVisible();
    await expect(page.locator("#seguranca-remota")).toBeVisible();
    await expect(page.locator("#limites-remoto")).toBeVisible();
  });

  test("CTA de triagem visível em mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(REMOTE);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("[data-triage-cta]").first()).toBeVisible();
  });
});

test.describe("3U — segurança dos dados", () => {
  test("emite WebPage e nunca Service/Offer/Product", async ({ page }) => {
    await page.goto(SECURITY);
    await page.waitForLoadState("networkidle");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.flatMap((b) => {
      try {
        const parsed = JSON.parse(b);
        return (Array.isArray(parsed) ? parsed : [parsed]).map((n) => n["@type"]);
      } catch {
        return [];
      }
    });
    expect(types).toContain("WebPage");
    for (const banned of ["Service", "Offer", "Product"]) {
      expect(types).not.toContain(banned);
    }
  });

  test("responsabilidade tripartida e proibição de credenciais", async ({ page }) => {
    await page.goto(SECURITY);
    await page.waitForLoadState("networkidle");
    const text = await bodyText(page);
    expect(text).toContain("cliente");
    expect(text).toContain("técnic");
    expect(text).toContain("fornecedor");
    expect(text).toMatch(/senha|credenci/);
  });

  test("no máximo dois CTAs de conversão", async ({ page }) => {
    await page.goto(SECURITY);
    await page.waitForLoadState("networkidle");
    const triage = await page.locator("[data-triage-cta]").count();
    const wa = await page.locator('main a[href*="wa.me"], article a[href*="wa.me"]').count();
    expect(triage + wa).toBeLessThanOrEqual(2);
  });
});

test.describe("3U — montagem de PC", () => {
  test("contextos de uso, fluxo, compatibilidade e peças do cliente", async ({ page }) => {
    await page.goto(ASSEMBLY);
    await page.waitForLoadState("networkidle");
    const text = await bodyText(page);
    expect(text).toContain("workstation");
    expect(text).toContain("gamer");
    expect(text).toMatch(/compatibilidade|socket|chipset/);
    expect(text).toMatch(/peças do cliente|peças fornecidas/);
    expect(text).toMatch(/teste|checklist/);
    expect(text).toContain("garantia");
    await expect(page.locator("#para-quem-e")).toBeVisible();
    await expect(page.locator("#escopo-da-montagem")).toBeVisible();
  });
});

test.describe("3U — regressão dos templates anteriores", () => {
  for (const path of [
    "/servicos/manutencao-preventiva-empresas",
    "/servicos/backup-para-empresas",
    "/servicos/redes-e-wifi",
    "/empresa-de-ti-curitiba",
  ]) {
    test(`${path}: segue renderizando com H1 e CTA`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("[data-triage-cta]").first()).toBeVisible();
    });
  }
});
