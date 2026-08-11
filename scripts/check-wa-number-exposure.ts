/**
 * Gate: o número de WhatsApp só pode existir em src/lib/whatsapp.ts (constante)
 * e em dados estruturados de NAP. Qualquer literal solto no código falha o CI.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const NUMBER_PATTERNS = [
  /5541997452053/,
  /\(?41\)?\s*9\s*9745[-\s]?2053/,
  /41\s*99745[-\s]?2053/,
];

const ALLOWLIST = new Set<string>([
  "src/lib/whatsapp.ts",
  "src/data/nap.ts",
]);

const ROOTS = ["src"];
const EXT = /\.(ts|tsx|js|jsx|json|css|html)$/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXT.test(entry)) out.push(full);
  }
  return out;
}

const offenders: string[] = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const rel = file.replace(/\\/g, "/");
    if (ALLOWLIST.has(rel)) continue;
    const content = readFileSync(file, "utf8");
    content.split("\n").forEach((line, i) => {
      if (NUMBER_PATTERNS.some((p) => p.test(line))) {
        offenders.push(`${rel}:${i + 1}`);
      }
    });
  }
}

if (offenders.length > 0) {
  console.error("❌ Número de WhatsApp exposto fora da constante central:");
  offenders.forEach((o) => console.error(`   - ${o}`));
  process.exit(1);
}

console.log("✅ check:wa-number — número centralizado, sem exposição no código.");
