/**
 * Helpers para extrair city/service a partir dos campos existentes em
 * wa_bypass_events (source, category, page_path). Sem PII.
 */

const KNOWN_CITIES = [
  "curitiba", "sao-jose-dos-pinhais", "pinhais", "colombo", "araucaria",
  "sao-paulo", "rio-de-janeiro", "belo-horizonte", "porto-alegre",
  "florianopolis", "brasilia", "salvador", "fortaleza", "recife",
  "manaus", "belem", "goiania", "campinas", "santos",
];

export function extractCityFromPath(path: string | null | undefined): string | null {
  if (!path) return null;
  const p = path.toLowerCase();
  // /assistencia-tecnica-<cidade>
  const at = p.match(/\/assistencia-tecnica-([a-z0-9-]+)/);
  if (at?.[1]) return at[1];
  // /regioes/<cidade>[/bairro]
  const rg = p.match(/\/regioes\/([a-z0-9-]+)/);
  if (rg?.[1]) return rg[1];
  // /servico-em/<cidade>/<servico>
  const se = p.match(/\/servico-em\/([a-z0-9-]+)/);
  if (se?.[1]) return se[1];
  for (const c of KNOWN_CITIES) if (p.includes(`/${c}`)) return c;
  return null;
}

export function extractNeighborhoodFromPath(path: string | null | undefined): string | null {
  if (!path) return null;
  const rg = path.toLowerCase().match(/\/regioes\/[a-z0-9-]+\/([a-z0-9-]+)/);
  return rg?.[1] ?? null;
}

export function extractServiceFromEvent(
  source: string | null | undefined,
  category: string | null | undefined,
  path: string | null | undefined,
): string | null {
  if (category && category.trim()) return category.trim().toLowerCase();
  if (source) {
    // padrão "quick-quote:Informática" ou "landing:informatica"
    const m = source.match(/[:\-]([a-z0-9-]+)$/i);
    if (m?.[1]) return m[1].toLowerCase();
  }
  const p = (path || "").toLowerCase();
  const se = p.match(/\/servico-em\/[a-z0-9-]+\/([a-z0-9-]+)/);
  if (se?.[1]) return se[1];
  const s = p.match(/\/servicos\/([a-z0-9-]+)/);
  if (s?.[1]) return s[1];
  return null;
}

export function normalizeSource(source: string | null | undefined): string {
  if (!source) return "(sem source)";
  return source.split(":")[0] || source;
}
