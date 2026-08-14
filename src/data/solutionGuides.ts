/**
 * Guias editoriais de resolução de problemas (deep-dive).
 *
 * Cada guia é uma página indexável em /solucoes/:slug, organizada em clusters
 * temáticos por equipamento. O conteúdo é técnico e verificável — nada de
 * promessa comercial nova: preço e prazo sempre remetem a /precos e à triagem.
 */
import type { EquipmentId } from "@/data/triage/config";

export type SolutionClusterId =
  | "computador"
  | "tv"
  | "redes"
  | "moveis"
  | "dados";

export interface SolutionCluster {
  id: SolutionClusterId;
  label: string;
  /** Título curto usado em H2 e âncoras internas. */
  heading: string;
  description: string;
  /** Serviço correspondente já publicado no portal. */
  servicePath: string;
  serviceLabel: string;
}

export const SOLUTION_CLUSTERS: SolutionCluster[] = [
  {
    id: "computador",
    label: "Computador e notebook",
    heading: "Problemas de PC e notebook",
    description:
      "Falhas de inicialização, lentidão, superaquecimento e erros do Windows — do teste isolado até a decisão entre reparo, upgrade e substituição.",
    servicePath: "/servicos/informatica",
    serviceLabel: "Assistência de informática",
  },
  {
    id: "tv",
    label: "TV e vídeo",
    heading: "Problemas de TV e imagem",
    description:
      "Telas sem imagem, listras, backlight e falhas de placa: como separar defeito de painel (caro) de defeito de fonte e placa (viável).",
    servicePath: "/servicos/tvs",
    serviceLabel: "Reparo de TVs",
  },
  {
    id: "redes",
    label: "Redes e Wi-Fi",
    heading: "Problemas de internet e rede",
    description:
      "Quedas de conexão, sinal fraco em cômodos específicos e roteadores mal posicionados — diagnóstico de camada física antes de trocar equipamento.",
    servicePath: "/servicos/redes",
    serviceLabel: "Redes e Wi-Fi",
  },
  {
    id: "moveis",
    label: "Celular, tablet e videogame",
    heading: "Problemas de portáteis e consoles",
    description:
      "Carregamento, bateria, superaquecimento e desligamento em consoles: o que é limpeza térmica e o que já é falha de componente.",
    servicePath: "/servicos/celulares",
    serviceLabel: "Celulares e tablets",
  },
  {
    id: "dados",
    label: "Dados e segurança",
    heading: "Arquivos, backup e infecção",
    description:
      "Recuperação de arquivos, discos com setores defeituosos, vírus e sequestro de navegador — com a ordem correta de ações para não perder dados.",
    servicePath: "/seguranca-dos-dados",
    serviceLabel: "Segurança dos dados",
  },
];

export const CLUSTER_BY_ID: Record<SolutionClusterId, SolutionCluster> = Object.fromEntries(
  SOLUTION_CLUSTERS.map((c) => [c.id, c]),
) as Record<SolutionClusterId, SolutionCluster>;

