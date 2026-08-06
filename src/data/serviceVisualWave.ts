/**
 * Rodada 3Q — configuração visual por página comercial (keyword services).
 * Cada serviço tem resumo do hero derivado da copy aprovada, caixas editoriais
 * próprias e rótulo de CTA contextual. Nenhum preço, prazo ou promessa nova.
 */

export interface ServiceVisualConfig {
  /** Resumo curto do hero (máx. 3 linhas no mobile), derivado da introdução. */
  summary: string;
  /** Rótulo do CTA intermediário, contextual ao serviço. */
  ctaLabel: string;
  /** Caixas editoriais (máx. 3 por página). */
  callouts: ReadonlyArray<{
    title: string;
    tone?: "neutral" | "attention";
    items: readonly string[];
  }>;
}

export const SERVICE_VISUAL_BY_SLUG: Record<string, ServiceVisualConfig> = {
  "formatacao-de-computador-curitiba": {
    summary:
      "Formatação com backup confirmado antes de qualquer apagamento, instalação de drivers e restauração dos programas legítimos que você usa.",
    ctaLabel: "Descrever o que preciso salvar",
    callouts: [
      {
        title: "Antes da formatação",
        items: [
          "Confirmamos com você quais pastas, contas e arquivos precisam ser preservados.",
          "Backup é etapa combinada e autorizada antes de qualquer apagamento.",
        ],
      },
      {
        title: "O que precisa ser confirmado",
        items: [
          "Licenças e credenciais dos programas que serão reinstalados.",
          "Disponibilidade de drivers do fabricante para o modelo do equipamento.",
        ],
      },
      {
        title: "O que não está incluído automaticamente",
        tone: "attention",
        items: [
          "Formatação não corrige defeito de hardware — quando há falha física, a avaliação técnica vem antes.",
          "Instalação de software sem licença válida não faz parte do escopo.",
        ],
      },
    ],
  },

  "remocao-de-virus-curitiba": {
    summary:
      "Análise dos sinais de infecção, limpeza de programas indesejados, revisão do navegador e orientação sobre contas e senhas.",
    ctaLabel: "Relatar os sinais que estou vendo",
    callouts: [
      {
        title: "Sinais que merecem atenção",
        items: [
          "Páginas e extensões que aparecem sozinhas no navegador.",
          "Avisos e janelas insistentes pedindo instalação ou pagamento.",
        ],
      },
      {
        title: "Cuidados com senhas e contas",
        items: [
          "Depois da limpeza, a troca de senhas das contas usadas no equipamento é recomendada.",
          "Recuperação de contas dependem do provedor do serviço e não é feita por nós.",
        ],
      },
      {
        title: "Limites da remoção",
        tone: "attention",
        items: [
          "Nenhuma limpeza elimina o risco de nova infecção — o uso posterior influencia diretamente.",
          "Quando o sistema está comprometido em profundidade, a reinstalação é discutida com você antes.",
        ],
      },
    ],
  },

  "upgrade-ssd-curitiba": {
    summary:
      "Verificação de compatibilidade, escolha entre clonagem e instalação limpa e testes após a troca do armazenamento.",
    ctaLabel: "Verificar compatibilidade do meu equipamento",
    callouts: [
      {
        title: "Quando o upgrade pode ajudar",
        items: [
          "Equipamento saudável, com disco mecânico antigo como principal limitador do uso diário.",
          "Espaço de armazenamento insuficiente para o trabalho atual.",
        ],
      },
      {
        title: "Compatibilidade antes da compra",
        items: [
          "Interface, formato e capacidade suportados variam conforme o modelo da placa.",
          "Conferimos a compatibilidade antes de qualquer indicação de peça.",
        ],
      },
      {
        title: "O que ainda pode limitar o desempenho",
        tone: "attention",
        items: [
          "Processador, memória disponível e estado do sistema continuam influenciando o resultado.",
          "Não trabalhamos com promessa de ganho medido — o efeito depende do conjunto.",
        ],
      },
    ],
  },

  "upgrade-memoria-ram-curitiba": {
    summary:
      "Conferência do que a placa suporta, verificação de memória soldada e testes de estabilidade após a ampliação.",
    ctaLabel: "Informar o modelo do meu equipamento",
    callouts: [
      {
        title: "Compatibilidade antes da compra",
        items: [
          "Quantidade máxima, número de slots e tipo de módulo variam por modelo.",
          "Parte dos notebooks tem memória soldada, com ampliação limitada ou impossível.",
        ],
      },
      {
        title: "Quando o upgrade pode ajudar",
        items: [
          "Uso simultâneo de muitos programas ou abas com travamentos frequentes.",
          "Aplicações que exigem mais memória do que a instalada atualmente.",
        ],
      },
      {
        title: "O que ainda pode limitar o desempenho",
        tone: "attention",
        items: [
          "Armazenamento antigo e sistema desorganizado continuam pesando na experiência.",
          "Não prometemos ganho numérico: o resultado depende do conjunto do equipamento.",
        ],
      },
    ],
  },

  "suporte-tecnico-remoto": {
    summary:
      "Atendimento remoto com sua autorização e acompanhamento na tela, para o que pode ser resolvido sem deslocamento.",
    ctaLabel: "Descrever meu problema",
    callouts: [
      {
        title: "O que verificamos remotamente",
        items: [
          "Configurações do sistema, programas, contas e comportamento relatado.",
          "Sessão iniciada apenas com sua autorização e encerrada ao final do atendimento.",
        ],
      },
      {
        title: "Quando depende de avaliação presencial",
        tone: "attention",
        items: [
          "Falhas de hardware, equipamento que não inicia ou perda de conexão inviabilizam o remoto.",
          "Nesses casos, a triagem redireciona para bancada, visita ou coleta.",
        ],
      },
    ],
  },

  "assistencia-tecnica-empresas-curitiba": {
    summary:
      "Atendimento técnico para empresas com escopo combinado, registro do que foi feito e limites publicados antes de começar.",
    ctaLabel: "Descrever a necessidade da empresa",
    callouts: [
      {
        title: "O que registrar antes do chamado",
        items: [
          "Equipamentos envolvidos, horários críticos e impacto no trabalho.",
          "Acessos e responsáveis por sistemas de terceiros usados na operação.",
        ],
      },
      {
        title: "Responsabilidade de terceiros",
        tone: "attention",
        items: [
          "Sistemas, ERPs e serviços contratados de outros fornecedores seguem sob suporte deles.",
          "Atuamos na infraestrutura, nos equipamentos e na comunicação em rede.",
        ],
      },
    ],
  },

  "conserto-de-notebook-curitiba": {
    summary:
      "Diagnóstico do sintoma relatado, avaliação de tela, teclado, carga e temperatura, com o valor informado antes da execução.",
    ctaLabel: "Descrever meu problema",
    callouts: [
      {
        title: "O que verificamos",
        items: [
          "Comportamento de energia e carga, temperatura, armazenamento e sintomas de tela.",
          "Testes após o reparo antes da devolução do equipamento.",
        ],
      },
      {
        title: "Antes de autorizar",
        items: [
          "Peças e escopo são apresentados para sua aprovação antes de qualquer execução.",
        ],
      },
      {
        title: "Quando não insistir em ligar",
        tone: "attention",
        items: [
          "Houve contato com líquido, cheiro incomum, estalo, aquecimento extremo ou bateria deformada: insistir em ligar pode ampliar o dano.",
          "Desconecte a energia quando for seguro, não abra o equipamento e solicite avaliação — nenhuma dessas situações permite concluir a causa sem diagnóstico.",
          "Se há arquivos importantes no equipamento, informe na triagem: o que é recuperável depende do estado do armazenamento e não pode ser garantido sem avaliação.",
        ],
      },
    ],
  },

};
