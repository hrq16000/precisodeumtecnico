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
  metaTitle: "Empresa de TI em Curitiba | Suporte, Redes e Backup",
  metaDescription:
    "Empresa de TI em Curitiba para escritórios e comércios: suporte por posto, redes, servidores, backup testado e manutenção preventiva. Descreva o cenário e receba a avaliação.",
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
  ],
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
  metaTitle: "Suporte Técnico Empresarial | Presencial e Remoto",
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
  ],
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
  metaTitle: "Segurança dos Dados na Empresa | Backup, Acessos e LGPD",
  metaDescription:
    "Como proteger os dados da empresa: backup 3-2-1 testado, contas nominais, duas etapas, resposta a ransomware e retenção conforme a LGPD. Checklist e limites operacionais.",
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
  ],
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

export const ENTERPRISE_LANDINGS: EnterpriseGuide[] = [
  EMPRESA_TI_CURITIBA,
  SUPORTE_EMPRESARIAL,
  SEGURANCA_DOS_DADOS,
];
