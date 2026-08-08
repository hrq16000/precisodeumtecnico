// Build-time Atom feed generator. Run with: bun scripts/build-atom.ts
//
// Emite public/atom.xml com os posts mais recentes do blog.
//
// Regra de confiabilidade do <updated>:
//   - Cada <entry> usa a data real de revisão do post (post.updatedAt) ou,
//     na ausência dela, a data de publicação. Nunca a data do build.
//   - O <updated> do feed é o MAIOR <updated> entre as entries emitidas —
//     não a hora em que o script rodou. Feed que muda de data a cada deploy
//     sem mudança de conteúdo perde confiabilidade junto aos leitores.
//   - Datas futuras são cortadas para hoje (mesma política do sitemap).

import { writeFileSync } from "node:fs";
import { allBlogPosts as blogPosts } from "../src/data/blog";

const BASE = "https://precisodeumtecnico.com";
const FEED_URL = `${BASE}/atom.xml`;
const MAX_ENTRIES = 50;

const today = new Date().toISOString().split("T")[0];
const clamp = (d: string) => (d > today ? today : d);

/** Normaliza YYYY-MM-DD para RFC 3339 (exigido pelo Atom). */
const rfc3339 = (date: string) => `${clamp(date.split("T")[0])}T12:00:00-03:00`;

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const entries = [...blogPosts]
  .map((p) => ({
    post: p,
    published: clamp(p.publishedAt.split("T")[0]),
    updated: clamp((p.updatedAt ?? p.publishedAt).split("T")[0]),
  }))
  // Ordena pela revisão mais recente: o feed reflete o que mudou de fato.
  .sort((a, b) => (a.updated < b.updated ? 1 : a.updated > b.updated ? -1 : 0))
  .slice(0, MAX_ENTRIES);

if (entries.length === 0) {
  console.error("[atom] nenhum post encontrado — feed não gerado");
  process.exit(1);
}

// <updated> do feed = maior data de revisão real entre as entries.
const feedUpdated = entries.reduce((max, e) => (e.updated > max ? e.updated : max), entries[0].updated);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="pt-BR">
  <title>Blog — Preciso de Um Técnico</title>
  <subtitle>Guias de manutenção, diagnóstico e suporte técnico em Curitiba e região.</subtitle>
  <id>${FEED_URL}</id>
  <link rel="self" type="application/atom+xml" href="${FEED_URL}"/>
  <link rel="alternate" type="text/html" href="${BASE}/blog"/>
  <updated>${rfc3339(feedUpdated)}</updated>
  <author><name>Preciso de Um Técnico</name></author>
${entries
  .map(({ post, published, updated }) => {
    const url = `${BASE}/blog/${post.slug}`;
    return `  <entry>
    <title>${esc(post.title)}</title>
    <id>${url}</id>
    <link rel="alternate" type="text/html" href="${url}"/>
    <published>${rfc3339(published)}</published>
    <updated>${rfc3339(updated)}</updated>
    <summary type="text">${esc(post.excerpt)}</summary>
${post.tags.map((t) => `    <category term="${esc(t)}"/>`).join("\n")}
  </entry>`;
  })
  .join("\n")}
</feed>
`;

writeFileSync("public/atom.xml", xml, "utf8");
console.log(`[atom] public/atom.xml — ${entries.length} entries, feed updated=${feedUpdated}`);
