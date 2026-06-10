// Build-time sitemap generator. Run with: bun scripts/build-sitemap.ts
// Produces public/sitemap.xml with all routes plus accurate lastmod dates
// derived from source-file mtimes. Processes URLs in async batches so the
// event loop stays responsive even with thousands of pages, and yields back
// to the runtime between batches.

import { writeFileSync, statSync, existsSync } from "node:fs";
import { servicesData } from "../src/data/services";
import {
  citiesData,
  curitibaBairros,
  sjpBairros,
  pinhaiBairros,
  colomboBairros,
  araucariaBairros,
} from "../src/data/regions";
import { allBlogPosts as blogPosts, blogCategories } from "../src/data/blog";

const BASE = "https://precisodeumtecnico.com";
const today = new Date().toISOString().split("T")[0];
const BATCH_SIZE = 250; // URLs processed per microtask yield

const fileDate = (path: string): string => {
  try {
    if (!existsSync(path)) return today;
    return statSync(path).mtime.toISOString().split("T")[0];
  } catch {
    return today;
  }
};

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const servicesMtime = fileDate("src/data/services.ts");
const regionsMtime = fileDate("src/data/regions.ts");
const blogMtime = fileDate("src/data/blog.ts");
const satMtime = fileDate("src/data/satellitePosts.ts");
const indexMtime = fileDate("src/pages/Index.tsx");
const precosMtime = fileDate("src/pages/Precos.tsx");

