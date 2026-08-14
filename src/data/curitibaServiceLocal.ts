/**
 * Conteúdo LOCAL (Curitiba) das rotas /servicos/:servico/curitiba.
 *
 * Princípio anti-canibalização: a página global (/servicos/:slug) é a
 * autoridade sobre o SERVIÇO (sintomas, causas, diagnóstico, processo
 * técnico). Esta camada responde a outra intenção: "quero CONTRATAR este
 * serviço em Curitiba" — cobertura, modalidades, logística, empresas,
 * como solicitar e regra comercial. Nada aqui repete a explicação técnica.
 *
 * Somente serviços CORE de informática entram no lote.
 */
import { PRICING } from "./pricingPolicy";

export interface CuritibaModality {
  name: string;
  description: string;
}

export interface CuritibaServiceLocal {
  /** Slug do serviço global em src/data/services.ts (fonte da autoridade técnica). */
  slug: string;
  /** Rótulo local usado em H1/título — orientado a contratação. */
  localTitle: string;
  metaTitle: string;
  metaDescription: string;
  /** 2–3 parágrafos sobre cobertura real e operação em Curitiba. */
  coverage: string[];
  modalities: CuritibaModality[];
  residential: string;
  business: string;
  /** Como solicitar especificamente em Curitiba. */
  howToRequest: string[];
  /** Observação de logística/prazo específica do serviço na região. */
  logistics: string;
  faqs: { question: string; answer: string }[];
}

/** Zonas de Curitiba usadas como referência operacional (sem link farm). */
export const CURITIBA_ZONES: { zone: string; areas: string }[] = [
  { zone: "Centro e região central", areas: "Centro, Centro Cívico, São Francisco, Rebouças, Alto da XV" },
  { zone: "Sul", areas: "Portão, Água Verde, Novo Mundo, Pinheirinho, Capão Raso" },
  { zone: "Norte", areas: "Bairro Alto, Boa Vista, Santa Cândida, Abranches, Cachoeira" },
  { zone: "Leste", areas: "Cajuru, Jardim das Américas, Cristo Rei, Uberaba, Boqueirão" },
  { zone: "Oeste e noroeste", areas: "Santa Felicidade, Campo Comprido, Mossunguê, Cidade Industrial (CIC)" },
  { zone: "Corporativo", areas: "Batel, Bigorrilho, Champagnat, Ecoville, Barigui" },
];

const REQUEST_STEPS_BASE = [
  "Abra a triagem online desta página e descreva o equipamento e o problema — fotos e vídeos são obrigatórios para iniciar o atendimento.",
  "Informe bairro e região de Curitiba para definirmos a modalidade (endereço, coleta ou bancada) e a janela de atendimento.",
  "Receba as condições comerciais aplicáveis ao seu caso e aprove antes de qualquer deslocamento ou execução.",
  "Acompanhe o andamento pelo protocolo emitido ao final da triagem.",
];

