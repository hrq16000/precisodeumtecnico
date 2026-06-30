// Scheduled alert: if invalid_session/invalid_token failures spike, email admin.
// - Counts failures in the last 15 minutes
// - If count >= THRESHOLD AND no alert sent in last COOLDOWN_MIN minutes, send email
// - Uses Resend (RESEND_API_KEY)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const THRESHOLD = 5;
const WINDOW_MIN = 15;
const COOLDOWN_MIN = 60;
const ALERT_KEY = "triage_upload_failures_spike";
const ADMIN_EMAIL = Deno.env.get("ADMIN_ALERT_EMAIL") ?? "contato@precisodeumtecnico.com";
const FROM_EMAIL = "Triagem Alertas <onboarding@resend.dev>";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const since = new Date(Date.now() - WINDOW_MIN * 60 * 1000).toISOString();

  const { data: failures, error: failErr } = await admin
    .from("triage_media_failures")
    .select("reason, session_id, ip_address, created_at")
    .gte("created_at", since)
    .in("reason", ["invalid_session", "invalid_token"])
    .order("created_at", { ascending: false })
    .limit(50);

  if (failErr) {
    console.error("alerts select error", failErr);
    return new Response(JSON.stringify({ ok: false, error: failErr.message }), {
      status: 500,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }

  const count = failures?.length ?? 0;
  if (count < THRESHOLD) {
    return new Response(JSON.stringify({ ok: true, count, alerted: false }), {
      status: 200,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }

  // cooldown check
  const { data: state } = await admin
    .from("triage_alert_state")
    .select("last_alert_at")
    .eq("id", ALERT_KEY)
    .maybeSingle();
  if (state?.last_alert_at) {
    const ageMin = (Date.now() - new Date(state.last_alert_at).getTime()) / 60000;
    if (ageMin < COOLDOWN_MIN) {
      return new Response(
        JSON.stringify({ ok: true, count, alerted: false, cooldown_remaining_min: COOLDOWN_MIN - ageMin }),
        { status: 200, headers: { ...CORS, "content-type": "application/json" } },
      );
    }
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.warn("RESEND_API_KEY not set; skipping email");
    return new Response(JSON.stringify({ ok: false, error: "no_resend_key" }), {
      status: 500,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }

  const breakdown = (failures ?? []).reduce<Record<string, number>>((acc, f) => {
    acc[f.reason] = (acc[f.reason] ?? 0) + 1;
    return acc;
  }, {});

  const html = `
    <h2>Alerta: falhas de upload na triagem</h2>
    <p><strong>${count}</strong> falha(s) nos últimos ${WINDOW_MIN} minutos.</p>
    <ul>
      ${Object.entries(breakdown).map(([k, v]) => `<li><b>${k}</b>: ${v}</li>`).join("")}
    </ul>
    <p>Últimas ocorrências:</p>
    <pre style="font-size:12px;background:#f4f4f4;padding:8px">${JSON.stringify(
      failures?.slice(0, 10),
      null,
      2,
    )}</pre>
    <p>Verifique <code>/admin</code> → Auditoria de mídias.</p>
  `;

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `[Triagem] Pico de falhas de upload (${count}/${WINDOW_MIN}min)`,
      html,
    }),
  });

  const respText = await resp.text();
  if (!resp.ok) {
    console.error("resend failed", resp.status, respText);
    return new Response(JSON.stringify({ ok: false, error: "resend_failed", detail: respText }), {
      status: 500,
      headers: { ...CORS, "content-type": "application/json" },
    });
  }

  await admin.from("triage_alert_state").upsert({
    id: ALERT_KEY,
    last_alert_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  console.log("triage alert sent", { count, breakdown });
  return new Response(
    JSON.stringify({ ok: true, count, alerted: true, breakdown }),
    { status: 200, headers: { ...CORS, "content-type": "application/json" } },
  );
});
