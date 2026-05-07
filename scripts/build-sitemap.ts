// Build-time sitemap generator. Run with: bun scripts/build-sitemap.ts
// Produces public/sitemap.xml with all routes (services, cities, blog,
// service×city matrix, neighborhood pages) plus accurate lastmod dates.

import { writeFileSync } from "node:fs";
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

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

interface Url {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

const urls: Url[] = [];
const add = (u: Url) => urls.push(u);

// Static pages
add({ loc: `${BASE}/`, changefreq: "daily", priority: 1.0, lastmod: today });
add({ loc: `${BASE}/servicos`, changefreq: "weekly", priority: 0.9, lastmod: today });
add({ loc: `${BASE}/regioes`, changefreq: "weekly", priority: 0.9, lastmod: today });
add({ loc: `${BASE}/sobre`, changefreq: "monthly", priority: 0.6, lastmod: today });
add({ loc: `${BASE}/contato`, changefreq: "monthly", priority: 0.7, lastmod: today });
add({ loc: `${BASE}/termos-orcamento-pre-aprovado`, changefreq: "yearly", priority: 0.5, lastmod: today });
add({ loc: `${BASE}/blog`, changefreq: "weekly", priority: 0.9, lastmod: today });

// Services
for (const slug of Object.keys(servicesData)) {
  add({ loc: `${BASE}/servicos/${slug}`, changefreq: "weekly", priority: 0.85, lastmod: today });
}

// Cities
for (const slug of Object.keys(citiesData)) {
  add({ loc: `${BASE}/regioes/${slug}`, changefreq: "weekly", priority: 0.85, lastmod: today });
}

// Service × City matrix
for (const cityKey of Object.keys(citiesData)) {
  for (const serviceKey of Object.keys(servicesData)) {
    add({ loc: `${BASE}/servico-em/${cityKey}/${serviceKey}`, changefreq: "weekly", priority: 0.7, lastmod: today });
  }
}

// Neighborhood pages (Curitiba + main metro)
const cityBairros: Record<string, string[]> = {
  curitiba: curitibaBairros,
  "sao-jose-dos-pinhais": sjpBairros,
  pinhais: pinhaiBairros,
  colombo: colomboBairros,
  araucaria: araucariaBairros,
};
for (const [city, bairros] of Object.entries(cityBairros)) {
  for (const b of bairros) {
    add({ loc: `${BASE}/regioes/${city}/${slugify(b)}`, changefreq: "monthly", priority: 0.6, lastmod: today });
  }
}

// Blog
for (const cat of blogCategories) {
  add({ loc: `${BASE}/blog/categoria/${cat.slug}`, changefreq: "weekly", priority: 0.7, lastmod: today });
}
for (const post of blogPosts) {
  add({
    loc: `${BASE}/blog/${post.slug}`,
    changefreq: "monthly",
    priority: 0.75,
    lastmod: post.updatedAt ?? post.publishedAt,
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ""}${u.priority ? `\n    <priority>${u.priority.toFixed(2)}</priority>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`✓ sitemap.xml written with ${urls.length} URLs`);
