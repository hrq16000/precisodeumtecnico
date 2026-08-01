// Relatório de diff de sitemap para o CI.
//
// Compara o sitemap ATUAL (public/, recém-gerado) com um BASELINE e escreve um
// relatório markdown destacando:
//   • ganho / perda líquida de URLs
//   • URLs adicionadas e removidas
//   • duplicatas (intra-shard e entre shards)
//   • mudanças de canonical (loc → canonical divergente ou alterado)
//   • URLs que trocaram de shard
//
// Baseline (em ordem de precedência):
//   --baseline-dir=<dir>   diretório com sitemap*.xml da build anterior (artifact do CI)
//   --baseline-url=<url>   origem live (default: https://precisodeumtecnico.com)
//
// Saída: stdout + arquivo markdown (--out, default sitemap-diff.md) e, quando
// existir, append em $GITHUB_STEP_SUMMARY.
//
// Nunca falha o build por padrão — é um relatório. Use --fail-on-loss=<n> para
// falhar quando a perda líquida de URLs passar do limite.
//
// Run: bun scripts/diff-sitemap.ts

import { readFileSync, existsSync, readdirSync, appendFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");

const CURRENT_DIR = arg("current-dir") ?? "public";
const BASELINE_DIR = arg("baseline-dir");
const BASELINE_URL = (arg("baseline-url") ?? "https://precisodeumtecnico.com").replace(/\/$/, "");
const OUT = arg("out") ?? "sitemap-diff.md";
const FAIL_ON_LOSS = Number(arg("fail-on-loss") ?? "NaN");

interface UrlEntry {
  loc: string;
  canonical: string | null;
  shard: string;
}
interface Snapshot {
  source: string;
  shards: string[];
  entries: Map<string, UrlEntry>;
  duplicates: { loc: string; shards: string[] }[];
  total: number;
}

function parseShard(xml: string, shard: string): UrlEntry[] {
  return Array.from(xml.matchAll(/<url>([\s\S]*?)<\/url>/g))
    .map((m) => m[1])
    .map((block) => {
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
      if (!loc) return null;
      const canonical = block.match(/<xhtml:link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1]?.trim() ?? null;
      return { loc, canonical, shard };
    })
    .filter((e): e is UrlEntry => !!e);
}

function buildSnapshot(source: string, shardFiles: { name: string; xml: string }[]): Snapshot {
  const entries = new Map<string, UrlEntry>();
  const seen = new Map<string, string[]>();
  for (const { name, xml } of shardFiles) {
    for (const e of parseShard(xml, name)) {
      const shards = seen.get(e.loc) ?? [];
      shards.push(name);
      seen.set(e.loc, shards);
      if (!entries.has(e.loc)) entries.set(e.loc, e);
    }
  }
  const duplicates = [...seen.entries()]
    .filter(([, shards]) => shards.length > 1)
    .map(([loc, shards]) => ({ loc, shards }));
  return { source, shards: shardFiles.map((s) => s.name), entries, duplicates, total: entries.size };
}

function loadFromDir(dir: string): Snapshot | null {
  if (!existsSync(join(dir, "sitemap.xml"))) return null;
  const index = readFileSync(join(dir, "sitemap.xml"), "utf8");
  const names = Array.from(index.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim().split("/").pop()!);
  const fallback = readdirSync(dir).filter((f) => /^sitemap-.*\.xml$/.test(f));
  const files = (names.length ? names : fallback)
    .filter((n) => existsSync(join(dir, n)))
    .map((n) => ({ name: n, xml: readFileSync(join(dir, n), "utf8") }));
  return buildSnapshot(`dir:${dir}`, files);
}

async function loadFromUrl(base: string): Promise<Snapshot | null> {
  try {
    const res = await fetch(`${base}/sitemap.xml`, { headers: { "User-Agent": "pdt-sitemap-diff/1.0" } });
    if (!res.ok) return null;
    const index = await res.text();
    const shardUrls = Array.from(index.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
    const files: { name: string; xml: string }[] = [];
    for (const u of shardUrls) {
      const r = await fetch(u, { headers: { "User-Agent": "pdt-sitemap-diff/1.0" } });
      if (!r.ok) continue;
      files.push({ name: u.split("/").pop()!, xml: await r.text() });
    }
    return buildSnapshot(`url:${base}`, files);
  } catch {
    return null;
  }
}

function list(title: string, items: string[], limit = 30): string[] {
  if (!items.length) return [];
  const lines = [``, `### ${title} (${items.length})`, ``];
  for (const i of items.slice(0, limit)) lines.push(`- ${i}`);
  if (items.length > limit) lines.push(`- _… e mais ${items.length - limit}_`);
  return lines;
}

async function main() {
  const current = loadFromDir(CURRENT_DIR);
  if (!current) {
    console.error(`✗ Sitemap atual não encontrado em ${CURRENT_DIR}/sitemap.xml — rode 'bun run sitemap' antes.`);
    process.exit(1);
  }

  const baseline = (BASELINE_DIR ? loadFromDir(BASELINE_DIR) : null) ?? (await loadFromUrl(BASELINE_URL));

  const md: string[] = ["## 🗺️ Relatório de diff do sitemap", ""];

  if (!baseline) {
    md.push(
      `> Baseline indisponível (${BASELINE_DIR ? `dir \`${BASELINE_DIR}\`` : BASELINE_URL}). Publicando apenas o retrato atual.`,
      "",
      `- Shards: **${current.shards.length}**`,
      `- URLs únicas: **${current.total}**`,
      `- Duplicatas entre shards: **${current.duplicates.length}**`,
    );
    emit(md.join("\n"));
    return;
  }

  const added = [...current.entries.keys()].filter((l) => !baseline.entries.has(l)).sort();
  const removed = [...baseline.entries.keys()].filter((l) => !current.entries.has(l)).sort();
  const net = current.total - baseline.total;

  const canonicalChanges: string[] = [];
  const canonicalMismatch: string[] = [];
  const shardMoves: string[] = [];
  for (const [loc, cur] of current.entries) {
    if (cur.canonical && cur.canonical !== loc) canonicalMismatch.push(`\`${loc}\` → canonical \`${cur.canonical}\``);
    if (!cur.canonical) canonicalMismatch.push(`\`${loc}\` → **sem canonical**`);
    const prev = baseline.entries.get(loc);
    if (!prev) continue;
    if ((prev.canonical ?? "—") !== (cur.canonical ?? "—"))
      canonicalChanges.push(`\`${loc}\`: \`${prev.canonical ?? "—"}\` → \`${cur.canonical ?? "—"}\``);
    if (prev.shard !== cur.shard) shardMoves.push(`\`${loc}\`: \`${prev.shard}\` → \`${cur.shard}\``);
  }

  const trend = net > 0 ? `🟢 +${net}` : net < 0 ? `🔴 ${net}` : "⚪ 0";
  md.push(
    `Baseline: \`${baseline.source}\` · Atual: \`${current.source}\``,
    "",
    "| Métrica | Baseline | Atual | Δ |",
    "|---|---:|---:|---:|",
    `| URLs únicas | ${baseline.total} | ${current.total} | ${trend} |`,
    `| Shards | ${baseline.shards.length} | ${current.shards.length} | ${current.shards.length - baseline.shards.length} |`,
    `| Duplicatas entre shards | ${baseline.duplicates.length} | ${current.duplicates.length} | ${current.duplicates.length - baseline.duplicates.length} |`,
    `| Adicionadas | — | ${added.length} | +${added.length} |`,
    `| Removidas | — | ${removed.length} | -${removed.length} |`,
    `| Canonical alterado | — | ${canonicalChanges.length} | — |`,
    `| Canonical divergente do loc | — | ${canonicalMismatch.length} | — |`,
  );

  md.push(...list("➕ URLs adicionadas", added.map((u) => `\`${u}\``)));
  md.push(...list("➖ URLs removidas", removed.map((u) => `\`${u}\``)));
  md.push(...list("♻️ Duplicatas entre shards", current.duplicates.map((d) => `\`${d.loc}\` em ${d.shards.join(", ")}`)));
  md.push(...list("🔗 Canonical alterado", canonicalChanges));
  md.push(...list("⚠️ Canonical divergente do loc", canonicalMismatch));
  md.push(...list("📦 URLs que trocaram de shard", shardMoves));

  emit(md.join("\n"));

  if (Number.isFinite(FAIL_ON_LOSS) && -net > FAIL_ON_LOSS) {
    console.error(`\n✗ Perda líquida de ${-net} URLs excede o limite de ${FAIL_ON_LOSS}.`);
    process.exit(1);
  }
}

function emit(report: string) {
  console.log(report);
  writeFileSync(OUT, report + "\n");
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (summary) appendFileSync(summary, report + "\n");
  console.log(`\n✓ Relatório escrito em ${OUT}`);
}

main();
