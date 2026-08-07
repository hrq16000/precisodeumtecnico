/**
 * Gate de CI — unicidade e qualidade de <title> / meta description.
 *
 * Rastreia com Chromium (SPA: as tags entram via Helmet) uma amostra das URLs
 * de serviço×cidade, bairro e blog e falha quando:
 *   - dois URLs diferentes compartilham o mesmo title ou a mesma description;
 *   - title fora de 25–65 caracteres ou description fora de 70–160;
 *   - title/description genéricos ("Lovable App", "Assistência Técnica" puro,
 *     "Preciso de Um Técnico" sozinho, description igual ao title);
 *   - title/description ausentes.
 *
 * Env:
 *   META_BASE_URL   (default http://localhost:4173)
 *   META_SAMPLE     URLs por shard (default 30, "all" para tudo)
 *   META_BATCH      páginas em paralelo (default 8)
 *
 * Executar: bunx tsx scripts/check-meta-uniqueness.ts
 */
import { chromium, type Browser } from "@playwright/test";
import { writeFileSync } from "node:fs";

const BASE = (process.env.META_BASE_URL ?? "http://localhost:4173").replace(/\/$/, "");
const RAW = process.env.META_SAMPLE ?? "30";
const SAMPLE = RAW === "all" ? Infinity : Math.max(1, Number(RAW) || 30);
const BATCH = Math.max(1, Number(process.env.META_BATCH ?? 8));
const OUT = process.env.META_OUT ?? "meta-uniqueness-report.json";

const TITLE_MIN = 25;
const TITLE_MAX = 65;
const DESC_MIN = 70;
const DESC_MAX = 160;

const GENERIC = [
  /^lovable app$/i,
  /^lovable generated project$/i,
  /^preciso de um t[ée]cnico$/i,
  /^assist[êe]ncia t[ée]cnica$/i,
  /^home$/i,
  /^untitled/i,
];

function sample<T>(items: T[], size: number): T[] {
  if (!Number.isFinite(size) || items.length <= size) return [...items];
  const step = items.length / size;
  return Array.from({ length: size }, (_, i) => items[Math.floor(i * step)]);
}

async function targets(): Promise<{ loc: string; shard: string }[]> {
  const idx = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const shards = [...idx.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].split("/").pop()!)
    .filter((n) => n !== "sitemap-images.xml");
  const out: { loc: string; shard: string }[] = [];
  for (const shard of shards) {
    const xml = await (await fetch(`${BASE}/${shard}`)).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    for (const loc of sample(locs, SAMPLE)) out.push({ loc, shard });
  }
  return out;
}

interface Row {
  url: string;
  shard: string;
  title: string;
  description: string;
  problems: string[];
}

async function inspect(browser: Browser, t: { loc: string; shard: string }): Promise<Row> {
  const page = await browser.newPage();
  const path = new URL(t.loc).pathname;
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page
      .waitForFunction(() => !!document.querySelector('meta[name="description"]'), null, { timeout: 15000 })
      .catch(() => {});
    const data = await page.evaluate(() => ({
      title: document.title ?? "",
      description:
        document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
      descCount: document.querySelectorAll('meta[name="description"]').length,
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "",
    }));

    const problems: string[] = [];
    const title = data.title.trim();
    const desc = data.description.trim();
    if (!title) problems.push("title ausente");
    if (!desc) problems.push("description ausente");
    if (data.descCount > 1) problems.push(`${data.descCount} meta description no DOM`);
    if (title && (title.length < TITLE_MIN || title.length > TITLE_MAX))
      problems.push(`title com ${title.length} chars (esperado ${TITLE_MIN}–${TITLE_MAX})`);
    if (desc && (desc.length < DESC_MIN || desc.length > DESC_MAX))
      problems.push(`description com ${desc.length} chars (esperado ${DESC_MIN}–${DESC_MAX})`);
    if (GENERIC.some((re) => re.test(title))) problems.push(`title genérico: "${title}"`);
    if (desc && desc === title) problems.push("description idêntica ao title");
    if (!data.ogImage) problems.push("og:image ausente (citação da URL sem prévia)");
    else if (!/^https:\/\//.test(data.ogImage)) problems.push(`og:image não absoluta: ${data.ogImage}`);

    return { url: t.loc, shard: t.shard, title, description: desc, problems };
  } catch (e) {
    return { url: t.loc, shard: t.shard, title: "", description: "", problems: [`erro: ${(e as Error).message}`] };
  } finally {
    await page.close();
  }
}

const list = await targets();
console.log(`Auditando title/description de ${list.length} URLs em ${BASE}...`);
const browser = await chromium.launch();
const rows: Row[] = [];
for (let i = 0; i < list.length; i += BATCH) {
  rows.push(...(await Promise.all(list.slice(i, i + BATCH).map((t) => inspect(browser, t)))));
  process.stdout.write(`\r  ${Math.min(i + BATCH, list.length)}/${list.length}`);
}
await browser.close();
console.log("");

// Duplicidade
const byTitle = new Map<string, string[]>();
const byDesc = new Map<string, string[]>();
for (const r of rows) {
  if (r.title) byTitle.set(r.title, [...(byTitle.get(r.title) ?? []), r.url]);
  if (r.description) byDesc.set(r.description, [...(byDesc.get(r.description) ?? []), r.url]);
}
const dupTitles = [...byTitle.entries()].filter(([, u]) => u.length > 1);
const dupDescs = [...byDesc.entries()].filter(([, u]) => u.length > 1);

const failing = rows.filter((r) => r.problems.length > 0);
writeFileSync(OUT, JSON.stringify({ base: BASE, checked: rows.length, dupTitles, dupDescs, failing }, null, 2));

for (const [title, urls] of dupTitles) {
  console.error(`✗ title duplicado (${urls.length}x): "${title}"`);
  for (const u of urls.slice(0, 4)) console.error(`    ${u}`);
}
for (const [desc, urls] of dupDescs) {
  console.error(`✗ description duplicada (${urls.length}x): "${desc.slice(0, 70)}…"`);
  for (const u of urls.slice(0, 4)) console.error(`    ${u}`);
}
for (const r of failing.slice(0, 40)) {
  console.error(`✗ ${r.url}: ${r.problems.join(" · ")}`);
}

const total = dupTitles.length + dupDescs.length + failing.length;
if (total > 0) {
  console.error(`\n❌ ${total} violação(ões). Relatório: ${OUT}`);
  process.exit(1);
}
console.log(`✓ ${rows.length} URLs com title/description únicos, dentro do limite e com og:image.`);
