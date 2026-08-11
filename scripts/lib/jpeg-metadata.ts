/**
 * Utilitário compartilhado: leitura/remoção de metadados EXIF/XMP em JPEG.
 * Implementação sem dependências externas (parser de segmentos JFIF).
 */
import { readFileSync } from "node:fs";

export interface PhotoPrivacyReport {
  file: string;
  hasExif: boolean;
  hasGps: boolean;
  hasXmp: boolean;
  hasIptcOrPhotoshop: boolean;
  hasComment: boolean;
}

/** Segmentos de metadados que devem ser removidos (APP1..APP15 + COM). */
const METADATA_MARKERS = new Set<number>([
  ...Array.from({ length: 15 }, (_, i) => 0xe1 + i), // APP1..APP15
  0xfe, // COM
]);

function isJpeg(buf: Buffer): boolean {
  return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8;
}

function hasGpsIfd(segment: Buffer): boolean {
  // segment começa após "Exif\0\0"
  if (segment.length < 8) return false;
  const little = segment[0] === 0x49 && segment[1] === 0x49;
  const big = segment[0] === 0x4d && segment[1] === 0x4d;
  if (!little && !big) return false;
  const u16 = (o: number) => (little ? segment.readUInt16LE(o) : segment.readUInt16BE(o));
  const u32 = (o: number) => (little ? segment.readUInt32LE(o) : segment.readUInt32BE(o));
  const ifd0 = u32(4);
  if (ifd0 + 2 > segment.length) return false;
  const count = u16(ifd0);
  for (let i = 0; i < count; i++) {
    const entry = ifd0 + 2 + i * 12;
    if (entry + 12 > segment.length) break;
    if (u16(entry) === 0x8825) return true; // GPSInfo IFD pointer
  }
  return false;
}

/** Analisa um JPEG e retorna quais metadados sensíveis existem. */
export function inspectJpeg(file: string): PhotoPrivacyReport | null {
  const buf = readFileSync(file);
  if (!isJpeg(buf)) return null;
  const report: PhotoPrivacyReport = {
    file,
    hasExif: false,
    hasGps: false,
    hasXmp: false,
    hasIptcOrPhotoshop: false,
    hasComment: false,
  };
  let offset = 2;
  while (offset + 4 <= buf.length) {
    if (buf[offset] !== 0xff) break;
    const marker = buf[offset + 1];
    if (marker === 0xd8 || marker === 0xd9 || marker === 0xda) break;
    const length = buf.readUInt16BE(offset + 2);
    if (length < 2 || offset + 2 + length > buf.length) break;
    const payload = buf.subarray(offset + 4, offset + 2 + length);
    if (marker === 0xe1) {
      const head = payload.subarray(0, 30).toString("latin1");
      if (head.startsWith("Exif\0\0")) {
        report.hasExif = true;
        if (hasGpsIfd(payload.subarray(6))) report.hasGps = true;
      }
      if (head.includes("http://ns.adobe.com/xap")) report.hasXmp = true;
    } else if (marker === 0xed) {
      report.hasIptcOrPhotoshop = true;
    } else if (marker === 0xfe) {
      report.hasComment = true;
    }
    offset += 2 + length;
  }
  return report;
}

/** Retorna um novo buffer JPEG sem segmentos de metadados. */
export function stripJpegMetadata(buf: Buffer): Buffer | null {
  if (!isJpeg(buf)) return null;
  const out: Buffer[] = [buf.subarray(0, 2)];
  let offset = 2;
  while (offset + 4 <= buf.length) {
    if (buf[offset] !== 0xff) break;
    const marker = buf[offset + 1];
    if (marker === 0xda) {
      out.push(buf.subarray(offset));
      return Buffer.concat(out);
    }
    if (marker === 0xd9) break;
    const length = buf.readUInt16BE(offset + 2);
    if (length < 2 || offset + 2 + length > buf.length) break;
    if (!METADATA_MARKERS.has(marker)) {
      out.push(buf.subarray(offset, offset + 2 + length));
    }
    offset += 2 + length;
  }
  out.push(buf.subarray(offset));
  return Buffer.concat(out);
}

export function isSensitive(r: PhotoPrivacyReport): boolean {
  return r.hasExif || r.hasGps || r.hasXmp || r.hasIptcOrPhotoshop || r.hasComment;
}
