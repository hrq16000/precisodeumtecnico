// Bairros dedicados por serviço em cidades da Região Metropolitana de Curitiba
// (São José dos Pinhais e Pinhais). Cada bairro traz contexto local exclusivo
// para Wi-Fi, Smart TV e (Pinhais) Troca de Tela — evitando duplicidade para o Google.
//
// Estrutura reaproveitada pela página unificada src/pages/ServicoBairroCidadeRegiao.tsx.

export type CidadeRegiaoBairroSlug = "sao-jose-dos-pinhais" | "pinhais";

export type ServicoBairroRegiaoKey =
  | "reparo-smart-tv"
  | "configuracao-wifi"
  | "troca-de-tela-tv";

export interface BairroRegiaoContent {
  slug: string;
  nome: string;
  perfil: string;
  wifiIntro: string;
  wifiDestaque: string;
  tvIntro: string;
  tvLogistica: string;
  telaIntro?: string;   // usado apenas em Pinhais (rota /troca-de-tela-tv/pinhais/:bairro)
  telaLogistica?: string;
}

// ============ São José dos Pinhais ============
const SJP: BairroRegiaoContent[] = [
  {
    slug: "centro",
    nome: "Centro",
    perfil: "Coração comercial de SJP, com edifícios residenciais mistos, escritórios de advocacia, clínicas e comércio de rua movimentado ao redor da Praça 8 de Janeiro.",
    wifiIntro: "No Centro de SJP, o cenário típico é apartamento em prédio com laje pesada e escritório compartilhando roteador com residência.",
    wifiDestaque: "Ajustamos canais para conviver com dezenas de redes vizinhas e separamos rede administrativa da rede de visitantes em pequenos escritórios.",
    tvIntro: "Coletas de Smart TVs 50\"–55\" em edifícios com garagem restrita são maioria — combinamos horário fora do pico para respeitar o condomínio.",
    tvLogistica: "Coleta com veículo próprio saindo de Curitiba pela Linha Verde; devolução com reinstalação no suporte original e teste de apps ao vivo.",
  },
  {
    slug: "afonso-pena",
    nome: "Afonso Pena",
    perfil: "Bairro próximo ao Aeroporto Afonso Pena, com forte perfil residencial familiar e presença de empresas de logística e turismo.",
    wifiIntro: "Em Afonso Pena, muitos chamados envolvem sobrados de dois andares onde o Wi-Fi da operadora não vence o segundo pavimento.",
    wifiDestaque: "Instalamos mesh de 2 pontos com backhaul cabeado quando possível e otimizamos a rede para conviver com o Wi-Fi denso das ruas próximas ao terminal.",
    tvIntro: "Coletas frequentes de Smart TVs 50\"–65\" com apps travando ou tela com listras — muitas Samsung e LG das linhas 2019–2022.",
    tvLogistica: "Coleta em D+1 na maioria das semanas; embalagem em caixa de espuma para o transporte até a bancada em Curitiba.",
  },
  {
    slug: "cidade-jardim",
    nome: "Cidade Jardim",
    perfil: "Um dos bairros que mais cresce em SJP, com condomínios verticais recentes e famílias jovens em home office.",
    wifiIntro: "Cidade Jardim tem muitos apartamentos de 3 quartos onde a reunião de vídeo no escritório concorre com streaming 4K na sala.",
    wifiDestaque: "Configuramos QoS priorizando videochamadas e criamos rede dedicada para IoT (câmeras, assistentes, TVs) em VLAN separada.",
    tvIntro: "Smart TVs QLED 55\"–65\" instaladas em painéis de rack central — pedimos foto do suporte antes da coleta para levar as ferramentas certas.",
    tvLogistica: "Janelas de coleta em fim de tarde para quem trabalha em casa; devolução com montagem no rack original.",
  },
  {
    slug: "guatupe",
    nome: "Guatupê",
    perfil: "Bairro residencial e comercial ao sul do centro de SJP, com forte demanda por internet bem configurada em residências horizontais.",
    wifiIntro: "Em Guatupê, casas de esquina com muros altos e portão eletrônico causam interferência frequente no Wi-Fi da entrada.",
    wifiDestaque: "Reposicionamos o roteador para longe do quadro elétrico e do portão; instalamos mesh quando há laje ou parede pesada dividindo os ambientes.",
    tvIntro: "Coletas de Smart TVs de 43\"–55\" com apps travando ou reset frequente. Muitos aparelhos entre 3 e 5 anos que ainda compensam reparar.",
    tvLogistica: "Coleta com carro próprio; sem taxa extra dentro do Guatupê, comunicação por WhatsApp durante toda a coleta.",
  },
  {
    slug: "sao-cristovao",
    nome: "São Cristóvão",
    perfil: "Bairro com grande concentração residencial familiar, muitas casas com quintal e comércio de bairro consolidado.",
    wifiIntro: "Em São Cristóvão, o típico chamado é troca de roteador antigo que já não aguenta a velocidade contratada da fibra.",
    wifiDestaque: "Testamos primeiro o link real da operadora — se o roteador atual é o gargalo, recomendamos modelo específico Wi-Fi 6 sem markup.",
    tvIntro: "Volume alto de Smart TVs 43\"–55\" com tela quebrada por queda ou apps que sumiram após atualização de firmware.",
    tvLogistica: "Coleta em D+1 ou D+2 com carro próprio; devolução com teste ao vivo de Netflix, YouTube, Prime e Globoplay.",
  },
  {
    slug: "boneca-do-iguacu",
    nome: "Boneca do Iguaçu",
    perfil: "Bairro de perfil residencial e pequeno comércio, com muitas casas de padrão médio e presença crescente de home offices.",
    wifiIntro: "Na Boneca do Iguaçu, casas antigas com fiação elétrica de alumínio próximas ao roteador causam quedas de sinal frequentes.",
    wifiDestaque: "Reposicionamos o roteador para longe da entrada de energia e revisamos as câmeras Wi-Fi, que costumam cair quando o roteador principal reinicia.",
    tvIntro: "Coletas de Smart TVs 50\"–55\" com painel trincado ou apps travando — atendemos com foto do serial antes da coleta.",
    tvLogistica: "Coleta com carro próprio; embalagem sob medida e retorno com nota fiscal e garantia escrita de 90 dias na mão de obra.",
  },
];

