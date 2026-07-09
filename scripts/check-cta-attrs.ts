/**
 * Build-time guard: todo elemento com data-wa-source deve declarar
 * data-service e aria-label na mesma tag JSX. Falha o build se faltar.
 *
 * Escopo: arquivos .tsx sob src/. Regex simples, cobre JSX estático — atributos dinâmicos
 * (spread props) são ignorados intencionalmente para evitar falso positivo.
 *
 * Uso: encadeado no `postbuild` do package.json.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";
const problems: { file: string; line: number; snippet: string; missing: string[] }[] = [];

function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(tsx|jsx)$/.test(name)) inspect(p);
  }
}

function inspect(file: string) {
  const src = readFileSync(file, "utf8");
  // Split JSX into element chunks starting at each `<Tag ...>` that contains data-wa-source.
  // Match from `<` to the next `>` allowing multi-line attribute lists.
  const re = /<[A-Za-z][^<]*?data-wa-source[^<]*?>/gs;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const chunk = m[0];
    const missing: string[] = [];
    if (!/data-service\s*=/.test(chunk)) missing.push("data-service");
    if (!/aria-label\s*=/.test(chunk)) missing.push("aria-label");
    if (missing.length) {
      const line = src.slice(0, m.index).split("\n").length;
      problems.push({
        file,
        line,
        snippet: chunk.replace(/\s+/g, " ").slice(0, 160),
        missing,
      });
    }
  }
}

walk(ROOT);

if (problems.length) {
  console.error(`[cta-attrs] FALHOU — ${problems.length} CTA(s) WhatsApp sem atributos obrigatórios:`);
  for (const p of problems) {
    console.error(`  ✗ ${p.file}:${p.line}  faltando: ${p.missing.join(", ")}`);
    console.error(`    ${p.snippet}`);
  }
  process.exit(1);
}
console.log("[cta-attrs] OK — todos os CTAs data-wa-source têm data-service + aria-label.");
