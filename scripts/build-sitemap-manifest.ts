// Gera artefatos determinísticos de sitemap:
//   - dist/sitemaps.manifest.json      → sha256 + tamanho de cada shard
//   - dist/sitemap-diagnostics.json    → esperados (do sitemap-index) x
//                                        encontrados em dist/, com missing/extra
//
// Roda no postbuild. Nunca falha o build sozinho — apenas escreve o
// diagnóstico. O guard `check-sitemap-presence.ts` faz o hard-fail
// separado com base no manifesto.
//
// Run: bunx tsx scripts/build-sitemap-manifest.ts
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const DIST = "dist";
if (!existsSync(DIST)) {
  console.error(`✗ ${DIST}/ não existe — rode 'bun run build' primeiro.`);
  process.exit(1);
}

const files = readdirSync(DIST).filter((f) => /^sitemap.*\.xml$/.test(f)).sort();
if (!files.length) {
  console.error("✗ nenhum sitemap*.xml em dist/");
  process.exit(1);
}

const entries = files.map((name) => {
  const path = join(DIST, name);
  const buf = readFileSync(path);
  return {
    file: name,
    bytes: statSync(path).size,
    sha256: createHash("sha256").update(buf).digest("hex"),
  };
});

const manifest = {
  generatedAt: new Date().toISOString(),
  count: entries.length,
  files: entries,
};

const outPath = join(DIST, "sitemaps.manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`✓ sitemaps.manifest.json com ${entries.length} shards → ${outPath}`);
for (const e of entries) console.log(`  • ${e.file}  ${e.bytes}B  ${e.sha256.slice(0, 12)}…`);

// ---------------------------------------------------------------------------
// Diagnóstico: esperado (sitemap-index) x encontrado (dist/)
// ---------------------------------------------------------------------------
const INDEX = join(DIST, "sitemap.xml");
const expectedShards: string[] = [];
if (existsSync(INDEX)) {
  const idx = readFileSync(INDEX, "utf8");
  for (const m of idx.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const fname = m[1].trim().split("/").pop();
    if (fname) expectedShards.push(fname);
  }
}

const foundSet = new Set(files);
const expectedSet = new Set(expectedShards);
const missing = expectedShards.filter((f) => !foundSet.has(f));
const extra = files.filter((f) => f !== "sitemap.xml" && !expectedSet.has(f));

const diagnostics = {
  generatedAt: manifest.generatedAt,
  indexPresent: existsSync(INDEX),
  expectedCount: expectedShards.length,
  foundCount: files.length,
  missingCount: missing.length,
  extraCount: extra.length,
  expected: expectedShards,
  found: files,
  missing,
  extra,
};

const diagPath = join(DIST, "sitemap-diagnostics.json");
writeFileSync(diagPath, JSON.stringify(diagnostics, null, 2) + "\n");
console.log(`✓ sitemap-diagnostics.json → ${diagPath}`);

if (missing.length || extra.length) {
  console.warn("");
  console.warn("⚠ Inconsistência detectada entre sitemap-index e dist/:");
  console.warn(`  esperados: ${expectedShards.length}  |  encontrados: ${files.length}`);
  if (missing.length) {
    console.warn(`  ✗ ausentes em dist/ (${missing.length}):`);
    for (const m of missing) console.warn(`      - ${m}`);
  }
  if (extra.length) {
    console.warn(`  ⚠ presentes em dist/ mas fora do index (${extra.length}):`);
    for (const x of extra) console.warn(`      - ${x}`);
  }
  console.warn("  → detalhes completos em dist/sitemap-diagnostics.json");
} else {
  console.log(`✓ diagnóstico OK: ${expectedShards.length} shards esperados, todos presentes.`);
}
