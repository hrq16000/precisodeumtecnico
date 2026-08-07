/**
 * Alerta de regressão de performance por página de bairro/cidade.
 *
 * Lê os relatórios do Lighthouse CI gerados por `bun run lhci:locality`
 * (./lighthouse-reports/locality/*.json), compara com a linha de base
 * versionada em perf-baseline.json e falha (ou avisa) quando uma métrica
 * piora além da tolerância — o cenário típico após trocar imagens ou layout.
 *
 * Métricas monitoradas: LCP, CLS, TBT, e o peso total de imagens.
 *
 * Uso:
 *   bunx tsx scripts/check-perf-regression.ts            # compara e falha
 *   PERF_UPDATE_BASELINE=1 bunx tsx scripts/check-perf-regression.ts
 *   PERF_SLACK_WEBHOOK=... para notificar regressões no Slack
 *
 * Tolerâncias (env): PERF_LCP_TOL (ms, default 300), PERF_CLS_TOL (0.02),
 * PERF_TBT_TOL (ms, 100), PERF_IMG_TOL (bytes, 60000).
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const DIR = process.env.PERF_REPORT_DIR ?? "lighthouse-reports/locality";
const BASELINE = process.env.PERF_BASELINE ?? "perf-baseline.json";
const UPDATE = process.env.PERF_UPDATE_BASELINE === "1";
const TOL = {
  lcp: Number(process.env.PERF_LCP_TOL ?? 300),
  cls: Number(process.env.PERF_CLS_TOL ?? 0.02),
  tbt: Number(process.env.PERF_TBT_TOL ?? 100),
  img: Number(process.env.PERF_IMG_TOL ?? 60_000),
};

interface Metrics { lcp: number; cls: number; tbt: number; img: number }

function collect(): Record<string, Metrics> {
  if (!existsSync(DIR)) {
    console.error(`✗ ${DIR} não existe — rodar "bun run lhci:locality" antes.`);
    process.exit(1);
  }
  const out: Record<string, Metrics> = {};
  for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json") && f.startsWith("lhr"))) {
    const lhr = JSON.parse(readFileSync(`${DIR}/${file}`, "utf8"));
    const a = lhr.audits ?? {};
    const url = new URL(lhr.finalDisplayedUrl ?? lhr.finalUrl ?? lhr.requestedUrl).pathname;
    const img =
      a["resource-summary"]?.details?.items?.find((i: { resourceType?: string }) => i.resourceType === "image")
        ?.transferSize ?? 0;
    out[url] = {
      lcp: Math.round(a["largest-contentful-paint"]?.numericValue ?? 0),
      cls: Number((a["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(3)),
      tbt: Math.round(a["total-blocking-time"]?.numericValue ?? 0),
      img: Math.round(img),
    };
  }
  return out;
}

const current = collect();
const count = Object.keys(current).length;
if (count === 0) {
  console.error(`✗ nenhum relatório lhr*.json em ${DIR}`);
  process.exit(1);
}

if (UPDATE || !existsSync(BASELINE)) {
  writeFileSync(BASELINE, JSON.stringify({ updatedAt: new Date().toISOString(), pages: current }, null, 2));
  console.log(`✓ baseline gravada em ${BASELINE} com ${count} páginas.`);
  process.exit(0);
}

const baseline: { pages: Record<string, Metrics> } = JSON.parse(readFileSync(BASELINE, "utf8"));
const regressions: string[] = [];
const novas: string[] = [];

for (const [url, m] of Object.entries(current)) {
  const b = baseline.pages[url];
  if (!b) {
    novas.push(url);
    continue;
  }
  if (m.lcp - b.lcp > TOL.lcp) regressions.push(`${url}: LCP ${b.lcp}ms → ${m.lcp}ms (+${m.lcp - b.lcp})`);
  if (m.cls - b.cls > TOL.cls) regressions.push(`${url}: CLS ${b.cls} → ${m.cls}`);
  if (m.tbt - b.tbt > TOL.tbt) regressions.push(`${url}: TBT ${b.tbt}ms → ${m.tbt}ms`);
  if (m.img - b.img > TOL.img)
    regressions.push(`${url}: peso de imagens ${(b.img / 1024).toFixed(0)}KB → ${(m.img / 1024).toFixed(0)}KB`);
}

for (const u of novas) console.log(`ℹ️  nova página sem baseline: ${u}`);

if (regressions.length) {
  console.error(`✗ ${regressions.length} regressão(ões) de performance:`);
  for (const r of regressions) console.error(`  - ${r}`);
  const hook = process.env.PERF_SLACK_WEBHOOK;
  if (hook) {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `:rotating_light: Regressão de performance em páginas de bairro/cidade\n${regressions.map((r) => `• ${r}`).join("\n")}`,
      }),
    }).catch(() => {});
  }
  process.exit(1);
}
console.log(`✓ sem regressão em ${count} páginas (tolerância LCP ${TOL.lcp}ms · CLS ${TOL.cls} · TBT ${TOL.tbt}ms).`);
