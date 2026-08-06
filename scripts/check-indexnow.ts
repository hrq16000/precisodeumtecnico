#!/usr/bin/env bun
/**
 * Gate de IndexNow.
 *
 * Local/CI (default): se `BING_INDEXNOW_KEY` estiver definido, exige que o
 * arquivo de verificação `public/{KEY}.txt` exista e contenha exatamente a
 * chave. Sem a env var, apenas avisa (não bloqueia build local).
 *
 * Remoto (`--remote [host]`): antes de considerar o site saudável,
 *   1. `GET https://{host}/{KEY}.txt` deve retornar 200 com o conteúdo da chave;
 *   2. o endpoint `/functions/v1/sitemap-status` não pode reportar "healthy"
 *      se o IndexNow estiver quebrado (coerência do health check).
 * Falha com exit 1 em qualquer inconsistência.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const KEY = process.env.BING_INDEXNOW_KEY?.trim();
const args = process.argv.slice(2);
const remoteIdx = args.indexOf("--remote");
const isRemote = remoteIdx !== -1;
const host = (isRemote && args[remoteIdx + 1]) || "precisodeumtecnico.com";

function fail(msg: string): never {
  console.error(`[check:indexnow] ✗ ${msg}`);
  process.exit(1);
}

if (!KEY) {
  if (isRemote) fail("BING_INDEXNOW_KEY ausente — impossível validar o arquivo de verificação remoto.");
  console.warn("[check:indexnow] BING_INDEXNOW_KEY ausente — verificação local pulada.");
  process.exit(0);
}

if (!isRemote) {
  const filePath = join(process.cwd(), "public", `${KEY}.txt`);
  if (!existsSync(filePath)) fail(`arquivo de verificação ausente: public/${KEY}.txt (rode 'bun run indexnow:key').`);
  const content = readFileSync(filePath, "utf8").trim();
  if (content !== KEY) fail(`conteúdo de public/${KEY}.txt não corresponde à chave configurada.`);
  console.log(`[check:indexnow] ✓ arquivo de verificação local íntegro (public/${KEY}.txt).`);
  process.exit(0);
}

const origin = `https://${host.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}`;

const keyUrl = `${origin}/${KEY}.txt`;
const keyRes = await fetch(keyUrl, { headers: { "User-Agent": "pdt-check-indexnow/1.0" } });
if (keyRes.status !== 200) fail(`${keyUrl} retornou HTTP ${keyRes.status} (esperado 200).`);
const remoteContent = (await keyRes.text()).trim();
if (remoteContent !== KEY) fail(`${keyUrl} respondeu 200 mas o conteúdo não bate com a chave.`);
console.log(`[check:indexnow] ✓ ${keyUrl} → 200 e conteúdo íntegro.`);

const statusUrl = process.env.SITEMAP_STATUS_URL;
if (!statusUrl) {
  console.warn("[check:indexnow] SITEMAP_STATUS_URL não definido — coerência com /sitemap-status não verificada.");
  process.exit(0);
}

const statusRes = await fetch(`${statusUrl}?host=${encodeURIComponent(host)}`, {
  headers: { "User-Agent": "pdt-check-indexnow/1.0" },
});
const body = (await statusRes.json()) as {
  status?: string;
  indexNow?: { ok?: boolean; issues?: string[] };
};
if (body.indexNow?.ok !== true) {
  fail(`sitemap-status reporta IndexNow quebrado: ${(body.indexNow?.issues ?? []).join("; ") || "sem detalhe"}`);
}
if (body.status === "healthy" && body.indexNow?.ok !== true) {
  fail("incoerência: /sitemap-status marcou 'healthy' com IndexNow inválido.");
}
console.log(`[check:indexnow] ✓ /sitemap-status = ${body.status} com IndexNow ok.`);
