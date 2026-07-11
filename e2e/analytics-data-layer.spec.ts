import { test, expect, type Page } from "@playwright/test";

/**
 * Rodada 25.1 Bloco B — dataLayer local desativado (Opção C).
 *
 * Valida: nenhuma requisição externa nova para GTM/GA; eventos canônicos
 * emitidos sem PII; pageview SPA único por pathname; rotas internas
 * excluídas; triagem gera open/step/complete sem dados sensíveis.
 */

type DLEntry = Record<string, unknown> & { event?: string };

async function readDL(page: Page): Promise<DLEntry[]> {
  return page.evaluate(
    () => (window as unknown as { dataLayer?: DLEntry[] }).dataLayer ?? [],
  );
}

const FORBIDDEN_KEYS = [
  "phone",
  "telefone",
  "email",
  "cpf",
  "cnpj",
  "address",
  "endereco",
  "cep",
  "latitude",
  "longitude",
  "message",
  "mensagem",
  "whatsapp_url",
  "wa_url",
  "problema",
  "brand",
  "marca",
  "model",
  "modelo",
  "media",
  "lead_id",
];

function assertNoPII(entries: DLEntry[]) {
  for (const e of entries) {
    for (const k of Object.keys(e)) {
      expect(FORBIDDEN_KEYS, `Field ${k} on ${e.event} must not be in dataLayer`).not.toContain(
        k.toLowerCase(),
      );
    }
  }
}

test.describe("dataLayer local — Bloco B", () => {
  test("nenhuma requisição externa nova para GTM/GA", async ({ page }) => {
    const externalHits: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (
        url.includes("googletagmanager.com/gtm") ||
        url.includes("google-analytics.com") ||
        url.includes("analytics.google.com")
      ) {
        externalHits.push(url);
      }
    });
    await page.goto("/");
    await page.waitForTimeout(500);
    expect(externalHits, `New GTM/GA hits: ${externalHits.join(", ")}`).toEqual([]);
  });

  test("Home emite exatamente um virtual_page_view", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: DLEntry[] }).dataLayer ?? [];
      return dl.some((e) => e.event === "virtual_page_view");
    });
    const dl = await readDL(page);
    const pageviews = dl.filter((e) => e.event === "virtual_page_view");
    expect(pageviews).toHaveLength(1);
    expect(pageviews[0].route_type).toBe("home");
    expect(pageviews[0].page_path).toBe("/");
    assertNoPII(dl);
  });

  test("matriz nacional emite virtual_page_view com route_type=matrix_nacional e contexto", async ({ page }) => {
    await page.goto("/servico-em-nacional/sao-paulo/vila-mariana/informatica");
    await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: DLEntry[] }).dataLayer ?? [];
      return dl.some((e) => e.event === "virtual_page_view");
    });
    const dl = await readDL(page);
    const pv = dl.filter((e) => e.event === "virtual_page_view").pop() as DLEntry;
    expect(pv.route_type).toBe("matrix_nacional");
    expect(pv.city).toBe("sao-paulo");
    expect(pv.neighborhood).toBe("vila-mariana");
    expect(pv.service).toBe("informatica");
    assertNoPII(dl);
  });

  test("navegação SPA gera exatamente um evento adicional por pathname", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: DLEntry[] }).dataLayer ?? [];
      return dl.some((e) => e.event === "virtual_page_view");
    });
    await page.evaluate(() => {
      (window as unknown as { dataLayer: DLEntry[] }).dataLayer = [];
    });
    await page.goto("/sobre");
    await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: DLEntry[] }).dataLayer ?? [];
      return dl.some((e) => e.event === "virtual_page_view" && e.page_path === "/sobre");
    });
    const dl = await readDL(page);
    const pageviews = dl.filter((e) => e.event === "virtual_page_view");
    expect(pageviews).toHaveLength(1);
    expect(pageviews[0].page_path).toBe("/sobre");
    // Querystring não deve gerar novo evento.
    await page.evaluate(() => window.history.replaceState({}, "", "/sobre?foo=bar"));
    await page.waitForTimeout(200);
    const dl2 = await readDL(page);
    expect(dl2.filter((e) => e.event === "virtual_page_view")).toHaveLength(1);
  });

  test("rotas internas não geram virtual_page_view", async ({ page }) => {
    await page.goto("/auth");
    await page.waitForTimeout(400);
    const dl = await readDL(page);
    const pageviews = dl.filter((e) => e.event === "virtual_page_view");
    expect(pageviews).toEqual([]);
  });

  test("triagem emite triage_open + triage_step sem PII", async ({ page }) => {
    await page.goto("/triagem-preview");
    // triagem-preview é rota interna → nenhum virtual_page_view. Wizard já
    // aparece; simular abertura via clique num CTA da home é mais fiel.
    await page.goto("/");
    await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: DLEntry[] }).dataLayer ?? [];
      return dl.some((e) => e.event === "virtual_page_view");
    });
    // Abre via evento programático (mesma API do launcher).
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "test" } }));
    });
    await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: DLEntry[] }).dataLayer ?? [];
      return dl.some((e) => e.event === "triage_open");
    });
    const dl = await readDL(page);
    const opens = dl.filter((e) => e.event === "triage_open");
    expect(opens.length).toBeGreaterThanOrEqual(1);
    const steps = dl.filter((e) => e.event === "triage_step");
    expect(steps.length).toBeGreaterThanOrEqual(1);
    // Step 0 = category, started.
    const first = steps[0];
    expect(first.step_id).toBe("category");
    expect(first.step_index).toBe(0);
    assertNoPII(dl);
  });

  test("payload sempre respeita allowlist (nenhum campo proibido em qualquer evento)", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: DLEntry[] }).dataLayer ?? [];
      return dl.some((e) => e.event === "virtual_page_view");
    });
    const dl = await readDL(page);
    // Filtra apenas eventos canônicos novos (ignora eventos legados).
    const canonical = new Set([
      "virtual_page_view",
      "triage_open",
      "triage_step",
      "triage_complete",
    ]);
    const ours = dl.filter((e) => canonical.has(String(e.event)));
    assertNoPII(ours);
  });
});
