/**
 * Gate de build — thin content nas páginas de serviço.
 *
 * O Google AdSense (e o próprio ranqueamento) reprova páginas com "minimum
 * content requirements" não atendidos. Cada serviço em src/data/services.ts
 * alimenta uma rota indexável (/servicos/:slug), então o conteúdo mínimo é
 * auditado na fonte única — determinístico e sem depender de render.
 *
 * Limiares (por serviço):
 *   - MIN_WORDS palavras no conteúdo textual próprio (descrições + processo
 *     + benefícios + itens inclusos + respostas de FAQ);
 *   - MIN_FAQ perguntas com resposta substantiva;
 *   - MIN_PROCESS etapas de processo e MIN_INCLUDED itens inclusos;
 *   - nenhuma duplicação de longDescription entre serviços (conteúdo raspado
 *     de si mesmo também conta como thin/duplicado).
 *
 * Executar: bunx tsx scripts/check-thin-content.ts
 */
import { servicesData, type ServiceData } from "../src/data/services";

const MIN_WORDS = 350;
const MIN_FAQ = 4;
const MIN_FAQ_ANSWER = 80;
const MIN_PROCESS = 3;
const MIN_INCLUDED = 5;

let failed = 0;
const problems: string[] = [];
const fail = (msg: string) => {
  problems.push(msg);
  failed += 1;
};

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function textOf(s: ServiceData): string {
  return [
    s.subtitle,
    s.description,
    s.longDescription,
    ...s.benefits,
    ...s.includedServices,
    ...s.process.flatMap((p) => [p.title, p.description]),
    ...s.pricing.flatMap((p) => [p.name, p.description]),
    ...s.faqs.flatMap((f) => [f.question, f.answer]),
  ].join(" ");
}

const entries = Object.values(servicesData);
const seenLong = new Map<string, string>();

for (const s of entries) {
  const label = `/servicos/${s.slug}`;
  const wc = words(textOf(s));
  if (wc < MIN_WORDS) fail(`${label}: ${wc} palavras (mínimo ${MIN_WORDS}) — thin content`);
  if (s.faqs.length < MIN_FAQ) fail(`${label}: ${s.faqs.length} FAQ (mínimo ${MIN_FAQ})`);
  s.faqs.forEach((f, i) => {
    if (f.answer.trim().length < MIN_FAQ_ANSWER)
      fail(`${label}: FAQ[${i}] resposta com ${f.answer.trim().length} caracteres (mínimo ${MIN_FAQ_ANSWER})`);
  });
  if (s.process.length < MIN_PROCESS)
    fail(`${label}: ${s.process.length} etapas de processo (mínimo ${MIN_PROCESS})`);
  if (s.includedServices.length < MIN_INCLUDED)
    fail(`${label}: ${s.includedServices.length} itens inclusos (mínimo ${MIN_INCLUDED})`);
  if (!s.longDescription || words(s.longDescription) < 60)
    fail(`${label}: longDescription curta demais`);

  const key = s.longDescription.trim().toLowerCase();
  const prev = seenLong.get(key);
  if (prev) fail(`${label}: longDescription idêntica à de /servicos/${prev} (conteúdo duplicado)`);
  else seenLong.set(key, s.slug);
}

if (failed > 0) {
  console.error(`✗ check-thin-content: ${failed} problema(s) de conteúdo mínimo:\n`);
  problems.forEach((p) => console.error(`  - ${p}`));
  console.error(
    "\nAjuste o conteúdo em src/data/services.ts (mais profundidade real, não texto de enchimento).",
  );
  process.exit(1);
}

console.log(
  `✓ check-thin-content: ${entries.length} páginas de serviço acima do conteúdo mínimo (≥${MIN_WORDS} palavras, ≥${MIN_FAQ} FAQ)`,
);
