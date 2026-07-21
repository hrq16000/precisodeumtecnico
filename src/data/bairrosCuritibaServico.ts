// Conteúdo exclusivo por bairro de Curitiba para páginas de serviço (Wi-Fi e Smart TV).
// Cada bairro traz contexto local real (perfil habitacional, tipo de imóvel, desafios
// de rede/logística) para evitar páginas duplicadas para o Google.

export type ServiceKey = "reparo-smart-tv" | "configuracao-wifi";

export interface BairroServicoContent {
  slug: string;              // slug do bairro (lowercase, sem acento)
  nome: string;              // nome do bairro para exibição
  perfil: string;            // 1-2 frases sobre o perfil habitacional/comercial
  wifiIntro: string;         // parágrafo específico para Wi-Fi
  wifiDestaque: string;      // desafio técnico típico do bairro para Wi-Fi
  tvIntro: string;           // parágrafo específico para Smart TV
  tvLogistica: string;       // observação de coleta/logística no bairro
}

export const BAIRROS_CURITIBA_SERVICO: BairroServicoContent[] = [
  {
    slug: "batel",
    nome: "Batel",
    perfil: "Bairro nobre com forte concentração de apartamentos de alto padrão e coberturas duplex, além de escritórios e clínicas na Comendador Araújo.",
    wifiIntro:
      "No Batel, quase todo chamado de Wi-Fi envolve apartamento com estrutura de concreto pesada e vários dispositivos IoT (TVs 4K, câmeras, campainhas inteligentes, assistentes de voz).",
    wifiDestaque:
      "O problema recorrente é o roteador da operadora colocado na entrada do apartamento, deixando quartos e áreas gourmet sem sinal. Instalamos mesh de 2 a 3 pontos e ajustamos canais para conviver com o Wi-Fi dos vizinhos, que costuma poluir a faixa 2.4 GHz.",
    tvIntro:
      "Coletas de Smart TV no Batel são majoritariamente em edifícios com portaria 24h e elevador de serviço — nossa logística já está adaptada a esse fluxo.",
    tvLogistica:
      "Retiramos a TV no dia agendado sem que você precise carregá-la até a garagem: o técnico sobe no seu andar, embala com espuma protetora e devolve montada no suporte após o reparo.",
  },
  {
    slug: "bigorrilho",
    nome: "Bigorrilho",
    perfil: "Bairro verticalizado com edifícios altos ao longo da Vicente Machado e da Champagnat, com muitas famílias jovens e home offices.",
    wifiIntro:
      "No Bigorrilho, home offices em apartamentos de 3 quartos são o cenário mais comum — dá-se muito conflito entre reunião de vídeo no escritório e streaming 4K na sala.",
    wifiDestaque:
      "Fazemos análise de canais com espectro para escapar da poluição de Wi-Fi dos edifícios vizinhos e priorizamos o VLAN/QoS para chamadas de trabalho não caírem quando outros dispositivos baixam atualizações.",
    tvIntro:
      "Smart TVs de 55\" e 65\" instaladas em painéis de rack central são maioria — pedimos foto do suporte antes da coleta para levar as ferramentas corretas.",
    tvLogistica:
      "Coleta no seu horário (fazemos janelas em fim de tarde para quem trabalha em casa). Cada TV é acomodada em caixa de espuma para o transporte até a bancada em Curitiba.",
  },
  {
    slug: "agua-verde",
    nome: "Água Verde",
    perfil: "Um dos bairros mais populosos de Curitiba, com mistura de casas antigas, condomínios verticais e comércio local movimentado.",
    wifiIntro:
      "No Água Verde, o típico chamado é sobrepor um roteador antigo com um mesh moderno em casas de 2 andares ou apartamentos com muitas paredes de alvenaria pesada.",
    wifiDestaque:
      "Diagnosticamos ponto a ponto se o gargalo está na operadora (link) ou no roteador (cobertura). Muitas casas do bairro ainda usam o modem antigo da NET/Vivo, que perde performance acima de 300 Mbps — recomendamos a troca só quando faz diferença real.",
    tvIntro:
      "Grande volume de coletas de TVs de 50\"–55\" com painel trincado ou apps travando, geralmente Samsung e LG das linhas 2018–2021.",
    tvLogistica:
      "Coleta com veículo próprio, sem taxa extra dentro do Água Verde. Você recebe foto da TV chegando em bancada, com etiqueta e serial cadastrados.",
  },
  {
    slug: "cabral",
    nome: "Cabral",
    perfil: "Bairro tradicional próximo ao Boa Vista, com casas de padrão médio-alto, muitos consultórios e residências horizontais amplas.",
    wifiIntro:
      "No Cabral, as casas são grandes (200–350 m²) e o roteador único no escritório raramente cobre o quintal, a área gourmet e o segundo andar.",
    wifiDestaque:
      "Instalamos mesh cabeado ou passamos um cabo Ethernet leve por conduíte existente para levar sinal ao ponto crítico. Também revisamos as câmeras de segurança que costumam ficar sem rede quando o roteador cai.",
    tvIntro:
      "Muitas coletas de Smart TVs grandes (65\"–75\") de home theaters em Cabral — atendemos com equipe de dois técnicos para retirada segura.",
    tvLogistica:
      "Coleta agendada com carro dedicado e caixa de espuma sob medida para TVs 65\"+; devolução com reinstalação no suporte original.",
  },
  {
    slug: "centro",
    nome: "Centro",
    perfil: "Coração comercial de Curitiba, com edifícios residenciais mistos, escritórios, comércios de rua e alta densidade de dispositivos.",
    wifiIntro:
      "No Centro, o Wi-Fi sofre com poluição eletromagnética altíssima — dezenas de redes disputam o mesmo canal em cada edifício.",
    wifiDestaque:
      "Fazemos varredura de espectro e configuramos o roteador para uso preferencial de 5 GHz nos dispositivos críticos. Em escritórios, separamos rede de visitantes da rede administrativa para evitar lentidão em horário comercial.",
    tvIntro:
      "No Centro, atendemos tanto residências em edifícios antigos quanto salas comerciais com TVs de sinalização digital travando ou sem apps.",
    tvLogistica:
      "Coleta em edifícios com estacionamento restrito: combinamos horário de baixa movimentação para respeitar as regras do condomínio.",
  },
  {
    slug: "ecoville",
    nome: "Ecoville",
    perfil: "Região de expansão nobre com edifícios recentes, muitos apartamentos com automação residencial e áreas de lazer completas.",
    wifiIntro:
      "No Ecoville, o desafio típico é integrar a automação residencial (iluminação inteligente, cortinas, ar-condicionado Wi-Fi) com a rede da operadora, que raramente é dimensionada para isso.",
    wifiDestaque:
      "Configuramos uma rede dedicada para IoT em VLAN separada, garantindo que a atualização de firmware de uma câmera não derrube a reunião de vídeo. Alinhamos com o portaria/central quando é rede de condomínio compartilhada.",
    tvIntro:
      "Smart TVs QLED e OLED de 65\"+ são comuns no Ecoville — trabalhamos com peças originais Samsung, LG e Sony e explicamos previamente quando não vale a pena o reparo.",
    tvLogistica:
      "Coleta em edifícios com elevador de serviço e regra de agendamento formal; nós preenchemos a autorização junto ao zelador se você preferir.",
  },
  {
    slug: "portao",
    nome: "Portão",
    perfil: "Bairro com forte presença de comércio, farmácias, escritórios e residências de padrão médio, com muitos edifícios dos anos 90 e 2000.",
    wifiIntro:
      "No Portão, o Wi-Fi problemático quase sempre está em apartamento reformado com paredes que somaram divisórias, criando pontos cegos no fundo do imóvel.",
    wifiDestaque:
      "Diagnosticamos com heatmap e definimos se compensa instalar um segundo ponto de acesso ou reposicionar o roteador principal — evitando o gasto desnecessário com equipamento novo.",
    tvIntro:
      "Muitos chamados no Portão são de Smart TVs de 50\" travando após atualização de firmware ou com apps que sumiram — geralmente resolvemos com bancada e reflash em 5 a 10 dias úteis.",
    tvLogistica:
      "Coleta com veículo próprio; retorno da TV com instalação e teste ao vivo dos apps que você usa (Netflix, YouTube, Prime, Globoplay).",
  },
  {
    slug: "reboucas",
    nome: "Rebouças",
    perfil: "Bairro central com muitos escritórios, coworkings, clínicas e residências mistas próximas ao Centro Cívico e à rodoferroviária.",
    wifiIntro:
      "No Rebouças, atendemos muitos escritórios pequenos e coworkings que compraram um roteador comum para uso profissional — e sofrem com quedas em horário comercial.",
    wifiDestaque:
      "Recomendamos roteador com QoS e Wi-Fi 6, e separamos rede de visitantes da rede da equipe. Também revisamos a impressora em rede, que é a segunda maior fonte de reclamação depois da videochamada travada.",
    tvIntro:
      "Em residências do Rebouças, o padrão é TV de 50\" a 55\" com apps travando ou reiniciando — reparo em bancada de 5 a 10 dias.",
    tvLogistica:
      "Coleta agendada com faixa de horário compatível com edifícios antigos que exigem entrada pelo serviço.",
  },
  {
    slug: "boa-vista",
    nome: "Boa Vista",
    perfil: "Bairro extenso com muitas casas horizontais, praças e comércio local — perfil familiar com moradores de longa data.",
    wifiIntro:
      "No Boa Vista, a maioria das casas tem 2 pavimentos e o roteador central da operadora não cobre a suíte do segundo andar nem a churrasqueira nos fundos.",
    wifiDestaque:
      "Instalamos mesh cabeado sempre que possível, aproveitando conduítes de câmeras existentes. Se a casa tem cerca eletrificada ou portão automático próximo ao roteador, ajustamos o posicionamento para eliminar interferência.",
    tvIntro:
      "Coletas de Smart TVs mais antigas (2016–2020) são comuns no Boa Vista — muitos moradores preferem consertar a comprar nova, e nós ajudamos a decidir com honestidade.",
    tvLogistica:
      "Coleta com carro próprio até a porta da casa; sem taxa extra dentro do bairro.",
  },
  {
    slug: "champagnat",
    nome: "Champagnat",
    perfil: "Bairro nobre com edifícios altos, muita área verde e residências de alto padrão próximas ao Parque Barigui.",
    wifiIntro:
      "No Champagnat, apartamentos de 4 quartos com escritório e área gourmet são padrão — e todos exigem cobertura Wi-Fi 5 GHz completa para funcionar bem com Smart TVs 4K e videochamadas simultâneas.",
    wifiDestaque:
      "Instalamos mesh de 3 pontos com backhaul dedicado e configuramos rede exclusiva para IoT (câmeras, campainha, ar-condicionado inteligente). Ajustamos DNS local para acelerar acesso a serviços de streaming.",
    tvIntro:
      "Muitas TVs OLED e QLED de 65\"–77\" com painéis originais — sempre validamos disponibilidade de peça no distribuidor antes de fechar orçamento para evitar surpresas.",
    tvLogistica:
      "Coleta com equipe de dois técnicos, embalagem sob medida e devolução com calibração básica de imagem/som.",
  },
];

export function getBairroServicoContent(slug: string): BairroServicoContent | undefined {
  return BAIRROS_CURITIBA_SERVICO.find((b) => b.slug === slug);
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
