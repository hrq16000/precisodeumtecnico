/**
 * Landing pages empresariais (Rodada 31).
 *
 * Reutilizam a estrutura de EnterpriseGuide, mas com intenção comercial:
 * hero com CTA de triagem, schema Service e malha de links do contexto B2B.
 *
 * Regra de claims: nada de prazo fixo de garantia, número de clientes,
 * parcelamento ou emissão fiscal — apenas escopo técnico e critérios.
 */
import type { EnterpriseGuide } from "./enterpriseGuides";

export const EMPRESA_TI_CURITIBA: EnterpriseGuide = {
  slug: "empresa-de-ti-curitiba",
  path: "/empresa-de-ti-curitiba",
  kicker: "Curitiba e Região Metropolitana",
  title: "Empresa de TI em Curitiba para escritórios e comércios",
  metaTitle: "Empresa de TI em Curitiba: Suporte e Redes",
  metaDescription:
    "TI para escritórios e comércios em Curitiba: suporte por posto, redes, servidores, backup testado e manutenção preventiva. Descreva o cenário.",
  intro:
    "Atendimento de TI para empresas em Curitiba e Região Metropolitana: computadores, notebooks, rede cabeada e Wi-Fi, impressão em rede, servidores e storage, backup e organização de acessos. O foco é reduzir parada em posto crítico — não vender estrutura maior do que o escritório precisa.",
  triage: { source: "empresa_ti_curitiba", category: "pc", city: "Curitiba" },
  serviceSchema: {
    name: "Suporte e manutenção de TI para empresas",
    description:
      "Suporte técnico empresarial em Curitiba: postos de trabalho, rede, impressão, servidores, backup e manutenção preventiva.",
    areaServed: "Curitiba e Região Metropolitana",
  },
  sections: [
    {
      id: "escopo",
      title: "1. O que o atendimento empresarial cobre",
      paragraphs: [
        "O escopo é definido por posto e por infraestrutura. Postos de trabalho incluem desktop, notebook, sistema operacional, aplicativos de uso diário e periféricos. Infraestrutura inclui roteador, switch, cabeamento interno de rede, impressora em rede, storage e nobreak.",
        "Cada chamado entra com identificação do equipamento e do posto, o que evita retrabalho e mantém histórico útil para decidir entre manutenção e substituição.",
      ],
      bullets: [
        "Postos de trabalho: diagnóstico, formatação, upgrade de SSD e memória, troca de peças e configuração.",
        "Rede: segmentação, IP fixo para impressora e storage, correção de lentidão intermitente e Wi-Fi de visitantes.",
        "Servidores e storage: verificação de discos, volumes compartilhados e permissões de pasta.",
        "Backup: definição do que salvar, cópia local e externa, versionamento e teste de restauração.",
        "Preventiva: limpeza interna, verificação SMART dos discos e teste de autonomia do nobreak.",
      ],
    },
    {
      id: "como-funciona",
      title: "2. Como o chamado funciona na prática",
      paragraphs: [
        "O fluxo começa pela triagem: equipamento, sintoma, bairro e urgência. Com esse contexto sai uma estimativa de escopo e prazo antes de qualquer deslocamento, e o cliente aprova por escrito o que será executado.",
        "Depois da execução, a ordem de serviço registra o que foi feito, as peças envolvidas e as observações técnicas. O acompanhamento fica disponível pelo número do protocolo.",
      ],
      bullets: [
        "Triagem com sintoma, equipamento e localização — sem diagnóstico por adivinhação.",
        "Escopo e prazo estimados antes do deslocamento, com aprovação registrada.",
        "Ordem de serviço com protocolo e histórico consultável.",
        "Priorização declarada para postos críticos (financeiro, emissão, atendimento).",
      ],
    },
    {
      id: "quando-remoto",
      title: "3. Quando é remoto e quando é presencial",
      paragraphs: [
        "Sintoma de software — sistema lento após atualização, aplicativo que não abre, configuração de e-mail, permissão de pasta — costuma ser resolvido remotamente, sem deslocamento e sem espera.",
        "Sintoma físico — máquina que desliga sozinha, ruído em disco, rede caindo em horários específicos, impressora inacessível para vários postos — exige atendimento presencial, porque o teste depende do ambiente real.",
      ],
      bullets: [
        "Remoto: configuração, permissões, atualizações, limpeza lógica e orientação de uso.",
        "Presencial: hardware, cabeamento, energia, impressão em rede e falhas intermitentes de rede.",
        "Bancada: recuperação de dados e reparo que exige teste com peças de referência.",
      ],
    },
    {
      id: "contextos",
      title: "4. Contextos empresariais que podem precisar de suporte",
      paragraphs: [
        "Abaixo estão contextos operacionais — não especializações setoriais. O que muda entre eles é o impacto da parada e o tipo de equipamento envolvido, não uma competência exclusiva.",
      ],
      bullets: [
        "Escritórios que trabalham com arquivos sensíveis e prazos importantes: estações de trabalho, impressão e digitalização, organização de arquivos, backup, múltiplos monitores, conectividade e atendimento remoto para manter a continuidade em períodos críticos.",
        "Recepções e postos de atendimento ao público: computador da recepção, impressora em rede, Wi-Fi, arquivos, câmera e áudio, e acesso a sistemas de terceiros mantidos pelo fornecedor.",
        "Operações com períodos de fechamento: aumento temporário de uso, vários programas abertos, impressão em volume, armazenamento, backup reforçado, estações adicionais e acesso remoto planejado com antecedência.",
        "Profissionais que utilizam arquivos e programas exigentes: memória, armazenamento, múltiplos monitores, refrigeração adequada, rede estável e montagem de estação de trabalho dimensionada por requisito.",
        "Limite explícito: o suporte de informática não inclui manutenção de equipamentos médicos, laboratoriais ou outros dispositivos especializados.",
      ],
    },
    {
      id: "antes-do-suporte",
      title: "5. O que registrar antes de solicitar suporte",
      paragraphs: [
        "Informações objetivas sobre o equipamento, o erro e o impacto ajudam a direcionar a triagem. Senhas e códigos de autenticação não devem ser enviados por mensagem.",
      ],
      bullets: [
        "Equipamento afetado e usuário afetado.",
        "Horário aproximado do início do problema e mensagem de erro exibida.",
        "Programa envolvido e alteração recente (atualização, troca de peça, mudança de rede).",
        "Impacto na operação e quantidade de pessoas afetadas.",
        "Se é possível acesso remoto e se existe backup recente.",
        "Quem autoriza alterações na máquina e contato do fornecedor do sistema, quando aplicável.",
        "Não envie por mensagem: senha, código de autenticação, dados bancários, documento pessoal ou arquivo confidencial.",
      ],
    },
  ],
  checklist: [
    { label: "Inventário do parque", detail: "Máquinas identificadas, com responsável e histórico de intervenções." },
    { label: "Rede documentada", detail: "Postos críticos cabeados, IP fixo em impressora e storage, Wi-Fi de visitantes isolado." },
    { label: "Backup testado", detail: "Cópia local, cópia externa, versionamento e restauração de teste registrada." },
    { label: "Acessos nominais", detail: "Uma conta por pessoa e administrador separado para manutenção." },
    { label: "Energia protegida", detail: "Nobreak dimensionado e bateria testada nos postos críticos." },
    { label: "Calendário preventivo", detail: "Checagens mensais, trimestrais e semestrais com responsável definido." },
  ],
  limits: [
    "Suporte a sistemas de gestão de terceiros depende do fabricante do software.",
    "Recuperação de dados com falha física de disco exige avaliação em bancada antes de qualquer estimativa.",
    "Infraestrutura elétrica predial e obra civil seguem escopo separado do suporte de TI.",
    "Peças fornecidas pela empresa seguem a política de peças do cliente, com registro de estado na entrada.",
  ],
  faq: [
    {
      question: "Quais informações devo registrar antes de pedir suporte?",
      answer:
        "Equipamento e usuário afetados, horário de início, mensagem de erro, programa envolvido, alteração recente, impacto na operação, se há backup e quem autoriza alterações. Senhas e códigos de autenticação não devem ser enviados por mensagem.",
    },
    {
      question: "Vocês atendem escritórios de diferentes segmentos?",
      answer:
        "Sim. O atendimento é generalista em informática: estações de trabalho, rede, impressão, servidores e backup. Não trabalhamos como especialistas de um setor específico nem de um software setorial.",
    },
    {
      question: "Vocês prestam suporte a qualquer sistema empresarial?",
      answer:
        "Podemos verificar o computador, a conectividade e a configuração local, registrar o erro e auxiliar na comunicação com o fornecedor. A correção dentro do sistema, licenças e recuperação de conta pertencem a quem mantém o sistema.",
    },
    {
      question: "Vocês atendem empresas fora de Curitiba?",
      answer:
        "Sim, na Região Metropolitana — São José dos Pinhais, Pinhais, Colombo e cidades vizinhas. Chamados de software podem ser resolvidos remotamente em qualquer localidade.",
    },
    {
      question: "É preciso ter contrato para ser atendido?",
      answer:
        "Não. O atendimento pode ser por chamado avulso, com escopo e prazo aprovados por escrito antes da execução. Empresas com parque maior costumam preferir rotina preventiva agendada.",
    },
    {
      question: "Como funciona a prioridade em uma parada?",
      answer:
        "Os postos críticos são definidos junto com a empresa no inventário. Em uma parada, esses postos entram primeiro na fila de atendimento.",
    },
    {
      question: "Vocês cuidam do backup também?",
      answer:
        "Sim: definição do que precisa ser salvo, configuração de cópia local e externa, versionamento e rotina de teste de restauração — que é a parte mais frequentemente esquecida.",
    },
    {
      question: "Consigo acompanhar o andamento do chamado?",
      answer:
        "Sim. Cada atendimento gera uma ordem de serviço com protocolo, e o andamento pode ser consultado pela página de status.",
    },
  ],
  whatsappService: "suporte de TI para empresa em Curitiba",
};

