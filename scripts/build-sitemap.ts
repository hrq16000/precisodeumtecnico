// Build-time sitemap generator. Run with: bun scripts/build-sitemap.ts
//
// Emite um sitemap-index em public/sitemap.xml apontando para shards:
//   - public/sitemap-main.xml           (estáticas + serviços + blog + nacional)
//   - public/sitemap-city-{city}.xml    (rota da cidade + service×city)
//   - public/sitemap-bairros-{city}.xml (bairros da cidade)
//
// Cada URL tem canonical == loc (URL absoluta https no domínio oficial).
// Todos os shards são deduplicados globalmente antes de escrever.

import { writeFileSync, statSync, existsSync, readdirSync, unlinkSync } from "node:fs";
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
import { nationalCities } from "../src/data/nationalCities";
import { enumeratePilotCombinations, NATIONAL_MATRIX_MAX } from "../src/data/nationalServiceCoverage";


const BASE = "https://precisodeumtecnico.com";
const today = new Date().toISOString().split("T")[0];

// Clamp any candidate lastmod (YYYY-MM-DD) so we never emit a date in the
// future — sitemaps with future <lastmod> are treated as invalid by crawlers
// and the guard `check-sitemap-dates.ts` fails the build.
const clampLastmod = (d: string): string => (d > today ? today : d);

