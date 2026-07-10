/**
 * Rodada 22.2.1 — Guard de paridade da cobertura nacional.
 * Falha o processo se houver drift entre nationalCities.ts e nationalBairros.ts.
 * Executado localmente e no CI antes de publicar novas rotas.
 */
import { validateCoverage, citiesWithoutBairros, citiesWithBairros, totalPublishedBairros } from "../src/lib/nationalCoverage";

const errs = validateCoverage();
if (errs.length) {
  console.error("[national-coverage] FALHOU:");
  for (const e of errs) console.error("  -", e);
  process.exit(1);
}

const withB = citiesWithBairros();
const withoutB = citiesWithoutBairros();
const total = totalPublishedBairros();

console.log(`[national-coverage] OK`);
console.log(`  cidades totais: ${withB.length + withoutB.length}`);
console.log(`  cidades com bairros publicados: ${withB.length}`);
console.log(`  bairros âncora publicados: ${total}`);
if (withoutB.length) {
  console.log(`  cidades sem bairros publicados (${withoutB.length}):`);
  for (const c of withoutB) console.log(`    - ${c.slug} (${c.name}/${c.state})`);
}
