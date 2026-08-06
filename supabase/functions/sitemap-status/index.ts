// GET /functions/v1/sitemap-status
//
// Health check consolidado do sitemap para dashboards e alertas.
// Retorna:
//   • status HTTP do index e de cada shard, com contagem de URLs por shard;
//   • integridade do canonical declarado no XML (loc === xhtml:link canonical);
//   • validação do robots.txt (Sitemap absoluto https, rotas indexáveis liberadas);
//   • status do IndexNow (secret configurado + arquivo /{KEY}.txt publicado e íntegro).
//
// Público (sem auth) para permitir monitoramento externo (UptimeRobot, cron, etc).
// Resposta é read-only e não expõe segredos — a chave IndexNow é mascarada.
//
// Query params:
//   ?host=precisodeumtecnico.com   origem a inspecionar (default produção)
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const DEFAULT_ORIGIN = "https://precisodeumtecnico.com";
const INDEXABLE_PATHS = ["/servicos", "/regioes", "/blog", "/precos", "/contato"];
const UA = "pdt-sitemap-status/1.0";

interface ShardStatus {
  file: string;
  url: string;
  status: number;
  urlCount: number;
  canonicalMissing: number;
  canonicalMismatch: number;
  nonHttps: number;
  duplicatesInShard: number;
  ok: boolean;
}

async function get(url: string): Promise<{ status: number; body: string }> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    return { status: res.status, body: await res.text() };
  } catch (e) {
    console.error(`fetch falhou em ${url}: ${e instanceof Error ? e.message : String(e)}`);
    return { status: 0, body: "" };
  }
}

