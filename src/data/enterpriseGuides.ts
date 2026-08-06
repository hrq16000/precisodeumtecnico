/**
 * Conteúdo educacional empresarial (Rodada 31).
 *
 * Fonte única dos dois guias de apoio à triagem B2B. Não cria rotas por
 * profissão: são páginas de conteúdo com intenção informacional que
 * direcionam para os serviços já existentes no App.
 *
 * Regra de claims: nada aqui pode afirmar prazo fixo de garantia, número de
 * clientes, parcelamento ou emissão fiscal — apenas escopo técnico e critérios.
 */

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  /** Tabela comparativa opcional (ex.: avulso x recorrente). */
  table?: { head: string[]; rows: string[][] };
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface EnterpriseGuide {
  slug: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  kicker: string;
  sections: GuideSection[];
  checklist: { label: string; detail: string }[];
  limits: string[];
  faq: GuideFaq[];
  whatsappService: string;
  /** Quando presente, o hero exibe CTA de triagem além do WhatsApp. */
  triage?: { source: string; category?: string; city?: string };
  /** Quando presente, emite schema Service além do Article. */
  serviceSchema?: { name: string; description: string; areaServed: string };

}

export const IT_OFFICE_GUIDE: EnterpriseGuide = {
  slug: "organizacao-de-ti-para-pequenos-escritorios",
  path: "/guias/organizacao-de-ti-para-pequenos-escritorios",
  kicker: "Guia operacional para escritórios de 3 a 30 postos",
  title: "Organização de TI para pequenos escritórios",
  metaTitle: "Organização de TI para Pequenos Escritórios | Guia Prático",
  metaDescription:
    "Como organizar a TI de um escritório pequeno: inventário de equipamentos, rede, backup, contas de acesso, rotina de manutenção e o que checar antes de chamar suporte.",
  intro:
    "A maior parte das paradas em escritórios de 3 a 30 postos não vem de falha grave de hardware: vem de rede improvisada, backup inexistente, senhas compartilhadas e equipamentos sem inventário. Este guia mostra a ordem em que essas frentes devem ser resolvidas, o que dá para padronizar sem contratar estrutura de grande empresa e quais sinais indicam que já é hora de acionar suporte técnico presencial.",
  sections: [
    {
      id: "inventario",
      title: "1. Inventário: você não gerencia o que não conhece",
      paragraphs: [
        "O primeiro passo é ter uma lista real do que existe. Sem inventário, cada chamado vira investigação: ninguém sabe a idade da máquina, se o SSD já foi trocado, qual licença está instalada ou quem usa aquele notebook. Uma planilha simples resolve — o valor está em manter a lista viva, não na ferramenta.",
        "Registre por equipamento: identificação física (etiqueta), responsável, setor, configuração básica (processador, memória, tipo de disco), sistema operacional, data de compra ou de entrada em uso e histórico de intervenções. Periféricos críticos entram também: roteador, switch, impressora de rede, nobreak e storage.",
      ],
      bullets: [
        "Etiquete cada máquina com um código curto e use esse código em todo chamado técnico.",
        "Anote o número de série do roteador, do switch e da impressora — são os itens mais esquecidos.",
        "Marque quais postos são críticos (financeiro, emissão, atendimento) para priorizar em uma parada.",
        "Revise o inventário a cada trimestre e sempre que houver entrada ou saída de pessoas.",
      ],
    },
    {
      id: "rede",
      title: "2. Rede: cabo onde é crítico, Wi-Fi onde é conveniente",
      paragraphs: [
        "Escritório pequeno costuma crescer em cima de um roteador doméstico e de repetidores empilhados. Funciona até o momento em que oito ou dez pessoas usam videochamada, sistema em nuvem e impressora de rede ao mesmo tempo — aí a lentidão aparece de forma intermitente e ninguém consegue reproduzir o problema.",
        "A separação básica é simples: postos fixos e impressoras em cabo; celulares, notebooks de visitantes e dispositivos móveis em Wi-Fi. Uma rede de visitantes isolada evita que o dispositivo pessoal de alguém enxergue arquivos compartilhados internos.",
      ],
      bullets: [
        "Postos fixos e impressoras cabeados sempre que houver infraestrutura ou possibilidade de passagem.",
        "SSID de visitantes separado da rede interna, sem acesso a pastas compartilhadas.",
        "IP fixo (ou reserva por MAC) para impressora, storage e câmeras — impede que mudem de endereço e quebrem o acesso.",
        "Roteador e switch em local ventilado e ligado no nobreak, nunca em cima de armário fechado.",
        "Documente a senha do Wi-Fi interno em cofre de senhas, não em post-it na parede.",
      ],
    },
    {
      id: "backup",
      title: "3. Backup: a única frente que não aceita improviso",
      paragraphs: [
        "Backup é o item em que escritórios pequenos mais acumulam risco. O padrão de referência continua sendo a regra 3-2-1: três cópias dos dados, em dois tipos de mídia diferentes, sendo uma delas fora do escritório. Nuvem sincronizada não é backup por si só — se um arquivo é apagado ou criptografado, a sincronização replica a perda.",
        "Mais importante que configurar o backup é testá-lo. Uma restauração de teste por mês, escolhendo um arquivo aleatório e conferindo se ele abre íntegro, é o que separa backup real de falsa sensação de segurança.",
      ],
      bullets: [
        "Liste explicitamente o que precisa ser salvo: sistema de gestão, contratos, planilhas financeiras, projetos e caixas de e-mail.",
        "Uma cópia local (disco externo ou NAS) e uma cópia externa (nuvem) no mínimo.",
        "Versionamento ativo, para conseguir voltar a um estado anterior em caso de ransomware.",
        "Teste de restauração mensal, com registro de quem testou e o que foi restaurado.",
        "Disco externo de backup não fica permanentemente conectado à máquina que ele protege.",
      ],
    },
    {
      id: "acessos",
      title: "4. Contas e acessos: senha compartilhada é dívida técnica",
      paragraphs: [
        "Em escritórios pequenos é comum uma única conta de administrador ser usada por todos. Isso destrói a rastreabilidade: quando algo é apagado ou alterado, não há como saber quem fez. Também transforma o desligamento de qualquer pessoa em um problema, porque a senha precisa ser trocada em dezenas de sistemas ao mesmo tempo.",
        "O caminho é criar uma conta por pessoa, com permissão limitada ao que ela realmente usa, e reservar a conta de administrador para manutenção. Um gerenciador de senhas corporativo resolve o compartilhamento controlado de credenciais de sistemas que não suportam múltiplos usuários.",
      ],
      bullets: [
        "Uma conta nominal por pessoa, no computador e nos sistemas.",
        "Conta de administrador local separada, usada apenas para instalar e manter.",
        "Autenticação em duas etapas ativa em e-mail, nuvem e sistemas financeiros.",
        "Procedimento escrito de desligamento: revogar acessos no mesmo dia e transferir arquivos do usuário.",
        "Gerenciador de senhas em vez de planilha ou caderno.",
      ],
    },
    {
      id: "rotina",
      title: "5. Rotina de manutenção: o calendário que evita chamado urgente",
      paragraphs: [
        "Manutenção preventiva em escritório pequeno não exige contrato complexo — exige calendário. A maioria das falhas dá aviso: disco com setores realocados, cooler ruidoso, nobreak com bateria estufada, atualização de sistema pendente há meses.",
        "Um ciclo trimestral de verificação física e um ciclo mensal de verificação lógica cobrem bem a realidade de um escritório com poucas dezenas de postos.",
      ],
      bullets: [
        "Mensal: atualizações do sistema e do antivírus, checagem de espaço em disco e teste de restauração de backup.",
        "Trimestral: limpeza interna dos gabinetes, verificação de saúde dos discos (SMART) e teste de autonomia do nobreak.",
        "Semestral: revisão do inventário, revisão de permissões de pasta e conferência das licenças em uso.",
        "Sempre que houver mudança de layout: revisar cabeamento, aterramento das tomadas e posição do roteador.",
      ],
    },
    {
      id: "quando-chamar",
      title: "6. Quando parar de tentar resolver internamente",
      paragraphs: [
        "Existe um limite claro entre ajuste de configuração e intervenção técnica. Insistir além dele costuma transformar um problema simples em perda de dados.",
        "Se o sintoma se enquadra na lista abaixo, o próximo passo é diagnóstico técnico, não tentativa adicional.",
      ],
      bullets: [
        "Máquina que desliga sozinha, reinicia em uso ou apresenta tela azul recorrente.",
        "Disco fazendo ruído, sistema travando ao abrir arquivos ou arquivos sumindo.",
        "Suspeita de ransomware ou arquivos renomeados em massa — desligue a máquina da rede antes de qualquer coisa.",
        "Rede caindo em horários específicos, sem correlação com uso.",
        "Servidor ou storage inacessível para mais de um posto ao mesmo tempo.",
      ],
    },
    {
      id: "sistemas-terceiros",
      title: "7. Sistemas, licenças e fornecedores externos",
      paragraphs: [
        "Boa parte do que trava o dia a dia de um escritório não roda no computador: roda em sistema de gestão, emissor fiscal, plataforma contábil ou serviço de e-mail mantido por outra empresa. Quando esse tipo de sistema apresenta erro, o caminho de solução passa pelo fornecedor responsável, e não pela máquina do usuário.",
        "Ter acesso ao computador não significa ter controle sobre sistemas mantidos por terceiros. Falhas internas da plataforma podem depender do fornecedor responsável. Registrar essa camada com antecedência encurta o tempo de resposta, porque evita a busca por contato e senha no momento da parada.",
      ],
      bullets: [
        "Nome do sistema e para que ele é usado dentro do escritório.",
        "Fornecedor, canal oficial de suporte e horário de atendimento.",
        "Responsável interno pelo relacionamento com aquele fornecedor.",
        "Licença contratada, forma de renovação e data aproximada de vencimento.",
        "E-mail de recuperação da conta e quem tem acesso a ele.",
        "Restrições de acesso: quem pode alterar cadastro, emitir documento ou excluir registro.",
        "Documentação ou manual disponibilizado pelo fornecedor.",
      ],
    },
    {
      id: "continuidade",
      title: "8. Continuidade enquanto o problema não é resolvido",
      paragraphs: [
        "Nenhum escritório para por inteiro: normalmente um posto, um sistema ou um equipamento sai do ar. O que define o tamanho do prejuízo é ter decidido antes o que fazer nesse intervalo, em vez de decidir no meio da urgência.",
        "O exercício é curto e pode ser feito em uma reunião: liste os equipamentos mais críticos, quem fica impedido de trabalhar quando cada um falha e qual alternativa temporária existe. Isso não elimina a parada e não substitui um plano corporativo de continuidade — apenas reduz o improviso.",
      ],
      bullets: [
        "Equipamentos e sistemas cuja falha impede o trabalho de mais de uma pessoa.",
        "Usuário mais impactado em cada cenário e quem pode assumir a tarefa temporariamente.",
        "Alternativa provisória: outro posto, acesso pelo celular, uso de notebook reserva quando existir.",
        "Contatos de fornecedores que precisam ser acionados no mesmo dia.",
        "Onde está o backup e quem sabe iniciar uma restauração.",
        "Registro do erro (mensagem exata, horário e o que estava sendo feito) antes de reiniciar.",
      ],
    },
    {
      id: "registrar-antes",
      title: "9. O que registrar antes de solicitar suporte",
      paragraphs: [
        "Chamado bem descrito reduz o tempo de diagnóstico e evita deslocamento desnecessário. Na maioria dos casos, o que falta não é conhecimento técnico do usuário: é informação básica sobre quando e como o problema aparece.",
        "Não envie senha, código de autenticação em duas etapas ou dado bancário por mensagem. Essas informações não são necessárias para abrir um chamado e não devem circular em conversa.",
      ],
      bullets: [
        "Identificação do equipamento (a etiqueta do inventário) e quem o utiliza.",
        "Mensagem de erro copiada por escrito ou fotografada por inteiro.",
        "Data e horário aproximados em que o problema começou.",
        "O que estava sendo feito no momento da falha.",
        "Se o problema atinge um posto, vários postos ou todos.",
        "Se algo mudou antes: atualização, instalação, mudança de layout, queda de energia.",
        "Se o sintoma é constante ou intermitente, e em quais horários aparece.",
        "O que já foi tentado internamente e qual foi o resultado.",
      ],
    },
    {
      id: "avulso-recorrente",
      title: "10. Atendimento avulso ou acompanhamento recorrente",
      paragraphs: [
        "As duas formas resolvem problemas diferentes. O atendimento avulso responde a um sintoma existente; o acompanhamento recorrente organiza verificações antes que o sintoma apareça. Um escritório pequeno começa quase sempre pelo avulso e passa a considerar o recorrente quando os chamados se repetem no mesmo conjunto de causas.",
      ],
      table: {
        head: ["Critério", "Atendimento avulso", "Acompanhamento recorrente"],
        rows: [
          ["Motivo típico", "Falha já em curso", "Verificação antes da falha"],
          ["Escopo", "Definido por chamado", "Definido por rotina combinada"],
          ["Inventário", "Levantado no atendimento", "Mantido atualizado entre visitas"],
          ["Backup", "Verificado quando é o tema do chamado", "Conferido na rotina programada"],
          ["Histórico", "Registro do chamado", "Histórico acumulado por equipamento"],
          ["Quando faz sentido", "Poucos postos, problemas isolados", "Chamados repetidos e parada com custo alto"],
        ],
      },
      bullets: [
        "Nenhum dos formatos garante ausência de paradas — o recorrente reduz o improviso, não elimina o risco.",
        "Escopo, valores e forma de execução são definidos por escrito antes de qualquer atendimento.",
      ],
    },
    {
      id: "prioridades",
      title: "11. Por onde começar quando não dá para fazer tudo",
      paragraphs: [
        "Organizar tudo de uma vez raramente é possível. A sequência abaixo prioriza o que reduz mais risco por esforço investido, e cada etapa continua válida mesmo que a seguinte demore.",
      ],
      bullets: [
        "1. Backup listado, configurado e com uma restauração de teste registrada.",
        "2. Contas nominais e duas etapas em e-mail e sistemas financeiros.",
        "3. Inventário mínimo dos equipamentos e dos sistemas de terceiros.",
        "4. Rede: postos críticos cabeados, Wi-Fi de visitantes separado e IP fixo em impressora e storage.",
        "5. Energia: nobreak nos postos e equipamentos que não podem desligar de forma abrupta.",
        "6. Calendário de manutenção preventiva com responsável definido.",
        "7. Renovação de hardware, por último — trocar máquina antes de resolver backup aumenta a exposição.",
      ],
    },
  ],

  checklist: [
    { label: "Inventário atualizado", detail: "Lista de máquinas, responsáveis e histórico de intervenções revisada no trimestre." },
    { label: "Rede segmentada", detail: "Postos críticos cabeados, Wi-Fi de visitantes isolado e IP fixo em impressora e storage." },
    { label: "Backup 3-2-1 testado", detail: "Cópia local, cópia externa, versionamento e restauração de teste registrada no mês." },
    { label: "Acessos nominais", detail: "Uma conta por pessoa, administrador separado e duas etapas nos sistemas críticos." },
    { label: "Energia protegida", detail: "Nobreak dimensionado, bateria testada e rack ou ponto de rede em local ventilado." },
    { label: "Rotina em calendário", detail: "Checagens mensais, trimestrais e semestrais com responsável definido." },
  ],
  limits: [
    "Este guia cobre organização e prevenção; ele não substitui diagnóstico presencial de falha ativa.",
    "Recuperação de dados de disco com falha física exige procedimento próprio e avaliação em bancada antes de qualquer estimativa.",
    "Ajustes em sistemas de gestão de terceiros dependem do suporte do fabricante do software.",
    "Intervenções em quadro elétrico e infraestrutura predial seguem escopo separado do suporte de TI.",
  ],
  faq: [
    {
      question: "A partir de quantos computadores um escritório precisa organizar a TI?",
      answer:
        "Na prática, a partir de três postos compartilhando arquivos, impressora e internet já compensa ter inventário, backup e contas nominais. Abaixo disso a informalidade ainda é gerenciável; acima disso o custo de uma parada passa a superar o esforço de organização.",
    },
    {
      question: "Nuvem sincronizada substitui backup?",
      answer:
        "Não. Sincronização replica o que acontece no arquivo, inclusive exclusão e criptografia por ransomware. Backup exige cópia adicional com versionamento e, de preferência, uma cópia que não esteja permanentemente conectada.",
    },
    {
      question: "Vale a pena usar roteador doméstico em escritório?",
      answer:
        "Funciona em cenários muito pequenos e com pouco tráfego simultâneo. Quando há videochamada, sistema em nuvem e impressão de rede ao mesmo tempo, o gargalo aparece como lentidão intermitente e o equipamento passa a ser a causa raiz dos chamados.",
    },
    {
      question: "Com que frequência devo testar o backup?",
      answer:
        "Uma restauração de teste por mês é o mínimo razoável. Escolha um arquivo aleatório, restaure e confirme que ele abre íntegro, registrando data e responsável.",
    },
    {
      question: "O que fazer no primeiro sinal de ransomware?",
      answer:
        "Desconecte a máquina da rede imediatamente, não reinicie e não tente renomear arquivos. Reiniciar pode concluir o processo de criptografia e reduzir as chances de recuperação parcial.",
    },
    {
      question: "Como priorizar quando o orçamento é limitado?",
      answer:
        "A ordem que mais reduz risco por real investido é: backup testado, depois contas e acessos, depois rede e energia, e por último renovação de hardware. Trocar máquinas antes de resolver backup só aumenta a exposição.",
    },
    {
      question: "Quais informações devem ser registradas no inventário?",
      answer:
        "Equipamento e categoria, usuário responsável, local dentro do escritório, configuração relevante, sistema operacional, programas principais, data aproximada de entrada em uso, situação de garantia, problema já conhecido e o quanto aquele posto é importante para a operação.",
    },
    {
      question: "Preciso guardar senhas junto com o inventário?",
      answer:
        "Não. Inventário registra equipamento e responsabilidade. Senhas, códigos de autenticação, CPF, dados bancários, chaves privadas e dados de clientes ficam fora dessa lista e devem estar em um gerenciador de senhas com acesso controlado.",
    },
    {
      question: "Quem deve ser responsável pela informática do escritório?",
      answer:
        "Mesmo sem equipe de TI, é preciso haver uma pessoa interna que centralize inventário, contatos de fornecedores e abertura de chamados. Sem esse ponto único, cada problema recomeça do zero e a informação se perde entre pessoas.",
    },
    {
      question: "Atendimento avulso é suficiente para uma empresa pequena?",
      answer:
        "Em muitos casos sim, principalmente com poucos postos e problemas isolados. O atendimento avulso resolve o sintoma existente, com escopo definido por chamado.",
    },
    {
      question: "Quando vale considerar acompanhamento recorrente?",
      answer:
        "Quando os chamados passam a se repetir pelas mesmas causas, quando a parada de um posto impede o trabalho de várias pessoas ou quando ninguém internamente consegue manter inventário, backup e atualizações em dia.",
    },
    {
      question: "Como registrar um problema antes de pedir suporte?",
      answer:
        "Anote a identificação do equipamento, a mensagem de erro por inteiro, data e horário do início, o que estava sendo feito, se atinge um ou vários postos, o que mudou antes e o que já foi tentado. Não envie senha nem código de autenticação por mensagem.",
    },
  ],

  whatsappService: "organização de TI para escritório",
};

