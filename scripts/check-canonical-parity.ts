// Verificador de paridade canonical: rastreia as URLs do sitemap com Chromium
// (o site é SPA — o canonical é injetado no runtime) e confirma que o
// <link rel="canonical"> renderizado é EXATAMENTE igual ao <loc> do sitemap.
//
// Também confere:
//   • presença de exatamente 1 canonical por página;
//   • ausência de <meta name="robots" content="noindex"> em URL indexável;
//   • HTTP 200 na navegação.
//
// Processa em lotes para não estourar memória/tempo — reutiliza um único
// browser e roda N páginas em paralelo.
//
// Run:
//   bun scripts/check-canonical-parity.ts                       # amostra 25/shard
//   CANONICAL_SAMPLE=all bun scripts/check-canonical-parity.ts  # todas as URLs
//   CANONICAL_BASE_URL=http://localhost:4173 bun scripts/check-canonical-parity.ts
//
// Env:
//   CANONICAL_BASE_URL   origem a rastrear (default produção)
//   CANONICAL_SAMPLE     nº de URLs por shard ou "all" (default 25)
//   CANONICAL_BATCH      páginas por lote (default 8)
//   CANONICAL_OFFSET     pula as N primeiras URLs (retomada por lotes)
//   CANONICAL_LIMIT      teto global de URLs rastreadas

import { chromium, type Browser } from "@playwright/test";
import { writeFileSync } from "node:fs";

const BASE_URL = (process.env.CANONICAL_BASE_URL ?? "https://precisodeumtecnico.com").replace(/\/$/, "");
const RAW_SAMPLE = process.env.CANONICAL_SAMPLE ?? "25";
const SAMPLE_PER_SHARD = RAW_SAMPLE === "all" ? Infinity : Math.max(1, Number(RAW_SAMPLE) || 25);
const BATCH = Math.max(1, Number(process.env.CANONICAL_BATCH ?? 8));
const OFFSET = Math.max(0, Number(process.env.CANONICAL_OFFSET ?? 0));
const LIMIT = Number(process.env.CANONICAL_LIMIT ?? Infinity);
const OUT = process.env.CANONICAL_OUT ?? "canonical-parity-report.json";

interface Row {
  loc: string;
  shard: string;
  status: number | null;
  canonical: string | null;
  canonicalCount: number;
  noindex: boolean;
  ok: boolean;
  reason?: string;
}

function sample(urls: string[], size: number): string[] {
  if (!Number.isFinite(size) || urls.length <= size) return [...urls];
  const step = urls.length / size;
  return Array.from({ length: size }, (_, i) => urls[Math.floor(i * step)]);
}

async function collectTargets(): Promise<{ loc: string; shard: string }[]> {
  const idxRes = await fetch(`${BASE_URL}/sitemap.xml`);
  if (!idxRes.ok) throw new Error(`sitemap index HTTP ${idxRes.status} em ${BASE_URL}`);
  const index = await idxRes.text();
  const shardUrls = Array.from(index.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());

  const out: { loc: string; shard: string }[] = [];
  for (const shardUrl of shardUrls) {
    const name = shardUrl.split("/").pop()!;
    // Shards vivem sempre na mesma origem que estamos rastreando.
    const res = await fetch(`${BASE_URL}/${name}`);
    if (!res.ok) throw new Error(`shard ${name} HTTP ${res.status}`);
    const xml = await res.text();
    const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
    for (const loc of sample(locs, SAMPLE_PER_SHARD)) out.push({ loc, shard: name });
  }
  return out;
}

/** Converte a URL canônica do sitemap para a origem sendo rastreada. */
function toTarget(loc: string): string {
  try {
    const u = new URL(loc);
    return `${BASE_URL}${u.pathname}${u.search}`;
  } catch {
    return loc;
  }
}

/** Normaliza para comparação: canonical relativo é resolvido contra a origem canônica. */
function normalize(href: string, loc: string): string {
  try {
    return new URL(href, loc).toString().replace(/\/$/, (m) => (new URL(loc).pathname === "/" ? m : ""));
  } catch {
    return href;
  }
}

