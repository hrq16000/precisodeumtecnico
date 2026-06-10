/**
 * CI: ensure every <img> rendered on /assistencia-tecnica-curitiba (after
 * Vite preview server is up) carries non-empty SEO alt text and resolves to
 * HTTP 200. If the page renders no <img> tags (icon-only build), the script
 * passes with a notice — it doesn't fabricate failures.
 *
 * Requires Vite preview server running on PORT (default 4173).
 */
const BASE = process.env.PAGE_BASE_URL ?? `http://localhost:${process.env.PORT ?? 4173}`;
const ROUTE = "/assistencia-tecnica-curitiba";

async function main() {
  const html = await fetch(`${BASE}${ROUTE}`).then((r) => r.text());

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  if (imgs.length === 0) {
    console.log(`ℹ️  No <img> on ${ROUTE} (icon-only). Skipping image audit.`);
    return;
  }

  let failed = 0;
  for (const tag of imgs) {
    const src = /\bsrc=["']([^"']+)["']/i.exec(tag)?.[1];
    const alt = /\balt=["']([^"']*)["']/i.exec(tag)?.[1];

    if (!alt || alt.trim().length < 5) {
      console.error(`✗ missing or too-short alt text: ${tag}`);
      failed += 1;
    }
    if (!src) {
      console.error(`✗ missing src: ${tag}`);
      failed += 1;
      continue;
    }
    const url = src.startsWith("http") ? src : `${BASE}${src.startsWith("/") ? src : "/" + src}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) {
        console.error(`✗ ${res.status} ${url}`);
        failed += 1;
      } else {
        console.log(`✓ ${url} (alt: "${alt}")`);
      }
    } catch (e) {
      console.error(`✗ fetch error ${url}: ${(e as Error).message}`);
      failed += 1;
    }
  }

  if (failed > 0) {
    console.error(`\n❌ ${failed} image issue(s) on ${ROUTE}`);
    process.exit(1);
  }
  console.log(`\n✓ all ${imgs.length} images on ${ROUTE} OK`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
