/**
 * Smoke pós-publicação (B.5).
 *
 * Audita por rota:
 *  - HTTP 200 (e 404 real em rota inválida);
 *  - contagem de metatags (title, description, og:*, twitter:*, robots);
 *  - canonical auto-referente absoluto;
 *  - ausência de console errors / page errors;
 *  - ausência de assets 404 (requests falhos same-origin).
 *
 * Uso:
 *   bun scripts/smoke-post-publish.ts [--base https://precisodeumtecnico.com]
 * Relatório: dist/smoke-post-publish.json (e resumo no stdout).
 */

import { chromium, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const baseArg = args.indexOf("--base");
const BASE = (baseArg >= 0 ? args[baseArg + 1] : "http://localhost:8080").replace(/\/$/, "");

const ROUTES = [
  "/",
  "/servicos",
  "/assistencia-tecnica",
  "/assistencia-tecnica-curitiba",
  "/precos",
  "/regioes",
  "/atendimento-nacional",
  "/servico-em/curitiba/informatica",
  "/servico-em-nacional/sao-paulo/pinheiros/informatica",
  "/termos-orcamento",
];
const INVALID_ROUTE = "/rota-invalida-smoke-xyz";

interface RouteReport {
  route: string;
  status: number | null;
  title: string;
  titleCount: number;
  descriptionCount: number;
  canonical: string | null;
  canonicalCount: number;
  canonicalSelfReferent: boolean;
  robots: string[];
  ogCount: number;
  twitterCount: number;
  ogImage: string | null;
  twitterImage: string | null;
  consoleErrors: string[];
  pageErrors: string[];
  failedAssets: string[];
  ok: boolean;
  issues: string[];
}

async function auditRoute(page: Page, route: string, expect404: boolean): Promise<RouteReport> {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedAssets: string[] = [];

  const onConsole = (m: import("@playwright/test").ConsoleMessage) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  };
  const onPageError = (e: Error) => pageErrors.push(e.message);
  const onResponse = (r: import("@playwright/test").Response) => {
    if (r.status() >= 400 && r.url().startsWith(BASE) && r.url() !== `${BASE}${route}`) {
      failedAssets.push(`${r.status()} ${r.url()}`);
    }
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("response", onResponse);

  const resp = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  const status = resp?.status() ?? null;

  const meta = await page.evaluate(() => {
    const head = document.head;
    const attr = (sel: string, a = "content") =>
      head.querySelector(sel)?.getAttribute(a) ?? null;
    return {
      title: document.title,
      titleCount: head.querySelectorAll("title").length,
      descriptionCount: head.querySelectorAll('meta[name="description"]').length,
      canonical: attr('link[rel="canonical"]', "href"),
      canonicalCount: head.querySelectorAll('link[rel="canonical"]').length,
      robots: [...head.querySelectorAll('meta[name="robots"]')].map((m) => m.getAttribute("content") || ""),
      ogCount: head.querySelectorAll('meta[property^="og:"]').length,
      twitterCount: head.querySelectorAll('meta[name^="twitter:"]').length,
      ogImage: attr('meta[property="og:image"]'),
      twitterImage: attr('meta[name="twitter:image"]'),
    };
  });

  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  page.off("response", onResponse);

  const canonicalSelfReferent =
    !!meta.canonical &&
    /^https:\/\//.test(meta.canonical) &&
    new URL(meta.canonical).pathname.replace(/\/$/, "") === route.replace(/\/$/, "");

  const issues: string[] = [];
  if (status === null || status >= 400) issues.push(`status ${status}`);
  if (meta.titleCount !== 1) issues.push(`title x${meta.titleCount}`);
  if (meta.descriptionCount !== 1) issues.push(`description x${meta.descriptionCount}`);
  if (meta.canonicalCount !== 1) issues.push(`canonical x${meta.canonicalCount}`);
  if (meta.robots.length !== 1) issues.push(`robots x${meta.robots.length}`);
  if (!meta.ogImage) issues.push("og:image ausente");
  if (!meta.twitterImage) issues.push("twitter:image ausente");
  if (consoleErrors.length) issues.push(`console errors: ${consoleErrors.length}`);
  if (pageErrors.length) issues.push(`page errors: ${pageErrors.length}`);
  if (failedAssets.length) issues.push(`assets 404: ${failedAssets.length}`);

  if (expect404) {
    const body = await page.locator("body").innerText();
    if (!/404/.test(body)) issues.push("rota inválida não renderizou 404");
    if (!meta.robots.some((r) => /noindex/i.test(r))) issues.push("rota inválida sem noindex");
  } else if (!canonicalSelfReferent) {
    issues.push(`canonical não auto-referente: ${meta.canonical}`);
  }

  return {
    route,
    status,
    ...meta,
    canonicalSelfReferent,
    consoleErrors,
    pageErrors,
    failedAssets,
    ok: issues.length === 0,
    issues,
  };
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const reports: RouteReport[] = [];
  for (const route of ROUTES) reports.push(await auditRoute(page, route, false));
  reports.push(await auditRoute(page, INVALID_ROUTE, true));

  await browser.close();

  const failed = reports.filter((r) => !r.ok);
  const payload = {
    base: BASE,
    generatedAt: new Date().toISOString(),
    total: reports.length,
    passed: reports.length - failed.length,
    failed: failed.length,
    reports,
  };

  mkdirSync("dist", { recursive: true });
  writeFileSync("dist/smoke-post-publish.json", JSON.stringify(payload, null, 2));

  for (const r of reports) {
    console.log(`${r.ok ? "OK  " : "FAIL"} ${r.route}${r.ok ? "" : ` — ${r.issues.join("; ")}`}`);
  }
  console.log(`\n${payload.passed}/${payload.total} rotas OK — relatório em dist/smoke-post-publish.json`);
  if (failed.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
