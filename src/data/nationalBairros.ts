// Bairros âncora nacionais — fonte ÚNICA de verdade para bairros nacionais.
// (Rodada 22.2.1) Toda referência a bairros nacionais nasce aqui.
// `nationalCities.ts` deriva sua cobertura a partir deste arquivo.
//
// Regras:
// - Curadoria conservadora — só bairros amplamente reconhecidos.
// - Não é lista IBGE completa e não deve ser chamada assim.
// - Nenhum dado estatístico é fabricado (sem população/ranking/aggregateRating).

export interface NationalBairro {
  slug: string;
  name: string;
  /** Descritor opcional exibido no hero (ex.: "zona sul"). */
  descriptor?: string;
}

/** Bairros âncora indexados por slug de cidade. */
export const nationalBairrosByCity: Record<string, NationalBairro[]> = {
  // ============ Sudeste — capitais ============
  "sao-paulo": [
    { slug: "pinheiros", name: "Pinheiros", descriptor: "zona oeste" },
    { slug: "moema", name: "Moema", descriptor: "zona sul" },
    { slug: "tatuape", name: "Tatuapé", descriptor: "zona leste" },
    { slug: "itaim-bibi", name: "Itaim Bibi", descriptor: "zona sul" },
    { slug: "jardins", name: "Jardins", descriptor: "zona central" },
    { slug: "vila-mariana", name: "Vila Mariana", descriptor: "zona sul" },
    { slug: "morumbi", name: "Morumbi", descriptor: "zona oeste" },
    { slug: "santana", name: "Santana", descriptor: "zona norte" },
  ],
  "rio-de-janeiro": [
    { slug: "copacabana", name: "Copacabana", descriptor: "zona sul" },
    { slug: "ipanema", name: "Ipanema", descriptor: "zona sul" },
    { slug: "botafogo", name: "Botafogo", descriptor: "zona sul" },
    { slug: "barra-da-tijuca", name: "Barra da Tijuca", descriptor: "zona oeste" },
    { slug: "tijuca", name: "Tijuca", descriptor: "zona norte" },
    { slug: "leblon", name: "Leblon", descriptor: "zona sul" },
    { slug: "flamengo", name: "Flamengo", descriptor: "zona sul" },
  ],
  "belo-horizonte": [
    { slug: "savassi", name: "Savassi", descriptor: "centro-sul" },
    { slug: "funcionarios", name: "Funcionários", descriptor: "centro-sul" },
    { slug: "buritis", name: "Buritis", descriptor: "oeste" },
    { slug: "lourdes", name: "Lourdes", descriptor: "centro-sul" },
    { slug: "pampulha", name: "Pampulha", descriptor: "norte" },
    { slug: "belvedere", name: "Belvedere", descriptor: "centro-sul" },
  ],
  "vitoria": [
    { slug: "praia-do-canto", name: "Praia do Canto" },
    { slug: "jardim-camburi", name: "Jardim Camburi" },
    { slug: "jardim-da-penha", name: "Jardim da Penha" },
    { slug: "enseada-do-sua", name: "Enseada do Suá" },
  ],

  // ============ Sudeste — metros ============
  "campinas": [
    { slug: "cambui", name: "Cambuí" },
    { slug: "taquaral", name: "Taquaral" },
    { slug: "barao-geraldo", name: "Barão Geraldo" },
    { slug: "centro", name: "Centro" },
  ],
  "guarulhos": [
    { slug: "centro", name: "Centro" },
    { slug: "vila-galvao", name: "Vila Galvão" },
    { slug: "picanco", name: "Picanço" },
    { slug: "macedo", name: "Macedo" },
  ],
  "sao-bernardo-do-campo": [
    { slug: "centro", name: "Centro" },
    { slug: "rudge-ramos", name: "Rudge Ramos" },
    { slug: "jardim-do-mar", name: "Jardim do Mar" },
    { slug: "baeta-neves", name: "Baeta Neves" },
  ],
  "santos": [
    { slug: "gonzaga", name: "Gonzaga" },
    { slug: "boqueirao", name: "Boqueirão" },
    { slug: "ponta-da-praia", name: "Ponta da Praia" },
    { slug: "aparecida", name: "Aparecida" },
    { slug: "embare", name: "Embaré" },
  ],
  "niteroi": [
    { slug: "icarai", name: "Icaraí" },
    { slug: "sao-francisco", name: "São Francisco" },
    { slug: "inga", name: "Ingá" },
    { slug: "santa-rosa", name: "Santa Rosa" },
  ],

  // ============ Sul — capitais ============
  "porto-alegre": [
    { slug: "moinhos-de-vento", name: "Moinhos de Vento" },
    { slug: "bela-vista", name: "Bela Vista" },
    { slug: "petropolis", name: "Petrópolis" },
    { slug: "menino-deus", name: "Menino Deus" },
    { slug: "tres-figueiras", name: "Três Figueiras" },
  ],
  "florianopolis": [
    { slug: "centro", name: "Centro" },
    { slug: "trindade", name: "Trindade" },
    { slug: "agronomica", name: "Agronômica" },
    { slug: "itacorubi", name: "Itacorubi" },
    { slug: "jurere", name: "Jurerê" },
  ],

  // ============ Sul — metros ============
  "joinville": [
    { slug: "centro", name: "Centro" },
    { slug: "america", name: "América" },
    { slug: "atiradores", name: "Atiradores" },
    { slug: "gloria", name: "Glória" },
  ],
  "londrina": [
    { slug: "centro", name: "Centro" },
    { slug: "gleba-palhano", name: "Gleba Palhano" },
    { slug: "boa-vista", name: "Boa Vista" },
  ],
  "maringa": [
    { slug: "zona-07", name: "Zona 07" },
    { slug: "novo-centro", name: "Novo Centro" },
    { slug: "zona-01", name: "Zona 01" },
  ],
  "caxias-do-sul": [
    { slug: "centro", name: "Centro" },
    { slug: "sao-pelegrino", name: "São Pelegrino" },
    { slug: "panazzolo", name: "Panazzolo" },
  ],

  // ============ Nordeste — capitais ============
  "salvador": [
    { slug: "pituba", name: "Pituba" },
    { slug: "barra", name: "Barra" },
    { slug: "itaigara", name: "Itaigara" },
    { slug: "rio-vermelho", name: "Rio Vermelho" },
    { slug: "ondina", name: "Ondina" },
    { slug: "caminho-das-arvores", name: "Caminho das Árvores" },
  ],
  "fortaleza": [
    { slug: "aldeota", name: "Aldeota" },
    { slug: "meireles", name: "Meireles" },
    { slug: "coco", name: "Cocó" },
    { slug: "papicu", name: "Papicu" },
    { slug: "edson-queiroz", name: "Edson Queiroz" },
  ],
  "recife": [
    { slug: "boa-viagem", name: "Boa Viagem" },
    { slug: "casa-forte", name: "Casa Forte" },
    { slug: "espinheiro", name: "Espinheiro" },
    { slug: "madalena", name: "Madalena" },
    { slug: "pina", name: "Pina" },
  ],
  "natal": [
    { slug: "ponta-negra", name: "Ponta Negra" },
    { slug: "tirol", name: "Tirol" },
    { slug: "petropolis", name: "Petrópolis" },
    { slug: "candelaria", name: "Candelária" },
  ],
  "joao-pessoa": [
    { slug: "cabo-branco", name: "Cabo Branco" },
    { slug: "manaira", name: "Manaíra" },
    { slug: "tambau", name: "Tambaú" },
    { slug: "bessa", name: "Bessa" },
  ],
  "maceio": [
    { slug: "ponta-verde", name: "Ponta Verde" },
    { slug: "jatiuca", name: "Jatiúca" },
    { slug: "pajucara", name: "Pajuçara" },
    { slug: "farol", name: "Farol" },
  ],
  "aracaju": [
    { slug: "jardins", name: "Jardins" },
    { slug: "atalaia", name: "Atalaia" },
    { slug: "grageru", name: "Grageru" },
    { slug: "treze-de-julho", name: "Treze de Julho" },
  ],
  "sao-luis": [
    { slug: "ponta-dareia", name: "Ponta d'Areia" },
    { slug: "renascenca", name: "Renascença" },
    { slug: "calhau", name: "Calhau" },
  ],
  "teresina": [
    { slug: "fatima", name: "Fátima" },
    { slug: "jockey", name: "Jóquei" },
    { slug: "horto", name: "Horto" },
  ],

  // ============ Centro-Oeste — capitais ============
  "brasilia": [
    { slug: "asa-sul", name: "Asa Sul" },
    { slug: "asa-norte", name: "Asa Norte" },
    { slug: "lago-sul", name: "Lago Sul" },
    { slug: "lago-norte", name: "Lago Norte" },
    { slug: "aguas-claras", name: "Águas Claras" },
    { slug: "taguatinga", name: "Taguatinga" },
  ],
  "goiania": [
    { slug: "setor-oeste", name: "Setor Oeste" },
    { slug: "setor-bueno", name: "Setor Bueno" },
    { slug: "setor-marista", name: "Setor Marista" },
    { slug: "jardim-goias", name: "Jardim Goiás" },
  ],
  "campo-grande": [
    { slug: "centro", name: "Centro" },
    { slug: "jardim-dos-estados", name: "Jardim dos Estados" },
    { slug: "chacara-cachoeira", name: "Chácara Cachoeira" },
  ],
  "cuiaba": [
    { slug: "centro", name: "Centro" },
    { slug: "goiabeiras", name: "Goiabeiras" },
    { slug: "jardim-aclimacao", name: "Jardim Aclimação" },
  ],

  // ============ Norte — capitais ============
  "manaus": [
    { slug: "adrianopolis", name: "Adrianópolis" },
    { slug: "flores", name: "Flores" },
    { slug: "ponta-negra", name: "Ponta Negra" },
    { slug: "cachoeirinha", name: "Cachoeirinha" },
  ],
  "belem": [
    { slug: "nazare", name: "Nazaré" },
    { slug: "batista-campos", name: "Batista Campos" },
    { slug: "umarizal", name: "Umarizal" },
  ],
  "porto-velho": [
    { slug: "centro", name: "Centro" },
    { slug: "nova-porto-velho", name: "Nova Porto Velho" },
  ],
  "rio-branco": [
    { slug: "centro", name: "Centro" },
    { slug: "bosque", name: "Bosque" },
  ],
  "boa-vista": [
    { slug: "centro", name: "Centro" },
    { slug: "sao-francisco", name: "São Francisco" },
  ],
  "palmas": [
    { slug: "plano-diretor-sul", name: "Plano Diretor Sul" },
    { slug: "plano-diretor-norte", name: "Plano Diretor Norte" },
  ],
  "macapa": [
    { slug: "centro", name: "Centro" },
    { slug: "jesus-de-nazare", name: "Jesus de Nazaré" },
  ],
};

export function getNationalBairro(
  citySlug: string,
  bairroSlug: string,
): NationalBairro | null {
  const list = nationalBairrosByCity[citySlug];
  if (!list) return null;
  return list.find((b) => b.slug === bairroSlug) ?? null;
}

export function getBairrosForCity(citySlug: string): NationalBairro[] {
  return nationalBairrosByCity[citySlug] ?? [];
}

/** Sugestões para páginas 404 quando bairro não existe (max 6). */
export function suggestBairros(citySlug: string, limit = 6): NationalBairro[] {
  return getBairrosForCity(citySlug).slice(0, limit);
}
