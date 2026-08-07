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

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

function inspect(file: string) {
  const src = stripComments(readFileSync(file, "utf8"));
  // Só JSX real: tag começa com `<` seguido de letra e contém data-wa-source.
  const re = /<[A-Za-z][A-Za-z0-9]*\b[^<>]*?data-wa-source[^<>]*?>/gs;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const chunk = m[0];
    const missing: string[] = [];
    // Aceita atributo direto (attr=) ou spread com chave literal ('attr':).
    const hasService = /data-service\s*=/.test(chunk) || /['"]data-service['"]\s*:/.test(chunk);
    const hasAria = /aria-label\s*=/.test(chunk) || /['"]aria-label['"]\s*:/.test(chunk);
    if (!hasService) missing.push("data-service");
    if (!hasAria) missing.push("aria-label");
    // TS17001: atributo JSX duplicado na mesma tag.
    for (const attr of ["aria-label", "data-service", "data-wa-source", "href", "onClick", "className"]) {
      const dup = chunk.match(new RegExp(`(?<![\\w-])${attr}\\s*=`, "g"));
      if (dup && dup.length > 1) missing.push(`${attr} duplicado (${dup.length}x)`);
    }
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
