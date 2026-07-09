/**
 * Rodada 21 — Guardrail: falha o build se qualquer variação legada de
 * "Bancada R$ 90" aparecer em src/ ou e2e/.
 *
 * Regra oficial: taxa de diagnóstico única = R$ 99,99 (visita OU bancada).
 * Somente ocorrências que estejam explicitamente atreladas a R$ 99,99
 * (mesma linha) são toleradas — o restante é resíduo histórico e deve
 * sumir. Preços de outros serviços (ex.: "R$ 900,00", "R$ 90.000") são
 * ignorados via regex: exigimos limite de palavra e "R$ 90" isolado.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src", "e2e"];
const IGNORED_FILES = new Set(["scripts/check-no-bancada-legacy.ts"]);

const problems: { file: string; line: number; snippet: string }[] = [];

// Bancada seguida de 90 sem casas; ou "R$ 90" isolado (não R$ 90,00+ e não R$ 900).
const LEGACY = /(bancada[^\n]{0,40}R\$\s?90(?!\d|,\d)|R\$\s?90(?!\d|,\d))/i;

function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (IGNORED_FILES.has(p)) continue;
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?|md|mdx)$/.test(name)) inspect(p);
  }
}

function inspect(file: string) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((raw, i) => {
    if (!LEGACY.test(raw)) return;
    // Tolerância: mesma linha cita R$ 99,99 explicitamente (fonte oficial).
    if (/R\$\s?99,99/.test(raw)) return;
    problems.push({ file, line: i + 1, snippet: raw.trim().slice(0, 200) });
  });
}

for (const r of ROOTS) {
  try {
    walk(r);
  } catch {
    /* dir ausente */
  }
}

if (problems.length) {
  console.error(`[no-bancada-legacy] FALHOU — ${problems.length} resíduo(s) legado(s) "Bancada R$ 90":`);
  for (const p of problems) {
    console.error(`  ✗ ${p.file}:${p.line}  ${p.snippet}`);
  }
  console.error("Substitua por R$ 99,99 (taxa oficial única) ou importe de src/data/commercialTerms.ts.");
  process.exit(1);
}
console.log("[no-bancada-legacy] OK — nenhum resíduo 'Bancada R$ 90' encontrado.");
