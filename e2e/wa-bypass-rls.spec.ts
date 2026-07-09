import { test, expect } from "@playwright/test";

/**
 * Rodada 15 — RLS hardening de `wa_bypass_events`.
 *
 * Valida contra o Supabase real usando a anon key pública:
 *  - INSERT válido (kind=whatsapp) → 201
 *  - INSERT válido (kind=phone) → 201
 *  - INSERT kind inválido ("tel", "sms", "") → violação de policy (4xx)
 *  - INSERT com source > 120 chars → violação de policy (4xx)
 *  - SELECT como anon → bloqueado (retorna [] por RLS)
 *  - UPDATE/DELETE como anon → bloqueado
 */

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? "https://fqqufspxwujutthpjymh.supabase.co";
const ANON =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxcXVmc3B4d3VqdXR0aHBqeW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDA5NjcsImV4cCI6MjA4MDM3Njk2N30.9hz5oXC2w9nJ5k3_BJ_xH4IuEkdDTUbqv2Cn9Ggi-Sg";

const REST = `${SUPABASE_URL}/rest/v1/wa_bypass_events`;
const headers = {
  apikey: ANON,
  Authorization: `Bearer ${ANON}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

test.describe("wa_bypass_events — RLS policy", () => {
  test("aceita kind=whatsapp válido", async ({ request }) => {
    const res = await request.post(REST, {
      headers,
      data: {
        kind: "whatsapp",
        source: "e2e-rls-test",
        bypass: false,
        session_id: "e2e-" + Date.now(),
      },
    });
    expect(res.status(), await res.text()).toBe(201);
  });

  test("aceita kind=phone válido", async ({ request }) => {
    const res = await request.post(REST, {
      headers,
      data: { kind: "phone", source: "e2e-rls-test", bypass: false },
    });
    expect(res.status(), await res.text()).toBe(201);
  });

  test("rejeita kind inválido (tel)", async ({ request }) => {
    const res = await request.post(REST, {
      headers,
      data: { kind: "tel", source: "e2e-rls-test", bypass: false },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("rejeita kind vazio", async ({ request }) => {
    const res = await request.post(REST, {
      headers,
      data: { kind: "", source: "e2e-rls-test", bypass: false },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("rejeita source > 120 chars", async ({ request }) => {
    const res = await request.post(REST, {
      headers,
      data: { kind: "whatsapp", source: "x".repeat(121), bypass: false },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("rejeita href > 2048 chars", async ({ request }) => {
    const res = await request.post(REST, {
      headers,
      data: { kind: "whatsapp", href: "https://a/".padEnd(2100, "b"), bypass: false },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("anon SELECT retorna vazio (RLS bloqueia leitura)", async ({ request }) => {
    const res = await request.get(`${REST}?select=id&limit=5`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });

  test("anon UPDATE é bloqueado", async ({ request }) => {
    const res = await request.patch(`${REST}?source=eq.e2e-rls-test`, {
      headers,
      data: { source: "hacked" },
    });
    // Sem policy de UPDATE → 0 linhas afetadas (200 [] ou 4xx).
    if (res.status() === 200) {
      const body = await res.json();
      expect(body).toEqual([]);
    } else {
      expect(res.status()).toBeGreaterThanOrEqual(400);
    }
  });

  test("anon DELETE é bloqueado", async ({ request }) => {
    const res = await request.delete(`${REST}?source=eq.e2e-rls-test`, { headers });
    if (res.status() === 200) {
      const body = await res.json();
      expect(body).toEqual([]);
    } else {
      expect(res.status()).toBeGreaterThanOrEqual(400);
    }
  });
});