interface Url {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

const urls: Url[] = [];
const add = (u: Url) => urls.push(u);

// ---- Generators (lazy) ----
function* staticUrls(): Generator<Url> {
  yield { loc: `${BASE}/`, changefreq: "daily", priority: 1.0, lastmod: indexMtime };
  yield { loc: `${BASE}/servicos`, changefreq: "weekly", priority: 0.9, lastmod: servicesMtime };
  yield { loc: `${BASE}/regioes`, changefreq: "weekly", priority: 0.9, lastmod: regionsMtime };
  yield { loc: `${BASE}/sobre`, changefreq: "monthly", priority: 0.6, lastmod: fileDate("src/pages/Sobre.tsx") };
  yield { loc: `${BASE}/contato`, changefreq: "monthly", priority: 0.7, lastmod: fileDate("src/pages/Contato.tsx") };
  yield { loc: `${BASE}/termos-orcamento-pre-aprovado`, changefreq: "yearly", priority: 0.5, lastmod: fileDate("src/pages/TermosOrcamento.tsx") };
  yield { loc: `${BASE}/blog`, changefreq: "weekly", priority: 0.9, lastmod: blogMtime };
  yield { loc: `${BASE}/precos`, changefreq: "weekly", priority: 0.85, lastmod: precosMtime };
  yield {
    loc: `${BASE}/assistencia-tecnica-curitiba`,
    changefreq: "weekly",
    priority: 0.95,
    lastmod: fileDate("src/pages/AssistenciaTecnicaCuritiba.tsx"),
  };
}

function* serviceUrls(): Generator<Url> {
  for (const slug of Object.keys(servicesData))
    yield { loc: `${BASE}/servicos/${slug}`, changefreq: "weekly", priority: 0.85, lastmod: servicesMtime };
}

function* cityUrls(): Generator<Url> {
  for (const slug of Object.keys(citiesData))
    yield { loc: `${BASE}/regioes/${slug}`, changefreq: "weekly", priority: 0.85, lastmod: regionsMtime };
}

function* matrixUrls(): Generator<Url> {
  const lm = servicesMtime > regionsMtime ? servicesMtime : regionsMtime;
  for (const cityKey of Object.keys(citiesData))
    for (const serviceKey of Object.keys(servicesData))
      yield { loc: `${BASE}/servico-em/${cityKey}/${serviceKey}`, changefreq: "weekly", priority: 0.7, lastmod: lm };
}

function* neighborhoodUrls(): Generator<Url> {
  const cityBairros: Record<string, string[]> = {
    curitiba: curitibaBairros,
    "sao-jose-dos-pinhais": sjpBairros,
    pinhais: pinhaiBairros,
    colombo: colomboBairros,
    araucaria: araucariaBairros,
  };
  for (const [city, bairros] of Object.entries(cityBairros))
    for (const b of bairros)
      yield { loc: `${BASE}/regioes/${city}/${slugify(b)}`, changefreq: "monthly", priority: 0.6, lastmod: regionsMtime };
}

function* blogUrls(): Generator<Url> {
  for (const cat of blogCategories)
    yield { loc: `${BASE}/blog/categoria/${cat.slug}`, changefreq: "weekly", priority: 0.7, lastmod: blogMtime };
  for (const post of blogPosts) {
    const postDate = post.updatedAt ?? post.publishedAt;
    const fileBased = post.slug.includes("-em-") ? satMtime : blogMtime;
    const lastmod = postDate > fileBased ? postDate : fileBased;
    yield { loc: `${BASE}/blog/${post.slug}`, changefreq: "monthly", priority: 0.75, lastmod };
  }
}

const yieldToLoop = () => new Promise<void>((r) => setImmediate(r));

async function consume(label: string, gen: Generator<Url>) {
  let count = 0;
  let batch = 0;
  for (const u of gen) {
    add(u);
    count++;
    if (++batch >= BATCH_SIZE) {
      batch = 0;
      await yieldToLoop();
    }
  }
  console.log(`  • ${label}: ${count}`);
}

await consume("static", staticUrls());
await consume("services", serviceUrls());
await consume("cities", cityUrls());
await consume("service×city matrix", matrixUrls());
await consume("neighborhoods", neighborhoodUrls());
await consume("blog", blogUrls());

// Dedupe by loc (last write wins for lastmod) — defends against satellite/blog
// slug overlaps and any future generator collisions.
{
  const before = urls.length;
  const map = new Map<string, Url>();
  for (const u of urls) map.set(u.loc, u);
  urls.length = 0;
  for (const u of map.values()) urls.push(u);
  if (urls.length !== before) console.log(`  • dedupe: removed ${before - urls.length} duplicate URLs`);
}

// Sitemaps protocol limits each file to 50 000 URLs / 50 MB. We stay well
// under that. When the project grows beyond MAX_PER_FILE we automatically
// emit a sitemap index + N child files; otherwise we keep a single file.
const MAX_PER_FILE = 45_000;

function buildUrlsetXml(slice: Url[]): string {
  const head = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  const tail = `</urlset>\n`;
  const parts: string[] = [head];
  for (let i = 0; i < slice.length; i += BATCH_SIZE) {
    const chunk = slice.slice(i, i + BATCH_SIZE);
    parts.push(
      chunk
        .map(
          (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ""}${u.priority ? `\n    <priority>${u.priority.toFixed(2)}</priority>` : ""}
  </url>`,
        )
        .join("\n") + "\n",
    );
  }
  parts.push(tail);
  return parts.join("");
}

if (urls.length <= MAX_PER_FILE) {
  writeFileSync("public/sitemap.xml", buildUrlsetXml(urls));
  console.log(`✓ sitemap.xml written with ${urls.length} URLs`);
} else {
  // Split into shards + index file.
  const shards: { name: string; lastmod: string }[] = [];
  for (let i = 0, n = 0; i < urls.length; i += MAX_PER_FILE, n++) {
    const slice = urls.slice(i, i + MAX_PER_FILE);
    const name = `sitemap-${String(n + 1).padStart(2, "0")}.xml`;
    writeFileSync(`public/${name}`, buildUrlsetXml(slice));
    const lastmod = slice
      .map((u) => u.lastmod ?? today)
      .sort()
      .at(-1)!;
    shards.push({ name, lastmod });
    await yieldToLoop();
  }
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${shards
  .map(
    (s) => `  <sitemap>
    <loc>${BASE}/${s.name}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>
`;
  writeFileSync("public/sitemap.xml", indexXml);
  console.log(`✓ sitemap index written with ${shards.length} shards (${urls.length} URLs)`);
}
