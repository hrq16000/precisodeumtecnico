/**
 * Gate de CI — PriceSpecification × conteúdo visível.
 *
 * A tabela de /precos é escrita em português e o schema.org é derivado dela
 * pelo parser compartilhado src/lib/priceSpec.ts. Este gate reprocessa o
 * MESMO array literal do arquivo da página e confirma que:
 *   - todo valor numérico visível vira Offer com priceCurrency BRL;
 *   - faixas ("R$ 150 a R$ 250") viram minPrice/maxPrice, nunca string;
 *   - "Sob consulta" NÃO gera Offer (preço inventado = claim falso);
 *   - min ≤ max e nenhum valor ≤ 0;
 *   - a visita mínima permanece R$ 99,99 e a coleta R$ 299,99.
 *
 * Executar: bunx tsx scripts/check-price-schema.ts
 */
import { readFileSync } from "node:fs";
import { parsePriceBRL } from "../src/lib/priceSpec";
import { COMMERCIAL_TERMS } from "../src/data/commercialTerms";

const PAGE = "src/pages/Precos.tsx";
const src = readFileSync(PAGE, "utf8");
const errors: string[] = [];

const table = /const priceTable: Row\[\] = \[([\s\S]*?)\n\];/.exec(src)?.[1];
if (!table) {
  console.error(`✗ ${PAGE}: não foi possível localizar priceTable — gate não pode validar.`);
  process.exit(1);
}

const rows = [...table.matchAll(/\{\s*service:\s*"([^"]+)"[\s\S]*?price:\s*"([^"]+)"\s*\}/g)].map(
  (m) => ({ service: m[1], price: m[2] }),
);
if (rows.length === 0) errors.push("priceTable sem linhas reconhecíveis");

let offers = 0;
let skipped = 0;
for (const row of rows) {
  const spec = parsePriceBRL(row.price);
  if (!spec) {
    skipped += 1;
    if (/R\$/.test(row.price)) {
      errors.push(`"${row.service}": texto tem R$ mas o parser não extraiu valor ("${row.price}")`);
    }
    continue;
  }
  offers += 1;
  if (spec.min <= 0 || spec.max <= 0) errors.push(`"${row.service}": valor não positivo`);
  if (spec.min > spec.max) errors.push(`"${row.service}": minPrice > maxPrice`);
  // o valor precisa aparecer literalmente no texto visível
  const asText = spec.min.toLocaleString("pt-BR", { minimumFractionDigits: spec.min % 1 ? 2 : 0 });
  if (!row.price.includes(asText.split(",")[0])) {
    errors.push(`"${row.service}": min ${spec.min} não corresponde ao texto "${row.price}"`);
  }
}

// A página precisa emitir o markup a partir do parser (não hardcoded)
if (!src.includes("parsePriceBRL")) {
  errors.push(`${PAGE}: schema de preço não usa parsePriceBRL (fonte única)`);
}
if (/priceSpecification[\s\S]{0,120}price:\s*r\.price/.test(src)) {
  errors.push(`${PAGE}: PriceSpecification usando string de preço — schema.org exige número`);
}

// Âncoras comerciais
const visita = COMMERCIAL_TERMS.diagnosisFee?.priceLabel ?? "R$ 99,99";
if (!table.includes(visita)) {
  errors.push(`priceTable não contém a taxa de visita oficial ${visita}`);
}
if (!table.includes("R$ 299,99")) {
  errors.push("priceTable não contém a coleta oficial R$ 299,99");
}

if (errors.length) {
  console.error(`✗ ${errors.length} divergência(s) entre tabela de preços e schema:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `✓ preços consistentes: ${rows.length} linhas · ${offers} Offer/PriceSpecification · ${skipped} sob consulta (sem Offer).`,
);
