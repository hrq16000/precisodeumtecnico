export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string; // category slug
  tags: string[];
  publishedAt: string; // ISO date
  updatedAt?: string;
  readingTime: number;
  /** Markdown-like content broken into sections rendered as HTML in the page. */
  sections: { heading?: string; paragraphs: string[]; list?: string[] }[];
  /** Optional FAQ block — auto-converted to FAQPage schema. */
  faqs?: { question: string; answer: string }[];
  relatedServices?: string[];
  relatedCities?: string[];
  /** Extra hub-and-spoke internal links rendered at the end of the post. */
  internalLinks?: { label: string; to: string }[];
}

export const blogCategories: BlogCategory[] = [
  { slug: "informatica", name: "Informática", description: "Manutenção, formatação, vírus e dicas de PC e notebook." },
  { slug: "redes-wifi", name: "Redes & Wi-Fi", description: "Configuração de roteadores, sinal fraco, redes mesh." },
  { slug: "cftv-seguranca", name: "CFTV & Segurança", description: "Câmeras, DVR, controle de acesso e segurança eletrônica." },
  { slug: "eletrica", name: "Elétrica Residencial", description: "Disjuntores, quadros, instalações e segurança elétrica." },
  { slug: "ar-condicionado", name: "Ar-Condicionado", description: "Instalação, limpeza, manutenção e economia de energia." },
  { slug: "celulares", name: "Celulares & Tablets", description: "Reparo de tela, bateria, software e backup." },
  { slug: "guias-precos", name: "Guias de Preço", description: "Quanto custa cada serviço técnico em Curitiba." },
];

const baseRelatedCities = ["curitiba", "sao-jose-dos-pinhais", "pinhais", "colombo", "araucaria"];

// Helper to build a long-form post quickly with consistent structure.
function makePost(input: {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime?: number;
  intro: string[];
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
  faqs?: { question: string; answer: string }[];
  relatedServices?: string[];
}): BlogPost {
  return {
    slug: input.slug,
    title: input.title,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    excerpt: input.excerpt,
    category: input.category,
    tags: input.tags,
    publishedAt: input.publishedAt,
    updatedAt: input.publishedAt,
    readingTime: input.readingTime ?? 7,
    sections: [{ paragraphs: input.intro }, ...input.sections],
    faqs: input.faqs,
    relatedServices: input.relatedServices,
    relatedCities: baseRelatedCities,
  };
}

