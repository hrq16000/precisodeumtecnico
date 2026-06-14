// National partner cities — top Brazilian capitals and major metros.
// These are served by our partner technician network ("rede de prestadores parceiros"),
// distinct from the direct-service cities in Curitiba/PR (see regions.ts).

export interface NationalCity {
  name: string;
  slug: string;
  state: string;
  stateName: string;
  region: "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
  population: string;
  highlights: string[];
}

export const nationalCities: NationalCity[] = [
  // Sudeste
  { name: "São Paulo", slug: "sao-paulo", state: "SP", stateName: "São Paulo", region: "Sudeste", population: "11.451.999", highlights: ["Maior cidade do Brasil", "Polo financeiro e tecnológico", "Atendimento em toda Grande SP"] },
  { name: "Rio de Janeiro", slug: "rio-de-janeiro", state: "RJ", stateName: "Rio de Janeiro", region: "Sudeste", population: "6.211.423", highlights: ["Capital fluminense", "Atendimento Zona Sul, Norte e Oeste", "Suporte residencial e empresarial"] },
  { name: "Belo Horizonte", slug: "belo-horizonte", state: "MG", stateName: "Minas Gerais", region: "Sudeste", population: "2.315.560", highlights: ["Capital mineira", "Cobertura na RMBH", "Técnicos parceiros certificados"] },
  { name: "Campinas", slug: "campinas", state: "SP", stateName: "São Paulo", region: "Sudeste", population: "1.139.047", highlights: ["Polo de tecnologia do interior paulista", "Suporte corporativo e residencial"] },
  { name: "Guarulhos", slug: "guarulhos", state: "SP", stateName: "São Paulo", region: "Sudeste", population: "1.291.784", highlights: ["Cidade industrial da Grande SP", "Atendimento rápido"] },
  { name: "São Bernardo do Campo", slug: "sao-bernardo-do-campo", state: "SP", stateName: "São Paulo", region: "Sudeste", population: "810.729", highlights: ["ABC paulista", "Suporte residencial e empresarial"] },
  { name: "Santos", slug: "santos", state: "SP", stateName: "São Paulo", region: "Sudeste", population: "418.608", highlights: ["Baixada Santista", "Atendimento litoral"] },
  { name: "Niterói", slug: "niteroi", state: "RJ", stateName: "Rio de Janeiro", region: "Sudeste", population: "515.317", highlights: ["Região metropolitana do Rio", "Cobertura completa"] },
  { name: "Vitória", slug: "vitoria", state: "ES", stateName: "Espírito Santo", region: "Sudeste", population: "322.869", highlights: ["Capital capixaba", "Atendimento na Grande Vitória"] },

  // Sul
  { name: "Porto Alegre", slug: "porto-alegre", state: "RS", stateName: "Rio Grande do Sul", region: "Sul", population: "1.332.570", highlights: ["Capital gaúcha", "Cobertura na Região Metropolitana"] },
  { name: "Florianópolis", slug: "florianopolis", state: "SC", stateName: "Santa Catarina", region: "Sul", population: "508.826", highlights: ["Capital catarinense", "Atendimento Ilha e continente"] },
  { name: "Joinville", slug: "joinville", state: "SC", stateName: "Santa Catarina", region: "Sul", population: "597.658", highlights: ["Maior cidade de SC", "Polo industrial"] },
  { name: "Londrina", slug: "londrina", state: "PR", stateName: "Paraná", region: "Sul", population: "555.965", highlights: ["Norte do Paraná", "Suporte residencial e comercial"] },
  { name: "Maringá", slug: "maringa", state: "PR", stateName: "Paraná", region: "Sul", population: "423.666", highlights: ["Noroeste do Paraná", "Atendimento empresarial"] },
  { name: "Caxias do Sul", slug: "caxias-do-sul", state: "RS", stateName: "Rio Grande do Sul", region: "Sul", population: "517.451", highlights: ["Serra gaúcha", "Suporte industrial e residencial"] },

  // Nordeste
  { name: "Salvador", slug: "salvador", state: "BA", stateName: "Bahia", region: "Nordeste", population: "2.418.005", highlights: ["Capital baiana", "Cobertura na RMS"] },
  { name: "Fortaleza", slug: "fortaleza", state: "CE", stateName: "Ceará", region: "Nordeste", population: "2.703.391", highlights: ["Capital cearense", "Atendimento em toda a cidade"] },
  { name: "Recife", slug: "recife", state: "PE", stateName: "Pernambuco", region: "Nordeste", population: "1.488.920", highlights: ["Capital pernambucana", "Suporte na Grande Recife"] },
  { name: "Natal", slug: "natal", state: "RN", stateName: "Rio Grande do Norte", region: "Nordeste", population: "751.300", highlights: ["Capital potiguar", "Cobertura completa"] },
  { name: "João Pessoa", slug: "joao-pessoa", state: "PB", stateName: "Paraíba", region: "Nordeste", population: "833.932", highlights: ["Capital paraibana", "Atendimento residencial e empresarial"] },
  { name: "Maceió", slug: "maceio", state: "AL", stateName: "Alagoas", region: "Nordeste", population: "957.916", highlights: ["Capital alagoana", "Suporte na orla e região"] },
  { name: "Aracaju", slug: "aracaju", state: "SE", stateName: "Sergipe", region: "Nordeste", population: "664.908", highlights: ["Capital sergipana", "Cobertura completa"] },
  { name: "São Luís", slug: "sao-luis", state: "MA", stateName: "Maranhão", region: "Nordeste", population: "1.037.775", highlights: ["Capital maranhense", "Atendimento na Grande São Luís"] },
  { name: "Teresina", slug: "teresina", state: "PI", stateName: "Piauí", region: "Nordeste", population: "868.075", highlights: ["Capital piauiense", "Suporte residencial e comercial"] },

  // Centro-Oeste
  { name: "Brasília", slug: "brasilia", state: "DF", stateName: "Distrito Federal", region: "Centro-Oeste", population: "2.817.381", highlights: ["Capital federal", "Atendimento Plano Piloto e regiões administrativas"] },
  { name: "Goiânia", slug: "goiania", state: "GO", stateName: "Goiás", region: "Centro-Oeste", population: "1.437.366", highlights: ["Capital goiana", "Cobertura na Grande Goiânia"] },
  { name: "Campo Grande", slug: "campo-grande", state: "MS", stateName: "Mato Grosso do Sul", region: "Centro-Oeste", population: "898.100", highlights: ["Capital sul-mato-grossense", "Atendimento residencial e empresarial"] },
  { name: "Cuiabá", slug: "cuiaba", state: "MT", stateName: "Mato Grosso", region: "Centro-Oeste", population: "650.916", highlights: ["Capital mato-grossense", "Suporte na Grande Cuiabá"] },

  // Norte
  { name: "Manaus", slug: "manaus", state: "AM", stateName: "Amazonas", region: "Norte", population: "2.063.689", highlights: ["Capital amazonense", "Maior cidade do Norte"] },
  { name: "Belém", slug: "belem", state: "PA", stateName: "Pará", region: "Norte", population: "1.303.403", highlights: ["Capital paraense", "Cobertura na RMB"] },
];

export const getNationalCityBySlug = (slug: string) =>
  nationalCities.find((c) => c.slug === slug);

export const groupedByRegion = () => {
  const map: Record<string, NationalCity[]> = {};
  for (const c of nationalCities) {
    (map[c.region] ||= []).push(c);
  }
  return map;
};
