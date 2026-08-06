/**
 * Gate fail-closed da Rodada 3L — Montagem de PC / PC Gamer.
 *
 * Enquanto a capacidade operacional não estiver aprovada em
 * `docs/capacidade-montagem-de-pc.md` (rota_aprovada: true), a rota
 * `/servicos/montagem-de-pc` não pode existir em lugar nenhum:
 * roteador, menu, sitemap, cards de serviço ou dados de serviços.
 *
 * Quando aprovada, o gate inverte e exige a página completa.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const DOC = "docs/capacidade-montagem-de-pc.md";
const ROUTE = "/servicos/montagem-de-pc";

if (!existsSync(resolve(DOC))) {
  console.error(`[pc-assembly] FALHOU — fonte de capacidade ausente: ${DOC}`);
  process.exit(1);
}

const doc = readFileSync(resolve(DOC), "utf-8");
const approved = /^rota_aprovada:\s*true\s*$/m.test(doc);
const hasStatus = /^status:\s*(APROVADA|PARCIAL|NAO_COMPROVADA)\s*$/m.test(doc);
const hasTable = /\|\s*Capacidade\s*\|/.test(doc);
const hasDecision = /CAPACIDADE (CONFIRMADA|PARCIAL|NÃO COMPROVADA)/.test(doc);

const errors: string[] = [];
if (!hasStatus) errors.push(`${DOC}: campo "status:" ausente ou inválido.`);
if (!hasTable) errors.push(`${DOC}: tabela de capacidades ausente.`);
if (!hasDecision) errors.push(`${DOC}: decisão explícita ausente.`);

/** Coleta arquivos de código/rota relevantes. */
function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|json|xml)$/.test(entry)) out.push(p);
  }
  return out;
}

const scanRoots = ["src", "scripts", "public"].filter((d) => existsSync(resolve(d)));
const files = scanRoots.flatMap((d) => walk(resolve(d)));
const SELF = resolve("scripts/check-pc-assembly-service.ts");
const hits = files.filter((f) => f !== SELF && readFileSync(f, "utf-8").includes(ROUTE));

if (!approved) {
  for (const h of hits) {
    errors.push(
      `${h.replace(resolve(".") + "/", "")}: referencia ${ROUTE}, mas a capacidade operacional não está aprovada.`,
    );
  }
} else {
  const page = files.find((f) => /montagem-de-pc/i.test(f) && f.endsWith(".tsx"));
  if (!page) errors.push("capacidade aprovada, mas a página de montagem de PC não existe.");
  const routerHit = hits.some((h) => h.endsWith("App.tsx"));
  if (!routerHit) errors.push(`capacidade aprovada, mas ${ROUTE} não está registrada no roteador.`);
  const sitemapHit = hits.some((h) => h.includes("build-sitemap"));
  if (!sitemapHit) errors.push(`capacidade aprovada, mas ${ROUTE} não entrou no sitemap.`);
  if (page) {
    const src = readFileSync(page, "utf-8");
    const banned: [RegExp, string][] = [
      [/m[áa]ximo desempenho/i, "promessa de desempenho"],
      [/sem gargalo/i, "promessa de ausência de gargalo"],
      [/melhor fps|mais fps|\bfps garantid/i, "promessa de FPS"],
      [/\d+\s*%\s*(a mais|de ganho|mais r[áa]pido)/i, "promessa de ganho percentual"],
      [/at[ée]\s+\d+\s+vezes\s+mais\s+r[áa]pido/i, "promessa de multiplicador de desempenho"],
      [/no mesmo dia/i, "promessa de prazo de montagem"],
      [/R\$\s?\d{1,3}\.\d{3}/, "preço fechado inventado"],
    ];
    for (const [re, why] of banned) {
      if (re.test(src)) errors.push(`${page}: ${why}.`);
    }
    for (const required of ["FAQPage", "BreadcrumbList", '"Service"']) {
      if (!src.includes(required)) errors.push(`${page}: JSON-LD ${required} ausente.`);
    }
  }
}

if (errors.length) {
  console.error("[pc-assembly] FALHOU:");
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}

console.log(
  `[pc-assembly] OK — capacidade ${approved ? "APROVADA (página exigida)" : "NÃO aprovada (rota corretamente inexistente)"}; ${files.length} arquivos verificados.`,
);