export const SUPORTE_EMPRESARIAL: EnterpriseGuide = {
  slug: "suporte-tecnico-empresarial",
  path: "/servicos/suporte-tecnico-empresarial",
  kicker: "Serviço empresarial · presencial e remoto",
  title: "Suporte técnico empresarial",
  metaTitle: "Suporte Técnico Empresarial em Curitiba",
  metaDescription:
    "Suporte técnico empresarial presencial e remoto: chamados por posto, rede, impressão, servidores e preventiva. Escopo e prazo aprovados por escrito antes da execução.",
  intro:
    "Suporte técnico para empresas que precisam de resposta previsível: chamado por posto, escopo aprovado por escrito, ordem de serviço com protocolo e histórico consultável. Atendimento remoto para sintomas de software e presencial para hardware, rede e energia.",
  triage: { source: "suporte_tecnico_empresarial", category: "pc" },
  serviceSchema: {
    name: "Suporte técnico empresarial",
    description:
      "Atendimento técnico a empresas em modelo remoto e presencial, com escopo aprovado, ordem de serviço e histórico por equipamento.",
    areaServed: "Curitiba e Região Metropolitana",
  },
  sections: [
    {
      id: "modalidades",
      title: "1. Modalidades de atendimento",
      paragraphs: [
        "Três modalidades cobrem a maior parte da demanda empresarial, e a escolha depende do sintoma — não da preferência. Tentar resolver remotamente um problema físico apenas adia o diagnóstico.",
      ],
      bullets: [
        "Remoto: configuração, permissões, atualizações, e-mail, aplicativos e orientação de uso.",
        "Presencial: hardware, cabeamento, rede, impressão, energia e falhas intermitentes.",
        "Bancada: reparo que exige bancada, peças de referência e testes prolongados.",
      ],
    },
    {
      id: "sla",
      title: "2. Previsibilidade: escopo, prazo e registro",
      paragraphs: [
        "Antes da execução, o cliente recebe o escopo do que será feito e a estimativa de prazo. Nada é executado fora do que foi aprovado — se o diagnóstico revelar item adicional, ele volta para aprovação.",
        "Depois da execução, a ordem de serviço registra intervenções, peças e observações. Isso constrói o histórico por equipamento, que é o que permite decidir entre continuar mantendo ou substituir a máquina.",
      ],
      bullets: [
        "Escopo aprovado por escrito antes de qualquer intervenção.",
        "Item adicional descoberto no diagnóstico volta para aprovação, sem execução automática.",
        "Ordem de serviço com protocolo, peças e observações técnicas.",
        "Histórico por equipamento para decisão de manter ou substituir.",
      ],
    },
    {
      id: "preventiva",
      title: "3. Preventiva: reduzindo o volume de chamados",
      paragraphs: [
        "A maioria das paradas dá aviso antes: disco com setores realocados, cooler ruidoso, bateria de nobreak estufada, atualização pendente há meses, disco cheio. Um calendário preventivo transforma esses avisos em manutenção agendada em vez de urgência.",
      ],
      bullets: [
        "Mensal: atualizações, antivírus, espaço em disco e teste de restauração de backup.",
        "Trimestral: limpeza interna, verificação SMART dos discos e teste do nobreak.",
        "Semestral: revisão de inventário, permissões de pasta e licenças em uso.",
      ],
    },
    {
      id: "avulso-recorrente",
      title: "4. Atendimento avulso ou recorrente",
      paragraphs: [
        "Os dois modelos atendem bem cenários diferentes. Recorrente não é automaticamente melhor: depende do volume de equipamentos e da frequência real das demandas.",
        "O avulso é indicado para problema pontual, computador específico, instalação, ajuste, falha de rede, diagnóstico ou suporte remoto sem recorrência prevista. O escopo é definido por solicitação, a prioridade segue a agenda, o valor decorre do diagnóstico autorizado e peças ou serviços externos são tratados à parte — sem disponibilidade permanente.",
        "O recorrente faz sentido quando existem múltiplos computadores, demandas frequentes, necessidade de preventiva, usuários que pedem suporte periódico, rede compartilhada, backup que exige revisão e necessidade de histórico organizado. Esse modelo depende de um levantamento inicial: quantidade de equipamentos e usuários, frequência, modalidades, escopo, horários, prioridades e responsabilidades.",
      ],
      table: {
        head: ["Critério", "Avulso", "Recorrente"],
        rows: [
          ["Uso", "Demanda pontual", "Necessidades frequentes"],
          ["Escopo", "Definido por chamado", "Definido por acordo"],
          ["Histórico", "Por atendimento", "Acompanhamento organizado"],
          ["Preventiva", "Contratada separadamente", "Pode fazer parte do escopo"],
          ["Prioridade", "Conforme agenda", "Conforme regra acordada"],
          ["Valor", "Conforme serviço", "Conforme levantamento"],
        ],
      },
    },
    {
      id: "limites-terceiros",
      title: "5. O que depende de fornecedor, autorização ou especialização",
      paragraphs: [
        "Parte dos problemas relatados como \"de informática\" pertence a um sistema mantido por terceiros: software empresarial, sistema contábil, prontuário, sistema judicial, ERP, CRM, certificado digital, e-mail corporativo, domínio, provedor, operadora, fabricante ou o próprio administrador da empresa.",
        "Nesses casos o suporte atua na camada que é dele e encaminha o restante — o que evita tentativa e erro dentro de plataforma de terceiro.",
      ],
      bullets: [
        "O suporte pode: verificar o computador, validar conectividade, registrar o erro com evidência, auxiliar na comunicação com o fornecedor, executar procedimentos autorizados e configurar componentes compatíveis.",
        "O suporte não promete: corrigir código do sistema, liberar licença, redefinir credencial de terceiro, alterar política corporativa, garantir funcionamento de plataforma externa, substituir o suporte do fornecedor, burlar restrições ou assumir responsabilidade por indisponibilidade externa.",
      ],
    },
  ],
  checklist: [
    { label: "Postos críticos definidos", detail: "Quais máquinas param a operação se ficarem indisponíveis." },
    { label: "Canal de abertura único", detail: "Chamados entram por um canal só, com identificação do equipamento." },
    { label: "Escopo aprovado", detail: "Nada executado sem aprovação por escrito do escopo e do prazo." },
    { label: "Backup verificado", detail: "Restauração de teste registrada antes de qualquer intervenção maior." },
    { label: "Histórico por equipamento", detail: "Ordens de serviço acumuladas por máquina, com protocolo consultável." },
  ],
  limits: [
    "Suporte a software de terceiros fica limitado a instalação, configuração e intermediação com o fabricante.",
    "Intervenção em quadro elétrico e infraestrutura predial segue escopo separado.",
    "Recuperação de dados de disco com falha física exige avaliação em bancada.",
    "Atendimento remoto depende de conectividade mínima no posto e autorização de acesso.",
  ],
  faq: [
    {
      question: "Qual é a diferença entre atendimento avulso e recorrente?",
      answer:
        "O avulso resolve uma demanda pontual, com escopo definido por chamado e prioridade conforme agenda. O recorrente organiza demandas frequentes de vários equipamentos, com escopo, frequência e prioridades definidos em um levantamento inicial.",
    },
    {
      question: "Atendimento recorrente significa suporte ilimitado?",
      answer:
        "Não. O recorrente define escopo, modalidades, horários e prioridades acordados no levantamento — não é disponibilidade permanente nem volume ilimitado de chamados.",
    },
    {
      question: "Vocês corrigem problemas dentro de sistemas de terceiros?",
      answer:
        "Verificamos o computador, a conectividade e a configuração local, registramos o erro e auxiliamos no contato com o fornecedor. Correção de código, licença e recuperação de conta são responsabilidade de quem mantém o sistema.",
    },
    {
      question: "Qual a diferença entre suporte remoto e presencial?",
      answer:
        "Remoto resolve sintomas de software — configuração, permissões, atualizações e aplicativos. Presencial é necessário quando o sintoma é físico: hardware, cabeamento, rede, impressão em rede ou energia.",
    },
    {
      question: "Vocês executam algo sem aprovação?",
      answer:
        "Não. O escopo e o prazo são aprovados por escrito antes da execução, e qualquer item descoberto durante o diagnóstico volta para nova aprovação.",
    },
    {
      question: "Como acompanho o que foi feito em cada máquina?",
      answer:
        "Cada atendimento gera ordem de serviço com protocolo, peças envolvidas e observações técnicas. O histórico fica vinculado ao equipamento identificado no inventário.",
    },
    {
      question: "Dá para agendar manutenção preventiva?",
      answer:
        "Sim. O ciclo usual combina verificações mensais de software e backup com verificações trimestrais de hardware, energia e discos.",
    },
    {
      question: "Atendem fora do horário comercial?",
      answer:
        "Janelas fora do horário podem ser combinadas para intervenções que exigem parada, como troca de servidor, mudança de rede ou migração de dados.",
    },
  ],
  whatsappService: "suporte técnico empresarial",
};

