/**
 * Gate estático de acessibilidade/SEO de imagens.
 *
 * Falha o build quando qualquer <img> em src/ estiver:
 *  - sem atributo alt;
 *  - com alt vazio em imagem de conteúdo (alt="" só é permitido com
 *    aria-hidden ou role="presentation");
 *  - com alt genérico ("imagem", "foto", "image", "banner", "logo aqui"...);
 *  - apontando para placeholder (placeholder.svg / via.placeholder / lorem).
 *
 * Uso: bun run check:alt-text
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve("src");
const GENERIC_ALTS = [
  "imagem", "image", "img", "foto", "photo", "picture", "banner",
  "logo", "icon", "ícone", "mídia", "midia", "media", "thumbnail", "placeholder",
];
const PLACEHOLDER_SRC = /placeholder\.svg|via\.placeholder|placehold\.co|lorempixel|dummyimage/i;

interface Problem { file: string; line: number; reason: string; snippet: string }

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|jsx)$/.test(entry)) out.push(full);
  }
  return out;
}

function lineOf(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

function extractTags(content: string): { tag: string; index: number }[] {
  const tags: { tag: string; index: number }[] = [];
  const re = /<img\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    // avança até o fechamento da tag respeitando chaves/aspas simples do JSX
    let i = m.index;
    let depth = 0;
    let quote: string | null = null;
    for (; i < content.length; i += 1) {
      const ch = content[i];
      if (quote) {
        if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") quote = ch;
      else if (ch === "{") depth += 1;
      else if (ch === "}") depth -= 1;
      else if (ch === ">" && depth === 0) break;
    }
    tags.push({ tag: content.slice(m.index, i + 1), index: m.index });
  }
  return tags;
}

function main() {
  const files = walk(ROOT);
  const problems: Problem[] = [];

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    for (const { tag, index } of extractTags(content)) {
      const rel = relative(process.cwd(), file);
      const line = lineOf(content, index);
      const decorative = /aria-hidden\s*=\s*{?["']?true/.test(tag) || /role\s*=\s*["']presentation["']/.test(tag);
      const altMatch = tag.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/);

      if (!altMatch) {
        problems.push({ file: rel, line, reason: "sem atributo alt", snippet: tag.slice(0, 120) });
        continue;
      }
      const literal = altMatch[1] ?? altMatch[2];
      if (literal !== undefined) {
        const value = literal.trim();
        if (!value && !decorative) {
          problems.push({ file: rel, line, reason: 'alt="" em imagem de conteúdo (use aria-hidden se for decorativa)', snippet: tag.slice(0, 120) });
        } else if (value && GENERIC_ALTS.includes(value.toLowerCase())) {
          problems.push({ file: rel, line, reason: `alt genérico "${value}"`, snippet: tag.slice(0, 120) });
        } else if (value && value.split(/\s+/).length < 2 && !decorative) {
          problems.push({ file: rel, line, reason: `alt curto demais "${value}" (descreva a cena/serviço)`, snippet: tag.slice(0, 120) });
        }
      }

      const srcMatch = tag.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/);
      const srcLiteral = srcMatch?.[1] ?? srcMatch?.[2];
      if (srcLiteral && PLACEHOLDER_SRC.test(srcLiteral)) {
        problems.push({ file: rel, line, reason: `src aponta para placeholder (${srcLiteral})`, snippet: tag.slice(0, 120) });
      }
    }
  }

  if (problems.length) {
    console.error(`[check:alt-text] ${problems.length} problema(s) encontrado(s):\n`);
    for (const p of problems) {
      console.error(`  ${p.file}:${p.line} — ${p.reason}`);
      console.error(`    ${p.snippet.replace(/\s+/g, " ")}\n`);
    }
    process.exit(1);
  }

  console.log(`[check:alt-text] OK — ${files.length} arquivos varridos, nenhuma imagem sem alt descritivo.`);
}

main();
