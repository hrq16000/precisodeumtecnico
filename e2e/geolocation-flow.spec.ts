import { test, expect, type BrowserContext } from "@playwright/test";

/**
 * Fluxo de localização/GPS — Rodada 13.
 * Cobre: GPS ok, GPS + reverse geocode falha, IP não sobrescreve GPS, permissão negada.
 * Verifica: latitude/longitude/accuracy persistidos, cidade/bairro no WhatsApp,
 * source correto e fallback manual.
 */

const CURITIBA = { latitude: -25.4372, longitude: -49.2916, accuracy: 20 };

const NOMINATIM_OK = {
  address: {
    road: "Alameda Dr. Carlos de Carvalho",
    house_number: "555",
    suburb: "Batel",
    city: "Curitiba",
    state: "Paraná",
    state_code: "PR",
    country: "Brasil",
    country_code: "br",
    postcode: "80430-180",
  },
};

async function mockNominatimOk(context: BrowserContext) {
  await context.route("**/nominatim.openstreetmap.org/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(NOMINATIM_OK) }),
  );
}

async function mockNominatimFail(context: BrowserContext) {
  await context.route("**/nominatim.openstreetmap.org/**", (route) => route.abort());
}

async function grantGps(context: BrowserContext) {
  await context.grantPermissions(["geolocation"], { origin: "http://localhost:5173" });
  await context.setGeolocation(CURITIBA);
}

// ─── Cenário A ────────────────────────────────────────────────────────────────
test("A: GPS aceito + reverse geocode OK grava coordenadas + endereço", async ({ context, page }) => {
  await grantGps(context);
  await mockNominatimOk(context);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("smart-location-dialog")).toBeVisible({ timeout: 15_000 });
  await page.getByTestId("smart-location-gps").click();
  await expect(page.getByTestId("smart-location-success")).toBeVisible({ timeout: 10_000 });

  await expect(page.getByTestId("smart-location-city")).toHaveValue("Curitiba");
  await expect(page.getByTestId("smart-location-neighborhood")).toHaveValue("Batel");

  const parsed = JSON.parse(
    (await page.evaluate(() => localStorage.getItem("user_location_full_v1")))!,
  );
  expect(parsed.source).toBe("gps");
  expect(parsed.city).toBe("Curitiba");
  expect(parsed.neighborhood).toBe("Batel");
  expect(parsed.uf?.toUpperCase()).toBe("PR");
  expect(typeof parsed.latitude).toBe("number");
  expect(typeof parsed.longitude).toBe("number");
  expect(typeof parsed.accuracy).toBe("number");
  expect(parsed.detectedAt).toBeTruthy();
  expect(parsed.reverseGeocodedAt).toBeTruthy();
});

// ─── Cenário B ────────────────────────────────────────────────────────────────
test("B: GPS aceito + reverse geocode falha mantém coordenadas e source=gps", async ({ context, page }) => {
  await grantGps(context);
  await mockNominatimFail(context);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("smart-location-dialog")).toBeVisible({ timeout: 15_000 });
  await page.getByTestId("smart-location-gps").click();
  await expect(page.getByTestId("smart-location-warning")).toBeVisible({ timeout: 10_000 });

  const parsed = JSON.parse(
    (await page.evaluate(() => localStorage.getItem("user_location_full_v1")))!,
  );
  expect(parsed.source).toBe("gps");
  expect(typeof parsed.latitude).toBe("number");
  expect(typeof parsed.longitude).toBe("number");
  expect(typeof parsed.accuracy).toBe("number");

  // Preenchimento manual continua funcionando (edição pós-GPS persiste na hora).
  await page.getByTestId("smart-location-city").fill("Curitiba");
  const afterEdit = JSON.parse(
    (await page.evaluate(() => localStorage.getItem("user_location_full_v1")))!,
  );
  expect(afterEdit.city).toBe("Curitiba");
  expect(afterEdit.source).toBe("gps"); // coordenadas ainda presentes
});

// ─── Cenário C ────────────────────────────────────────────────────────────────
test("C: IP não sobrescreve GPS persistido", async ({ context, page }) => {
  await context.route("**/ipwho.is/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
      success: true, city: "São Paulo", region_code: "SP", country_code: "BR",
    }) }),
  );
  await page.addInitScript(() => {
    localStorage.setItem("user_location_full_v1", JSON.stringify({
      city: "Curitiba", uf: "PR", neighborhood: "Batel",
      latitude: -25.4372, longitude: -49.2916, accuracy: 20,
      source: "gps", savedAt: new Date().toISOString(),
    }));
  });

  await page.goto("/assistencia-tecnica-curitiba", { waitUntil: "networkidle" });

  const stored = JSON.parse(
    (await page.evaluate(() => localStorage.getItem("user_location_full_v1")))!,
  );
  expect(stored.source).toBe("gps");
  expect(stored.city).toBe("Curitiba");

  const href = decodeURIComponent(
    (await page.locator('a[href*="wa.me"]').first().getAttribute("href")) ?? "",
  );
  expect(href.toLowerCase()).toContain("curitiba");
  expect(href.toLowerCase()).toContain("batel");
});

// ─── Cenário D ────────────────────────────────────────────────────────────────
test("D: permissão negada mantém manual e não grava GPS falso", async ({ context, page }) => {
  await context.clearPermissions();
  await mockNominatimOk(context);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("smart-location-dialog")).toBeVisible({ timeout: 15_000 });
  await page.getByTestId("smart-location-gps").click();
  await expect(page.getByTestId("smart-location-error")).toBeVisible({ timeout: 10_000 });

  await page.getByTestId("smart-location-city").fill("São José dos Pinhais");
  await page.getByTestId("smart-location-neighborhood").fill("Centro");
  await page.getByRole("button", { name: /Confirmar|Fechar/ }).click();

  const parsed = JSON.parse(
    (await page.evaluate(() => localStorage.getItem("user_location_full_v1")))!,
  );
  expect(parsed.city).toBe("São José dos Pinhais");
  expect(parsed.source).toBe("manual");
  expect(parsed.latitude).toBeUndefined();
});
