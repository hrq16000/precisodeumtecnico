/**
 * Image sitemap — public/sitemap-images.xml
 *
 * Mapeia cada página de localidade/serviço às fotos reais que ela exibe,
 * usando exatamente a mesma seleção determinística dos componentes
 * (pickLocalityPhotos / pathname como seed). Emite a maior variante JPG como
 * <image:loc> (formato universal para crawlers) — AVIF/WebP são servidos pelo
 * mesmo <picture> e validados pelo gate scripts/check-image-sitemap.ts.
 *
 * lastmod: mtime real do arquivo de imagem (timestamp autoritativo do asset).
 * Nunca a data do build.
 *
 * Também insere o shard no index public/sitemap.xml de forma idempotente.
 *
 * Executar: bunx tsx scripts/build-image-sitemap.ts (após build-sitemap.ts)
 */
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { CITY_PHOTO_BY_SLUG, pickLocalityPhotos, type PublicPhoto } from "../src/data/publicPhotos";

const BASE = "https://precisodeumtecnico.com";
const SHARD = "sitemap-images.xml";
const LOCALITY_SHARDS = [
  "sitemap-cidades.xml",
  "sitemap-bairros.xml",
  "sitemap-nacional-servicos-piloto.xml",
];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function locsOf(shard: string): string[] {
  const path = `public/${shard}`;
  if (!existsSync(path)) return [];
  return [...readFileSync(path, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

/** Reproduz o seed usado pelos componentes em cada família de rota. */
function seedFor(pathname: string): { citySlug: string; seed: string } {
  const segs = pathname.split("/").filter(Boolean);
  if (segs[0] === "atendimento-nacional") {
    const [, city, bairro] = segs;
    if (city && bairro) return { citySlug: city, seed: `${city}-${bairro}` };
    if (city) return { citySlug: city, seed: city };
  }
  if (segs[0] === "servicos" && segs.length >= 4) {
    const [, service, city, bairro] = segs;
    return { citySlug: city, seed: `${service}-${city}-${bairro}` };
  }
  const citySlug =
    Object.keys(CITY_PHOTO_BY_SLUG).find((slug) => pathname.includes(slug)) ?? "curitiba";
  return { citySlug, seed: pathname };
}

const fileDate = (rel: string): string | undefined => {
  try {
    return statSync(`public${rel}`).mtime.toISOString().slice(0, 10);
  } catch {
    return undefined;
  }
};

interface Entry {
  loc: string;
  lastmod?: string;
  images: { url: string; photo: PublicPhoto }[];
}

const seen = new Set<string>();
const entries: Entry[] = [];

for (const shard of LOCALITY_SHARDS) {
  for (const loc of locsOf(shard)) {
    if (seen.has(loc)) continue;
    seen.add(loc);
    const pathname = loc.replace(BASE, "") || "/";
    const { citySlug, seed } = seedFor(pathname);
    const photos = pickLocalityPhotos(citySlug, seed, 3);
    const images = photos
      .map((photo) => {
        const largest = photo.variants[photo.variants.length - 1];
        const rel = `/photos/${photo.slug}-${largest}.jpg`;
        return existsSync(`public${rel}`) ? { url: `${BASE}${rel}`, photo } : null;
      })
      .filter((x): x is { url: string; photo: PublicPhoto } => Boolean(x));
    if (images.length === 0) continue;
    const dates = images
      .map((i) => fileDate(i.url.replace(BASE, "")))
      .filter((d): d is string => Boolean(d))
      .sort();
    entries.push({ loc, lastmod: dates[dates.length - 1], images });
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (e) => `  <url>
    <loc>${esc(e.loc)}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}
${e.images
  .map(
    (i) => `    <image:image>
      <image:loc>${esc(i.url)}</image:loc>
      <image:title>${esc(i.photo.caption)}</image:title>
      <image:caption>${esc(`${i.photo.alt} — foto de ${i.photo.author}, ${i.photo.license} (Wikimedia Commons)`)}</image:caption>
      <image:license>${esc(i.photo.licenseUrl || i.photo.source)}</image:license>
    </image:image>`,
  )
  .join("\n")}
  </url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync(`public/${SHARD}`, xml);

// Index idempotente
const indexPath = "public/sitemap.xml";
if (existsSync(indexPath)) {
  let index = readFileSync(indexPath, "utf8");
  if (!index.includes(SHARD)) {
    const shardLastmod = entries
      .map((e) => e.lastmod)
      .filter((d): d is string => Boolean(d))
      .sort()
      .pop();
    const block = `  <sitemap>
    <loc>${BASE}/${SHARD}</loc>${shardLastmod ? `\n    <lastmod>${shardLastmod}</lastmod>` : ""}
  </sitemap>
</sitemapindex>`;
    index = index.replace("</sitemapindex>", block);
    writeFileSync(indexPath, index);
  }
}

const imageCount = entries.reduce((n, e) => n + e.images.length, 0);
console.log(`✓ ${SHARD}: ${entries.length} páginas · ${imageCount} imagens creditadas`);
