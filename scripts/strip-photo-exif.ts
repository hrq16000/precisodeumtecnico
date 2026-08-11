/**
 * Remove EXIF, GPS, XMP, IPTC e comentários de todos os JPEGs públicos.
 * Uso: bun run photos:strip-exif [--dry-run]
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { inspectJpeg, isSensitive, stripJpegMetadata } from "./lib/jpeg-metadata";

const DRY = process.argv.includes("--dry-run");
const ROOTS = ["public", "src/assets"];
const JPEG = /\.(jpe?g)$/i;

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (JPEG.test(entry)) out.push(full);
  }
  return out;
}

let cleaned = 0;
let bytesSaved = 0;

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const report = inspectJpeg(file);
    if (!report || !isSensitive(report)) continue;
    const original = readFileSync(file);
    const stripped = stripJpegMetadata(original);
    if (!stripped || stripped.length === original.length) continue;
    bytesSaved += original.length - stripped.length;
    cleaned++;
    if (DRY) {
      console.log(`• (dry-run) limparia ${file}`);
    } else {
      writeFileSync(file, stripped);
      console.log(`• limpo ${file}`);
    }
  }
}

console.log(
  cleaned === 0
    ? "✅ Nenhuma foto com metadados sensíveis encontrada."
    : `✅ ${cleaned} foto(s) ${DRY ? "seriam limpas" : "limpas"} — ${(bytesSaved / 1024).toFixed(1)} KB removidos.`,
);