const fileDate = (path: string): string => {
  try {
    if (!existsSync(path)) return today;
    return clampLastmod(statSync(path).mtime.toISOString().split("T")[0]);
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
const natMtime = fileDate("src/data/nationalCities.ts");

interface Url {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

const cityBairros: Record<string, string[]> = {
  curitiba: curitibaBairros,
  "sao-jose-dos-pinhais": sjpBairros,
  pinhais: pinhaiBairros,
  colombo: colomboBairros,
  araucaria: araucariaBairros,
};

// ---- Shards ----
const mainUrls: Url[] = [
  { loc: `${BASE}/`, changefreq: "daily", priority: 1.0, lastmod: indexMtime },
  { loc: `${BASE}/servicos`, changefreq: "weekly", priority: 0.9, lastmod: servicesMtime },
  { loc: `${BASE}/regioes`, changefreq: "weekly", priority: 0.9, lastmod: regionsMtime },
  { loc: `${BASE}/sobre`, changefreq: "monthly", priority: 0.6, lastmod: fileDate("src/pages/Sobre.tsx") },
  { loc: `${BASE}/contato`, changefreq: "monthly", priority: 0.7, lastmod: fileDate("src/pages/Contato.tsx") },
  { loc: `${BASE}/termos-orcamento-pre-aprovado`, changefreq: "yearly", priority: 0.5, lastmod: fileDate("src/pages/TermosOrcamento.tsx") },
  { loc: `${BASE}/blog`, changefreq: "weekly", priority: 0.9, lastmod: blogMtime },
  { loc: `${BASE}/precos`, changefreq: "weekly", priority: 0.85, lastmod: precosMtime },
  { loc: `${BASE}/assistencia-tecnica-curitiba`, changefreq: "weekly", priority: 0.95, lastmod: fileDate("src/pages/AssistenciaTecnicaCuritiba.tsx") },
  { loc: `${BASE}/assistencia-tecnica`, changefreq: "weekly", priority: 0.95, lastmod: fileDate("src/pages/AssistenciaTecnica.tsx") },
  { loc: `${BASE}/atendimento-nacional`, changefreq: "weekly", priority: 0.9, lastmod: fileDate("src/pages/AtendimentoNacional.tsx") },
  { loc: `${BASE}/faq`, changefreq: "monthly", priority: 0.6, lastmod: fileDate("src/pages/Faq.tsx") },
  { loc: `${BASE}/dados-da-empresa`, changefreq: "yearly", priority: 0.4, lastmod: fileDate("src/pages/DadosEmpresa.tsx") },
  { loc: `${BASE}/servicos/troca-de-tela-tv-curitiba`, changefreq: "weekly", priority: 0.85, lastmod: fileDate("src/pages/TrocaDeTelaTVCuritiba.tsx") },
  { loc: `${BASE}/servicos/reparo-smart-tv-curitiba`, changefreq: "weekly", priority: 0.85, lastmod: fileDate("src/pages/ReparoSmartTVCuritiba.tsx") },
  { loc: `${BASE}/servicos/configuracao-wifi-curitiba`, changefreq: "weekly", priority: 0.85, lastmod: fileDate("src/pages/ConfiguracaoWifiCuritiba.tsx") },
];

// Bairros dedicados por serviço em Curitiba (Wi-Fi + Smart TV)
import { BAIRROS_CURITIBA_SERVICO } from "../src/data/bairrosCuritibaServico";
const bairroServicoMtime = fileDate("src/data/bairrosCuritibaServico.ts");
for (const b of BAIRROS_CURITIBA_SERVICO) {
  mainUrls.push({ loc: `${BASE}/servicos/reparo-smart-tv/curitiba/${b.slug}`, changefreq: "weekly", priority: 0.75, lastmod: bairroServicoMtime });
  mainUrls.push({ loc: `${BASE}/servicos/configuracao-wifi/curitiba/${b.slug}`, changefreq: "weekly", priority: 0.75, lastmod: bairroServicoMtime });
}

for (const slug of Object.keys(servicesData))
  mainUrls.push({ loc: `${BASE}/servicos/${slug}`, changefreq: "weekly", priority: 0.85, lastmod: servicesMtime });

for (const cat of blogCategories)
  mainUrls.push({ loc: `${BASE}/blog/categoria/${cat.slug}`, changefreq: "weekly", priority: 0.7, lastmod: blogMtime });

for (const post of blogPosts) {
  const postDate = post.updatedAt ?? post.publishedAt;
  const fileBased = post.slug.includes("-em-") ? satMtime : blogMtime;
  const lastmod = clampLastmod(postDate > fileBased ? postDate : fileBased);
  mainUrls.push({ loc: `${BASE}/blog/${post.slug}`, changefreq: "monthly", priority: 0.75, lastmod });
}

for (const c of nationalCities)
  mainUrls.push({ loc: `${BASE}/atendimento-nacional/${c.slug}`, changefreq: "weekly", priority: 0.8, lastmod: natMtime });

// Por-cidade (rota + service×city)
const cityShards: { city: string; urls: Url[] }[] = [];
const matrixLastmod = servicesMtime > regionsMtime ? servicesMtime : regionsMtime;
for (const cityKey of Object.keys(citiesData)) {
  const urls: Url[] = [
    { loc: `${BASE}/regioes/${cityKey}`, changefreq: "weekly", priority: 0.85, lastmod: regionsMtime },
  ];
  for (const serviceKey of Object.keys(servicesData))
    urls.push({ loc: `${BASE}/servico-em/${cityKey}/${serviceKey}`, changefreq: "weekly", priority: 0.7, lastmod: matrixLastmod });
  cityShards.push({ city: cityKey, urls });
}

// Por-bairros
const bairroShards: { city: string; urls: Url[] }[] = [];
for (const [city, bairros] of Object.entries(cityBairros)) {
  const urls: Url[] = bairros.map((b) => ({
    loc: `${BASE}/regioes/${city}/${slugify(b)}`,
    changefreq: "monthly",
    priority: 0.6,
    lastmod: regionsMtime,
  }));
  bairroShards.push({ city, urls });
}

// ---- Dedupe global ----
const seenGlobal = new Set<string>();
const dedupe = (urls: Url[]): Url[] => {
  const out: Url[] = [];
  for (const u of urls) {
    if (seenGlobal.has(u.loc)) continue;
    seenGlobal.add(u.loc);
    out.push(u);
  }
  return out;
};

const mainDeduped = dedupe(mainUrls);
const cityDeduped = cityShards.map((s) => ({ city: s.city, urls: dedupe(s.urls) }));
const bairroDeduped = bairroShards.map((s) => ({ city: s.city, urls: dedupe(s.urls) }));

// ---- XML ----
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const urlXml = (u: Url) =>
  `  <url>
    <loc>${escape(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ""}${u.priority ? `\n    <priority>${u.priority.toFixed(2)}</priority>` : ""}
    <xhtml:link rel="canonical" href="${escape(u.loc)}"/>
  </url>`;

const buildUrlset = (urls: Url[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(urlXml).join("\n")}
</urlset>
`;

const shardLastmod = (urls: Url[]) =>
  clampLastmod(urls.map((u) => u.lastmod ?? today).sort().at(-1) ?? today);

// Limpa shards antigos (inclui shard piloto nacional serviços)
for (const f of readdirSync("public")) {
  if (/^sitemap-(main|city-|bairros-|nacional-servicos-piloto).*\.xml$/.test(f)) {
    try { unlinkSync(`public/${f}`); } catch {}
  }
}

// Shard piloto — matriz nacional serviço × cidade × bairro (Rodada 24.1).
const matrixCombos = enumeratePilotCombinations();
const matrixMtime = fileDate("src/data/nationalServiceCoverage.ts");
const matrixUrls: Url[] = matrixCombos.slice(0, NATIONAL_MATRIX_MAX).map((c) => ({
  loc: c.url,
  lastmod: matrixMtime,
  changefreq: "weekly",
  priority: 0.65,
}));
const matrixDeduped = dedupe(matrixUrls);


const shardIndex: { name: string; lastmod: string }[] = [];

writeFileSync("public/sitemap-main.xml", buildUrlset(mainDeduped));
shardIndex.push({ name: "sitemap-main.xml", lastmod: shardLastmod(mainDeduped) });

for (const s of cityDeduped) {
  if (s.urls.length === 0) continue;
  const name = `sitemap-city-${s.city}.xml`;
  writeFileSync(`public/${name}`, buildUrlset(s.urls));
  shardIndex.push({ name, lastmod: shardLastmod(s.urls) });
}

for (const s of bairroDeduped) {
  if (s.urls.length === 0) continue;
  const name = `sitemap-bairros-${s.city}.xml`;
  writeFileSync(`public/${name}`, buildUrlset(s.urls));
  shardIndex.push({ name, lastmod: shardLastmod(s.urls) });
}

// Shard piloto — matriz nacional serviços.
if (matrixDeduped.length > 0) {
  const name = "sitemap-nacional-servicos-piloto.xml";
  writeFileSync(`public/${name}`, buildUrlset(matrixDeduped));
  shardIndex.push({ name, lastmod: shardLastmod(matrixDeduped) });
}


const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${shardIndex
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

const total = mainDeduped.length + cityDeduped.reduce((a, s) => a + s.urls.length, 0) + bairroDeduped.reduce((a, s) => a + s.urls.length, 0) + matrixDeduped.length;
console.log(`✓ sitemap-index escrito com ${shardIndex.length} shards, ${total} URLs únicas`);
for (const s of shardIndex) console.log(`  • ${s.name}`);
