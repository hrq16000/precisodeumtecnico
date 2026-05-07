// Ping IndexNow / submit sitemap to Bing & Google.
// Run after deploys: `bun scripts/ping-sitemap.ts`
//
// Note: Google deprecated the /ping endpoint for sitemaps in mid-2023, but it
// still tolerates the call. The reliable path is Search Console verification
// (a one-time setup) plus this best-effort ping for Bing.

const SITEMAP = "https://precisodeumtecnico.com/sitemap.xml";

const targets = [
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
  // Best-effort, may 404 on Google but does not hurt:
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`,
];

for (const url of targets) {
  try {
    const res = await fetch(url);
    console.log(res.status, url);
  } catch (e) {
    console.error("Ping failed", url, e);
  }
}

console.log(
  "\nNext step: verify the property at https://search.google.com/search-console and " +
    "submit the sitemap URL there. The Search Console submission is the canonical method.",
);
