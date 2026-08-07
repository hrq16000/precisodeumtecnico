/**
 * Guard de build: garante que o sitemap-index publica TODAS as rotas
 * `/atendimento-nacional/*` derivadas dos dados vivos:
 *   - Uma URL por cidade em `nationalCities`.
 *   - Uma URL por par (cidade, bairro) em `nationalBairrosByCity`.
 *
 * Também valida:
 *   - Todas as URLs `<loc>` são absolutas em https://precisodeumtecnico.com
 *     (canonical == loc, evitando divergência com <link rel="canonical">).
 *   - O sitemap-index (`public/sitemap.xml`) referencia o shard `sitemap-main.xml`
 *     — as rotas nacionais NÃO dependem de shard individual por cidade.
 *
 * Falha o build (exit 1) descrevendo o que falta.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { nationalCities } from "../src/data/nationalCities";
import { nationalBairrosByCity } from "../src/data/nationalBairros";

const BASE = "https://precisodeumtecnico.com";
// Após a segmentação (Rodada 32.2) as rotas nacionais vivem em shards temáticos
// (cidades/bairros), então a verificação varre TODOS os shards do index.
const SHARDS = [
  "public/sitemap-main.xml",
  "public/sitemap-servicos.xml",
  "public/sitemap-cidades.xml",
  "public/sitemap-bairros.xml",
].map((p) => resolve(p));
const MAIN = SHARDS[0];
const INDEX = resolve("public/sitemap.xml");

if (!existsSync(MAIN)) {
  console.error(`[nacional-sitemap] FALHOU — ${MAIN} inexistente. Rode 'bun scripts/build-sitemap.ts'.`);
  process.exit(1);
}
if (!existsSync(INDEX)) {
  console.error(`[nacional-sitemap] FALHOU — ${INDEX} inexistente.`);
  process.exit(1);
}

const mainXml = SHARDS.filter((p) => existsSync(p)).map((p) => readFileSync(p, "utf8")).join("\n");
const indexXml = readFileSync(INDEX, "utf8");

if (!indexXml.includes(`${BASE}/sitemap-main.xml`)) {
  console.error("[nacional-sitemap] FALHOU — sitemap.xml (index) não referencia sitemap-main.xml.");
  process.exit(1);
}

const locs = new Set<string>();
for (const m of mainXml.matchAll(/<loc>([^<]+)<\/loc>/g)) locs.add(m[1]);

const missing: string[] = [];
const invalidBase: string[] = [];

function require(loc: string) {
  if (!locs.has(loc)) missing.push(loc);
  else if (!loc.startsWith(`${BASE}/`)) invalidBase.push(loc);
}

for (const c of nationalCities) require(`${BASE}/atendimento-nacional/${c.slug}`);

let bairroCount = 0;
for (const c of nationalCities) {
  const bairros = nationalBairrosByCity[c.slug] ?? [];
  for (const b of bairros) {
    require(`${BASE}/atendimento-nacional/${c.slug}/${b.slug}`);
    bairroCount++;
  }
}

// Todas as URLs nacionais absolutas presentes no shard main devem estar
// no domínio canônico (evita mistura com URLs de preview/lovable.app).
for (const loc of locs) {
  if (loc.includes("/atendimento-nacional") && !loc.startsWith(`${BASE}/`)) {
    invalidBase.push(loc);
  }
}

if (missing.length || invalidBase.length) {
  if (missing.length) {
    console.error(`[nacional-sitemap] FALHOU — ${missing.length} rota(s) ausentes nos shards do sitemap:`);
    for (const m of missing.slice(0, 10)) console.error(`  ✗ ${m}`);
    if (missing.length > 10) console.error(`  … +${missing.length - 10}`);
  }
  if (invalidBase.length) {
    console.error(`[nacional-sitemap] FALHOU — ${invalidBase.length} <loc> fora do domínio canônico ${BASE}:`);
    for (const m of invalidBase.slice(0, 10)) console.error(`  ✗ ${m}`);
  }
  process.exit(1);
}

console.log(
  `[nacional-sitemap] OK — ${nationalCities.length} cidades + ${bairroCount} bairros nacionais nos shards do sitemap; index consolidado.`,
);