export interface GuideSection {
  h2: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface SolutionGuide {
  slug: string;
  cluster: SolutionClusterId;
  /** <title> (< 60 caracteres com a palavra-chave principal). */
  title: string;
  /** meta description (< 160 caracteres). */
  description: string;
  h1: string;
  /** Frase de abertura — resposta direta à intenção de busca. */
  answer: string;
  /** Sintomas que levam a este guia (usados em busca interna e âncoras). */
  symptoms: string[];
  /** Pré-seleção do funil de triagem. */
  triage: { equipment: EquipmentId; symptom?: string };
  sections: GuideSection[];
  faqs: GuideFaq[];
  /** Links comerciais/locais relacionados (malha interna). */
  related: { to: string; label: string }[];
}

export const SOLUTION_GUIDES: SolutionGuide[] = [
  {
    slug: "notebook-nao-liga",
    cluster: "computador",
    title: "Notebook não liga: diagnóstico passo a passo",
    description:
      "Como descobrir se o notebook que não liga é problema de fonte, bateria, memória ou placa-mãe — testes na ordem certa antes de pagar reparo.",
    h1: "Notebook não liga: como identificar a causa antes do orçamento",
    answer:
      "Notebook que não liga quase nunca é um defeito só: é uma cadeia (tomada → fonte → conector DC → bateria → placa → memória → vídeo). Testar nessa ordem separa o que você resolve em cinco minutos do que exige bancada.",
    symptoms: ["não liga", "sem sinal de vida", "led pisca", "liga e desliga"],
    triage: { equipment: "pc_notebook", symptom: "no_power_board" },
    sections: [
      {
        h2: "1. Confirme se há energia chegando ao aparelho",
        paragraphs: [
          "Antes de qualquer suspeita de placa-mãe, isole a alimentação. Ligue a fonte em outra tomada de circuito diferente (não no mesmo filtro de linha), observe se o LED da fonte acende e verifique se o conector está firme no aparelho. Fontes de notebook falham com muito mais frequência que placas — o rompimento acontece tipicamente a poucos centímetros do plugue, onde o cabo dobra.",
          "Se a fonte tem LED e ele apaga quando o cabo é conectado ao notebook, o carregador entrou em proteção: existe consumo excessivo do outro lado (curto no conector DC, na placa ou na bateria). Esse é um sinal objetivo de que o problema não é o carregador.",
        ],
        bullets: [
          "LED da fonte apagado mesmo desconectada do notebook: fonte ou cabo de tomada.",
          "LED acende sozinho e apaga ao conectar: proteção por sobrecorrente — suspeita de curto interno.",
          "LED permanece aceso e o notebook não reage: falha de placa, botão liga/desliga ou memória.",
        ],
      },
      {
        h2: "2. Descarga residual e teste sem bateria",
        paragraphs: [
          "Capacitores da placa retêm carga e travam a sequência de boot. Desconecte a fonte, remova a bateria quando ela for removível e mantenha o botão liga/desliga pressionado por 20 a 30 segundos. Reconecte só a fonte e tente ligar. Em modelos com bateria interna, o mesmo efeito costuma existir via botão de reset no fundo do gabinete.",
          "Se o notebook liga sem bateria e só com fonte, o problema é a bateria ou o circuito de carga — não a placa inteira. Baterias inchadas também forçam mecanicamente o touchpad e devem ser trocadas por segurança, mesmo que o aparelho ainda funcione.",
        ],
      },
      {
        h2: "3. Ligou, mas a tela fica preta",
        paragraphs: [
          "Ventoinha girando, LED de energia aceso e tela apagada é um cenário diferente de 'não liga'. Conecte um monitor externo por HDMI. Se a imagem aparece no monitor, o defeito está no painel, no cabo flat ou na iluminação (backlight). Se nem o monitor externo recebe sinal, a suspeita passa para memória RAM, vídeo dedicado ou placa.",
          "Um teste barato e revelador: reassentar os módulos de memória, um por vez, em slots alternados. Contato oxidado é causa comum de tela preta com ventoinha girando, sobretudo em aparelhos guardados por meses.",
        ],
      },
      {
        h2: "4. O que já exige bancada",
        paragraphs: [
          "Cheiro de queimado, marcas escuras na placa, líquido derramado, conector DC solto ou aparelho que reinicia sozinho em ciclos indicam serviço de bancada com instrumentos (fonte de bancada, medição de linhas de tensão, microscópio). Nesses casos, insistir em ligar repetidamente aumenta o dano — cada tentativa alimenta um circuito potencialmente em curto.",
          "Em oxidação por líquido, o tempo é o fator crítico: quanto antes o equipamento for aberto e limpo, maior a chance de recuperação. Arroz, secador e 'esperar secar' pioram o quadro porque a corrosão continua sob os componentes.",
        ],
      },
      {
        h2: "5. Reparar, fazer upgrade ou trocar",
        paragraphs: [
          "A decisão racional compara o custo do reparo com o valor de mercado do aparelho e com a vida útil restante. Notebooks com armazenamento mecânico, 4 GB de memória e mais de oito anos costumam pedir mais que um conserto pontual — mas o inverso também é verdade: máquinas com bom processador voltam a ser plenamente usáveis com troca de disco e ampliação de memória.",
          "Antes de decidir, garanta o backup. Um disco íntegro em um notebook morto ainda contém tudo, e a cópia dos dados é a primeira etapa do atendimento — não a última.",
        ],
      },
    ],
    faqs: [
      {
        q: "Notebook que não liga tem conserto?",
        a: "Na maioria dos casos sim. As causas mais frequentes (fonte, conector DC, bateria, memória) são reparáveis. Só falhas extensas na placa por líquido ou surto elétrico tornam o reparo inviável frente ao valor do aparelho.",
      },
      {
        q: "Posso perder os arquivos se o notebook não liga?",
        a: "Não necessariamente. Se o problema é elétrico, o disco geralmente está intacto e os dados podem ser copiados antes de qualquer reparo. Avise na triagem que existem arquivos importantes para que a cópia seja priorizada.",
      },
      {
        q: "Vale trocar a placa-mãe do notebook?",
        a: "Depende do modelo. Em aparelhos correntes o reparo em nível de componente costuma sair mais barato que a placa nova; em máquinas antigas, o custo da placa frequentemente ultrapassa o valor de revenda.",
      },
      {
        q: "Quanto tempo demora o diagnóstico?",
        a: "Diagnóstico elétrico é feito em bancada e depende da disponibilidade de peças de teste. O prazo é informado no orçamento, apresentado antes de qualquer reparo. Consulte as condições em /precos.",
      },
    ],
    related: [
      { to: "/conserto-de-notebook-curitiba", label: "Conserto de notebook em Curitiba" },
      { to: "/upgrade-ssd-curitiba", label: "Upgrade de SSD" },
      { to: "/servicos/informatica", label: "Assistência de informática" },
    ],
  },
  {
    slug: "computador-lento",
    cluster: "computador",
    title: "Computador lento: causas reais e o que resolve",
    description:
      "Descubra por que o computador ficou lento — disco mecânico, memória insuficiente, temperatura ou software — e qual intervenção devolve desempenho de verdade.",
    h1: "Computador lento: como descobrir a causa real da lentidão",
    answer:
      "Lentidão tem quatro causas dominantes: disco mecânico saturado, memória insuficiente, superaquecimento com redução de clock e excesso de software em segundo plano. Medir antes de gastar evita trocar a peça errada.",
    symptoms: ["lento", "travando", "demora para abrir", "trava ao iniciar"],
    triage: { equipment: "pc_notebook", symptom: "virus_slow" },
    sections: [
      {
        h2: "Medir antes de trocar peça",
        paragraphs: [
          "O Gerenciador de Tarefas do Windows (Ctrl+Shift+Esc, aba Desempenho) mostra qual recurso está saturado. Disco em 100% de atividade com taxa de transferência baixa aponta para HD mecânico no fim da vida útil ou fragmentação de I/O. Memória acima de 85% em uso constante indica falta de RAM, com o sistema recorrendo ao arquivo de paginação — que é lento por natureza.",
          "Processador fixo em frequência baixa sob carga, com temperatura alta, indica throttling térmico: a máquina se protege reduzindo desempenho. É o único cenário em que limpeza e troca de pasta térmica resolvem lentidão de verdade.",
        ],
        bullets: [
          "Disco 100% + HD mecânico → troca por SSD é a intervenção de maior impacto.",
          "Memória saturada com poucos programas → ampliar RAM.",
          "Temperatura alta e clock baixo → manutenção térmica.",
          "Tudo baixo e ainda lento → software, inicialização e infecção.",
        ],
      },
      {
        h2: "SSD: por que muda tanto",
        paragraphs: [
          "Um HD mecânico entrega tempos de acesso na casa dos milissegundos porque depende de peças móveis; um SSD responde em microssegundos. Na prática, o ganho aparece exatamente onde o usuário sente a lentidão: ligar o sistema, abrir programas, alternar entre janelas e salvar arquivos.",
          "Máquinas com processadores de duas gerações atrás frequentemente voltam a ser confortáveis apenas com SSD, sem troca de plataforma. A migração pode ser feita clonando o sistema, o que preserva programas e configurações.",
        ],
      },
      {
        h2: "Memória: quantidade e configuração",
        paragraphs: [
          "Além da quantidade, a configuração importa. Dois módulos idênticos trabalhando em dual channel entregam desempenho superior a um módulo único de mesma capacidade, especialmente em máquinas com vídeo integrado, que compartilha memória do sistema.",
          "Antes de comprar, verifique o padrão suportado pela placa, a frequência máxima e o limite por slot. Módulo incompatível não é apenas ineficaz: pode impedir o boot.",
        ],
      },
      {
        h2: "Software, inicialização e serviços",
        paragraphs: [
          "Programas que iniciam junto com o sistema consomem memória e disco no pior momento possível. Revise a aba Inicializar do Gerenciador de Tarefas e desative o que não é essencial. Antivírus duplicados são um caso clássico: dois motores de varredura em tempo real disputam o mesmo arquivo e degradam a máquina inteira.",
          "Navegadores com dezenas de abas e extensões acumulam consumo de memória facilmente superior ao de qualquer outro aplicativo. Antes de concluir que a máquina é fraca, meça com o navegador fechado.",
        ],
      },
      {
        h2: "Quando a lentidão é sintoma de falha",
        paragraphs: [
          "Lentidão acompanhada de travamentos, ruídos de clique no disco ou erros de leitura não é questão de desempenho: é disco em falha. Nesse cenário, a prioridade absoluta é backup imediato — cada tentativa de uso reduz a chance de recuperação.",
          "Verifique também a saúde do armazenamento (indicadores SMART) e o histórico de reinicializações inesperadas. Uma máquina que ficou lenta 'de um dia para o outro' costuma ter causa pontual, não desgaste.",
        ],
      },
    ],
    faqs: [
      {
        q: "Formatar resolve lentidão?",
        a: "Resolve quando a causa é software, infecção ou sistema corrompido. Não resolve quando a causa é hardware — disco mecânico, pouca memória ou superaquecimento voltam a limitar a máquina logo após a formatação.",
      },
      {
        q: "Trocar HD por SSD é seguro para meus arquivos?",
        a: "Sim, quando feito com clonagem do sistema ou backup prévio. O disco antigo pode ser preservado como cópia até a validação do novo ambiente.",
      },
      {
        q: "Quanta memória RAM é suficiente?",
        a: "Para uso de escritório e navegação, 8 GB é o piso confortável. Edição, máquinas virtuais e planilhas pesadas pedem 16 GB ou mais.",
      },
      {
        q: "Limpeza interna melhora o desempenho?",
        a: "Sim, quando há superaquecimento. Se a temperatura já está normal, limpeza não altera desempenho — o ganho vem de disco, memória ou software.",
      },
    ],
    related: [
      { to: "/formatacao-de-computador-curitiba", label: "Formatação de computador em Curitiba" },
      { to: "/upgrade-memoria-ram-curitiba", label: "Upgrade de memória RAM" },
      { to: "/upgrade-ssd-curitiba", label: "Upgrade de SSD" },
    ],
  },
  {
    slug: "notebook-esquentando",
    cluster: "computador",
    title: "Notebook esquentando e desligando: o que fazer",
    description:
      "Entenda por que o notebook superaquece, desliga sozinho ou fica barulhento, e quais manutenções realmente reduzem a temperatura sem risco ao equipamento.",
    h1: "Notebook esquentando, barulhento ou desligando sozinho",
    answer:
      "Superaquecimento é falha de dissipação: pó no radiador, pasta térmica ressecada, ventoinha travada ou uso sobre superfície que bloqueia a entrada de ar. O desligamento súbito é a proteção do processador, não um defeito adicional.",
    symptoms: ["esquentando", "desliga sozinho", "ventoinha barulhenta", "trava em jogos"],
    triage: { equipment: "pc_notebook", symptom: "no_power_board" },
    sections: [
      {
        h2: "Como o calor vira lentidão e desligamento",
        paragraphs: [
          "Processadores modernos reduzem a frequência quando atingem o limite térmico. O primeiro sintoma é lentidão sob carga; o segundo é o desligamento abrupto, disparado por proteção quando a temperatura crítica é alcançada. Nenhum dos dois danifica o chip imediatamente, mas ciclos térmicos repetidos envelhecem solda e bateria.",
          "Um indicativo prático: se a máquina funciona bem por dez minutos e degrada depois, o problema é térmico. Se está lenta desde o primeiro segundo, procure disco, memória ou software.",
        ],
      },
      {
        h2: "Onde o calor fica preso",
        paragraphs: [
          "O conjunto de dissipação de um notebook é uma combinação de pasta térmica, heat pipe, radiador de aletas e ventoinha. Poeira e fiapos formam uma manta entre as aletas e o exaustor — o ar continua circulando, mas não retira calor. Por isso a máquina pode fazer barulho alto e ainda assim superaquecer.",
          "Pasta térmica ressecada perde condutividade e cria um ponto de resistência entre o processador e o dissipador. Em máquinas de uso intenso, é um item de manutenção periódica, não um reparo excepcional.",
        ],
        bullets: [
          "Base entupida por pó: perda de fluxo mesmo com ventoinha a plena rotação.",
          "Pasta térmica seca: temperatura alta já em uso leve.",
          "Ventoinha com rolamento gasto: ruído metálico e rotação instável.",
          "Uso sobre cama, sofá ou colo: entradas de ar bloqueadas.",
        ],
      },
      {
        h2: "O que ajuda e o que é mito",
        paragraphs: [
          "Bases refrigeradas ajudam de forma marginal quando a entrada de ar fica na parte inferior, mas não substituem limpeza interna. Ar comprimido usado por fora tende a empurrar a sujeira para dentro do radiador e agravar o entupimento — a limpeza eficaz é feita com o conjunto desmontado.",
          "Reduzir o plano de energia para 'equilibrado' e limitar a frequência máxima do processador diminui temperatura na prática, ao custo de desempenho. É uma medida paliativa válida enquanto a manutenção não é feita.",
        ],
      },
      {
        h2: "Quando o calor indica outra falha",
        paragraphs: [
          "Aquecimento localizado próximo ao conector de energia, com o aparelho parado, aponta para circuito de carga. Bateria inchada, gabinete estufado ou touchpad pressionado exigem substituição imediata pelo risco físico.",
          "Se o desligamento acontece sem aquecimento perceptível, a causa provável não é térmica: fonte subdimensionada, bateria com célula em colapso ou falha de alimentação na placa entram na investigação.",
        ],
      },
    ],
    faqs: [
      {
        q: "Com que frequência fazer limpeza interna?",
        a: "Em ambiente doméstico comum, a cada 12 a 18 meses. Em ambientes com animais, poeira ou fumaça, o intervalo cai para 6 a 12 meses.",
      },
      {
        q: "Desligar sozinho por calor estraga o notebook?",
        a: "Um evento isolado não danifica. Repetição frequente acelera desgaste de bateria, solda e ventoinha, e aumenta o risco de corrupção de arquivos abertos.",
      },
      {
        q: "Trocar a pasta térmica sozinho é arriscado?",
        a: "O risco está na desmontagem: cabos flat, parafusos de comprimentos diferentes e clipes plásticos quebram com facilidade. Em aparelhos ainda na garantia do fabricante, a abertura pode invalidá-la.",
      },
      {
        q: "Ventoinha barulhenta significa que precisa trocar?",
        a: "Nem sempre. Ruído por acúmulo de sujeira desaparece com limpeza; ruído metálico constante indica rolamento gasto e pede substituição da peça.",
      },
    ],
    related: [
      { to: "/conserto-de-notebook-curitiba", label: "Conserto de notebook em Curitiba" },
      { to: "/servicos/informatica", label: "Manutenção de informática" },
      { to: "/precos", label: "Preços e condições" },
    ],
  },
  {
    slug: "tela-azul-windows",
    cluster: "computador",
    title: "Tela azul no Windows: como identificar a causa",
    description:
      "Guia técnico para interpretar telas azuis do Windows, identificar driver, memória ou disco como origem e agir sem perder arquivos.",
    h1: "Tela azul no Windows: leitura do erro e diagnóstico",
    answer:
      "A tela azul é uma parada de segurança do sistema. O código exibido aponta a família do problema: driver, memória, disco ou energia. Anotar o código é o passo que transforma um susto em diagnóstico objetivo.",
    symptoms: ["tela azul", "reinicia sozinho", "erro crítico", "bsod"],
    triage: { equipment: "pc_notebook", symptom: "windows_system" },
    sections: [
      {
        h2: "Registre o código antes de reiniciar",
        paragraphs: [
          "Cada tela azul traz um nome de parada (por exemplo, referências a memória, gerenciamento de energia ou driver de sistema). Fotografe a tela. Sem esse dado, o diagnóstico volta a ser tentativa e erro, e o técnico precisa reproduzir a falha para investigá-la.",
          "O Visualizador de Eventos do Windows guarda o histórico de erros críticos com data e hora. Correlacionar o horário da parada com instalações recentes de driver ou atualização costuma identificar o gatilho em minutos.",
        ],
      },
      {
        h2: "Drivers: a causa mais comum",
        paragraphs: [
          "Drivers de vídeo, rede e armazenamento respondem pela maioria das paradas. Atualização automática que instala versão genérica sobre driver do fabricante é um cenário recorrente, principalmente em notebooks com placa de vídeo híbrida.",
          "A prova prática é iniciar o Windows em modo de segurança: se a máquina fica estável, o núcleo do sistema está íntegro e a falha vem de um componente carregado no boot normal.",
        ],
      },
      {
        h2: "Memória e armazenamento",
        paragraphs: [
          "Erros aleatórios, em programas diferentes e sem padrão de horário, apontam para memória. O teste correto roda módulo a módulo, por várias passagens — um único erro reportado já condena o módulo.",
          "Paradas ligadas a leitura de arquivos, com lentidão prévia e travamentos do Explorer, apontam para disco. Nesse caso, a ordem é inegociável: backup primeiro, teste depois. Rodar utilitários de correção em disco com setores defeituosos pode inviabilizar a recuperação dos dados.",
        ],
        bullets: [
          "Falha aleatória em qualquer aplicativo → memória.",
          "Falha ao abrir, salvar ou copiar arquivos → disco.",
          "Falha ao entrar em suspensão ou ao acordar → energia e driver de chipset.",
          "Falha só em jogos e vídeo → driver gráfico ou temperatura.",
        ],
      },
      {
        h2: "Quando reinstalar o sistema é a resposta certa",
        paragraphs: [
          "Reinstalação limpa faz sentido quando há corrupção acumulada, múltiplos drivers conflitantes ou histórico de infecções. Deixa de fazer sentido quando o hardware está com falha: o problema retorna dias depois, agora com dados a menos.",
          "Uma reinstalação bem feita inclui inventário do que precisa ser preservado, cópia validada, drivers do fabricante e verificação de ativação antes de formatar — nessa ordem.",
        ],
      },
    ],
    faqs: [
      {
        q: "Tela azul apaga meus arquivos?",
        a: "A parada em si não apaga. O risco está nos arquivos abertos no momento da falha e, quando a causa é disco, na deterioração progressiva do armazenamento.",
      },
      {
        q: "Uma tela azul isolada é preocupante?",
        a: "Um evento único após atualização costuma ser pontual. Repetição semanal ou diária exige diagnóstico de memória, disco e drivers.",
      },
      {
        q: "Posso resolver só atualizando o Windows?",
        a: "Às vezes sim, quando o gatilho é um driver corrigido pelo fabricante. Se a causa for hardware, a atualização apenas adia a próxima parada.",
      },
      {
        q: "Vale a pena testar a memória em casa?",
        a: "Sim, com utilitário de teste em pendrive inicializável. Só reserve tempo: um teste confiável leva horas e precisa rodar módulo a módulo.",
      },
    ],
    related: [
      { to: "/formatacao-de-computador-curitiba", label: "Formatação com backup em Curitiba" },
      { to: "/upgrade-memoria-ram-curitiba", label: "Upgrade e teste de memória" },
      { to: "/servicos/informatica", label: "Assistência de informática" },
    ],
  },
  {
    slug: "recuperar-arquivos-hd",
    cluster: "dados",
    title: "Recuperar arquivos de HD com defeito: o que fazer",
    description:
      "Passos corretos para tentar recuperar arquivos de HD ou SSD com falha, o que evitar para não piorar o quadro e quando parar e procurar bancada.",
    h1: "Recuperar arquivos de um disco com defeito sem piorar o quadro",
    answer:
      "Em recuperação de dados, a primeira decisão define o resultado: parar de usar o disco. Cada nova gravação e cada tentativa de reparo automático reduzem a chance de recuperar o conteúdo original.",
    symptoms: ["hd não é reconhecido", "arquivos sumiram", "disco fazendo barulho", "formatou sem querer"],
    triage: { equipment: "pc_notebook", symptom: "recover_files" },
    sections: [
      {
        h2: "Pare de usar o disco imediatamente",
        paragraphs: [
          "Arquivos apagados não somem no instante da exclusão: o sistema apenas marca o espaço como livre. Enquanto nada gravar por cima, os dados continuam fisicamente presentes. Por isso, continuar usando o computador — navegar, instalar programa de recuperação no mesmo disco, baixar arquivos — é a forma mais rápida de destruir o que se quer salvar.",
          "Em disco com falha mecânica (ruído de clique, travamentos, reconhecimento intermitente), manter o aparelho ligado tem custo adicional: cada nova tentativa de leitura sobre um prato danificado amplia o dano.",
        ],
        bullets: [
          "Não instale ferramentas de recuperação no disco afetado.",
          "Não rode utilitários de correção antes de ter uma imagem do disco.",
          "Não abra o disco: partículas de poeira inviabilizam a leitura dos pratos.",
          "Não formate 'para ver se resolve'.",
        ],
      },
      {
        h2: "Separe exclusão lógica de falha física",
        paragraphs: [
          "Exclusão acidental, formatação rápida, tabela de partição corrompida e infecção são casos lógicos: o hardware funciona e o trabalho é de software, com boa taxa de sucesso quando o disco não foi usado depois.",
          "Ruídos repetitivos, aquecimento anormal, disco que não aparece na BIOS ou que desconecta durante a cópia são casos físicos. Aqui, o procedimento correto começa por criar uma imagem setor a setor com ferramenta tolerante a erros e trabalhar sobre a cópia, nunca sobre o original.",
        ],
      },
      {
        h2: "SSD tem regras próprias",
        paragraphs: [
          "SSDs usam TRIM: quando um arquivo é apagado, o controlador pode zerar fisicamente os blocos em segundo plano, mesmo com o computador ocioso. Isso reduz drasticamente a janela de recuperação em comparação com discos mecânicos — desligar rapidamente importa ainda mais.",
          "Falhas de controlador em SSD deixam a unidade invisível para o sistema. Não há solução por software nesse cenário; a leitura precisa ser feita em bancada, diretamente nos chips de memória, quando viável.",
        ],
      },
      {
        h2: "Como evitar a próxima perda",
        paragraphs: [
          "A regra prática de backup continua sendo três cópias, em dois meios diferentes, com uma fora do local. Sincronização em nuvem sozinha não é backup: exclusão e criptografia por ransomware se propagam para a cópia sincronizada.",
          "Backup só existe se for testado. Restaure um arquivo aleatório periodicamente — a maioria das falhas de backup só aparece no dia em que ele é necessário.",
        ],
      },
    ],
    faqs: [
      {
        q: "Todo arquivo apagado pode ser recuperado?",
        a: "Não. A chance depende de quanto o disco foi usado depois, do tipo de mídia e da natureza da falha. Discos mecânicos parados logo após a perda têm as melhores taxas.",
      },
      {
        q: "Programas gratuitos de recuperação funcionam?",
        a: "Funcionam em casos lógicos simples, desde que instalados em outro disco. Em falha física, eles forçam leituras e pioram o estado da unidade.",
      },
      {
        q: "O disco faz barulho de clique. Ainda dá para tentar em casa?",
        a: "Não. Clique repetitivo indica problema mecânico. Cada nova tentativa reduz o material recuperável — o correto é desligar e encaminhar para bancada.",
      },
      {
        q: "Recuperação de dados tem garantia de resultado?",
        a: "Nenhum serviço sério garante resultado antes da análise. O que se garante é o procedimento: avaliação, informação clara do que é recuperável e orçamento antes de executar.",
      },
    ],
    related: [
      { to: "/seguranca-dos-dados", label: "Segurança dos dados" },
      { to: "/servicos/backup-para-empresas", label: "Backup para empresas" },
      { to: "/servicos/informatica", label: "Assistência de informática" },
    ],
  },
  {
    slug: "computador-com-virus",
    cluster: "dados",
    title: "Computador com vírus e pop-ups: como limpar",
    description:
      "Como identificar infecção real, remover adwares e sequestradores de navegador e proteger senhas e contas depois da limpeza do computador.",
    h1: "Computador com vírus, pop-ups e navegador sequestrado",
    answer:
      "A maior parte das 'infecções' atuais é adware e sequestro de navegador: extensões, atalhos alterados e páginas iniciais forçadas. A limpeza precisa cobrir navegador, inicialização e contas — remover o arquivo não basta.",
    symptoms: ["pop-up", "propaganda", "página inicial mudou", "extensão estranha"],
    triage: { equipment: "pc_notebook", symptom: "virus_slow" },
    sections: [
      {
        h2: "Confirme que é infecção",
        paragraphs: [
          "Nem toda janela de aviso é vírus. Notificações de sites autorizadas por engano no navegador produzem exatamente o mesmo efeito de pop-up insistente e são revogadas nas permissões do próprio navegador. Verifique isso antes de qualquer varredura.",
          "Sinais de infecção real: atalhos do navegador com parâmetros adicionados, página inicial que retorna após ser trocada, extensões que reaparecem, processos desconhecidos consumindo rede e programas instalados em data que você não reconhece.",
        ],
      },
      {
        h2: "Ordem correta de limpeza",
        paragraphs: [
          "Comece pelo inventário: lista de programas instalados por data, extensões de todos os navegadores, itens de inicialização e tarefas agendadas. Adwares se reinstalam justamente por tarefas agendadas e serviços — removê-los é o que impede o retorno em 24 horas.",
          "Depois, execute varredura com o antivírus do sistema atualizado e com uma segunda ferramenta específica para adware. Um motor sozinho costuma deixar resíduos de outro tipo de ameaça.",
        ],
        bullets: [
          "Revogue permissões de notificação nos navegadores.",
          "Remova extensões não reconhecidas e redefina os atalhos.",
          "Elimine tarefas agendadas suspeitas.",
          "Revise itens de inicialização e serviços de terceiros.",
        ],
      },
      {
        h2: "O que fazer com senhas e contas",
        paragraphs: [
          "Se houve execução de programa desconhecido, trate as senhas como potencialmente expostas. Troque primeiro o e-mail principal — é ele que recupera todas as outras contas — e ative verificação em duas etapas nos serviços críticos.",
          "Troque as senhas de um dispositivo confiável, não da máquina infectada, e só depois da limpeza concluída. Senha nova digitada em máquina comprometida vaza junto.",
        ],
      },
      {
        h2: "Quando formatar é a decisão certa",
        paragraphs: [
          "Ransomware, ferramentas de acesso remoto instaladas por terceiros e sistemas com múltiplas ameaças persistentes justificam reinstalação limpa. Nesses casos, a confiança no ambiente não pode ser restaurada por remoção pontual.",
          "Antes de formatar, faça a cópia dos documentos e verifique-a em outra máquina com antivírus atualizado, para não reintroduzir a ameaça junto com o backup.",
        ],
      },
    ],
    faqs: [
      {
        q: "Antivírus gratuito é suficiente?",
        a: "O antivírus nativo do Windows atualizado cobre bem o cenário doméstico comum. O ganho real vem de hábitos: não instalar software de origem duvidosa e manter o sistema atualizado.",
      },
      {
        q: "Pop-ups continuam mesmo após a varredura. Por quê?",
        a: "Normalmente porque são notificações autorizadas no navegador ou extensões que retornam por tarefa agendada. Ambos ficam fora do escopo da varredura tradicional.",
      },
      {
        q: "Fui infectado por ransomware. Pagar resolve?",
        a: "Pagamento não garante devolução e financia novos ataques. A saída viável é restaurar backup íntegro e reconstruir o ambiente.",
      },
      {
        q: "Preciso trocar todas as senhas?",
        a: "Priorize e-mail principal, bancos e contas com pagamento salvo. Depois, as demais, sempre a partir de um dispositivo limpo.",
      },
    ],
    related: [
      { to: "/remocao-de-virus-curitiba", label: "Remoção de vírus em Curitiba" },
      { to: "/seguranca-dos-dados", label: "Segurança dos dados" },
      { to: "/formatacao-de-computador-curitiba", label: "Formatação de computador" },
    ],
  },
  {
    slug: "tv-liga-mas-sem-imagem",
    cluster: "tv",
    title: "TV liga mas não aparece imagem: diagnóstico",
    description:
      "Como diferenciar falha de backlight, placa de fonte e painel quando a TV liga com som e sem imagem, e o que torna o reparo inviável.",
    h1: "TV liga, tem som, mas não aparece imagem",
    answer:
      "Som presente e tela apagada geralmente significa falha de iluminação (backlight) ou da placa que a alimenta — não do painel. Essa distinção é o que separa um reparo viável de uma troca de tela cara.",
    symptoms: ["tv sem imagem", "tela preta com som", "tv não mostra imagem"],
    triage: { equipment: "tv", symptom: "no_image" },
    sections: [
      {
        h2: "O teste da lanterna",
        paragraphs: [
          "Com a TV ligada e o som funcionando, aproxime uma lanterna da tela em ambiente escuro e observe de perto, em ângulo. Se for possível enxergar uma imagem fraca — menus, logotipo, movimento —, o painel está gerando imagem e o que falta é iluminação. Esse é o cenário mais comum e frequentemente reparável.",
          "Se nem com lanterna há qualquer imagem, a suspeita passa para placa principal, T-CON ou o próprio painel, com custo e viabilidade bem diferentes.",
        ],
      },
      {
        h2: "Backlight: LEDs, fonte e proteção",
        paragraphs: [
          "A iluminação de uma TV LED depende de barras de LED e de um circuito de corrente constante na placa de fonte. Um único LED em curto ou aberto pode apagar toda a barra e, por proteção, derrubar a saída inteira. É por isso que a TV liga, emite som e permanece escura.",
          "Reparo de backlight envolve abrir o conjunto óptico, com películas difusoras que precisam ser manuseadas sem marcas nem poeira. É um serviço de bancada em ambiente controlado, não uma intervenção de campo.",
        ],
        bullets: [
          "Imagem visível com lanterna → backlight ou placa de fonte.",
          "Sem imagem alguma e som presente → placa principal ou T-CON.",
          "Imagem com metade da tela escura → barra de LED específica.",
          "Tela com marca de impacto ou trinca → painel, avaliação de viabilidade.",
        ],
      },
      {
        h2: "Antes de abrir: descarte o simples",
        paragraphs: [
          "Teste outra entrada HDMI e outro cabo, desconecte todos os periféricos e faça a TV inicializar sem nenhuma fonte externa. Aparelhos com receptor externo defeituoso produzem tela preta que parece defeito da TV.",
          "Faça também um ciclo de energia completo: retire da tomada por alguns minutos com o botão físico pressionado. Travamento de firmware em Smart TVs é frequente e resolve sem reparo.",
        ],
      },
      {
        h2: "Quando o conserto deixa de compensar",
        paragraphs: [
          "Painel trincado, com manchas de pressão ou linhas verticais permanentes coloca o custo da peça acima do valor da TV na maioria dos modelos. Nesses casos, a orientação honesta é não reparar — e isso deve constar do orçamento, não ser descoberto no meio do serviço.",
          "TVs de grande porte exigem transporte com proteção específica; por isso a modalidade adequada costuma ser coleta, não visita. As regras estão descritas em /precos.",
        ],
      },
    ],
    faqs: [
      {
        q: "TV com som e sem imagem tem conserto?",
        a: "Na maioria dos casos sim, quando a causa é backlight ou placa de fonte. Falha de painel é a exceção em que o reparo raramente compensa.",
      },
      {
        q: "Dá para trocar só alguns LEDs da barra?",
        a: "É possível, mas a prática recomendada é substituir o conjunto da barra afetada: LEDs vizinhos já envelhecidos falham em sequência pouco depois.",
      },
      {
        q: "Preciso levar o controle e a base da TV?",
        a: "Sim. Controle permite testar menus e entradas, e a base é necessária para posicionar o aparelho durante os testes finais.",
      },
      {
        q: "O atendimento de TV é feito em casa?",
        a: "O diagnóstico de imagem exige bancada. Por isso TVs seguem a modalidade de coleta, com retirada e devolução conforme as condições publicadas em /precos.",
      },
    ],
    related: [
      { to: "/servicos/reparo-smart-tv-curitiba", label: "Reparo de Smart TV em Curitiba" },
      { to: "/servicos/troca-de-tela-tv-curitiba", label: "Troca de tela de TV" },
      { to: "/servicos/tvs", label: "Serviços para TVs" },
    ],
  },
  {
    slug: "tv-com-listras-na-tela",
    cluster: "tv",
    title: "TV com listras ou manchas na tela: causas",
    description:
      "Listras verticais, faixas horizontais e manchas na TV: como identificar se o problema é cabo flat, T-CON ou painel e o que é reparável.",
    h1: "Listras, faixas e manchas na tela da TV",
    answer:
      "Listras finas verticais costumam vir do cabo flat e do driver de linha do painel; faixas largas e manchas apontam para T-CON ou dano físico. A origem define se há reparo viável.",
    symptoms: ["listra na tela", "faixa colorida", "mancha escura", "tela dividida"],
    triage: { equipment: "tv", symptom: "no_image" },
    sections: [
      {
        h2: "Leia o padrão da falha",
        paragraphs: [
          "Padrões geométricos regulares — colunas finas, metade da tela invertida, faixas simétricas — são gerados pela eletrônica de acionamento. Manchas irregulares, halos claros e sombras que mudam com a pressão indicam dano físico ao conjunto óptico ou ao próprio painel.",
          "Um teste simples: mude a fonte de vídeo e abra o menu interno da TV. Se o defeito aparece igualmente no menu, ele está depois do processamento — no painel ou no acionamento — e não tem relação com cabo HDMI ou receptor.",
        ],
        bullets: [
          "Linhas verticais finas e coloridas: contato do flat ou driver de coluna.",
          "Metade da imagem espelhada ou congelada: T-CON.",
          "Mancha escura em ponto de impacto: painel danificado.",
          "Faixa clara junto à borda: difusor deslocado ou backlight irregular.",
        ],
      },
      {
        h2: "O que é reparável com boa taxa de sucesso",
        paragraphs: [
          "Falhas de T-CON e de contato entre o flat e a placa respondem por uma parcela relevante dos casos e são reparáveis em bancada. O procedimento envolve limpeza e reassentamento dos contatos, quando não a substituição da placa por equivalente compatível.",
          "Também há casos de imagem distorcida causados por firmware corrompido: atualização ou reprogramação resolve sem substituir peça.",
        ],
      },
      {
        h2: "O que normalmente não compensa",
        paragraphs: [
          "Painéis com trinca, infiltração, marca de pressão ou perda de camada polarizadora não são reparáveis pontualmente — a peça é a tela inteira, e seu custo geralmente supera o valor de mercado do aparelho.",
          "Nessa situação, a avaliação técnica precisa dizer claramente que o reparo não é recomendado. Aceitar um serviço com prognóstico ruim gera custo e nenhum resultado.",
        ],
      },
      {
        h2: "Cuidados no transporte",
        paragraphs: [
          "Painéis suportam mal a torção. Transportar a TV deitada sobre a tela, apoiada no encosto do banco ou sem calços é a causa de boa parte das trincas que surgem 'do nada' após uma mudança.",
          "Sempre transporte na vertical, apoiada na base, com o painel protegido e imobilizado. Quando a coleta é feita pelo próprio serviço técnico, esse cuidado faz parte do procedimento.",
        ],
      },
    ],
    faqs: [
      {
        q: "Listra na tela pode piorar?",
        a: "Sim. Falhas de contato tendem a progredir com os ciclos térmicos, aumentando o número de colunas afetadas ao longo das semanas.",
      },
      {
        q: "Trocar a tela da TV vale a pena?",
        a: "Raramente. A peça é o item mais caro do aparelho; a avaliação de viabilidade é feita antes, com o valor comparado ao de um equipamento equivalente.",
      },
      {
        q: "Existe conserto para mancha causada por impacto?",
        a: "Não em nível de reparo pontual: o dano é no painel. A alternativa é substituição da tela, quando economicamente viável.",
      },
      {
        q: "A TV precisa ir para a oficina?",
        a: "Sim, esse tipo de diagnóstico exige desmontagem controlada e bancada, com coleta e devolução conforme as regras publicadas em /precos.",
      },
    ],
    related: [
      { to: "/servicos/troca-de-tela-tv-curitiba", label: "Troca de tela de TV em Curitiba" },
      { to: "/servicos/reparo-smart-tv-curitiba", label: "Reparo de Smart TV" },
      { to: "/servicos/tvs", label: "Serviços para TVs" },
    ],
  },
  {
    slug: "wifi-caindo-toda-hora",
    cluster: "redes",
    title: "Wi-Fi caindo toda hora: como diagnosticar",
    description:
      "Quedas constantes de Wi-Fi: como separar problema do provedor, do roteador, do canal e do cabeamento antes de trocar qualquer equipamento.",
    h1: "Wi-Fi caindo toda hora: diagnóstico por camadas",
    answer:
      "Queda de Wi-Fi tem três origens possíveis: link do provedor, roteador (hardware, firmware ou canal) e interferência local. Testar por camadas evita trocar equipamento que não é a causa.",
    symptoms: ["wifi cai", "internet instável", "desconecta sozinho", "sem internet"],
    triage: { equipment: "pc_notebook", symptom: "install_config" },
    sections: [
      {
        h2: "Camada 1: o link do provedor",
        paragraphs: [
          "Conecte um notebook diretamente ao modem por cabo e observe a estabilidade por algumas horas. Se a queda ocorre também no cabo, o problema não é Wi-Fi: está no link, no cabeamento externo ou no equipamento do provedor.",
          "Registre horários das quedas. Falhas concentradas no fim do dia costumam ser saturação da rede; quedas em qualquer horário, com reinício do modem, apontam para equipamento ou conector.",
        ],
      },
      {
        h2: "Camada 2: roteador, canal e banda",
        paragraphs: [
          "Em ambientes com muitos vizinhos, a faixa de 2,4 GHz fica congestionada. Fixar canais menos ocupados, separar as redes de 2,4 GHz e 5 GHz com nomes distintos e desativar recursos automáticos de troca de banda resolve boa parte das desconexões intermitentes de notebooks e celulares.",
          "Roteadores com firmware desatualizado ou memória saturada travam e reiniciam. Se o equipamento precisa ser reiniciado toda semana para voltar a funcionar, ele já está no fim da vida útil.",
        ],
        bullets: [
          "2,4 GHz: alcance maior, mais interferência, menos velocidade.",
          "5 GHz: velocidade maior, alcance menor, atravessa mal paredes.",
          "Canais fixos evitam renegociações constantes.",
          "Firmware atualizado corrige falhas de estabilidade conhecidas.",
        ],
      },
      {
        h2: "Camada 3: interferência e posicionamento",
        paragraphs: [
          "Roteador dentro de armário, atrás da TV, no chão ou junto a fornos de micro-ondas e telefones sem fio perde desempenho de forma dramática. A posição ideal é central, elevada e livre de obstruções metálicas.",
          "Espelhos, paredes de concreto armado e caixas d'água bloqueiam sinal com eficiência. Em imóveis com esses obstáculos, nenhum roteador único resolve — a saída correta é distribuir pontos de acesso.",
        ],
      },
      {
        h2: "Quando trocar equipamento resolve de fato",
        paragraphs: [
          "Trocar o roteador só faz sentido depois de eliminados link, canal e posicionamento. Quando a troca é justificada, o critério é cobertura por área, número de dispositivos simultâneos e suporte a rede em malha, não a velocidade máxima anunciada na caixa.",
          "Em ambientes maiores, cabeamento até um segundo ponto de acesso entrega resultado muito superior ao de repetidores, que dividem a banda pela metade a cada salto.",
        ],
      },
    ],
    faqs: [
      {
        q: "Repetidor de sinal resolve queda de Wi-Fi?",
        a: "Melhora cobertura, mas não corrige instabilidade de link nem interferência de canal. Repetidor mal posicionado amplifica a rede ruim que recebe.",
      },
      {
        q: "Devo separar as redes de 2,4 GHz e 5 GHz?",
        a: "Em ambientes com quedas frequentes, sim. Nomes distintos permitem fixar cada dispositivo na banda adequada e eliminam trocas automáticas malsucedidas.",
      },
      {
        q: "Como saber se a culpa é do provedor?",
        a: "Teste com cabo direto no modem por algumas horas. Queda com cabo indica link; estabilidade com cabo indica Wi-Fi.",
      },
      {
        q: "Rede em malha vale a pena?",
        a: "Vale em imóveis grandes, com lajes ou paredes espessas. Em apartamentos compactos, um roteador bem posicionado costuma bastar.",
      },
    ],
    related: [
      { to: "/servicos/configuracao-wifi-curitiba", label: "Configuração de Wi-Fi em Curitiba" },
      { to: "/servicos/redes-e-wifi", label: "Redes e Wi-Fi" },
      { to: "/servicos/redes", label: "Serviços de rede" },
    ],
  },
  {
    slug: "internet-lenta-em-alguns-comodos",
    cluster: "redes",
    title: "Internet lenta em alguns cômodos: como resolver",
    description:
      "Sinal fraco em quartos e áreas afastadas: mapeamento de cobertura, posicionamento, pontos de acesso e cabeamento para eliminar zonas mortas.",
    h1: "Internet boa na sala e ruim no quarto: eliminando zonas mortas",
    answer:
      "Velocidade que cai em cômodos específicos é problema de cobertura, não de plano contratado. Aumentar a velocidade contratada não melhora um ambiente onde o sinal não chega.",
    symptoms: ["sinal fraco", "internet lenta no quarto", "zona morta", "wifi não pega"],
    triage: { equipment: "pc_notebook", symptom: "install_config" },
    sections: [
      {
        h2: "Meça o sinal, não a sensação",
        paragraphs: [
          "Faça medições em cada cômodo com o mesmo dispositivo, anotando a intensidade do sinal e a velocidade real. Um mapa simples em papel já revela o padrão: normalmente a queda é abrupta a partir de uma parede específica ou de um desnível de laje.",
          "Compare também a velocidade próxima ao roteador com a velocidade contratada. Se já perto do equipamento o valor está muito abaixo, o problema é anterior à cobertura — link, cabo ou o próprio roteador.",
        ],
      },
      {
        h2: "Posicionamento antes de compra",
        paragraphs: [
          "Deslocar o roteador para um ponto central e elevado costuma render mais ganho que qualquer acessório. Antenas devem ficar verticais em imóveis de um pavimento e anguladas quando há dois andares, para espalhar o lóbulo de radiação entre os pisos.",
          "Retire o equipamento de dentro de racks fechados, de trás de televisores e de superfícies metálicas. Cada obstáculo é atenuação direta.",
        ],
        bullets: [
          "Roteador central e elevado, longe de metais e água.",
          "Cabos de rede para pontos fixos (TV, console, desktop) liberam o Wi-Fi.",
          "Ponto de acesso adicional cabeado supera repetidor.",
          "Rede em malha resolve imóveis com laje e corredores longos.",
        ],
      },
      {
        h2: "Repetidor, malha ou cabo",
        paragraphs: [
          "Repetidor é a solução mais barata e a de pior desempenho: ele recebe e retransmite na mesma rádio, cortando a banda. Serve para estender cobertura de navegação simples, não para vídeo e videoconferência.",
          "Rede em malha mantém um único nome de rede e faz a transição entre pontos sem quedas perceptíveis. O melhor resultado ocorre quando os nós são conectados por cabo — o que combina cobertura de malha com banda de cabeamento.",
        ],
      },
      {
        h2: "Quando o problema é o imóvel",
        paragraphs: [
          "Paredes de concreto armado, isolamento térmico com manta metalizada e portas corta-fogo bloqueiam sinal de rádio de forma quase completa. Nesses casos, insistir em Wi-Fi único é desperdício: a solução é levar cabo até o outro lado da barreira e criar um segundo ponto.",
          "Em imóveis alugados, canaletas externas e adaptadores de rede elétrica são alternativas quando não é possível passar cabo por dentro da parede — com a ressalva de que a rede elétrica limita a velocidade e é sensível à fiação existente.",
        ],
      },
    ],
    faqs: [
      {
        q: "Aumentar o plano de internet resolve sinal fraco?",
        a: "Não. Plano maior aumenta a banda que chega ao roteador; se o sinal não alcança o cômodo, a velocidade percebida continua baixa.",
      },
      {
        q: "Adaptador de rede elétrica funciona bem?",
        a: "Funciona quando os pontos estão no mesmo circuito e a fiação é boa. Em instalações antigas ou com muitos disjuntores intermediários, o desempenho cai bastante.",
      },
      {
        q: "Quantos pontos de acesso preciso?",
        a: "Depende da área e das barreiras. Um ponto por pavimento é a regra inicial em residências, ajustada pelas medições feitas no local.",
      },
      {
        q: "Vale trocar as antenas do roteador?",
        a: "O ganho é pequeno frente a reposicionamento e cabeamento. Priorize a topologia da rede antes de acessórios.",
      },
    ],
    related: [
      { to: "/servicos/redes-e-wifi", label: "Projeto de redes e Wi-Fi" },
      { to: "/servicos/configuracao-wifi-curitiba", label: "Configuração de Wi-Fi em Curitiba" },
      { to: "/servicos/suporte-tecnico-empresarial", label: "Suporte técnico empresarial" },
    ],
  },
  {
    slug: "celular-nao-carrega",
    cluster: "moveis",
    title: "Celular não carrega: causas e testes simples",
    description:
      "Celular que não carrega ou carrega devagar: como testar cabo, fonte, conector e bateria antes de concluir que precisa de reparo.",
    h1: "Celular não carrega: do cabo ao conector",
    answer:
      "Antes de qualquer reparo, elimine cabo, fonte e sujeira no conector — os três respondem pela maioria dos casos de 'não carrega'. Só depois entram bateria e circuito de carga.",
    symptoms: ["não carrega", "carrega devagar", "só carrega em certa posição", "bateria acaba rápido"],
    triage: { equipment: "celular_tablet", symptom: "battery_charge" },
    sections: [
      {
        h2: "Teste cruzado de cabo e fonte",
        paragraphs: [
          "Use outro cabo e outra fonte, de preferência de potência conhecida. Cabos falham internamente sem sinal externo, e fontes perdem capacidade com o tempo. Se com outro conjunto o carregamento normaliza, o aparelho está íntegro.",
          "Carregamento apenas em certa posição do cabo indica conector desgastado ou solda fria no aparelho — não é problema do carregador, mesmo que trocar o cabo pareça ajudar temporariamente.",
        ],
      },
      {
        h2: "Limpeza do conector",
        paragraphs: [
          "Bolso e mochila enchem o conector de fiapos compactados, que impedem o cabo de encaixar até o fim. O sintoma é exatamente 'só carrega se eu segurar'. A limpeza é feita com o aparelho desligado, ferramenta plástica e movimento de raspagem cuidadoso — nunca com objeto metálico pontiagudo, que danifica os contatos.",
          "Depois da limpeza, o cabo deve encaixar com um clique firme. Se continuar folgado, o conector precisa ser substituído.",
        ],
        bullets: [
          "Cabo folgado após limpeza: conector para substituição.",
          "Aquecimento excessivo durante a carga: fonte inadequada ou bateria degradada.",
          "Porcentagem que salta ou trava: bateria com célula em degradação.",
          "Aparelho só liga conectado: bateria no fim da vida útil.",
        ],
      },
      {
        h2: "Bateria: desgaste é esperado",
        paragraphs: [
          "Baterias de íon-lítio perdem capacidade com os ciclos. Após alguns anos de uso diário, é normal ver autonomia reduzida e picos de consumo em uso intenso — não é defeito, é vida útil.",
          "Bateria estufada, por outro lado, é caso de substituição imediata. O sinal visível é a tela ou a tampa traseira se descolando do quadro. Continuar usando o aparelho nesse estado representa risco real.",
        ],
      },
      {
        h2: "Cuidados com o reparo",
        paragraphs: [
          "Trocas de bateria em celulares atuais envolvem adesivos, vedação e, em vários modelos, calibração de firmware para que o sistema reconheça a peça. Serviço improvisado costuma comprometer a resistência à água e a leitura correta da carga.",
          "Aparelhos que sofreram contato com líquido devem ser avaliados o quanto antes, mesmo se ainda funcionando: a corrosão evolui em dias e atinge trilhas que depois não são recuperáveis.",
        ],
      },
    ],
    faqs: [
      {
        q: "Carregar a noite toda estraga a bateria?",
        a: "Aparelhos modernos interrompem a carga ao atingir 100%. O desgaste vem principalmente de calor e de ciclos completos frequentes, não do tempo conectado.",
      },
      {
        q: "Posso usar carregador de outro aparelho?",
        a: "Sim, desde que a fonte seja de qualidade e compatível com o padrão de carregamento. Fontes genéricas de baixa qualidade são causa recorrente de danos.",
      },
      {
        q: "Trocar a bateria devolve o desempenho?",
        a: "Devolve a autonomia e elimina desligamentos súbitos por queda de tensão. Não altera desempenho ligado a armazenamento cheio ou sistema desatualizado.",
      },
      {
        q: "Celular molhado: o que fazer primeiro?",
        a: "Desligar, não carregar e encaminhar para limpeza técnica. Tentar secar e usar é o que transforma um caso simples em corrosão profunda.",
      },
    ],
    related: [
      { to: "/servicos/celulares", label: "Assistência para celulares" },
      { to: "/precos", label: "Preços e condições" },
      { to: "/como-funciona", label: "Como funciona o atendimento" },
    ],
  },
  {
    slug: "videogame-desligando-sozinho",
    cluster: "moveis",
    title: "Videogame desligando sozinho: causas e reparo",
    description:
      "Console que desliga sozinho, faz barulho alto ou trava em jogos: como identificar superaquecimento, fonte e falhas de placa antes do reparo.",
    h1: "Videogame desligando sozinho ou muito barulhento",
    answer:
      "Console que desliga durante o jogo quase sempre está em proteção térmica. Ruído alto de exaustor é o aviso anterior: o sistema tenta compensar uma dissipação que já não funciona.",
    symptoms: ["console desliga", "barulho alto", "trava no jogo", "esquentando"],
    triage: { equipment: "videogame", symptom: "hdmi" },
    sections: [
      {
        h2: "Como o console se protege",
        paragraphs: [
          "Consoles monitoram temperatura em vários pontos e desligam para preservar o processador gráfico. O desligamento ocorre tipicamente em jogos pesados, depois de vinte ou trinta minutos, e não em menus — um padrão que confirma origem térmica.",
          "Se o desligamento acontece de forma aleatória, inclusive parado no menu, a suspeita muda para fonte de alimentação ou falha de placa.",
        ],
      },
      {
        h2: "Manutenção térmica que funciona",
        paragraphs: [
          "A manutenção correta inclui abertura, remoção do pó acumulado no radiador, limpeza do exaustor, substituição da pasta térmica e, nos modelos que utilizam, dos pads térmicos de memória. Sopro externo de ar comprimido compacta a sujeira ainda mais dentro das aletas.",
          "Reinstale o console em local ventilado, com folga nas laterais e longe de tapetes e móveis fechados. Posicionar o aparelho dentro de rack sem circulação anula qualquer manutenção feita.",
        ],
        bullets: [
          "Exaustor acelerando em minutos: dissipação comprometida.",
          "Desligamento repetido no mesmo trecho do jogo: carga térmica máxima.",
          "Console quente com exaustor parado: falha do exaustor.",
          "Desligamento com estalo ou cheiro: fonte, avaliação imediata.",
        ],
      },
      {
        h2: "Fonte, cabo e imagem",
        paragraphs: [
          "Falhas de imagem confundidas com defeito de console frequentemente vêm de cabo HDMI ou de porta danificada. Teste outra porta na TV e outro cabo antes de concluir qualquer coisa.",
          "Portas HDMI do console são um item de desgaste mecânico: conectar e desconectar com o cabo em ângulo solta a solda. O sintoma é imagem que aparece só com o cabo em determinada posição.",
        ],
      },
      {
        h2: "Por que consoles vão para bancada",
        paragraphs: [
          "Diagnóstico térmico exige carga controlada, medição de temperatura e testes prolongados — não se conclui em uma visita rápida. A modalidade adequada é coleta, com o aparelho testado sob carga real antes da devolução.",
          "Leve também o controle e a fonte quando forem parte do problema. Testar com os acessórios originais evita diagnóstico incompleto.",
        ],
      },
    ],
    faqs: [
      {
        q: "Console desligando estraga o aparelho?",
        a: "O desligamento é uma proteção. O que danifica é a repetição do ciclo térmico ao longo de meses, que castiga solda e componentes.",
      },
      {
        q: "Base ou cooler externo resolve?",
        a: "Ajuda pouco. O gargalo está no radiador interno obstruído e na pasta térmica, que só a manutenção interna resolve.",
      },
      {
        q: "De quanto em quanto tempo fazer limpeza?",
        a: "Uso intenso pede revisão anual; uso ocasional em ambiente limpo, a cada dois anos.",
      },
      {
        q: "O atendimento é em casa?",
        a: "Não. Consoles seguem coleta para bancada, conforme as condições publicadas em /precos, porque o teste sob carga leva horas.",
      },
    ],
    related: [
      { to: "/servicos/games", label: "Assistência para videogames" },
      { to: "/precos", label: "Preços e condições" },
      { to: "/status-os", label: "Acompanhar ordem de serviço" },
    ],
  },
];

export const GUIDE_BY_SLUG: Record<string, SolutionGuide> = Object.fromEntries(
  SOLUTION_GUIDES.map((g) => [g.slug, g]),
);

export function guidesByCluster(cluster: SolutionClusterId): SolutionGuide[] {
  return SOLUTION_GUIDES.filter((g) => g.cluster === cluster);
}

/** Guias irmãos (mesmo cluster) + um guia de outro cluster, para a malha interna. */
export function relatedGuides(slug: string, limit = 4): SolutionGuide[] {
  const current = GUIDE_BY_SLUG[slug];
  if (!current) return SOLUTION_GUIDES.slice(0, limit);
  const siblings = guidesByCluster(current.cluster).filter((g) => g.slug !== slug);
  const others = SOLUTION_GUIDES.filter((g) => g.cluster !== current.cluster);
  return [...siblings, ...others].slice(0, limit);
}

export const SOLUTIONS_HUB_PATH = "/solucoes";
export const guidePath = (slug: string) => `${SOLUTIONS_HUB_PATH}/${slug}`;
