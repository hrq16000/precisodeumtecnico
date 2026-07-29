import { test, expect } from "@playwright/test";

/**
 * Contrato: quando o usuário conclui triagem em uma página do namespace
 * /atendimento-nacional/:city[/:bairro] e o sintoma é leve (vira "visita"),
 * o link do WhatsApp gerado deve carregar tokens parseáveis:
 *   [cat=... · sym=... · cidade=... · bairro=...]
 *
 * Usa a bridge de E2E (`?e2e=1`) que expõe `window.__PDT_E2E__` sem
 * exigir a jornada completa do wizard nem chamadas de rede.
 */

const CASES = [
  {
    path: "/atendimento-nacional/sao-paulo/pinheiros",
    equipment: "som_audio",
    symptomSlug: "input_fail",
    expectedCity: "sao-paulo",
    expectedBairro: "pinheiros",
  },
  {
    path: "/atendimento-nacional/rio-de-janeiro/copacabana",
    equipment: "videogame",
    symptomSlug: "hdmi",
    expectedCity: "rio-de-janeiro",
    expectedBairro: "copacabana",
  },
  {
    path: "/atendimento-nacional/sao-paulo",
    equipment: "som_audio",
    symptomSlug: "no_sound",
    expectedCity: "sao-paulo",
    expectedBairro: null,
  },
];

for (const c of CASES) {
  test(`WhatsApp URL carrega category/symptom/cidade/bairro em ${c.path}`, async ({ page }) => {
    await page.goto(`${c.path}?e2e=1`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.__PDT_E2E__), null, { timeout: 5000 });

    const url = await page.evaluate(
      ({ equipment, symptomSlug }) =>
        window.__PDT_E2E__!.buildTriageWaUrl({ equipment, symptomSlug }),
      { equipment: c.equipment, symptomSlug: c.symptomSlug },
    );

    expect(url.startsWith("https://wa.me/")).toBe(true);
    const decoded = decodeURIComponent(url.split("?text=")[1] ?? "");
    expect(decoded).toContain(`cat=${c.equipment}`);
    expect(decoded).toContain(`sym=${c.symptomSlug}`);
    expect(decoded).toContain(`cidade=${c.expectedCity}`);
    if (c.expectedBairro) {
      expect(decoded).toContain(`bairro=${c.expectedBairro}`);
    } else {
      expect(decoded).not.toContain("bairro=");
    }
  });
}
