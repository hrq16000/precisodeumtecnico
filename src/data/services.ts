export interface ServiceData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  icon: string;
  benefits: string[];
  includedServices: string[];
  process: { step: number; title: string; description: string }[];
  pricing: { name: string; price: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedServices: string[];
  keywords: string[];
}

export const servicesData: Record<string, ServiceData> = {
  "informatica": {
    slug: "informatica",
    title: "Assistência Técnica em Informática",
    metaTitle: "Técnico em Informática Curitiba | Manutenção de Computadores 24h",
    metaDescription: "Assistência técnica em informática em Curitiba. Formatação, limpeza, upgrade, remoção de vírus. Técnico vai até você. Atendimento 24h via WhatsApp. A partir de R$ 99,99.",
    subtitle: "Manutenção e suporte especializado para seu computador",
    description: "Oferecemos serviços completos de manutenção em computadores desktop e workstations. Formatação, limpeza, upgrade de hardware, remoção de vírus e muito mais.",
    longDescription: "Nossa equipe de técnicos especializados em informática está pronta para resolver qualquer problema com seu computador. Realizamos desde manutenções preventivas até reparos complexos, sempre com peças de qualidade e garantia em todos os serviços. Atendemos residências e empresas em Curitiba e Região Metropolitana, com agendamento 24 horas via WhatsApp e atendimento presencial das 8h às 22h.",
    image: "service-computer.jpg",
    icon: "Monitor",
    benefits: [
      "Técnicos certificados e experientes",
      "Atendimento no local (residência ou empresa)",
      "Garantia de 90 dias a 1 ano",
      "Orçamento sem compromisso",
      "Peças originais e de qualidade",
      "Backup de dados incluído",
      "Suporte pós-atendimento",
      "Emissão de nota fiscal"
    ],
    includedServices: [
      "Formatação e instalação de Windows/Linux",
      "Limpeza interna e externa",
      "Remoção de vírus e malwares",
      "Upgrade de memória RAM",
      "Troca de HD por SSD",
      "Instalação de programas",
      "Configuração de rede e internet",
      "Backup e recuperação de dados",
      "Montagem de computadores",
      "Manutenção preventiva"
    ],
    process: [
      { step: 1, title: "Contato", description: "Entre em contato via WhatsApp ou telefone e descreva o problema" },
      { step: 2, title: "Agendamento", description: "Escolha o melhor horário para a visita técnica" },
      { step: 3, title: "Diagnóstico", description: "Técnico realiza diagnóstico completo no local" },
      { step: 4, title: "Orçamento", description: "Apresentamos orçamento detalhado sem compromisso" },
      { step: 5, title: "Execução", description: "Serviço realizado com qualidade e agilidade" },
      { step: 6, title: "Garantia", description: "Receba garantia por escrito do serviço realizado" }
    ],
    pricing: [
      { name: "Visita Técnica", price: "R$ 99,99", description: "Diagnóstico no local (até 30 min)" },
      { name: "Formatação Completa", price: "A partir de R$ 150,00", description: "Windows + drivers + programas básicos" },
      { name: "Limpeza Interna", price: "A partir de R$ 80,00", description: "Limpeza completa + troca de pasta térmica" },
      { name: "Upgrade SSD", price: "A partir de R$ 250,00", description: "SSD 240GB + instalação + migração" },
      { name: "Remoção de Vírus", price: "A partir de R$ 100,00", description: "Limpeza completa + antivírus" },
      { name: "Manutenção Preventiva", price: "A partir de R$ 120,00", description: "Limpeza + otimização + verificação" }
    ],
    faqs: [
      { question: "Quanto tempo demora uma formatação?", answer: "Uma formatação completa com instalação de Windows, drivers e programas básicos leva em média 2 a 3 horas, dependendo do tipo de disco (SSD é mais rápido que HD)." },
      { question: "Vocês fazem backup dos meus arquivos?", answer: "Sim! Antes de qualquer formatação ou procedimento que possa afetar seus dados, realizamos backup completo em mídia externa ou na nuvem." },
      { question: "Qual a garantia dos serviços?", answer: "Oferecemos garantia de 90 dias para serviços de software (formatação, limpeza de vírus) e até 1 ano para troca de peças e upgrades." },
      { question: "Atendem empresas?", answer: "Sim! Atendemos empresas de todos os portes com contratos de manutenção mensal ou atendimento avulso." },
      { question: "Vocês emitem nota fiscal?", answer: "Sim, emitimos nota fiscal para todos os serviços prestados." },
      { question: "O atendimento é mesmo 24 horas?", answer: "O agendamento via WhatsApp funciona 24 horas. O atendimento presencial é realizado das 8h às 22h." }
    ],
    relatedServices: ["notebooks", "redes", "servidores"],
    keywords: ["técnico em informática curitiba", "manutenção de computadores", "formatação curitiba", "conserto de pc", "upgrade computador", "limpeza de vírus"]
  },
  "notebooks": {
    slug: "notebooks",
    title: "Assistência Técnica em Notebooks",
    metaTitle: "Conserto de Notebook Curitiba | Assistência Técnica 24h",
    metaDescription: "Conserto de notebook em Curitiba. Troca de tela, teclado, bateria, upgrade SSD. Todas as marcas. Técnico vai até você. Atendimento 24h. A partir de R$ 99,99.",
    subtitle: "Reparo especializado para todas as marcas de notebooks",
    description: "Especialistas em conserto de notebooks de todas as marcas. Troca de tela, teclado, bateria, dobradiças, upgrade de memória e SSD. Atendimento em domicílio.",
    longDescription: "Somos especialistas em assistência técnica para notebooks de todas as marcas: Dell, HP, Lenovo, Acer, Asus, Samsung, Apple MacBook e outras. Nossa equipe possui experiência em diagnóstico e reparo de problemas de hardware e software, desde trocas de componentes até soluções complexas de placa-mãe. Trabalhamos com peças originais e compatíveis de alta qualidade, garantindo a durabilidade do reparo.",
    image: "service-notebook.jpg",
    icon: "Laptop",
    benefits: [
      "Especialistas em todas as marcas",
      "Peças originais e compatíveis",
      "Atendimento em domicílio",
      "Garantia de até 1 ano",
      "Diagnóstico gratuito",
      "Orçamento sem compromisso",
      "Técnicos certificados",
      "Backup de dados incluído"
    ],
    includedServices: [
      "Troca de tela LCD/LED",
      "Substituição de teclado",
      "Troca de bateria",
      "Reparo de dobradiças",
      "Upgrade de memória RAM",
      "Troca de HD por SSD",
      "Limpeza interna e troca de pasta térmica",
      "Reparo de conector de carga",
      "Formatação e instalação de sistema",
      "Recuperação de dados",
      "Reparo de placa-mãe"
    ],
    process: [
      { step: 1, title: "Contato", description: "Fale conosco via WhatsApp descrevendo o problema" },
      { step: 2, title: "Diagnóstico", description: "Avaliação técnica completa do equipamento" },
      { step: 3, title: "Orçamento", description: "Orçamento detalhado sem compromisso" },
      { step: 4, title: "Aprovação", description: "Você aprova e agendamos o reparo" },
      { step: 5, title: "Reparo", description: "Serviço executado com peças de qualidade" },
      { step: 6, title: "Entrega", description: "Notebook devolvido funcionando com garantia" }
    ],
    pricing: [
      { name: "Diagnóstico", price: "R$ 99,99", description: "Avaliação completa do notebook" },
      { name: "Troca de Tela", price: "A partir de R$ 350,00", description: "Inclui peça e mão de obra" },
      { name: "Troca de Teclado", price: "A partir de R$ 180,00", description: "Teclado compatível + instalação" },
      { name: "Troca de Bateria", price: "A partir de R$ 200,00", description: "Bateria nova + instalação" },
      { name: "Upgrade SSD", price: "A partir de R$ 280,00", description: "SSD + clonagem do sistema" },
      { name: "Limpeza Completa", price: "A partir de R$ 100,00", description: "Limpeza + pasta térmica" }
    ],
    faqs: [
      { question: "Vocês consertam todas as marcas?", answer: "Sim! Trabalhamos com Dell, HP, Lenovo, Acer, Asus, Samsung, Positivo, Apple MacBook e todas as outras marcas do mercado." },
      { question: "Quanto tempo leva um reparo?", answer: "Depende do serviço. Formatação e upgrades são feitos no mesmo dia. Troca de tela e teclado de 1 a 3 dias, dependendo da disponibilidade da peça." },
      { question: "As peças são originais?", answer: "Trabalhamos com peças originais e compatíveis de alta qualidade. Sempre informamos qual tipo de peça será utilizada no orçamento." },
      { question: "Vocês buscam e entregam?", answer: "Sim! Oferecemos serviço de coleta e entrega em Curitiba e região metropolitana." },
      { question: "Consertam MacBook?", answer: "Sim! Somos especializados também em notebooks Apple, incluindo troca de bateria, tela, teclado e SSD." }
    ],
    relatedServices: ["informatica", "celulares", "redes"],
    keywords: ["conserto notebook curitiba", "assistência técnica notebook", "troca tela notebook", "troca teclado notebook", "upgrade notebook", "reparo notebook"]
  },
  "cftv": {
    slug: "cftv",
    title: "Instalação de Câmeras e CFTV",
    metaTitle: "Instalação de Câmeras Curitiba | CFTV Residencial e Comercial 24h",
    metaDescription: "Instalação de câmeras de segurança em Curitiba. CFTV residencial e comercial. Câmeras IP, analógicas, DVR, NVR. Acesso remoto pelo celular. Orçamento grátis.",
    subtitle: "Segurança completa para sua residência ou empresa",
    description: "Instalação profissional de sistemas de CFTV e câmeras de segurança. Câmeras IP, analógicas, DVR, NVR. Configuração de acesso remoto pelo celular.",
    longDescription: "Proteja seu patrimônio com sistemas de videomonitoramento de última geração. Oferecemos soluções completas em CFTV para residências, comércios, condomínios e indústrias. Trabalhamos com as melhores marcas do mercado como Intelbras, Hikvision, Giga Security e outras. Realizamos desde a instalação de câmeras simples até sistemas complexos com múltiplas câmeras, gravadores DVR/NVR e acesso remoto.",
    image: "service-cftv.jpg",
    icon: "Camera",
    benefits: [
      "Projeto personalizado",
      "Equipamentos de alta qualidade",
      "Acesso remoto pelo celular",
      "Gravação em nuvem disponível",
      "Instalação profissional",
      "Garantia de 1 ano",
      "Suporte técnico incluso",
      "Manutenção preventiva"
    ],
    includedServices: [
      "Projeto de sistema CFTV",
      "Instalação de câmeras IP e analógicas",
      "Configuração de DVR/NVR",
      "Passagem de cabos estruturados",
      "Configuração de acesso remoto",
      "Instalação de câmeras Wi-Fi",
      "Câmeras com visão noturna",
      "Câmeras PTZ (movimento)",
      "Integração com alarmes",
      "Backup em nuvem",
      "Manutenção e limpeza de câmeras"
    ],
    process: [
      { step: 1, title: "Visita Técnica", description: "Avaliamos o local e suas necessidades de segurança" },
      { step: 2, title: "Projeto", description: "Elaboramos projeto personalizado com posicionamento ideal" },
      { step: 3, title: "Orçamento", description: "Apresentamos orçamento completo com equipamentos" },
      { step: 4, title: "Instalação", description: "Instalação profissional seguindo normas técnicas" },
      { step: 5, title: "Configuração", description: "Configuramos acesso remoto e treinamos você" },
      { step: 6, title: "Suporte", description: "Oferecemos suporte contínuo e manutenção" }
    ],
    pricing: [
      { name: "Kit 4 Câmeras", price: "A partir de R$ 1.200,00", description: "4 câmeras + DVR + instalação" },
      { name: "Kit 8 Câmeras", price: "A partir de R$ 2.000,00", description: "8 câmeras + DVR + instalação" },
      { name: "Câmera Avulsa", price: "A partir de R$ 250,00", description: "Câmera + instalação + configuração" },
      { name: "Câmera Wi-Fi", price: "A partir de R$ 200,00", description: "Câmera Wi-Fi + configuração app" },
      { name: "Manutenção", price: "A partir de R$ 150,00", description: "Limpeza + verificação + ajustes" },
      { name: "Acesso Remoto", price: "R$ 100,00", description: "Configuração acesso pelo celular" }
    ],
    faqs: [
      { question: "Quantas câmeras preciso para minha casa?", answer: "Depende do tamanho e layout do imóvel. Em média, casas precisam de 4 a 8 câmeras para cobrir entradas, garagem, quintal e áreas comuns. Fazemos visita técnica gratuita para dimensionar." },
      { question: "As câmeras gravam em HD?", answer: "Sim! Trabalhamos com câmeras Full HD (1080p) e 4K. Recomendamos no mínimo resolução HD para identificação de rostos e placas." },
      { question: "Consigo ver as câmeras pelo celular?", answer: "Sim! Configuramos acesso remoto para você assistir em tempo real e ver gravações pelo smartphone, tablet ou computador, de qualquer lugar do mundo." },
      { question: "Preciso de internet para as câmeras?", answer: "Para acesso remoto sim. Para gravação local, as câmeras funcionam mesmo sem internet, gravando no DVR/NVR." },
      { question: "Vocês fazem manutenção?", answer: "Sim! Oferecemos contratos de manutenção preventiva mensal ou trimestral, além de atendimento avulso quando necessário." }
    ],
    relatedServices: ["eletrica", "redes", "alarmes"],
    keywords: ["instalação câmeras curitiba", "cftv curitiba", "câmeras de segurança", "dvr nvr", "monitoramento remoto", "câmeras residenciais"]
  },
  "eletrica": {
    slug: "eletrica",
    title: "Serviços Elétricos",
    metaTitle: "Eletricista Curitiba 24h | Serviços Elétricos Residenciais e Comerciais",
    metaDescription: "Eletricista em Curitiba. Instalações elétricas, reparos, tomadas, disjuntores, iluminação. Atendimento residencial e comercial. 24h via WhatsApp. NR-10.",
    subtitle: "Instalações elétricas seguras e profissionais",
    description: "Serviços elétricos residenciais e comerciais realizados por profissionais habilitados. Instalações, reparos, manutenção preventiva e corretiva.",
    longDescription: "Conte com eletricistas qualificados e habilitados conforme NR-10 para todos os serviços elétricos em sua residência ou empresa. Realizamos desde pequenos reparos como troca de tomadas e interruptores até instalações completas, quadros de distribuição, aterramento e projetos elétricos. Trabalhamos com segurança e seguindo todas as normas técnicas da ABNT.",
    image: "service-eletrica.jpg",
    icon: "Zap",
    benefits: [
      "Profissionais com NR-10",
      "Materiais de primeira qualidade",
      "Seguimos normas ABNT",
      "Garantia nos serviços",
      "Atendimento de emergência",
      "Orçamento sem compromisso",
      "Emissão de nota fiscal",
      "Projetos elétricos"
    ],
    includedServices: [
      "Instalação de tomadas e interruptores",
      "Troca de disjuntores",
      "Instalação de chuveiros elétricos",
      "Quadros de distribuição",
      "Aterramento elétrico",
      "Instalação de iluminação",
      "Troca de fiação",
      "Instalação de ventiladores de teto",
      "Instalação de ar-condicionado (parte elétrica)",
      "Manutenção preventiva",
      "Laudos e projetos elétricos"
    ],
    process: [
      { step: 1, title: "Solicitação", description: "Entre em contato descrevendo o serviço necessário" },
      { step: 2, title: "Avaliação", description: "Técnico avalia a situação e necessidades" },
      { step: 3, title: "Orçamento", description: "Orçamento detalhado com materiais e mão de obra" },
      { step: 4, title: "Execução", description: "Serviço executado seguindo normas de segurança" },
      { step: 5, title: "Teste", description: "Testes completos de funcionamento" },
      { step: 6, title: "Garantia", description: "Garantia do serviço por escrito" }
    ],
    pricing: [
      { name: "Visita Técnica", price: "R$ 99,99", description: "Avaliação e diagnóstico" },
      { name: "Troca de Tomada", price: "A partir de R$ 50,00", description: "Tomada + instalação" },
      { name: "Instalação Chuveiro", price: "A partir de R$ 120,00", description: "Instalação completa" },
      { name: "Troca de Disjuntor", price: "A partir de R$ 80,00", description: "Disjuntor + instalação" },
      { name: "Ponto de Iluminação", price: "A partir de R$ 100,00", description: "Novo ponto de luz" },
      { name: "Quadro Elétrico", price: "A partir de R$ 500,00", description: "Montagem + instalação" }
    ],
    faqs: [
      { question: "Os eletricistas são qualificados?", answer: "Sim! Todos os nossos eletricistas possuem curso NR-10 (Segurança em Instalações Elétricas) e experiência comprovada." },
      { question: "Vocês fazem instalação de ar-condicionado?", answer: "Fazemos a parte elétrica (ponto de energia, disjuntor dedicado). A instalação do equipamento em si é feita por técnicos de refrigeração." },
      { question: "Atendem emergências?", answer: "Sim! Temos atendimento de emergência para situações como falta de energia, curto-circuito e outros problemas urgentes." },
      { question: "Fornecem os materiais?", answer: "Sim, fornecemos todos os materiais necessários de primeira qualidade. Você também pode fornecer os materiais se preferir." },
      { question: "Fazem projetos elétricos?", answer: "Sim! Elaboramos projetos elétricos para obras novas, reformas e regularização junto à concessionária." }
    ],
    relatedServices: ["ar-condicionado", "iluminacao", "redes"],
    keywords: ["eletricista curitiba", "serviços elétricos", "instalação elétrica", "manutenção elétrica", "tomadas disjuntores", "eletricista 24h"]
  },
  "redes": {
    slug: "redes",
    title: "Redes e Wi-Fi",
    metaTitle: "Instalação de Redes e Wi-Fi Curitiba | Cabeamento Estruturado",
    metaDescription: "Instalação de redes em Curitiba. Cabeamento estruturado, configuração Wi-Fi, roteadores mesh. Residencial e empresarial. Técnico especializado. 24h.",
    subtitle: "Conectividade profissional para sua casa ou empresa",
    description: "Instalação e configuração de redes com e sem fio. Cabeamento estruturado, roteadores, switches, access points e sistemas mesh.",
    longDescription: "Garanta uma conexão de internet estável e rápida em todos os ambientes. Oferecemos soluções completas em infraestrutura de redes para residências e empresas, desde a instalação de um simples roteador Wi-Fi até projetos complexos de cabeamento estruturado. Trabalhamos com as melhores marcas como TP-Link, Ubiquiti, Intelbras, Cisco e outras.",
    image: "service-redes.jpg",
    icon: "Wifi",
    benefits: [
      "Cobertura Wi-Fi em todos os ambientes",
      "Cabeamento organizado e certificado",
      "Velocidade máxima da sua internet",
      "Segurança da rede",
      "Equipamentos de qualidade",
      "Garantia de 1 ano",
      "Suporte técnico incluso",
      "Projeto personalizado"
    ],
    includedServices: [
      "Instalação de roteadores",
      "Configuração de Wi-Fi",
      "Sistemas Mesh",
      "Cabeamento estruturado Cat5e/Cat6",
      "Instalação de switches",
      "Access Points profissionais",
      "Configuração de rede empresarial",
      "VPN e segurança",
      "Repetidores de sinal",
      "Passagem de cabos",
      "Rack e organização de cabos"
    ],
    process: [
      { step: 1, title: "Análise", description: "Avaliamos o ambiente e suas necessidades" },
      { step: 2, title: "Projeto", description: "Elaboramos projeto de rede ideal" },
      { step: 3, title: "Orçamento", description: "Orçamento com equipamentos e instalação" },
      { step: 4, title: "Instalação", description: "Instalação profissional e organizada" },
      { step: 5, title: "Configuração", description: "Configuração de todos os dispositivos" },
      { step: 6, title: "Teste", description: "Teste de velocidade e cobertura" }
    ],
    pricing: [
      { name: "Configuração Roteador", price: "A partir de R$ 80,00", description: "Instalação + configuração" },
      { name: "Sistema Mesh", price: "A partir de R$ 400,00", description: "Kit mesh + instalação" },
      { name: "Ponto de Rede", price: "A partir de R$ 120,00", description: "Cabo + tomada RJ45" },
      { name: "Rack Pequeno", price: "A partir de R$ 350,00", description: "Rack + organização" },
      { name: "Access Point", price: "A partir de R$ 300,00", description: "AP + instalação + configuração" },
      { name: "Cabeamento Completo", price: "Sob consulta", description: "Projeto personalizado" }
    ],
    faqs: [
      { question: "O que é sistema Mesh?", answer: "É um sistema de Wi-Fi com múltiplos roteadores que trabalham juntos para criar uma rede única com cobertura em toda a casa, sem quedas ao se movimentar entre ambientes." },
      { question: "Qual a diferença de Cat5e e Cat6?", answer: "Cat5e suporta até 1 Gbps e é suficiente para a maioria das residências. Cat6 suporta até 10 Gbps e é recomendado para empresas e futuras expansões." },
      { question: "Vocês configuram a rede para ser segura?", answer: "Sim! Configuramos senhas fortes, criptografia WPA3, rede de visitantes separada e outras medidas de segurança." },
      { question: "Atendem empresas?", answer: "Sim! Temos experiência em projetos de rede corporativa com switches gerenciáveis, VLANs, VPN e outras tecnologias empresariais." },
      { question: "Minha internet está lenta, vocês resolvem?", answer: "Sim! Fazemos diagnóstico para identificar se o problema é no provedor, no roteador ou na infraestrutura da rede interna." }
    ],
    relatedServices: ["informatica", "cftv", "servidores"],
    keywords: ["instalação rede curitiba", "wi-fi curitiba", "cabeamento estruturado", "roteador mesh", "técnico em redes", "configuração wi-fi"]
  },
  "ar-condicionado": {
    slug: "ar-condicionado",
    title: "Ar-Condicionado",
    metaTitle: "Instalação de Ar-Condicionado Curitiba | Limpeza e Manutenção 24h",
    metaDescription: "Instalação de ar-condicionado em Curitiba. Limpeza, manutenção, recarga de gás. Split, janela, cassete. Todas as marcas. Técnico refrigerista. A partir de R$ 99,99.",
    subtitle: "Climatização profissional para seu conforto",
    description: "Instalação, manutenção e limpeza de ar-condicionado. Atendemos todas as marcas e modelos. Split, janela, cassete, multi-split.",
    longDescription: "Garanta o conforto térmico da sua casa ou empresa com nossos serviços especializados em ar-condicionado. Contamos com técnicos refrigeristas certificados para instalação, manutenção preventiva e corretiva de aparelhos de todas as marcas como LG, Samsung, Midea, Springer, Consul, Elgin e outras. Trabalhamos com splits, janela, cassete, piso-teto e multi-split.",
    image: "service-arcondicionado.jpg",
    icon: "Wind",
    benefits: [
      "Técnicos refrigeristas certificados",
      "Todas as marcas e modelos",
      "Garantia nos serviços",
      "Materiais de qualidade",
      "Instalação seguindo normas",
      "Higienização profissional",
      "Atendimento em domicílio",
      "Orçamento sem compromisso"
    ],
    includedServices: [
      "Instalação de split",
      "Instalação de ar janela",
      "Manutenção preventiva",
      "Limpeza e higienização",
      "Recarga de gás refrigerante",
      "Troca de compressor",
      "Reparo de placa eletrônica",
      "Instalação de dutos",
      "Desinstalação e reinstalação",
      "Multi-split",
      "Cassete e piso-teto"
    ],
    process: [
      { step: 1, title: "Contato", description: "Descreva o serviço necessário via WhatsApp" },
      { step: 2, title: "Avaliação", description: "Técnico avalia o local e o equipamento" },
      { step: 3, title: "Orçamento", description: "Orçamento completo com peças e mão de obra" },
      { step: 4, title: "Agendamento", description: "Escolha o melhor dia e horário" },
      { step: 5, title: "Execução", description: "Serviço realizado por técnico especializado" },
      { step: 6, title: "Teste", description: "Teste de funcionamento e orientações" }
    ],
    pricing: [
      { name: "Limpeza Split", price: "A partir de R$ 120,00", description: "Limpeza completa + bactericida" },
      { name: "Instalação Split 9000", price: "A partir de R$ 400,00", description: "Instalação até 3m de tubulação" },
      { name: "Instalação Split 12000", price: "A partir de R$ 450,00", description: "Instalação até 3m de tubulação" },
      { name: "Recarga de Gás", price: "A partir de R$ 250,00", description: "R410a ou R22 + mão de obra" },
      { name: "Manutenção Preventiva", price: "A partir de R$ 150,00", description: "Limpeza + verificação completa" },
      { name: "Desinstalação", price: "A partir de R$ 200,00", description: "Retirada com recolhimento de gás" }
    ],
    faqs: [
      { question: "Com que frequência devo limpar o ar-condicionado?", answer: "Recomendamos limpeza a cada 6 meses para uso residencial e a cada 3 meses para uso comercial ou em ambientes com muita poeira." },
      { question: "Vocês instalam ar-condicionado em apartamento?", answer: "Sim! Fazemos instalações em apartamentos, casas e estabelecimentos comerciais, seguindo as normas do condomínio quando aplicável." },
      { question: "Qual a diferença entre manutenção e limpeza?", answer: "A limpeza foca na higienização dos filtros e componentes. A manutenção inclui verificação de gás, parte elétrica, componentes e funcionamento geral." },
      { question: "Como sei se meu ar precisa de gás?", answer: "Sinais como ar não gelando bem, formação de gelo na unidade interna ou externa e aumento no consumo de energia podem indicar falta de gás." },
      { question: "Vocês trabalham com todas as marcas?", answer: "Sim! Atendemos LG, Samsung, Midea, Springer, Consul, Elgin, Fujitsu, Daikin e todas as outras marcas do mercado." }
    ],
    relatedServices: ["eletrica", "manutencao-predial", "refrigeracao"],
    keywords: ["instalação ar condicionado curitiba", "limpeza ar condicionado", "manutenção ar condicionado", "split curitiba", "refrigerista curitiba", "recarga gás ar"]
  },
  "celulares": {
    slug: "celulares",
    title: "Assistência Técnica Celulares",
    metaTitle: "Conserto de Celular Curitiba | Troca de Tela iPhone Samsung 24h",
    metaDescription: "Conserto de celular em Curitiba. Troca de tela, bateria, conector de carga. iPhone, Samsung, Motorola, Xiaomi. Atendimento rápido. A partir de R$ 99,99.",
    subtitle: "Reparo profissional para smartphones e tablets",
    description: "Assistência técnica especializada em celulares e tablets de todas as marcas. Troca de tela, bateria, conector de carga, alto-falante e muito mais.",
    longDescription: "Oferecemos serviços completos de assistência técnica para smartphones e tablets de todas as marcas: iPhone, Samsung, Motorola, Xiaomi, LG, Asus e outras. Nossa equipe é especializada em reparos de hardware e software, utilizando peças de qualidade com garantia. Realizamos desde trocas simples de película até reparos complexos de placa.",
    image: "service-celular.jpg",
    icon: "Smartphone",
    benefits: [
      "Atendimento rápido (mesmo dia)",
      "Peças de qualidade com garantia",
      "Técnicos especializados",
      "Todas as marcas",
      "Diagnóstico gratuito",
      "Garantia de 90 dias a 1 ano",
      "Backup de dados",
      "Orçamento sem compromisso"
    ],
    includedServices: [
      "Troca de tela/display",
      "Substituição de bateria",
      "Troca de conector de carga",
      "Reparo de alto-falante",
      "Troca de câmera",
      "Reparo de microfone",
      "Troca de botões",
      "Reparo de placa",
      "Remoção de vírus",
      "Recuperação de dados",
      "Desbloqueio de conta Google/iCloud"
    ],
    process: [
      { step: 1, title: "Contato", description: "Descreva o problema do seu celular" },
      { step: 2, title: "Diagnóstico", description: "Avaliação gratuita do aparelho" },
      { step: 3, title: "Orçamento", description: "Orçamento detalhado sem compromisso" },
      { step: 4, title: "Aprovação", description: "Você aprova e iniciamos o reparo" },
      { step: 5, title: "Reparo", description: "Conserto realizado com peças de qualidade" },
      { step: 6, title: "Teste", description: "Testes completos antes da entrega" }
    ],
    pricing: [
      { name: "Troca Tela iPhone", price: "A partir de R$ 250,00", description: "Display + instalação + garantia" },
      { name: "Troca Tela Samsung", price: "A partir de R$ 200,00", description: "Display + instalação + garantia" },
      { name: "Troca de Bateria", price: "A partir de R$ 100,00", description: "Bateria nova + instalação" },
      { name: "Conector de Carga", price: "A partir de R$ 120,00", description: "Peça + mão de obra" },
      { name: "Troca de Câmera", price: "A partir de R$ 150,00", description: "Câmera + instalação" },
      { name: "Diagnóstico", price: "Grátis", description: "Avaliação do problema" }
    ],
    faqs: [
      { question: "Quanto tempo leva para trocar uma tela?", answer: "A troca de tela geralmente leva de 30 minutos a 2 horas, dependendo do modelo. Em muitos casos, o serviço é feito no mesmo dia." },
      { question: "As peças são originais?", answer: "Trabalhamos com peças originais, OEM e compatíveis de alta qualidade. Sempre informamos qual tipo de peça será utilizada." },
      { question: "Vocês fazem backup dos dados?", answer: "Sim! Sempre que possível, fazemos backup dos dados antes de qualquer procedimento que possa afetá-los." },
      { question: "Consertam iPhone?", answer: "Sim! Somos especializados em reparos de iPhone, desde o modelo 6 até os mais recentes." },
      { question: "Meu celular caiu na água, tem conserto?", answer: "Depende do dano causado. Fazemos diagnóstico completo e tentamos recuperar o aparelho. Quanto antes trouxer, maiores as chances de sucesso." }
    ],
    relatedServices: ["notebooks", "tablets", "games"],
    keywords: ["conserto celular curitiba", "troca tela iphone", "troca tela samsung", "assistência técnica celular", "reparo smartphone", "bateria celular"]
  },
  "games": {
    slug: "games",
    title: "Conserto de Videogames",
    metaTitle: "Conserto de Videogame Curitiba | PS5 Xbox Switch 24h",
    metaDescription: "Conserto de videogame em Curitiba. PlayStation, Xbox, Nintendo Switch. Troca de HD, limpeza, reparo HDMI. Técnico especializado. A partir de R$ 99,99.",
    subtitle: "Assistência técnica especializada em consoles",
    description: "Reparo profissional de videogames: PlayStation, Xbox, Nintendo Switch e consoles retrô. Troca de HD/SSD, limpeza, reparo de HDMI e muito mais.",
    longDescription: "Somos especialistas em assistência técnica para videogames de todas as gerações. Realizamos reparos em PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S, Nintendo Switch e consoles retrô. Nossa equipe possui experiência em diagnóstico e reparo de problemas como superaquecimento, troca de pasta térmica, reparo de porta HDMI, troca de HD/SSD e muito mais.",
    image: "service-games.jpg",
    icon: "Gamepad2",
    benefits: [
      "Especialistas em todas as marcas",
      "Peças de reposição originais",
      "Diagnóstico detalhado",
      "Garantia nos reparos",
      "Atendimento rápido",
      "Técnicos gamers",
      "Orçamento gratuito",
      "Backup de saves"
    ],
    includedServices: [
      "Limpeza e troca de pasta térmica",
      "Troca de HD por SSD",
      "Reparo de porta HDMI",
      "Troca de leitor de disco",
      "Reparo de fonte de alimentação",
      "Troca de ventoinhas",
      "Reparo de controles",
      "Atualização de firmware",
      "Desbloqueio (onde legal)",
      "Manutenção preventiva",
      "Reparo de placa-mãe"
    ],
    process: [
      { step: 1, title: "Contato", description: "Descreva o problema do seu console" },
      { step: 2, title: "Diagnóstico", description: "Avaliação técnica completa" },
      { step: 3, title: "Orçamento", description: "Orçamento detalhado do reparo" },
      { step: 4, title: "Aprovação", description: "Você aprova o serviço" },
      { step: 5, title: "Reparo", description: "Conserto por técnico especializado" },
      { step: 6, title: "Teste", description: "Testes extensivos de funcionamento" }
    ],
    pricing: [
      { name: "Limpeza + Pasta Térmica", price: "A partir de R$ 150,00", description: "Limpeza completa + pasta de qualidade" },
      { name: "Troca de HD por SSD", price: "A partir de R$ 300,00", description: "SSD + instalação + sistema" },
      { name: "Reparo HDMI PS4/PS5", price: "A partir de R$ 200,00", description: "Porta HDMI + mão de obra" },
      { name: "Reparo Controle", price: "A partir de R$ 80,00", description: "Diagnóstico + reparo" },
      { name: "Troca Leitor de Disco", price: "A partir de R$ 250,00", description: "Leitor + instalação" },
      { name: "Diagnóstico", price: "R$ 50,00", description: "Avaliação completa" }
    ],
    faqs: [
      { question: "Meu PS4/PS5 está superaquecendo, o que pode ser?", answer: "Geralmente é acúmulo de poeira ou pasta térmica ressecada. Recomendamos limpeza e troca de pasta térmica a cada 1-2 anos de uso intenso." },
      { question: "Vocês consertam Nintendo Switch?", answer: "Sim! Fazemos reparos como troca de Joy-Con, reparo de trilho, troca de tela, bateria e outros componentes." },
      { question: "Quanto tempo leva o reparo?", answer: "Depende do problema. Serviços como limpeza são feitos no mesmo dia. Reparos de placa podem levar de 3 a 7 dias." },
      { question: "Consertam controles?", answer: "Sim! Fazemos reparos em controles de PS4, PS5, Xbox e Nintendo, incluindo troca de analógicos, botões e baterias." },
      { question: "Vale a pena trocar o HD por SSD?", answer: "Sim! O SSD reduz drasticamente o tempo de carregamento dos jogos e do sistema. É um upgrade muito recomendado." }
    ],
    relatedServices: ["informatica", "notebooks", "celulares"],
    keywords: ["conserto videogame curitiba", "reparo ps4 ps5", "assistência xbox", "nintendo switch curitiba", "troca pasta térmica console", "reparo hdmi"]
  },
  "impressoras": {
    slug: "impressoras",
    title: "Manutenção de Impressoras",
    metaTitle: "Conserto de Impressora Curitiba | Manutenção HP Epson Brother 24h",
    metaDescription: "Conserto de impressora em Curitiba. HP, Epson, Brother, Canon. Limpeza de cabeça, troca de peças, configuração. Jato de tinta e laser. A partir de R$ 99,99.",
    subtitle: "Assistência técnica para impressoras e multifuncionais",
    description: "Manutenção e reparo de impressoras jato de tinta e laser. Limpeza, troca de peças, configuração em rede. Todas as marcas.",
    longDescription: "Oferecemos serviços completos de manutenção para impressoras e multifuncionais de todas as marcas: HP, Epson, Brother, Canon, Samsung, Lexmark e outras. Realizamos desde limpeza de cabeças de impressão até reparos complexos, instalação em rede e configuração de impressão sem fio.",
    image: "service-computer.jpg",
    icon: "Printer",
    benefits: [
      "Todas as marcas e modelos",
      "Jato de tinta e laser",
      "Peças originais e compatíveis",
      "Configuração em rede",
      "Atendimento em domicílio",
      "Garantia nos serviços",
      "Orçamento gratuito",
      "Suporte técnico"
    ],
    includedServices: [
      "Limpeza de cabeças de impressão",
      "Troca de cartuchos e toners",
      "Reparo de mecanismo de papel",
      "Configuração Wi-Fi",
      "Instalação em rede",
      "Troca de fusor (laser)",
      "Reparo de scanner",
      "Atualização de firmware",
      "Bulk ink",
      "Manutenção preventiva"
    ],
    process: [
      { step: 1, title: "Contato", description: "Informe marca, modelo e problema" },
      { step: 2, title: "Diagnóstico", description: "Avaliação técnica do equipamento" },
      { step: 3, title: "Orçamento", description: "Orçamento com peças e mão de obra" },
      { step: 4, title: "Reparo", description: "Manutenção realizada por técnico" },
      { step: 5, title: "Teste", description: "Testes de impressão e digitalização" },
      { step: 6, title: "Entrega", description: "Equipamento funcionando com garantia" }
    ],
    pricing: [
      { name: "Limpeza Cabeça", price: "A partir de R$ 80,00", description: "Limpeza química completa" },
      { name: "Configuração Wi-Fi", price: "A partir de R$ 60,00", description: "Configuração + teste" },
      { name: "Troca de Fusor", price: "A partir de R$ 200,00", description: "Fusor + instalação (laser)" },
      { name: "Bulk Ink", price: "A partir de R$ 250,00", description: "Sistema + instalação" },
      { name: "Manutenção Geral", price: "A partir de R$ 150,00", description: "Limpeza + verificação completa" },
      { name: "Diagnóstico", price: "R$ 50,00", description: "Avaliação do problema" }
    ],
    faqs: [
      { question: "Minha impressora está com listras na impressão, o que pode ser?", answer: "Geralmente é entupimento das cabeças de impressão. Uma limpeza profissional resolve na maioria dos casos." },
      { question: "Vale a pena consertar impressora antiga?", answer: "Depende do custo do reparo versus o valor de uma nova. Fazemos avaliação honesta e indicamos a melhor opção." },
      { question: "Vocês instalam bulk ink?", answer: "Sim! Instalamos sistemas de tinta contínua (bulk ink) em impressoras compatíveis, reduzindo muito o custo de impressão." },
      { question: "Atendem empresas?", answer: "Sim! Oferecemos contratos de manutenção para empresas com múltiplas impressoras." },
      { question: "Configuram impressora em rede?", answer: "Sim! Configuramos impressoras para funcionar em rede local e via Wi-Fi, permitindo impressão de qualquer dispositivo." }
    ],
    relatedServices: ["informatica", "redes", "servidores"],
    keywords: ["conserto impressora curitiba", "manutenção impressora", "limpeza cabeça impressão", "impressora hp epson", "bulk ink curitiba", "configuração impressora"]
  },
  "servidores": {
    slug: "servidores",
    title: "Servidores e Data Centers",
    metaTitle: "Manutenção de Servidores Curitiba | TI Empresarial 24h",
    metaDescription: "Manutenção de servidores em Curitiba. Instalação, configuração, backup, virtualização. Windows Server, Linux. Suporte TI empresarial. 24h.",
    subtitle: "Infraestrutura de TI para empresas",
    description: "Instalação, configuração e manutenção de servidores físicos e virtuais. Windows Server, Linux, virtualização, backup e disaster recovery.",
    longDescription: "Oferecemos soluções completas em infraestrutura de servidores para empresas de todos os portes. Nossa equipe de especialistas em TI realiza desde a instalação de servidores de arquivos simples até projetos complexos de virtualização, alta disponibilidade e disaster recovery. Trabalhamos com Windows Server, Linux, VMware, Hyper-V e soluções em nuvem.",
    image: "service-computer.jpg",
    icon: "Server",
    benefits: [
      "Especialistas certificados",
      "Suporte 24/7 disponível",
      "Soluções escaláveis",
      "Backup e disaster recovery",
      "Virtualização",
      "Monitoramento proativo",
      "SLA personalizado",
      "Documentação completa"
    ],
    includedServices: [
      "Instalação de servidores",
      "Configuração Windows Server",
      "Configuração Linux",
      "Active Directory",
      "Virtualização VMware/Hyper-V",
      "Backup e restore",
      "Firewall e segurança",
      "VPN corporativa",
      "Monitoramento de serviços",
      "Disaster recovery",
      "Migração para nuvem"
    ],
    process: [
      { step: 1, title: "Análise", description: "Levantamento das necessidades da empresa" },
      { step: 2, title: "Projeto", description: "Elaboração de projeto de infraestrutura" },
      { step: 3, title: "Proposta", description: "Proposta técnica e comercial detalhada" },
      { step: 4, title: "Implementação", description: "Instalação e configuração" },
      { step: 5, title: "Testes", description: "Testes de funcionamento e performance" },
      { step: 6, title: "Suporte", description: "Suporte contínuo e monitoramento" }
    ],
    pricing: [
      { name: "Consultoria", price: "A partir de R$ 200,00/h", description: "Análise e projeto" },
      { name: "Instalação Servidor", price: "A partir de R$ 500,00", description: "Instalação + configuração básica" },
      { name: "Active Directory", price: "A partir de R$ 800,00", description: "Implementação completa" },
      { name: "Backup Empresarial", price: "A partir de R$ 600,00", description: "Configuração + automação" },
      { name: "Suporte Mensal", price: "A partir de R$ 500,00/mês", description: "Suporte + monitoramento" },
      { name: "Virtualização", price: "Sob consulta", description: "Projeto personalizado" }
    ],
    faqs: [
      { question: "Vocês atendem pequenas empresas?", answer: "Sim! Temos soluções para empresas de todos os portes, desde um servidor de arquivos simples até infraestruturas complexas." },
      { question: "Oferecem suporte 24/7?", answer: "Sim! Para clientes com contrato de suporte, oferecemos atendimento 24 horas, 7 dias por semana para emergências." },
      { question: "Trabalham com nuvem?", answer: "Sim! Oferecemos migração e gestão de serviços em nuvem como AWS, Azure e Google Cloud." },
      { question: "Fazem backup em nuvem?", answer: "Sim! Implementamos soluções de backup local e em nuvem, garantindo a segurança dos dados da empresa." },
      { question: "Qual o tempo de resposta para emergências?", answer: "Para clientes com contrato, o tempo de resposta é de até 4 horas para emergências críticas." }
    ],
    relatedServices: ["redes", "informatica", "cftv"],
    keywords: ["servidor curitiba", "manutenção servidor", "ti empresarial", "windows server", "linux servidor", "virtualização curitiba"]
  },
  "manutencao-predial": {
    slug: "manutencao-predial",
    title: "Manutenção Predial",
    metaTitle: "Manutenção Predial Curitiba | Serviços para Condomínios e Empresas",
    metaDescription: "Manutenção predial em Curitiba. Elétrica, hidráulica, pintura, reparos gerais. Condomínios e empresas. Contrato mensal disponível. Orçamento grátis.",
    subtitle: "Soluções completas para seu condomínio ou empresa",
    description: "Serviços de manutenção predial para condomínios, empresas e prédios comerciais. Elétrica, hidráulica, pintura, reparos gerais e muito mais.",
    longDescription: "Oferecemos serviços completos de manutenção predial para condomínios residenciais, comerciais e empresas. Nossa equipe multidisciplinar atua em elétrica, hidráulica, pintura, pequenos reparos, jardinagem e outras necessidades do dia a dia de um edifício. Disponibilizamos contratos mensais com atendimento programado ou avulso.",
    image: "service-eletrica.jpg",
    icon: "Building",
    benefits: [
      "Equipe multidisciplinar",
      "Contrato mensal disponível",
      "Atendimento programado",
      "Emergências 24h",
      "Relatórios de manutenção",
      "Preços competitivos",
      "Profissionais uniformizados",
      "Garantia nos serviços"
    ],
    includedServices: [
      "Manutenção elétrica predial",
      "Manutenção hidráulica",
      "Pintura e reparos",
      "Manutenção de bombas",
      "Limpeza de caixas d'água",
      "Manutenção de portões",
      "Jardinagem",
      "Desentupimento",
      "Pequenos reparos",
      "Manutenção de elevadores (parceria)",
      "Limpeza de fachadas"
    ],
    process: [
      { step: 1, title: "Visita", description: "Visita técnica para avaliação do prédio" },
      { step: 2, title: "Diagnóstico", description: "Levantamento das necessidades" },
      { step: 3, title: "Proposta", description: "Proposta de contrato ou serviço avulso" },
      { step: 4, title: "Execução", description: "Serviços realizados conforme cronograma" },
      { step: 5, title: "Relatório", description: "Relatório mensal de manutenções" },
      { step: 6, title: "Acompanhamento", description: "Acompanhamento contínuo" }
    ],
    pricing: [
      { name: "Contrato Básico", price: "A partir de R$ 800,00/mês", description: "Visitas semanais + emergências" },
      { name: "Contrato Completo", price: "A partir de R$ 1.500,00/mês", description: "Manutenção completa + materiais" },
      { name: "Visita Avulsa", price: "A partir de R$ 150,00", description: "Atendimento pontual" },
      { name: "Emergência", price: "A partir de R$ 200,00", description: "Atendimento urgente" },
      { name: "Limpeza Caixa D'água", price: "A partir de R$ 300,00", description: "Limpeza + certificado" },
      { name: "Desentupimento", price: "A partir de R$ 150,00", description: "Desentupimento simples" }
    ],
    faqs: [
      { question: "Vocês atendem condomínios?", answer: "Sim! Atendemos condomínios residenciais e comerciais de todos os portes, com contratos mensais ou serviços avulsos." },
      { question: "Como funciona o contrato mensal?", answer: "O contrato inclui visitas programadas (semanal ou quinzenal), atendimento de emergências e relatórios de manutenção. Os valores variam conforme o porte do prédio." },
      { question: "Atendem emergências?", answer: "Sim! Clientes com contrato têm atendimento prioritário. Para avulsos, verificamos disponibilidade de acordo com a urgência." },
      { question: "Fazem manutenção de elevadores?", answer: "Temos parceria com empresa especializada em elevadores. Podemos intermediar o serviço." },
      { question: "Emitem relatórios?", answer: "Sim! Fornecemos relatórios mensais detalhados de todos os serviços realizados, ideal para prestação de contas do condomínio." }
    ],
    relatedServices: ["eletrica", "ar-condicionado", "cftv"],
    keywords: ["manutenção predial curitiba", "manutenção condomínio", "serviços prediais", "zelador curitiba", "manutenção prédio", "facilities"]
  },
  "servicos-gerais": {
    slug: "servicos-gerais",
    title: "Serviços Gerais",
    metaTitle: "Marido de Aluguel Curitiba | Serviços Gerais e Pequenos Reparos 24h",
    metaDescription: "Serviços gerais em Curitiba. Montagem de móveis, pequenos reparos, hidráulica básica, fixação de objetos. Marido de aluguel. A partir de R$ 99,99.",
    subtitle: "Pequenos reparos e serviços para sua casa",
    description: "Serviços gerais e pequenos reparos residenciais. Montagem de móveis, hidráulica básica, fixação de objetos, instalações diversas.",
    longDescription: "Precisa de ajuda com pequenos reparos e serviços domésticos? Nossa equipe de profissionais realiza diversos serviços gerais como montagem de móveis, instalação de prateleiras, hidráulica básica, troca de torneiras, fixação de quadros e TVs, entre outros. Serviço de 'marido de aluguel' com qualidade e preço justo.",
    image: "service-eletrica.jpg",
    icon: "Wrench",
    benefits: [
      "Profissionais experientes",
      "Ferramentas próprias",
      "Atendimento rápido",
      "Preço justo",
      "Garantia nos serviços",
      "Pontualidade",
      "Limpeza após o serviço",
      "Orçamento sem compromisso"
    ],
    includedServices: [
      "Montagem de móveis",
      "Instalação de prateleiras",
      "Fixação de TVs na parede",
      "Troca de torneiras",
      "Desentupimento simples",
      "Instalação de cortinas",
      "Fixação de quadros",
      "Troca de fechaduras",
      "Instalação de varais",
      "Pequenos reparos em geral",
      "Furação e fixação"
    ],
    process: [
      { step: 1, title: "Contato", description: "Descreva o serviço necessário" },
      { step: 2, title: "Orçamento", description: "Orçamento rápido por WhatsApp" },
      { step: 3, title: "Agendamento", description: "Escolha o melhor horário" },
      { step: 4, title: "Execução", description: "Profissional realiza o serviço" },
      { step: 5, title: "Conferência", description: "Você confere e aprova" },
      { step: 6, title: "Pagamento", description: "Pagamento após conclusão" }
    ],
    pricing: [
      { name: "Hora Técnica", price: "A partir de R$ 80,00/h", description: "Serviços em geral" },
      { name: "Montagem Móvel Simples", price: "A partir de R$ 60,00", description: "Criado-mudo, estante pequena" },
      { name: "Montagem Guarda-Roupa", price: "A partir de R$ 150,00", description: "Guarda-roupa 4-6 portas" },
      { name: "Fixação de TV", price: "A partir de R$ 80,00", description: "Suporte + instalação" },
      { name: "Troca de Torneira", price: "A partir de R$ 60,00", description: "Mão de obra (torneira à parte)" },
      { name: "Instalação Prateleiras", price: "A partir de R$ 50,00", description: "Por prateleira" }
    ],
    faqs: [
      { question: "Vocês trazem as ferramentas?", answer: "Sim! Nossos profissionais vão equipados com todas as ferramentas necessárias para os serviços comuns." },
      { question: "Fornecem os materiais?", answer: "Podemos fornecer materiais básicos como parafusos, buchas e fitas. Materiais específicos devem ser providenciados pelo cliente ou compramos com acréscimo." },
      { question: "Montam móveis de qualquer loja?", answer: "Sim! Montamos móveis de qualquer loja: IKEA, Tok&Stok, Madesa, Mpozenato e outras." },
      { question: "Qual o tempo mínimo de serviço?", answer: "O tempo mínimo é de 1 hora. Serviços rápidos são cobrados pela hora mínima." },
      { question: "Atendem aos finais de semana?", answer: "Sim! Atendemos de segunda a sábado. Domingos e feriados sob consulta com acréscimo." }
    ],
    relatedServices: ["eletrica", "manutencao-predial", "ar-condicionado"],
    keywords: ["serviços gerais curitiba", "marido de aluguel", "montagem móveis", "pequenos reparos", "instalação prateleiras", "fixação tv parede"]
  }
};

export const getServiceBySlug = (slug: string): ServiceData | null => {
  return servicesData[slug] || null;
};

export const getAllServices = (): ServiceData[] => {
  return Object.values(servicesData);
};
