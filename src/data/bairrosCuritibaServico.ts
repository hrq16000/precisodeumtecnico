// Conteúdo exclusivo por bairro de Curitiba para páginas de serviço (Wi-Fi e Smart TV).
// Cada bairro traz contexto local real (perfil habitacional, tipo de imóvel, desafios
// de rede/logística) para evitar páginas duplicadas para o Google.
//
// A partir da rodada 27.4, o dataset inclui também bairros de segunda camada e um
// agrupamento regional usado pelo bloco "Bairros vizinhos" em ServicoBairroCuritiba.

export type ServiceKey = "reparo-smart-tv" | "configuracao-wifi";
export type BairroRegiao = "central" | "sul" | "norte" | "oeste" | "leste";

export interface BairroServicoContent {
  slug: string;
  nome: string;
  regiao: BairroRegiao;
  perfil: string;
  wifiIntro: string;
  wifiDestaque: string;
  tvIntro: string;
  tvLogistica: string;
}

export const BAIRROS_CURITIBA_SERVICO: BairroServicoContent[] = [
  // ============ 1ª camada (bairros de maior demanda) ============
  {
    slug: "batel",
    nome: "Batel",
    regiao: "oeste",
    perfil: "Bairro nobre com forte concentração de apartamentos de alto padrão e coberturas duplex, além de escritórios e clínicas na Comendador Araújo.",
    wifiIntro: "No Batel, quase todo chamado de Wi-Fi envolve apartamento com estrutura de concreto pesada e vários dispositivos IoT (TVs 4K, câmeras, campainhas inteligentes, assistentes de voz).",
    wifiDestaque: "O problema recorrente é o roteador da operadora colocado na entrada do apartamento, deixando quartos e áreas gourmet sem sinal. Instalamos mesh de 2 a 3 pontos e ajustamos canais para conviver com o Wi-Fi dos vizinhos, que costuma poluir a faixa 2.4 GHz.",
    tvIntro: "Coletas de Smart TV no Batel são majoritariamente em edifícios com portaria 24h e elevador de serviço — nossa logística já está adaptada a esse fluxo.",
    tvLogistica: "Retiramos a TV no dia agendado sem que você precise carregá-la até a garagem: o técnico sobe no seu andar, embala com espuma protetora e devolve montada no suporte após o reparo.",
  },
  {
    slug: "bigorrilho",
    nome: "Bigorrilho",
    regiao: "oeste",
    perfil: "Bairro verticalizado com edifícios altos ao longo da Vicente Machado e da Champagnat, com muitas famílias jovens e home offices.",
    wifiIntro: "No Bigorrilho, home offices em apartamentos de 3 quartos são o cenário mais comum — dá-se muito conflito entre reunião de vídeo no escritório e streaming 4K na sala.",
    wifiDestaque: "Fazemos análise de canais com espectro para escapar da poluição de Wi-Fi dos edifícios vizinhos e priorizamos o VLAN/QoS para chamadas de trabalho não caírem quando outros dispositivos baixam atualizações.",
    tvIntro: "Smart TVs de 55\" e 65\" instaladas em painéis de rack central são maioria — pedimos foto do suporte antes da coleta para levar as ferramentas corretas.",
    tvLogistica: "Coleta no seu horário (fazemos janelas em fim de tarde para quem trabalha em casa). Cada TV é acomodada em caixa de espuma para o transporte até a bancada em Curitiba.",
  },
  {
    slug: "agua-verde",
    nome: "Água Verde",
    regiao: "sul",
    perfil: "Um dos bairros mais populosos de Curitiba, com mistura de casas antigas, condomínios verticais e comércio local movimentado.",
    wifiIntro: "No Água Verde, o típico chamado é sobrepor um roteador antigo com um mesh moderno em casas de 2 andares ou apartamentos com muitas paredes de alvenaria pesada.",
    wifiDestaque: "Diagnosticamos ponto a ponto se o gargalo está na operadora (link) ou no roteador (cobertura). Muitas casas do bairro ainda usam o modem antigo da NET/Vivo, que perde performance acima de 300 Mbps — recomendamos a troca só quando faz diferença real.",
    tvIntro: "Grande volume de coletas de TVs de 50\"–55\" com painel trincado ou apps travando, geralmente Samsung e LG das linhas 2018–2021.",
    tvLogistica: "Coleta com veículo próprio, sem taxa extra dentro do Água Verde. Você recebe foto da TV chegando em bancada, com etiqueta e serial cadastrados.",
  },
  {
    slug: "cabral",
    nome: "Cabral",
    regiao: "norte",
    perfil: "Bairro tradicional próximo ao Boa Vista, com casas de padrão médio-alto, muitos consultórios e residências horizontais amplas.",
    wifiIntro: "No Cabral, as casas são grandes (200–350 m²) e o roteador único no escritório raramente cobre o quintal, a área gourmet e o segundo andar.",
    wifiDestaque: "Instalamos mesh cabeado ou passamos um cabo Ethernet leve por conduíte existente para levar sinal ao ponto crítico. Também revisamos as câmeras de segurança que costumam ficar sem rede quando o roteador cai.",
    tvIntro: "Muitas coletas de Smart TVs grandes (65\"–75\") de home theaters em Cabral — atendemos com equipe de dois técnicos para retirada segura.",
    tvLogistica: "Coleta agendada com carro dedicado e caixa de espuma sob medida para TVs 65\"+; devolução com reinstalação no suporte original.",
  },
  {
    slug: "centro",
    nome: "Centro",
    regiao: "central",
    perfil: "Coração comercial de Curitiba, com edifícios residenciais mistos, escritórios, comércios de rua e alta densidade de dispositivos.",
    wifiIntro: "No Centro, o Wi-Fi sofre com poluição eletromagnética altíssima — dezenas de redes disputam o mesmo canal em cada edifício.",
    wifiDestaque: "Fazemos varredura de espectro e configuramos o roteador para uso preferencial de 5 GHz nos dispositivos críticos. Em escritórios, separamos rede de visitantes da rede administrativa para evitar lentidão em horário comercial.",
    tvIntro: "No Centro, atendemos tanto residências em edifícios antigos quanto salas comerciais com TVs de sinalização digital travando ou sem apps.",
    tvLogistica: "Coleta em edifícios com estacionamento restrito: combinamos horário de baixa movimentação para respeitar as regras do condomínio.",
  },
  {
    slug: "ecoville",
    nome: "Ecoville",
    regiao: "oeste",
    perfil: "Região de expansão nobre com edifícios recentes, muitos apartamentos com automação residencial e áreas de lazer completas.",
    wifiIntro: "No Ecoville, o desafio típico é integrar a automação residencial (iluminação inteligente, cortinas, ar-condicionado Wi-Fi) com a rede da operadora, que raramente é dimensionada para isso.",
    wifiDestaque: "Configuramos uma rede dedicada para IoT em VLAN separada, garantindo que a atualização de firmware de uma câmera não derrube a reunião de vídeo. Alinhamos com o portaria/central quando é rede de condomínio compartilhada.",
    tvIntro: "Smart TVs QLED e OLED de 65\"+ são comuns no Ecoville — trabalhamos com peças originais Samsung, LG e Sony e explicamos previamente quando não vale a pena o reparo.",
    tvLogistica: "Coleta em edifícios com elevador de serviço e regra de agendamento formal; nós preenchemos a autorização junto ao zelador se você preferir.",
  },
  {
    slug: "portao",
    nome: "Portão",
    regiao: "sul",
    perfil: "Bairro com forte presença de comércio, farmácias, escritórios e residências de padrão médio, com muitos edifícios dos anos 90 e 2000.",
    wifiIntro: "No Portão, o Wi-Fi problemático quase sempre está em apartamento reformado com paredes que somaram divisórias, criando pontos cegos no fundo do imóvel.",
    wifiDestaque: "Diagnosticamos com heatmap e definimos se compensa instalar um segundo ponto de acesso ou reposicionar o roteador principal — evitando o gasto desnecessário com equipamento novo.",
    tvIntro: "Muitos chamados no Portão são de Smart TVs de 50\" travando após atualização de firmware ou com apps que sumiram — geralmente resolvemos com bancada e reflash em 5 a 10 dias úteis.",
    tvLogistica: "Coleta com veículo próprio; retorno da TV com instalação e teste ao vivo dos apps que você usa (Netflix, YouTube, Prime, Globoplay).",
  },
  {
    slug: "reboucas",
    nome: "Rebouças",
    regiao: "central",
    perfil: "Bairro central com muitos escritórios, coworkings, clínicas e residências mistas próximas ao Centro Cívico e à rodoferroviária.",
    wifiIntro: "No Rebouças, atendemos muitos escritórios pequenos e coworkings que compraram um roteador comum para uso profissional — e sofrem com quedas em horário comercial.",
    wifiDestaque: "Recomendamos roteador com QoS e Wi-Fi 6, e separamos rede de visitantes da rede da equipe. Também revisamos a impressora em rede, que é a segunda maior fonte de reclamação depois da videochamada travada.",
    tvIntro: "Em residências do Rebouças, o padrão é TV de 50\" a 55\" com apps travando ou reiniciando — reparo em bancada de 5 a 10 dias.",
    tvLogistica: "Coleta agendada com faixa de horário compatível com edifícios antigos que exigem entrada pelo serviço.",
  },
  {
    slug: "boa-vista",
    nome: "Boa Vista",
    regiao: "norte",
    perfil: "Bairro extenso com muitas casas horizontais, praças e comércio local — perfil familiar com moradores de longa data.",
    wifiIntro: "No Boa Vista, a maioria das casas tem 2 pavimentos e o roteador central da operadora não cobre a suíte do segundo andar nem a churrasqueira nos fundos.",
    wifiDestaque: "Instalamos mesh cabeado sempre que possível, aproveitando conduítes de câmeras existentes. Se a casa tem cerca eletrificada ou portão automático próximo ao roteador, ajustamos o posicionamento para eliminar interferência.",
    tvIntro: "Coletas de Smart TVs mais antigas (2016–2020) são comuns no Boa Vista — muitos moradores preferem consertar a comprar nova, e nós ajudamos a decidir com honestidade.",
    tvLogistica: "Coleta com carro próprio até a porta da casa; sem taxa extra dentro do bairro.",
  },
  {
    slug: "merces",
    nome: "Mercês",
    regiao: "central",
    perfil: "Bairro tradicional de perfil residencial-comercial ao norte do Centro, com edifícios antigos altos, muitos escritórios de profissionais liberais e famílias consolidadas.",
    wifiIntro: "Nas Mercês, o cenário típico é apartamento antigo de 3 a 4 dormitórios com paredes internas de tijolo maciço, onde o sinal 5 GHz do roteador único mal atravessa dois cômodos.",
    wifiDestaque: "Instalamos mesh Wi-Fi 6 com backhaul cabeado por conduítes de telefonia existentes e separamos rede administrativa do consultório da rede residencial em imóveis mistos.",
    tvIntro: "Coletas frequentes de Smart TVs 50\"–65\" com apps travando após atualização, muitas Samsung e LG das linhas 2020–2022 instaladas em painéis de rack.",
    tvLogistica: "Coleta com carro próprio saindo do Centro; janelas D+0 ou D+1 e devolução com reinstalação no suporte original, sem taxa extra dentro do bairro.",
  },

  // ============ 2ª camada (bairros complementares) ============
  {
    slug: "cristo-rei",
    nome: "Cristo Rei",
    regiao: "central",
    perfil: "Bairro universitário próximo à UTFPR e ao Centro Politécnico, com muitas repúblicas, kitnets e apartamentos de aluguel.",
    wifiIntro: "No Cristo Rei, é comum o mesmo apartamento ter 3 a 5 pessoas em videoconferência e streaming simultaneamente — o Wi-Fi básico da operadora não sustenta.",
    wifiDestaque: "Configuramos QoS por dispositivo e trocamos para faixas menos poluídas de 5 GHz. Muitas vezes, apenas reorganizar canais e afastar o roteador do micro-ondas já resolve.",
    tvIntro: "Smart TVs de 40\"–50\" de repúblicas com apps travando pós-atualização são a maior parte dos chamados. Reparo de firmware em bancada em 5 a 10 dias.",
    tvLogistica: "Coleta em prédios sem elevador de serviço é comum — combinamos horário de baixa movimentação para não atrapalhar vizinhos.",
  },
  {
    slug: "juveve",
    nome: "Juvevê",
    regiao: "central",
    perfil: "Bairro tradicional próximo ao Passeio Público, com muitas residências horizontais antigas e edifícios baixos de 4 a 8 andares.",
    wifiIntro: "No Juvevê, o Wi-Fi problemático quase sempre está em casa antiga com paredes de tijolo maciço, onde o sinal 5 GHz mal atravessa dois cômodos.",
    wifiDestaque: "Recomendamos mesh Wi-Fi 6 com pelo menos 2 pontos e cabo Cat6 pelas caixas de passagem já existentes. Sem obra e sem estender fios pela parede.",
    tvIntro: "Coletas de TVs de 43\"–55\" com apps do Google TV/Android TV travando. Muitos moradores compraram TVs Toshiba/AOC das linhas 2020–2022 que sofrem de eMMC saturada.",
    tvLogistica: "Coleta em residências com garagem estreita — o técnico embala a TV no local antes de levar até o veículo.",
  },
  {
    slug: "alto-da-gloria",
    nome: "Alto da Glória",
    regiao: "central",
    perfil: "Bairro central compacto ao lado do Passeio Público, com edifícios residenciais antigos e mistos, muitos consultórios médicos.",
    wifiIntro: "No Alto da Glória, o desafio típico do Wi-Fi é em consultório/home office com dois roteadores mal configurados na mesma rede, causando conflito de IPs.",
    wifiDestaque: "Reconfiguramos a topologia como bridge/AP para eliminar duplo NAT, e testamos a impressora e leitores fiscais dos consultórios ao final da visita.",
    tvIntro: "Coletas de Smart TVs em edifícios antigos, geralmente TVs de sala de estar de 50\" com sistema Roku ou webOS travando.",
    tvLogistica: "Coleta no elevador social (edifícios sem elevador de serviço) é comum — usamos capa/embalagem que não risca porta ou piso.",
  },
  {
    slug: "alto-da-xv",
    nome: "Alto da XV",
    regiao: "central",
    perfil: "Bairro central residencial próximo à Rua XV, com edifícios verticais recentes e mix de casas antigas em processo de reforma.",
    wifiIntro: "No Alto da XV, apartamentos reformados com drywall interno e sacadas envidraçadas criam pontos cegos de Wi-Fi no quarto principal.",
    wifiDestaque: "Fazemos heatmap com aplicativo profissional e definimos exatamente onde o segundo ponto mesh precisa ficar — evita gasto em equipamentos desnecessários.",
    tvIntro: "Muitas TVs de 55\"–65\" instaladas em painel giratório na sala. Coleta exige retirada cuidadosa do braço articulado.",
    tvLogistica: "Reinstalamos a TV no suporte original e testamos com a mídia da casa (streaming e cabos HDMI).",
  },
  {
    slug: "merces",
    nome: "Mercês",
    regiao: "central",
    perfil: "Bairro tradicional com mistura de casas antigas de padrão médio-alto e edifícios verticais próximos ao Passeio Público.",
    wifiIntro: "Nas Mercês, casas com jardim frontal e área gourmet nos fundos raramente têm sinal Wi-Fi estável em todo o imóvel — o roteador único não vence a metragem.",
    wifiDestaque: "Instalamos mesh cabeado ou reposicionamento estratégico do roteador com extensor no fundo. Também validamos câmeras IP externas que costumam cair junto quando a rede é reiniciada.",
    tvIntro: "Coletas de Smart TVs de 55\"+ com apps travando ou reset frequente. Muitos aparelhos LG e Samsung 2019–2021.",
    tvLogistica: "Coleta com carro próprio até a porta da casa; devolução com teste de todos os apps que você utiliza.",
  },
  {
    slug: "sao-francisco",
    nome: "São Francisco",
    regiao: "central",
    perfil: "Bairro histórico com casarões antigos, edifícios pequenos e forte presença de comércio noturno na Largo da Ordem.",
    wifiIntro: "No São Francisco, muitas residências e bares ainda usam o modem da operadora colado ao vidro da janela — o sinal se perde antes de chegar aos ambientes internos.",
    wifiDestaque: "Reposicionamos o roteador para o centro do imóvel e configuramos rede de visitantes separada quando há uso comercial. Otimizamos canal 2.4/5 GHz para evitar conflito com estabelecimentos vizinhos.",
    tvIntro: "Coletas mistas: Smart TVs residenciais e TVs de bares/restaurantes com problemas de HDMI ou sistema.",
    tvLogistica: "Coleta em imóveis antigos com escada estreita — o técnico faz a retirada com embalagem para não danificar em manobras.",
  },
  {
    slug: "vila-izabel",
    nome: "Vila Izabel",
    regiao: "sul",
    perfil: "Bairro tranquilo próximo ao Água Verde, com casas horizontais de padrão médio e edifícios recentes.",
    wifiIntro: "Na Vila Izabel, casas de 2 andares com laje maciça no piso superior são o cenário mais comum — o sinal 5 GHz simplesmente não sobe.",
    wifiDestaque: "Instalamos mesh com dois pontos (térreo e superior) e usamos backhaul cabeado quando o conduíte permite. Sem obra visível.",
    tvIntro: "Coletas de TVs Samsung/LG de 50\"–55\" com apps travando, muito frequente em modelos 2019–2020.",
    tvLogistica: "Coleta com carro próprio; sem taxa extra dentro da Vila Izabel.",
  },
  {
    slug: "novo-mundo",
    nome: "Novo Mundo",
    regiao: "sul",
    perfil: "Bairro popular e populoso, com muitas residências horizontais, sobrados em condomínios pequenos e comércio ativo.",
    wifiIntro: "No Novo Mundo, o cenário típico é sobrado de 3 pavimentos onde o roteador da operadora fica na sala do 1º andar e não cobre nada acima.",
    wifiDestaque: "Instalamos mesh com backhaul cabeado sempre que possível — usamos os conduítes de telefone/CFTV existentes para evitar quebrar parede.",
    tvIntro: "Volume alto de TVs de 43\"–50\" com apps travando ou tela quebrada. Reparo em bancada com coleta.",
    tvLogistica: "Coleta em ruas com portão automático — combinamos horário para deixar o técnico entrar com facilidade.",
  },
  {
    slug: "xaxim",
    nome: "Xaxim",
    regiao: "sul",
    perfil: "Bairro extenso e popular do sul de Curitiba, com muitas residências horizontais e sobrados familiares.",
    wifiIntro: "No Xaxim, casas de 200 m²+ com quintal grande e área gourmet são padrão — o roteador único não cobre o fundo da casa nem a área da churrasqueira.",
    wifiDestaque: "Instalamos mesh com pontos externos IP65 quando há área gourmet coberta. Ajustamos rede para funcionar com câmeras externas de portão.",
    tvIntro: "Coletas de Smart TVs de 50\"–55\" com apps travando ou tela com listras. Muitos aparelhos entre 3 e 6 anos.",
    tvLogistica: "Coleta com carro próprio; combinamos janela de horário para donos que trabalham fora.",
  },
  {
    slug: "seminario",
    nome: "Seminário",
    regiao: "sul",
    perfil: "Bairro residencial calmo com casas horizontais de padrão médio, próximo ao Parque Barigui.",
    wifiIntro: "No Seminário, casas antigas com paredes grossas e telhado alto criam sombras de Wi-Fi no fundo do imóvel.",
    wifiDestaque: "Ajustamos o roteador para uso preferencial de 2.4 GHz nos dispositivos distantes (câmeras, TVs de quarto) e 5 GHz para dispositivos próximos (notebook, celular do dono).",
    tvIntro: "Coletas de Smart TVs 4K de 55\"–65\" — perfil de família com home theater completo.",
    tvLogistica: "Coleta com equipe de 2 técnicos para TVs grandes; embalagem protetora para transporte seguro.",
  },
  {
    slug: "bacacheri",
    nome: "Bacacheri",
    regiao: "norte",
    perfil: "Bairro amplo do norte de Curitiba com forte perfil residencial familiar, muitas casas com quintal e escritórios em home office.",
    wifiIntro: "No Bacacheri, casas de esquina com muros altos e cercas eletrificadas próximas ao roteador causam interferência frequente.",
    wifiDestaque: "Reposicionamos o roteador para longe da cerca eletrificada e do disjuntor principal. Instalamos mesh para cobrir os quartos e a área externa quando necessário.",
    tvIntro: "Coletas de Smart TVs de 55\"+ com apps travando ou reset frequente. Muitos aparelhos LG webOS.",
    tvLogistica: "Coleta com carro próprio até a porta da casa; sem taxa extra dentro do bairro.",
  },
  {
    slug: "hugo-lange",
    nome: "Hugo Lange",
    regiao: "norte",
    perfil: "Bairro nobre e pequeno, com casas de alto padrão e ruas arborizadas.",
    wifiIntro: "No Hugo Lange, casas de 400 m²+ com escritório, cinema em casa e área gourmet exigem cobertura Wi-Fi completa e prioridade para videoconferência.",
    wifiDestaque: "Instalamos mesh de 3 pontos com backhaul cabeado dedicado. Segregamos IoT em VLAN separada para não competir com trabalho e streaming.",
    tvIntro: "Coletas de Smart TVs OLED 65\"–77\" — cuidado extra na embalagem e sempre 2 técnicos.",
    tvLogistica: "Coleta com veículo dedicado; devolução com calibração básica de imagem/som.",
  },
  {
    slug: "jardim-social",
    nome: "Jardim Social",
    regiao: "norte",
    perfil: "Bairro nobre com residências horizontais amplas, muitas construções de alto padrão e áreas comuns extensas.",
    wifiIntro: "No Jardim Social, casas com piscina, área gourmet coberta e cinema em casa demandam Wi-Fi estável em toda a área externa também.",
    wifiDestaque: "Instalamos mesh externo IP65 na área gourmet e ajustamos rede exclusiva para automação residencial. Configuramos DNS local para acelerar streaming 4K.",
    tvIntro: "Coletas de Smart TVs de home theater — 65\"+ com painéis OLED/QLED. Sempre validamos peça antes de fechar orçamento.",
    tvLogistica: "Equipe de 2 técnicos, embalagem sob medida, devolução com instalação no suporte original.",
  },
  {
    slug: "santa-felicidade",
    nome: "Santa Felicidade",
    regiao: "norte",
    perfil: "Bairro tradicional italiano com casas horizontais amplas, restaurantes e área comercial extensa.",
    wifiIntro: "Em Santa Felicidade, casas grandes de dois andares com laje maciça e telhado alto são o cenário mais comum — o Wi-Fi básico não cobre o segundo pavimento.",
    wifiDestaque: "Instalamos mesh cabeado quando os conduítes permitem; caso contrário, backhaul via powerline em imóveis com fiação recente.",
    tvIntro: "Coletas de Smart TVs de sala de estar e sala de jantar (comum ter duas TVs), 50\"–65\", com apps travando ou tela com problema.",
    tvLogistica: "Coleta com carro próprio; para o bairro consideramos SLA de 24-48h.",
  },
  {
    slug: "cajuru",
    nome: "Cajuru",
    regiao: "leste",
    perfil: "Bairro populoso do leste de Curitiba, com muitas residências horizontais, condomínios de sobrados e comércio ativo.",
    wifiIntro: "No Cajuru, o típico chamado é apartamento em condomínio popular onde o Wi-Fi da operadora não vence 3 paredes de alvenaria pesada.",
    wifiDestaque: "Diagnosticamos com heatmap e, na maioria das vezes, reposicionamento + troca de canal já resolve — sem gasto extra em equipamento novo.",
    tvIntro: "Volume alto de Smart TVs de 43\"–50\" com apps travando ou tela quebrada. Muitos aparelhos entre 2 e 5 anos.",
    tvLogistica: "Coleta com carro próprio; sem taxa extra dentro do Cajuru. Comunicação por WhatsApp durante toda a coleta.",
  },
];

