// Complete data for all cities and neighborhoods in Curitiba metropolitan region

export const curitibaBairros = [
  "Abranches", "Água Verde", "Ahú", "Alto Boqueirão", "Alto da Glória", "Alto da Rua XV",
  "Atuba", "Augusta", "Bacacheri", "Bairro Alto", "Barreirinha", "Batel", "Bigorrilho",
  "Boa Vista", "Bom Retiro", "Boqueirão", "Butiatuvinha", "Cabral", "Cachoeira",
  "Cajuru", "Campina do Siqueira", "Campo Comprido", "Campo de Santana", "Capão da Imbuia",
  "Capão Raso", "Cascatinha", "Caximba", "Centro", "Centro Cívico", "Cidade Industrial",
  "Cristo Rei", "Fanny", "Fazendinha", "Ganchinho", "Guabirotuba", "Guaíra", "Hauer",
  "Hugo Lange", "Jardim Botânico", "Jardim das Américas", "Jardim Social", "Juvevê",
  "Lamenha Pequena", "Lindóia", "Mercês", "Mossunguê", "Novo Mundo", "Orleans",
  "Parolin", "Passaúna", "Pilarzinho", "Pinheirinho", "Portão", "Prado Velho",
  "Rebouças", "Riviera", "Santa Cândida", "Santa Felicidade", "Santa Quitéria",
  "Santo Inácio", "São Braz", "São Francisco", "São João", "São Lourenço", "São Miguel",
  "São Sebastião", "Seminário", "Sítio Cercado", "Taboão", "Tarumã", "Tatuquara",
  "Tingui", "Uberaba", "Umbará", "Vila Izabel", "Vista Alegre", "Xaxim"
];

export const sjpBairros = [
  "Afonso Pena", "Águas Belas", "Aristocrata", "Arujá", "Barro Preto", "Boneca do Iguaçu",
  "Borda do Campo", "Braga", "Campo Grande", "Campo Largo da Roseira", "Centro",
  "Cidade Jardim", "Colônia Murici", "Colônia Rio Grande", "Contenda", "Costeira",
  "Cruzeiro", "Del Rey", "Dom Rodrigo", "Empresarial Renault", "Guatupê", "Iná",
  "Independência", "Ipê", "Itália", "Jurema", "Jardim Alegria", "Ouro Fino",
  "Pedro Moro", "Quissisana", "Rio Pequeno", "Roseira de São Sebastião", "Salgado Filho",
  "Santo Antônio", "São Cristóvão", "São Domingos", "São Marcos", "São Pedro", "Zacarias"
];

export const pinhaiBairros = [
  "Alphaville Graciosa", "Alto Atuba", "Alto Tarumã", "Atuba", "Centro", "Emiliano Perneta",
  "Estância Pinhais", "Graciosa", "Jardim Amélia", "Jardim Claudia", "Jardim Pedro Demeterco",
  "Maria Antonieta", "Palmital", "Pineville", "Sete Vilas", "Vargem Grande", "Vila Amélia",
  "Weissópolis"
];

export const colomboBairros = [
  "Alto Maracanã", "Arruda", "Atuba", "Campo Pequeno", "Centro", "Colônia Faria",
  "Curitibanos", "Embu", "Fátima", "Gabirobal", "Guaraituba", "Guarani", "Maracanã",
  "Mauá", "Monza", "Nossa Senhora de Fátima", "Osasco", "Palmeira", "Roça Grande",
  "Santa Gema", "Santa Terezinha", "São Dimas", "São Gabriel", "São João", "Timbu"
];

export const araucariaBairros = [
  "Barigui", "Cachoeira", "Centro", "Chapada", "Costeira", "Fazenda Velha", "Guajuvira",
  "Iguaçu", "Industrial", "Jardim Alvorada", "Jardim Ipiranga", "Jardim Primavera",
  "Porto das Laranjeiras", "Sabiá", "Tindiquera", "Thomaz Coelho", "Vila Nova"
];

export interface CityData {
  name: string;
  slug: string;
  state: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  population?: string;
  neighborhoods: string[];
  isMainCity: boolean;
  features: string[];
  serviceAreas: string[];
}

