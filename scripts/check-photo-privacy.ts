/**
 * Gate de privacidade de fotos: falha o CI se qualquer JPEG público carregar
 * EXIF, GPS, XMP, IPTC ou comentários (dados pessoais / localização real).
 *
 * Correção: bun run photos:strip-exif
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { inspectJpeg, isSensitive, type PhotoPrivacyReport } from "./lib/jpeg-metadata";

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

const flagged: PhotoPrivacyReport[] = [];
let scanned = 0;

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const report = inspectJpeg(file);
    if (!report) continue;
    scanned++;
    if (isSensitive(report)) flagged.push(report);
  }
}

if (flagged.length > 0) {
  console.error(`❌ ${flagged.length} foto(s) com metadados sensíveis (de ${scanned} analisadas):`);
  for (const r of flagged) {
    const tags = [
      r.hasGps ? "GPS" : null,
      r.hasExif ? "EXIF" : null,
      r.hasXmp ? "XMP" : null,
      r.hasIptcOrPhotoshop ? "IPTC" : null,
      r.hasComment ? "COMMENT" : null,
    ].filter(Boolean);
    console.error(`   - ${r.file} [${tags.join(", ")}]`);
  }
  console.error("\n➡  Rode: bun run photos:strip-exif");
  process.exit(1);
}

console.log(`✅ check:photo-privacy — ${scanned} JPEG(s) sem EXIF/GPS/XMP/IPTC.`);