export function getBairroServicoContent(slug: string): BairroServicoContent | undefined {
  return BAIRROS_CURITIBA_SERVICO.find((b) => b.slug === slug);
}

/**
 * Retorna até `limit` bairros da mesma região, excluindo o próprio bairro.
 * Usado pelo bloco "Bairros vizinhos" em ServicoBairroCuritiba para reforçar
 * cross-linking interno por proximidade.
 */
export function getBairrosVizinhos(slug: string, limit = 4): BairroServicoContent[] {
  const current = getBairroServicoContent(slug);
  if (!current) return [];
  return BAIRROS_CURITIBA_SERVICO
    .filter((b) => b.regiao === current.regiao && b.slug !== current.slug)
    .slice(0, limit);
}

export const SERVICO_META: Record<ServiceKey, {
  label: string;
  symptomSlug: string;
  parentPath: string;
  parentLabel: string;
  description: string;
}> = {
  "reparo-smart-tv": {
    label: "Reparo de Smart TV",
    symptomSlug: "tv-smart-travando-apps",
    parentPath: "/servicos/reparo-smart-tv-curitiba",
    parentLabel: "Reparo de Smart TV em Curitiba",
    description: "Diagnóstico em bancada, reset de sistema, reinstalação de firmware, troca de placa principal e módulo Wi-Fi.",
  },
  "configuracao-wifi": {
    label: "Configuração de Wi-Fi",
    symptomSlug: "wifi-lento-instavel",
    parentPath: "/servicos/configuracao-wifi-curitiba",
    parentLabel: "Configuração de Wi-Fi em Curitiba",
    description: "Visita técnica com diagnóstico de cobertura, ajuste de canais, instalação de mesh e integração de dispositivos.",
  },
};

export const REGIAO_LABEL: Record<BairroRegiao, string> = {
  central: "Região central",
  sul: "Região sul",
  norte: "Região norte",
  oeste: "Região oeste / nobre",
  leste: "Região leste",
};
