// Scheduled cleanup of expired triage media.
// - Deletes storage objects older than RETENTION_HOURS from `triage-media` bucket
// - Deletes corresponding audit rows in `triage_media_uploads`
// - Trims old failure records past 30 days
// Intended to be invoked by pg_cron via net.http_post (no JWT required).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RETENTION_HOURS = 48;
const FAILURE_RETENTION_DAYS = 30;
const BUCKET = "triage-media";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const cutoff = new Date(Date.now() - RETENTION_HOURS * 3600 * 1000).toISOString();

  // 1. find audit rows past retention; delete linked storage objects + rows
  const { data: expired, error: selErr } = await admin
    .from("triage_media_uploads")
    .select("id, object_path")
    .lt("created_at", cutoff)
    .limit(500);

  let deletedFiles = 0;
  let deletedRows = 0;
  const errors: string[] = [];

  if (selErr) errors.push(`select: ${selErr.message}`);

  if (expired && expired.length > 0) {
    const paths = expired.map((r) => r.object_path);
    const { error: rmErr } = await admin.storage.from(BUCKET).remove(paths);
    if (rmErr) errors.push(`remove: ${rmErr.message}`);
    else deletedFiles = paths.length;

    const ids = expired.map((r) => r.id);
    const { error: delErr } = await admin
      .from("triage_media_uploads")
      .delete()
      .in("id", ids);
    if (delErr) errors.push(`delete rows: ${delErr.message}`);
    else deletedRows = ids.length;
  }

  // 2. orphan sweep: list bucket root prefixes older than cutoff w/ no row
  // (best-effort; storage API list() limited to 1000 per call)
  try {
    const { data: roots } = await admin.storage.from(BUCKET).list("", { limit: 1000 });
    if (roots) {
      for (const folder of roots) {
        if (!folder.name) continue;
        const { data: files } = await admin.storage
          .from(BUCKET)
          .list(folder.name, { limit: 100 });
        if (!files || files.length === 0) continue;
        const oldestFresh = files.some((f) => {
          const ts = f.created_at ? new Date(f.created_at).getTime() : 0;
          return ts > Date.now() - RETENTION_HOURS * 3600 * 1000;
        });
        if (oldestFresh) continue;
        const paths = files.map((f) => `${folder.name}/${f.name}`);
        await admin.storage.from(BUCKET).remove(paths);
        deletedFiles += paths.length;
      }
    }
  } catch (e) {
    errors.push(`orphan sweep: ${(e as Error).message}`);
  }

  // 3. trim old failure log
  const failCutoff = new Date(
    Date.now() - FAILURE_RETENTION_DAYS * 86400 * 1000,
  ).toISOString();
  const { error: failDelErr } = await admin
    .from("triage_media_failures")
    .delete()
    .lt("created_at", failCutoff);
  if (failDelErr) errors.push(`failure trim: ${failDelErr.message}`);

  const result = {
    ok: errors.length === 0,
    deleted_files: deletedFiles,
    deleted_rows: deletedRows,
    cutoff,
    errors,
  };
  console.log("triage-media-cleanup", JSON.stringify(result));
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...CORS, "content-type": "application/json" },
  });
});