export const SEGURANCA_DOS_DADOS: EnterpriseGuide = {
  slug: "seguranca-dos-dados",
  path: "/seguranca-dos-dados",
  kicker: "Backup, acessos e continuidade",
  title: "Segurança dos dados da sua empresa",
  metaTitle: "Segurança dos Dados na Empresa | Backup e LGPD",
  metaDescription:
    "Proteja os dados da empresa: backup 3-2-1 testado, contas nominais, duas etapas, resposta a ransomware e retenção conforme a LGPD.",
  intro:
    "Segurança de dados em empresa pequena não começa por ferramenta cara: começa por backup testado, contas nominais e um procedimento claro para o dia em que algo der errado. Esta página reúne o que é aplicável na prática, o que é responsabilidade da empresa e o que fazemos no atendimento técnico — inclusive como os dados tratados durante um chamado são protegidos.",
  triage: { source: "seguranca_dos_dados", category: "pc" },
  serviceSchema: {
    name: "Proteção de dados e backup empresarial",
    description:
      "Configuração de backup 3-2-1, teste de restauração, organização de acessos e resposta a incidentes de dados em pequenas empresas.",
    areaServed: "Curitiba e Região Metropolitana",
  },
  sections: [
    {
      id: "backup",
      title: "1. Backup: a base de tudo",
      paragraphs: [
        "Antes de qualquer camada de segurança, é preciso poder voltar. A referência é a regra 3-2-1: três cópias, em dois tipos de mídia, sendo uma fora do local. Sincronização em nuvem não é backup — ela replica a exclusão e a criptografia por ransomware.",
        "O ponto que mais falha é o teste. Backup que nunca foi restaurado é uma hipótese, não uma proteção. Uma restauração de teste mensal, com registro de quem testou, resolve.",
      ],
      bullets: [
        "Cópia local, cópia externa e versionamento ativo.",
        "Disco de backup não permanentemente conectado à máquina que ele protege.",
        "Restauração de teste mensal, registrada com data e responsável.",
        "Lista explícita do que precisa ser salvo: sistema de gestão, contratos, financeiro, projetos e e-mail.",
      ],
    },
    {
      id: "acessos",
      title: "2. Acessos: rastreabilidade antes de ferramenta",
      paragraphs: [
        "Conta compartilhada elimina a rastreabilidade e transforma cada desligamento em troca de senha em dezenas de sistemas. Contas nominais, permissão mínima por função e administrador separado resolvem a maior parte do risco interno.",
        "Autenticação em duas etapas em e-mail, nuvem e sistemas financeiros é a medida de maior efeito por esforço — a maioria dos incidentes começa por credencial vazada, não por invasão sofisticada.",
      ],
      bullets: [
        "Uma conta por pessoa, no computador e nos sistemas.",
        "Permissão mínima por função, revisada a cada semestre.",
        "Duas etapas em e-mail, nuvem e sistemas financeiros.",
        "Gerenciador de senhas no lugar de planilha, caderno ou post-it.",
        "Procedimento escrito de desligamento com revogação no mesmo dia.",
      ],
    },
    {
      id: "incidente",
      title: "3. Resposta a incidente: os primeiros minutos",
      paragraphs: [
        "Em suspeita de ransomware ou de arquivos alterados em massa, o que se faz nos primeiros minutos define quanto será possível recuperar. Reiniciar a máquina pode concluir a criptografia; tentar renomear arquivos pode inutilizar a cópia parcial.",
      ],
      bullets: [
        "Desconecte a máquina afetada da rede imediatamente (cabo e Wi-Fi).",
        "Não reinicie, não desligue no botão e não renomeie arquivos.",
        "Verifique se o backup externo está desconectado — para não ser alcançado.",
        "Registre horário, sintoma e o que estava sendo feito quando ocorreu.",
        "Acione diagnóstico técnico antes de tentar qualquer ferramenta de recuperação encontrada na internet.",
      ],
    },
    {
      id: "atendimento",
      title: "4. Como os seus dados são tratados no atendimento",
      paragraphs: [
        "Durante um chamado, o técnico pode ter acesso a arquivos da empresa. O tratamento segue a política de privacidade do site e a LGPD: dado coletado apenas para executar o serviço, retenção limitada e exclusão mediante solicitação.",
        "Anexos enviados na triagem (fotos e vídeos do equipamento) têm retenção reduzida, e a empresa pode solicitar a exclusão a qualquer momento pela página de exclusão de dados.",
      ],
      bullets: [
        "Acesso a arquivos limitado ao necessário para executar o escopo aprovado.",
        "Anexos de triagem com retenção reduzida e exclusão sob solicitação.",
        "Ordens de serviço mantidas pelo prazo legal de guarda fiscal e de garantia.",
        "Solicitação de exclusão registrada e respondida pelos canais informados na política.",
      ],
    },
    {
      id: "terceiros",
      title: "5. Sistemas, credenciais e acessos de terceiros",
      paragraphs: [
        "O acesso ao computador não garante acesso ou correção de sistemas mantidos por terceiros. Senhas, códigos de autenticação e credenciais bancárias não devem ser enviados por mensagem. Quando o problema pertence ao sistema externo, pode ser necessário acionar o fornecedor responsável.",
        "Deixar essa divisão clara antes do atendimento reduz o tempo perdido e evita alteração indevida em plataforma que não é administrada por nós.",
      ],
      bullets: [
        "Responsabilidade do cliente: possuir licença legítima, indicar quem autoriza alterações, manter acesso ao e-mail de recuperação, preservar códigos de autenticação, conhecer o fornecedor, manter contratos e cadastros, informar restrições internas, manter backup e não compartilhar senha desnecessariamente.",
        "Responsabilidade do técnico: solicitar apenas o acesso necessário, explicar o procedimento, evitar armazenar credenciais, encerrar sessões, não alterar configuração além do autorizado, registrar limitações encontradas, orientar o contato com o fornecedor quando for o caso e não burlar proteção.",
        "Responsabilidade do fornecedor do sistema: licença, disponibilidade, servidor, correção de erro interno, atualização, recuperação de conta, suporte ao próprio sistema, regras de autenticação, integrações e documentação.",
      ],
    },
  ],
  checklist: [
    { label: "Backup 3-2-1", detail: "Cópia local, cópia externa e versionamento configurados." },
    { label: "Restauração testada", detail: "Teste mensal com registro de data e responsável." },
    { label: "Contas nominais", detail: "Uma conta por pessoa, administrador separado, permissão mínima." },
    { label: "Duas etapas ativa", detail: "E-mail, nuvem e sistemas financeiros com verificação em duas etapas." },
    { label: "Plano de incidente", detail: "Procedimento impresso do que fazer nos primeiros minutos." },
    { label: "Desligamento formal", detail: "Revogação de acessos no mesmo dia e transferência de arquivos." },
  ],
  limits: [
    "Nenhuma configuração elimina risco: o objetivo é reduzir probabilidade e tempo de recuperação.",
    "Recuperação de dados após falha física ou criptografia depende de avaliação em bancada, sem garantia prévia de resultado.",
    "Conformidade documental com a LGPD (registro de tratamento, contratos e encarregado) é responsabilidade da empresa; o suporte técnico atua na camada de configuração.",
    "Auditoria de segurança formal e teste de intrusão não fazem parte do escopo de suporte técnico.",
  ],
  faq: [
    {
      question: "O técnico precisa conhecer minha senha?",
      answer:
        "Apenas o acesso estritamente necessário para executar o escopo aprovado, de preferência com a pessoa responsável presente ou por sessão remota acompanhada. Senhas, códigos de autenticação e credenciais bancárias não devem ser enviados por mensagem.",
    },
    {
      question: "Quem deve resolver problemas em sistemas de terceiros?",
      answer:
        "O fornecedor que mantém o sistema. O suporte técnico verifica o computador e a conectividade, registra o erro e auxilia na comunicação — o acesso ao computador não garante acesso ou correção de plataforma externa.",
    },
    {
      question: "Nuvem sincronizada já protege meus dados?",
      answer:
        "Não. Sincronização replica exclusões e criptografia por ransomware. É preciso uma cópia adicional com versionamento e, de preferência, uma cópia que não fique permanentemente conectada.",
    },
    {
      question: "Com que frequência o backup deve ser testado?",
      answer:
        "No mínimo uma restauração de teste por mês, escolhendo um arquivo aleatório e confirmando que ele abre íntegro, com registro de data e responsável.",
    },
    {
      question: "O que fazer no primeiro sinal de ransomware?",
      answer:
        "Desconecte a máquina da rede, não reinicie e não renomeie arquivos. Confirme que o backup externo está desconectado e acione diagnóstico técnico antes de tentar qualquer ferramenta de recuperação.",
    },
    {
      question: "Quem tem acesso aos meus arquivos durante um atendimento?",
      answer:
        "O acesso fica limitado ao necessário para executar o escopo aprovado, e o tratamento segue a política de privacidade do site e a LGPD.",
    },
    {
      question: "Posso pedir a exclusão dos meus dados?",
      answer:
        "Sim. A solicitação pode ser feita pela página de exclusão de dados, com escopo definido (todos os dados, apenas anexos ou apenas avaliação), respeitados os prazos legais de guarda.",
    },
  ],
  whatsappService: "proteção de dados e backup empresarial",
};