// ============ Pinhais ============
const PINHAIS: BairroRegiaoContent[] = [
  {
    slug: "centro",
    nome: "Centro",
    perfil: "Centro comercial de Pinhais, com forte movimento na Av. Rui Barbosa, mistura de comércios, escritórios e residências verticais.",
    wifiIntro: "No Centro de Pinhais, os chamados de Wi-Fi vêm principalmente de comércios que compraram roteador comum para uso profissional.",
    wifiDestaque: "Instalamos roteador com QoS e separamos rede da equipe da rede de clientes; revisamos impressora em rede, segunda maior fonte de reclamação depois de vídeo travado.",
    tvIntro: "Coletas de Smart TVs 50\"–65\" tanto residenciais quanto de comércios (bares e restaurantes com TV para transmissão de jogos).",
    tvLogistica: "Coleta com veículo próprio; deslocamento curto (menos de 20 min do centro de Curitiba) permite janelas D+0 quando aprovado até 11h.",
    telaIntro: "TVs comerciais com tela quebrada em bares e restaurantes do Centro têm demanda constante — avaliamos honestamente se compensa trocar o painel.",
    telaLogistica: "Coleta imediata para comércios com transmissão de jogos; buscamos peça original e devolvemos com garantia escrita.",
  },
  {
    slug: "weissopolis",
    nome: "Weissópolis",
    perfil: "Bairro residencial familiar em crescimento, com muitas casas horizontais amplas e ruas arborizadas.",
    wifiIntro: "Em Weissópolis, casas de 200 m²+ com quintal e área gourmet exigem cobertura Wi-Fi além do escritório principal.",
    wifiDestaque: "Instalamos mesh de 2 ou 3 pontos com backhaul cabeado leve por conduíte existente; opcionalmente ponto externo IP65 na área gourmet.",
    tvIntro: "Coletas de Smart TVs 55\"–65\" de home theater — perfil de família com múltiplas TVs em quartos e sala.",
    tvLogistica: "Coleta com carro próprio direto na porta da casa; janelas D+0 ou D+1 conforme aprovação.",
    telaIntro: "TVs OLED e QLED com tela trincada por queda ou impacto — avaliamos custo real de troca de painel antes de qualquer cobrança maior.",
    telaLogistica: "Coleta com equipe de 2 técnicos para TVs 65\"+; embalagem sob medida e devolução com instalação no suporte original.",
  },
  {
    slug: "emiliano-perneta",
    nome: "Emiliano Perneta",
    perfil: "Bairro residencial e comercial misto, próximo ao Centro, com forte demanda por internet estável em pequenos comércios e residências.",
    wifiIntro: "Em Emiliano Perneta, o cenário típico é apartamento em prédio de 4 andares onde o roteador da operadora fica exposto no hall.",
    wifiDestaque: "Reposicionamos o roteador para o interior do imóvel e ajustamos canal para escapar da poluição de Wi-Fi dos vizinhos.",
    tvIntro: "Coletas de Smart TVs 43\"–55\" com apps travando ou tela com listras. Muitos aparelhos entre 3 e 5 anos.",
    tvLogistica: "Coleta com carro próprio; devolução com teste ao vivo dos apps que você usa e reset das configurações de imagem.",
    telaIntro: "Tela trincada em TVs 43\"–55\" — modelos de linha média onde a análise honesta é essencial (às vezes não compensa trocar).",
    telaLogistica: "Diagnóstico com foto e serial antes da coleta; orçamento fechado sem surpresas.",
  },
  {
    slug: "alto-taruma",
    nome: "Alto Tarumã",
    perfil: "Bairro tranquilo de perfil residencial, com muitas casas horizontais de padrão médio-alto e presença de home offices consolidados.",
    wifiIntro: "No Alto Tarumã, casas de dois andares com laje maciça e telhado alto criam sombras de sinal no segundo pavimento.",
    wifiDestaque: "Instalamos mesh cabeado quando os conduítes permitem; caso contrário, backhaul via powerline em imóveis com fiação recente.",
    tvIntro: "Coletas de Smart TVs 55\"–65\" com apps travando ou Wi-Fi da TV que não conecta — típico de LG webOS e Samsung Tizen 2020+.",
    tvLogistica: "Coleta com carro próprio; janelas de coleta combinadas por WhatsApp; sem taxa extra dentro do bairro.",
    telaIntro: "TVs com painel trincado ou manchado — avaliação honesta de custo-benefício da troca de painel antes de fechar orçamento.",
    telaLogistica: "Coleta agendada com embalagem sob medida para TVs 65\"+; retorno com garantia de 90 dias na mão de obra.",
  },
  {
    slug: "maria-antonieta",
    nome: "Maria Antonieta",
    perfil: "Bairro residencial familiar com muitas casas e pequenos condomínios, próximo à divisa com Curitiba.",
    wifiIntro: "Em Maria Antonieta, o problema recorrente é o roteador único cobrindo casa de dois andares com quintal e escritório separado.",
    wifiDestaque: "Instalamos mesh de 2 pontos e integramos câmeras Wi-Fi à rede sem que uma coisa derrube a outra em atualização.",
    tvIntro: "Coletas de Smart TVs 43\"–55\" com apps travando após atualização ou tela com problemas — geralmente resolvidos em 5 a 10 dias úteis.",
    tvLogistica: "Coleta com carro próprio saindo de Curitiba; sem taxa extra dentro do bairro, comunicação por WhatsApp durante toda a coleta.",
    telaIntro: "Tela quebrada em TVs 43\"–55\" — modelos onde a troca de painel só faz sentido em casos específicos que explicamos antes.",
    telaLogistica: "Diagnóstico honesto com foto do serial e cotação real do painel antes de qualquer cobrança maior.",
  },
];

