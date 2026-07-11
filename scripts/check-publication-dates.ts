// Guard: nenhum post público pode ter publishedAt/updatedAt no futuro.
// Também valida contagem (=50), formato ISO YYYY-MM-DD e ordem monotônica
// crescente das satellitePosts (contrato editorial da Rodada 25.1 · B.3.a).
// Adicionalmente varre sitemaps em public/ atrás de <lastmod> futuro como
// defesa em profundidade (o gerador clampa, esse guard confere estático).
//
// Executar: bun scripts/check-publication-dates.ts

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { satellitePosts } from "../src/data/satellitePosts";
import { blogPosts } from "../src/data/blog";

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
const today = new Date().toISOString().split("T")[0];
const errors: string[] = [];

if (satellitePosts.length !== 50) {
  errors.push(`satellitePosts: contagem ${satellitePosts.length} (esperado 50)`);
}

let previous = "";
for (const p of satellitePosts) {
  if (!ISO_RE.test(p.publishedAt)) errors.push(`satellite ${p.slug}: publishedAt inválido "${p.publishedAt}"`);
  else if (p.publishedAt > today) errors.push(`satellite ${p.slug}: publishedAt futuro "${p.publishedAt}" (hoje=${today})`);
  if (p.updatedAt && p.updatedAt > today) errors.push(`satellite ${p.slug}: updatedAt futuro "${p.updatedAt}"`);
  if (previous && p.publishedAt < previous) {
    errors.push(`satellite ${p.slug}: ordem cronológica quebrada (${p.publishedAt} < ${previous})`);
  }
  previous = p.publishedAt;
}

for (const p of blogPosts) {
  if (p.publishedAt && p.publishedAt > today) {
    errors.push(`blog ${p.slug}: publishedAt futuro "${p.publishedAt}"`);
  }
  if (p.updatedAt && p.updatedAt > today) {
    errors.push(`blog ${p.slug}: updatedAt futuro "${p.updatedAt}"`);
  }
}

// Defesa secundária: varrer sitemaps de public/ atrás de lastmod futuro.
if (existsSync("public")) {
  const files = readdirSync("public").filter((f) => /^sitemap.*\.xml$/.test(f));
  for (const f of files) {
    const xml = readFileSync(`public/${f}`, "utf8");
    const matches = xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g);
    for (const m of matches) {
      const d = m[1].trim();
      if (ISO_RE.test(d) && d > today) errors.push(`${f}: lastmod futuro "${d}"`);
    }
  }
}

if (errors.length) {
  console.error("✗ check-publication-dates falhou:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

const min = satellitePosts.reduce((a, p) => (a < p.publishedAt ? a : p.publishedAt), satellitePosts[0]?.publishedAt ?? "");
const max = satellitePosts.reduce((a, p) => (a > p.publishedAt ? a : p.publishedAt), satellitePosts[0]?.publishedAt ?? "");
console.log(`✓ check-publication-dates: ${satellitePosts.length} satellite posts, min=${min}, max=${max}, hoje=${today}.`);
