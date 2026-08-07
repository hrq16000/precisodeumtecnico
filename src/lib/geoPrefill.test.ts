import { describe, it, expect, beforeEach } from "vitest";
import { readGeoPrefill } from "@/lib/geoPrefill";

describe("readGeoPrefill", () => {
  beforeEach(() => localStorage.clear());

  it("prioriza a rota /cidade/bairro sobre o storage", () => {
    localStorage.setItem(
      "user_location_full_v1",
      JSON.stringify({ city: "Curitiba", uf: "PR", neighborhood: "Boqueirão", source: "gps" }),
    );
    const r = readGeoPrefill("/atendimento-nacional/curitiba/santa-felicidade");
    expect(r.source).toBe("route");
    expect(r.neighborhood).toBe("Santa Felicidade");
  });

  it("usa GPS/manual do storage quando a rota não tem localidade", () => {
    localStorage.setItem(
      "user_location_full_v1",
      JSON.stringify({ city: "Curitiba", uf: "PR", neighborhood: "Boqueirão", source: "gps" }),
    );
    const r = readGeoPrefill("/");
    expect(r.source).toBe("gps");
    expect(r.neighborhood).toBe("Boqueirão");
    expect(r.city).toBe("Curitiba");
  });

  it("cai para IP legado", () => {
    localStorage.setItem("user_region_v1", JSON.stringify({ city: "Pinhais", region: "PR" }));
    const r = readGeoPrefill("/");
    expect(r.source).toBe("ip");
    expect(r.city).toBe("Pinhais");
  });

  it("retorna none sem dados", () => {
    expect(readGeoPrefill("/").source).toBe("none");
  });
});
