// Verifies public/og/manifest.json integrity: hashes of generator scripts,
// declared outputs exist, dimensions/bytes/sha256 match, no drift, no
// unexpected files in the managed set.  Read-only.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MANIFEST_PATH = "public/og/manifest.json";
const EXPECTED_MANIFEST_VERSION = 1;
const EXPECTED_COMMERCIAL_VALUE = "R$ 99,99";
const EXPECTED_SCRIPTS = [
  "scripts/build-city-images.py",
  "scripts/build-city-responsive.py",
  "scripts/build-og-images.py",
];
const DIRS = ["public/og", "public/og/cidade", "public/hero/cidade"];
const EXTRA_FILES = ["public/og-image.jpg"];
const OUTPUT_EXTS = new Set([".jpg", ".jpeg", ".webp", ".png"]);
const EXCLUDE_BASENAMES = new Set(["manifest.json"]);

const errors: string[] = [];
function fail(msg: string) { errors.push(msg); }

if (!existsSync(join(ROOT, MANIFEST_PATH))) {
  console.error(`✗ manifest missing: ${MANIFEST_PATH} (run: bun scripts/build-og-manifest.ts)`);
  process.exit(1);
}

let manifest: any;
try {
  manifest = JSON.parse(readFileSync(join(ROOT, MANIFEST_PATH), "utf8"));
} catch (e) {
  console.error(`✗ manifest invalid JSON: ${(e as Error).message}`);
  process.exit(1);
}

if (manifest.manifestVersion !== EXPECTED_MANIFEST_VERSION)
  fail(`manifestVersion mismatch: got ${manifest.manifestVersion}`);
if (manifest.commercialValue !== EXPECTED_COMMERCIAL_VALUE)
  fail(`commercialValue must be "${EXPECTED_COMMERCIAL_VALUE}", got "${manifest.commercialValue}"`);
if (typeof manifest.templateVersion !== "string" || !manifest.templateVersion)
  fail(`templateVersion missing`);

function sha256(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

// Scripts
const scriptsByPath = new Map<string, any>((manifest.generatorScripts ?? []).map((s: any) => [s.path, s]));
for (const p of EXPECTED_SCRIPTS) {
  const entry = scriptsByPath.get(p);
  if (!entry) { fail(`script missing from manifest: ${p}`); continue; }
  if (!existsSync(join(ROOT, p))) { fail(`script file missing: ${p}`); continue; }
  const actual = sha256(readFileSync(join(ROOT, p)));
  if (actual !== entry.sha256)
    fail(`script sha256 drift: ${p}\n  manifest: ${entry.sha256}\n  actual:   ${actual}`);
}
for (const s of manifest.generatorScripts ?? []) {
  if (!EXPECTED_SCRIPTS.includes(s.path)) fail(`unexpected script in manifest: ${s.path}`);
}

// Outputs
const declared = new Map<string, any>((manifest.outputs ?? []).map((o: any) => [o.path, o]));
const seenPaths = new Set<string>();
for (const [path, o] of declared) {
  if (seenPaths.has(path)) fail(`duplicate output in manifest: ${path}`);
  seenPaths.add(path);
  if (path.includes("..") || path.startsWith("/"))
    fail(`unsafe path: ${path}`);
  if (!existsSync(join(ROOT, path))) { fail(`declared output missing on disk: ${path}`); continue; }
  const buf = readFileSync(join(ROOT, path));
  if (buf.length !== o.bytes)
    fail(`bytes mismatch ${path}: manifest=${o.bytes} actual=${buf.length}`);
  const actualHash = sha256(buf);
  if (actualHash !== o.sha256)
    fail(`sha256 mismatch ${path}`);
  const ext = "." + path.split(".").pop()!.toLowerCase();
  const declaredFormat = String(o.format).toLowerCase();
  const extToFormat: Record<string, string> = { ".jpg": "jpeg", ".jpeg": "jpeg", ".webp": "webp", ".png": "png" };
  if (extToFormat[ext] !== declaredFormat)
    fail(`format/extension mismatch ${path}: ext=${ext} format=${declaredFormat}`);
}

// Detect files on disk not declared
const onDisk = new Set<string>();
for (const dir of DIRS) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) continue;
  for (const name of readdirSync(abs)) {
    if (EXCLUDE_BASENAMES.has(name)) continue;
    const rel = `${dir}/${name}`;
    const st = statSync(join(ROOT, rel));
    if (!st.isFile()) continue;
    const ext = "." + name.split(".").pop()!.toLowerCase();
    if (!OUTPUT_EXTS.has(ext)) continue;
    onDisk.add(rel);
  }
}
for (const f of EXTRA_FILES) if (existsSync(join(ROOT, f))) onDisk.add(f);

for (const f of onDisk) if (!declared.has(f)) fail(`file on disk not in manifest: ${f}`);

if (errors.length) {
  console.error(`✗ OG manifest guard failed with ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ OG manifest OK — ${EXPECTED_SCRIPTS.length} scripts, ${declared.size} outputs verified.`);
