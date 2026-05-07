// Round 2: 10 more viral posts targeting high-intent informática keywords in SJP.
// Focus: vírus, formatação, Wi-Fi, notebook, rede, backup, ransomware, gamer.

import type { BlogPost } from "./blog";

const cities = ["sao-jose-dos-pinhais", "curitiba", "pinhais", "colombo", "araucaria"];

const baseLinks = [
  { label: "Tabela de preços completa", to: "/precos" },
  { label: "Atendimento em São José dos Pinhais", to: "/regioes/sao-jose-dos-pinhais" },
  { label: "Serviço de informática em SJP", to: "/servico-em/sao-jose-dos-pinhais/informatica" },
  { label: "Manutenção de notebooks em SJP", to: "/servico-em/sao-jose-dos-pinhais/notebooks" },
  { label: "Configuração de redes em SJP", to: "/servico-em/sao-jose-dos-pinhais/redes" },
];

function p(input: Omit<BlogPost, "updatedAt" | "relatedCities" | "internalLinks"> & {
  updatedAt?: string;
  internalLinks?: BlogPost["internalLinks"];
}): BlogPost {
  return {
    ...input,
    updatedAt: input.updatedAt ?? input.publishedAt,
    relatedCities: cities,
    internalLinks: input.internalLinks ?? baseLinks,
  };
}

