// Pre-publish OG image validator. Run with: bun scripts/check-og-images.ts
// Verifies that every og:image referenced by the app exists locally, has
// the correct 1200x630 dimensions, and (when a base URL is provided) returns
// HTTP 200 over the network. Exits with code 1 on any failure so CI/build
// pipelines can block deploys with broken cards.

import { existsSync, readFileSync, statSync } from "node:fs";
import { blogCategories, allBlogPosts } from "../src/data/blog";

const PUBLIC_DIR = "public";
const EXPECTED_W = 1200;
const EXPECTED_H = 630;
const BASE_URL = process.env.OG_BASE_URL ?? ""; // e.g. https://precisodeumtecnico.com

interface Issue { path: string; reason: string }
const issues: Issue[] = [];
const ok: string[] = [];

/** Read width/height from a JPEG file by walking SOF markers, or PNG IHDR. */
function readDimensions(file: string): { w: number; h: number } | null {
  const buf = readFileSync(file);
  // PNG: 8-byte signature + IHDR
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  // JPEG: 0xFFD8 ... SOFn (0xC0..0xCF except C4/C8/CC)
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      const size = buf.readUInt16BE(i + 2);
      const isSOF =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSOF) {
        const h = buf.readUInt16BE(i + 5);
        const w = buf.readUInt16BE(i + 7);
        return { w, h };
      }
      i += 2 + size;
    }
  }
  return null;
}

async function checkPath(rel: string) {
  const local = `${PUBLIC_DIR}${rel}`;
  if (!existsSync(local)) {
    issues.push({ path: rel, reason: "arquivo não encontrado em /public" });
    return;
  }
  const size = statSync(local).size;
  if (size < 5_000) {
    issues.push({ path: rel, reason: `arquivo muito pequeno (${size} bytes)` });
    return;
  }
  const dim = readDimensions(local);
  if (!dim) {
    issues.push({ path: rel, reason: "não foi possível ler dimensões (formato inválido)" });
    return;
  }
  if (dim.w !== EXPECTED_W || dim.h !== EXPECTED_H) {
    issues.push({ path: rel, reason: `dimensões ${dim.w}x${dim.h} (esperado ${EXPECTED_W}x${EXPECTED_H})` });
    return;
  }
  if (BASE_URL) {
    try {
      const res = await fetch(`${BASE_URL}${rel}`, { method: "HEAD" });
      if (!res.ok) {
        issues.push({ path: rel, reason: `HTTP ${res.status} em ${BASE_URL}${rel}` });
        return;
      }
    } catch (e) {
      issues.push({ path: rel, reason: `falha ao buscar: ${(e as Error).message}` });
      return;
    }
  }
  ok.push(rel);
}

const targets = new Set<string>();
targets.add("/og-image.jpg");
targets.add("/og/blog.jpg");
targets.add("/og/precos.jpg");
for (const c of blogCategories) targets.add(`/og/${c.slug}.jpg`);
for (const p of allBlogPosts) targets.add(`/og/${p.category}.jpg`);

console.log(`Verificando ${targets.size} imagens OG...${BASE_URL ? ` (HEAD via ${BASE_URL})` : ""}`);

await Promise.all([...targets].map(checkPath));

console.log(`✓ ${ok.length} OK`);
if (issues.length) {
  console.error(`✗ ${issues.length} problema(s):`);
  for (const it of issues) console.error(`  - ${it.path}: ${it.reason}`);
  process.exit(1);
}
console.log("Todas as imagens OG passaram na validação.");