function analyseShard(file: string, url: string, status: number, xml: string): ShardStatus {
  const blocks = Array.from(xml.matchAll(/<url>([\s\S]*?)<\/url>/g)).map((m) => m[1]);
  const seen = new Set<string>();
  let canonicalMissing = 0, canonicalMismatch = 0, nonHttps = 0, duplicatesInShard = 0;

  for (const block of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    if (!loc) continue;
    if (!/^https:\/\//i.test(loc)) nonHttps++;
    if (seen.has(loc)) duplicatesInShard++;
    seen.add(loc);
    const canonical = block.match(/<xhtml:link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1]?.trim();
    if (!canonical) canonicalMissing++;
    else if (canonical !== loc) canonicalMismatch++;
  }

  const urlCount = seen.size;
  const ok = status === 200 && /<urlset/.test(xml) && urlCount > 0 &&
    canonicalMissing === 0 && canonicalMismatch === 0 && nonHttps === 0 && duplicatesInShard === 0;
  return { file, url, status, urlCount, canonicalMissing, canonicalMismatch, nonHttps, duplicatesInShard, ok };
}

function analyseRobots(status: number, body: string, origin: string) {
  const issues: string[] = [];
  if (status !== 200) issues.push(`robots.txt retornou HTTP ${status}`);
  const sitemapLine = body.match(/Sitemap:\s*(\S+)/i)?.[1];
  if (!sitemapLine) issues.push("linha 'Sitemap:' ausente");
  else if (!/^https:\/\//i.test(sitemapLine)) issues.push("'Sitemap:' não é URL https absoluta");

  let inGlobal = false;
  const blockedIndexable: string[] = [];
  let blocksEverything = false;
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (/^User-agent:\s*\*/i.test(line)) inGlobal = true;
    else if (/^User-agent:/i.test(line)) inGlobal = false;
    if (!inGlobal) continue;
    const dis = line.match(/^Disallow:\s*(\S*)/i)?.[1];
    if (dis === undefined) continue;
    if (dis === "/") blocksEverything = true;
    if (INDEXABLE_PATHS.some((p) => dis === p || dis.startsWith(p + "/"))) blockedIndexable.push(dis);
  }
  if (blocksEverything) issues.push("User-agent: * possui 'Disallow: /' — site inteiro bloqueado");
  for (const p of blockedIndexable) issues.push(`caminho indexável bloqueado: ${p}`);

  return { status, url: `${origin}/robots.txt`, sitemapDirective: sitemapLine ?? null, blocksEverything, blockedIndexable, ok: issues.length === 0, issues };
}

async function analyseIndexNow(origin: string) {
  const key = Deno.env.get("BING_INDEXNOW_KEY");
  if (!key) {
    return { keyConfigured: false, keyMasked: null, keyFileUrl: null, keyFileStatus: null, keyFileMatches: false, ok: false, issues: ["BING_INDEXNOW_KEY não configurado"] };
  }
  const keyMasked = `${key.slice(0, 4)}…${key.slice(-4)}`;
  const keyFileUrl = `${origin}/${key}.txt`;
  const res = await get(keyFileUrl);
  const matches = res.status === 200 && res.body.trim() === key;
  const issues: string[] = [];
  if (res.status !== 200) issues.push(`arquivo de verificação retornou HTTP ${res.status}`);
  else if (!matches) issues.push("conteúdo do arquivo de verificação não bate com a chave");
  return { keyConfigured: true, keyMasked, keyFileUrl, keyFileStatus: res.status, keyFileMatches: matches, ok: issues.length === 0, issues };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const started = Date.now();
  const reqUrl = new URL(req.url);
  const hostParam = reqUrl.searchParams.get("host");
  let origin = DEFAULT_ORIGIN;
  if (hostParam) {
    const cleaned = hostParam.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    // Restringe a hosts próprios — evita usar a função como proxy aberto.
    if (/^([a-z0-9-]+\.)*(precisodeumtecnico\.com|precisodeumtecnico\.lovable\.app)$/i.test(cleaned)) {
      origin = `https://${cleaned}`;
    } else {
      return new Response(JSON.stringify({ error: "host não permitido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const indexUrl = `${origin}/sitemap.xml`;
  const index = await get(indexUrl);
  const isIndex = /<sitemapindex/.test(index.body);
  const shardUrls = Array.from(index.body.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());

  const shards: ShardStatus[] = [];
  for (const shardUrl of shardUrls) {
    const file = shardUrl.split("/").pop()!;
    const res = await get(`${origin}/${file}`);
    shards.push(analyseShard(file, `${origin}/${file}`, res.status, res.body));
  }

  const robotsRes = await get(`${origin}/robots.txt`);
  const robots = analyseRobots(robotsRes.status, robotsRes.body, origin);
  const indexNow = await analyseIndexNow(origin);

  const totalUrls = shards.reduce((a, s) => a + s.urlCount, 0);
  const sitemapOk = index.status === 200 && isIndex && shards.length > 0 && shards.every((s) => s.ok);
  const issues = [
    ...(index.status !== 200 ? [`sitemap index retornou HTTP ${index.status}`] : []),
    ...(index.status === 200 && !isIndex ? ["sitemap.xml não é um <sitemapindex>"] : []),
    ...shards.filter((s) => !s.ok).map((s) => `shard com problema: ${s.file}`),
    ...robots.issues,
    ...indexNow.issues,
  ];

  const status = sitemapOk && robots.ok ? (indexNow.ok ? "healthy" : "degraded") : "unhealthy";

  // Alertas: disparados apenas quando o status sai de "healthy".
  // Canais são opcionais — cada um só é usado se o segredo correspondente existir.
  const alerts = await dispatchAlerts(status, origin, issues);


  return new Response(
    JSON.stringify({
      status,
      checkedAt: new Date().toISOString(),
      durationMs: Date.now() - started,
      origin,
      sitemap: {
        indexUrl,
        indexStatus: index.status,
        isSitemapIndex: isIndex,
        shardCount: shards.length,
        totalUrls,
        ok: sitemapOk,
        shards,
      },
      robots,
      indexNow,
      issues,
    }, null, 2),
    {
      status: status === "unhealthy" ? 503 : 200,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
    },
  );
});
