/**
 * Gate fail-closed: nenhum JSON-LD do repositório pode anunciar `Service`
 * de vertical recusada (monitores, projetores, áudio, linha branca).
 *
 * A checagem é estática: varre os arquivos de página que emitem
 * `"@type": "Service"` e inspeciona o valor de `name` / `serviceType`
 * mais próximo. Complementa `sanitizeServiceSchemas` (runtime), impedindo
 * que uma vertical recusada volte ao código sem passar pelo filtro.
 *
 * Uso: bunx tsx scripts/check-refused-verticals.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

const REFUSED: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bmonitor(es)?\b/i, reason: "vertical de monitores não é atendida" },
  { pattern: /\bprojetor(es)?\b/i, reason: "vertical de projetores não é atendida" },
  {
    pattern: /\b(caixa de som|som automotivo|home theater|amplificador)\b/i,
    reason: "vertical de áudio não é atendida",
  },
  {
    pattern: /\b(eletrodom[eé]stico|geladeira|m[aá]quina de lavar|micro-?ondas)\b/i,
    reason: "linha branca não é atendida",
  },
];

const PAGES_DIR = resolve("src/pages");

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? listFiles(join(dir, e.name)) : e.name.endsWith(".tsx") ? [join(dir, e.name)] : [],
  );
}

let failed = 0;

for (const file of listFiles(PAGES_DIR)) {
  const src = readFileSync(file, "utf8");
  if (!/["']@type["']\s*:\s*["']Service["']/.test(src)) continue;

  const lines = src.split("\n");
  lines.forEach((line, i) => {
    // Só interessa a janela imediata de um bloco Service.
    const isServiceBlock = lines
      .slice(Math.max(0, i - 4), i + 5)
      .some((l) => /["']@type["']\s*:\s*["']Service["']/.test(l));
    if (!isServiceBlock) return;

    const m = line.match(/\b(name|serviceType)\s*:\s*["'`]([^"'`]+)["'`]/);
    if (!m) return;
    for (const { pattern, reason } of REFUSED) {
      if (pattern.test(m[2])) {
        console.error(`✗ ${file}:${i + 1} — Service "${m[2]}" (${reason})`);
        failed += 1;
      }
    }
  });
}

if (failed > 0) {
  console.error(`\n❌ ${failed} Service(s) de vertical recusada no JSON-LD.`);
  process.exit(1);
}
console.log("✓ JSON-LD sem Service de vertical recusada.");
