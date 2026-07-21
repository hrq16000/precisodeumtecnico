// Metadados exclusivos por cidade da Região Metropolitana de Curitiba (RMC)
// para páginas de serviço replicadas (Reparo Smart TV, Troca de Tela TV, Wi-Fi).
// Cada cidade traz contexto real de logística e perfil para não gerar páginas
// duplicadas para o Google.

export type CidadeRegiaoSlug = "sao-jose-dos-pinhais" | "pinhais" | "colombo";

export type CidadeServicoKey =
  | "reparo-smart-tv"
  | "troca-de-tela-tv"
  | "configuracao-wifi";

export interface CidadeRegiaoInfo {
  slug: CidadeRegiaoSlug;
  nome: string;
  perfil: string;              // 1-2 frases de perfil urbano/demográfico
  logistica: string;           // como funciona a coleta/visita nessa cidade
  prazoDeslocamento: string;   // observação real sobre SLA de deslocamento
  bairrosAncora: string[];     // bairros âncora atendidos (aparecem no texto)
  slaBoost: number;            // dias extras vs. Curitiba (visita/coleta)
}

export const CIDADES_REGIAO: CidadeRegiaoInfo[] = [
  {
    slug: "sao-jose-dos-pinhais",
    nome: "São José dos Pinhais",
    perfil:
      "Cidade da região metropolitana com forte perfil residencial e industrial, próxima ao aeroporto Afonso Pena, com muitos bairros verticalizados recentes e outros de casas amplas em condomínios fechados.",
    logistica:
      "Fazemos coleta em SJP com veículo próprio saindo de Curitiba pela BR-277 ou Linha Verde. Para regiões próximas ao aeroporto e Centro de SJP, o atendimento é feito na maioria das semanas em D+1.",
    prazoDeslocamento:
      "Janela de coleta em até 48 horas úteis; visitas técnicas de Wi-Fi agendadas com precisão de manhã ou tarde.",
    bairrosAncora: ["Centro", "Afonso Pena", "Cidade Jardim", "Guatupê", "São Cristóvão"],
    slaBoost: 1,
  },
  {
    slug: "pinhais",
    nome: "Pinhais",
    perfil:
      "Menor cidade em área de todo o país, colada ao lado leste de Curitiba, com forte densidade populacional, comércio ativo na Av. Rui Barbosa e muitas residências horizontais em bairros como Weissópolis e Emiliano Perneta.",
    logistica:
      "Coleta com deslocamento curto (menos de 20 min do centro de Curitiba). Fazemos janelas de coleta no mesmo dia sempre que a triagem é aprovada até 11h.",
    prazoDeslocamento:
      "Janela D+0 ou D+1 para coleta de TVs; visitas de Wi-Fi confirmadas normalmente para o dia seguinte.",
    bairrosAncora: ["Centro", "Weissópolis", "Emiliano Perneta", "Alto Tarumã", "Vargem Grande"],
    slaBoost: 0,
  },
  {
    slug: "colombo",
    nome: "Colombo",
    perfil:
      "Cidade metropolitana ao norte de Curitiba com bairros populosos como Maracanã, Guaraituba e Osasco, mistura de residências horizontais amplas e condomínios recentes na região do Atuba.",
    logistica:
      "Coleta com carro próprio via Contorno Norte. Bairros próximos a Atuba, Guaraituba e Maracanã são atendidos em D+1; bairros mais afastados (São Dimas, Rio Verde) em até 3 dias úteis.",
    prazoDeslocamento:
      "Janela de coleta em até 72 horas úteis; visitas de Wi-Fi combinadas com folga de horário por causa do trânsito da BR-476.",
    bairrosAncora: ["Centro", "Maracanã", "Guaraituba", "Atuba", "Osasco"],
    slaBoost: 2,
  },
];

export function getCidadeRegiao(slug: string): CidadeRegiaoInfo | undefined {
  return CIDADES_REGIAO.find((c) => c.slug === slug);
}

// Meta por serviço para o componente unificado ServicoCidadeRegiao.
export const CIDADE_SERVICO_META: Record<CidadeServicoKey, {
  label: string;
  symptomSlug: string;
  parentPath: string;
  parentLabel: string;
  descricaoCurta: string;
  callToAction: string;
  triagemCategory: string;
}> = {
  "reparo-smart-tv": {
    label: "Reparo de Smart TV",
    symptomSlug: "tv-smart-travando-apps",
    parentPath: "/servicos/reparo-smart-tv-curitiba",
    parentLabel: "Reparo de Smart TV em Curitiba",
    descricaoCurta:
      "Smart TV travando, apps que não abrem, reinício aleatório ou Wi-Fi da TV que não conecta. Reparo em bancada com coleta e devolução.",
    callToAction: "Iniciar triagem de Smart TV",
    triagemCategory: "tv",
  },
  "troca-de-tela-tv": {
    label: "Troca de Tela de TV",
    symptomSlug: "tv-tela-quebrada",
    parentPath: "/servicos/troca-de-tela-tv-curitiba",
    parentLabel: "Troca de Tela de TV em Curitiba",
    descricaoCurta:
      "TV com tela trincada, manchas ou listras. Avaliamos honestamente se compensa trocar o painel antes de qualquer cobrança maior.",
    callToAction: "Iniciar triagem de troca de tela",
    triagemCategory: "tv",
  },
  "configuracao-wifi": {
    label: "Configuração de Wi-Fi",
    symptomSlug: "wifi-lento-instavel",
    parentPath: "/servicos/configuracao-wifi-curitiba",
    parentLabel: "Configuração de Wi-Fi em Curitiba",
    descricaoCurta:
      "Wi-Fi lento, caindo ou sem sinal em partes da casa. Visita técnica com diagnóstico de cobertura e ajuste de rede.",
    callToAction: "Iniciar triagem de Wi-Fi",
    triagemCategory: "pc",
  },
};
