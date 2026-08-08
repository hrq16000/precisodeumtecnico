import { describe, it, expect, beforeEach } from "vitest";
import { makeInitialStateV2 } from "@/lib/triage/engine";
import {
  saveTriageDraft, readTriageDraft, clearTriageDraft, mergeTriageDraft, TRIAGE_DRAFT_KEY,
} from "@/lib/triage/draft";

describe("rascunho do funil de triagem", () => {
  beforeEach(() => clearTriageDraft());

  it("persiste e restaura respostas do funil", () => {
    const s = makeInitialStateV2();
    s.equipment = "pc_notebook";
    s.contact.city = "Curitiba";
    s.contact.neighborhood = "Portão";
    s.scheduling = { preferredDate: "2026-08-10", preferredSlot: "manha" };
    saveTriageDraft(s);

    const restored = readTriageDraft();
    expect(restored?.equipment).toBe("pc_notebook");
    expect(restored?.contact.city).toBe("Curitiba");
    expect(restored?.scheduling?.preferredSlot).toBe("manha");
  });

  it("descarta rascunho expirado", () => {
    const s = makeInitialStateV2();
    s.equipment = "tv";
    sessionStorage.setItem(
      TRIAGE_DRAFT_KEY,
      JSON.stringify({ savedAt: Date.now() - 7 * 60 * 60 * 1000, state: s }),
    );
    expect(readTriageDraft()).toBeNull();
  });

  it("mescla mantendo campos novos do estado inicial e zera erros", () => {
    const initial = makeInitialStateV2();
    const draft = makeInitialStateV2();
    draft.symptom = "nao-liga";
    draft.validationErrors = { name: "obrigatório" };
    const merged = mergeTriageDraft(initial, draft);
    expect(merged.symptom).toBe("nao-liga");
    expect(merged.validationErrors).toEqual({});
    expect(merged.contact).toHaveProperty("city");
  });

  it("retorna o estado inicial quando não há rascunho", () => {
    const initial = makeInitialStateV2();
    expect(mergeTriageDraft(initial, null)).toBe(initial);
  });
});
