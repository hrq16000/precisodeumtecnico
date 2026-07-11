// Postbuild guard: valida os sitemaps gerados.
//
// Falha o build se:
//   - qualquer <lastmod> tem formato inválido;
//   - qualquer <lastmod> está no futuro em relação a hoje (UTC);
//   - sitemap-nacional-servicos-piloto.xml não tem exatamente 100 URLs;
//   - sitemap.xml (index) não referencia o shard piloto;
//   - shard listado no index não existe fisicamente em public/.
//
// Executar: bun scripts/check-sitemap-dates.ts

import { readFileSync, readdirSync, existsSync } from "node:fs";

const PUBLIC_DIR = "public";
const PILOT_SHARD = "sitemap-nacional-servicos-piloto.xml";
const PILOT_EXPECTED = 100;
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
const today = new Date().toISOString().split("T")[0];

const errors: string[] = [];

function extractAll(re: RegExp, text: string): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push(m[1]);
  return out;
}

function checkFile(name: string) {
  const path = `${PUBLIC_DIR}/${name}`;
  if (!existsSync(path)) {
    errors.push(`ausente: ${path}`);
    return;
  }
  const xml = readFileSync(path, "utf8");
  const lastmods = extractAll(/<lastmod>([^<]+)<\/lastmod>/g, xml);
  for (const d of lastmods) {
    if (!ISO_RE.test(d)) {
      errors.push(`${name}: lastmod com formato inválido "${d}"`);
      continue;
    }
    if (d > today) {
      errors.push(`${name}: lastmod futuro "${d}" (hoje=${today})`);
    }
  }
}

// Lista todos os sitemaps do diretório public/
const sitemapFiles = readdirSync(PUBLIC_DIR).filter((f) => /^sitemap.*\.xml$/.test(f));
if (sitemapFiles.length === 0) {
  errors.push("nenhum sitemap encontrado em public/");
}
for (const f of sitemapFiles) checkFile(f);

// Piloto: contagem exata
if (existsSync(`${PUBLIC_DIR}/${PILOT_SHARD}`)) {
  const xml = readFileSync(`${PUBLIC_DIR}/${PILOT_SHARD}`, "utf8");
  const urlCount = (xml.match(/<url>/g) ?? []).length;
  if (urlCount !== PILOT_EXPECTED) {
    errors.push(`${PILOT_SHARD}: ${urlCount} URLs (esperado ${PILOT_EXPECTED})`);
  }
} else {
  errors.push(`ausente: ${PUBLIC_DIR}/${PILOT_SHARD}`);
}

// Index deve referenciar o piloto e todos os shards listados devem existir
if (existsSync(`${PUBLIC_DIR}/sitemap.xml`)) {
  const idx = readFileSync(`${PUBLIC_DIR}/sitemap.xml`, "utf8");
  if (!idx.includes(PILOT_SHARD)) {
    errors.push(`sitemap.xml: não referencia ${PILOT_SHARD}`);
  }
  const locs = extractAll(/<loc>([^<]+)<\/loc>/g, idx);
  for (const loc of locs) {
    const name = loc.split("/").pop() ?? "";
    if (!existsSync(`${PUBLIC_DIR}/${name}`)) {
      errors.push(`sitemap.xml: referencia shard inexistente "${name}"`);
    }
  }
}

if (errors.length > 0) {
  console.error("✗ check-sitemap-dates falhou:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ check-sitemap-dates: ${sitemapFiles.length} sitemap(s) válido(s), piloto = ${PILOT_EXPECTED} URLs, sem lastmod futuro.`);
