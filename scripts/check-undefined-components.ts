/**
 * Gate de build — identificadores ausentes (classe do erro "Navigate is not defined").
 *
 * Varre todos os arquivos .tsx de src/ e falha quando um componente usado em JSX
 * (<Foo ...>) não está importado nem declarado no próprio arquivo. É uma checagem
 * estática, sem execução, propositalmente conservadora: só acusa nomes que
 * começam com letra maiúscula e que não pertencem a nenhum escopo local.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith(".tsx")) out.push(full);
  }
  return out;
}

/** Nomes trazidos por imports (default, namespace e nomeados com alias). */
function collectImportedNames(source: string): Set<string> {
  const names = new Set<string>();
  const importRe = /import\s+([^;]+?)\s+from\s+["'][^"']+["']/g;
  let match: RegExpExecArray | null;
  while ((match = importRe.exec(source))) {
    const clause = match[1];
    const braced = clause.match(/\{([\s\S]*?)\}/);
    if (braced) {
      for (const part of braced[1].split(",")) {
        const name = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (name) names.add(name);
      }
    }
    const head = clause.replace(/\{[\s\S]*?\}/g, "").replace(/^type\s+/, "");
    for (const piece of head.split(",")) {
      const cleaned = piece.trim().replace(/^\*\s+as\s+/, "");
      if (/^[A-Za-z_$][\w$]*$/.test(cleaned)) names.add(cleaned);
    }
  }
  return names;
}

/** Nomes declarados no arquivo (const/let/function/class/enum). */
function collectLocalNames(source: string): Set<string> {
  const names = new Set<string>();
  const declRe = /(?:^|\n)\s*(?:export\s+)?(?:const|let|var|function|class|enum)\s+([A-Za-z_$][\w$]*)/g;
  let match: RegExpExecArray | null;
  while ((match = declRe.exec(source))) names.add(match[1]);
  return names;
}

/** Componentes usados em JSX: <Foo>, <Foo.Bar>, </Foo>. */
function collectJsxComponents(source: string): Set<string> {
  const used = new Set<string>();
  // (^|[^\w$.)\]>]) evita casar argumentos de tipo (useState<Step>, forwardRef<HTMLDivElement>).
  const jsxRe = /(^|[^\w$.)\]>])<\s*([A-Z][\w$]*)(?:\.[\w$]+)*[\s/>]/gm;
  let match: RegExpExecArray | null;
  while ((match = jsxRe.exec(source))) used.add(match[2]);
  return used;
}

const failures: string[] = [];

for (const file of walk(ROOT)) {
  const source = readFileSync(file, "utf8");
  const known = new Set<string>([
    ...collectImportedNames(source),
    ...collectLocalNames(source),
    "Fragment",
  ]);
  for (const component of collectJsxComponents(source)) {
    if (!known.has(component)) {
      failures.push(`${file}: <${component}> usado sem import nem declaração local`);
    }
  }
}

if (failures.length > 0) {
  console.error("check-undefined-components: identificadores ausentes encontrados");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log("check-undefined-components: OK — nenhum componente JSX sem definição");
