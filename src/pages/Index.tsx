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

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Preciso de Um Técnico | Assistência Técnica Curitiba 24h"
        description="Assistência técnica especializada em Curitiba e Região Metropolitana. Informática, elétrica, CFTV, notebooks, ar-condicionado. Atendimento 24h via WhatsApp. Técnico vai até você!"
        canonical="https://precisodeumtecnico.com"
      />
      
      <HeroSection />
      <ServicesSection />
      <QuickQuoteForm />
      <BenefitsSection />
      <BrandsSection />
      <RegionsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
