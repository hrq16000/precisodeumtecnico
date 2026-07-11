/**
 * Rodada 25 — Builders parametrizados de FAQ para SEO agressivo.
 *
 * Cada builder devolve perguntas ÚNICAS (rota-dependentes), evitando
 * texto idêntico entre bairros/cidades diferentes. Isso mantém o
 * FAQPage útil no Google (rich results) sem cair em spam de conteúdo
 * repetido — uma preocupação real quando emitimos schema em 100+ URLs.
 *
 * Regras invioláveis:
 *  - Visita técnica: R$ 99,99 (mínimo);
 *  - Orçamento Pré-Aprovado: R$ 299,99 (mínimo, não inclui peças);
 *  - Nenhum preço absoluto de reparo. Nenhum SLA fabricado;
 *  - Sem promessa "24h no seu bairro" — o compromisso é a CENTRAL 24h;
 *  - Sem inventar horários, ratings, número de técnicos ou clientes.
 */

export interface FAQItem { question: string; answer: string; }

/** FAQ para páginas de serviço em Curitiba + RMC (/servicos/:slug). */
export function buildServiceFAQ(serviceName: string): FAQItem[] {
  const lower = serviceName.toLowerCase();
  return [
    {
      question: `Quanto custa ${lower} em Curitiba e Região?`,
      answer:
        `A visita técnica + diagnóstico parte de R$ 99,99. O valor do reparo é apresentado por escrito somente após o diagnóstico no local, sem pressão. O Orçamento Pré-Aprovado tem mínimo de R$ 299,99 e não inclui peças, componentes ou materiais.`,
    },
    {
      question: `Como agendar ${lower}?`,
      answer:
        `Basta iniciar a triagem no site ou falar com a central via WhatsApp. Você descreve o problema, recebe orientação técnica e, se for o caso, agendamos a visita no dia e horário mais convenientes para você.`,
    },
    {
      question: `Vocês atendem em toda a Região Metropolitana de Curitiba?`,
      answer:
        `Sim. Atendemos Curitiba, São José dos Pinhais, Pinhais, Colombo, Araucária, Fazenda Rio Grande, Piraquara e demais municípios da Grande Curitiba. O deslocamento é confirmado por escrito antes da visita.`,
    },
    {
      question: `Existe garantia no serviço de ${lower}?`,
      answer:
        `Sim. Todo serviço executado tem garantia proporcional à natureza do reparo, formalizada em nota fiscal. Peças com defeito de fabricação seguem a garantia do fornecedor, também documentada.`,
    },
    {
      question: `Emitem nota fiscal?`,
      answer:
        `Sim. Emitimos nota fiscal eletrônica em todos os serviços prestados. Isso é parte do compromisso profissional — sem improviso, sem "combinado por fora".`,
    },
    {
      question: `E se o problema não puder ser resolvido no local?`,
      answer:
        `Nesses casos apresentamos um Orçamento Pré-Aprovado (mínimo R$ 299,99, sem peças) para levar o equipamento à bancada ou realizar procedimento mais extenso. Você aprova por escrito antes de qualquer execução.`,
    },
  ];
}

/** FAQ para páginas nacionais serviço × cidade × bairro. */
export function buildNationalNeighborhoodFAQ(args: {
  serviceLabel: string;
  serviceNoun: string;
  bairroName: string;
  cityName: string;
  stateName: string;
}): FAQItem[] {
  const { serviceLabel, serviceNoun, bairroName, cityName, stateName } = args;
  const lower = serviceLabel.toLowerCase();
  return [
    {
      question: `Vocês têm técnico verificado para ${lower} em ${bairroName}, ${cityName}?`,
      answer:
        `Sim. Nossa rede nacional homologa prestadores em ${bairroName} e demais bairros de ${cityName} (${stateName}). Após a triagem, indicamos o profissional mais adequado à natureza do chamado — nenhum técnico é aceito sem checagem documental prévia.`,
    },
    {
      question: `Como funciona o atendimento em ${bairroName} pela rede nacional?`,
      answer:
        `Você inicia a triagem técnica no site (6 etapas guiadas). A central aciona o prestador verificado disponível em ${bairroName}/${cityName} e você recebe orçamento formal por escrito antes de qualquer execução.`,
    },
    {
      question: `Quanto custa o diagnóstico de ${serviceNoun} em ${bairroName}?`,
      answer:
        `A visita técnica parte de R$ 99,99 e cobre o deslocamento e o diagnóstico presencial. O reparo em si só é orçado depois — com valor por escrito e sua aprovação antes de qualquer serviço. O Orçamento Pré-Aprovado (bancada/procedimento) tem mínimo de R$ 299,99, sem peças inclusas.`,
    },
    {
      question: `Vocês atendem apenas ${bairroName} ou toda ${cityName}?`,
      answer:
        `Atendemos ${bairroName} e os demais bairros publicados de ${cityName} na nossa rede. Se a sua rua estiver em zona limítrofe, a triagem confirma a cobertura antes de agendar.`,
    },
    {
      question: `Por que triagem antes de ir ao WhatsApp?`,
      answer:
        `A triagem coleta os dados técnicos mínimos (equipamento, sintoma, endereço aproximado) para que o prestador chegue preparado. Isso evita visita improdutiva e permite orçamento realista já na primeira interação — respeitando o trabalho técnico, sem leilão de preço.`,
    },
  ];
}

/** FAQ para páginas de bairro (BairroDetalhe/BairroNacional) quando não houver curadoria. */
export function buildNeighborhoodFAQ(args: {
  bairroName: string;
  cityName: string;
  stateName?: string;
}): FAQItem[] {
  const { bairroName, cityName, stateName } = args;
  const local = stateName ? `${cityName} — ${stateName}` : cityName;
  return [
    {
      question: `Vocês atendem em ${bairroName}?`,
      answer:
        `Sim, ${bairroName} está na nossa área de atendimento em ${local}. O agendamento é feito por triagem no site ou via WhatsApp e a visita técnica parte de R$ 99,99.`,
    },
    {
      question: `Quais serviços vocês fazem em ${bairroName}?`,
      answer:
        `Cobrimos informática (formatação, remoção de vírus, upgrade), redes/Wi-Fi, câmeras/CFTV, elétrica residencial, ar-condicionado e reparo de eletrodomésticos. A lista completa aparece na página do bairro.`,
    },
    {
      question: `Quanto tempo leva para chegar um técnico em ${bairroName}?`,
      answer:
        `O tempo depende da agenda e da natureza do chamado. Confirmamos janela de atendimento por escrito na triagem — nossa central funciona 24h via WhatsApp; a visita é agendada, não é "corrida".`,
    },
    {
      question: `Existe cobrança se eu desistir do serviço em ${bairroName}?`,
      answer:
        `A visita técnica de R$ 99,99 (mínimo) é cobrada porque cobre o deslocamento e o diagnóstico presencial. Se você aprovar o orçamento, esse valor entra no preço final do reparo, conforme regra explicada por escrito antes da visita.`,
    },
  ];
}