export const CURITIBA_SERVICE_LOCAL: Record<string, CuritibaServiceLocal> = {
  notebooks: {
    slug: "notebooks",
    localTitle: "Manutenção de notebook em Curitiba",
    metaTitle: "Manutenção de Notebook em Curitiba — Coleta e Bancada",
    metaDescription:
      "Contrate manutenção de notebook em Curitiba: atendimento no endereço, coleta e bancada, cobertura por região, regra comercial clara e triagem online obrigatória.",
    coverage: [
      "Atendemos notebooks em toda Curitiba, com operação organizada por região: centro, sul, norte, leste, oeste e o eixo corporativo Batel/Ecoville. A definição da modalidade depende do bairro, do tipo de defeito informado na triagem e da necessidade de bancada.",
      "Notebook é o equipamento com maior volume de bancada da nossa operação em Curitiba: boa parte dos serviços (troca de tela, teclado, dobradiça, reballing de conector, limpeza interna com troca de pasta térmica) exige ambiente controlado, então a coleta costuma ser a modalidade mais rápida e previsível na cidade.",
      "Serviços de software (formatação, migração de dados, remoção de malware, configuração de contas) podem ser resolvidos no endereço do cliente quando o equipamento liga normalmente.",
    ],
    modalities: [
      { name: "Atendimento no endereço", description: "Indicado para configuração, formatação, migração de dados e diagnóstico inicial, quando o notebook liga." },
      { name: "Coleta e entrega", description: "Modalidade padrão em Curitiba para reparos de hardware — retiramos no endereço e devolvemos após a conclusão." },
      { name: "Bancada", description: "Cliente entrega e retira no nosso endereço; é a via mais econômica para diagnóstico." },
      { name: "Remoto", description: "Suporte assistido para ajustes de sistema, contas e aplicativos, sem deslocamento." },
    ],
    residential:
      "Em residências de Curitiba o cenário mais comum é notebook lento, superaquecendo, com bateria degradada ou tela danificada. Nesses casos avaliamos a viabilidade do reparo antes de qualquer peça: o objetivo é evitar investimento maior que o valor do equipamento.",
    business:
      "Para empresas de Curitiba trabalhamos com lotes de notebooks, padronização de imagem de sistema, inventário de equipamentos e substituição planejada. A coleta pode ser agendada em janela única para reduzir impacto na operação.",
    howToRequest: REQUEST_STEPS_BASE,
    logistics:
      "Coletas em Curitiba são agendadas em janelas por região da cidade. Reparos que dependem de peça encomendada seguem prazo distinto do reparo comum.",
    faqs: [
      { question: "Vocês atendem notebook em qualquer bairro de Curitiba?", answer: "Sim. A operação cobre Curitiba inteira, organizada por região. O que muda conforme o bairro é a janela de agendamento e a modalidade sugerida (endereço, coleta ou bancada), definidas na triagem online." },
      { question: "O notebook precisa ir para bancada?", answer: "Depende do defeito. Problemas de software e configuração normalmente são resolvidos no endereço. Reparos de hardware — tela, teclado, conector de energia, limpeza interna, placa — exigem bancada, e nesse caso oferecemos coleta e entrega." },
      { question: "Como funciona a coleta em Curitiba?", answer: "Após a triagem online com fotos e vídeos, o atendimento personalizado com coleta e entrega tem valor mínimo pré-aprovado de R$ 299,99, que pode variar conforme distância, equipamento e complexidade. Nada é executado sem aprovação prévia." },
      { question: "Meus dados são preservados na manutenção?", answer: "Trabalhamos com o princípio de preservação: quando há risco ao armazenamento, isso é informado antes da execução e o backup é tratado como etapa separada e aprovada pelo cliente." },
    ],
  },

  informatica: {
    slug: "informatica",
    localTitle: "Manutenção de computador em Curitiba",
    metaTitle: "Manutenção de Computador em Curitiba — Atendimento Local",
    metaDescription:
      "Manutenção de computador em Curitiba: atendimento no endereço, coleta, bancada e suporte remoto. Cobertura por região, condições comerciais claras e triagem online.",
    coverage: [
      "Atendemos desktops residenciais e corporativos em toda Curitiba. A operação é dividida por região da cidade para dar previsibilidade de agendamento — do Centro e Rebouças ao Pinheirinho, Cajuru, Santa Felicidade e CIC.",
      "Desktop tem uma vantagem logística em Curitiba: boa parte dos serviços pode ser feita no próprio endereço, porque o gabinete permite intervenção sem estrutura de microssoldagem — limpeza, troca de fonte, memória, armazenamento e reinstalação de sistema.",
      "Quando o diagnóstico aponta falha de placa-mãe ou testes prolongados de estabilidade, o equipamento vai para bancada, com coleta agendada.",
    ],
    modalities: [
      { name: "Atendimento no endereço", description: "Modalidade principal para desktops em Curitiba: diagnóstico, limpeza, upgrades e reinstalação no local." },
      { name: "Coleta e entrega", description: "Para testes longos de estabilidade, suspeita de falha de placa ou reparos que exigem bancada." },
      { name: "Bancada", description: "Entrega no nosso endereço, com diagnóstico registrado antes de qualquer execução." },
      { name: "Remoto", description: "Ajustes de sistema operacional, drivers, contas e aplicativos sem deslocamento." },
    ],
    residential:
      "Em casa, o pedido mais comum em Curitiba é computador lento, travando ou desligando sozinho. Antes de propor troca de peça, verificamos alimentação, temperatura e saúde do armazenamento — muitos casos se resolvem com limpeza, SSD e reinstalação limpa do sistema.",
    business:
      "Para escritórios e comércios de Curitiba padronizamos estações de trabalho, organizamos inventário e planejamos substituições. Atendimentos podem ser agrupados em uma única visita por endereço.",
    howToRequest: REQUEST_STEPS_BASE,
    logistics:
      "Visitas são agendadas por bloco de tempo. Quando o serviço exige peça específica, o prazo passa a depender do fornecimento e é informado na aprovação.",
    faqs: [
      { question: "Vocês vão até minha casa em Curitiba?", answer: "Sim. Para desktops o atendimento no endereço é a modalidade padrão em Curitiba, exceto quando o diagnóstico exige bancada — nesse caso é oferecida coleta e entrega." },
      { question: "Quanto custa a visita técnica em Curitiba?", answer: `${PRICING.technicalVisit.description}` },
      { question: "Atendem empresas e condomínios?", answer: "Sim. Atendemos escritórios, comércios, clínicas e condomínios em Curitiba, com possibilidade de agrupar várias máquinas no mesmo agendamento." },
      { question: "Preciso levar o computador até vocês?", answer: "Só se você optar pela bancada, que é a via mais econômica para diagnóstico. Caso contrário, atendemos no endereço ou coletamos o equipamento." },
    ],
  },

  redes: {
    slug: "redes",
    localTitle: "Redes e Wi-Fi em Curitiba",
    metaTitle: "Redes e Wi-Fi em Curitiba — Instalação e Suporte Local",
    metaDescription:
      "Contrate redes e Wi-Fi em Curitiba: cabeamento, cobertura de sinal, redes residenciais e empresariais. Atendimento por região, escopo e condições definidos na triagem.",
    coverage: [
      "Projetos de rede e Wi-Fi são, por natureza, presenciais: dependem da planta do imóvel, da posição do ponto de entrada da operadora e dos materiais de construção. Por isso atendemos Curitiba com visita técnica em todas as regiões.",
      "Em Curitiba, dois cenários dominam: apartamentos com paredes e lajes que degradam o sinal (comum no Batel, Ecoville, Água Verde e Centro) e casas com anexos, edícula ou escritório nos fundos, onde a solução envolve cabeamento ou ponto adicional.",
      "Para empresas, tratamos rack, cabeamento estruturado, segmentação de rede e cobertura por setor.",
    ],
    modalities: [
      { name: "Atendimento no endereço", description: "Obrigatório para levantamento de cobertura, cabeamento e instalação de pontos." },
      { name: "Remoto", description: "Reconfiguração de roteador, senha, canais e ajustes de rede já instalada." },
      { name: "Projeto empresarial", description: "Levantamento em campo, plano de cabeamento e execução programada fora do horário comercial." },
    ],
    residential:
      "Em residências de Curitiba o objetivo é cobertura estável em todos os cômodos: revisamos posicionamento do roteador, interferência de canais, necessidade de ponto cabeado ou malha de sinal, sem prometer resultado sem medição no local.",
    business:
      "Em empresas priorizamos previsibilidade: rede segmentada, cabeamento identificado, equipamentos em rack e documentação básica da instalação para que qualquer manutenção futura seja rápida.",
    howToRequest: REQUEST_STEPS_BASE,
    logistics:
      "Instalações que envolvem cabeamento exigem levantamento presencial antes do orçamento final — materiais e infraestrutura não estão inclusos na visita.",
    faqs: [
      { question: "Vocês instalam rede cabeada em apartamento em Curitiba?", answer: "Sim, com avaliação presencial. Em apartamentos a viabilidade depende de infraestrutura existente, tubulação e regras do condomínio — tudo é verificado na visita antes da execução." },
      { question: "Resolvem Wi-Fi fraco nos fundos da casa?", answer: "Na maioria dos casos sim, mas só indicamos a solução (ponto cabeado, repetidor ou malha) depois de medir o sinal no local, porque materiais de construção mudam completamente o resultado." },
      { question: "Atendem empresas fora do horário comercial em Curitiba?", answer: "Sim. Instalações que param a operação podem ser agendadas em janela alternativa, combinada previamente na triagem." },
      { question: "Os materiais estão inclusos?", answer: "Não. Peças, componentes, materiais e itens adicionais não estão inclusos nos valores de visita ou coleta e são apresentados para aprovação antes da execução." },
    ],
  },

  "recuperacao-dados": {
    slug: "recuperacao-dados",
    localTitle: "Recuperação de dados em Curitiba",
    metaTitle: "Recuperação de Dados em Curitiba — Coleta e Bancada",
    metaDescription:
      "Recuperação de dados em Curitiba: coleta do dispositivo, análise em bancada e devolutiva antes de qualquer execução. Atendimento em toda a cidade via triagem online.",
    coverage: [
      "Recuperação de dados é sempre serviço de bancada: não existe execução confiável no endereço do cliente. Em Curitiba, portanto, o atendimento é organizado em torno da logística — coleta no seu endereço ou entrega direta no nosso.",
      "Atendemos HDs, SSDs, pendrives, cartões e discos de notebooks e desktops de clientes de toda Curitiba, incluindo empresas que precisam de continuidade rápida.",
      "A regra é conservadora: quanto menos o dispositivo for manipulado ou religado após a falha, maiores as chances. Por isso a triagem online pede detalhes do que já foi tentado.",
    ],
    modalities: [
      { name: "Coleta e entrega", description: "Retiramos o dispositivo no endereço em Curitiba e devolvemos após a conclusão." },
      { name: "Bancada", description: "Entrega direta no nosso endereço — via mais rápida para iniciar a análise." },
    ],
    residential:
      "Para clientes residenciais em Curitiba o foco costuma ser fotos, documentos e arquivos pessoais de HDs externos e notebooks antigos. A análise define o que é tecnicamente recuperável antes de qualquer compromisso.",
    business:
      "Para empresas de Curitiba tratamos discos de estações e servidores com prioridade de continuidade, e recomendamos rotina de backup ao final para que o caso não se repita.",
    howToRequest: REQUEST_STEPS_BASE,
    logistics:
      "O prazo depende do estado do dispositivo e da complexidade da análise — não trabalhamos com promessa de prazo antes do diagnóstico.",
    faqs: [
      { question: "Posso levar o HD até vocês em Curitiba?", answer: "Sim, a entrega em bancada é a forma mais rápida de iniciar a análise. Também oferecemos coleta e entrega no seu endereço em Curitiba." },
      { question: "Vocês garantem que todos os arquivos voltam?", answer: "Não. Nenhuma recuperação séria garante resultado antes da análise. Informamos o que é tecnicamente recuperável e o cliente decide se autoriza a continuidade." },
      { question: "O dispositivo faz barulho — devo continuar tentando ligar?", answer: "Não. Religar um disco com ruído mecânico costuma agravar o dano. Desligue e informe isso na triagem." },
      { question: "Atendem empresas com urgência em Curitiba?", answer: "Sim, casos empresariais com impacto em operação são sinalizados na triagem e priorizados na fila conforme disponibilidade." },
    ],
  },

  "pc-gamer": {
    slug: "pc-gamer",
    localTitle: "Montagem de PC em Curitiba",
    metaTitle: "Montagem de PC em Curitiba — Bancada e Entrega Local",
    metaDescription:
      "Montagem de PC em Curitiba: montagem em bancada, testes de estabilidade e entrega. Peças do cliente aceitas conforme política. Solicite pela triagem online.",
    coverage: [
      "Montagem de PC em Curitiba é executada em bancada, com testes antes da entrega — é o único formato que permite validar temperatura, estabilidade e comportamento sob carga.",
      "Atendemos clientes de toda Curitiba com duas logísticas: você entrega as peças no nosso endereço e retira a máquina montada, ou contrata coleta e entrega no seu endereço.",
      "O escopo é montagem e validação. Peças, componentes e periféricos não estão inclusos e seguem a política de peças do cliente.",
    ],
    modalities: [
      { name: "Bancada", description: "Montagem, cable management, instalação de sistema e bateria de testes no nosso endereço." },
      { name: "Coleta e entrega", description: "Retirada das peças e devolução da máquina montada no seu endereço em Curitiba." },
    ],
    residential:
      "Para clientes residenciais de Curitiba a montagem inclui checklist de testes e orientação de uso — o que a máquina entrega e quais limites ela tem, sem promessa de desempenho não medido.",
    business:
      "Empresas de Curitiba usam esse serviço para estações de trabalho específicas (edição, CAD, servidores leves), com padronização entre máquinas do mesmo lote.",
    howToRequest: REQUEST_STEPS_BASE,
    logistics:
      "A montagem só é iniciada com todas as peças em mãos e compatibilidade confirmada na triagem.",
    faqs: [
      { question: "Posso levar minhas próprias peças em Curitiba?", answer: "Sim, conforme a política de peças do cliente: a compatibilidade é conferida antes da montagem e a garantia do serviço cobre a montagem, não as peças fornecidas." },
      { question: "Vocês montam no meu endereço?", answer: "Não. A montagem é feita em bancada porque exige testes de estabilidade e temperatura. Oferecemos coleta das peças e entrega da máquina pronta em Curitiba." },
      { question: "A instalação do sistema está inclusa?", answer: "Sim, a instalação e a configuração inicial fazem parte do escopo de montagem, com licenças e softwares por conta do cliente." },
      { question: "Quanto tempo leva a montagem?", answer: "Depende da fila técnica e da bateria de testes. O prazo estimado é informado na aprovação, após a triagem com a lista de peças." },
    ],
  },

  servidores: {
    slug: "servidores",
    localTitle: "Suporte técnico empresarial em Curitiba",
    metaTitle: "Suporte Técnico Empresarial em Curitiba — Atendimento Local",
    metaDescription:
      "Suporte técnico empresarial em Curitiba: atendimento no local, remoto e manutenção preventiva de servidores e estações. Escopo e janelas definidos na triagem.",
    coverage: [
      "Atendemos empresas em Curitiba com foco em continuidade: servidores, estações, rede e rotinas de backup. A operação cobre o eixo corporativo (Batel, Bigorrilho, Ecoville), o Centro e as regiões industriais como a CIC.",
      "Empresas exigem previsibilidade de janela: intervenções que derrubam serviço são planejadas fora do horário de pico ou em fim de semana, combinadas antes da execução.",
      "O escopo é acordado por escrito na triagem — o que é preventivo, o que é corretivo e o que exige aprovação adicional.",
    ],
    modalities: [
      { name: "Atendimento no local", description: "Intervenções em servidor, rack, rede e estações dentro da empresa em Curitiba." },
      { name: "Remoto", description: "Diagnóstico, ajustes de configuração e acompanhamento de rotinas sem deslocamento." },
      { name: "Preventiva programada", description: "Visitas periódicas com checklist de saúde de equipamentos e verificação de backup." },
    ],
    residential: "Este serviço é dedicado a empresas; demandas residenciais são atendidas pelas rotas de manutenção de computador e notebook.",
    business:
      "Trabalhamos com inventário, checklist de preventiva, verificação de backup e registro de atendimentos, para que a empresa saiba exatamente o que foi feito em cada visita.",
    howToRequest: REQUEST_STEPS_BASE,
    logistics:
      "Janelas fora do horário comercial em Curitiba são combinadas na triagem e podem alterar as condições comerciais aplicáveis.",
    faqs: [
      { question: "Atendem contrato mensal em Curitiba?", answer: "Avaliamos escopo recorrente caso a caso na triagem: número de estações, servidores, rotina de preventiva e janelas de atendimento definem as condições." },
      { question: "Fazem intervenção fora do horário comercial?", answer: "Sim, para evitar parada de operação. A janela é combinada previamente e pode alterar as condições comerciais." },
      { question: "Verificam backup?", answer: "Sim. Verificação de rotina de backup faz parte do checklist de preventiva empresarial — backup sem teste de restauração não é considerado backup." },
      { question: "Atendem empresas fora de Curitiba?", answer: "A base da operação é Curitiba e região metropolitana; demandas em outras cidades são avaliadas na triagem conforme deslocamento." },
    ],
  },

  macbook: {
    slug: "macbook",
    localTitle: "Assistência para MacBook em Curitiba",
    metaTitle: "Assistência para MacBook em Curitiba — Coleta e Bancada",
    metaDescription:
      "Assistência para MacBook em Curitiba: coleta, bancada e devolutiva antes da execução. Atendimento em toda a cidade com triagem online obrigatória.",
    coverage: [
      "MacBook é serviço de bancada em praticamente todos os casos de hardware — a construção compacta exige ferramental e ambiente controlado. Em Curitiba, isso significa coleta no seu endereço ou entrega direta no nosso.",
      "Atendemos clientes de toda Curitiba, com concentração de demanda nas regiões de escritórios e coworkings (Batel, Ecoville, Centro), onde o MacBook é máquina de trabalho e a indisponibilidade pesa.",
      "Serviços de sistema, contas e migração de dados podem ser tratados no endereço ou remotamente quando o equipamento liga normalmente.",
    ],
    modalities: [
      { name: "Coleta e entrega", description: "Modalidade padrão em Curitiba para reparos de hardware em MacBook." },
      { name: "Bancada", description: "Entrega no nosso endereço para diagnóstico com menor custo." },
      { name: "Remoto", description: "Ajustes de macOS, contas, backup e migração quando o equipamento está operacional." },
    ],
    residential:
      "Para uso pessoal, o foco é preservar dados e avaliar viabilidade econômica do reparo antes de qualquer peça — em equipamentos Apple essa conta muda bastante conforme o modelo e o ano.",
    business:
      "Para empresas e profissionais de Curitiba, priorizamos reduzir o tempo parado: diagnóstico rápido, devolutiva objetiva e, quando aplicável, migração dos dados para máquina reserva.",
    howToRequest: REQUEST_STEPS_BASE,
    logistics:
      "Reparos que dependem de peça específica podem seguir prazo de encomenda, informado antes da aprovação.",
    faqs: [
      { question: "Vocês atendem MacBook no endereço em Curitiba?", answer: "Para serviços de sistema, contas e migração, sim. Reparos de hardware exigem bancada, com coleta e entrega em Curitiba." },
      { question: "Fazem diagnóstico antes de cobrar o reparo?", answer: "Sim. O diagnóstico é etapa separada e nada é executado sem aprovação prévia das condições apresentadas." },
      { question: "Consigo recuperar meus dados de um MacBook que não liga?", answer: "É avaliado na bancada. Quando o armazenamento é acessível, a extração de dados é tratada como serviço específico e aprovado à parte." },
      { question: "Como funciona a garantia?", answer: "A garantia cobre o serviço executado e as peças aplicadas por nós, dentro do escopo aprovado, e não se estende a danos posteriores ou intervenções de terceiros." },
    ],
  },

  impressoras: {
    slug: "impressoras",
    localTitle: "Manutenção de impressoras em Curitiba",
    metaTitle: "Manutenção de Impressoras em Curitiba — Local e Bancada",
    metaDescription:
      "Manutenção de impressoras em Curitiba: atendimento no endereço, coleta e bancada para residências e empresas. Escopo e condições definidos na triagem online.",
    coverage: [
      "Atendemos impressoras em toda Curitiba. Configuração, instalação em rede e falhas simples de alimentação de papel costumam ser resolvidas no próprio endereço; falhas mecânicas e de sistema de tinta vão para bancada.",
      "Em escritórios e comércios de Curitiba o cenário mais comum é impressora em rede que parou de ser reconhecida pelas estações — caso típico de atendimento no local, integrado à revisão de rede.",
      "Para residências, o volume maior é de multifuncionais com falha de impressão, entupimento de cabeçote ou configuração de Wi-Fi.",
    ],
    modalities: [
      { name: "Atendimento no endereço", description: "Instalação, configuração em rede e ajustes no local, em toda Curitiba." },
      { name: "Coleta e entrega", description: "Para falhas mecânicas e limpeza profunda que exigem bancada." },
      { name: "Remoto", description: "Reinstalação de drivers e configuração de impressão em rede quando o hardware está íntegro." },
    ],
    residential:
      "Em casa, priorizamos colocar a impressora em rede de forma estável e resolver falhas de qualidade de impressão sem substituir peças desnecessárias.",
    business:
      "Em empresas de Curitiba organizamos impressão compartilhada, permissões por estação e rotina de manutenção para reduzir chamados repetidos.",
    howToRequest: REQUEST_STEPS_BASE,
    logistics:
      "Peças e suprimentos não estão inclusos e, quando necessários, dependem de disponibilidade do fabricante.",
    faqs: [
      { question: "Configuram impressora em rede em empresas de Curitiba?", answer: "Sim. Configuração em rede, compartilhamento entre estações e permissões são feitos no local, junto com a verificação da rede." },
      { question: "Vale a pena consertar impressora antiga?", answer: "Avaliamos a relação entre custo do reparo, disponibilidade de peças e valor do equipamento, e apresentamos essa comparação antes de qualquer execução." },
      { question: "Atendem no endereço ou preciso levar?", answer: "Ambos. Configuração e falhas simples são resolvidas no endereço em Curitiba; falhas mecânicas exigem bancada, com coleta disponível." },
      { question: "Suprimentos estão inclusos?", answer: "Não. Cartuchos, toners, peças e materiais não estão inclusos nos valores de visita ou coleta." },
    ],
  },
};

export const CURITIBA_SERVICE_SLUGS = Object.keys(CURITIBA_SERVICE_LOCAL);

export const getCuritibaServiceLocal = (slug?: string): CuritibaServiceLocal | undefined =>
  slug ? CURITIBA_SERVICE_LOCAL[slug] : undefined;