export const BAIRROS_BY_CIDADE: Record<CidadeRegiaoBairroSlug, BairroRegiaoContent[]> = {
  "sao-jose-dos-pinhais": SJP,
  pinhais: PINHAIS,
};

export function getBairroCidadeRegiao(
  cidade: CidadeRegiaoBairroSlug,
  bairroSlug: string,
): BairroRegiaoContent | undefined {
  return BAIRROS_BY_CIDADE[cidade]?.find((b) => b.slug === bairroSlug);
}

export function getBairrosVizinhosCidade(
  cidade: CidadeRegiaoBairroSlug,
  bairroSlug: string,
  limit = 4,
): BairroRegiaoContent[] {
  return (BAIRROS_BY_CIDADE[cidade] ?? [])
    .filter((b) => b.slug !== bairroSlug)
    .slice(0, limit);
}

export const CIDADE_REGIAO_META: Record<CidadeRegiaoBairroSlug, {
  nome: string;
  services: ServicoBairroRegiaoKey[];
}> = {
  "sao-jose-dos-pinhais": {
    nome: "São José dos Pinhais",
    services: ["reparo-smart-tv", "configuracao-wifi"],
  },
  pinhais: {
    nome: "Pinhais",
    services: ["reparo-smart-tv", "configuracao-wifi", "troca-de-tela-tv"],
  },
};
