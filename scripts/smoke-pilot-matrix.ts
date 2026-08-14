/**
 * Smoke da matriz nacional piloto (`/servico-em-nacional/:city/:bairro/:service`).
 *
 * Etapa 1 (offline, sempre roda): valida `public/sitemap-nacional-servicos-piloto.xml`
 *   - XML bem formado (declaração + <urlset> + fechamento)
 *   - contagem EXATA de URLs = combinações habilitadas (teto NATIONAL_MATRIX_MAX)
 *   - todas as <loc> absolutas em https://precisodeumtecnico.com, sem duplicatas
 *   - paridade 1:1 com `enumeratePilotCombinations()`
 *
 * Etapa 2 (rede, opcional): com `--http [baseUrl]` confere HTTP 200 em cada URL.
 *
 * Uso:
 *   bun scripts/smoke-pilot-matrix.ts
 *   bun scripts/smoke-pilot-matrix.ts --http https://precisodeumtecnico.com
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  enumeratePilotCombinations,
  NATIONAL_MATRIX_MAX,
  NATIONAL_MATRIX_PREFIX,
} from "../src/data/nationalServiceCoverage";

const BASE = "https://precisodeumtecnico.com";
const FILE = resolve("public/sitemap-nacional-servicos-piloto.xml");
const args = process.argv.slice(2);
const httpIdx = args.indexOf("--http");
const httpBase = httpIdx >= 0 ? args[httpIdx + 1] ?? BASE : null;

const problems: string[] = [];

if (!existsSync(FILE)) {
  console.error(`[smoke-pilot] FALHOU — ${FILE} inexistente. Rode 'bun scripts/build-sitemap.ts'.`);
  process.exit(1);
}

const xml = readFileSync(FILE, "utf8");

if (!/^<\?xml version="1\.0" encoding="UTF-8"\?>/.test(xml.trim())) problems.push("declaração XML ausente/inválida");
if (!/<urlset\b[^>]*xmlns=/.test(xml)) problems.push("<urlset> sem xmlns");
if (!/<\/urlset>\s*$/.test(xml.trim())) problems.push("</urlset> ausente no fim do arquivo");

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

if (locs.length !== new Set(locs).size) problems.push(`URLs duplicadas (${locs.length - new Set(locs).size})`);
if (locs.length > NATIONAL_MATRIX_MAX) problems.push(`teto excedido: ${locs.length} > ${NATIONAL_MATRIX_MAX}`);

for (const loc of locs) {
  if (!loc.startsWith(`${BASE}${NATIONAL_MATRIX_PREFIX}/`)) {
    problems.push(`URL não absoluta/fora do prefixo do piloto: ${loc}`);
  }
}

const expected = enumeratePilotCombinations().map((c) => c.url);
const expectedSet = new Set(expected);
const actualSet = new Set(locs);

if (locs.length !== expected.length) {
  problems.push(`contagem divergente: sitemap ${locs.length} x matriz ${expected.length}`);
}
for (const url of expected) if (!actualSet.has(url)) problems.push(`faltando no sitemap: ${url}`);
for (const url of locs) if (!expectedSet.has(url)) problems.push(`URL no sitemap sem combinação válida: ${url}`);

if (problems.length) {
  console.error(`[smoke-pilot] FALHOU — ${problems.length} problema(s):`);
  for (const p of problems.slice(0, 40)) console.error(`  ✗ ${p}`);
  process.exit(1);
}

console.log(`[smoke-pilot] sitemap OK — ${locs.length} URLs válidas (teto ${NATIONAL_MATRIX_MAX}).`);

if (httpBase) {
  let failed = 0;
  for (const url of expected) {
    const target = url.replace(BASE, httpBase.replace(/\/$/, ""));
    try {
      const res = await fetch(target, { redirect: "follow" });
      const html = await res.text();
      const issues: string[] = [];
      if (res.status !== 200) issues.push(`status ${res.status}`);
      if (html.length < 1000) issues.push("HTML muito curto");
      if (issues.length) {
        failed++;
        console.error(`  ✗ ${target} — ${issues.join(" · ")}`);
      }
    } catch (e) {
      failed++;
      console.error(`  ✗ ${target} — erro de rede: ${(e as Error).message}`);
    }
  }
  console.log(`[smoke-pilot] http ${expected.length - failed}/${expected.length} OK em ${httpBase}`);
  if (failed) process.exit(1);
}
