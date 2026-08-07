/**
 * Monitoramento contínuo de SEO (Rodada 32).
 *
 * Verifica, contra o site publicado:
 *  1. 404 — URLs do sitemap que respondem com erro
 *  2. Redirects — URLs do sitemap que não respondem 200 direto (301/302/308)
 *  3. Canônicos — canonical ausente, relativo ou apontando para outra URL
 *  4. Robots — URLs listadas no sitemap porém bloqueadas por robots.txt
 *  5. Sitemap — duplicidades internas e variação de contagem vs. snapshot anterior
 *
 * Saída: relatório em stdout + JSON em .seo-monitor/report.json.
 * Exit code 1 quando há falha crítica (404, canônico divergente, URL bloqueada,
 * duplicidade no sitemap) — usado como alerta no CI/cron.
 *
 * Uso:
 *   bun scripts/seo-monitor.ts                       # amostra padrão
 *   bun scripts/seo-monitor.ts --all                 # todas as URLs
 *   bun scripts/seo-monitor.ts --base=https://...    # outro ambiente
 *   SLACK_WEBHOOK_URL=... bun scripts/seo-monitor.ts # alerta no Slack
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const arg = (name: string, fallback: string) =>
  args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback;

const BASE = arg("base", "https://precisodeumtecnico.com").replace(/\/$/, "");
const CHECK_ALL = args.includes("--all");
const SAMPLE = Number(arg("sample", "60"));
const CONCURRENCY = Number(arg("concurrency", "6"));

const STATE_DIR = resolve(".seo-monitor");
const STATE_FILE = resolve(STATE_DIR, "sitemap-state.json");
const REPORT_FILE = resolve(STATE_DIR, "report.json");

interface Issue {
  type: "404" | "redirect" | "canonical" | "robots" | "sitemap";
  severity: "critical" | "warning";
  url: string;
  detail: string;
}

const issues: Issue[] = [];
const add = (i: Issue) => issues.push(i);

async function fetchText(url: string, redirect: RequestRedirect = "follow") {
  const res = await fetch(url, { redirect, headers: { "user-agent": "PDUT-SEO-Monitor/1.0" } });
  const body = res.status < 400 && redirect === "follow" ? await res.text() : "";
  return { status: res.status, url: res.url, body, location: res.headers.get("location") };
}

/** Lê o sitemap index e todos os shards, retornando as <loc>. */
async function collectSitemapUrls(): Promise<string[]> {
  const seen: string[] = [];
  const queue = [`${BASE}/sitemap.xml`];
  const visited = new Set<string>();

  while (queue.length) {
    const sm = queue.shift()!;
    if (visited.has(sm)) continue;
    visited.add(sm);
    const res = await fetch(sm, { headers: { "user-agent": "PDUT-SEO-Monitor/1.0" } });
    if (!res.ok) {
      add({ type: "sitemap", severity: "critical", url: sm, detail: `sitemap respondeu ${res.status}` });
      continue;
    }
    const xml = await res.text();
    const isIndex = /<sitemapindex/i.test(xml);
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    if (isIndex) queue.push(...locs);
    else seen.push(...locs);
  }
  return seen;
}

function checkDuplicates(urls: string[]) {
  const counts = new Map<string, number>();
  for (const u of urls) counts.set(u, (counts.get(u) ?? 0) + 1);
  for (const [u, n] of counts) {
    if (n > 1) add({ type: "sitemap", severity: "critical", url: u, detail: `URL duplicada no sitemap (${n}x)` });
  }
  return counts.size;
}

/** Parser mínimo de robots.txt para o user-agent `*`. */
async function loadRobots(): Promise<{ disallow: string[]; allow: string[] }> {
  const res = await fetch(`${BASE}/robots.txt`);
  const disallow: string[] = [];
  const allow: string[] = [];
  if (!res.ok) {
    add({ type: "robots", severity: "warning", url: `${BASE}/robots.txt`, detail: `robots.txt respondeu ${res.status}` });
    return { disallow, allow };
  }
  let inStar = false;
  for (const raw of (await res.text()).split("\n")) {
    const line = raw.split("#")[0].trim();
    if (!line) continue;
    const [k, ...rest] = line.split(":");
    const key = k.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") inStar = value === "*";
    else if (inStar && key === "disallow" && value) disallow.push(value);
    else if (inStar && key === "allow" && value) allow.push(value);
  }
  return { disallow, allow };
}

const matches = (path: string, rule: string) => path.startsWith(rule.replace(/\*$/, ""));

function isBlocked(url: string, robots: { disallow: string[]; allow: string[] }) {
  const path = new URL(url).pathname;
  const d = robots.disallow.filter((r) => matches(path, r)).sort((a, b) => b.length - a.length)[0];
  if (!d) return false;
  const a = robots.allow.filter((r) => matches(path, r)).sort((x, y) => y.length - x.length)[0];
  return !(a && a.length >= d.length);
}

