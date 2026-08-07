/**
 * Relatório público de paridade FAQ ↔ JSON-LD FAQPage por localidade.
 *
 * Rastreia com Chromium as páginas de cidade e bairro e compara, 1:1:
 *   - perguntas visíveis no acordeão da FAQ (data-testid="faq-question");
 *   - perguntas declaradas no FAQPage (mainEntity[].name);
 *   - respostas visíveis × acceptedAnswer.text (comparação normalizada).
 *
 * Saídas:
 *   public/relatorios/faq-parity.csv   — uma linha por localidade
 *   public/relatorios/faq-parity.json  — detalhe das divergências
 *
 * O CSV é publicado (acessível em /relatorios/faq-parity.csv) para auditoria
 * externa. Com FAQ_STRICT=1 o script sai com código 1 se houver divergência,
 * permitindo usá-lo como gate de CI.
 *
 * Env: FAQ_BASE_URL (default http://localhost:4173), FAQ_SAMPLE, FAQ_BATCH
 */
import { chromium, type Browser } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = (process.env.FAQ_BASE_URL ?? "http://localhost:4173").replace(/\/$/, "");
const RAW = process.env.FAQ_SAMPLE ?? "40";
const SAMPLE = RAW === "all" ? Infinity : Math.max(1, Number(RAW) || 40);
const BATCH = Math.max(1, Number(process.env.FAQ_BATCH ?? 6));
const STRICT = process.env.FAQ_STRICT === "1";
const DIR = "public/relatorios";

const norm = (s: string) =>
  s
    .replace(/\s+/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .trim()
    .toLowerCase();

function sample<T>(items: T[], size: number): T[] {
  if (!Number.isFinite(size) || items.length <= size) return [...items];
  const step = items.length / size;
  return Array.from({ length: size }, (_, i) => items[Math.floor(i * step)]);
}

async function targets(): Promise<string[]> {
  const idx = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const shards = [...idx.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].split("/").pop()!)
    .filter((n) => /cidades|bairros|nacional/.test(n));
  const out: string[] = [];
  for (const shard of shards) {
    const xml = await (await fetch(`${BASE}/${shard}`)).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    out.push(...sample(locs, SAMPLE));
  }
  return [...new Set(out)];
}

interface Row {
  url: string;
  visibleCount: number;
  jsonLdCount: number;
  missingInJsonLd: string[];
  missingInUI: string[];
  answerMismatch: string[];
  status: "ok" | "divergente" | "sem-faq" | "erro";
}

async function audit(browser: Browser, loc: string): Promise<Row> {
  const page = await browser.newPage();
  const path = new URL(loc).pathname;
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(800);
    const data = await page.evaluate(() => {
      const visible = Array.from(
        document.querySelectorAll('[data-testid="faq-question"], [data-faq-question]'),
      ).map((n) => ({
        q: n.textContent ?? "",
        a:
          (n.closest("[data-faq-item]")?.querySelector("[data-faq-answer]")?.textContent ??
            n.parentElement?.parentElement?.querySelector("[data-faq-answer]")?.textContent ??
            "") as string,
      }));
      const blocks = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map((n) => {
          try {
            return JSON.parse(n.textContent ?? "");
          } catch {
            return null;
          }
        })
        .flatMap((b) => (Array.isArray(b) ? b : [b]))
        .filter(Boolean) as Record<string, unknown>[];
      const faqPage = blocks.find((b) => b["@type"] === "FAQPage");
      const entities = ((faqPage?.mainEntity as unknown[]) ?? []).map((e) => {
        const q = e as Record<string, unknown>;
        const answer = q.acceptedAnswer as Record<string, unknown> | undefined;
        return { q: String(q.name ?? ""), a: String(answer?.text ?? "") };
      });
      return { visible, entities };
    });

    if (data.visible.length === 0 && data.entities.length === 0) {
      return { url: loc, visibleCount: 0, jsonLdCount: 0, missingInJsonLd: [], missingInUI: [], answerMismatch: [], status: "sem-faq" };
    }

    const vMap = new Map(data.visible.map((v) => [norm(v.q), v]));
    const jMap = new Map(data.entities.map((e) => [norm(e.q), e]));
    const missingInJsonLd = [...vMap.keys()].filter((k) => !jMap.has(k)).map((k) => vMap.get(k)!.q);
    const missingInUI = [...jMap.keys()].filter((k) => !vMap.has(k)).map((k) => jMap.get(k)!.q);
    const answerMismatch: string[] = [];
    for (const [k, v] of vMap) {
      const j = jMap.get(k);
      if (!j) continue;
      const a = norm(v.a);
      // resposta visível pode estar colapsada (vazia) — só comparamos quando há texto
      if (a && norm(j.a) && !norm(j.a).includes(a.slice(0, 60)) && !a.includes(norm(j.a).slice(0, 60))) {
        answerMismatch.push(v.q);
      }
    }
    const diverge = missingInJsonLd.length + missingInUI.length + answerMismatch.length > 0;
    return {
      url: loc,
      visibleCount: data.visible.length,
      jsonLdCount: data.entities.length,
      missingInJsonLd,
      missingInUI,
      answerMismatch,
      status: diverge ? "divergente" : "ok",
    };
  } catch (e) {
    return { url: loc, visibleCount: 0, jsonLdCount: 0, missingInJsonLd: [], missingInUI: [], answerMismatch: [`${(e as Error).message}`], status: "erro" };
  } finally {
    await page.close();
  }
}

const list = await targets();
console.log(`Auditando paridade FAQ↔JSON-LD em ${list.length} localidades (${BASE})...`);
const browser = await chromium.launch();
const rows: Row[] = [];
for (let i = 0; i < list.length; i += BATCH) {
  rows.push(...(await Promise.all(list.slice(i, i + BATCH).map((u) => audit(browser, u)))));
  process.stdout.write(`\r  ${Math.min(i + BATCH, list.length)}/${list.length}`);
}
await browser.close();
console.log("");

mkdirSync(DIR, { recursive: true });
const csvEsc = (s: string) => `"${s.replace(/"/g, '""')}"`;
const csv = [
  "url,status,perguntas_visiveis,perguntas_jsonld,faltando_no_jsonld,faltando_na_pagina,respostas_divergentes",
  ...rows.map((r) =>
    [
      csvEsc(r.url),
      r.status,
      r.visibleCount,
      r.jsonLdCount,
      csvEsc(r.missingInJsonLd.join(" | ")),
      csvEsc(r.missingInUI.join(" | ")),
      csvEsc(r.answerMismatch.join(" | ")),
    ].join(","),
  ),
].join("\n");
writeFileSync(`${DIR}/faq-parity.csv`, csv + "\n");

const summary = {
  geradoEm: new Date().toISOString(),
  base: BASE,
  total: rows.length,
  ok: rows.filter((r) => r.status === "ok").length,
  divergentes: rows.filter((r) => r.status === "divergente").length,
  semFaq: rows.filter((r) => r.status === "sem-faq").length,
  erros: rows.filter((r) => r.status === "erro").length,
  detalhes: rows.filter((r) => r.status !== "ok"),
};
writeFileSync(`${DIR}/faq-parity.json`, JSON.stringify(summary, null, 2));

console.log(
  `✓ ${summary.ok} paridade 1:1 · ${summary.divergentes} divergentes · ${summary.semFaq} sem FAQ · ${summary.erros} erros`,
);
console.log(`  Relatório público: /relatorios/faq-parity.csv`);
if (STRICT && summary.divergentes + summary.erros > 0) process.exit(1);
