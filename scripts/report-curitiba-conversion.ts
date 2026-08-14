/**
 * Relatório de conversão por serviço em Curitiba.
 *
 * Lê os eventos de analytics locais persistidos (whatsapp_click / triage_open /
 * triage_complete / virtual_page_view) de um export JSON e calcula a taxa de
 * conversão por rota /servicos/:servico/curitiba. Publica em
 * public/relatorios/curitiba-conversao.json.
 *
 * Uso:
 *   bunx tsx scripts/report-curitiba-conversion.ts [caminho-do-export.json]
 *
 * Sem export disponível, gera o esqueleto do relatório com todas as rotas do
 * lote em zero — o painel nunca fica com dados inventados.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { CURITIBA_SERVICE_SLUGS } from "../src/data/curitibaServiceLocal";

interface Ev {
  event: string;
  page_path?: string;
  service?: string;
  city?: string;
}

const input = process.argv[2];
const events: Ev[] = input && existsSync(input) ? JSON.parse(readFileSync(input, "utf8")) : [];

const rows = CURITIBA_SERVICE_SLUGS.map((slug) => {
  const path = `/servicos/${slug}/curitiba`;
  const on = events.filter((e) => e.page_path === path);
  const views = on.filter((e) => e.event === "virtual_page_view").length;
  const waClicks = on.filter((e) => e.event === "whatsapp_click").length;
  const triageOpen = on.filter((e) => e.event === "triage_open").length;
  const triageDone = on.filter((e) => e.event === "triage_complete").length;
  const contacts = waClicks + triageDone;
  return {
    slug,
    path,
    views,
    whatsapp_clicks: waClicks,
    triage_open: triageOpen,
    triage_complete: triageDone,
    contacts,
    conversion_rate: views > 0 ? Number(((contacts / views) * 100).toFixed(2)) : 0,
  };
}).sort((a, b) => b.conversion_rate - a.conversion_rate || b.contacts - a.contacts);

const report = {
  generatedAt: new Date().toISOString(),
  source: input ?? null,
  totalEvents: events.length,
  best: rows.filter((r) => r.contacts > 0).slice(0, 5),
  rows,
};

mkdirSync("public/relatorios", { recursive: true });
writeFileSync("public/relatorios/curitiba-conversao.json", JSON.stringify(report, null, 2));

console.log(
  `[curitiba-conversao] ${rows.length} rotas · ${events.length} eventos · melhores: ${
    report.best.map((b) => `${b.slug} ${b.conversion_rate}%`).join(", ") || "sem dados ainda"
  }`,
);