export const viralSjpPosts2: BlogPost[] = [
  p({
    slug: "remover-virus-pc-sao-jose-dos-pinhais-sem-formatar",
    title: "Como remover vírus do PC em São José dos Pinhais sem precisar formatar (2026)",
    metaTitle: "Remover Vírus do PC em São José dos Pinhais sem Formatar | SJP",
    metaDescription:
      "Passo a passo profissional para remover vírus, malware e ransomware em São José dos Pinhais sem perder arquivos. Atendimento 24h via WhatsApp. A partir de R$ 99,99.",
    excerpt:
      "Antes de formatar, tente esse protocolo de limpeza usado por técnicos em SJP. Remove 90% dos vírus, mantém arquivos e leva menos de 2 horas.",
    category: "informatica",
    tags: ["remoção de vírus sjp", "malware", "ransomware", "técnico sjp"],
    publishedAt: "2026-04-25",
    readingTime: 11,
    sections: [
      { paragraphs: [
        "Em São José dos Pinhais, mais da metade dos PCs que recebemos com 'tudo travando' não precisa de formatação — é só um conjunto de malware acumulado por meses de cliques em links suspeitos. O protocolo abaixo é exatamente o que aplicamos em chamados na Cidade Jardim, Afonso Pena, Boneca do Iguaçu e Centro de SJP.",
      ]},
      { heading: "Sintomas claros de infecção (não confunda com PC velho)", paragraphs: [
        "Se 4 ou mais sintomas abaixo aparecem, é vírus, não desgaste de hardware. PC velho fica lento de forma constante; vírus causa picos repentinos, pop-ups e mudanças sem você autorizar.",
      ], list: [
        "Navegador abre página estranha sozinho ou mudou o buscador padrão",
        "Pop-ups com 'seu PC está em risco' fora do navegador",
        "HD trabalhando 100% mesmo com o PC ocioso",
        "Senhas salvas sumiram ou redes sociais 'logaram em outro lugar'",
        "Antivírus desligou sozinho e não liga mais",
        "Aparece extensão no navegador que você não instalou",
        "Arquivos com extensão .crypto, .locked, .encrypted (ransomware — pare tudo e chame técnico)",
      ]},
      { heading: "Etapa 1 — Isolar o PC", paragraphs: [
        "Desconecte o cabo de rede e desligue o Wi-Fi. Isso evita que o malware se comunique com o servidor de controle e impede a propagação para outros dispositivos da sua rede em SJP, especialmente importante em casa com smart-TV, câmeras e celulares conectados.",
      ]},
      { heading: "Etapa 2 — Modo de Segurança com Rede", paragraphs: [
        "Reinicie segurando Shift, vá em 'Solucionar problemas → Opções avançadas → Configurações de inicialização → Reiniciar' e escolha 5 (Modo de Segurança com Rede). 90% dos malwares não conseguem rodar nesse modo.",
      ]},
      { heading: "Etapa 3 — Combo de scanners (essa é a chave)", paragraphs: [
        "Nenhum antivírus pega tudo sozinho. Use 3 ferramentas em sequência:",
      ], list: [
        "Microsoft Defender Offline (varredura completa) — leva 1h",
        "Malwarebytes Free (Threat Scan + Rootkit Scan ativado nas configs)",
        "AdwCleaner (remove adware, barras de ferramentas e PUPs)",
        "ESET Online Scanner (segunda opinião, pega o que os outros deixaram)",
      ]},
      { heading: "Etapa 4 — Limpeza profunda do navegador", paragraphs: [
        "Em Chrome, Edge e Firefox: redefinir configurações, remover extensões desconhecidas, limpar cache, cookies e dados de site. No Edge: edge://settings/reset. No Chrome: chrome://settings/reset.",
      ]},
      { heading: "Etapa 5 — Verificar inicialização e tarefas agendadas", paragraphs: [
        "Abra o Gerenciador de Tarefas → Inicializar e desabilite tudo que você não reconhece. Depois rode 'taskschd.msc' e procure tarefas com nomes aleatórios criadas recentemente — malwares persistem assim.",
      ]},
      { heading: "Quando vale chamar técnico em SJP em vez de tentar sozinho", paragraphs: [
        "Se aparecer mensagem de resgate, se o computador for de empresa com dados sensíveis, ou se você não tem backup recente — pare e chame. Arrastar o problema sozinho geralmente piora.",
      ]},
    ],
    faqs: [
      { question: "Quanto custa a remoção de vírus em SJP?", answer: "R$ 200 a R$ 350 dependendo da gravidade, com nota fiscal e garantia de 30 dias. Visita técnica + diagnóstico custa R$ 99,99 e é deduzida se aprovar o serviço." },
      { question: "Vou perder meus arquivos?", answer: "Não, na grande maioria dos casos. Sempre fazemos backup completo antes de qualquer ação. A única exceção é ransomware com criptografia já consolidada." },
      { question: "Demora quanto tempo?", answer: "Entre 2 e 4 horas no local, dependendo do tamanho do disco e da quantidade de malware. Em casos críticos, levamos para a bancada e devolvemos em 24h." },
    ],
    relatedServices: ["informatica"],
  }),

  p({
    slug: "formatacao-de-notebook-sao-jose-dos-pinhais-passo-a-passo",
    title: "Formatação de notebook em São José dos Pinhais: o passo a passo profissional",
    metaTitle: "Formatação de Notebook em São José dos Pinhais | SJP 2026",
    metaDescription:
      "Como é uma formatação de notebook feita por técnico profissional em São José dos Pinhais: backup, instalação limpa, drivers e programas. R$ 180 a R$ 280.",
    excerpt:
      "O check-list completo que usamos em cada formatação de notebook em SJP — incluindo o que diferencia uma formatação caseira de uma profissional.",
    category: "informatica",
    tags: ["formatação sjp", "notebook", "windows 11"],
    publishedAt: "2026-04-26",
    readingTime: 10,
    sections: [
      { paragraphs: [
        "Uma formatação mal feita é pior do que não formatar. Em SJP recebemos toda semana notebooks que foram 'formatados pelo amigo' e voltaram em uma semana com problemas piores: drivers errados, ativação do Windows perdida, programas piratas instalados e dados originais não recuperáveis.",
      ]},
      { heading: "1. Backup REAL — não só Documentos", paragraphs: [
        "A pasta Documentos é só a ponta do iceberg. Backup profissional inclui:",
      ], list: [
        "Documentos, Imagens, Vídeos, Música, Downloads, Área de Trabalho",
        "Favoritos e senhas dos navegadores (Chrome/Edge/Firefox)",
        "E-mails do Outlook ou Thunderbird (arquivos .pst / perfis)",
        "Licenças de software (Office, AutoCAD, CorelDraw, antivírus pago)",
        "Drivers personalizados de impressora, scanner, plotter",
        "Configurações de programas (AutoCAD, Photoshop, MT4 etc.)",
      ]},
      { heading: "2. Identificação correta do modelo", paragraphs: [
        "Cada notebook (Lenovo, Dell, HP, Acer, Asus, Samsung, Positivo, LG) tem um pacote de drivers específico. Buscar driver pelo modelo da placa-mãe via Speccy ou HWiNFO é mandatório — sem isso, a câmera, leitor de digital, atalhos de função, áudio Dolby e webcam podem não funcionar.",
      ]},
      { heading: "3. Verificar a licença do Windows ANTES", paragraphs: [
        "Em notebook de marca, a licença normalmente fica gravada na BIOS (DPK). Use 'wmic path softwarelicensingservice get OA3xOriginalProductKey' no CMD como administrador. Se não tiver, vincule a uma conta Microsoft antes de formatar.",
      ]},
      { heading: "4. Instalação limpa do Windows 11 oficial", paragraphs: [
        "Sempre baixar a ISO direto da Microsoft. Desabilitar conta online (uso 'oobe\\bypassnro' na tela inicial), criar conta local, depois ativar BitLocker manualmente. Isso evita criptografia automática que já causou perda de dados em vários clientes em SJP.",
      ]},
      { heading: "5. Drivers e Windows Update", paragraphs: [
        "Instalar primeiro o driver do chipset, depois rede, vídeo, áudio. Só depois rodar Windows Update — para evitar que ele instale driver genérico antes do oficial.",
      ]},
      { heading: "6. Pacote essencial (e o que NÃO instalar)", paragraphs: [
        "Instalamos: navegador, leitor de PDF, pacote Office, antivírus (Defender é suficiente para 95% dos casos) e 7-Zip. Nunca instalamos: 'otimizadores' tipo Advanced SystemCare, CCleaner, ou drivers via DriverPack — todos prejudicam o sistema.",
      ]},
      { heading: "7. Imagem de restauração", paragraphs: [
        "Antes de devolver, criamos uma imagem do sistema limpo no próprio HD do cliente. Se em 6 meses ele quiser 'voltar ao zero', basta restaurar — sem chamar técnico de novo.",
      ]},
    ],
    faqs: [
      { question: "Quanto custa formatar notebook em SJP?", answer: "R$ 180 a R$ 280 com backup, instalação limpa, drivers, Office e antivírus. Tudo com nota fiscal e garantia de 90 dias." },
      { question: "Quanto tempo demora?", answer: "Entre 3 e 5 horas. Notebooks com SSD: 3h. Com HD mecânico: 5h. Geralmente fica pronto no mesmo dia." },
      { question: "Vou perder a licença do Windows?", answer: "Não. Em notebooks de fábrica, a licença é vinculada à placa-mãe e reativa sozinha. Em PCs montados, vinculamos antes à sua conta Microsoft." },
    ],
    relatedServices: ["notebooks", "informatica"],
  }),

  p({
    slug: "wifi-fraco-sao-jose-dos-pinhais-como-resolver",
    title: "Wi-Fi fraco em São José dos Pinhais: causas reais e como resolver de vez",
    metaTitle: "Wi-Fi Fraco em São José dos Pinhais: Soluções 2026 | SJP",
    metaDescription:
      "Wi-Fi caindo em São José dos Pinhais? Veja causas reais, soluções com mesh, troca de canal e cabeamento. Atendimento 24h em SJP. A partir de R$ 99,99.",
    excerpt:
      "Por que o Wi-Fi cai tanto em SJP — interferência de prédios, rede mal posicionada, roteador antigo — e o que fazer para resolver de verdade.",
    category: "redes-wifi",
    tags: ["wifi sjp", "rede mesh", "roteador são josé dos pinhais"],
    publishedAt: "2026-04-27",
    readingTime: 9,
    sections: [
      { paragraphs: [
        "Em São José dos Pinhais, com a verticalização rápida na Cidade Jardim, Afonso Pena e Centro, o espectro Wi-Fi virou guerra. Em condomínios é comum ter 30+ redes brigando pelo mesmo canal. Aqui está o que realmente resolve.",
      ]},
      { heading: "Causa #1: Roteador da operadora é fraco", paragraphs: [
        "Roteadores entregues pela Vivo, Claro, Sercomtel e provedores locais de SJP são modelos básicos com Wi-Fi 5 (AC) limitado. Em casa com 100m² já não dá conta. Solução: comprar um roteador próprio Wi-Fi 6 (AX) e colocar o da operadora em modo bridge.",
      ]},
      { heading: "Causa #2: Canal congestionado", paragraphs: [
        "Em condomínios de SJP, 80% das redes ficam no canal 1, 6 ou 11 da banda 2.4GHz. Use o WiFi Analyzer no celular, encontre o canal menos usado e configure manualmente no roteador.",
      ]},
      { heading: "Causa #3: Casa grande precisa de mesh, não repetidor", paragraphs: [
        "Repetidor corta velocidade pela metade e cria uma segunda rede. Sistema mesh (TP-Link Deco, Mercusys Halo, Tenda Nova) cria UMA rede única e mantém a velocidade. Para sobrados de SJP é praticamente obrigatório.",
      ]},
      { heading: "Causa #4: Cabeamento de entrada antigo", paragraphs: [
        "Muita casa em SJP ainda tem cabo CAT5 da época da instalação. Limita a 100Mbps mesmo se o plano for de 1 giga. Trocar para CAT6 custa pouco e libera a velocidade real.",
      ]},
      { heading: "Solução profissional para residências grandes", paragraphs: [
        "Em sobrados e casas térreas grandes em SJP, fazemos site survey, instalamos 2-3 nós mesh por andar com cabeamento entre eles (backhaul cabeado), e configuramos VLANs separando IoT (câmeras/smart-TV) da rede principal. Resultado: 100% de cobertura sem queda.",
      ]},
      { heading: "Quanto custa resolver Wi-Fi em SJP", paragraphs: [
        "Configuração avançada do roteador atual: R$ 150. Instalação de mesh com 3 nós: R$ 280 a R$ 450 de mão de obra (sem peças). Cabeamento estruturado por ponto: R$ 180 a R$ 280.",
      ]},
    ],
    faqs: [
      { question: "Posso usar o roteador da operadora?", answer: "Sim, mas em modo bridge. Usar como Wi-Fi principal limita seu desempenho mesmo se você tiver plano de 600Mbps ou mais." },
      { question: "Vale a pena Wi-Fi 6 em casa?", answer: "Vale se você tem mais de 10 dispositivos conectados ou plano acima de 300Mbps. Senão, Wi-Fi 5 (AC) ainda é suficiente." },
      { question: "Mesh ou cabeamento?", answer: "Sempre que possível, cabeamento. Mas mesh resolve 95% dos casos sem quebrar parede. Em casas alugadas em SJP, é a melhor opção." },
    ],
    relatedServices: ["redes"],
  }),

  p({
    slug: "notebook-lento-sao-jose-dos-pinhais-upgrade-ssd-ram",
    title: "Notebook lento em SJP: upgrade SSD + RAM transforma o equipamento (2026)",
    metaTitle: "Notebook Lento em SJP: Upgrade de SSD e RAM | São José dos Pinhais",
    metaDescription:
      "Notebook travando em São José dos Pinhais? Upgrade SSD + RAM custa R$ 380 a R$ 700 e deixa rápido como novo. Visita técnica em SJP a partir de R$ 99,99.",
    excerpt:
      "Antes de comprar um notebook novo em SJP, faça as duas trocas que fazem mais diferença: SSD e RAM. Custa 1/5 do preço de um equipamento novo.",
    category: "informatica",
    tags: ["notebook lento sjp", "upgrade ssd", "memória ram"],
    publishedAt: "2026-04-28",
    readingTime: 8,
    sections: [
      { paragraphs: [
        "Cliente em SJP nos chamou querendo orçamento para um notebook novo de R$ 4.500. Avaliamos o atual: i5 de 2018 com HD mecânico e 4GB de RAM. Trocamos por SSD de 480GB e adicionamos 8GB de RAM por R$ 580 totais. Resultado: ele parou de pensar em comprar novo.",
      ]},
      { heading: "Por que SSD muda tudo", paragraphs: [
        "SSD é entre 10 e 30x mais rápido que HD mecânico. Boot do Windows que demorava 2 minutos passa a ser 15 segundos. Abertura de Chrome, Word e Excel é instantânea. É a única atualização de hardware que muda a percepção de uso de forma drástica.",
      ]},
      { heading: "Quando RAM resolve e quando não", paragraphs: [
        "Se você abre 20 abas + Excel + WhatsApp Web + Spotify e o PC engasga, o problema é RAM. Se trava só ao abrir um programa pesado, é processador (e troca de notebook é mais sensato). Verificamos isso em 5 minutos pelo Gerenciador de Tarefas.",
      ]},
      { heading: "Compatibilidade de upgrade", paragraphs: [
        "Nem todo notebook aceita upgrade. Ultrabooks finos da Dell, HP e Lenovo às vezes têm RAM soldada e SSD M.2 não trocável. Antes de orçar, identificamos modelo via número de série e checamos no manual do fabricante.",
      ]},
      { heading: "Preços reais em SJP em 2026", paragraphs: [
        "Valores cobrados por assistências sérias em São José dos Pinhais:",
      ], list: [
        "SSD Kingston/Crucial 480GB com clonagem do sistema atual: R$ 380 a R$ 480",
        "SSD 1TB com clonagem: R$ 580 a R$ 720",
        "Memória RAM 8GB DDR4: R$ 220 a R$ 320",
        "Memória RAM 16GB DDR4: R$ 380 a R$ 520",
        "Combo SSD 480GB + 8GB RAM: R$ 580 a R$ 720 (mais econômico)",
      ]},
      { heading: "Garantia e nota fiscal", paragraphs: [
        "Peça sempre nota fiscal das peças (não só do serviço). SSD e RAM têm garantia de fábrica de 3 a 5 anos. Sem nota, você perde a garantia do fabricante.",
      ]},
    ],
    faqs: [
      { question: "Vai durar mais quanto tempo após o upgrade?", answer: "Entre 3 e 5 anos a mais de uso confortável. SSD e RAM novos têm vida útil longa e o processador continua suficiente para tarefas comuns." },
      { question: "Demora quanto a clonagem do Windows?", answer: "Entre 2 e 4 horas, dependendo do volume de dados. Você não precisa reinstalar nada — tudo continua igual, só muito mais rápido." },
      { question: "Atendem em qual região de SJP?", answer: "Toda a cidade: Centro, Afonso Pena, Cidade Jardim, Boneca do Iguaçu, Aviação, São Cristóvão, Bom Jesus, Cruzeiro, Iná, Borda do Campo e zona rural." },
    ],
    relatedServices: ["notebooks", "informatica"],
  }),

  p({
    slug: "rede-empresarial-sao-jose-dos-pinhais-cabeamento-wifi-corporativo",
    title: "Rede empresarial em São José dos Pinhais: cabeamento estruturado + Wi-Fi corporativo",
    metaTitle: "Rede Empresarial em São José dos Pinhais | Cabeamento e Wi-Fi SJP",
    metaDescription:
      "Projeto e instalação de rede empresarial em São José dos Pinhais: cabeamento estruturado, Wi-Fi corporativo, VLANs e segurança. Orçamento sem compromisso.",
    excerpt:
      "Como montar uma rede pronta para crescer em uma empresa de SJP — cabeamento, switches gerenciáveis, controladora Wi-Fi e segurança.",
    category: "redes-wifi",
    tags: ["rede empresarial sjp", "cabeamento estruturado", "wifi corporativo"],
    publishedAt: "2026-04-29",
    readingTime: 11,
    sections: [
      { paragraphs: [
        "São José dos Pinhais concentra polo industrial automotivo, logística e comércio crescente. Empresas que crescem rápido sofrem com rede improvisada — cabos pelo chão, Wi-Fi caindo em reuniões, impressora sumindo. Este guia é o checklist de uma rede empresarial bem feita em SJP.",
      ]},
      { heading: "Cabeamento estruturado: o investimento que evita 80% dos problemas", paragraphs: [
        "Cabos CAT6 ou CAT6A passados em eletrocalhas, com patch panel, rack 12U e identificação por cor. Um projeto bem feito dura 15 anos. Improviso dura 6 meses até começar a queimar porta de switch.",
      ]},
      { heading: "Switch gerenciável + VLANs", paragraphs: [
        "Separamos rede administrativa, rede de produção, Wi-Fi de visitantes e câmeras CFTV em VLANs distintas. Se um setor for invadido, o ataque não se propaga. Switches Cisco SG, Ubiquiti UniFi ou Mikrotik são padrão.",
      ]},
      { heading: "Wi-Fi corporativo com controladora", paragraphs: [
        "Access Points UniFi, Aruba ou TP-Link Omada com controladora gerenciam roaming, balanceamento de carga e portal cativo para visitantes. Cliente conecta automaticamente no AP mais próximo ao andar pela empresa.",
      ]},
      { heading: "Firewall e segurança de borda", paragraphs: [
        "Firewall pfSense, Mikrotik ou SonicWall na entrada da rede com regras por VLAN, VPN para acesso remoto, log de tráfego para LGPD e bloqueio de aplicações de risco (BitTorrent, mineradores, sites maliciosos).",
      ]},
      { heading: "Backup e disaster recovery", paragraphs: [
        "Servidor com RAID 1 ou RAID 5, backup diário em NAS local + backup semanal em nuvem (Backblaze B2, Wasabi, Backup365). Teste mensal de restore — sem teste, backup não existe.",
      ]},
      { heading: "Faixas de investimento típicas em SJP", paragraphs: [
        "Valores médios para empresa em São José dos Pinhais em 2026:",
      ], list: [
        "Pequena empresa (até 10 estações): R$ 4.500 a R$ 8.500 implantação",
        "Média empresa (10 a 30 estações): R$ 12.000 a R$ 28.000 implantação",
        "Indústria/logística (30+ estações com galpão): R$ 35.000 a R$ 90.000",
        "Manutenção mensal contratual: R$ 800 a R$ 2.800/mês conforme tamanho",
      ]},
    ],
    faqs: [
      { question: "Vocês emitem ART/projeto técnico?", answer: "Sim, para projetos acima de 30 pontos emitimos memorial descritivo, projeto AutoCAD e ART quando exigido pelo cliente ou seguradora." },
      { question: "Atendem indústria em SJP?", answer: "Sim. Temos experiência em ambientes industriais, com cabeamento blindado, switches industriais e Wi-Fi para galpão." },
      { question: "Trabalham com qual SLA?", answer: "SLA padrão de 4h úteis para incidentes críticos e 1h para clientes com contrato premium em São José dos Pinhais." },
    ],
    relatedServices: ["redes", "informatica"],
  }),

  p({
    slug: "ransomware-sao-jose-dos-pinhais-como-agir",
    title: "Atacado por ransomware em São José dos Pinhais? O que fazer nas primeiras 2 horas",
    metaTitle: "Ransomware em São José dos Pinhais: Guia de Emergência | SJP",
    metaDescription:
      "Ransomware criptografou seus arquivos em SJP? Veja o que fazer nas primeiras 2 horas para minimizar prejuízo e tentar recuperar dados sem pagar resgate.",
    excerpt:
      "Cada minuto conta após um ataque de ransomware. Esse é o protocolo de emergência que aplicamos em empresas e residências em SJP.",
    category: "informatica",
    tags: ["ransomware sjp", "segurança", "recuperação de dados"],
    publishedAt: "2026-04-30",
    readingTime: 10,
    sections: [
      { paragraphs: [
        "Em 2026 ataques de ransomware contra pequenas empresas e profissionais liberais em SJP triplicaram. A janela das 2 primeiras horas é crítica: agir certo aumenta em até 60% as chances de recuperar dados sem pagar resgate.",
      ]},
      { heading: "1. Desconectar TUDO da rede imediatamente", paragraphs: [
        "Cabo de rede fora, Wi-Fi desligado em todos os dispositivos. Ransomware se espalha por compartilhamento de rede e pode criptografar o servidor, o NAS, outras estações e até backups montados.",
      ]},
      { heading: "2. NÃO desligar a máquina infectada", paragraphs: [
        "A memória RAM pode conter a chave de criptografia ainda em uso. Em alguns casos é possível extrair com ferramentas forenses. Desligar zera essa chance.",
      ]},
      { heading: "3. Identificar a variante", paragraphs: [
        "Sites como ID-Ransomware e No More Ransom identificam pela extensão dos arquivos e pela nota de resgate. Para algumas variantes (Stop/Djvu, Crysis antigos, GandCrab) já existem decryptors gratuitos do FBI/Europol.",
      ]},
      { heading: "4. NÃO pagar o resgate", paragraphs: [
        "Pagar não garante decriptação (40% dos pagamentos não recebem chave). Pagamento financia mais ataques e te marca como pagador — você vira alvo recorrente.",
      ]},
      { heading: "5. Verificar backups", paragraphs: [
        "Backups offline (HD externo desconectado, fita, cloud com versionamento) são a única salvação real. Verifique a integridade ANTES de restaurar — alguns ransomwares ficam dormentes 30+ dias antes de criptografar.",
      ]},
      { heading: "6. Notificar autoridades", paragraphs: [
        "Para empresas em SJP, registrar BO online na Polícia Civil do PR e, se houver dado pessoal de cliente, notificar à ANPD em até 72h por causa da LGPD. Isso pode reduzir multa significativamente.",
      ]},
      { heading: "Quanto custa o atendimento de emergência", paragraphs: [
        "Resposta a incidente em SJP: a partir de R$ 850 para diagnóstico inicial. Reconstrução do ambiente, hardening e monitoramento por 30 dias: R$ 2.500 a R$ 8.000 dependendo do tamanho. Tempo médio de resposta: 90 min em SJP.",
      ]},
    ],
    faqs: [
      { question: "Conseguem recuperar arquivos sem pagar?", answer: "Em variantes conhecidas: sim, com decryptors gratuitos. Em variantes novas: depende de backup. Sem backup e sem decryptor, raramente é possível." },
      { question: "Como evitar de novo?", answer: "Backup 3-2-1 (3 cópias, 2 mídias, 1 offsite), MFA em e-mail, EDR no lugar de antivírus, treinamento da equipe e patch mensal." },
    ],
    relatedServices: ["informatica"],
  }),

  p({
    slug: "backup-em-nuvem-sao-jose-dos-pinhais-como-fazer-certo",
    title: "Backup em nuvem em São José dos Pinhais: como fazer certo e quanto custa",
    metaTitle: "Backup em Nuvem em SJP: Como Fazer Certo (2026) | São José dos Pinhais",
    metaDescription:
      "Guia prático de backup em nuvem para residências e empresas em São José dos Pinhais: ferramentas, custos, regra 3-2-1 e configuração profissional.",
    excerpt:
      "Backup em pendrive já não basta. Veja como configurar backup em nuvem profissional em SJP e dormir tranquilo mesmo com ransomware ou queima de HD.",
    category: "informatica",
    tags: ["backup", "nuvem sjp", "segurança de dados"],
    publishedAt: "2026-05-01",
    readingTime: 8,
    sections: [
      { paragraphs: [
        "Em São José dos Pinhais, dois clientes nos chamaram no mesmo mês: um perdeu fotos de casamento por queima de HD; outro perdeu 3 anos de contabilidade por ransomware. Ambos tinham backup — em HD externo conectado direto no PC, criptografado junto.",
      ]},
      { heading: "Regra 3-2-1 de backup", paragraphs: [
        "Padrão da indústria: 3 cópias dos dados, em 2 mídias diferentes, sendo 1 offsite (fora do local). Em casa: PC + HD externo + nuvem. Em empresa: servidor + NAS + nuvem.",
      ]},
      { heading: "Soluções para residências em SJP", paragraphs: [
        "Para uso pessoal e familiar:",
      ], list: [
        "Google One 200GB: R$ 9,99/mês — fotos + drive + Gmail",
        "Microsoft 365 Personal: R$ 27/mês — 1TB OneDrive + Office",
        "iCloud+ 200GB: R$ 14,90/mês — para usuários Apple",
        "pCloud Lifetime 500GB: R$ 990 pagamento único",
      ]},
      { heading: "Soluções para empresas em SJP", paragraphs: [
        "Para pequenas e médias empresas:",
      ], list: [
        "Microsoft 365 Business Standard: US$ 12,50/usuário/mês",
        "Google Workspace Business Plus: US$ 18/usuário/mês com Vault",
        "Backblaze B2: US$ 6/TB/mês — backup de servidor",
        "Wasabi Hot Storage: US$ 6,99/TB/mês — sem taxa de saída",
        "Acronis Cyber Protect: licença completa com antivírus + backup",
      ]},
      { heading: "Erros comuns que vemos em SJP", paragraphs: [
        "HD externo conectado 24/7 (vira presa de ransomware), backup só em pendrive (perde, queima, esquece), 'sincronização' confundida com backup (delete num lado, deleta no outro), sem teste de restore (descobre que backup está corrompido só na hora da emergência).",
      ]},
      { heading: "Quanto custa configurar com técnico em SJP", paragraphs: [
        "Configuração inicial residencial: R$ 150 a R$ 250. Configuração empresarial com servidor + nuvem + plano de retenção: R$ 800 a R$ 2.500.",
      ]},
    ],
    faqs: [
      { question: "Sincronizar (Drive/OneDrive) é backup?", answer: "Não. É espelho. Se um arquivo for apagado ou criptografado por vírus, a alteração se replica na nuvem. Backup real tem versionamento e retenção." },
      { question: "Quanto espaço de nuvem eu preciso?", answer: "Para uso pessoal: 200GB-1TB. Para profissional liberal: 1-2TB. Para PME: depende do volume — média de 10-50GB por usuário." },
    ],
    relatedServices: ["informatica"],
  }),

  p({
    slug: "pc-gamer-sao-jose-dos-pinhais-montagem-upgrade",
    title: "Montagem e upgrade de PC gamer em São José dos Pinhais (guia 2026)",
    metaTitle: "PC Gamer em São José dos Pinhais: Montagem e Upgrade | SJP",
    metaDescription:
      "Montagem profissional de PC gamer em São José dos Pinhais com peças escolhidas, garantia e suporte. Upgrade de placa de vídeo, RAM e SSD em SJP.",
    excerpt:
      "Como montar um PC gamer equilibrado em SJP em 2026, faixas de preço, peças que valem a pena e armadilhas comuns.",
    category: "informatica",
    tags: ["pc gamer sjp", "montagem", "upgrade placa de vídeo"],
    publishedAt: "2026-05-02",
    readingTime: 10,
    sections: [
      { paragraphs: [
        "Em São José dos Pinhais, montar PC gamer está mais barato do que comprar pré-montado de loja. A gente acompanha o cliente da escolha das peças até a primeira partida — e a diferença de qualidade é gritante.",
      ]},
      { heading: "Faixas de preço realistas em SJP (2026)", paragraphs: [
        "Para configurar expectativas:",
      ], list: [
        "Entry (1080p 60fps em jogos competitivos): R$ 4.500 a R$ 5.800",
        "Mid (1080p 144fps + AAA no alto): R$ 6.500 a R$ 8.500",
        "High-end (1440p 144fps, RTX médio): R$ 9.000 a R$ 13.500",
        "Enthusiast (4K 60fps, RTX/path tracing): R$ 16.000 a R$ 28.000",
      ]},
      { heading: "Erros que arruínam um PC gamer", paragraphs: [
        "Fonte genérica/sem certificação 80 Plus (queima placa-mãe), placa-mãe muito barata para CPU potente (estoura VRM), gabinete sem fluxo de ar (thermal throttling), SSD QLC barato como sistema (vira lesma em 6 meses).",
      ]},
      { heading: "Upgrade vale ou tem que trocar?", paragraphs: [
        "Se a CPU é Intel 8ª/9ª/10ª geração ou Ryzen 1000/2000/3000 e a placa-mãe é decente, normalmente vale só trocar a GPU + SSD NVMe. Acima disso, plataforma nova compensa.",
      ]},
      { heading: "Mão de obra em SJP", paragraphs: [
        "Montagem completa com cable management, instalação de Windows, drivers, Steam, Discord e teste de estresse: R$ 280 a R$ 380. Upgrade só de GPU: R$ 120. Upgrade de processador + cooler: R$ 220.",
      ]},
    ],
    faqs: [
      { question: "Compro as peças onde?", answer: "Indicamos lojas com nota fiscal e garantia (Pichau, Kabum, Terabyte, Mineirão). Evite marketplace sem origem e peças usadas sem teste." },
      { question: "Vocês dão garantia da montagem?", answer: "Sim, 90 dias na mão de obra. Peças têm garantia de fábrica (1 a 3 anos)." },
    ],
    relatedServices: ["informatica"],
  }),

  p({
    slug: "configuracao-impressora-rede-sao-jose-dos-pinhais",
    title: "Configuração de impressora em rede em São José dos Pinhais (escritório e casa)",
    metaTitle: "Impressora em Rede em São José dos Pinhais | Configuração SJP",
    metaDescription:
      "Configuração profissional de impressora em rede (Wi-Fi e cabo) em São José dos Pinhais para casa e escritório. HP, Epson, Brother, Canon. R$ 120 a R$ 220.",
    excerpt:
      "Por que a impressora 'some' da rede toda semana e como deixar configurado de vez em SJP.",
    category: "informatica",
    tags: ["impressora sjp", "rede", "configuração"],
    publishedAt: "2026-05-03",
    readingTime: 7,
    sections: [
      { paragraphs: [
        "Toda semana atendemos chamados em SJP de 'impressora sumiu' — quase sempre é IP dinâmico mudando a cada reinicialização do roteador. Configuração feita certo dura anos.",
      ]},
      { heading: "Reservar IP no roteador (a chave de tudo)", paragraphs: [
        "No painel do roteador, reservamos o IP da impressora pelo MAC address. Toda vez que ela ligar, recebe o mesmo IP. Sem isso, qualquer mudança quebra o compartilhamento.",
      ]},
      { heading: "Driver oficial — não usar genérico", paragraphs: [
        "Drivers genéricos do Windows imprimem feio, sem duplex, sem escala. Sempre baixar do site do fabricante (HP, Epson, Brother, Canon, Samsung) o pacote completo.",
      ]},
      { heading: "Compartilhar entre Windows, Mac e celular", paragraphs: [
        "Configuramos AirPrint para iPhone/iPad, Mopria para Android, e descoberta automática (mDNS/Bonjour) para Mac. Tudo na mesma SSID Wi-Fi.",
      ]},
      { heading: "Multifuncional com scanner em rede", paragraphs: [
        "Habilitamos digitalização para pasta de rede, e-mail e nuvem (Drive/OneDrive). Em escritórios, isso elimina o uso de pendrive entre máquinas.",
      ]},
      { heading: "Preços em SJP", paragraphs: [
        "Configuração residencial (1 impressora, 3 dispositivos): R$ 120. Escritório pequeno (até 10 estações): R$ 220. Multifuncional com scanner para nuvem: R$ 180.",
      ]},
    ],
    faqs: [
      { question: "Atendem qual marca?", answer: "HP, Epson, Brother, Canon, Samsung, Lexmark, Pantum, Ricoh — laser, jato de tinta e tanque de tinta." },
      { question: "Vão até a empresa?", answer: "Sim, atendimento presencial em todo SJP. Visita técnica + configuração no mesmo dia." },
    ],
    relatedServices: ["informatica", "redes"],
  }),

  p({
    slug: "manutencao-preventiva-pc-empresa-sao-jose-dos-pinhais",
    title: "Manutenção preventiva de PC em empresas de São José dos Pinhais",
    metaTitle: "Manutenção Preventiva de PC em SJP | Empresas e Escritórios",
    metaDescription:
      "Plano de manutenção preventiva mensal de PCs e notebooks para empresas em São José dos Pinhais. Reduz chamados em até 70%. Contratos a partir de R$ 800/mês.",
    excerpt:
      "Por que manutenção preventiva sai mais barato que corretiva — com números reais de empresas em SJP.",
    category: "informatica",
    tags: ["manutenção preventiva sjp", "ti empresas", "contrato"],
    publishedAt: "2026-05-04",
    readingTime: 8,
    sections: [
      { paragraphs: [
        "Em uma empresa de logística em SJP com 18 estações, troca para manutenção preventiva mensal reduziu chamados de emergência em 71% no primeiro semestre. Custo total caiu R$ 14 mil no ano — e os funcionários pararam de reclamar de PC lento.",
      ]},
      { heading: "O que entra na preventiva mensal", paragraphs: [
        "Visita programada com checklist:",
      ], list: [
        "Limpeza física (interna + filtro do gabinete)",
        "Atualização de Windows, drivers, navegadores e Office",
        "Verificação de S.M.A.R.T. dos discos (alerta antes de queimar)",
        "Teste de backup e restore de amostragem",
        "Análise de log de eventos e antivírus",
        "Verificação de licenças e conformidade",
        "Checagem de switches, AP Wi-Fi e roteador",
        "Relatório mensal por escrito enviado para o gestor",
      ]},
      { heading: "Vantagens fiscais e operacionais", paragraphs: [
        "Contrato mensal vira despesa dedutível, equipamentos duram 30-40% mais e a empresa para de improvisar quando alguma coisa quebra. Para LGPD, ter um histórico de manutenção é prova de diligência.",
      ]},
      { heading: "Faixas de contrato em SJP", paragraphs: [
        "Pequena empresa (até 10 estações): R$ 800 a R$ 1.200/mês. Média (10 a 25): R$ 1.500 a R$ 2.500/mês. Grande (25-60): R$ 2.800 a R$ 4.500/mês. Inclui suporte remoto ilimitado e 2-4 visitas/mês.",
      ]},
    ],
    faqs: [
      { question: "Tem fidelidade?", answer: "Não. Contratos mensais sem multa rescisória. Você fica porque resolve, não porque está preso." },
      { question: "Atendem fora do horário comercial?", answer: "Sim, com adicional ou nos planos Profissional e Empresarial sem custo extra." },
      { question: "Atendem em qual região?", answer: "Toda São José dos Pinhais e Região Metropolitana de Curitiba." },
    ],
    relatedServices: ["informatica"],
  }),
];
