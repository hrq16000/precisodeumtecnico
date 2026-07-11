/**
 * Rodada 25.1 — Bloco 0.
 * Guard de consistência de FAQ/FAQPage.
 *
 * Regras (não exige FAQPage em toda página; valida ausência de problemas):
 *  - Nenhum `console.log("FAQPage", ...)` em produção.
 *  - Nenhuma página emite múltiplos FAQPage manuais (mais de 1 script literal
 *    `"@type": "FAQPage"` no mesmo arquivo).
 *  - Nenhuma ocorrência de `R$ 99,90` (deve ser R$ 99,99 via COMMERCIAL_TERMS).
 *  - Nenhum import restante dos template puros (`buildNationalNeighborhoodFAQ`,
 *    `buildNeighborhoodFAQ`, `@/lib/faqBuilders`).
 *  - `src/components/seo/FAQSection.tsx` não deve existir (colisão de nome
 *    com `src/components/home/FAQSection.tsx` — se voltar, deve ser
 *    renomeado para FaqAccordion).
 *
 * Roda no postbuild. Sai com 1 se qualquer regra falhar.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const errors: string[] = [];

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (/\.(tsx?|jsx?)$/.test(entry)) acc.push(p);
  }
  return acc;
}

const files = walk(resolve("src"));

for (const file of files) {
  const src = readFileSync(file, "utf-8");

  // 1. console.log("FAQPage", ...)
  if (/console\.log\(\s*["']FAQPage["']/.test(src)) {
    errors.push(`${file}: console.log("FAQPage", …) — remover instrumentação`);
  }

  // 2. múltiplos FAQPage manuais no mesmo arquivo
  const faqPageCount = (src.match(/"@type"\s*:\s*"FAQPage"/g) || []).length;
  if (faqPageCount > 1) {
    errors.push(`${file}: ${faqPageCount} declarações "@type":"FAQPage" — deveria ser no máximo 1`);
  }

  // 3. R$ 99,90 legado
  if (/R\$\s*99,90/.test(src)) {
    errors.push(`${file}: R$ 99,90 legado — usar COMMERCIAL_TERMS.diagnosisFee.priceLabel (R$ 99,99)`);
  }

  // 4. imports dos template puros removidos
  if (/from\s+["']@\/lib\/faqBuilders["']/.test(src)) {
    errors.push(`${file}: import de @/lib/faqBuilders — módulo removido (template puro)`);
  }
  if (/buildNationalNeighborhoodFAQ|buildNeighborhoodFAQ\b/.test(src)) {
    errors.push(`${file}: uso de buildNationalNeighborhoodFAQ/buildNeighborhoodFAQ — template puro removido`);
  }
}

// 5. FAQSection.tsx em seo/ (colisão de nome)
if (existsSync(resolve("src/components/seo/FAQSection.tsx"))) {
  errors.push(
    "src/components/seo/FAQSection.tsx existe — colisão com src/components/home/FAQSection.tsx. Renomear para FaqAccordion.",
  );
}

if (errors.length) {
  console.error("[faq-consistency] FALHOU:");
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(`[faq-consistency] OK — ${files.length} arquivos verificados.`);
