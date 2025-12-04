import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Shield, Clock, Award, CheckCircle, FileText, Zap } from "lucide-react";
import heroImg from "@/assets/hero-technician.jpg";

export function HeroSection() {
  const whatsappNumber = "5541997452053";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Preciso de um técnico.`;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImg} 
          alt="Técnico especializado em informática" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
      </div>
      
      {/* Animated shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="container-custom relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm mb-6 animate-fade-up">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground text-sm font-semibold">Técnicos em Todo o Brasil</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up stagger-1">
              Assistência Técnica{" "}
              <span className="text-accent">Especializada</span>{" "}
              em Curitiba
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 mb-4 max-w-xl mx-auto lg:mx-0 animate-fade-up stagger-2">
              Informática, notebooks, CFTV, elétrica, ar-condicionado, celulares e muito mais. 
              Atendimento 24h via WhatsApp. O técnico vai até você!
            </p>

            {/* Price highlight */}
            <div className="inline-flex items-center gap-3 bg-success/20 border border-success/30 rounded-xl px-5 py-3 mb-6 animate-fade-up stagger-2">
              <Zap className="w-6 h-6 text-success" />
              <div className="text-left">
                <span className="text-primary-foreground/80 text-sm block">Visita Técnica a partir de</span>
                <span className="text-primary-foreground font-bold text-2xl">R$ 99,99</span>
                <span className="text-primary-foreground/70 text-sm"> (até 30 min)</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8 animate-fade-up stagger-3">
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">Garantia de 90 dias a 1 ano</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <FileText className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Emitimos Nota Fiscal</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">Técnicos certificados</span>
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

            {/* Service hours */}
            <p className="text-primary-foreground/70 text-sm mt-6 animate-fade-up stagger-4">
              📍 Atendimento presencial: 8h às 22h | 💬 WhatsApp: 24 horas
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 animate-fade-up stagger-5">
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all hover:scale-105">
              <Clock className="w-10 h-10 text-accent mb-4" />
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">24h</h3>
              <p className="text-primary-foreground/80 text-sm">Agendamento via WhatsApp</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all hover:scale-105">
              <Shield className="w-10 h-10 text-success mb-4" />
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">1 Ano</h3>
              <p className="text-primary-foreground/80 text-sm">Garantia nos serviços</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all hover:scale-105">
              <Award className="w-10 h-10 text-accent mb-4" />
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">500+</h3>
              <p className="text-primary-foreground/80 text-sm">Técnicos parceiros</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all hover:scale-105">
              <CheckCircle className="w-10 h-10 text-success mb-4" />
              <h3 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">20k+</h3>
              <p className="text-primary-foreground/80 text-sm">Clientes satisfeitos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
