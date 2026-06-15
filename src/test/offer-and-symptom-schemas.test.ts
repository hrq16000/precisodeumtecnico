import { describe, it, expect } from "vitest";
import { buildOfferSchema } from "@/components/seo/OfferSchema";
import { buildSymptomFAQ } from "@/components/seo/SymptomFAQ";
import { SYMPTOMS, getSymptomBySlug } from "@/data/symptoms";

describe("Fase A — JSON-LD Offer", () => {
  const schema = buildOfferSchema({
    serviceName: "Assistência técnica em Curitiba",
    areaServed: "Curitiba",
    url: "https://precisodeumtecnico.com/assistencia-tecnica-curitiba",
  });

  it("é Service com provider LocalBusiness", () => {
    expect(schema["@type"]).toBe("Service");
    expect((schema.provider as { "@type": string })["@type"]).toBe("LocalBusiness");
  });

  it("expõe a visita de R$ 99,99 com priceSpecification de 30 min", () => {
    const visita = schema.offers[0];
    expect(visita.price).toBe("99.99");
    expect(visita.priceCurrency).toBe("BRL");
    const spec = visita.priceSpecification as {
      referenceQuantity: { value: number; unitCode: string };
    };
    expect(spec.referenceQuantity.value).toBe(30);
    expect(spec.referenceQuantity.unitCode).toBe("MIN");
  });

  it("inclui bancada R$ 90 como segunda oferta", () => {
    expect(schema.offers[1].price).toBe("90.00");
  });
});

describe("Fase A — FAQPage por sintoma", () => {
  it("retorna null sem itens", () => {
    expect(buildSymptomFAQ("vazio", [])).toBeNull();
  });

  it("gera FAQPage válido para todos os sintomas catalogados", () => {
    for (const s of SYMPTOMS) {
      const faq = buildSymptomFAQ(s.label, s.faq);
      expect(faq).not.toBeNull();
      expect(faq!["@type"]).toBe("FAQPage");
      expect(Array.isArray(faq!.mainEntity)).toBe(true);
      expect(faq!.mainEntity.length).toBeGreaterThan(0);
      for (const q of faq!.mainEntity as Array<{ "@type": string; acceptedAnswer: { text: string } }>) {
        expect(q["@type"]).toBe("Question");
        expect(q.acceptedAnswer.text.length).toBeGreaterThan(10);
      }
    }
  });

  it("expõe regra de triagem coerente em cada sintoma", () => {
    for (const s of SYMPTOMS) {
      expect(["bancada", "visita", "coleta"]).toContain(s.triage.mode);
      expect(s.triage.ticketMax).toBeGreaterThanOrEqual(s.triage.ticketMin);
      expect(s.triage.slaMaxDays).toBeGreaterThanOrEqual(s.triage.slaMinDays);
    }
  });

  it("lookup por slug funciona", () => {
    expect(getSymptomBySlug("tv-nao-liga-led-pisca")?.category).toBe("tv");
    expect(getSymptomBySlug("inexistente")).toBeUndefined();
  });
});
