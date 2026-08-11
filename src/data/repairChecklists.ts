/**
 * Checklists rápidos de reparo — conteúdo factual e verificável, escrito para
 * ser executado pelo próprio usuário ANTES de abrir chamado. Cada item é uma
 * verificação segura (sem abrir equipamento, sem risco elétrico).
 *
 * Fonte única: usada na página /checklists-de-reparo e no download em texto.
 */

export interface RepairChecklist {
  slug: string;
  title: string;
  intro: string;
  /** Página de sintoma/serviço mais relevante para o checklist. */
  relatedHref: string;
  relatedLabel: string;
  steps: string[];
  stopCondition: string;
}

export const REPAIR_CHECKLISTS: RepairChecklist[] = [
  {
    slug: "notebook-nao-liga",
    title: "Checklist: notebook não liga",
    intro:
      "Sequência de verificações que separa falha de energia (mais comum e barata) de falha de placa. Leva cerca de 10 minutos.",
    relatedHref: "/blog/notebook-nao-liga",
    relatedLabel: "Guia completo: notebook não liga",
    steps: [
      "Teste outra tomada e confira se o LED da fonte acende com o carregador conectado.",
      "Desconecte o carregador, remova a bateria (se for removível) e segure o botão liga por 30 segundos.",
      "Reconecte só o carregador, sem bateria, e tente ligar.",
      "Retire pendrives, HDs externos, cartões e monitores externos antes de nova tentativa.",
      "Observe sinais de vida: ventoinha girando, LED piscando, som de beep ou aquecimento.",
      "Aproxime o ouvido do teclado: giro breve da ventoinha e desligamento indica proteção da placa.",
      "Anote o modelo exato e o que você observou — isso encurta a triagem.",
    ],
    stopCondition:
      "Pare se sentir cheiro de queimado, ver marca de líquido ou o aparelho esquentar sem ligar. Nesses casos, não insista: risco de agravar o dano.",
  },
  {
    slug: "computador-lento",
    title: "Checklist: computador lento",
    intro:
      "Verificações que revelam se a lentidão é software (limpável) ou hardware (disco/memória no limite).",
    relatedHref: "/blog/computador-lento-o-que-fazer",
    relatedLabel: "Guia completo: computador lento",
    steps: [
      "Abra o Gerenciador de Tarefas (Ctrl+Shift+Esc) e veja qual recurso fica em 100%: disco, CPU ou memória.",
      "Confira o espaço livre do disco do sistema — abaixo de 15% já compromete o desempenho.",
      "Liste os programas que iniciam com o Windows e desative o que você não usa diariamente.",
      "Verifique se o equipamento ainda usa HD mecânico: é a causa nº 1 de lentidão em máquinas antigas.",
      "Rode uma verificação de vírus completa e anote o resultado.",
      "Observe o comportamento sob carga: travar e voltar sugere superaquecimento por poeira.",
      "Anote há quanto tempo a lentidão começou e se houve atualização ou instalação recente.",
    ],
    stopCondition:
      "Se aparecerem barulhos de clique no disco ou telas azuis frequentes, faça backup imediato antes de qualquer outro teste.",
  },
  {
    slug: "wifi-instavel",
    title: "Checklist: Wi-Fi caindo ou lento",
    intro:
      "Isola em poucos passos se o problema é do provedor, do roteador ou do ambiente (interferência e distância).",
    relatedHref: "/servicos/configuracao-wifi-curitiba",
    relatedLabel: "Configuração de Wi-Fi em Curitiba",
    steps: [
      "Teste a velocidade com cabo ligado direto no roteador e depois pelo Wi-Fi, no mesmo cômodo.",
      "Verifique se a queda acontece em todos os aparelhos ou em apenas um.",
      "Reinicie roteador e modem por 60 segundos desligados da tomada.",
      "Confira se o roteador está no chão, atrás da TV ou dentro de armário — todos pioram o sinal.",
      "Compare as redes de 2,4 GHz e 5 GHz: instabilidade só em uma delas indica canal congestionado.",
      "Anote o horário das quedas: padrão em horário de pico costuma ser saturação do provedor.",
      "Liste os cômodos sem sinal — isso define se o caso é ajuste ou ponto de repetição.",
    ],
    stopCondition:
      "Se a luz de internet do modem ficar vermelha ou apagada, o caso é do provedor: registre o protocolo com ele antes de contratar serviço técnico.",
  },
  {
    slug: "tv-sem-imagem",
    title: "Checklist: TV liga mas não mostra imagem",
    intro:
      "Distingue falha de fonte de alimentação, backlight e placa antes de qualquer orçamento de tela.",
    relatedHref: "/servicos/reparo-smart-tv-curitiba",
    relatedLabel: "Reparo de Smart TV em Curitiba",
    steps: [
      "Confirme se o LED de standby acende ao ligar na tomada.",
      "No escuro, ilumine a tela com uma lanterna a 10 cm: se aparecer imagem fraca, o backlight está apagado.",
      "Troque o cabo HDMI e teste outra entrada e outra fonte (celular, notebook, receptor).",
      "Verifique se o som funciona mesmo sem imagem — som presente aponta para painel/backlight.",
      "Observe listras, manchas ou faixas: costumam indicar dano físico no painel.",
      "Anote modelo, tamanho e se houve queda de energia recente.",
    ],
    stopCondition:
      "Não abra a TV nem pressione o painel. Vidro trincado ou mancha em expansão indicam painel danificado, o que muda completamente a viabilidade do reparo.",
  },
  {
    slug: "backup-antes-do-reparo",
    title: "Checklist: proteger seus dados antes do reparo",
    intro:
      "Antes de entregar qualquer equipamento para manutenção, siga esta lista para não perder arquivos nem expor contas.",
    relatedHref: "/seguranca-dos-dados",
    relatedLabel: "Segurança dos dados na manutenção",
    steps: [
      "Copie documentos, fotos e planilhas para HD externo ou nuvem — e confirme abrindo um arquivo copiado.",
      "Exporte favoritos e senhas salvas do navegador, ou confirme que estão sincronizados na sua conta.",
      "Saia das contas bancárias e ative verificação em duas etapas nas contas principais.",
      "Anote as senhas de acesso do equipamento que o técnico realmente precisará.",
      "Remova cartões de memória, chips e HDs secundários que não fazem parte do reparo.",
      "Fotografe o estado externo do aparelho antes da coleta.",
    ],
    stopCondition:
      "Se o equipamento não liga e os dados são críticos, informe isso na triagem antes de qualquer tentativa: recuperação de dados exige procedimento próprio.",
  },
];

/** Gera o conteúdo de texto para download do checklist. */
export function checklistToText(c: RepairChecklist): string {
  const lines = [
    c.title.toUpperCase(),
    "Preciso de Um Técnico — precisodeumtecnico.com",
    "",
    c.intro,
    "",
    ...c.steps.map((s, i) => `[ ] ${i + 1}. ${s}`),
    "",
    `ATENÇÃO: ${c.stopCondition}`,
    "",
    "Ao final, abra a triagem online e informe o que você observou.",
  ];
  return lines.join("\n");
}
