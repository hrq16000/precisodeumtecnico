// National partner cities — Brazilian state capitals + curated metropolitan cities.
// Served by our national partner technician network ("rede de prestadores parceiros"),
// distinct from the direct-service cities in Curitiba/PR (see regions.ts).
//
// Data policy (Rodada 22.2.1):
// - `nationalBairros.ts` é a ÚNICA fonte de verdade para bairros nacionais.
// - Este arquivo NÃO mantém lista manual de bairros — deriva via helper.
// - `population` e `highlights` são opcionais; nunca inventar números.

import { nationalBairrosByCity } from "./nationalBairros";

export type NationalCityType = "capital" | "metro";

export interface NationalCity {
  name: string;
  slug: string;
  /** UF sigla, ex.: "SP" */
  state: string;
  /** Nome completo do estado, ex.: "São Paulo" */
  stateName: string;
  /** Alias explícito para UF (para novos consumidores). */
  uf: string;
  region: "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
  /** Tipo de cidade: capital estadual ou município metropolitano. */
  type: NationalCityType;
  /** Habilita a rota /atendimento-nacional/:slug. */
  enabled: boolean;
  /** População (IBGE 2022 estimada) — opcional; omitir quando não confirmado. */
  population?: string;
  highlights?: string[];
}

const c = (
  data: Omit<NationalCity, "uf" | "enabled" | "type"> &
    Partial<Pick<NationalCity, "uf" | "enabled" | "type">>,
): NationalCity => ({
  uf: data.uf ?? data.state,
  type: data.type ?? "capital",
  enabled: data.enabled ?? true,
  ...data,
});

