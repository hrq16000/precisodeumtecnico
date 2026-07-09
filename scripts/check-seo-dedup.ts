/**
 * Guarda contra duplicação de metatags SEO entre fontes.
 * Checa o index.html estático × SEOHead.tsx (Helmet dinâmico) para meta tags
 * que devem ter exatamente 1 instância por rota (crawlers ficam ambíguos).
 * Sai com código 1 (falha o build) quando encontra duplicidade previsível.
 *
 * Rodado via `postbuild` script — não corrige, apenas denuncia.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type Rule = { property: string; label: string };
const CRITICAL: Rule[] = [
  { property: 'property="og:image"', label: "og:image" },
  { property: 'property="og:title"', label: "og:title" },
  { property: 'property="og:description"', label: "og:description" },
  { property: 'property="og:url"', label: "og:url" },
  { property: 'name="twitter:image"', label: "twitter:image" },
  { property: 'name="twitter:title"', label: "twitter:title" },
  { property: 'name="twitter:description"', label: "twitter:description" },
  { property: 'rel="canonical"', label: "canonical" },
];

const indexHtml = readFileSync(resolve("index.html"), "utf-8");
const seoHead = readFileSync(resolve("src/components/seo/SEOHead.tsx"), "utf-8");

const errors: string[] = [];
const warnings: string[] = [];

for (const rule of CRITICAL) {
  const inStatic = (indexHtml.match(new RegExp(rule.property, "g")) || []).length;
  const inHelmet = (seoHead.match(new RegExp(rule.property, "g")) || []).length;

  // ambas as fontes tentando setar a MESMA tag → duplicação em runtime
  if (inStatic > 0 && inHelmet > 0) {
    errors.push(
      `Duplicidade: ${rule.label} definida em index.html (${inStatic}x) E em SEOHead.tsx (${inHelmet}x). ` +
      `react-helmet-async não deduplica contra tags estáticas → 2 tags no DOM.`,
    );
  }
  if (inStatic > 1) {
    warnings.push(`index.html tem ${inStatic}x ${rule.label} — deveria ser 1.`);
  }
}

if (warnings.length) {
  console.warn("[seo-dedup] avisos:");
  for (const w of warnings) console.warn("  ⚠ " + w);
}
if (errors.length) {
  console.error("[seo-dedup] FALHOU:");
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(`[seo-dedup] OK — ${CRITICAL.length} regras verificadas, sem duplicidade.`);
