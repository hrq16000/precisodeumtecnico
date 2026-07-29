import { describe, it, expect } from "vitest";
import {
  makeInitialStateV2, reducerV2, determineServiceRoute,
  validateCurrentStep, buildWhatsAppTriageMessage, buildTriageSummary,
} from "@/lib/triage/engine";

function withEquipment(eq: Parameters<typeof reducerV2>[1] extends infer A ? A : never, ..._: unknown[]) { return eq; }

describe("triage engine — determineServiceRoute", () => {
  it("PC ligando + instalação → remoto", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "pc_notebook" });
    s = reducerV2(s, { type: "SET_DEVICE_FIELD", id: "pc_type", value: "notebook" });
    s = reducerV2(s, { type: "SET_DEVICE_FIELD", id: "power", value: "boots_ok" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "install_config" });
    expect(determineServiceRoute(s)).toBe("remoto");
  });

  it("PC ligando + limpeza de vírus → visita", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "pc_notebook" });
    s = reducerV2(s, { type: "SET_DEVICE_FIELD", id: "power", value: "boots_ok" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "virus_slow" });
    expect(determineServiceRoute(s)).toBe("visita");
  });

  it("PC não liga → coleta", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "pc_notebook" });
    s = reducerV2(s, { type: "SET_DEVICE_FIELD", id: "power", value: "no_power" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "no_power_board" });
    expect(determineServiceRoute(s)).toBe("coleta");
  });

  it("Notebook com possível placa → coleta", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "pc_notebook" });
    s = reducerV2(s, { type: "SET_DEVICE_FIELD", id: "power", value: "boots_ok" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "no_power_board" });
    expect(determineServiceRoute(s)).toBe("coleta");
  });

  it("TV → sempre coleta", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "tv" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "screen_broken" });
    expect(determineServiceRoute(s)).toBe("coleta");
  });

  it("Celular molhou → coleta", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "celular_tablet" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "wet" });
    expect(determineServiceRoute(s)).toBe("coleta");
  });

  it("Surface → sempre coleta", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "surface" });
    expect(determineServiceRoute(s)).toBe("coleta");
  });

  it("Videogame sem sintoma → coleta (fallback)", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "videogame" });
    expect(determineServiceRoute(s)).toBe("coleta");
  });

  it("Videogame controle → visita (sintoma leve)", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "videogame" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "controller" });
    expect(determineServiceRoute(s)).toBe("visita");
  });

  it("Videogame HDMI → visita (sintoma leve)", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "videogame" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "hdmi" });
    expect(determineServiceRoute(s)).toBe("visita");
  });

  it("Videogame não liga → coleta (não é leve)", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "videogame" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "no_power" });
    expect(determineServiceRoute(s)).toBe("coleta");
  });

  it("Som/áudio entrada não funciona → visita (sintoma leve)", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "som_audio" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "input_fail" });
    expect(determineServiceRoute(s)).toBe("visita");
  });

  it("Som/áudio ruído → coleta (fallback)", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "som_audio" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "noise" });
    expect(determineServiceRoute(s)).toBe("coleta");
  });

  it("Outro → coleta", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "outro" });
    expect(determineServiceRoute(s)).toBe("coleta");
  });
});



describe("triage engine — defaultRoute por equipamento (sem sintoma leve)", () => {
  const cases = [
    ["pc_notebook", "coleta"], // default seguro sem dados de energia/sintoma
    ["tv", "coleta"],
    ["celular_tablet", "coleta"],
    ["surface", "coleta"],
    ["som_audio", "coleta"],
    ["videogame", "coleta"],
    ["outro", "coleta"],
  ] as const;

  for (const [eq, expected] of cases) {
    it(`${eq} sem sintoma → ${expected} (defaultRoute)`, () => {
      let s = makeInitialStateV2();
      s = reducerV2(s, { type: "SET_EQUIPMENT", value: eq });
      expect(determineServiceRoute(s)).toBe(expected);
    });
  }

  it("som_audio + no_sound → visita (sintoma leve promove)", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "som_audio" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "no_sound" });
    expect(determineServiceRoute(s)).toBe("visita");
  });

  it("som_audio + one_channel → visita (sintoma leve promove)", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "som_audio" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "one_channel" });
    expect(determineServiceRoute(s)).toBe("visita");
  });
});


describe("triage engine — reset dependente", () => {
  it("alterar equipamento limpa deviceDetails, sintoma e termos", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "pc_notebook" });
    s = reducerV2(s, { type: "SET_DEVICE_FIELD", id: "pc_type", value: "notebook" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "install_config" });
    s = reducerV2(s, { type: "TOGGLE_TERM", key: "minimum", value: true });
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "tv" });
    expect(s.deviceDetails).toEqual({});
    expect(s.symptom).toBeUndefined();
    expect(s.termsAccepted).toEqual({});
  });
});

describe("triage engine — validação", () => {
  it("etapa equipment sem seleção → erro", () => {
    const s = makeInitialStateV2();
    expect(validateCurrentStep(s).ok).toBe(false);
  });

  it("etapa termos sem aceite → erro específico por rota (coleta)", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "tv" });
    s = reducerV2(s, { type: "GOTO", step: "termsAccepted" });
    const v = validateCurrentStep(s);
    expect(v.ok).toBe(false);
    expect(v.errors.minimum).toBeDefined();
    expect(v.errors.cancel).toBeDefined();
    expect(v.errors.sla).toBeDefined();
  });
});

describe("triage engine — mensagem WhatsApp humana", () => {
  it("não inclui campos vazios e traz assinatura da triagem", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "tv" });
    s = reducerV2(s, { type: "SET_DEVICE_FIELD", id: "tv_type", value: "led" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "screen_broken" });
    s = reducerV2(s, { type: "SET_URGENCY", value: "72h" });
    const msg = buildWhatsAppTriageMessage(s);
    expect(msg).toContain("Equipamento: TV");
    expect(msg).toContain("Modalidade indicada: Coleta e entrega");
    expect(msg).toContain("R$ 299,99");
    expect(msg).toContain("Confirmo que li e aceitei");
    expect(msg).toMatch(/Triagem #[a-f0-9]{8}/i);
    expect(msg).not.toContain("Marca/modelo:"); // vazio → omitido
  });
});

describe("triage engine — summary TV", () => {
  it("gera route Coleta e entrega + valor mínimo formatado", () => {
    let s = makeInitialStateV2();
    s = reducerV2(s, { type: "SET_EQUIPMENT", value: "tv" });
    s = reducerV2(s, { type: "SET_SYMPTOM", value: "screen_broken" });
    const sum = buildTriageSummary(s);
    expect(sum.route).toBe("Coleta e entrega");
    expect(sum.minimum).toBe("R$ 299,99");
  });
});
