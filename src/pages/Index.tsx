import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { RegionsSection } from "@/components/home/RegionsSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { QuickQuoteForm } from "@/components/home/QuickQuoteForm";
import { QuickDiagnosisQuiz } from "@/components/QuickDiagnosisQuiz";
import { Reveal } from "@/components/Reveal";
import { buildReviewsSchema } from "@/data/testimonials";
import logoWebp from "@/assets/logo.webp";

const Index = () => {
  useEffect(() => {
    // Selective preload of the header logo on the homepage to improve LCP.
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = logoWebp;
    link.type = "image/webp";
    link.fetchPriority = "high";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Preciso de Um Técnico | Assistência Técnica Curitiba 24h"
        description="Assistência técnica em Curitiba e região: informática, elétrica, CFTV, notebooks e ar-condicionado. WhatsApp 24h. Visita a partir de R$ 99,99."
        canonical="https://precisodeumtecnico.com"
        structuredData={(() => {
          const reviews = buildReviewsSchema();
          const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { question: "Qual o valor da visita técnica?", answer: "A visita técnica para diagnóstico custa a partir de R$ 99,99 (até 30 minutos). Esse valor pode ser abatido do serviço caso você aprove o orçamento. O diagnóstico inclui análise completa do problema e orçamento sem compromisso." },
              { question: "Vocês atendem em domicílio?", answer: "Sim! Nossos técnicos vão até você em Curitiba e toda a Região Metropolitana. Atendemos residências, empresas, escritórios e comércios. Basta agendar pelo WhatsApp ou telefone." },
              { question: "Qual a forma de pagamento?", answer: "Aceitamos dinheiro, PIX, cartão de débito e crédito (em até 12x). O pagamento é feito somente após a conclusão e aprovação do serviço." },
              { question: "Vocês dão garantia nos serviços?", answer: "Sim! Todos os nossos serviços têm garantia de até 1 ano, dependendo do tipo de reparo. Em peças originais, a garantia é de 90 dias a 1 ano. Fornecemos nota fiscal e termo de garantia." },
              { question: "Quanto tempo leva para fazer o reparo?", answer: "A maioria dos reparos é concluída no mesmo dia, em até 2 horas. Problemas mais complexos podem levar de 1 a 3 dias úteis. Informamos o prazo exato no momento do diagnóstico." },
              { question: "Vocês atendem empresas?", answer: "Sim! Temos planos especiais para empresas, com contratos de manutenção, atendimento prioritário e condições diferenciadas. Entre em contato para uma proposta personalizada." },
              { question: "Atendem aos finais de semana e feriados?", answer: "Sim, atendemos de segunda a domingo, das 08h às 22h, incluindo feriados. Para emergências fora do horário, consulte disponibilidade pelo WhatsApp." },
              { question: "Como faço para agendar um técnico?", answer: "É simples! Basta clicar no botão de WhatsApp ou ligar para (41) 99745-2053. Informe o problema e sua localização, e agendaremos o técnico mais próximo de você." },
            ].map((q) => ({
              "@type": "Question",
              name: q.question,
              acceptedAnswer: { "@type": "Answer", text: q.answer },
            })),
          };
          return reviews ? [reviews, faqSchema] : [faqSchema];
        })()}
      />
      
      <HeroSection />
      <Reveal><ServicesSection /></Reveal>
      <Reveal><QuickDiagnosisQuiz /></Reveal>
      <Reveal><QuickQuoteForm /></Reveal>
      <Reveal><BenefitsSection /></Reveal>
      <Reveal><BrandsSection /></Reveal>
      <Reveal><RegionsSection /></Reveal>
      <Reveal><TestimonialsSection /></Reveal>
      <Reveal><FAQSection /></Reveal>
      <Reveal><CTASection /></Reveal>
    </Layout>
  );
};

export default Index;
