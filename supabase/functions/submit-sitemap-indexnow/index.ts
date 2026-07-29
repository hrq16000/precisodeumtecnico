// Submete o sitemap ao Bing / Yandex via protocolo IndexNow.
// https://www.indexnow.org/documentation
//
// Requisitos:
//  - Secret BING_INDEXNOW_KEY (chave gerada pelo usuário, 8-128 hex chars).
//  - Arquivo público em https://precisodeumtecnico.com/{KEY}.txt contendo
//    exatamente a chave (validação de posse do domínio).
//
// Body opcional: { host?: string, key?: string, urls?: string[] }.
// Default: envia URL do sitemap consolidado.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const DEFAULT_HOST = "precisodeumtecnico.com";
const DEFAULT_URL = `https://${DEFAULT_HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const key = Deno.env.get("BING_INDEXNOW_KEY");
  if (!key) {
    return new Response(
      JSON.stringify({ error: "Missing BING_INDEXNOW_KEY" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let host = DEFAULT_HOST;
  let urls: string[] = [DEFAULT_URL];
  try {
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (typeof body.host === "string") host = body.host;
      if (Array.isArray(body.urls) && body.urls.every((u: unknown) => typeof u === "string")) {
        urls = body.urls;
      }
    }
  } catch (_) { /* noop */ }

  const payload = {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`IndexNow submit failed [${res.status}]: ${text}`);
    return new Response(
      JSON.stringify({ ok: false, status: res.status, details: text, host, urls }),
      { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  return new Response(
    JSON.stringify({ ok: true, host, urls, submittedAt: new Date().toISOString() }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
