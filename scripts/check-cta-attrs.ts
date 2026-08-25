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

/**
 * Arrow functions dentro de atributos (onClick={() => ...}) contêm `>` e
 * truncariam a leitura da tag. Trocamos por um sentinela antes do parse.
 */
const ARROW = "\u0001";
function maskArrows(src: string): string {
  return src.replace(/=>/g, ARROW);
}
function unmaskArrows(src: string): string {
  return src.split(ARROW).join("=>");
}


/** Origens registradas em src/lib/waSources.ts (fonte única). */
function loadRegisteredSources(): Set<string> {
  const src = readFileSync("src/lib/waSources.ts", "utf8");
  const block = src.slice(src.indexOf("WA_SOURCES = ["), src.indexOf("] as const"));
  return new Set([...block.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]));
}

const REGISTERED = loadRegisteredSources();

/** Heurística: a tag aponta para o WhatsApp? */
function looksLikeWhatsAppAnchor(chunk: string): boolean {
  const href = chunk.match(/href\s*=\s*\{?([^\s]*)/)?.[1] ?? "";
  return (
    /wa\.me|buildWhatsApp|buildTriageWhatsApp|whatsappLink|waUrl|waHref|waLink/i.test(href) ||
    /trackWhatsAppClick\s*\(/.test(chunk)
  );
}

function inspect(file: string) {
  const src = maskArrows(stripComments(readFileSync(file, "utf8")));
  // Qualquer tag JSX que declare data-wa-source OU que aponte para o WhatsApp.
  const re = /<[A-Za-z][A-Za-z0-9]*\b[^<>]*?>/gs;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const chunk = m[0];
    const declaresSource = /data-wa-source/.test(chunk);
    const isWaLink = looksLikeWhatsAppAnchor(chunk);
    if (!declaresSource && !isWaLink) continue;
    // Componentes wrapper (ex.: <WhatsAppCTA source=... service=...>) já garantem os atributos.
    if (!declaresSource && /^<(WhatsAppCTA|WhatsAppFloat)\b/.test(chunk)) continue;

    const missing: string[] = [];
    // Aceita atributo direto (attr=) ou spread com chave literal ('attr':).
    const hasService = /data-service\s*=/.test(chunk) || /['"]data-service['"]\s*:/.test(chunk);
    const hasAria = /aria-label\s*=/.test(chunk) || /['"]aria-label['"]\s*:/.test(chunk);
    if (!declaresSource) missing.push("data-wa-source");
    if (!hasService) missing.push("data-service");
    if (!hasAria) missing.push("aria-label");

    // Origem precisa estar registrada e em kebab-case.
    const literal = chunk.match(/data-wa-source\s*=\s*"([^"]+)"/);
    if (literal) {
      const value = literal[1];
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
        missing.push(`data-wa-source="${value}" fora do padrão kebab-case`);
      } else if (!REGISTERED.has(value)) {
        missing.push(`data-wa-source="${value}" não registrado em src/lib/waSources.ts`);
      }
    }

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
        snippet: unmaskArrows(chunk).replace(/\s+/g, " ").slice(0, 160),
        missing,
      });
    }
  }
}

walk(ROOT);

if (problems.length) {
  console.error(`[cta-attrs] FALHOU — ${problems.length} CTA(s) WhatsApp com problema:`);
  for (const p of problems) {
    console.error(`  ✗ ${p.file}:${p.line}  faltando: ${p.missing.join(", ")}`);
    console.error(`    ${p.snippet}`);
  }
  console.error("  → Use <WhatsAppCTA> (src/components/cta/WhatsAppCTA.tsx) para herdar os atributos automaticamente.");
  process.exit(1);
}
console.log(
  `[cta-attrs] OK — todos os links de WhatsApp têm data-wa-source (${REGISTERED.size} origens registradas), data-service e aria-label.`,
);

