import { test, expect } from "@playwright/test";

/**
 * Fluxo de localização/GPS.
 * - Concede geolocation e injeta coordenadas de Curitiba (Batel).
 * - Intercepta o reverse geocoding do Nominatim para não bater na rede real.
 * - Verifica que aceitar GPS:
 *     1. persiste city/neighborhood em `user_location_full_v1` com source=gps;
 *     2. dispara feedback de sucesso;
 *     3. o WhatsApp float passa a carregar cidade/bairro na querystring.
 * - Verifica que permissão negada não quebra a UX e permite fallback manual.
 */

const CURITIBA = { latitude: -25.4372, longitude: -49.2916, accuracy: 20 };

const NOMINATIM_MOCK = {
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

async function primeContext(context: import("@playwright/test").BrowserContext) {
  await context.grantPermissions(["geolocation"], { origin: "http://localhost:5173" });
  await context.setGeolocation(CURITIBA);
  await context.route("**/nominatim.openstreetmap.org/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(NOMINATIM_MOCK) }),
  );
}

test("GPS aceito preenche cidade/bairro e persiste com source=gps", async ({ context, page }) => {
  await primeContext(context);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  // Prompt aparece após 5s — aguarda até 15s por segurança.
  const dialog = page.getByTestId("smart-location-dialog");
  await expect(dialog).toBeVisible({ timeout: 15_000 });

  await page.getByTestId("smart-location-gps").click();
  await expect(page.getByTestId("smart-location-success")).toBeVisible({ timeout: 10_000 });

  await expect(page.getByTestId("smart-location-city")).toHaveValue("Curitiba");
  await expect(page.getByTestId("smart-location-neighborhood")).toHaveValue("Batel");

  const stored = await page.evaluate(() => localStorage.getItem("user_location_full_v1"));
  expect(stored, "user_location_full_v1 persistido").not.toBeNull();
  const parsed = JSON.parse(stored!);
  expect(parsed.source).toBe("gps");
  expect(parsed.city).toBe("Curitiba");
  expect(parsed.neighborhood).toBe("Batel");
  expect(parsed.uf?.toUpperCase()).toBe("PR");
});

test("cidade/bairro do GPS chegam no CTA WhatsApp", async ({ context, page }) => {
  await primeContext(context);
  // Pré-popula como se o usuário já tivesse aceitado GPS antes.
  await page.addInitScript(() => {
    localStorage.setItem(
      "user_location_full_v1",
      JSON.stringify({
        city: "Curitiba",
        uf: "PR",
        neighborhood: "Batel",
        street: "Alameda Dr. Carlos de Carvalho",
        number: "555",
        source: "gps",
        savedAt: new Date().toISOString(),
      }),
    );
  });

  await page.goto("/assistencia-tecnica-curitiba", { waitUntil: "networkidle" });

  const waLinks = page.locator('a[href*="wa.me"]');
  const n = await waLinks.count();
  expect(n).toBeGreaterThan(0);
  const href = decodeURIComponent((await waLinks.first().getAttribute("href")) ?? "");
  expect(href.toLowerCase()).toContain("curitiba");
  expect(href.toLowerCase()).toContain("batel");
});

test("permissão negada não quebra a UX e permite manual", async ({ context, page }) => {
  // Sem grantPermissions: a chamada é negada.
  await context.clearPermissions();
  await context.route("**/nominatim.openstreetmap.org/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("smart-location-dialog")).toBeVisible({ timeout: 15_000 });
  await page.getByTestId("smart-location-gps").click();

  // Mensagem de erro renderizada, sem crash.
  await expect(page.getByTestId("smart-location-error")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId("smart-location-city")).toBeVisible();

  // Preenchimento manual funciona.
  await page.getByTestId("smart-location-city").fill("São José dos Pinhais");
  await page.getByTestId("smart-location-neighborhood").fill("Centro");
  await page.getByRole("button", { name: /Confirmar|Fechar/ }).click();

  const stored = await page.evaluate(() => localStorage.getItem("user_location_full_v1"));
  expect(stored).not.toBeNull();
  const parsed = JSON.parse(stored!);
  expect(parsed.city).toBe("São José dos Pinhais");
  expect(parsed.source).toBe("manual");
});