async function inspect(browser: Browser, target: { loc: string; shard: string }): Promise<Row> {
  const page = await browser.newPage();
  const url = toTarget(target.loc);
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    const status = res?.status() ?? null;
    // SPA: o canonical entra via react-helmet após a hidratação.
    await page.waitForFunction(() => !!document.querySelector('link[rel="canonical"]'), null, { timeout: 15000 }).catch(() => {});
    const data = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="canonical"]'));
      const robots = Array.from(document.querySelectorAll('meta[name="robots"]'))
        .map((m) => m.getAttribute("content") ?? "")
        .join(",");
      return {
        canonicalCount: links.length,
        canonical: links[0]?.getAttribute("href") ?? null,
        noindex: /noindex/i.test(robots),
      };
    });

    const expected = target.loc;
    const actual = data.canonical ? normalize(data.canonical, expected) : null;
    let reason: string | undefined;
    if (status !== 200) reason = `HTTP ${status}`;
    else if (data.canonicalCount === 0) reason = "canonical ausente";
    else if (data.canonicalCount > 1) reason = `${data.canonicalCount} canonicals na página`;
    else if (actual !== expected) reason = `canonical "${actual}" ≠ loc "${expected}"`;
    else if (data.noindex) reason = "página no sitemap marcada como noindex";

    return { loc: target.loc, shard: target.shard, status, canonical: data.canonical, canonicalCount: data.canonicalCount, noindex: data.noindex, ok: !reason, reason };
  } catch (e) {
    return {
      loc: target.loc, shard: target.shard, status: null, canonical: null, canonicalCount: 0,
      noindex: false, ok: false, reason: e instanceof Error ? e.message : String(e),
    };
  } finally {
    await page.close();
  }
}

async function main() {
  const all = await collectTargets();
  const targets = all.slice(OFFSET, Number.isFinite(LIMIT) ? OFFSET + LIMIT : undefined);
  console.log(`▶ Paridade canonical em ${BASE_URL} — ${targets.length} URLs (de ${all.length}), lotes de ${BATCH}\n`);

  const browser = await chromium.launch({ headless: true });
  const rows: Row[] = [];
  try {
    for (let i = 0; i < targets.length; i += BATCH) {
      const batch = targets.slice(i, i + BATCH);
      const results = await Promise.all(batch.map((t) => inspect(browser, t)));
      rows.push(...results);
      const bad = results.filter((r) => !r.ok);
      console.log(`  lote ${Math.floor(i / BATCH) + 1}: ${results.length} URLs, ${bad.length} divergência(s)`);
      for (const b of bad) console.log(`    ✗ ${b.loc} — ${b.reason}`);
    }
  } finally {
    await browser.close();
  }

  const failures = rows.filter((r) => !r.ok);
  const byShard = new Map<string, { total: number; failed: number }>();
  for (const r of rows) {
    const s = byShard.get(r.shard) ?? { total: 0, failed: 0 };
    s.total++;
    if (!r.ok) s.failed++;
    byShard.set(r.shard, s);
  }

  console.log("\n▶ Resumo por shard:");
  for (const [shard, s] of byShard) console.log(`  • ${shard}: ${s.total} verificadas, ${s.failed} divergente(s)`);

  writeFileSync(OUT, JSON.stringify({ baseUrl: BASE_URL, checked: rows.length, failed: failures.length, rows }, null, 2));
  console.log(`\n✓ Relatório JSON em ${OUT}`);

  if (failures.length) {
    console.error(`\n✗ Paridade canonical FALHOU — ${failures.length}/${rows.length} divergência(s):`);
    for (const f of failures) console.error(`  - ${f.loc} → ${f.reason}`);
    process.exit(1);
  }
  console.log(`\n✓ Canonical idêntico ao <loc> em todas as ${rows.length} URLs verificadas`);
}

main().catch((e) => {
  console.error("✗ Erro fatal na verificação de canonical:", e);
  process.exit(1);
});
