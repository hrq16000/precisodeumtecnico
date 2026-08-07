#!/usr/bin/env bun
/**
 * Publica o arquivo de verificação IndexNow na raiz do site.
 *
 * Bing/Yandex exigem que a chave IndexNow esteja acessível em
 * https://{host}/{KEY}.txt (mesma origem do domínio). Como a chave é um
 * secret, não pode ser versionada — este script lê `BING_INDEXNOW_KEY`
 * do ambiente (definido no build/CI) e grava `public/${KEY}.txt`
 * automaticamente antes do build, para que o Vite copie para `dist/`.
 *
 * Localmente sem a env var: warn e no-op (não bloqueia o build).
 */
import { writeFileSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const KEY = process.env.BING_INDEXNOW_KEY?.trim();
const PUBLIC_DIR = join(process.cwd(), "public");

// Limpa arquivos de chave antigos (evita acumular chaves rotacionadas).
try {
  for (const f of readdirSync(PUBLIC_DIR)) {
    if (/^[a-f0-9]{8,128}\.txt$/i.test(f)) unlinkSync(join(PUBLIC_DIR, f));
  }
} catch { /* diretório pode não existir */ }

if (!KEY) {
  console.warn("[indexnow] BING_INDEXNOW_KEY ausente — pulando geração do arquivo de verificação.");
  process.exit(0);
}
if (!/^[a-f0-9]{8,128}$/i.test(KEY)) {
  // Fora do CI (dev/preview) a chave pode ser um placeholder: avisa e segue,
  // sem bloquear o build. No CI a chave precisa ser válida.
  const msg = "[indexnow] BING_INDEXNOW_KEY inválida (esperado 8-128 hex chars).";
  if (process.env.CI) {
    console.error(msg);
    process.exit(1);
  }
  console.warn(`${msg} Ignorando fora do CI.`);
  process.exit(0);
}


const filePath = join(PUBLIC_DIR, `${KEY}.txt`);
writeFileSync(filePath, KEY, "utf8");
console.log(`[indexnow] Publicado ${KEY}.txt em public/ (verificação de domínio).`);

if (!existsSync(filePath)) {
  console.error("[indexnow] Falha ao escrever arquivo de verificação.");
  process.exit(1);
}
