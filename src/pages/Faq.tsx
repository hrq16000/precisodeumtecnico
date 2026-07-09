import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PRICING, SLA, COMMERCIAL } from "@/data/pricingPolicy";
import { COMPANY } from "@/data/companyInfo";

const FAQ: { q: string; a: string }[] = [
  { q: "Como funciona o atendimento?", a: `Você preenche a triagem online (fotos e vídeos obrigatórios). Nossa equipe avalia, retorna com escopo, prazo e valor pré-aprovado. ${COMMERCIAL.triageRequirement}` },
  { q: "Qual o valor mínimo da visita técnica?", a: `${PRICING.technicalVisit.priceLabel} por bloco de até 30 minutos, limitado a 2 horas. Valor abatido em caso de fechamento.` },
  { q: "E o diagnóstico em bancada?", a: `${PRICING.benchDiagnosis.priceLabel} — ${PRICING.benchDiagnosis.description}` },
  { q: "Como funciona a coleta e entrega?", a: PRICING.pickupDelivery.description },
  { q: "Qual o prazo do atendimento?", a: `Mínimo de ${SLA.minLabel}, podendo chegar a ${SLA.maxLabel} conforme complexidade, peças e logística. ${SLA.disclaimer}` },
  { q: "Vocês parcelam?", a: COMMERCIAL.installments + ", quando aplicável. Consulte no fechamento do orçamento." },
  { q: "Atendem quais equipamentos?", a: "Notebooks, PCs, TVs, celulares, consoles, som, câmeras (CFTV), redes Wi-Fi, ar-condicionado e manutenção predial leve." },
  { q: "Fazem recuperação de dados?", a: "Sim, mediante triagem específica e orçamento pré-aprovado. Enviamos o escopo antes de qualquer intervenção." },
  { q: "Atendem empresas?", a: "Sim. Emitimos nota fiscal e temos condições comerciais específicas para PJ." },
  { q: "Como enviar fotos e vídeos?", a: "Direto no formulário de triagem. Sem cadastro com mídia prévia não iniciamos atendimento (padrão de qualidade e segurança)." },
  { q: "Existe garantia?", a: "Sim, garantia sobre o serviço executado. O prazo consta no orçamento final aprovado." },
  { q: "Como agendar pelo WhatsApp?", a: "Clique em qualquer botão 'Falar com técnico'. O sistema abre a triagem — ao final você é encaminhado ao WhatsApp com sua região preenchida." },
  { q: "Vocês atendem em todo o Brasil?", a: `${COMPANY.areaServed}. ${COMMERCIAL.partnersDisclaimer}` },
  { q: "Posso remarcar ou cancelar?", a: "Sim, sem custo até 4h antes do agendamento. Após esse prazo, a taxa de visita R$ 99,99 é cobrada." },
  { q: "O valor pode mudar depois?", a: "Só com sua aprovação. Trabalhamos com orçamento pré-aprovado; nada é executado sem confirmação." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "https://precisodeumtecnico.com/faq" },
  ],
};

export default function Faq() {
  return (
    <Layout>
      <Helmet>
        <title>Perguntas Frequentes — Preciso de um Técnico</title>
        <meta name="description" content="FAQ: valores mínimos, prazos, garantia, coleta e entrega, atendimento por WhatsApp e como funciona a triagem técnica." />
        <link rel="canonical" href="https://precisodeumtecnico.com/faq" />
        <meta property="og:title" content="Perguntas Frequentes — Preciso de um Técnico" />
        <meta property="og:url" content="https://precisodeumtecnico.com/faq" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>
      <section className="container-custom section-padding">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Perguntas Frequentes</h1>
          <p className="text-muted-foreground">
            Tudo sobre valores mínimos, prazos, garantia, coleta e entrega, WhatsApp e triagem técnica.
          </p>
        </header>
        <Accordion type="single" collapsible className="max-w-3xl">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </Layout>
  );
}
