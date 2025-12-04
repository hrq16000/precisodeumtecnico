import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Shield, Clock, Award, CheckCircle } from "lucide-react";

export function HeroSection() {
  const whatsappNumber = "5541997452053";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Preciso de um técnico.`;

  return (
    <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Animated shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="container-custom relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-sm mb-6 animate-fade-up">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground/90 text-sm font-medium">Maior Rede de Técnicos do Brasil</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up stagger-1">
              Técnico Especializado{" "}
              <span className="text-accent">na Sua Casa</span>{" "}
              em Minutos
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-up stagger-2">
              Informática, elétrica, CFTV, notebooks, ar-condicionado e muito mais. 
              Atendimento 24 horas via WhatsApp para Curitiba e Região Metropolitana.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10 animate-fade-up stagger-3">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm">Garantia em todos os serviços</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm">Técnicos avaliados</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm">Orçamento sem compromisso</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up stagger-4">
              <Button variant="whatsapp" size="xl" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  Chamar Técnico Agora
                </a>
              </Button>
              <Button variant="hero" size="xl" asChild>
                <a href="tel:+5541997452053">
                  <Phone className="w-5 h-5" />
                  (41) 9 9745-2053
                </a>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 animate-fade-up stagger-5">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors">
              <Clock className="w-10 h-10 text-accent mb-4" />
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">24h</h3>
              <p className="text-primary-foreground/70 text-sm">Atendimento via WhatsApp</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors">
              <Shield className="w-10 h-10 text-success mb-4" />
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">100%</h3>
              <p className="text-primary-foreground/70 text-sm">Serviços com garantia</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors">
              <Award className="w-10 h-10 text-accent mb-4" />
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">500+</h3>
              <p className="text-primary-foreground/70 text-sm">Técnicos especializados</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors">
              <CheckCircle className="w-10 h-10 text-success mb-4" />
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">15k+</h3>
              <p className="text-primary-foreground/70 text-sm">Clientes atendidos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
