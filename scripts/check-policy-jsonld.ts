/**
 * Gate de build — JSON-LD das páginas legais/políticas.
 *
 * As páginas de política são as que o Google AdSense inspeciona manualmente.
 * Elas precisam emitir, sem exceção:
 *   - BreadcrumbList com "Início" + a própria página (URL absoluta e canônica);
 *   - FAQPage com no mínimo MIN_FAQ perguntas reais (pergunta e resposta
 *     não triviais), com paridade 1:1 com o conteúdo visível (o array `FAQ`
 *     é a fonte única consumida pela seção renderizada e pelo Helmet).
 *
 * O gate lê a fonte (não o DOM) porque o JSON-LD é montado por SEOHead a
 * partir das props `faq` e `breadcrumbs` — validar a fonte pega o erro antes
 * do deploy e é determinístico.
 *
 * Executar: bunx tsx scripts/check-policy-jsonld.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const MIN_FAQ = 3;
const MIN_Q = 12;
const MIN_A = 60;

interface PolicyPage {
  file: string;
  canonical: string;
}

const PAGES: PolicyPage[] = [
  { file: "src/pages/PoliticaDeCookies.tsx", canonical: "/politica-de-cookies" },
  { file: "src/pages/PoliticaPrivacidade.tsx", canonical: "/politica-privacidade" },
  { file: "src/pages/PoliticaDeAnuncios.tsx", canonical: "/politica-de-anuncios" },
  { file: "src/pages/TermosDeUso.tsx", canonical: "/termos-de-uso" },
];

let failed = 0;
const fail = (msg: string) => {
  console.error(`✗ ${msg}`);
  failed += 1;
};

/** Extrai o literal do array `const FAQ = [...]` de forma tolerante a formatação. */
function extractFaq(src: string): { question: string; answer: string }[] | null {
  const start = src.search(/const\s+FAQ\s*(?::[^=]+)?=\s*\[/);
  if (start === -1) return null;
  const from = src.indexOf("[", start);
  let depth = 0;
  let end = -1;
  for (let i = from; i < src.length; i += 1) {
    if (src[i] === "[") depth += 1;
    else if (src[i] === "]") {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) return null;
  const block = src.slice(from, end + 1);
  const items: { question: string; answer: string }[] = [];
  const re = /question:\s*(["'`])([\s\S]*?)\1[\s\S]*?answer:\s*(["'`])([\s\S]*?)\3/g;
  for (const m of block.matchAll(re)) items.push({ question: m[2], answer: m[4] });
  return items;
}

function check(page: PolicyPage) {
  const path = resolve(page.file);
  if (!existsSync(path)) {
    fail(`${page.file}: arquivo ausente`);
    return;
  }
  const src = readFileSync(path, "utf8");
  const label = page.canonical;

  // --- FAQPage ---
  if (!/\bfaq=\{/.test(src)) {
    fail(`${label}: SEOHead sem prop \`faq\` — FAQPage não é emitido`);
  } else {
    const faq = extractFaq(src);
    if (!faq) fail(`${label}: não foi possível ler o array \`const FAQ\``);
    else if (faq.length < MIN_FAQ)
      fail(`${label}: FAQPage com ${faq.length} pergunta(s); mínimo ${MIN_FAQ}`);
    else {
      faq.forEach((f, i) => {
        const q = f.question.trim();
        const a = f.answer.trim();
        if (q.length < MIN_Q) fail(`${label}: FAQ[${i}] pergunta curta demais ("${q}")`);
        if (a.length < MIN_A)
          fail(`${label}: FAQ[${i}] resposta com ${a.length} caracteres; mínimo ${MIN_A}`);
      });
      const dupes = faq.length - new Set(faq.map((f) => f.question.trim().toLowerCase())).size;
      if (dupes > 0) fail(`${label}: ${dupes} pergunta(s) duplicada(s) no FAQPage`);
    }
  }

  // --- BreadcrumbList ---
  if (!/breadcrumbs=\{\[/.test(src)) {
    fail(`${label}: SEOHead sem prop \`breadcrumbs\` — BreadcrumbList não é emitido`);
    return;
  }
  const bcBlock = src.slice(src.indexOf("breadcrumbs={["));
  const crumbs = [...bcBlock.matchAll(/name:\s*"([^"]+)"\s*,\s*url:\s*([^,}]+)/g)].slice(0, 6);
  if (crumbs.length < 2) fail(`${label}: BreadcrumbList precisa de ao menos 2 níveis`);
  else {
    if (!/^in[íi]cio$/i.test(crumbs[0][1].trim()))
      fail(`${label}: primeiro breadcrumb deveria ser "Início" (achado: "${crumbs[0][1]}")`);
    const last = crumbs[crumbs.length - 1][2].trim();
    const resolvesCanonical =
      last.includes("CANONICAL") || last.includes(page.canonical);
    if (!resolvesCanonical)
      fail(`${label}: último breadcrumb não aponta para a canônica da página (${last})`);
  }

  // Canônica absoluta declarada na página.
  if (!src.includes(`https://precisodeumtecnico.com${page.canonical}`))
    fail(`${label}: canônica absoluta ausente na fonte`);
}

PAGES.forEach(check);

if (failed > 0) {
  console.error(`\n✗ check-policy-jsonld: ${failed} problema(s) no JSON-LD das páginas de política.`);
  process.exit(1);
}
console.log(`✓ check-policy-jsonld: ${PAGES.length} páginas de política com FAQPage + BreadcrumbList válidos`);
