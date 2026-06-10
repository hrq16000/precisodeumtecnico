import { describe, it, expect, beforeEach } from "vitest";
import { trackWhatsAppClick } from "./analytics";

describe("trackWhatsAppClick — attribution payload", () => {
  beforeEach(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    window.sessionStorage?.clear();
    // Simulate landing with UTM + gclid in the URL.
    const url = new URL(
      "https://example.com/assistencia-tecnica-curitiba?utm_source=google&utm_medium=cpc&utm_campaign=assistencia_curitiba&utm_term=conserto_ps5&utm_content=hero&gclid=Cj0KCQiATEST&fbclid=IwAR0TEST",
    );
    window.history.replaceState({}, "", url.pathname + url.search);
  });

  it("includes utm_* and gclid in the dataLayer payload", () => {
    trackWhatsAppClick({ source: "curitiba_lp_hero", city: "Curitiba" });
    const dl = (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const last = dl[dl.length - 1];
    expect(last.event).toBe("whatsapp_click");
    expect(last.source).toBe("curitiba_lp_hero");
    expect(last.city).toBe("Curitiba");
    expect(last.utm_source).toBe("google");
    expect(last.utm_medium).toBe("cpc");
    expect(last.utm_campaign).toBe("assistencia_curitiba");
    expect(last.utm_term).toBe("conserto_ps5");
    expect(last.utm_content).toBe("hero");
    expect(last.gclid).toBe("Cj0KCQiATEST");
    expect(last.fbclid).toBe("IwAR0TEST");
  });

  it("persists attribution across subsequent clicks within the session", () => {
    trackWhatsAppClick({ source: "curitiba_lp_hero" });
    // Clear URL to simulate internal nav stripping query params
    window.history.replaceState({}, "", "/assistencia-tecnica-curitiba");
    trackWhatsAppClick({ source: "curitiba_lp_final_cta" });
    const dl = (window as unknown as { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const last = dl[dl.length - 1];
    expect(last.utm_source).toBe("google");
    expect(last.gclid).toBe("Cj0KCQiATEST");
  });
});
