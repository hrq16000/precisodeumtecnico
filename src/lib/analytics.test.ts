import { describe, it, expect, beforeEach } from "vitest";
import {
  trackEvent,
  trackTermsOpen,
  trackTermsAccept,
  trackTermsFullPageClick,
  getStoredTermsAcceptance,
  setStoredTermsAcceptance,
} from "./analytics";

describe("analytics", () => {
  beforeEach(() => {
    window.dataLayer = [];
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it("creates dataLayer if missing and pushes events", () => {
    delete (window as unknown as { dataLayer?: unknown }).dataLayer;
    trackEvent("custom_event", { foo: "bar" });
    expect(Array.isArray(window.dataLayer)).toBe(true);
    expect(window.dataLayer![0]).toMatchObject({ event: "custom_event", foo: "bar" });
  });

  it("pushes terms-specific events with source", () => {
    trackTermsOpen("hero");
    trackTermsAccept("contact_form");
    trackTermsFullPageClick("quiz");
    const events = (window.dataLayer ?? []) as Array<Record<string, unknown>>;
    expect(events.map((e) => e.event)).toEqual([
      "terms_open",
      "terms_accept",
      "terms_full_page_click",
    ]);
    expect(events[0].source).toBe("hero");
  });

  it("persists and reads terms acceptance in sessionStorage", () => {
    expect(getStoredTermsAcceptance()).toBe(false);
    setStoredTermsAcceptance(true);
    expect(getStoredTermsAcceptance()).toBe(true);
    expect(window.sessionStorage.getItem("pdt_terms_accepted_v1")).toBe("1");
    setStoredTermsAcceptance(false);
    expect(getStoredTermsAcceptance()).toBe(false);
  });
});
