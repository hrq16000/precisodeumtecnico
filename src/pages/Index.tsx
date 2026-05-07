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
