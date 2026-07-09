import { test, expect, type BrowserContext } from "@playwright/test";

/**
 * Rodada 14 — Fluxo de localização/GPS + WhatsApp context.
 * Todos os cenários usam mocks (Nominatim/IP) e coords injetadas via Playwright.
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
  // Sem `origin` — vale para qualquer origem no context (localhost:5173 ou :8080).
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation(CURITIBA);
}
async function disableTriage(context: BrowserContext) {
  // Força wa.me direto (não button do TriageWizard) para observar o link.
  await context.addInitScript(() => {
    try { window.localStorage.setItem("triage", "0"); } catch { /* noop */ }
  });
}

// ─── A ────────────────────────────────────────────────────────────────────────
test("A: GPS aceito + reverse geocode OK grava coordenadas + endereço", async ({ context, page }) => {
  await grantGps(context); await mockNominatimOk(context);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("smart-location-dialog")).toBeVisible({ timeout: 15_000 });
  await page.getByTestId("smart-location-gps").click();
  await expect(page.getByTestId("smart-location-success")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId("smart-location-city")).toHaveValue("Curitiba");
  await expect(page.getByTestId("smart-location-neighborhood")).toHaveValue("Batel");
  await expect(page.getByTestId("smart-location-accuracy")).toBeVisible();

  const parsed = JSON.parse((await page.evaluate(() => localStorage.getItem("user_location_full_v1")))!);
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

// ─── B ────────────────────────────────────────────────────────────────────────
test("B: GPS aceito + reverse geocode falha mantém coordenadas e source=gps", async ({ context, page }) => {
  await grantGps(context); await mockNominatimFail(context);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("smart-location-dialog")).toBeVisible({ timeout: 15_000 });
  await page.getByTestId("smart-location-gps").click();
  await expect(page.getByTestId("smart-location-warning")).toBeVisible({ timeout: 10_000 });

  const parsed = JSON.parse((await page.evaluate(() => localStorage.getItem("user_location_full_v1")))!);
  expect(parsed.source).toBe("gps");
  expect(typeof parsed.latitude).toBe("number");
  expect(typeof parsed.accuracy).toBe("number");

  await page.getByTestId("smart-location-city").fill("Curitiba");
  const after = JSON.parse((await page.evaluate(() => localStorage.getItem("user_location_full_v1")))!);
  expect(after.city).toBe("Curitiba");
  expect(after.source).toBe("gps");
});

// ─── C ────────────────────────────────────────────────────────────────────────
test("C: IP não sobrescreve GPS persistido e WhatsApp usa cidade/bairro", async ({ context, page }) => {
  await disableTriage(context);
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

  const stored = JSON.parse((await page.evaluate(() => localStorage.getItem("user_location_full_v1")))!);
  expect(stored.source).toBe("gps");
  expect(stored.city).toBe("Curitiba");

  // Ao menos um link wa.me carrega cidade E bairro.
  const hrefs = await page.locator('a[href*="wa.me"]').evaluateAll((els) =>
    els.map((e) => decodeURIComponent((e as HTMLAnchorElement).href).toLowerCase()),
  );
  expect(hrefs.some((h) => h.includes("curitiba") && h.includes("batel"))).toBe(true);
});

// ─── D ────────────────────────────────────────────────────────────────────────
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

  const parsed = JSON.parse((await page.evaluate(() => localStorage.getItem("user_location_full_v1")))!);
  expect(parsed.city).toBe("São José dos Pinhais");
  expect(parsed.source).toBe("manual");
  expect(parsed.latitude).toBeUndefined();
});

// ─── E ── WhatsApp: só coordenadas (sem endereço) não injeta cidade fabricada ─
test("E: WhatsApp float usa cidade/bairro quando existem; sem endereço, não inventa", async ({ context, page }) => {
  await disableTriage(context);

  // Caso 1: storage completo → link contém cidade e bairro.
  await page.addInitScript(() => {
    localStorage.setItem("user_location_full_v1", JSON.stringify({
      city: "Pinhais", uf: "PR", neighborhood: "Centro",
      latitude: -25.44, longitude: -49.19, accuracy: 30,
      source: "gps", savedAt: new Date().toISOString(),
    }));
  });
  await page.goto("/", { waitUntil: "networkidle" });
  const float1 = page.locator('a[data-wa-source="float"]').first();
  await expect(float1).toBeVisible();
  const h1 = decodeURIComponent((await float1.getAttribute("href"))!).toLowerCase();
  expect(h1).toContain("pinhais");
  expect(h1).toContain("centro");

  // Caso 2: só coordenadas → nenhum nome de cidade fabricado no link.
  await page.evaluate(() => {
    localStorage.setItem("user_location_full_v1", JSON.stringify({
      latitude: -25.44, longitude: -49.19, accuracy: 30,
      source: "gps", savedAt: new Date().toISOString(),
    }));
  });
  await page.reload({ waitUntil: "networkidle" });
  const float2 = page.locator('a[data-wa-source="float"]').first();
  await expect(float2).toBeVisible();
  const h2 = decodeURIComponent((await float2.getAttribute("href"))!).toLowerCase();
  // Sem cidade/bairro no storage, o link não deve conter esses tokens específicos.
  expect(h2).not.toContain("batel");
  expect(h2).not.toContain("pinhais");
  // E não deve inventar "curitiba" a partir de fallback default.
  expect(h2).not.toContain("região aproximada: curitiba");
});

// ─── F ── Reset limpa storage e dispara evento ────────────────────────────────
test("F: botão de reset limpa storage após confirmação", async ({ context, page }) => {
  await grantGps(context); await mockNominatimOk(context);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("smart-location-dialog")).toBeVisible({ timeout: 15_000 });
  await page.getByTestId("smart-location-gps").click();
  await expect(page.getByTestId("smart-location-success")).toBeVisible({ timeout: 10_000 });

  expect(await page.evaluate(() => localStorage.getItem("user_location_full_v1"))).not.toBeNull();

  await page.getByTestId("smart-location-reset").click();
  await expect(page.getByTestId("smart-location-reset-confirm")).toBeVisible();
  await page.getByRole("button", { name: "Sim" }).click();

  expect(await page.evaluate(() => localStorage.getItem("user_location_full_v1"))).toBeNull();
});
