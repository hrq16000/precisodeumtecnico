/**
 * Relatório semanal de conversão do funil — por serviço e por UTM/campanha.
 *
 * Consolida eventos exportados do analytics local (virtual_page_view,
 * cta_click, whatsapp_click, triage_open, triage_complete) e produz:
 *   public/relatorios/funil-conversao.json  (dados completos)
 *   public/relatorios/funil-conversao.csv   (planilha por serviço)
 *   public/relatorios/funil-conversao.md    (resumo legível — anexado no CI)
 *
 * Uso:
 *   bunx tsx scripts/report-conversion-funnel.ts [export.json]
 *   FUNNEL_EVENTS_URL=https://... bunx tsx scripts/report-conversion-funnel.ts
 *
 * Sem fonte de eventos, gera o esqueleto zerado — nunca inventa números.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

interface Ev {
  event: string;
  page_path?: string;
  service?: string;
  city?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  timestamp?: string;
}

interface Bucket {
  key: string;
  views: number;
  cta_clicks: number;
  whatsapp_clicks: number;
  triage_open: number;
  triage_complete: number;
  contacts: number;
  conversion_rate: number;
}

async function loadEvents(): Promise<Ev[]> {
  const file = process.argv[2];
  if (file && existsSync(file)) return JSON.parse(readFileSync(file, "utf8"));
  const url = process.env.FUNNEL_EVENTS_URL;
  if (url) {
    try {
      const res = await fetch(url, {
        headers: process.env.FUNNEL_EVENTS_TOKEN
          ? { Authorization: `Bearer ${process.env.FUNNEL_EVENTS_TOKEN}` }
          : undefined,
      });
      if (res.ok) {
        const body = (await res.json()) as Ev[] | { events?: Ev[] };
        return Array.isArray(body) ? body : (body.events ?? []);
      }
      console.warn(`[funil] fonte remota respondeu HTTP ${res.status} — relatório sai zerado.`);
    } catch (e) {
      console.warn(`[funil] falha ao buscar eventos remotos: ${(e as Error).message}`);
    }
  }
  return [];
}

function bucketize(events: Ev[], keyOf: (e: Ev) => string | undefined): Bucket[] {
  const map = new Map<string, Bucket>();
  for (const e of events) {
    const key = keyOf(e);
    if (!key) continue;
    const b =
      map.get(key) ??
      ({
        key,
        views: 0,
        cta_clicks: 0,
        whatsapp_clicks: 0,
        triage_open: 0,
        triage_complete: 0,
        contacts: 0,
        conversion_rate: 0,
      } satisfies Bucket);
    if (e.event === "virtual_page_view") b.views++;
    if (e.event === "cta_click") b.cta_clicks++;
    if (e.event === "whatsapp_click") b.whatsapp_clicks++;
    if (e.event === "triage_open") b.triage_open++;
    if (e.event === "triage_complete") b.triage_complete++;
    map.set(key, b);
  }
  return [...map.values()]
    .map((b) => {
      b.contacts = b.whatsapp_clicks + b.triage_complete;
      b.conversion_rate = b.views > 0 ? Number(((b.contacts / b.views) * 100).toFixed(2)) : 0;
      return b;
    })
    .sort((a, b) => b.contacts - a.contacts || b.conversion_rate - a.conversion_rate);
}

const events = await loadEvents();

const byService = bucketize(events, (e) => e.service ?? undefined);
const byPage = bucketize(events, (e) => e.page_path ?? undefined);
const byCampaign = bucketize(
  events,
  (e) =>
    e.utm_campaign || e.utm_source
      ? `${e.utm_source ?? "(sem-source)"} / ${e.utm_medium ?? "(sem-medium)"} / ${e.utm_campaign ?? "(sem-campanha)"}`
      : undefined,
);
const byCity = bucketize(events, (e) => e.city ?? undefined);

const totals = {
  events: events.length,
  views: events.filter((e) => e.event === "virtual_page_view").length,
  contacts:
    events.filter((e) => e.event === "whatsapp_click").length +
    events.filter((e) => e.event === "triage_complete").length,
};

const report = {
  generatedAt: new Date().toISOString(),
  periodHint: "Últimos eventos disponíveis na fonte informada",
  totals,
  byService,
  byCampaign,
  byCity,
  byPage: byPage.slice(0, 50),
};

mkdirSync("public/relatorios", { recursive: true });
writeFileSync("public/relatorios/funil-conversao.json", JSON.stringify(report, null, 2));

const csv = [
  "dimensao,chave,views,cta_clicks,whatsapp_clicks,triage_open,triage_complete,contatos,taxa_conversao_%",
  ...[
    ...byService.map((b) => ["servico", b] as const),
    ...byCampaign.map((b) => ["campanha", b] as const),
    ...byCity.map((b) => ["cidade", b] as const),
  ].map(
    ([dim, b]) =>
      `${dim},"${b.key.replace(/"/g, "'")}",${b.views},${b.cta_clicks},${b.whatsapp_clicks},${b.triage_open},${b.triage_complete},${b.contacts},${b.conversion_rate}`,
  ),
].join("\n");
writeFileSync("public/relatorios/funil-conversao.csv", `${csv}\n`);

const table = (title: string, rows: Bucket[]) =>
  [
    `### ${title}`,
    "",
    "| Chave | Views | WhatsApp | Triagem concluída | Contatos | Conversão |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    ...(rows.length
      ? rows
          .slice(0, 10)
          .map(
            (b) =>
              `| ${b.key} | ${b.views} | ${b.whatsapp_clicks} | ${b.triage_complete} | ${b.contacts} | ${b.conversion_rate}% |`,
          )
      : ["| _sem dados no período_ | 0 | 0 | 0 | 0 | 0% |"]),
    "",
  ].join("\n");

writeFileSync(
  "public/relatorios/funil-conversao.md",
  [
    "# Funil de conversão — relatório semanal",
    "",
    `Gerado em ${new Date().toISOString()} · ${totals.events} eventos · ${totals.views} views · ${totals.contacts} contatos`,
    "",
    table("Por serviço", byService),
    table("Por UTM / campanha", byCampaign),
    table("Por cidade", byCity),
  ].join("\n"),
);

console.log(
  `[funil] ${totals.events} eventos · ${byService.length} serviços · ${byCampaign.length} campanhas · relatórios em public/relatorios/funil-conversao.{json,csv,md}`,
);