export const citiesData: Record<string, CityData> = {
  "curitiba": {
    name: "Curitiba",
    slug: "curitiba",
    state: "PR",
    description: "Capital do Paraná, Curitiba é conhecida por sua qualidade de vida, parques e infraestrutura urbana. Atendemos todos os 75 bairros da cidade com técnicos especializados.",
    seoTitle: "Técnico em Curitiba | Assistência Técnica 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Curitiba - PR. Técnicos especializados em informática, elétrica, CFTV, ar-condicionado. Atendimento 24h via WhatsApp. Visita a partir de R$ 99,99.",
    population: "1.963.726",
    neighborhoods: curitibaBairros,
    isMainCity: true,
    features: [
      "Atendimento em todos os 75 bairros",
      "Técnicos especializados na capital",
      "Resposta rápida em até 30 minutos",
      "Maior cobertura de técnicos"
    ],
    serviceAreas: ["Informática", "CFTV", "Elétrica", "Ar-Condicionado", "Notebooks", "Celulares", "Redes", "Games"]
  },
  "sao-jose-dos-pinhais": {
    name: "São José dos Pinhais",
    slug: "sao-jose-dos-pinhais",
    state: "PR",
    description: "Segunda maior cidade da região metropolitana de Curitiba, São José dos Pinhais é um importante polo industrial e comercial. Oferecemos atendimento técnico completo em toda a cidade.",
    seoTitle: "Técnico em São José dos Pinhais | Assistência 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em São José dos Pinhais - PR. Informática, CFTV, elétrica, ar-condicionado. Técnico vai até você! WhatsApp 24h. A partir de R$ 99,99.",
    population: "329.058",
    neighborhoods: sjpBairros,
    isMainCity: true,
    features: [
      "Cobertura em 40+ bairros",
      "Atendimento residencial e empresarial",
      "Suporte ao parque industrial",
      "Técnicos locais especializados"
    ],
    serviceAreas: ["Informática", "CFTV", "Elétrica", "Ar-Condicionado", "Notebooks", "Redes"]
  },
  "pinhais": {
    name: "Pinhais",
    slug: "pinhais",
    state: "PR",
    description: "Cidade com grande desenvolvimento econômico e próxima a Curitiba. Atendemos Pinhais com técnicos qualificados para todas as necessidades.",
    seoTitle: "Técnico em Pinhais | Assistência Técnica 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Pinhais - PR. Informática, elétrica, CFTV, ar-condicionado, notebooks. Atendimento 24h via WhatsApp. Visita técnica a partir de R$ 99,99.",
    population: "132.157",
    neighborhoods: pinhaiBairros,
    isMainCity: true,
    features: [
      "Atendimento rápido",
      "Técnicos especializados",
      "Cobertura total da cidade",
      "Suporte a condomínios"
    ],
    serviceAreas: ["Informática", "CFTV", "Elétrica", "Ar-Condicionado", "Notebooks", "Redes"]
  },
  "colombo": {
    name: "Colombo",
    slug: "colombo",
    state: "PR",
    description: "Terceira maior cidade da região metropolitana, Colombo possui forte presença industrial. Oferecemos assistência técnica completa para residências e empresas.",
    seoTitle: "Técnico em Colombo | Assistência Técnica 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Colombo - PR. Técnicos especializados em informática, elétrica, CFTV, ar-condicionado. WhatsApp 24h. A partir de R$ 99,99.",
    population: "246.540",
    neighborhoods: colomboBairros,
    isMainCity: true,
    features: [
      "Atendimento em toda a cidade",
      "Suporte industrial",
      "Técnicos locais",
      "Resposta rápida"
    ],
    serviceAreas: ["Informática", "CFTV", "Elétrica", "Ar-Condicionado", "Notebooks", "Redes"]
  },
  "araucaria": {
    name: "Araucária",
    slug: "araucaria",
    state: "PR",
    description: "Importante polo industrial do Paraná, Araucária abriga diversas indústrias e refinaria. Atendemos empresas e residências com técnicos especializados.",
    seoTitle: "Técnico em Araucária | Assistência Técnica 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Araucária - PR. Informática, elétrica, CFTV, ar-condicionado. Atendimento residencial e industrial. WhatsApp 24h.",
    population: "147.505",
    neighborhoods: araucariaBairros,
    isMainCity: true,
    features: [
      "Suporte industrial especializado",
      "Atendimento residencial",
      "Técnicos certificados",
      "Cobertura total"
    ],
    serviceAreas: ["Informática", "CFTV", "Elétrica", "Ar-Condicionado", "Redes", "Servidores"]
  },
  "campo-largo": {
    name: "Campo Largo",
    slug: "campo-largo",
    state: "PR",
    description: "Conhecida como Capital da Louça, Campo Largo é uma cidade em crescimento. Oferecemos serviços técnicos completos para toda a região.",
    seoTitle: "Técnico em Campo Largo | Assistência Técnica 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Campo Largo - PR. Informática, elétrica, CFTV, ar-condicionado. Técnico vai até você! WhatsApp 24h.",
    population: "132.226",
    neighborhoods: ["Centro", "Botiatuva", "Ferraria", "Jardim Aeroporto", "Jardim das Nações", "Pilarzinho", "Rondinha", "São José", "Três Córregos", "Vila Nova"],
    isMainCity: false,
    features: ["Atendimento completo", "Técnicos qualificados", "Suporte comercial"],
    serviceAreas: ["Informática", "CFTV", "Elétrica", "Ar-Condicionado"]
  },
  "almirante-tamandare": {
    name: "Almirante Tamandaré",
    slug: "almirante-tamandare",
    state: "PR",
    description: "Cidade próxima a Curitiba com forte crescimento. Atendemos toda a região com técnicos especializados.",
    seoTitle: "Técnico em Almirante Tamandaré | Assistência 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Almirante Tamandaré - PR. Informática, elétrica, CFTV, ar-condicionado. WhatsApp 24h. A partir de R$ 99,99.",
    population: "121.887",
    neighborhoods: ["Centro", "Cachoeira", "Campo Grande", "Colônia Antônio Prado", "Jardim Apucarana", "Jardim Monte Santo", "Santa Cândida", "São Venâncio"],
    isMainCity: false,
    features: ["Atendimento rápido", "Técnicos locais"],
    serviceAreas: ["Informática", "CFTV", "Elétrica", "Ar-Condicionado"]
  },
  "fazenda-rio-grande": {
    name: "Fazenda Rio Grande",
    slug: "fazenda-rio-grande",
    state: "PR",
    description: "Cidade em expansão na região metropolitana. Oferecemos assistência técnica completa para moradores e empresas.",
    seoTitle: "Técnico em Fazenda Rio Grande | Assistência 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Fazenda Rio Grande - PR. Informática, elétrica, CFTV, ar-condicionado. Técnico vai até você!",
    population: "103.265",
    neighborhoods: ["Centro", "Estados", "Eucaliptos", "Gralha Azul", "Iguaçu", "Nações", "Santa Terezinha", "Santana"],
    isMainCity: false,
    features: ["Atendimento completo", "Técnicos certificados"],
    serviceAreas: ["Informática", "CFTV", "Elétrica", "Ar-Condicionado"]
  },
  "piraquara": {
    name: "Piraquara",
    slug: "piraquara",
    state: "PR",
    description: "Conhecida por suas belezas naturais e mananciais. Atendemos toda a cidade com serviços técnicos especializados.",
    seoTitle: "Técnico em Piraquara | Assistência Técnica 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Piraquara - PR. Informática, elétrica, CFTV, ar-condicionado. WhatsApp 24h.",
    population: "113.232",
    neighborhoods: ["Centro", "Guarituba", "Jardim Primavera", "Planta Deodoro", "Vila São Cristóvão", "Vila Vicente Macedo"],
    isMainCity: false,
    features: ["Atendimento especializado", "Cobertura completa"],
    serviceAreas: ["Informática", "CFTV", "Elétrica", "Ar-Condicionado"]
  },
  "quatro-barras": {
    name: "Quatro Barras",
    slug: "quatro-barras",
    state: "PR",
    description: "Cidade com localização estratégica na serra. Oferecemos assistência técnica de qualidade.",
    seoTitle: "Técnico em Quatro Barras | Assistência 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Quatro Barras - PR. Informática, elétrica, CFTV, ar-condicionado. WhatsApp 24h.",
    population: "24.334",
    neighborhoods: ["Centro", "Borda do Campo", "Jardim Menino Deus", "São Lourenço"],
    isMainCity: false,
    features: ["Atendimento rápido", "Técnicos qualificados"],
    serviceAreas: ["Informática", "CFTV", "Elétrica"]
  },
  "campina-grande-do-sul": {
    name: "Campina Grande do Sul",
    slug: "campina-grande-do-sul",
    state: "PR",
    description: "Cidade com forte tradição e desenvolvimento. Atendemos toda a região com técnicos especializados.",
    seoTitle: "Técnico em Campina Grande do Sul | Assistência 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Campina Grande do Sul - PR. Informática, elétrica, CFTV, ar-condicionado.",
    population: "43.981",
    neighborhoods: ["Centro", "Jardim Paulista", "Jd. Santo Antônio", "Sete Quedas", "Vila Macedo"],
    isMainCity: false,
    features: ["Atendimento completo", "Suporte técnico"],
    serviceAreas: ["Informática", "CFTV", "Elétrica"]
  },
  "campo-magro": {
    name: "Campo Magro",
    slug: "campo-magro",
    state: "PR",
    description: "Cidade com área rural e urbana. Oferecemos assistência técnica para toda a comunidade.",
    seoTitle: "Técnico em Campo Magro | Assistência Técnica 24h | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Campo Magro - PR. Informática, elétrica, CFTV. WhatsApp 24h.",
    population: "29.548",
    neighborhoods: ["Centro", "Jardim Cecília", "Jardim Iguaçu", "Mato Branco"],
    isMainCity: false,
    features: ["Atendimento rural e urbano"],
    serviceAreas: ["Informática", "CFTV", "Elétrica"]
  },
  "itaperucu": {
    name: "Itaperuçu",
    slug: "itaperucu",
    state: "PR",
    description: "Cidade em desenvolvimento na região norte metropolitana. Atendemos com técnicos qualificados.",
    seoTitle: "Técnico em Itaperuçu | Assistência Técnica | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Itaperuçu - PR. Informática, elétrica, CFTV. WhatsApp 24h.",
    population: "32.249",
    neighborhoods: ["Centro", "Jardim Karla", "Santa Rita"],
    isMainCity: false,
    features: ["Atendimento completo"],
    serviceAreas: ["Informática", "CFTV", "Elétrica"]
  },
  "rio-branco-do-sul": {
    name: "Rio Branco do Sul",
    slug: "rio-branco-do-sul",
    state: "PR",
    description: "Cidade com forte presença de mineração. Oferecemos suporte técnico para empresas e residências.",
    seoTitle: "Técnico em Rio Branco do Sul | Assistência | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Rio Branco do Sul - PR. Informática, elétrica, CFTV.",
    population: "33.787",
    neighborhoods: ["Centro", "Açungui", "Bocaiúva do Sul"],
    isMainCity: false,
    features: ["Suporte industrial", "Atendimento residencial"],
    serviceAreas: ["Informática", "CFTV", "Elétrica"]
  },
  "mandirituba": {
    name: "Mandirituba",
    slug: "mandirituba",
    state: "PR",
    description: "Cidade agrícola ao sul da região metropolitana. Atendemos com técnicos especializados.",
    seoTitle: "Técnico em Mandirituba | Assistência Técnica | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Mandirituba - PR. Informática, elétrica, CFTV.",
    population: "26.915",
    neighborhoods: ["Centro", "Areia Branca", "Espigão Alto"],
    isMainCity: false,
    features: ["Atendimento rural e urbano"],
    serviceAreas: ["Informática", "CFTV", "Elétrica"]
  },
  "contenda": {
    name: "Contenda",
    slug: "contenda",
    state: "PR",
    description: "Cidade tranquila na região metropolitana. Oferecemos serviços técnicos de qualidade.",
    seoTitle: "Técnico em Contenda | Assistência Técnica | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Contenda - PR. Informática, elétrica, CFTV.",
    population: "18.832",
    neighborhoods: ["Centro", "São Luiz"],
    isMainCity: false,
    features: ["Atendimento completo"],
    serviceAreas: ["Informática", "CFTV", "Elétrica"]
  },
  "balsa-nova": {
    name: "Balsa Nova",
    slug: "balsa-nova",
    state: "PR",
    description: "Cidade com belas paisagens naturais. Atendemos toda a região.",
    seoTitle: "Técnico em Balsa Nova | Assistência Técnica | Preciso de Um Técnico",
    seoDescription: "Assistência técnica em Balsa Nova - PR. Informática, elétrica, CFTV.",
    population: "13.689",
    neighborhoods: ["Centro", "São Luiz do Purunã"],
    isMainCity: false,
    features: ["Atendimento especializado"],
    serviceAreas: ["Informática", "CFTV", "Elétrica"]
  },
  "lapa": {
    name: "Lapa",
    slug: "lapa",
    state: "PR",
    description: "Cidade histórica com importante patrimônio cultural. Oferecemos assistência técnica completa.",
    seoTitle: "Técnico na Lapa | Assistência Técnica | Preciso de Um Técnico",
    seoDescription: "Assistência técnica na Lapa - PR. Informática, elétrica, CFTV.",
    population: "48.695",
    neighborhoods: ["Centro", "Água Azul", "Bom Sucesso"],
    isMainCity: false,
    features: ["Atendimento completo"],
    serviceAreas: ["Informática", "CFTV", "Elétrica"]
  }
};

// Get all cities as array
export const getAllCities = () => Object.values(citiesData);

// Get main cities
export const getMainCities = () => getAllCities().filter(city => city.isMainCity);

// Get other cities
export const getOtherCities = () => getAllCities().filter(city => !city.isMainCity);

// Get city by slug
export const getCityBySlug = (slug: string) => citiesData[slug];

// Format neighborhood slug
export const formatNeighborhoodSlug = (neighborhood: string) => 
  neighborhood.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

// Format name from slug
export const formatNameFromSlug = (slug: string) =>
  slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