export const MANUTENCAO_PREVENTIVA_EMPRESAS: EnterpriseGuide = {
  slug: "manutencao-preventiva-empresas",
  path: "/servicos/manutencao-preventiva-empresas",
  kicker: "Serviço empresarial · rotina agendada",
  title: "Manutenção preventiva para empresas",
  metaTitle: "Manutenção Preventiva para Empresas | Rotina Agendada",
  metaDescription:
    "Manutenção preventiva para empresas: calendário mensal, trimestral e semestral, verificação de discos, energia e backup. Escopo aprovado antes da execução.",
  intro:
    "Manutenção preventiva é rotina agendada, não urgência. O objetivo é transformar aviso em manutenção planejada: disco com setores realocados, cooler ruidoso, bateria de nobreak no fim da vida, disco cheio e atualização pendente aparecem antes da parada — desde que alguém verifique.",
  triage: { source: "manutencao_preventiva_empresas", category: "pc" },
  serviceSchema: {
    name: "Manutenção preventiva de TI para empresas",
    description:
      "Rotina agendada de verificação de postos de trabalho, discos, energia, rede e backup em empresas, com registro por equipamento.",
    areaServed: "Curitiba e Região Metropolitana",
  },
  sections: [
    {
      id: "escopo-preventiva",
      title: "1. O que a preventiva verifica",
      paragraphs: [
        "A preventiva cobre o que costuma falhar por desgaste ou acúmulo: armazenamento, refrigeração, energia, atualização e espaço em disco. Não é limpeza estética — é verificação com registro do que foi medido em cada posto.",
      ],
      bullets: [
        "Armazenamento: verificação SMART, espaço livre e integridade dos volumes compartilhados.",
        "Refrigeração: limpeza interna, coolers, pasta térmica quando aplicável e temperatura em carga.",
        "Energia: teste de autonomia do nobreak, estado da bateria e proteção dos postos críticos.",
        "Software: atualizações pendentes, antivírus ativo e inicialização do sistema.",
        "Backup: confirmação da rotina e restauração de teste registrada.",
      ],
    },
    {
      id: "calendario",
      title: "2. Calendário: mensal, trimestral e semestral",
      paragraphs: [
        "A frequência muda conforme o item. Software e backup pedem verificação mensal; hardware e energia, trimestral; inventário e permissões, semestral. Concentrar tudo em uma visita anual não previne nada.",
      ],
      table: {
        head: ["Frequência", "Verificação", "Registro"],
        rows: [
          ["Mensal", "Atualizações, antivírus, espaço em disco e teste de restauração", "Data e responsável"],
          ["Trimestral", "Limpeza interna, SMART dos discos e teste do nobreak", "Estado por equipamento"],
          ["Semestral", "Inventário, permissões de pasta e licenças em uso", "Divergências apontadas"],
        ],
      },
    },
    {
      id: "avulso-recorrente-preventiva",
      title: "3. Preventiva avulsa ou rotina recorrente",
      paragraphs: [
        "A preventiva avulsa faz sentido para um parque pequeno ou para uma primeira fotografia do estado dos equipamentos. A rotina recorrente faz sentido quando existem vários postos, uso intenso e histórico que precisa ser comparado ao longo do tempo.",
        "Nenhum dos dois modelos elimina a possibilidade de falha: a preventiva reduz probabilidade e antecipa a decisão entre manter e substituir.",
      ],
      table: {
        head: ["Critério", "Avulsa", "Recorrente"],
        rows: [
          ["Uso", "Fotografia pontual do parque", "Acompanhamento contínuo"],
          ["Escopo", "Definido na solicitação", "Definido no levantamento"],
          ["Histórico", "Por visita", "Comparável entre ciclos"],
          ["Prioridade", "Conforme agenda", "Conforme regra acordada"],
          ["Valor", "Conforme serviço", "Conforme levantamento"],
        ],
      },
    },
    {
      id: "antes-da-visita",
      title: "4. O que registrar antes da visita preventiva",
      paragraphs: [
        "A visita rende mais quando a empresa chega com a lista dos equipamentos e o horário em que cada posto pode parar. Senhas e códigos de autenticação não devem ser enviados por mensagem.",
      ],
      bullets: [
        "Lista de equipamentos e responsável por cada posto.",
        "Postos críticos que não podem parar em horário comercial.",
        "Janela possível para intervenção que exige desligamento.",
        "Sintomas já percebidos: lentidão, ruído, desligamento, queda de rede.",
        "Quem autoriza alterações e substituição de peça.",
      ],
    },
    {
      id: "limites-preventiva",
      title: "5. O que a preventiva não substitui",
      paragraphs: [
        "Preventiva não é garantia de que nada vai falhar, e não cobre camadas que pertencem a terceiros ou à infraestrutura predial.",
      ],
      bullets: [
        "Não substitui backup: a cópia continua sendo a única proteção contra perda de dados.",
        "Não corrige erro interno de sistema de gestão mantido por terceiro.",
        "Não abrange quadro elétrico, aterramento predial e obra civil.",
        "Não garante prazo de vida de peça — indica desgaste observado no momento da verificação.",
      ],
    },
  ],
  checklist: [
    { label: "Inventário atualizado", detail: "Equipamentos identificados, com responsável e histórico por máquina." },
    { label: "Janela de parada definida", detail: "Horário acordado para intervenções que exigem desligamento." },
    { label: "Backup verificado antes", detail: "Restauração de teste registrada antes de qualquer intervenção." },
    { label: "Postos críticos marcados", detail: "Máquinas que param a operação recebem prioridade na rotina." },
    { label: "Registro por ciclo", detail: "Cada verificação gera registro comparável ao ciclo anterior." },
  ],
  limits: [
    "Preventiva reduz probabilidade de falha; não elimina risco nem garante durabilidade de componente.",
    "Substituição de peça identificada no ciclo depende de aprovação de escopo e valor antes da execução.",
    "Sistemas de gestão de terceiros seguem o suporte do próprio fornecedor.",
    "Infraestrutura elétrica predial e cabeamento estrutural em obra seguem escopo separado.",
  ],
  faq: [
    {
      question: "Com que frequência a preventiva deve ser feita?",
      answer:
        "O ciclo usual combina verificação mensal de software e backup, trimestral de hardware, discos e energia, e semestral de inventário, permissões e licenças.",
    },
    {
      question: "A preventiva precisa parar a operação?",
      answer:
        "Verificações de software e backup podem ser feitas com a máquina em uso. Limpeza interna e teste de nobreak exigem desligamento, e por isso a janela é combinada antes.",
    },
    {
      question: "Preventiva substitui o backup?",
      answer:
        "Não. A preventiva confirma que a rotina de backup existe e que a restauração funciona, mas a cópia continua sendo a única proteção real contra perda de dados.",
    },
    {
      question: "Preciso de contrato para fazer preventiva?",
      answer:
        "Não. A preventiva pode ser avulsa, com escopo definido na solicitação. A rotina recorrente é indicada quando existem vários postos e histórico que precisa ser comparado entre ciclos.",
    },
    {
      question: "Vocês trocam peças durante a preventiva?",
      answer:
        "Somente com aprovação. Se a verificação apontar disco com falha iminente ou bateria de nobreak no fim da vida, o item volta para aprovação de escopo e valor antes de qualquer troca.",
    },
    {
      question: "Como sei o que foi verificado em cada máquina?",
      answer:
        "Cada ciclo gera registro por equipamento, com o que foi medido e as divergências encontradas — é isso que permite comparar o estado atual com o ciclo anterior.",
    },
    {
      question: "A preventiva cobre impressora e rede?",
      answer:
        "Sim, na camada de configuração e conectividade: impressora em rede, IP fixo, estado dos cabos nos postos e verificação do roteador ou switch existente.",
    },
    {
      question: "Empresas fora de Curitiba podem contratar?",
      answer:
        "Sim, na Região Metropolitana — São José dos Pinhais, Pinhais, Colombo e cidades vizinhas. Verificações de software e backup podem ser feitas remotamente.",
    },
  ],
  whatsappService: "manutenção preventiva para empresa",
};

