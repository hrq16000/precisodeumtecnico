import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function CTASection() {
  const whatsappLink = buildWhatsAppUrl({ service: "assistência técnica" });

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Precisa de Um Técnico{" "}
            <span className="text-accent">Agora?</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Atendimento imediato 24 horas via WhatsApp. Técnico especializado vai até você. 
            Orçamento sem compromisso e garantia em todos os serviços.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <div className="w-2 h-2 rounded-full bg-success" />
              Atendimento 24h
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <div className="w-2 h-2 rounded-full bg-success" />
              Técnico vai até você
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <div className="w-2 h-2 rounded-full bg-success" />
              Garantia nos serviços
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center">
            <Button variant="whatsapp" size="xl" className="text-lg" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-6 h-6" />
                WhatsApp WhatsApp 24h
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>

          <p className="text-primary-foreground/60 text-sm mt-6">
            Atendemos Curitiba e toda a Região Metropolitana
          </p>
        </div>
      </div>
    </section>
  );
}
