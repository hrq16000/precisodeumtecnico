// Validates public/sitemap.xml + public/robots.txt after the sitemap build.
// Fails the CI step (non-zero exit) on:
//  - missing files
//  - invalid XML structure
//  - duplicated <loc> entries
//  - non-https URLs
//  - robots.txt without an absolute Sitemap: line
//  - robots.txt that disallows known indexable sections (services / regioes / blog)
//
// Run with:  bun scripts/validate-sitemap.ts

import { readFileSync, existsSync } from "node:fs";

const sitemapPath = "public/sitemap.xml";
const robotsPath = "public/robots.txt";
const errors: string[] = [];

if (!existsSync(sitemapPath)) errors.push(`Missing ${sitemapPath}`);
if (!existsSync(robotsPath)) errors.push(`Missing ${robotsPath}`);

if (errors.length === 0) {
  const xml = readFileSync(sitemapPath, "utf8");
  if (!/<urlset|<sitemapindex/.test(xml)) errors.push("sitemap.xml: invalid root element");

  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
  if (locs.length === 0) errors.push("sitemap.xml: no <loc> entries");

  const seen = new Set<string>();
  for (const u of locs) {
    if (!/^https:\/\//i.test(u)) errors.push(`sitemap.xml: non-https URL ${u}`);
    if (seen.has(u)) errors.push(`sitemap.xml: duplicated URL ${u}`);
    seen.add(u);
  }

  const robots = readFileSync(robotsPath, "utf8");
  const sm = robots.match(/Sitemap:\s*(\S+)/i);
  if (!sm) errors.push("robots.txt: missing Sitemap line");
  else if (!/^https:\/\//i.test(sm[1])) errors.push("robots.txt: Sitemap URL not absolute https");

  // Make sure indexable areas aren't accidentally disallowed.
  const blocked = ["/servicos", "/regioes", "/blog", "/precos"];
  const lines = robots.split("\n");
  let inGlobal = false;
  for (const raw of lines) {
    const l = raw.trim();
    if (/^User-agent:\s*\*/i.test(l)) inGlobal = true;
    else if (/^User-agent:/i.test(l)) inGlobal = false;
    if (inGlobal) {
      const dis = l.match(/^Disallow:\s*(\S+)/i);
      if (dis && blocked.some((b) => dis[1] === b || dis[1].startsWith(b + "/"))) {
        errors.push(`robots.txt: indexable path "${dis[1]}" is Disallowed under User-agent: *`);
      }
    }
  }

  console.log(`✓ sitemap.xml: ${locs.length} URLs (${seen.size} unique)`);
}

if (errors.length) {
  console.error("✗ Sitemap/robots validation failed:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("✓ robots.txt OK");
