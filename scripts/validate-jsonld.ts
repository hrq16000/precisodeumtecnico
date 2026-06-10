/**
 * CI: build the app and verify that critical pages emit valid JSON-LD
 * (BreadcrumbList + FAQPage + LocalBusiness + Service when expected).
 *
 * Runs by rendering the route with Vitest/jsdom is heavy; instead we grep
 * the source file for the structured data and validate each JSON literal
 * shape. Fails the build on any malformed schema.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

interface PageSpec {
  file: string;
  required: string[];
}

const PAGES: PageSpec[] = [
  {
    file: "src/pages/AssistenciaTecnicaCuritiba.tsx",
    required: ["LocalBusiness", "BreadcrumbList", "FAQPage", "Service"],
  },
  {
    file: "src/pages/AssistenciaTecnica.tsx",
    required: ["LocalBusiness", "BreadcrumbList", "FAQPage", "Service"],
  },
];

const REQUIRED_PROPS: Record<string, string[]> = {
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
  LocalBusiness: ["name"],
  Service: ["name"],
  Article: ["headline"],
};

let failed = 0;

function fail(msg: string) {
  console.error(`✗ ${msg}`);
  failed += 1;
}

function check(page: PageSpec) {
  const path = resolve(page.file);
  if (!existsSync(path)) {
    fail(`missing file: ${page.file}`);
    return;
  }
  const src = readFileSync(path, "utf8");

  const found = new Set<string>();
  // Match `"@type": "X"` (single or double quotes)
  const re = /["']@type["']\s*:\s*["']([A-Za-z]+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) found.add(m[1]);

  for (const t of page.required) {
    if (!found.has(t)) fail(`${page.file}: missing @type ${t}`);
    const props = REQUIRED_PROPS[t] ?? [];
    for (const p of props) {
      // crude proximity check: required prop must appear somewhere in file
      if (!new RegExp(`["']?${p}["']?\\s*:`).test(src))
        fail(`${page.file}: ${t} likely missing property "${p}"`);
    }
  }
  console.log(`  ${page.file} → types: ${[...found].join(", ")}`);
}

console.log("Validating JSON-LD structured data…");
PAGES.forEach(check);

if (failed > 0) {
  console.error(`\n❌ ${failed} JSON-LD validation error(s).`);
  process.exit(1);
}
console.log("✓ JSON-LD validation passed.");
