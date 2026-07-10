/**
 * Rodada 24.1 — Guard da matriz nacional serviço × cidade × bairro.
 *
 * Valida a fonte única `nationalServiceCoverage.ts` contra as fontes de
 * dados oficiais e bloqueia:
 *   - cidade inexistente ou desabilitada;
 *   - bairro que não pertence à cidade;
 *   - serviço fora de `servicesData`;
 *   - combinação duplicada;
 *   - slug vazio;
 *   - excedente do teto de bairros por cidade;
 *   - excedente do teto global de combinações (100);
 *   - colisão de rota com a RMC (/servico-em/:city/:service).
 *
 * Sai com código 1 no primeiro erro do lote.
 */
import { getNationalCityBySlug, getCityBairroSlugs } from "../src/data/nationalCities";
import { getNationalBairro } from "../src/data/nationalBairros";
import { servicesData } from "../src/data/services";
import {
  pilotServices,
  pilotCities,
  enumeratePilotCombinations,
  NATIONAL_MATRIX_MAX,
  BAIRROS_PER_CITY_MAX,
  NATIONAL_MATRIX_PREFIX,
} from "../src/data/nationalServiceCoverage";

const errs: string[] = [];

// 1) Serviços
const serviceSlugs = new Set<string>();
for (const s of pilotServices) {
  if (!s.slug) errs.push("service com slug vazio");
  if (serviceSlugs.has(s.slug)) errs.push(`service duplicado: ${s.slug}`);
  serviceSlugs.add(s.slug);
  if (!servicesData[s.slug]) errs.push(`service '${s.slug}' não existe em servicesData`);
}

// 2) Cidades + bairros
const seenCity = new Set<string>();
for (const cfg of pilotCities) {
  if (!cfg.citySlug) errs.push("city com slug vazio");
  if (seenCity.has(cfg.citySlug)) errs.push(`city duplicada: ${cfg.citySlug}`);
  seenCity.add(cfg.citySlug);

  const city = getNationalCityBySlug(cfg.citySlug);
  if (!city) {
    errs.push(`city '${cfg.citySlug}' não encontrada / não habilitada em nationalCities`);
    continue;
  }
  if (cfg.bairroSlugs.length === 0) errs.push(`city '${cfg.citySlug}' sem bairros no piloto`);
  if (cfg.bairroSlugs.length > BAIRROS_PER_CITY_MAX)
    errs.push(`city '${cfg.citySlug}' excede ${BAIRROS_PER_CITY_MAX} bairros: ${cfg.bairroSlugs.length}`);

  const validBairros = new Set(getCityBairroSlugs(cfg.citySlug));
  const seenB = new Set<string>();
  for (const bs of cfg.bairroSlugs) {
    if (!bs) errs.push(`city '${cfg.citySlug}' contém bairro slug vazio`);
    if (seenB.has(bs)) errs.push(`city '${cfg.citySlug}' bairro duplicado: ${bs}`);
    seenB.add(bs);
    if (!validBairros.has(bs))
      errs.push(`city '${cfg.citySlug}' bairro '${bs}' não pertence à cidade em nationalBairros`);
    if (!getNationalBairro(cfg.citySlug, bs))
      errs.push(`city '${cfg.citySlug}' bairro '${bs}' não resolvível`);
  }
}

// 3) Combinações resolvidas
const combos = enumeratePilotCombinations();
if (combos.length > NATIONAL_MATRIX_MAX)
  errs.push(`total de combinações ${combos.length} excede teto ${NATIONAL_MATRIX_MAX}`);

const seenPath = new Set<string>();
for (const c of combos) {
  if (seenPath.has(c.path)) errs.push(`combinação duplicada: ${c.path}`);
  seenPath.add(c.path);

  // 4) Colisão com RMC /servico-em/:city/:service (mesmo :city, mesmo :service, sem :bairro).
  //    Rota nacional usa prefixo diferente (/servico-em-nacional/), então não colidem por definição.
  if (!c.path.startsWith(NATIONAL_MATRIX_PREFIX + "/"))
    errs.push(`path inesperado (fora do namespace nacional): ${c.path}`);
  if (/^\/servico-em\/[^/]+\/[^/]+$/.test(c.path))
    errs.push(`path colide com namespace RMC /servico-em/:city/:service : ${c.path}`);
}

if (errs.length) {
  console.error("[national-service-matrix] FALHOU:");
  for (const e of errs) console.error("  -", e);
  process.exit(1);
}

console.log(`[national-service-matrix] OK`);
console.log(`  serviços habilitados: ${pilotServices.length}`);
console.log(`  cidades habilitadas: ${pilotCities.length}`);
console.log(`  combinações válidas: ${combos.length} (teto ${NATIONAL_MATRIX_MAX})`);
for (const cfg of pilotCities) {
  console.log(`    • ${cfg.citySlug}: ${cfg.bairroSlugs.length} bairros × ${pilotServices.length} serviços = ${cfg.bairroSlugs.length * pilotServices.length}`);
}
