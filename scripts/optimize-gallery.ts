// Reprocessa os binários WebP de public/gallery com dimensões-alvo e
// qualidade fixa. Executar sob demanda (não faz parte do build padrão
// para evitar reescrever binários já otimizados no CI).
//
// Uso: bunx tsx scripts/optimize-gallery.ts
//
// Requer: sharp (npm i -D sharp). Se não instalado, o script apenas
// documenta o alvo (largura 1280, qualidade 70) e sai sem falhar.

import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const DIR = resolve("public/gallery");
const TARGET_WIDTH = 1280;
const QUALITY = 70;

async function main() {
  if (!existsSync(DIR)) {
    console.log(`[optimize-gallery] diretório ${DIR} não encontrado — nada a fazer.`);
    return;
  }
  let sharpMod: typeof import("sharp") | null = null;
  try {
    sharpMod = (await import("sharp")).default as unknown as typeof import("sharp");
  } catch {
    console.log("[optimize-gallery] sharp não instalado; instale com `bun add -D sharp` para executar.");
    console.log(`[optimize-gallery] alvo: largura=${TARGET_WIDTH}px, quality=${QUALITY}`);
    return;
  }
  const files = readdirSync(DIR).filter((f) => f.endsWith(".webp"));
  for (const f of files) {
    const full = resolve(DIR, f);
    try {
      const buf = await sharpMod(full)
        .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();
      const { writeFileSync } = await import("node:fs");
      writeFileSync(full, buf);
      console.log(`[optimize-gallery] ${f} — ${(buf.length / 1024).toFixed(1)} KB`);
    } catch (e) {
      console.warn(`[optimize-gallery] falha ao processar ${f}:`, (e as Error).message);
    }
  }
}

main();
