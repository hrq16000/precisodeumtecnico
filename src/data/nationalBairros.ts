// Bairros âncora nacionais — nomes curados e amplamente conhecidos por capital.
// Não é lista IBGE completa; entra apenas o que a rede consegue atender com segurança.
// Nenhum dado estatístico é fabricado — só slug + nome exibido.

export interface NationalBairro {
  slug: string;
  name: string;
  /** Descritor opcional exibido no hero (ex.: "zona sul"). Usado quando útil. */
  descriptor?: string;
}

/** Bairros âncora indexados por slug de cidade. */
export const nationalBairrosByCity: Record<string, NationalBairro[]> = {
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
  "brasilia": [
    { slug: "asa-sul", name: "Asa Sul" },
    { slug: "asa-norte", name: "Asa Norte" },
    { slug: "lago-sul", name: "Lago Sul" },
    { slug: "lago-norte", name: "Lago Norte" },
    { slug: "aguas-claras", name: "Águas Claras" },
    { slug: "taguatinga", name: "Taguatinga" },
  ],
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
  "goiania": [
    { slug: "setor-oeste", name: "Setor Oeste" },
    { slug: "setor-bueno", name: "Setor Bueno" },
    { slug: "setor-marista", name: "Setor Marista" },
    { slug: "jardim-goias", name: "Jardim Goiás" },
  ],
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