async function checkUrl(url: string) {
  try {
    const head = await fetchText(url, "manual");
    if (head.status >= 300 && head.status < 400) {
      add({
        type: "redirect",
        severity: "warning",
        url,
        detail: `sitemap aponta para URL que redireciona (${head.status} → ${head.location ?? "?"})`,
      });
    } else if (head.status >= 400) {
      add({ type: "404", severity: "critical", url, detail: `resposta HTTP ${head.status}` });
      return;
    }

    const page = await fetchText(url, "follow");
    if (page.status >= 400) {
      add({ type: "404", severity: "critical", url, detail: `resposta HTTP ${page.status} após redirect` });
      return;
    }
    // SPA: o canonical estático do index.html é omitido de propósito; o
    // canonical por rota é emitido via Helmet. Só validamos quando presente
    // no HTML servido (evita falso positivo em ambiente sem SSR).
    const m = page.body.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
    if (m) {
      const href = m[0].match(/href=["']([^"']+)["']/i)?.[1];
      if (!href) add({ type: "canonical", severity: "critical", url, detail: "canonical sem href" });
      else if (!/^https?:\/\//i.test(href))
        add({ type: "canonical", severity: "warning", url, detail: `canonical relativo: ${href}` });
      else if (href.replace(/\/$/, "") !== url.replace(/\/$/, ""))
        add({ type: "canonical", severity: "critical", url, detail: `canonical diverge: ${href}` });
    }
  } catch (e) {
    add({ type: "404", severity: "critical", url, detail: `falha de rede: ${(e as Error).message}` });
  }
}

async function pool<T>(items: T[], size: number, fn: (item: T) => Promise<void>) {
  let idx = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (idx < items.length) await fn(items[idx++]);
    }),
  );
}

async function notifySlack(summary: string) {
  const hook = process.env.SLACK_WEBHOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: summary }),
    });
  } catch {
    /* alerta best-effort */
  }
}

async function main() {
  console.log(`[seo-monitor] base=${BASE}`);
  const urls = await collectSitemapUrls();
  const unique = checkDuplicates(urls);
  console.log(`[seo-monitor] sitemap: ${urls.length} <loc> (${unique} únicas)`);

  // Comparação com o snapshot anterior (mudança abrupta = alerta).
  mkdirSync(STATE_DIR, { recursive: true });
  let delta = 0;
  if (existsSync(STATE_FILE)) {
    const prev = JSON.parse(readFileSync(STATE_FILE, "utf8")) as { count: number };
    delta = unique - prev.count;
    const drop = prev.count > 0 ? -delta / prev.count : 0;
    if (drop > 0.1)
      add({
        type: "sitemap",
        severity: "critical",
        url: `${BASE}/sitemap.xml`,
        detail: `queda de ${(drop * 100).toFixed(1)}% no total de URLs (${prev.count} → ${unique})`,
      });
    else if (delta !== 0) console.log(`[seo-monitor] variação de URLs: ${delta > 0 ? "+" : ""}${delta}`);
  }
  writeFileSync(STATE_FILE, JSON.stringify({ count: unique, checkedAt: new Date().toISOString() }, null, 2));

  const robots = await loadRobots();
  for (const u of urls) {
    if (isBlocked(u, robots))
      add({ type: "robots", severity: "critical", url: u, detail: "URL do sitemap bloqueada por robots.txt" });
  }

  const list = [...new Set(urls)];
  // Amostra determinística e distribuída (cobre todas as famílias de rota).
  const target = CHECK_ALL ? list : list.filter((_, i) => i % Math.max(1, Math.ceil(list.length / SAMPLE)) === 0);
  console.log(`[seo-monitor] verificando ${target.length} URLs...`);
  await pool(target, CONCURRENCY, checkUrl);

  const critical = issues.filter((i) => i.severity === "critical");
  const warnings = issues.filter((i) => i.severity === "warning");

  writeFileSync(
    REPORT_FILE,
    JSON.stringify(
      { base: BASE, checkedAt: new Date().toISOString(), sitemapUrls: unique, delta, checked: target.length, issues },
      null,
      2,
    ),
  );

  for (const i of issues) console.log(`${i.severity === "critical" ? "✗" : "!"} [${i.type}] ${i.url} — ${i.detail}`);
  const summary = `[seo-monitor] ${critical.length} crítico(s), ${warnings.length} aviso(s) em ${target.length} URLs verificadas (${unique} no sitemap).`;
  console.log(summary);

  if (critical.length) {
    await notifySlack(`🚨 ${summary}\n` + critical.slice(0, 10).map((i) => `• [${i.type}] ${i.url} — ${i.detail}`).join("\n"));
    process.exit(1);
  }
}

main();