export const blogPosts: BlogPost[] = [
  makePost({
    slug: "como-formatar-pc-windows-11-passo-a-passo",
    title: "Como formatar um PC com Windows 11 (passo a passo seguro em 2026)",
    metaTitle: "Como Formatar PC com Windows 11: Guia Passo a Passo 2026",
    metaDescription: "Aprenda como formatar um PC com Windows 11 com segurança: backup, instalação limpa, drivers, programas essenciais e dicas de profissionais em Curitiba.",
    excerpt: "Guia completo e atualizado para formatar um computador com Windows 11 sem perder dados, com backup, instalação limpa e configuração final.",
    category: "informatica",
    tags: ["formatação", "windows 11", "manutenção pc"],
    publishedAt: "2026-01-12",
    readingTime: 12,
    intro: [
      "Formatar um PC parece complicado, mas seguindo os passos certos qualquer pessoa consegue deixar a máquina nova de novo. Neste guia, mostramos exatamente o que um técnico profissional faz em uma formatação completa de Windows 11 — incluindo backup, criação de pendrive bootável, instalação limpa e configuração final.",
      "Se você está em Curitiba ou Região Metropolitana e prefere o serviço presencial com garantia, atendemos com visita técnica a partir de R$ 99,99 e formatação completa a partir de R$ 150,00.",
    ],
    sections: [
      {
        heading: "Quando vale a pena formatar o computador?",
        paragraphs: [
          "Formatar é indicado quando o sistema está extremamente lento mesmo após limpeza, com vírus persistentes, telas azuis frequentes ou erros de inicialização que não são corrigidos por restauração. Também é recomendado antes de vender o equipamento ou quando o disco rígido foi trocado.",
          "Antes de partir para a formatação, vale tentar uma manutenção preventiva: limpeza interna, atualização de drivers e remoção de programas desnecessários. Em muitos casos isso já recupera o desempenho.",
        ],
      },
      {
        heading: "Passo 1: backup completo dos seus arquivos",
        paragraphs: [
          "Nunca formate antes de fazer backup. Copie documentos, fotos, vídeos, pastas do navegador (favoritos), e-mails configurados em Outlook/Thunderbird, chaves de licença e configurações de programas para um HD externo, pendrive ou nuvem (Google Drive, OneDrive, Dropbox).",
        ],
        list: [
          "Documentos e área de trabalho (C:/Usuários/SeuNome/Documentos e Desktop)",
          "Fotos e vídeos (pasta Imagens, Vídeos)",
          "Favoritos do navegador (exporte como HTML)",
          "Senhas salvas (use um gerenciador como Bitwarden)",
          "Licenças de softwares pagos",
        ],
      },
      {
        heading: "Passo 2: criar pendrive bootável do Windows 11",
        paragraphs: [
          "Baixe a Media Creation Tool no site oficial da Microsoft, conecte um pendrive de no mínimo 8GB e siga o assistente. A ferramenta prepara automaticamente o pendrive como mídia de instalação.",
          "Atenção: este processo apaga o conteúdo do pendrive. Use um pendrive vazio ou faça backup do que está nele.",
        ],
      },
      {
        heading: "Passo 3: dar boot pelo pendrive",
        paragraphs: [
          "Reinicie o PC e acesse o menu de boot (geralmente F12, F11, F8 ou Esc dependendo da marca). Selecione o pendrive como dispositivo de inicialização. O instalador do Windows 11 será carregado.",
        ],
      },
      {
        heading: "Passo 4: instalação limpa",
        paragraphs: [
          "Escolha 'Personalizada: Instalar somente Windows' para fazer uma instalação limpa. Apague as partições antigas do disco onde o sistema será instalado e crie uma nova. Isso garante que nenhum resíduo do sistema antigo permaneça.",
          "O processo leva entre 20 e 60 minutos, dependendo do hardware. Em SSDs, é significativamente mais rápido que em HDs tradicionais.",
        ],
      },
      {
        heading: "Passo 5: drivers, atualizações e programas",
        paragraphs: [
          "Após a instalação, instale os drivers (placa-mãe, vídeo, áudio, rede). Em PCs de marca, baixe direto do site do fabricante. Depois, rode o Windows Update várias vezes até não haver mais atualizações pendentes.",
          "Por fim, instale apenas os programas que você realmente usa: navegador, antivírus, pacote Office, leitor de PDF, comunicadores e ferramentas de trabalho. Evite encher a máquina de software desnecessário — esse é o principal motivo de PCs novos ficarem lentos.",
        ],
      },
    ],
    faqs: [
      { question: "Quanto tempo demora uma formatação completa?", answer: "Entre 2 e 3 horas em média, considerando backup, instalação, drivers e programas. Com SSD, fica em torno de 1 a 2 horas." },
      { question: "Formatar apaga tudo mesmo do disco?", answer: "A formatação padrão remove os arquivos visíveis, mas dados podem ser recuperados com ferramentas profissionais. Se for vender ou doar o PC, faça uma formatação de baixo nível ou uma sobrescrita completa." },
      { question: "Posso formatar sem perder o Windows original?", answer: "Sim. A licença do Windows 11 fica vinculada à placa-mãe da maioria dos PCs modernos. Após a instalação, o sistema é ativado automaticamente quando conectado à internet." },
    ],
    relatedServices: ["informatica", "notebooks"],
  }),
  makePost({
    slug: "wifi-fraco-em-casa-como-resolver",
    title: "Wi-Fi fraco em casa: 12 causas e como resolver de verdade",
    metaTitle: "Wi-Fi Fraco em Casa: 12 Causas e Soluções Definitivas (2026)",
    metaDescription: "Sinal Wi-Fi fraco? Veja 12 causas reais e como resolver: posicionamento do roteador, interferências, mesh, repetidores e configuração de canais.",
    excerpt: "Sinal caindo, lentidão e zonas mortas? Aprenda os ajustes que profissionais fazem para resolver Wi-Fi fraco antes de trocar de provedor.",
    category: "redes-wifi",
    tags: ["wifi", "roteador", "redes mesh"],
    publishedAt: "2026-01-18",
    readingTime: 9,
    intro: [
      "Wi-Fi fraco raramente é culpa do provedor — na maioria dos casos é o roteador mal posicionado, configurado errado ou ultrapassado. Este guia mostra como diagnosticar e resolver os 12 problemas mais comuns que fazem o sinal cair em casas e apartamentos.",
    ],
    sections: [
      { heading: "1. Posição do roteador", paragraphs: ["O roteador deve ficar em local alto, central da casa, longe de paredes grossas, espelhos, aquários e metais. Nunca dentro de armário fechado."] },
      { heading: "2. Interferência de outros aparelhos", paragraphs: ["Micro-ondas, telefones sem fio antigos e babás eletrônicas operam na mesma faixa de 2,4GHz e prejudicam o sinal."] },
      { heading: "3. Canal Wi-Fi sobrecarregado", paragraphs: ["Em prédios, dezenas de redes competem pelos mesmos canais. Use o painel do roteador para mudar para um canal menos congestionado (1, 6 ou 11 em 2,4GHz)."] },
      { heading: "4. Banda 5GHz subutilizada", paragraphs: ["Roteadores dual-band oferecem 2,4GHz (mais alcance, menos velocidade) e 5GHz (mais velocidade, menos alcance). Use 5GHz nos cômodos mais próximos do roteador."] },
      { heading: "5. Roteador antigo", paragraphs: ["Aparelhos com mais de 5 anos costumam ser Wi-Fi 4 (N) ou Wi-Fi 5 (AC) básicos. Atualize para Wi-Fi 6 (AX) se você tem internet acima de 200 Mbps."] },
      { heading: "6. Firmware desatualizado", paragraphs: ["Acesse o painel do roteador e verifique se há atualização de firmware. Versões novas corrigem bugs e melhoram desempenho."] },
      { heading: "7. Distância e paredes", paragraphs: ["Cada parede de alvenaria reduz o sinal em até 30%. Lajes e pisos atrapalham ainda mais."] },
      { heading: "8. Repetidor mal configurado", paragraphs: ["Repetidores duplicam o tráfego e cortam a velocidade. Prefira sistemas mesh, que mantêm uma rede única e otimizada."] },
      { heading: "9. Excesso de dispositivos conectados", paragraphs: ["Roteadores básicos suportam de 10 a 20 dispositivos simultâneos. Em casas com smart-TVs, câmeras, celulares e notebooks, isso estoura rapidamente."] },
      { heading: "10. Cabo de rede do provedor", paragraphs: ["Cabos antigos ou mal crimpados (CAT5) limitam a velocidade. Substitua por CAT6."] },
      { heading: "11. Sistema mesh é a solução para casas grandes", paragraphs: ["Para casas com mais de 100m² ou múltiplos andares, o mesh oferece cobertura uniforme com nós espalhados estrategicamente."] },
      { heading: "12. Senha vazada", paragraphs: ["Vizinhos usando sua rede consomem banda. Troque a senha periodicamente e ative WPA3 ou WPA2 com senha forte."] },
    ],
    faqs: [
      { question: "Vale a pena comprar repetidor de Wi-Fi?", answer: "Apenas em casos específicos. Para a maioria das casas com problemas de sinal, um sistema mesh é muito superior — mantém uma única rede, evita queda de velocidade e tem roaming inteligente entre os nós." },
      { question: "Qual a diferença entre 2,4GHz e 5GHz?", answer: "2,4GHz tem mais alcance e atravessa melhor paredes, mas é mais sujeita a interferência. 5GHz é mais rápida e estável, mas alcança menos distância." },
    ],
    relatedServices: ["redes"],
  }),
  makePost({
    slug: "quanto-custa-instalar-cameras-cftv-curitiba",
    title: "Quanto custa instalar câmeras CFTV em Curitiba? Tabela 2026",
    metaTitle: "Quanto Custa Instalar Câmeras CFTV em Curitiba 2026 (Tabela)",
    metaDescription: "Veja a tabela atualizada de preços para instalar câmeras CFTV em Curitiba: kits residenciais, comerciais, IP, analógicas, mão de obra e manutenção.",
    excerpt: "Tabela completa e transparente: quanto custa um sistema de CFTV residencial e comercial em Curitiba — equipamentos, instalação e manutenção.",
    category: "guias-precos",
    tags: ["cftv", "câmeras", "preço"],
    publishedAt: "2026-02-02",
    readingTime: 10,
    intro: [
      "Instalar câmeras de segurança virou prioridade em muitas residências e comércios de Curitiba. Mas o investimento varia bastante: depende do número de câmeras, qualidade da imagem, tipo (analógica ou IP) e da mão de obra. Aqui está a tabela 2026 atualizada.",
    ],
    sections: [
      { heading: "Kit residencial (4 câmeras)", paragraphs: ["DVR + 4 câmeras 1080p + cabos + HD 1TB + instalação: a partir de R$ 1.500,00. Atende casas de até 150m²."] },
      { heading: "Kit residencial (8 câmeras)", paragraphs: ["DVR 8 canais + 8 câmeras Full HD + cabos + HD 2TB + instalação: a partir de R$ 2.700,00."] },
      { heading: "Kit comercial básico (8 câmeras IP)", paragraphs: ["NVR PoE + 8 câmeras IP 4MP + storage 4TB + instalação: a partir de R$ 4.800,00."] },
      { heading: "Mão de obra avulsa", paragraphs: ["Instalação de câmera adicional: R$ 150 a R$ 250 por ponto. Configuração de acesso remoto (celular): R$ 120,00. Substituição de DVR: R$ 200,00."] },
      { heading: "Manutenção preventiva", paragraphs: ["Limpeza de lentes, ajuste de ângulo, verificação de gravação e atualização de firmware: R$ 200,00 a R$ 350,00 por visita."] },
    ],
    faqs: [
      { question: "Câmera analógica ou IP, qual a melhor?", answer: "Para residências básicas, analógicas Full HD têm ótimo custo-benefício. Para qualidade superior (4MP+), gravação em nuvem e câmeras inteligentes (detecção de movimento, reconhecimento), as IP são imbatíveis." },
      { question: "Preciso de internet para acessar as câmeras pelo celular?", answer: "Sim. O acesso remoto exige internet no local (Wi-Fi ou cabeada) e um roteador. A maioria dos sistemas funciona com qualquer plano de internet acima de 50 Mbps." },
    ],
    relatedServices: ["cftv"],
  }),
  makePost({
    slug: "ar-condicionado-nao-gela-causas-e-solucoes",
    title: "Ar-condicionado não gela: 8 causas e como resolver",
    metaTitle: "Ar-Condicionado Não Gela: 8 Causas Reais e Como Resolver",
    metaDescription: "Ar-condicionado não está gelando? Veja as 8 causas mais comuns e quando vale a pena chamar um técnico. Atendimento em Curitiba e região.",
    excerpt: "Antes de trocar de aparelho, descubra as causas mais comuns para um ar-condicionado parar de gelar — e como resolver com manutenção simples.",
    category: "ar-condicionado",
    tags: ["ar-condicionado", "manutenção", "split"],
    publishedAt: "2026-02-10",
    readingTime: 8,
    intro: [
      "Quando um ar-condicionado começa a gelar pouco ou parar de gelar de vez, o primeiro impulso é pensar em troca. Mas, na prática, mais de 70% dos casos são resolvidos com manutenção. Veja as causas mais comuns e o que fazer.",
    ],
    sections: [
      { heading: "1. Filtro sujo", paragraphs: ["A causa mais comum. Lave o filtro a cada 30 dias com água corrente e sabão neutro."] },
      { heading: "2. Falta de gás", paragraphs: ["Se o aparelho está ligado mas o ar sai morno, pode haver vazamento de gás. Exige técnico com manifold para diagnóstico e recarga."] },
      { heading: "3. Condensadora suja", paragraphs: ["A unidade externa acumula folhas e poeira na serpentina, reduzindo a troca de calor. Limpeza profissional resolve."] },
      { heading: "4. Capacitor queimado", paragraphs: ["Se o compressor não liga, é comum o capacitor estar danificado. Troca rápida e barata por técnico."] },
      { heading: "5. Sensor de temperatura defeituoso", paragraphs: ["Faz o aparelho desligar antes da hora. Substituição da peça resolve."] },
      { heading: "6. Drenagem entupida", paragraphs: ["Causa pingos e desligamento por proteção. Limpeza da mangueira de dreno."] },
      { heading: "7. Subdimensionamento", paragraphs: ["Aparelho menor que o ambiente nunca gela bem. Calcule BTUs corretamente."] },
      { heading: "8. Compressor com defeito", paragraphs: ["Casos graves. Em aparelhos antigos, geralmente é mais econômico trocar do que reparar."] },
    ],
    faqs: [
      { question: "De quanto em quanto tempo devo fazer manutenção?", answer: "Limpeza simples a cada 6 meses; manutenção completa (com lavagem química e verificação de gás) uma vez por ano." },
      { question: "Quanto custa recarregar o gás?", answer: "Em Curitiba, em média entre R$ 250,00 e R$ 450,00, dependendo do tipo de gás (R32, R410A) e do tamanho do aparelho." },
    ],
    relatedServices: ["ar-condicionado"],
  }),
  makePost({
    slug: "tela-celular-quebrou-vale-trocar-ou-comprar-novo",
    title: "Tela do celular quebrou: vale trocar ou comprar um novo?",
    metaTitle: "Tela Quebrada: Vale Trocar ou Comprar Celular Novo? (2026)",
    metaDescription: "Tela do celular quebrou? Compare custo de troca vs. comprar novo, garantia, qualidade da peça e tempo de reparo. Guia honesto e atualizado.",
    excerpt: "Quando vale trocar a tela, quando vale partir para um celular novo e como evitar peças piratas que estragam de novo em poucos meses.",
    category: "celulares",
    tags: ["celular", "tela", "reparo"],
    publishedAt: "2026-02-15",
    readingTime: 7,
    intro: [
      "A regra simples: se o custo da troca de tela for maior que 50% do valor de mercado do aparelho, costuma valer mais a pena comprar um novo. Mas há nuances importantes — qualidade da peça, garantia e tempo de uso restante.",
    ],
    sections: [
      { heading: "Troca de tela vale a pena quando…", paragraphs: ["O aparelho tem menos de 3 anos, a bateria ainda dura bem, você está satisfeito com o desempenho e o orçamento da troca é até 40% do valor de um novo equivalente."] },
      { heading: "Comprar novo vale a pena quando…", paragraphs: ["O celular já tem 4+ anos, bateria viciada, sistema operacional sem mais atualizações ou o orçamento da troca passa de 50% do valor do aparelho usado."] },
      { heading: "Cuidado com peças piratas", paragraphs: ["Telas muito baratas costumam ser displays incom-OEM, com brilho menor, cores erradas e durabilidade ruim. Sempre pergunte se a peça é original, OEM ou genérica — e exija garantia."] },
    ],
    faqs: [
      { question: "Quanto tempo demora a troca?", answer: "Em geral, de 1 a 3 horas se a peça estiver disponível. Modelos mais novos podem precisar de pedido sob encomenda (1 a 5 dias úteis)." },
      { question: "Tem garantia na troca?", answer: "Sim. Trabalhamos com 90 dias de garantia para peças instaladas, cobrindo defeito de fabricação e mão de obra." },
    ],
    relatedServices: ["celulares"],
  }),
  makePost({
    slug: "computador-lento-7-causas-e-solucoes",
    title: "Computador lento: 7 causas reais e como resolver hoje",
    metaTitle: "Computador Lento: 7 Causas Reais e Soluções (2026)",
    metaDescription: "PC ou notebook lento? Veja as 7 causas mais comuns de lentidão e o que fazer hoje para acelerar — sem precisar trocar de máquina.",
    excerpt: "Lentidão raramente é falta de potência. Veja como diagnosticar e acelerar seu computador antes de gastar com upgrade.",
    category: "informatica",
    tags: ["pc lento", "ssd", "manutenção"],
    publishedAt: "2026-02-22",
    readingTime: 9,
    intro: ["A maior parte das máquinas lentas que recebemos no atendimento técnico não precisa de upgrade — precisa de cuidado. Veja o que checar."],
    sections: [
      { heading: "1. HD em vez de SSD", paragraphs: ["A troca por SSD é o upgrade que mais transforma um PC. Boot em segundos, abertura instantânea de programas. Investimento de R$ 250 a R$ 350 que dá vida nova ao equipamento."] },
      { heading: "2. Memória RAM insuficiente", paragraphs: ["Para Windows 11, o mínimo confortável é 8GB. Acima de 16GB para uso intenso (edição, jogos, abas pesadas)."] },
      { heading: "3. Excesso de programas na inicialização", paragraphs: ["Abra o Gerenciador de Tarefas, aba 'Inicializar', e desative o que não usa."] },
      { heading: "4. Vírus e adware", paragraphs: ["Faça uma varredura completa com Microsoft Defender + Malwarebytes. Anúncios pop-up no navegador são quase sempre adware."] },
      { heading: "5. Disco cheio", paragraphs: ["Discos com mais de 90% de uso ficam lentos. Mantenha pelo menos 20% livre."] },
      { heading: "6. Pasta térmica seca / superaquecimento", paragraphs: ["CPU passando de 90°C reduz desempenho automaticamente. Limpeza interna e troca da pasta térmica resolvem."] },
      { heading: "7. Sistema operacional desatualizado / corrompido", paragraphs: ["Windows com erros não corrigidos é causa frequente de travamentos. Em casos graves, formatação é mais eficiente que reparar."] },
    ],
    faqs: [
      { question: "Vale upgrade ou trocar de PC?", answer: "Para máquinas com 4 a 7 anos, upgrade de SSD + RAM costuma render mais 3 a 5 anos de vida útil por uma fração do preço de um equipamento novo." },
    ],
    relatedServices: ["informatica", "notebooks"],
  }),
  makePost({
    slug: "como-escolher-eletricista-confiavel",
    title: "Como escolher um eletricista confiável (e evitar prejuízo)",
    metaTitle: "Como Escolher Eletricista Confiável em Curitiba (2026)",
    metaDescription: "Aprenda a contratar um eletricista de confiança: certificações, NR-10, orçamento por escrito, nota fiscal, garantia e o que evitar.",
    excerpt: "Serviço elétrico mal feito é risco de incêndio e choque. Veja o checklist que profissionais sérios cumprem.",
    category: "eletrica",
    tags: ["eletricista", "nr-10", "instalação elétrica"],
    publishedAt: "2026-03-01",
    readingTime: 8,
    intro: ["Contratar um eletricista barato pode sair caríssimo. Aqui está o checklist para identificar profissionais sérios e proteger sua casa ou empresa."],
    sections: [
      { heading: "1. Certificação NR-10", paragraphs: ["Toda atividade em instalações elétricas exige treinamento NR-10 vigente. Peça o certificado antes de fechar."] },
      { heading: "2. Orçamento detalhado por escrito", paragraphs: ["Materiais, mão de obra, prazo e garantia. Recusa em formalizar é sinal de alerta."] },
      { heading: "3. Nota fiscal e garantia", paragraphs: ["Profissional sério emite nota e oferece pelo menos 90 dias de garantia em mão de obra."] },
      { heading: "4. Marcas reconhecidas em material", paragraphs: ["Disjuntores Siemens, Schneider, ABB, WEG; cabos Prysmian, Cobrecom, Sil. Fuja de marcas genéricas."] },
      { heading: "5. ART para obras maiores", paragraphs: ["Reformas que envolvem quadro de distribuição, troca de padrão e projeto novo exigem Anotação de Responsabilidade Técnica do CREA."] },
    ],
    faqs: [
      { question: "Qual o preço médio de um eletricista em Curitiba?", answer: "Visita técnica + diagnóstico a partir de R$ 99,99. Trocas pontuais (tomada, disjuntor) entre R$ 80,00 e R$ 150,00. Serviços maiores são orçados após avaliação." },
    ],
    relatedServices: ["eletrica"],
  }),
  makePost({
    slug: "backup-arquivos-importantes-guia-2026",
    title: "Backup de arquivos importantes: guia definitivo 2026",
    metaTitle: "Backup de Arquivos Importantes: Guia Completo 2026",
    metaDescription: "Como fazer backup seguro de fotos, documentos e e-mails: regra 3-2-1, nuvem, HD externo, criptografia e restauração testada.",
    excerpt: "Perder arquivos é evitável. Aprenda o método 3-2-1 que profissionais usam para nunca depender de um único backup.",
    category: "informatica",
    tags: ["backup", "nuvem", "segurança"],
    publishedAt: "2026-03-08",
    readingTime: 9,
    intro: ["A regra de ouro do backup é simples: 3 cópias dos dados, em 2 mídias diferentes, sendo 1 fora do local. Veja como aplicar em casa e no escritório."],
    sections: [
      { heading: "Regra 3-2-1 explicada", paragraphs: ["3 cópias: o original + 2 backups. 2 mídias: por exemplo, HD externo + nuvem. 1 fora: cópia geográfica diferente, normalmente em nuvem."] },
      { heading: "Nuvem (recomendada para todos)", paragraphs: ["Google Drive, OneDrive, Dropbox, iCloud. Backup automático, recuperação fácil, criptografia em trânsito."] },
      { heading: "HD externo", paragraphs: ["Excelente para grandes volumes (fotos, vídeos). Use software de sincronização (FreeFileSync, SyncBack) para automação."] },
      { heading: "Backup empresarial", paragraphs: ["Servidores NAS (Synology, QNAP) com RAID, snapshots e replicação para nuvem."] },
      { heading: "Teste de restauração", paragraphs: ["Backup que nunca foi testado não é backup. Restaure ao menos um arquivo aleatório a cada trimestre."] },
    ],
    faqs: [
      { question: "Quanto custa um serviço de backup profissional?", answer: "Para residências, configuração inicial entre R$ 150,00 e R$ 300,00. Para empresas, projetos com servidor NAS partem de R$ 1.500,00 incluindo equipamento básico." },
    ],
    relatedServices: ["informatica", "recuperacao-dados"],
  }),
  makePost({
    slug: "remocao-de-virus-passo-a-passo",
    title: "Como remover vírus do PC sem formatar (passo a passo)",
    metaTitle: "Como Remover Vírus do PC Sem Formatar — Guia Profissional",
    metaDescription: "Aprenda a remover vírus, malware e adware do Windows sem formatar — usando ferramentas gratuitas e profissionais.",
    excerpt: "Antes de partir para a formatação, esses passos limpam 95% das infecções comuns sem perder dados.",
    category: "informatica",
    tags: ["vírus", "malware", "segurança"],
    publishedAt: "2026-03-15",
    readingTime: 8,
    intro: ["Nem toda infecção exige formatação. Em muitos casos, ferramentas gratuitas combinadas removem vírus e adware com eficiência."],
    sections: [
      { heading: "Modo de segurança com rede", paragraphs: ["Reinicie em modo de segurança e rode os scanners. Muitos malwares não conseguem se ativar nesse modo."] },
      { heading: "Microsoft Defender + Malwarebytes", paragraphs: ["Combinação que cobre 90% dos casos. Faça varredura completa com cada um."] },
      { heading: "AdwCleaner para adware", paragraphs: ["Remove barras de ferramentas, redirecionadores de busca e pop-ups."] },
      { heading: "Limpeza de extensões do navegador", paragraphs: ["Desinstale extensões desconhecidas e redefina configurações de busca para Google ou padrão."] },
      { heading: "Atualizações finais", paragraphs: ["Após limpeza, atualize Windows, navegadores e antivírus. Crie ponto de restauração limpo."] },
    ],
    faqs: [
      { question: "Quando vale formatar mesmo?", answer: "Se houver ransomware (arquivos criptografados), rootkit detectado ou sistema com instabilidade persistente após limpeza, formatar é mais seguro." },
    ],
    relatedServices: ["informatica"],
  }),
  makePost({
    slug: "guia-instalacao-camera-residencial",
    title: "Guia completo de instalação de câmeras residenciais",
    metaTitle: "Instalação de Câmeras Residenciais: Guia Completo 2026",
    metaDescription: "Onde instalar câmeras, quantos pontos cobrir, integração com app no celular e cuidados com privacidade — guia prático para casas.",
    excerpt: "Quantas câmeras instalar, em que lugares, como mirar e o que evitar para ter cobertura real e respeito à privacidade.",
    category: "cftv-seguranca",
    tags: ["cftv", "câmera", "residencial"],
    publishedAt: "2026-03-22",
    readingTime: 10,
    intro: ["Mais câmera não significa mais segurança. O segredo é cobrir os pontos de entrada e ângulos cegos com qualidade — não espalhar lentes pela casa toda."],
    sections: [
      { heading: "Pontos prioritários", paragraphs: ["Portão principal, garagem, fundo do quintal e área de serviço. Em casas com mais de um pavimento, considere uma câmera externa por andar visível."] },
      { heading: "Altura ideal", paragraphs: ["Entre 2,5m e 3m do chão, anguladas para baixo. Acima disso, capta apenas topo de cabeça (péssimo para reconhecimento)."] },
      { heading: "Iluminação noturna", paragraphs: ["Câmeras com IR (infravermelho) gravam em preto e branco no escuro. Para imagem colorida noturna, escolha modelos com Starlight ou ColorVu."] },
      { heading: "Privacidade do vizinho", paragraphs: ["Brasil: gravar imagens de vias públicas é permitido, mas filmar quintal ou janelas alheias pode gerar problemas legais. Configure máscaras de privacidade no DVR."] },
      { heading: "Acesso remoto", paragraphs: ["Configure no celular pelo app do fabricante (Hik-Connect, gDMSS, Intelbras Cloud). Use senha forte e mude a senha padrão do DVR."] },
    ],
    faqs: [
      { question: "Câmeras gravam o tempo todo?", answer: "Sim, normalmente em loop. Com HD de 1TB, são entre 7 e 15 dias de gravação contínua para 4 câmeras Full HD. Detecção de movimento estende esse prazo." },
    ],
    relatedServices: ["cftv"],
  }),
];

// Satellite long-tail posts (bairro × service) are merged here so the
// blog listing, category pages, sitemap and BlogPost route all see them.
// Keep this import at the bottom to avoid circular references.
import { satellitePosts } from "./satellitePosts";
import { viralSjpPosts } from "./viralPostsSJP";

export const allBlogPosts: BlogPost[] = [...viralSjpPosts, ...blogPosts, ...satellitePosts];

export const blogPostsMap: Record<string, BlogPost> = Object.fromEntries(
  allBlogPosts.map((p) => [p.slug, p]),
);

export function getPostsByCategory(slug: string) {
  return allBlogPosts.filter((p) => p.category === slug);
}
