// Automated OG validation checker.
//
// For each national city:
//  - Calls Facebook Graph API "?scrape=true" (requires FB_ACCESS_TOKEN env)
//    which is exactly what the Sharing Debugger does behind the scenes.
//  - Probes LinkedIn Post Inspector (no public API; we record the inspector URL
//    plus a HEAD probe to confirm the page is reachable).
//  - Falls back to a local HEAD check on the og:image to ensure 200 OK.
//
// Output: public/og-validation.json + a copy at /mnt/documents/og-validation.json
//
// Run: bun scripts/check-og-validators.ts
//   Optional env:
//     FB_ACCESS_TOKEN  - Facebook app|user access token for /v19.0/?scrape=true
//     OG_BASE_URL      - defaults to https://precisodeumtecnico.com
//     OG_CONCURRENCY   - default 6

import { writeFileSync, mkdirSync } from "node:fs";
import { nationalCities } from "../src/data/nationalCities";

const BASE = process.env.OG_BASE_URL || "https://precisodeumtecnico.com";
const FB_TOKEN = process.env.FB_ACCESS_TOKEN;
const CONCURRENCY = Number(process.env.OG_CONCURRENCY || 6);

type Result = {
  slug: string;
  city: string;
  url: string;
  ogImage: string;
  imageStatus: number | "error";
  facebook: { ok: boolean; status?: number; scraped?: unknown; error?: string; skipped?: boolean };
  linkedin: { inspectorUrl: string; pageStatus: number | "error" };
  checkedAt: string;
};

async function head(url: string): Promise<number | "error"> {
  try {
    const r = await fetch(url, { method: "HEAD" });
    return r.status;
  } catch {
    return "error";
  }
}

async function fbScrape(url: string) {
  if (!FB_TOKEN) return { ok: false, skipped: true, error: "FB_ACCESS_TOKEN not set" };
  const api = `https://graph.facebook.com/v19.0/?id=${encodeURIComponent(url)}&scrape=true&access_token=${encodeURIComponent(FB_TOKEN)}`;
  try {
    const r = await fetch(api, { method: "POST" });
    const body = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, scraped: body };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

async function check(city: (typeof nationalCities)[number]): Promise<Result> {
  const previewUrl = `${BASE}/og-preview/cidade/${city.slug}.html`;
  const ogImage = `${BASE}/og/cidade/${city.slug}.jpg`;
  const [imageStatus, facebook, linkedinStatus] = await Promise.all([
    head(ogImage),
    fbScrape(previewUrl),
    head(previewUrl),
  ]);
  return {
    slug: city.slug,
    city: `${city.name}/${city.state}`,
    url: previewUrl,
    ogImage,
    imageStatus,
    facebook,
    linkedin: {
      inspectorUrl: `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(previewUrl)}`,
      pageStatus: linkedinStatus,
    },
    checkedAt: new Date().toISOString(),
  };
}

async function runLimited<T, R>(items: T[], limit: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

const results = await runLimited(nationalCities, CONCURRENCY, check);

const summary = {
  base: BASE,
  generatedAt: new Date().toISOString(),
  total: results.length,
  imageOk: results.filter((r) => r.imageStatus === 200).length,
  facebookOk: results.filter((r) => r.facebook.ok).length,
  facebookSkipped: results.filter((r) => r.facebook.skipped).length,
  linkedinReachable: results.filter((r) => r.linkedin.pageStatus === 200).length,
  results,
};

mkdirSync("public", { recursive: true });
writeFileSync("public/og-validation.json", JSON.stringify(summary, null, 2));
try {
  mkdirSync("/mnt/documents", { recursive: true });
  writeFileSync("/mnt/documents/og-validation.json", JSON.stringify(summary, null, 2));
} catch {
  /* documents mount optional */
}

console.log(
  `✓ Validated ${summary.total} cities — images OK: ${summary.imageOk}, FB OK: ${summary.facebookOk}${
    summary.facebookSkipped ? ` (${summary.facebookSkipped} skipped, no FB_ACCESS_TOKEN)` : ""
  }, LinkedIn pages reachable: ${summary.linkedinReachable}`,
);

const broken = results.filter(
  (r) => r.imageStatus !== 200 || (!r.facebook.skipped && !r.facebook.ok) || r.linkedin.pageStatus !== 200,
);
if (broken.length) {
  console.error(`✗ ${broken.length} cities with issues:`);
  for (const b of broken) console.error(`  - ${b.slug}: img=${b.imageStatus} fb=${b.facebook.ok} li=${b.linkedin.pageStatus}`);
  process.exit(1);
}
