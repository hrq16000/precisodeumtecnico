/**
 * Gate de build/deploy do ads.txt.
 *
 * Local (padrão): valida que public/ads.txt existe e contém a linha DIRECT do
 * publisher esperado.
 * Remoto (--remote): busca https://<dominio>/ads.txt e valida o mesmo conteúdo,
 * além da metatag google-adsense-account no HTML da home.
 *
 * Uso:
 *   bunx tsx scripts/check-ads-txt.ts
 *   bunx tsx scripts/check-ads-txt.ts --remote
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const PUB = (process.env.ADSENSE_PUBLISHER_ID ?? "pub-3762170279587706").replace(/^ca-/, "");
const BASE = process.env.SITE_BASE_URL ?? "https://precisodeumtecnico.com";
const FILE = resolve(process.cwd(), "public/ads.txt");
const REPORT = resolve(process.cwd(), "public/relatorios/ads-txt-status.json");
const remote = process.argv.includes("--remote");

interface Result { check: string; ok: boolean; detail: string }

function hasDirectLine(text: string): boolean {
  return new RegExp(`^\\s*google\\.com,\\s*${PUB},\\s*DIRECT,\\s*f08c47fec0942fa0\\s*$`, "im").test(text);
}

async function main() {
  const results: Result[] = [];

  if (!existsSync(FILE)) {
    results.push({ check: "public/ads.txt", ok: false, detail: "arquivo ausente" });
  } else {
    const text = readFileSync(FILE, "utf8");
    results.push({
      check: "public/ads.txt",
      ok: hasDirectLine(text),
      detail: hasDirectLine(text) ? `linha DIRECT de ${PUB} presente` : "linha DIRECT do publisher ausente",
    });
  }

  if (remote) {
    try {
      const res = await fetch(`${BASE}/ads.txt`, { headers: { "cache-control": "no-cache" } });
      const text = res.ok ? await res.text() : "";
      results.push({
        check: `${BASE}/ads.txt`,
        ok: res.ok && hasDirectLine(text),
        detail: res.ok ? (hasDirectLine(text) ? "publicado e correto" : "publicado sem a linha esperada") : `HTTP ${res.status}`,
      });
    } catch (e) {
      results.push({ check: `${BASE}/ads.txt`, ok: false, detail: `falha de rede: ${String(e)}` });
    }

    try {
      const res = await fetch(BASE);
      const html = res.ok ? await res.text() : "";
      const ok = html.includes(`name="google-adsense-account" content="ca-${PUB}"`);
      results.push({
        check: "metatag google-adsense-account",
        ok,
        detail: ok ? `ca-${PUB} presente no <head>` : "metatag ausente ou com outro ID",
      });
    } catch (e) {
      results.push({ check: "metatag google-adsense-account", ok: false, detail: `falha de rede: ${String(e)}` });
    }
  }

  const allOk = results.every((r) => r.ok);
  mkdirSync(resolve(process.cwd(), "public/relatorios"), { recursive: true });
  writeFileSync(
    REPORT,
    `${JSON.stringify({ publisher: PUB, mode: remote ? "remote" : "local", checkedAt: new Date().toISOString(), ok: allOk, results }, null, 2)}\n`,
    "utf8",
  );

  for (const r of results) console.log(`${r.ok ? "✓" : "✗"} ${r.check} — ${r.detail}`);
  console.log(`[ads-txt] relatório: public/relatorios/ads-txt-status.json`);
  if (!allOk) process.exit(1);
}

main();
