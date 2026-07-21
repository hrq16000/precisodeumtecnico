// Gera dist/sitemaps.manifest.json com sha256 + tamanho de cada sitemap
// presente em dist/. Roda no postbuild — dá um artefato determinístico que
// podemos versionar/inspecionar e serve de base para o guard de presença.
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
