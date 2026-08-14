/**
 * Smoke de produção: percorre rotas nacionais e locais críticas em
 * https://precisodeumtecnico.com e valida HTTP 200, presença de <title>,
 * canonical único e ausência de shell vazio (HTML sem conteúdo).
 *
 * Uso: bunx tsx scripts/smoke-prod-routes.ts [baseUrl]
 */
import { CURITIBA_SERVICE_SLUGS } from "../src/data/curitibaServiceLocal";

const BASE = process.argv[2] ?? "https://precisodeumtecnico.com";

const ROUTES = [
  "/",
  "/servicos",
  "/precos",
  "/contato",
  "/sobre",
  "/blog",
  "/regioes",
  "/regioes/curitiba",
  "/atendimento-nacional",
  "/assistencia-tecnica",
  "/assistencia-tecnica-curitiba",
  "/como-funciona",
  "/busca",
  "/servicos/informatica",
  "/servicos/troca-de-tela-tv-curitiba",
  "/servicos/reparo-smart-tv-curitiba",
  "/servicos/configuracao-wifi-curitiba",
  "/servico-em/curitiba/informatica",
  "/regioes/curitiba/batel",
  ...CURITIBA_SERVICE_SLUGS.map((s) => `/servicos/${s}/curitiba`),
];

let failed = 0;

for (const route of ROUTES) {
  const url = `${BASE}${route}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    const problems: string[] = [];
    if (res.status !== 200) problems.push(`status ${res.status}`);
    if (!/<title>[^<]{6,}<\/title>/i.test(html)) problems.push("title ausente/curto");
    const canonicals = html.match(/<link[^>]+rel=["']canonical["']/gi)?.length ?? 0;
    if (canonicals !== 1) problems.push(`canonical x${canonicals}`);
    if (html.length < 1500) problems.push("HTML muito curto (possível shell vazio)");
    if (problems.length) {
      failed++;
      console.error(`  ✗ ${route} — ${problems.join(" · ")}`);
    } else {
      console.log(`  ✓ ${route}`);
    }
  } catch (e) {
    failed++;
    console.error(`  ✗ ${route} — erro de rede: ${(e as Error).message}`);
  }
}

console.log(`[smoke-prod] ${ROUTES.length - failed}/${ROUTES.length} rotas OK em ${BASE}`);
if (failed) process.exit(1);
