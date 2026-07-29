// Envia o sitemap index ao Google Search Console via connector gateway.
// Invocação manual (curl) ou agendada. Requer connection do google_search_console
// já vinculada; usa Sitemaps API (webmasters/v3).
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const DEFAULT_SITE = "https://precisodeumtecnico.com/";
const DEFAULT_SITEMAP = "https://precisodeumtecnico.com/sitemap.xml";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  if (!LOVABLE_API_KEY || !GSC_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing gateway credentials" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let siteUrl = DEFAULT_SITE;
  let feedpath = DEFAULT_SITEMAP;
  try {
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (typeof body.siteUrl === "string") siteUrl = body.siteUrl;
      if (typeof body.feedpath === "string") feedpath = body.feedpath;
    }
  } catch (_) { /* noop */ }

  const url = `${GATEWAY}/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GSC_KEY,
    },
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`GSC submit failed [${res.status}]: ${text}`);
    return new Response(
      JSON.stringify({ ok: false, status: res.status, details: text, siteUrl, feedpath }),
      { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  return new Response(
    JSON.stringify({ ok: true, siteUrl, feedpath, submittedAt: new Date().toISOString() }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
