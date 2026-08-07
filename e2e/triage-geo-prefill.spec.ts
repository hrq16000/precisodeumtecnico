import { test, expect } from "@playwright/test";

/**
 * Prefill geográfico do funil: o bairro detectado (GPS/manual/IP) deve
 * sugerir o campo "Bairro do atendimento" sem sobrescrever edição manual.
 */
test("triagem sugere o bairro detectado e permite edição", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "user_location_full_v1",
      JSON.stringify({ city: "Curitiba", uf: "PR", neighborhood: "Boqueirão", source: "gps" }),
    );
    localStorage.setItem("triage", "1");
  });
  await page.goto("/");
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent("triage:open", { detail: { source: "e2e-geo" } }));
  });

  const field = page.locator("#triage-field-neighborhood");
  await expect(field).toHaveValue("Boqueirão", { timeout: 10_000 });
  await expect(page.getByTestId("triage-geo-hint")).toBeVisible();

  await field.fill("Portão");
  await expect(field).toHaveValue("Portão");
});
