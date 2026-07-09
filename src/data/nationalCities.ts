// National partner cities — Brazilian state capitals + curated metropolitan cities.
// Served by our national partner technician network ("rede de prestadores parceiros"),
// distinct from the direct-service cities in Curitiba/PR (see regions.ts).
//
// Data policy (Rodada 22.1):
// - Only include cities where we can guarantee real partner coverage.
// - `population` and `highlights` are optional; never invent numbers.
// - `bairros` is a slug list — resolved against `nationalBairros.ts`.

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
  /** Bairros âncora curados (slugs). Vazio quando ainda não catalogado. */
  bairros: string[];
  /** População (IBGE 2022 estimada) — opcional; omitir quando não confirmado. */
  population?: string;
  highlights?: string[];
}

const c = (
  data: Omit<NationalCity, "uf" | "enabled" | "bairros" | "type"> &
    Partial<Pick<NationalCity, "uf" | "enabled" | "bairros" | "type">>,
): NationalCity => ({
  uf: data.uf ?? data.state,
  type: data.type ?? "capital",
  enabled: data.enabled ?? true,
  bairros: data.bairros ?? [],
  ...data,
});

export const nationalCities: NationalCity[] = [
  // ============ Sudeste ============
  c({ name: "São Paulo", slug: "sao-paulo", state: "SP", stateName: "São Paulo", region: "Sudeste", type: "capital", population: "11.451.999", bairros: ["pinheiros", "moema", "tatuape", "itaim-bibi", "jardins", "vila-mariana", "morumbi", "santana"], highlights: ["Maior cidade do Brasil", "Polo financeiro e tecnológico", "Atendimento em toda Grande SP"] }),
  c({ name: "Rio de Janeiro", slug: "rio-de-janeiro", state: "RJ", stateName: "Rio de Janeiro", region: "Sudeste", type: "capital", population: "6.211.423", bairros: ["copacabana", "ipanema", "botafogo", "barra-da-tijuca", "tijuca", "leblon", "flamengo"], highlights: ["Capital fluminense", "Atendimento Zona Sul, Norte e Oeste"] }),
  c({ name: "Belo Horizonte", slug: "belo-horizonte", state: "MG", stateName: "Minas Gerais", region: "Sudeste", type: "capital", population: "2.315.560", bairros: ["savassi", "funcionarios", "buritis", "lourdes", "pampulha", "belvedere"], highlights: ["Capital mineira", "Cobertura na RMBH"] }),
  c({ name: "Vitória", slug: "vitoria", state: "ES", stateName: "Espírito Santo", region: "Sudeste", type: "capital", population: "322.869", bairros: ["praia-do-canto", "jardim-camburi", "jardim-da-penha", "enseada-do-sua"], highlights: ["Capital capixaba", "Atendimento na Grande Vitória"] }),
  c({ name: "Campinas", slug: "campinas", state: "SP", stateName: "São Paulo", region: "Sudeste", type: "metro", population: "1.139.047", bairros: ["cambui", "taquaral", "barao-geraldo"] }),
  c({ name: "Guarulhos", slug: "guarulhos", state: "SP", stateName: "São Paulo", region: "Sudeste", type: "metro", population: "1.291.784", bairros: ["centro", "vila-galvao", "picanco"] }),
  c({ name: "São Bernardo do Campo", slug: "sao-bernardo-do-campo", state: "SP", stateName: "São Paulo", region: "Sudeste", type: "metro", population: "810.729", bairros: ["centro", "rudge-ramos", "jardim-do-mar"] }),
  c({ name: "Santos", slug: "santos", state: "SP", stateName: "São Paulo", region: "Sudeste", type: "metro", population: "418.608", bairros: ["gonzaga", "boqueirao", "ponta-da-praia"] }),
  c({ name: "Niterói", slug: "niteroi", state: "RJ", stateName: "Rio de Janeiro", region: "Sudeste", type: "metro", population: "515.317", bairros: ["icarai", "sao-francisco", "ingua"] }),

  // ============ Sul ============
  c({ name: "Porto Alegre", slug: "porto-alegre", state: "RS", stateName: "Rio Grande do Sul", region: "Sul", type: "capital", population: "1.332.570", bairros: ["moinhos-de-vento", "bela-vista", "petropolis", "menino-deus", "tres-figueiras"] }),
  c({ name: "Florianópolis", slug: "florianopolis", state: "SC", stateName: "Santa Catarina", region: "Sul", type: "capital", population: "508.826", bairros: ["centro", "trindade", "agronomica", "itacorubi", "jurere"] }),
  c({ name: "Joinville", slug: "joinville", state: "SC", stateName: "Santa Catarina", region: "Sul", type: "metro", population: "597.658", bairros: ["centro", "america", "atiradores"] }),
  c({ name: "Londrina", slug: "londrina", state: "PR", stateName: "Paraná", region: "Sul", type: "metro", population: "555.965", bairros: ["centro", "gleba-palhano"] }),
  c({ name: "Maringá", slug: "maringa", state: "PR", stateName: "Paraná", region: "Sul", type: "metro", population: "423.666", bairros: ["zona-07", "novo-centro"] }),
  c({ name: "Caxias do Sul", slug: "caxias-do-sul", state: "RS", stateName: "Rio Grande do Sul", region: "Sul", type: "metro", population: "517.451", bairros: ["centro", "sao-pelegrino"] }),

  // ============ Nordeste ============
  c({ name: "Salvador", slug: "salvador", state: "BA", stateName: "Bahia", region: "Nordeste", type: "capital", population: "2.418.005", bairros: ["pituba", "barra", "itaigara", "rio-vermelho", "ondina", "caminho-das-arvores"] }),
  c({ name: "Fortaleza", slug: "fortaleza", state: "CE", stateName: "Ceará", region: "Nordeste", type: "capital", population: "2.703.391", bairros: ["aldeota", "meireles", "coco", "papicu", "edson-queiroz"] }),
  c({ name: "Recife", slug: "recife", state: "PE", stateName: "Pernambuco", region: "Nordeste", type: "capital", population: "1.488.920", bairros: ["boa-viagem", "casa-forte", "espinheiro", "madalena", "pina"] }),
  c({ name: "Natal", slug: "natal", state: "RN", stateName: "Rio Grande do Norte", region: "Nordeste", type: "capital", population: "751.300", bairros: ["ponta-negra", "tirol", "petropolis", "candelaria"] }),
  c({ name: "João Pessoa", slug: "joao-pessoa", state: "PB", stateName: "Paraíba", region: "Nordeste", type: "capital", population: "833.932", bairros: ["cabo-branco", "manaira", "tambau"] }),
  c({ name: "Maceió", slug: "maceio", state: "AL", stateName: "Alagoas", region: "Nordeste", type: "capital", population: "957.916", bairros: ["ponta-verde", "jatiuca", "pajucara"] }),
  c({ name: "Aracaju", slug: "aracaju", state: "SE", stateName: "Sergipe", region: "Nordeste", type: "capital", population: "664.908", bairros: ["jardins", "atalaia", "gragerus"] }),
  c({ name: "São Luís", slug: "sao-luis", state: "MA", stateName: "Maranhão", region: "Nordeste", type: "capital", population: "1.037.775", bairros: ["ponta-dareia", "renascenca", "calhau"] }),
  c({ name: "Teresina", slug: "teresina", state: "PI", stateName: "Piauí", region: "Nordeste", type: "capital", population: "868.075", bairros: ["fatima", "jockey", "horto"] }),

  // ============ Centro-Oeste ============
  c({ name: "Brasília", slug: "brasilia", state: "DF", stateName: "Distrito Federal", region: "Centro-Oeste", type: "capital", population: "2.817.381", bairros: ["asa-sul", "asa-norte", "lago-sul", "lago-norte", "aguas-claras", "taguatinga"] }),
  c({ name: "Goiânia", slug: "goiania", state: "GO", stateName: "Goiás", region: "Centro-Oeste", type: "capital", population: "1.437.366", bairros: ["setor-oeste", "setor-bueno", "setor-marista", "jardim-goias"] }),
  c({ name: "Campo Grande", slug: "campo-grande", state: "MS", stateName: "Mato Grosso do Sul", region: "Centro-Oeste", type: "capital", population: "898.100", bairros: ["centro", "jardim-dos-estados", "chacara-cachoeira"] }),
  c({ name: "Cuiabá", slug: "cuiaba", state: "MT", stateName: "Mato Grosso", region: "Centro-Oeste", type: "capital", population: "650.916", bairros: ["centro", "goiabeiras", "jardim-aclimacao"] }),

  // ============ Norte ============
  c({ name: "Manaus", slug: "manaus", state: "AM", stateName: "Amazonas", region: "Norte", type: "capital", population: "2.063.689", bairros: ["adrianopolis", "flores", "ponta-negra", "cachoeirinha"] }),
  c({ name: "Belém", slug: "belem", state: "PA", stateName: "Pará", region: "Norte", type: "capital", population: "1.303.403", bairros: ["nazare", "batista-campos", "umarizal"] }),
  c({ name: "Porto Velho", slug: "porto-velho", state: "RO", stateName: "Rondônia", region: "Norte", type: "capital", bairros: ["centro", "nova-porto-velho"] }),
  c({ name: "Rio Branco", slug: "rio-branco", state: "AC", stateName: "Acre", region: "Norte", type: "capital", bairros: ["centro", "bosque"] }),
  c({ name: "Boa Vista", slug: "boa-vista", state: "RR", stateName: "Roraima", region: "Norte", type: "capital", bairros: ["centro", "sao-francisco"] }),
  c({ name: "Palmas", slug: "palmas", state: "TO", stateName: "Tocantins", region: "Norte", type: "capital", bairros: ["plano-diretor-sul", "plano-diretor-norte"] }),
  c({ name: "Macapá", slug: "macapa", state: "AP", stateName: "Amapá", region: "Norte", type: "capital", bairros: ["centro", "jesus-de-nazare"] }),
];

export const getNationalCityBySlug = (slug: string) =>
  nationalCities.find((c) => c.slug === slug && c.enabled !== false);

export const getEnabledNationalCities = () =>
  nationalCities.filter((c) => c.enabled !== false);

export const groupedByRegion = () => {
  const map: Record<string, NationalCity[]> = {};
  for (const c of nationalCities) {
    if (c.enabled === false) continue;
    (map[c.region] ||= []).push(c);
  }
  return map;
};
