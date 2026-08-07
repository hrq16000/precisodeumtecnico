/**
 * Gate de CI — licenças e créditos das fotos públicas.
 *
 * Falha o build (exit 1) quando:
 *   1. Alguma foto de PUBLIC_PHOTOS não tem autor, licença ou link da fonte.
 *   2. Licença CC BY / CC BY-SA sem licenseUrl (a atribuição vira inválida).
 *   3. Algum arquivo declarado em `variants` não existe em public/photos nos
 *      três formatos (avif/webp/jpg).
 *   4. As dimensões declaradas divergem de public/photos/index.json.
 *   5. `PublicPhotoFigure` é usado fora dos dois locais que renderizam crédito
 *      (PublicPhotoBand e a página /creditos-de-imagens) — foto sem crédito
 *      visível é violação de licença.
 *   6. O componente de crédito perdeu autor/licença/fonte no JSX.
 *   7. A página /creditos-de-imagens não lista todas as fotos do acervo.
 *
 * Executar: bunx tsx scripts/check-photo-credits.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { PUBLIC_PHOTOS } from "../src/data/publicPhotos";

const PHOTO_DIR = "public/photos";
const FORMATS = ["avif", "webp", "jpg"] as const;
const errors: string[] = [];

// 1–2. Metadados de licenciamento
for (const [key, p] of Object.entries(PUBLIC_PHOTOS)) {
  if (!p.author?.trim()) errors.push(`${key}: sem autor`);
  if (!p.license?.trim()) errors.push(`${key}: sem licença`);
  if (!/^https:\/\/commons\.wikimedia\.org\//.test(p.source ?? "")) {
    errors.push(`${key}: source não aponta para o Wikimedia Commons ("${p.source}")`);
  }
  if (/^CC BY/i.test(p.license) && !p.licenseUrl) {
    errors.push(`${key}: licença ${p.license} exige licenseUrl (atribuição obrigatória)`);
  }
  if (!p.alt || p.alt.trim().length < 10) errors.push(`${key}: alt ausente ou curto demais`);
  if (!p.caption?.trim()) errors.push(`${key}: caption ausente`);
  if (!p.variants?.length) errors.push(`${key}: sem variantes declaradas`);
}

// 3–4. Arquivos e dimensões
let manifest: Record<string, Record<string, number[]>> = {};
try {
  manifest = JSON.parse(readFileSync(`${PHOTO_DIR}/index.json`, "utf8"));
} catch {
  errors.push(`${PHOTO_DIR}/index.json ausente — rodar scripts/build-photos.py`);
}

for (const [key, p] of Object.entries(PUBLIC_PHOTOS)) {
  for (const w of p.variants ?? []) {
    for (const ext of FORMATS) {
      const file = `${PHOTO_DIR}/${p.slug}-${w}.${ext}`;
      if (!existsSync(file)) errors.push(`${key}: arquivo ausente ${file}`);
    }
  }
  const entry = manifest[p.slug];
  if (!entry) {
    errors.push(`${key}: sem entrada em index.json`);
    continue;
  }
  const largest = p.variants[p.variants.length - 1];
  const dims = entry[String(largest)];
  if (!dims) {
    errors.push(`${key}: index.json não tem a largura ${largest}`);
  } else if (dims[0] !== p.width || dims[1] !== p.height) {
    errors.push(
      `${key}: dimensões declaradas ${p.width}x${p.height} ≠ reais ${dims[0]}x${dims[1]}`,
    );
  }
}

// 5. Uso do <PublicPhotoFigure> restrito a superfícies com crédito
const ALLOWED_FIGURE_USERS = [
  "src/components/media/PublicPhotoBand.tsx",
  "src/pages/CreditosDeImagens.tsx",
];
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
function walk(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.tsx$/.test(e)) acc.push(p);
  }
  return acc;
}
for (const file of walk("src")) {
  if (file.endsWith("media/PublicPhotoFigure.tsx")) continue;
  const src = readFileSync(file, "utf8");
  if (/<PublicPhotoFigure\b/.test(src) && !ALLOWED_FIGURE_USERS.includes(file.replace(/\\/g, "/"))) {
    errors.push(
      `${file}: usa <PublicPhotoFigure> fora de uma superfície com crédito. ` +
        `Use <PublicPhotoBand> (renderiza autor + licença + fonte).`,
    );
  }
}

// 6. O componente de crédito continua renderizando autoria/licença/fonte
const band = readFileSync("src/components/media/PublicPhotoBand.tsx", "utf8");
for (const token of ["photo.author", "photo.license", "photo.source", "figcaption"]) {
  if (!band.includes(token)) {
    errors.push(`PublicPhotoBand.tsx: crédito incompleto — perdeu "${token}"`);
  }
}
if (!band.includes("ImageObject")) {
  errors.push("PublicPhotoBand.tsx: sem JSON-LD ImageObject (crédito legível por buscador)");
}

// 7. Página de créditos lista tudo
const credits = readFileSync("src/pages/CreditosDeImagens.tsx", "utf8");
if (!/PUBLIC_PHOTOS/.test(credits)) {
  errors.push("CreditosDeImagens.tsx: não itera PUBLIC_PHOTOS — acervo pode ficar sem crédito");
}

const total = Object.keys(PUBLIC_PHOTOS).length;
if (errors.length) {
  console.error(`✗ ${errors.length} problema(s) de crédito/licença em ${total} fotos:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ ${total} fotos públicas com autor, licença, fonte e arquivos completos.`);
