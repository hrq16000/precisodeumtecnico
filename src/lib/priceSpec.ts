/**
 * Fonte única de conversão "texto visível → PriceSpecification".
 *
 * A tabela de preços é escrita em português ("R$ 150 a R$ 250", "A partir de
 * R$ 299,99", "Sob consulta"). O schema.org exige números. Este parser é
 * usado tanto pela página quanto pelo gate de CI (scripts/check-price-schema.ts),
 * garantindo que o markup nunca divirja do conteúdo real.
 *
 * Retorna null quando não há preço numérico (ex.: "Sob consulta") — nesses
 * casos NÃO se emite Offer, porque um preço inventado é claim comercial falso.
 */
export interface ParsedPrice {
  min: number;
  max: number;
  /** true quando o texto é "A partir de …" (piso, sem teto declarado). */
  from: boolean;
}

function toNumber(raw: string): number {
  // "1.500,00" → 1500.00 ; "150" → 150
  return Number(raw.replace(/\./g, "").replace(",", "."));
}

export function parsePriceBRL(label: string): ParsedPrice | null {
  const matches = [...label.matchAll(/R\$\s*([\d.]+(?:,\d{2})?)/g)].map((m) => toNumber(m[1]));
  const valid = matches.filter((n) => Number.isFinite(n) && n > 0);
  if (valid.length === 0) return null;
  const from = /a partir de/i.test(label);
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  return { min, max, from };
}
