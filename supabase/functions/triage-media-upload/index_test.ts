// Tests for the triage-media-upload edge function.
//
// These tests run against the deployed edge function (or locally served one)
// and verify the security contract:
//   1. init returns a sessionId + sessionToken
//   2. uploads with NO token are rejected (401)
//   3. uploads with a tampered token are rejected (401)
//   4. uploads with a sessionId that wasn't issued are rejected (401)
//   5. unsupported MIME types are rejected (415)
//   6. valid token + valid file is accepted and returns a server-controlled path
//
// Run with: deno test --allow-net --allow-env --allow-read

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import {
  assert,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ??
  Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  Deno.env.get("SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in env (.env at project root).",
  );
}

const FN_URL = `${SUPABASE_URL}/functions/v1/triage-media-upload`;
const baseHeaders = {
  apikey: SUPABASE_ANON,
  authorization: `Bearer ${SUPABASE_ANON}`,
};

async function initSession(): Promise<{ sessionId: string; sessionToken: string }> {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: { ...baseHeaders, "content-type": "application/json" },
    body: JSON.stringify({ action: "init" }),
  });
  const body = await res.json();
  assertEquals(res.status, 200, `init failed: ${JSON.stringify(body)}`);
  return body;
}

function pngFile(): File {
  // 1x1 transparent PNG
  const bytes = Uint8Array.from(
    atob(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgAAIAAAUAAen63NgAAAAASUVORK5CYII=",
    ),
    (c) => c.charCodeAt(0),
  );
  return new File([bytes], "pixel.png", { type: "image/png" });
}

Deno.test("init returns sessionId + sessionToken", async () => {
  const { sessionId, sessionToken } = await initSession();
  assert(/^[a-f0-9]{16,64}$/.test(sessionId), "sessionId format");
  assert(sessionToken.length > 20, "sessionToken length");
});

Deno.test("upload without token is rejected (anon cannot inject)", async () => {
  const fd = new FormData();
  fd.append("sessionId", "a".repeat(32));
  // No sessionToken on purpose.
  fd.append("file", pngFile());
  const res = await fetch(FN_URL, { method: "POST", headers: baseHeaders, body: fd });
  const body = await res.json();
  assertEquals(res.status, 401, `expected 401 got ${res.status}: ${JSON.stringify(body)}`);
  assertEquals(body.error, "invalid_token");
});

Deno.test("upload with tampered token is rejected", async () => {
  const { sessionId } = await initSession();
  const fd = new FormData();
  fd.append("sessionId", sessionId);
  fd.append("sessionToken", "not-a-real-token");
  fd.append("file", pngFile());
  const res = await fetch(FN_URL, { method: "POST", headers: baseHeaders, body: fd });
  const body = await res.json();
  assertEquals(res.status, 401);
  assertEquals(body.error, "invalid_token");
});

Deno.test("upload with attacker-chosen sessionId is rejected", async () => {
  // Attacker tries to inject into someone else's folder by guessing a sessionId
  // they did NOT receive from /init.
  const fd = new FormData();
  fd.append("sessionId", "deadbeefdeadbeefdeadbeefdeadbeef");
  fd.append("sessionToken", "anything");
  fd.append("file", pngFile());
  const res = await fetch(FN_URL, { method: "POST", headers: baseHeaders, body: fd });
  assertEquals(res.status, 401);
  await res.body?.cancel();
});

Deno.test("invalid sessionId format is rejected (400)", async () => {
  const fd = new FormData();
  fd.append("sessionId", "../../escape");
  fd.append("sessionToken", "x");
  fd.append("file", pngFile());
  const res = await fetch(FN_URL, { method: "POST", headers: baseHeaders, body: fd });
  const body = await res.json();
  assertEquals(res.status, 400);
  assertEquals(body.error, "invalid_session");
});

Deno.test("unsupported MIME type is rejected (415)", async () => {
  const session = await initSession();
  const evil = new File(["#!/bin/sh\necho pwn"], "x.sh", { type: "application/x-sh" });
  const fd = new FormData();
  fd.append("sessionId", session.sessionId);
  fd.append("sessionToken", session.sessionToken);
  fd.append("file", evil);
  const res = await fetch(FN_URL, { method: "POST", headers: baseHeaders, body: fd });
  const body = await res.json();
  assertEquals(res.status, 415);
  assertEquals(body.error, "unsupported_mime");
});

Deno.test("valid session-bound upload succeeds and returns server-controlled path", async () => {
  const session = await initSession();
  const fd = new FormData();
  fd.append("sessionId", session.sessionId);
  fd.append("sessionToken", session.sessionToken);
  fd.append("file", pngFile());
  const res = await fetch(FN_URL, { method: "POST", headers: baseHeaders, body: fd });
  const body = await res.json();
  assertEquals(res.status, 200, `expected 200 got ${res.status}: ${JSON.stringify(body)}`);
  assert(typeof body.path === "string");
  // Path must start with the session id (server-controlled folder).
  assertEquals(body.path.split("/")[0], session.sessionId);
  // Path must include a UUID prefix the server added (client cannot pick it).
  assertNotEquals(body.path, `${session.sessionId}/pixel.png`);
});
