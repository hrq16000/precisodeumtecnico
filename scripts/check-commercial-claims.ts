/**
 * Guard fail-closed de alegações comerciais (Rodada 3L).
 *
 * Bloqueia o build se páginas comerciais-alvo publicarem alegações que não
 * possuem fonte comprovada no repositório (nota fiscal, parcelamento,
 * prazos de garantia fixos, números de clientes).
 *
 * Fonte única permitida: src/data/commercialTerms.ts e src/data/pricingPolicy.ts.
 * Se uma alegação for comprovada no futuro, adicione-a às fontes únicas e
 * libere o padrão aqui, com o motivo documentado.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const TARGETS = [
  "src/pages/Index.tsx",
  "src/pages/Servicos.tsx",
  "src/pages/Precos.tsx",
  "src/pages/Contato.tsx",
  "src/pages/Sobre.tsx",
  "src/components/home/HeroSection.tsx",
  "src/components/home/CTASection.tsx",
  "src/components/marketing/OfferHighlight.tsx",
  "src/components/marketing/AuthoritySince.tsx",
  "src/components/marketing/CommercialTermsBlock.tsx",
];

const FORBIDDEN: { re: RegExp; why: string }[] = [
  { re: /nota\s+fiscal/i, why: "emissão de nota fiscal não comprovada no repositório" },
  { re: /nfs?-?e\b/i, why: "referência a NF-e/NFS-e não comprovada" },
  { re: /sem\s+juros/i, why: "parcelamento sem juros não comprovado" },
  { re: /\b\d{1,2}\s?x\b(?![\w-])/i, why: "número de parcelas não comprovado" },
  { re: /\b90\s+dias\b/i, why: "prazo fixo de garantia não comprovado" },
  { re: /clientes\s+satisfeitos/i, why: "contagem de clientes não comprovada" },
];

const errors: string[] = [];

for (const rel of TARGETS) {
  const abs = resolve(rel);
  if (!existsSync(abs)) continue;
  const lines = readFileSync(abs, "utf-8").split("\n");
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // ignora comentários
    for (const { re, why } of FORBIDDEN) {
      if (re.test(line)) {
        errors.push(`${rel}:${i + 1}: ${why} → ${line.trim().slice(0, 120)}`);
      }
    }
  });
}

if (errors.length) {
  console.error("[commercial-claims] FALHOU — alegações comerciais sem comprovação:");
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(`[commercial-claims] OK — ${TARGETS.length} arquivos-alvo verificados.`);
