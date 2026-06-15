// Generates static HTML files per national city with full OG/Twitter meta tags,
// so crawlers (Facebook, LinkedIn, X) that don't execute JS see the correct
// per-city og:image without depending on SSR.
//
// Output: public/og-preview/cidade/<slug>.html
// Each file <meta http-equiv="refresh"> redirects humans to the real SPA route
// after 0s, while crawlers stop at the head and read the meta tags.
//
// Run: bun scripts/build-og-preview.ts

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { nationalCities } from "../src/data/nationalCities";

const BASE = "https://precisodeumtecnico.com";
const OUT_DIR = "public/og-preview/cidade";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
for (const city of nationalCities) {
  const canonical = `${BASE}/atendimento-nacional/${city.slug}`;
  const preview = `${BASE}/og-preview/cidade/${city.slug}.html`;
  const ogImage = `${BASE}/og/cidade/${city.slug}.jpg`;
  const ogImageWebp = `${BASE}/og/cidade/${city.slug}.webp`;
  const title = `Assistência Técnica em ${city.name} – ${city.state} | Preciso de um Técnico`;
  const description = `Atendimento técnico em ${city.name}/${city.state} via nossa rede de prestadores parceiros. Suporte residencial e empresarial a partir de R$ 99,90.`;

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="noindex, follow" />
<link rel="canonical" href="${canonical}" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Preciso de um Técnico" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:url" content="${canonical}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:image:secure_url" content="${ogImage}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Assistência técnica em ${esc(city.name)} - ${esc(city.state)}" />
<meta property="og:image" content="${ogImageWebp}" />
<meta property="og:image:type" content="image/webp" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${ogImage}" />
<meta name="twitter:image:alt" content="Assistência técnica em ${esc(city.name)}" />

<meta http-equiv="refresh" content="0; url=${canonical}" />
</head>
<body>
<h1>${esc(title)}</h1>
<p>${esc(description)}</p>
<p><a href="${canonical}">Continuar para a página</a></p>
<img src="${ogImage}" alt="Assistência técnica em ${esc(city.name)}" width="1200" height="630" />
</body>
</html>
`;

  writeFileSync(`${OUT_DIR}/${city.slug}.html`, html, "utf8");
  written++;
}

// Index listing every preview link (handy for QA)
const index = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>OG Preview Index</title></head>
<body><h1>OG Preview — ${written} cidades</h1><ul>
${nationalCities
  .map(
    (c) =>
      `<li><a href="/og-preview/cidade/${c.slug}.html">${esc(c.name)}/${esc(c.state)}</a> — <a href="https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(
        `${BASE}/og-preview/cidade/${c.slug}.html`,
      )}">FB Debugger</a> · <a href="https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(
        `${BASE}/og-preview/cidade/${c.slug}.html`,
      )}">LinkedIn Inspector</a></li>`,
  )
  .join("\n")}
</ul></body></html>`;
writeFileSync("public/og-preview/index.html", index, "utf8");

console.log(`✓ Wrote ${written} OG preview pages + index to public/og-preview/`);

if (!existsSync(OUT_DIR)) process.exit(1);