export const BACKUP_PARA_EMPRESAS: EnterpriseGuide = {
  slug: "backup-para-empresas",
  path: "/servicos/backup-para-empresas",
  kicker: "Serviço empresarial · cópia e restauração",
  title: "Backup para empresas",
  metaTitle: "Backup para Empresas | Cópia Local, Externa e Teste",
  metaDescription:
    "Backup para empresas: definição do que salvar, cópia local e externa, versionamento e teste de restauração registrado. Escopo aprovado antes da execução.",
  intro:
    "Backup empresarial só existe quando a restauração já foi testada. Esta página descreve como o serviço é executado: o que entra na cópia, onde ela fica, com que frequência roda, quem confirma que o arquivo volta íntegro e o que continua sendo responsabilidade da empresa.",
  triage: { source: "backup_para_empresas", category: "pc" },
  serviceSchema: {
    name: "Backup e restauração para empresas",
    description:
      "Configuração de backup local e externo com versionamento, rotina de verificação e teste de restauração registrado para empresas.",
    areaServed: "Curitiba e Região Metropolitana",
  },
  sections: [
    {
      id: "o-que-salvar",
      title: "1. Definir o que precisa ser salvo",
      paragraphs: [
        "A primeira etapa não é técnica: é decidir o que a empresa não pode perder. Salvar tudo indistintamente encarece a cópia e alonga a restauração; salvar só a pasta \"Documentos\" costuma deixar de fora a base do sistema de gestão e os e-mails.",
      ],
      bullets: [
        "Base de dados do sistema de gestão e o caminho onde ela realmente fica.",
        "Contratos, financeiro, projetos em andamento e arquivos de clientes.",
        "E-mail corporativo e anexos, quando armazenados localmente.",
        "Configurações e licenças necessárias para remontar o posto.",
        "O que fica de fora, declarado por escrito, para não gerar expectativa falsa.",
      ],
    },
    {
      id: "estrutura-copia",
      title: "2. Estrutura da cópia: local, externa e versionamento",
      paragraphs: [
        "A referência é a regra 3-2-1: três cópias, em dois tipos de mídia, sendo uma fora do local. Sincronização em nuvem, sozinha, não é backup — ela replica exclusão e criptografia por ransomware para todas as máquinas conectadas.",
        "O disco que guarda a cópia não deve ficar permanentemente conectado à máquina que ele protege, justamente para não ser alcançado por um incidente na origem.",
      ],
      bullets: [
        "Cópia local para restauração rápida do dia a dia.",
        "Cópia externa para o cenário em que o local é comprometido.",
        "Versionamento ativo, para voltar a um estado anterior à corrupção.",
        "Mídia de cópia desconectada quando a rotina não está em execução.",
      ],
    },
    {
      id: "teste-restauracao",
      title: "3. Teste de restauração: a parte que costuma faltar",
      paragraphs: [
        "Backup que nunca foi restaurado é hipótese, não proteção. O teste consiste em escolher um arquivo aleatório do conjunto, restaurar e confirmar que ele abre íntegro — com registro de data e responsável.",
        "O teste também mede o tempo de restauração, que é o número que realmente importa em uma parada: não adianta ter a cópia se voltar leva dias.",
      ],
      bullets: [
        "Restauração de teste mensal, com arquivo escolhido ao acaso.",
        "Registro de data, responsável e resultado.",
        "Medição do tempo de restauração de um posto completo.",
        "Revisão da rotina quando o conjunto de arquivos muda.",
      ],
    },
    {
      id: "avulso-recorrente-backup",
      title: "4. Implantação avulsa ou acompanhamento recorrente",
      paragraphs: [
        "A implantação avulsa configura a estrutura e entrega a rotina funcionando. O acompanhamento recorrente verifica periodicamente se ela continuou rodando — que é onde a maioria das rotinas silenciosamente para.",
      ],
      table: {
        head: ["Critério", "Implantação avulsa", "Acompanhamento recorrente"],
        rows: [
          ["Uso", "Estrutura configurada uma vez", "Verificação periódica da rotina"],
          ["Teste de restauração", "Um teste na entrega", "Teste registrado por ciclo"],
          ["Alteração de escopo", "Nova solicitação", "Revisada no ciclo"],
          ["Histórico", "Documento de entrega", "Registro comparável entre ciclos"],
          ["Valor", "Conforme serviço", "Conforme levantamento"],
        ],
      },
    },
    {
      id: "limites-backup",
      title: "5. Responsabilidades e limites",
      paragraphs: [
        "Parte da estrutura depende de terceiros: provedor de nuvem, fornecedor do sistema de gestão e a própria disponibilidade de internet da empresa. Deixar essa divisão clara evita expectativa equivocada no dia do incidente.",
      ],
      bullets: [
        "Responsabilidade da empresa: manter licença legítima, indicar quem autoriza alterações, preservar acesso ao e-mail de recuperação e informar mudanças no conjunto de arquivos.",
        "Responsabilidade do suporte: configurar a rotina, documentar o escopo salvo, registrar os testes e avisar quando a verificação apontar falha.",
        "Responsabilidade do fornecedor: disponibilidade da plataforma de nuvem, retenção contratada e recuperação de conta.",
        "Recuperação de dados de disco já danificado não é backup — exige avaliação em bancada, sem garantia prévia de resultado.",
      ],
    },
  ],
  checklist: [
    { label: "Escopo do que é salvo", detail: "Lista explícita dos conjuntos incluídos e dos que ficam de fora." },
    { label: "Cópia local e externa", detail: "Duas mídias, sendo uma fora do local de operação." },
    { label: "Versionamento ativo", detail: "Possibilidade de voltar a um estado anterior à corrupção." },
    { label: "Mídia desconectada", detail: "Disco de cópia não permanentemente ligado à máquina protegida." },
    { label: "Teste registrado", detail: "Restauração mensal com data, responsável e resultado." },
    { label: "Tempo de retorno medido", detail: "Quanto tempo leva para restaurar um posto completo." },
  ],
  limits: [
    "Backup não recupera dado que nunca entrou no escopo salvo — o conjunto precisa ser declarado por escrito.",
    "Sincronização em nuvem sem versionamento não substitui cópia com retenção.",
    "Retenção e disponibilidade de plataforma em nuvem seguem o contrato do provedor.",
    "Recuperação de disco com falha física exige avaliação em bancada, sem garantia prévia de resultado.",
  ],
  faq: [
    {
      question: "Nuvem sincronizada já é backup?",
      answer:
        "Não. A sincronização replica exclusões e criptografia por ransomware. É preciso uma cópia adicional com versionamento e, de preferência, uma mídia que não fique permanentemente conectada.",
    },
    {
      question: "Com que frequência o backup deve ser testado?",
      answer:
        "No mínimo uma restauração de teste por mês: escolher um arquivo aleatório, restaurar e confirmar que ele abre íntegro, com registro de data e responsável.",
    },
    {
      question: "O que deve entrar na cópia?",
      answer:
        "Base do sistema de gestão, contratos, financeiro, projetos em andamento, arquivos de clientes, e-mail armazenado localmente e as configurações necessárias para remontar o posto. O que fica de fora é declarado por escrito.",
    },
    {
      question: "Quanto tempo leva para restaurar tudo?",
      answer:
        "Depende do volume e da mídia. Por isso o tempo de restauração de um posto completo é medido durante o teste — é esse número que importa em uma parada real.",
    },
    {
      question: "Vocês assumem a responsabilidade pelos dados?",
      answer:
        "O suporte configura a rotina, documenta o escopo salvo e registra os testes. A guarda dos dados, a licença dos sistemas e a decisão do que precisa ser salvo permanecem com a empresa.",
    },
    {
      question: "E se o disco já falhou antes de existir backup?",
      answer:
        "Isso não é backup, é recuperação de dados: exige avaliação em bancada, e não é possível prometer resultado antes dessa avaliação.",
    },
    {
      question: "Backup protege contra ransomware?",
      answer:
        "Uma cópia com versionamento e mídia desconectada aumenta muito a chance de voltar sem pagar resgate. Cópia permanentemente conectada e sincronizada tende a ser alcançada junto com a origem.",
    },
    {
      question: "Dá para configurar remotamente?",
      answer:
        "Boa parte da configuração e da verificação da rotina pode ser feita remotamente. A instalação de mídia local e a organização física da cópia externa exigem atendimento presencial.",
    },
  ],
  whatsappService: "backup para empresa",
};

