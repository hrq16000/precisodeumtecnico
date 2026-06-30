// Edge function: triage-media-upload
// Two actions, both POST:
//   - { action: "init" } JSON   → returns { sessionId, sessionToken }
//   - multipart/form-data with fields: sessionId, sessionToken, file
//       → validates HMAC(sessionId) === sessionToken, then uploads via service role
//
// This prevents anonymous clients from writing arbitrary paths into the
// triage-media bucket. The folder name is server-issued and bound to a
// secret-derived token; clients cannot upload into folders that weren't
// issued to them.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Reuse service role key as HMAC secret material so we don't need a new secret.
const HMAC_SECRET = SUPABASE_SERVICE_ROLE_KEY;

const BUCKET = "triage-media";
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

async function hmac(input: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(HMAC_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(input),
  );
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const ct = req.headers.get("content-type") ?? "";

  try {
    // --- INIT (JSON) ---
    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      if (body?.action !== "init") return json({ error: "bad_action" }, 400);
      const sessionId = crypto.randomUUID().replaceAll("-", "");
      const sessionToken = await hmac(sessionId);
      return json({ sessionId, sessionToken });
    }

    // --- UPLOAD (multipart) ---
    if (!ct.includes("multipart/form-data")) {
      return json({ error: "unsupported_content_type" }, 415);
    }

    const form = await req.formData();
    const sessionId = String(form.get("sessionId") ?? "");
    const sessionToken = String(form.get("sessionToken") ?? "");
    const file = form.get("file");

    if (!/^[a-f0-9]{16,64}$/.test(sessionId)) {
      return json({ error: "invalid_session" }, 400);
    }
    const expected = await hmac(sessionId);
    if (!timingSafeEqual(sessionToken, expected)) {
      return json({ error: "invalid_token" }, 401);
    }
    if (!(file instanceof File)) {
      return json({ error: "missing_file" }, 400);
    }
    if (!ALLOWED.has(file.type)) {
      return json({ error: "unsupported_mime" }, 415);
    }
    const isVideo = file.type.startsWith("video/");
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_PHOTO_BYTES;
    if (file.size > maxBytes) return json({ error: "file_too_large" }, 413);

    const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(-80) || "file";
    const objectKey = `${sessionId}/${crypto.randomUUID()}-${safeName}`;

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { error: upErr } = await admin.storage
      .from(BUCKET)
      .upload(objectKey, file, {
        contentType: file.type,
        upsert: false,
      });

    if (upErr) {
      console.error("upload failed", upErr);
      return json({ error: "upload_failed" }, 500);
    }

    return json({ path: objectKey });
  } catch (e) {
    console.error("triage-media-upload error", e);
    return json({ error: "internal_error" }, 500);
  }
});
