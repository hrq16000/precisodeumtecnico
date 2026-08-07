/**
 * Gate de CI — integridade do image sitemap.
 *
 * Falha quando:
 *   - public/sitemap-images.xml não existe ou está vazio;
 *   - alguma <image:loc> aponta para arquivo inexistente em public/;
 *   - as variantes AVIF e WebP da mesma imagem não existem;
 *   - há <loc> de página duplicada ou <image:loc> repetida na mesma página;
 *   - lastmod tem formato inválido, está no futuro, ou não bate com o mtime
 *     do arquivo mais recente daquela página;
 *   - o shard não está referenciado no index public/sitemap.xml.
 *
 * Executar: bunx tsx scripts/check-image-sitemap.ts
 */
import { existsSync, readFileSync, statSync } from "node:fs";

const BASE = "https://precisodeumtecnico.com";
const SHARD = "public/sitemap-images.xml";
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const today = new Date().toISOString().slice(0, 10);
const errors: string[] = [];

if (!existsSync(SHARD)) {
  console.error(`✗ ${SHARD} ausente — rodar scripts/build-image-sitemap.ts`);
  process.exit(1);
}
const xml = readFileSync(SHARD, "utf8");
const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
if (blocks.length === 0) errors.push("nenhuma <url> no image sitemap");

const pages = new Set<string>();
let imageTotal = 0;

for (const block of blocks) {
  const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1]?.trim();
  if (!loc) {
    errors.push("bloco <url> sem <loc>");
    continue;
  }
  if (pages.has(loc)) errors.push(`página duplicada: ${loc}`);
  pages.add(loc);

  const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1]?.trim();
  if (lastmod && (!ISO.test(lastmod) || lastmod > today)) {
    errors.push(`${loc}: lastmod inválido ou futuro "${lastmod}"`);
  }

  const imgs = [...block.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1].trim());
  if (imgs.length === 0) errors.push(`${loc}: <url> sem imagem`);
  const dupes = imgs.filter((u, i) => imgs.indexOf(u) !== i);
  if (dupes.length) errors.push(`${loc}: imagem repetida ${dupes[0]}`);

  const mtimes: string[] = [];
  for (const img of imgs) {
    imageTotal += 1;
    if (!img.startsWith(BASE)) {
      errors.push(`${loc}: image:loc fora do domínio canônico (${img})`);
      continue;
    }
    const rel = img.replace(BASE, "");
    const file = `public${rel}`;
    if (!existsSync(file)) {
      errors.push(`${loc}: arquivo inexistente ${rel}`);
      continue;
    }
    mtimes.push(statSync(file).mtime.toISOString().slice(0, 10));
    for (const ext of ["avif", "webp"]) {
      const variant = file.replace(/\.jpg$/, `.${ext}`);
      if (!existsSync(variant)) errors.push(`${loc}: variante ausente ${variant.replace("public", "")}`);
    }
  }
  const expected = mtimes.sort().pop();
  if (lastmod && expected && lastmod !== expected) {
    errors.push(`${loc}: lastmod "${lastmod}" ≠ mtime do asset "${expected}"`);
  }

  // licença obrigatória por imagem
  const licenses = [...block.matchAll(/<image:license>([^<]+)<\/image:license>/g)].length;
  if (licenses !== imgs.length) {
    errors.push(`${loc}: ${licenses} <image:license> para ${imgs.length} imagens`);
  }
}

const index = existsSync("public/sitemap.xml") ? readFileSync("public/sitemap.xml", "utf8") : "";
if (!index.includes("sitemap-images.xml")) {
  errors.push("public/sitemap.xml (index) não referencia sitemap-images.xml");
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s) no image sitemap:`);
  for (const e of errors.slice(0, 40)) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ image sitemap OK: ${pages.size} páginas · ${imageTotal} imagens · assets e licenças válidos.`);