export const nationalCities: NationalCity[] = [
  // ============ Sudeste ============
  c({ name: "São Paulo", slug: "sao-paulo", state: "SP", stateName: "São Paulo", region: "Sudeste", type: "capital", population: "11.451.999", highlights: ["Maior cidade do Brasil", "Polo financeiro e tecnológico", "Atendimento em toda Grande SP"] }),
  c({ name: "Rio de Janeiro", slug: "rio-de-janeiro", state: "RJ", stateName: "Rio de Janeiro", region: "Sudeste", type: "capital", population: "6.211.423", highlights: ["Capital fluminense", "Atendimento Zona Sul, Norte e Oeste"] }),
  c({ name: "Belo Horizonte", slug: "belo-horizonte", state: "MG", stateName: "Minas Gerais", region: "Sudeste", type: "capital", population: "2.315.560", highlights: ["Capital mineira", "Cobertura na RMBH"] }),
  c({ name: "Vitória", slug: "vitoria", state: "ES", stateName: "Espírito Santo", region: "Sudeste", type: "capital", population: "322.869", highlights: ["Capital capixaba", "Atendimento na Grande Vitória"] }),
  c({ name: "Campinas", slug: "campinas", state: "SP", stateName: "São Paulo", region: "Sudeste", type: "metro", population: "1.139.047" }),
  c({ name: "Guarulhos", slug: "guarulhos", state: "SP", stateName: "São Paulo", region: "Sudeste", type: "metro", population: "1.291.784" }),
  c({ name: "São Bernardo do Campo", slug: "sao-bernardo-do-campo", state: "SP", stateName: "São Paulo", region: "Sudeste", type: "metro", population: "810.729" }),
  c({ name: "Santos", slug: "santos", state: "SP", stateName: "São Paulo", region: "Sudeste", type: "metro", population: "418.608" }),
  c({ name: "Niterói", slug: "niteroi", state: "RJ", stateName: "Rio de Janeiro", region: "Sudeste", type: "metro", population: "515.317" }),

  // ============ Sul ============
  c({ name: "Porto Alegre", slug: "porto-alegre", state: "RS", stateName: "Rio Grande do Sul", region: "Sul", type: "capital", population: "1.332.570" }),
  c({ name: "Florianópolis", slug: "florianopolis", state: "SC", stateName: "Santa Catarina", region: "Sul", type: "capital", population: "508.826" }),
  c({ name: "Joinville", slug: "joinville", state: "SC", stateName: "Santa Catarina", region: "Sul", type: "metro", population: "597.658" }),
  c({ name: "Londrina", slug: "londrina", state: "PR", stateName: "Paraná", region: "Sul", type: "metro", population: "555.965" }),
  c({ name: "Maringá", slug: "maringa", state: "PR", stateName: "Paraná", region: "Sul", type: "metro", population: "423.666" }),
  c({ name: "Caxias do Sul", slug: "caxias-do-sul", state: "RS", stateName: "Rio Grande do Sul", region: "Sul", type: "metro", population: "517.451" }),

  // ============ Nordeste ============
  c({ name: "Salvador", slug: "salvador", state: "BA", stateName: "Bahia", region: "Nordeste", type: "capital", population: "2.418.005" }),
  c({ name: "Fortaleza", slug: "fortaleza", state: "CE", stateName: "Ceará", region: "Nordeste", type: "capital", population: "2.703.391" }),
  c({ name: "Recife", slug: "recife", state: "PE", stateName: "Pernambuco", region: "Nordeste", type: "capital", population: "1.488.920" }),
  c({ name: "Natal", slug: "natal", state: "RN", stateName: "Rio Grande do Norte", region: "Nordeste", type: "capital", population: "751.300" }),
  c({ name: "João Pessoa", slug: "joao-pessoa", state: "PB", stateName: "Paraíba", region: "Nordeste", type: "capital", population: "833.932" }),
  c({ name: "Maceió", slug: "maceio", state: "AL", stateName: "Alagoas", region: "Nordeste", type: "capital", population: "957.916" }),
  c({ name: "Aracaju", slug: "aracaju", state: "SE", stateName: "Sergipe", region: "Nordeste", type: "capital", population: "664.908" }),
  c({ name: "São Luís", slug: "sao-luis", state: "MA", stateName: "Maranhão", region: "Nordeste", type: "capital", population: "1.037.775" }),
  c({ name: "Teresina", slug: "teresina", state: "PI", stateName: "Piauí", region: "Nordeste", type: "capital", population: "868.075" }),

  // ============ Centro-Oeste ============
  c({ name: "Brasília", slug: "brasilia", state: "DF", stateName: "Distrito Federal", region: "Centro-Oeste", type: "capital", population: "2.817.381" }),
  c({ name: "Goiânia", slug: "goiania", state: "GO", stateName: "Goiás", region: "Centro-Oeste", type: "capital", population: "1.437.366" }),
  c({ name: "Campo Grande", slug: "campo-grande", state: "MS", stateName: "Mato Grosso do Sul", region: "Centro-Oeste", type: "capital", population: "898.100" }),
  c({ name: "Cuiabá", slug: "cuiaba", state: "MT", stateName: "Mato Grosso", region: "Centro-Oeste", type: "capital", population: "650.916" }),

  // ============ Norte ============
  c({ name: "Manaus", slug: "manaus", state: "AM", stateName: "Amazonas", region: "Norte", type: "capital", population: "2.063.689" }),
  c({ name: "Belém", slug: "belem", state: "PA", stateName: "Pará", region: "Norte", type: "capital", population: "1.303.403" }),
  c({ name: "Porto Velho", slug: "porto-velho", state: "RO", stateName: "Rondônia", region: "Norte", type: "capital" }),
  c({ name: "Rio Branco", slug: "rio-branco", state: "AC", stateName: "Acre", region: "Norte", type: "capital" }),
  c({ name: "Boa Vista", slug: "boa-vista", state: "RR", stateName: "Roraima", region: "Norte", type: "capital" }),
  c({ name: "Palmas", slug: "palmas", state: "TO", stateName: "Tocantins", region: "Norte", type: "capital" }),
  c({ name: "Macapá", slug: "macapa", state: "AP", stateName: "Amapá", region: "Norte", type: "capital" }),
];

export const getNationalCityBySlug = (slug: string) =>
  nationalCities.find((c) => c.slug === slug && c.enabled !== false);

export const getEnabledNationalCities = () =>
  nationalCities.filter((c) => c.enabled !== false);

/**
 * Slugs de bairros publicados para a cidade — derivados de `nationalBairros.ts`.
 * NUNCA duplicar essa lista manualmente em outro lugar.
 */
export const getCityBairroSlugs = (citySlug: string): string[] =>
  (nationalBairrosByCity[citySlug] ?? []).map((b) => b.slug);

export const groupedByRegion = () => {
  const map: Record<string, NationalCity[]> = {};
  for (const c of nationalCities) {
    if (c.enabled === false) continue;
    (map[c.region] ||= []).push(c);
  }
  return map;
};
