// Smoke test pós-deploy: valida o sitemap no ambiente REAL (produção).
//
// Verifica:
//  1. sitemap.xml (index) responde 200 e é um <sitemapindex>;
//  2. TODOS os shards listados respondem 200 e são <urlset> válidos;
//  3. robots.txt responde 200;
//  4. uma amostra determinística de N URLs por shard (default 50) responde 200.
//
// A amostragem é determinística (passo uniforme sobre a lista ordenada), então
// o resultado é reproduzível entre execuções e comparável entre deploys.
//
// Run:
//   bun scripts/smoke-sitemap-prod.ts
//   SMOKE_BASE_URL=https://precisodeumtecnico.com SMOKE_SAMPLE=50 bun scripts/smoke-sitemap-prod.ts
//   bun scripts/smoke-sitemap-prod.ts --sample=all   (rastreia 100% das URLs)

const BASE_URL = (process.env.SMOKE_BASE_URL ?? "https://precisodeumtecnico.com").replace(/\/$/, "");
const argSample = process.argv.find((a) => a.startsWith("--sample="))?.split("=")[1];
const RAW_SAMPLE = argSample ?? process.env.SMOKE_SAMPLE ?? "50";
const SAMPLE_PER_SHARD = RAW_SAMPLE === "all" ? Infinity : Math.max(1, Number(RAW_SAMPLE) || 50);
const CONCURRENCY = Math.max(1, Number(process.env.SMOKE_CONCURRENCY ?? 8));
const TIMEOUT_MS = Math.max(1000, Number(process.env.SMOKE_TIMEOUT_MS ?? 20000));
const RETRIES = Math.max(0, Number(process.env.SMOKE_RETRIES ?? 2));

const errors: string[] = [];
const push = (m: string) => errors.push(m);

interface Probe {
  url: string;
  status: number;
  ok: boolean;
  ms: number;
  error?: string;
}

async function probe(url: string, method: "GET" | "HEAD" = "GET"): Promise<Probe> {
  const started = Date.now();
  let lastError = "";
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "User-Agent": "pdt-sitemap-smoke/1.0" },
      });
      clearTimeout(timer);
      // Só faz retry em erro transitório de servidor.
      if (res.status >= 500 && attempt < RETRIES) {
        lastError = `HTTP ${res.status}`;
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
      return { url, status: res.status, ok: res.status === 200, ms: Date.now() - started };
    } catch (e) {
      clearTimeout(timer);
      lastError = e instanceof Error ? e.message : String(e);
      if (attempt < RETRIES) await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  return { url, status: 0, ok: false, ms: Date.now() - started, error: lastError };
}

async function fetchText(url: string): Promise<{ status: number; body: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "pdt-sitemap-smoke/1.0" } });
    const body = await res.text();
    return { status: res.status, body };
  } catch (e) {
    return { status: 0, body: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(timer);
  }
}

/** Amostra determinística: passo uniforme cobrindo início, meio e fim da lista. */
export function sampleUrls(urls: string[], size: number): string[] {
  if (!Number.isFinite(size) || urls.length <= size) return [...urls];
  const step = urls.length / size;
  const out: string[] = [];
  for (let i = 0; i < size; i++) out.push(urls[Math.floor(i * step)]);
  return out;
}

async function runPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log(`▶ Smoke de sitemap em ${BASE_URL} (amostra: ${SAMPLE_PER_SHARD === Infinity ? "todas" : SAMPLE_PER_SHARD} URLs/shard)\n`);

  // 1) Index
  const indexUrl = `${BASE_URL}/sitemap.xml`;
  const index = await fetchText(indexUrl);
  if (index.status !== 200) {
    push(`sitemap index ${indexUrl} retornou HTTP ${index.status}`);
    finish();
    return;
  }
  if (!/<sitemapindex/.test(index.body)) push(`${indexUrl}: raiz não é <sitemapindex>`);
  console.log(`✓ ${indexUrl} — HTTP 200`);

  // 2) robots.txt
  const robots = await probe(`${BASE_URL}/robots.txt`);
  if (!robots.ok) push(`robots.txt retornou HTTP ${robots.status}${robots.error ? ` (${robots.error})` : ""}`);
  else console.log(`✓ ${BASE_URL}/robots.txt — HTTP 200`);

  // 3) Shards
  const shardUrls = Array.from(index.body.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
  if (!shardUrls.length) {
    push("sitemap index não lista nenhum shard");
    finish();
    return;
  }
  console.log(`\n▶ ${shardUrls.length} shards declarados no index\n`);

  let totalUrls = 0;
  let totalChecked = 0;
  let totalFailed = 0;

  for (const shardUrl of shardUrls) {
    const shardName = shardUrl.split("/").pop()!;
    const shard = await fetchText(shardUrl);
    if (shard.status !== 200) {
      push(`shard ${shardName} retornou HTTP ${shard.status}`);
      console.log(`✗ ${shardName} — HTTP ${shard.status}`);
      continue;
    }
    if (!/<urlset/.test(shard.body)) {
      push(`shard ${shardName}: raiz não é <urlset>`);
      continue;
    }

    const locs = Array.from(shard.body.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
    totalUrls += locs.length;
    const sample = sampleUrls(locs, SAMPLE_PER_SHARD);
    const probes = await runPool(sample, CONCURRENCY, (u) => probe(u));
    const failed = probes.filter((p) => !p.ok);
    totalChecked += probes.length;
    totalFailed += failed.length;

    const avg = probes.length ? Math.round(probes.reduce((a, p) => a + p.ms, 0) / probes.length) : 0;
    const mark = failed.length ? "✗" : "✓";
    console.log(`${mark} ${shardName} — ${locs.length} URLs, amostra ${probes.length}, ${failed.length} falha(s), média ${avg}ms`);
    for (const f of failed) {
      const detail = f.error ? `${f.status || "ERR"} — ${f.error}` : `HTTP ${f.status}`;
      push(`[${shardName}] ${f.url} → ${detail}`);
      console.log(`    ✗ ${f.url} → ${detail}`);
    }
  }

  console.log(`\n▶ Resumo: ${shardUrls.length} shards, ${totalUrls} URLs no sitemap, ${totalChecked} amostradas, ${totalFailed} falha(s)`);
  finish();
}

function finish() {
  if (errors.length) {
    console.error(`\n✗ Smoke de sitemap FALHOU (${errors.length} problema(s)):`);
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }
  console.log("\n✓ Smoke de sitemap em produção OK");
}

main();