export const REDES_E_WIFI_EMPRESAS: EnterpriseGuide = {
  slug: "redes-e-wifi",
  path: "/servicos/redes-e-wifi",
  kicker: "Serviço empresarial · rede cabeada e Wi-Fi",
  title: "Redes e Wi-Fi para empresas",
  metaTitle: "Redes e Wi-Fi para Empresas | Cabeada, Wi-Fi e Impressão",
  metaDescription:
    "Redes e Wi-Fi para empresas: cabeamento dos postos críticos, cobertura Wi-Fi, IP fixo para impressora e storage e correção de lentidão intermitente.",
  intro:
    "Rede empresarial que cai em horários específicos, impressora que some para alguns postos e Wi-Fi que enfraquece em partes do escritório raramente são o mesmo problema. Esta página descreve como o diagnóstico é feito, o que é resolvido na configuração e o que depende de operadora ou de infraestrutura predial.",
  triage: { source: "redes_e_wifi_empresas", category: "rede" },
  serviceSchema: {
    name: "Redes e Wi-Fi para empresas",
    description:
      "Diagnóstico e configuração de rede cabeada e Wi-Fi em empresas: segmentação, IP fixo, impressão em rede e correção de instabilidade.",
    areaServed: "Curitiba e Região Metropolitana",
  },
  sections: [
    {
      id: "sintomas-rede",
      title: "1. Sintomas que apontam para camadas diferentes",
      paragraphs: [
        "O primeiro passo é separar o que parece um único problema. Lentidão em todos os postos ao mesmo tempo aponta para link ou roteador; lentidão em um posto só aponta para cabo, placa ou configuração local; queda em horário fixo costuma ter causa ambiental ou de saturação.",
      ],
      bullets: [
        "Todos os postos lentos ao mesmo tempo: link, roteador ou saturação de banda.",
        "Um posto só afetado: cabo, porta do switch, placa de rede ou configuração local.",
        "Wi-Fi fraco em parte do escritório: posicionamento, canal, interferência ou cobertura insuficiente.",
        "Impressora inacessível para alguns postos: endereço variável, faixa de rede ou driver.",
        "Queda em horário específico: saturação, equipamento aquecendo ou interferência recorrente.",
      ],
    },
    {
      id: "diagnostico-rede",
      title: "2. Como o diagnóstico presencial é feito",
      paragraphs: [
        "Rede se diagnostica no ambiente real. Teste feito de fora não reproduz interferência, cabo mal crimpado, porta defeituosa nem o comportamento no horário de pico da empresa.",
      ],
      bullets: [
        "Medição no posto afetado e comparação com um posto de referência.",
        "Verificação de cabos, portas do switch e estado dos conectores.",
        "Leitura de cobertura e interferência Wi-Fi nas áreas críticas.",
        "Checagem de endereçamento, DHCP e conflitos de IP.",
        "Registro do comportamento no horário em que a falha ocorre.",
      ],
    },
    {
      id: "estrutura-rede",
      title: "3. Estrutura recomendada para escritórios",
      paragraphs: [
        "A estrutura não precisa ser grande — precisa ser previsível. Postos críticos cabeados, endereços fixos para o que outros dispositivos precisam encontrar e Wi-Fi de visitantes isolado resolvem a maior parte das reclamações recorrentes.",
      ],
      bullets: [
        "Postos críticos cabeados: financeiro, emissão e atendimento.",
        "IP fixo para impressora, storage e equipamentos compartilhados.",
        "Wi-Fi de visitantes separado da rede interna.",
        "Switch dimensionado e organizado, com identificação das portas.",
        "Roteador e equipamentos de rede protegidos por nobreak.",
      ],
    },
    {
      id: "avulso-recorrente-rede",
      title: "4. Chamado pontual ou acompanhamento da rede",
      paragraphs: [
        "Um chamado pontual resolve o sintoma que motivou a ligação. O acompanhamento faz sentido quando a rede tem histórico de instabilidade e a empresa precisa comparar o comportamento antes e depois de cada ajuste.",
      ],
      table: {
        head: ["Critério", "Chamado pontual", "Acompanhamento"],
        rows: [
          ["Uso", "Sintoma específico", "Instabilidade recorrente"],
          ["Escopo", "Definido no chamado", "Definido no levantamento"],
          ["Documentação", "Registro do atendimento", "Mapa da rede mantido"],
          ["Prioridade", "Conforme agenda", "Conforme regra acordada"],
          ["Valor", "Conforme serviço", "Conforme levantamento"],
        ],
      },
    },
    {
      id: "limites-rede",
      title: "5. O que depende de operadora ou de obra",
      paragraphs: [
        "Parte do que é relatado como problema de rede pertence ao link contratado ou à infraestrutura do prédio. O suporte atua na camada interna e registra a evidência necessária para acionar quem é responsável pelo restante.",
      ],
      bullets: [
        "Operadora: velocidade contratada, instabilidade do link, equipamento do provedor e endereço público.",
        "Infraestrutura predial: passagem de novo cabeamento, tubulação, forro e obra civil.",
        "Sistemas de terceiros: acesso remoto e plataformas mantidas pelo próprio fornecedor.",
        "O suporte pode registrar evidência técnica para o chamado junto à operadora, mas não responde pela disponibilidade externa.",
      ],
    },
  ],
  checklist: [
    { label: "Postos críticos cabeados", detail: "Máquinas que não podem oscilar ficam fora do Wi-Fi." },
    { label: "Endereços fixos definidos", detail: "Impressora, storage e compartilhados sempre no mesmo endereço." },
    { label: "Wi-Fi de visitantes isolado", detail: "Rede de visitantes separada da rede interna da empresa." },
    { label: "Switch identificado", detail: "Portas etiquetadas e cabos organizados para diagnóstico rápido." },
    { label: "Rede protegida por nobreak", detail: "Roteador e switch alimentados junto com os postos críticos." },
    { label: "Comportamento registrado", detail: "Horário e sintoma anotados para comparar antes e depois." },
  ],
  limits: [
    "Instabilidade do link contratado e equipamento do provedor pertencem à operadora.",
    "Passagem de novo cabeamento estrutural e obra civil seguem escopo separado.",
    "Cobertura Wi-Fi depende do ambiente físico: parede, metal e interferência limitam qualquer equipamento.",
    "Plataformas e acessos remotos mantidos por terceiros seguem o suporte do próprio fornecedor.",
  ],
  faq: [
    {
      question: "A rede cai em horários específicos. O que costuma causar isso?",
      answer:
        "Saturação de banda no horário de pico, equipamento aquecendo ou interferência recorrente. O diagnóstico precisa registrar o comportamento no horário em que a falha ocorre — por isso é presencial.",
    },
    {
      question: "Trocar o roteador resolve o Wi-Fi fraco?",
      answer:
        "Nem sempre. Cobertura depende do ambiente físico e do posicionamento. Antes de indicar troca, medimos cobertura e interferência nas áreas críticas para saber se o problema é o equipamento ou a distribuição.",
    },
    {
      question: "Por que a impressora some para alguns computadores?",
      answer:
        "Normalmente porque o endereço dela muda. Definir IP fixo para impressora e storage elimina a maior parte desse tipo de reclamação.",
    },
    {
      question: "Vale a pena cabear se o Wi-Fi funciona?",
      answer:
        "Para postos críticos, sim: financeiro, emissão e atendimento não deveriam depender de um meio compartilhado e sujeito a interferência.",
    },
    {
      question: "Vocês resolvem problema de internet da operadora?",
      answer:
        "Não. Podemos registrar a evidência técnica que sustenta o chamado junto à operadora, mas velocidade contratada, instabilidade do link e equipamento do provedor são responsabilidade dela.",
    },
    {
      question: "Precisa parar a operação para ajustar a rede?",
      answer:
        "Ajustes de configuração costumam ser feitos com a operação em andamento. Reorganização de switch, troca de cabeamento e mudança de faixa de endereços exigem janela combinada.",
    },
    {
      question: "Dá para separar a rede de visitantes?",
      answer:
        "Sim, desde que o equipamento existente permita. A rede de visitantes fica isolada da rede interna, sem acesso a arquivos compartilhados e impressoras da empresa.",
    },
    {
      question: "O atendimento é presencial ou remoto?",
      answer:
        "Configuração e endereçamento podem ser ajustados remotamente. Cabos, portas de switch, cobertura Wi-Fi e falhas intermitentes exigem atendimento presencial no ambiente real.",
    },
  ],
  whatsappService: "rede e Wi-Fi para empresa",
};

export const ENTERPRISE_LANDINGS: EnterpriseGuide[] = [
  EMPRESA_TI_CURITIBA,
  SUPORTE_EMPRESARIAL,
  SEGURANCA_DOS_DADOS,
  MANUTENCAO_PREVENTIVA_EMPRESAS,
  BACKUP_PARA_EMPRESAS,
  REDES_E_WIFI_EMPRESAS,
];