export const WORKSTATION_GUIDE: EnterpriseGuide = {
  slug: "como-escolher-uma-workstation",
  path: "/guias/como-escolher-uma-workstation",
  kicker: "Critérios técnicos e limites operacionais para empresas",
  title: "Como escolher uma workstation",
  metaTitle: "Como Escolher uma Workstation | Checklist Técnico Empresarial",
  metaDescription:
    "Checklist para escolher workstation por carga de trabalho: CPU, memória ECC, GPU profissional, armazenamento, energia e limites operacionais antes de fechar a compra.",
  intro:
    "Workstation não é um desktop caro: é uma máquina dimensionada para uma carga de trabalho específica, com componentes escolhidos pelo perfil de uso — CAD, modelagem 3D, edição de vídeo, engenharia, análise de dados ou virtualização. Escolher pelo processador mais caro sem olhar memória, armazenamento e energia é o erro mais comum e o mais difícil de corrigir depois. Este guia traz o checklist de requisitos por perfil e os limites operacionais que precisam estar claros antes da compra.",
  sections: [
    {
      id: "carga",
      title: "1. Comece pela carga de trabalho, não pela ficha técnica",
      paragraphs: [
        "Antes de comparar componentes, descreva o que a máquina vai fazer no pior dia: qual software, qual tamanho de arquivo, quantas tarefas simultâneas e qual prazo. Uma workstation de CAD 2D e uma de renderização 3D compartilham o gabinete e quase nada mais.",
        "Perfis que exigem decisões diferentes: modelagem e CAD favorecem clock alto por núcleo e GPU certificada; renderização, compilação e simulação favorecem muitos núcleos; edição de vídeo favorece armazenamento rápido e memória abundante; análise de dados e virtualização favorecem memória em primeiro lugar.",
      ],
      bullets: [
        "Liste os softwares e verifique os requisitos oficiais recomendados — não os mínimos.",
        "Meça o tamanho típico dos arquivos de trabalho: isso define memória e armazenamento antes de tudo.",
        "Considere o número de tarefas simultâneas (render em segundo plano enquanto se modela, por exemplo).",
        "Defina o horizonte de uso: uma máquina para três anos e outra para cinco têm folgas diferentes.",
      ],
    },
    {
      id: "requisitos",
      title: "1b. Levantamento de requisitos: o que registrar antes de decidir",
      paragraphs: [
        "Nenhuma configuração deve ser definida pela profissão de quem vai usar a máquina. Duas pessoas com o mesmo cargo podem ter necessidades opostas dependendo do tamanho dos arquivos, da quantidade de programas abertos e do tipo de projeto. O levantamento abaixo é o que permite discutir componentes com base em fatos.",
        "Nomes de aplicações aparecem aqui apenas como exemplo de contexto. O critério de decisão é sempre o requisito oficial publicado pelo fornecedor do software somado ao comportamento real do arquivo em uso.",
      ],
      bullets: [
        "Programas utilizados e a versão instalada de cada um.",
        "Tipo de projeto: desenho técnico, modelagem, render, edição, análise de dados ou virtualização.",
        "Tamanho típico dos arquivos e tamanho do maior arquivo já aberto.",
        "Quantidade de arquivos e de programas abertos ao mesmo tempo.",
        "Resolução de trabalho e quantidade de monitores.",
        "Tempo diário de uso e duração das tarefas mais pesadas.",
        "Necessidade de mobilidade ou uso fixo em um posto.",
        "Armazenamento já em uso hoje e crescimento esperado.",
        "Necessidade de expansão futura de memória, disco ou vídeo.",
        "Orçamento disponível e prazo esperado de utilização da máquina.",
      ],
    },

    {
      id: "cpu",
      title: "2. Processador: clock por núcleo x quantidade de núcleos",
      paragraphs: [
        "Muitos softwares de modelagem e CAD ainda dependem fortemente do desempenho de um único núcleo. Nesses casos, um processador com clock mais alto e menos núcleos entrega mais que um processador de muitos núcleos com clock menor.",
        "Já renderização, compilação, simulação e processamento em lote escalam com núcleos. Quando os dois perfis convivem na mesma máquina, o equilíbrio costuma estar em processadores de gama alta de plataforma padrão, deixando plataformas de estação de trabalho pesada apenas para cargas realmente paralelas.",
      ],
      bullets: [
        "Modelagem, CAD 2D/3D e software de engenharia: priorize clock por núcleo.",
        "Render, simulação, compilação e transcodificação: priorize contagem de núcleos.",
        "Confira se o software tem limite de licença por núcleo ou por socket antes de comprar.",
        "Avalie o dissipador junto com o processador: throttling térmico anula ganho de clock.",
      ],
    },
    {
      id: "memoria",
      title: "3. Memória: capacidade primeiro, ECC quando o erro custa caro",
      paragraphs: [
        "Falta de memória é o gargalo mais visível em workstation: o sistema passa a usar disco como memória e o desempenho cai de forma abrupta, não gradual. Como referência prática, 32 GB é um piso confortável para CAD e edição leve, 64 GB para 3D e vídeo em resoluções altas, e 128 GB ou mais para simulação, grandes conjuntos de dados e virtualização.",
        "Memória ECC corrige erros de bit em tempo real. Ela faz diferença quando um resultado silenciosamente errado é pior que uma parada — simulação, cálculo estrutural, finanças e processamento longo de dados. Exige processador e placa-mãe compatíveis, o que muda a plataforma inteira.",
      ],
      bullets: [
        "Deixe slots livres para expansão futura em vez de preencher todos com módulos menores.",
        "Monte em canais equilibrados (dual ou quad channel) conforme a plataforma.",
        "ECC apenas se a plataforma suportar oficialmente — não é adaptável depois.",
        "Verifique a lista de compatibilidade de memória da placa-mãe antes de comprar.",
      ],
    },
    {
      id: "gpu",
      title: "4. GPU: certificada, de consumo ou nenhuma das duas",
      paragraphs: [
        "GPU profissional certificada existe por causa de validação de driver junto aos fabricantes de software: ela reduz artefatos de viewport, travamentos em ferramentas específicas e problemas de suporte quando o fornecedor do software exige configuração homologada.",
        "Para renderização por GPU, edição de vídeo e cargas de computação, placas de consumo de gama alta frequentemente entregam mais desempenho por real. A decisão depende de haver ou não exigência formal de certificação, e da quantidade de memória de vídeo necessária para o tamanho das cenas ou timelines.",
      ],
      bullets: [
        "Verifique se o fabricante do software exige GPU certificada para suporte oficial.",
        "Dimensione a memória de vídeo pelo tamanho das cenas, timelines ou modelos, não pelo nome da placa.",
        "Confira o número e o tipo de saídas de vídeo pelo arranjo real de monitores.",
        "Confirme espaço físico no gabinete e fluxo de ar antes de escolher placas de grande porte.",
      ],
    },
    {
      id: "armazenamento",
      title: "5. Armazenamento em camadas",
      paragraphs: [
        "Workstation trabalha melhor com armazenamento dividido por função em vez de um único disco grande. Sistema e aplicativos em NVMe; projeto ativo em um segundo NVMe; arquivo morto e material bruto em disco de alta capacidade ou storage de rede.",
        "Essa separação reduz disputa de acesso durante exportação e render, e facilita a rotina de backup, porque o volume de projeto ativo é pequeno e previsível.",
      ],
      bullets: [
        "NVMe para sistema e aplicativos, com folga de pelo menos 30% de espaço livre.",
        "Segundo NVMe dedicado a projeto ativo, cache e arquivos temporários.",
        "Disco de capacidade ou NAS para arquivo morto e material bruto.",
        "RAID aumenta disponibilidade, não substitui backup — as duas coisas continuam necessárias.",
      ],
    },
    {
      id: "energia",
      title: "6. Energia, refrigeração e ruído",
      paragraphs: [
        "Fonte subdimensionada é a causa de instabilidade mais frequentemente diagnosticada como problema de software. Dimensione pela soma real dos componentes, com folga de 30% para picos e para envelhecimento da fonte, e verifique se ela possui os conectores exigidos pela GPU escolhida.",
        "Refrigeração e ruído importam porque workstation costuma ficar ao lado de quem trabalha. Um fluxo de ar bem definido e ventoinhas maiores em rotação menor entregam a mesma dissipação com menos ruído, e o nobreak protege contra o desligamento no meio de um processamento longo.",
      ],
      bullets: [
        "Fonte com folga de 30% sobre o consumo somado e conectores nativos para a GPU.",
        "Nobreak dimensionado para desligamento seguro, não para trabalhar durante a queda.",
        "Fluxo de ar com entrada frontal e saída traseira/superior, sem obstrução por cabos.",
        "Filtros de poeira acessíveis, porque limpeza difícil é limpeza que não acontece.",
      ],
    },
  ],
  checklist: [
    { label: "Carga de trabalho descrita", detail: "Softwares, tamanho dos arquivos, tarefas simultâneas e horizonte de uso definidos por escrito." },
    { label: "Processador coerente com o perfil", detail: "Clock por núcleo para CAD e modelagem; contagem de núcleos para render e simulação." },
    { label: "Memória dimensionada com folga", detail: "Capacidade compatível com o pior caso de uso, slots livres e ECC apenas se a plataforma suportar." },
    { label: "GPU conforme exigência do software", detail: "Certificação verificada, memória de vídeo pelo tamanho das cenas e saídas conforme os monitores." },
    { label: "Armazenamento em camadas", detail: "NVMe de sistema, NVMe de projeto ativo e destino de arquivo morto definidos." },
    { label: "Energia e térmica validadas", detail: "Fonte com folga, conectores corretos, nobreak e fluxo de ar planejado." },
    { label: "Backup do posto previsto", detail: "Projeto ativo com cópia externa e rotina de restauração de teste." },
  ],
  limits: [
    "Compatibilidade de peças é conferida antes da montagem; peça incompatível identificada na conferência interrompe o processo até a definição do cliente.",
    "Desempenho depende também do software e do projeto: nenhuma configuração é entregue com promessa de tempo de render ou de FPS específico.",
    "Overclock não é aplicado em máquina de produção, por reduzir estabilidade e cobertura de garantia dos componentes.",
    "Peças fornecidas pelo cliente seguem a política de peças do cliente, com registro de estado na entrada e garantia limitada ao serviço.",
    "Certificação de software junto ao fabricante é responsabilidade do fornecedor do software; a montagem segue a lista homologada que a empresa indicar.",
  ],
  faq: [
    {
      question: "Qual a diferença prática entre workstation e desktop de gama alta?",
      answer:
        "Workstation é dimensionada por carga de trabalho e prioriza estabilidade em uso contínuo: memória com folga (às vezes ECC), armazenamento em camadas, energia com margem e refrigeração pensada para horas de processamento. Um desktop de gama alta pode ter componentes rápidos sem esse equilíbrio.",
    },
    {
      question: "Preciso mesmo de memória ECC?",
      answer:
        "Só quando um resultado silenciosamente incorreto for pior que uma parada — simulação, cálculo de engenharia, finanças e processamento longo de dados. ECC exige processador e placa-mãe compatíveis, então é uma decisão de plataforma, não um acessório.",
    },
    {
      question: "GPU profissional certificada compensa?",
      answer:
        "Compensa quando o fabricante do software exige configuração homologada para dar suporte, ou quando a estabilidade de viewport é crítica. Para render por GPU e edição, placas de consumo de gama alta costumam entregar mais desempenho por real.",
    },
    {
      question: "Quanta memória é suficiente?",
      answer:
        "Como referência prática: 32 GB para CAD e edição leve, 64 GB para 3D e vídeo em resolução alta, 128 GB ou mais para simulação, grandes conjuntos de dados e virtualização. Deixe slots livres para expansão.",
    },
    {
      question: "Posso comprar as peças e pedir só a montagem?",
      answer:
        "Sim. As peças passam por conferência de compatibilidade e registro de estado na entrada, e a garantia do serviço cobre a montagem e a configuração — a garantia da peça permanece com o fornecedor dela.",
    },
    {
      question: "Vale mais atualizar a máquina atual ou comprar uma nova?",
      answer:
        "Se o gargalo é memória ou armazenamento e a plataforma ainda suporta expansão, o upgrade costuma resolver por uma fração do custo. Se o gargalo é o processador ou a plataforma não suporta a memória necessária, a substituição tende a ser mais econômica no total.",
    },
  ],
  whatsappService: "dimensionamento de workstation",
};

export const ENTERPRISE_GUIDES: EnterpriseGuide[] = [IT_OFFICE_GUIDE, WORKSTATION_GUIDE];
