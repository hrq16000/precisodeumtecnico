import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Zap, CheckCircle, FileText, Award, Clock, Shield, MapPin, Users, CreditCard } from "lucide-react";
import { TermsDialog } from "@/components/TermsDialog";
import { TERMS_SOURCE } from "@/lib/termsSource";
import { OfferHighlight } from "@/components/marketing/OfferHighlight";
import { COMMERCIAL, SLA } from "@/data/pricingPolicy";
export function HeroSection() {
  const whatsappNumber = "5541997452053";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Preciso de um técnico.`;
  return <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2d4a6f] to-[#1a3050]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 40%)`
      }} />
      </div>

      <div className="container-custom relative z-10 py-8 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/20 border border-[#22C55E]/30 rounded-full px-5 py-2 mb-6 animate-fade-up">
            <Users className="w-4 h-4 text-[#22C55E]" />
            <span className="text-white text-sm font-medium">Técnicos em Todo o Brasil</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up tracking-tight leading-tight">
            <span className="text-white">Assistência Técnica </span>
            <span className="text-[#22C55E]">Especializada</span>
          </h1>

          <p className="text-base md:text-lg text-white/80 mb-8 max-w-2xl mx-auto animate-fade-up px-4">
            Informática, notebooks, CFTV, elétrica, ar-condicionado, celulares e muito mais. 
            Atendimento 24h via WhatsApp. O técnico vai até você!
          </p>

          {/* Oferta âncora — preço (1) + Termos (2) com hierarquia forte */}
          <div className="mb-6 animate-fade-up max-w-xl mx-auto">
            <OfferHighlight region="Curitiba e Brasil" />
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 animate-fade-up px-4">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-[#22C55E]" />
              <span className="text-sm">Garantia de 90 dias a 1 ano</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <FileText className="w-5 h-5 text-[#22C55E]" />
              <span className="text-sm">Emitimos Nota Fiscal</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Award className="w-5 h-5 text-[#22C55E]" />
              <span className="text-sm">Técnicos certificados</span>
            </div>
          </div>

          {/* Condições comerciais */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-white/80 mb-8 animate-fade-up px-4">
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#F59E0B]" /> {COMMERCIAL.installments}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#F59E0B]" /> {COMMERCIAL.experienceLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#F59E0B]" /> {COMMERCIAL.partnersLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#F59E0B]" /> Prazo: {SLA.minLabel} a {SLA.maxLabel}
            </span>
          </div>


          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 px-4 mb-6 animate-fade-up">
            <Button size="lg" className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-lg py-6 rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02]" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp WhatsApp 24h
              </a>
            </Button>
          </div>

          {/* Operating Hours */}
          <div className="flex items-center justify-center gap-4 text-sm text-white/70 mb-10 animate-fade-up">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>Atendimento presencial: 8h às 22h</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-[#22C55E]" />
              <span>WhatsApp: 24 horas</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 px-4 animate-fade-up">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <Clock className="w-10 h-10 text-[#3B82F6] mb-3" />
              <h3 className="font-bold text-white text-2xl mb-1">24h</h3>
              <p className="text-white/60 text-sm">Agendamento via WhatsApp</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <Shield className="w-10 h-10 text-[#22C55E] mb-3" />
              <h3 className="font-bold text-white text-2xl mb-1">1 Ano</h3>
              <p className="text-white/60 text-sm">Garantia nos serviços</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <MapPin className="w-10 h-10 text-[#F59E0B] mb-3" />
              <h3 className="font-bold text-white text-2xl mb-1">Curitiba   </h3>
              <p className="text-white/60 text-sm">E região metropolitana</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <CheckCircle className="w-10 h-10 text-[#22C55E] mb-3" />
              <h3 className="font-bold text-white text-2xl mb-1">5.000+</h3>
              <p className="text-white/60 text-sm">Clientes satisfeitos</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
}