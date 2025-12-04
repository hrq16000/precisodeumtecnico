import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Shield, Clock, Award, CheckCircle, Star, Users } from "lucide-react";

export function HeroSection() {
  const whatsappNumber = "5541997452053";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Preciso de um técnico.`;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#1a2744]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 40%),
                            radial-gradient(circle at 40% 80%, rgba(255, 217, 61, 0.08) 0%, transparent 40%)`
        }} />
      </div>
      
      {/* Animated shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD93D]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="container-custom relative z-10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#FFD93D] mb-6 animate-fade-up tracking-tight">
            CHEGA DE SOFRER!
          </h1>

          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-8 animate-fade-up stagger-1">
            Assistência Técnica Domicílio
          </h2>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-up stagger-2">
            Precisando de um Técnico em Manutenção e Suporte de Informática em sua casa, empresa ou escritório? 
            Agora você não precisa mais chamar a ajuda do vizinho ou daquele amigo que sabe tudo de informática.
          </p>

          {/* CTA Button */}
          <div className="mb-16 animate-fade-up stagger-3">
            <Button 
              size="xl" 
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-lg px-10 py-6 rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-105"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                AGENDE AGORA MESMO
              </a>
            </Button>
          </div>

          {/* Trust Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 animate-fade-up stagger-4">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <Shield className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h3 className="font-bold text-white text-lg mb-2">Garantia</h3>
              <p className="text-white/60 text-sm">Todos os serviços com garantia</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <Clock className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h3 className="font-bold text-white text-lg mb-2">Rapidez</h3>
              <p className="text-white/60 text-sm">Atendimento em até 24h</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <Star className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h3 className="font-bold text-white text-lg mb-2">Qualidade</h3>
              <p className="text-white/60 text-sm">Técnicos especializados</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
              <Users className="w-12 h-12 text-white/80 mx-auto mb-4" />
              <h3 className="font-bold text-white text-lg mb-2">Confiança</h3>
              <p className="text-white/60 text-sm">Milhares de clientes satisfeitos</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up stagger-5">
            <div className="text-center">
              <h3 className="font-display text-4xl md:text-5xl font-bold text-[#FFD93D] mb-2">5.000+</h3>
              <p className="text-white/70 text-sm">Clientes Atendidos</p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-4xl md:text-5xl font-bold text-[#FFD93D] mb-2">15.000+</h3>
              <p className="text-white/70 text-sm">Reparos Realizados</p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-4xl md:text-5xl font-bold text-[#FFD93D] mb-2">24h</h3>
              <p className="text-white/70 text-sm">Tempo de Resposta</p>
            </div>
            <div className="text-center">
              <h3 className="font-display text-4xl md:text-5xl font-bold text-[#FFD93D] mb-2">4.9</h3>
              <p className="text-white/70 text-sm">Avaliação Média</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 animate-fade-up stagger-5">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <a href="/servicos">Ver Todos os Serviços</a>
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <a href="/contato">Agendar Visita</a>
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <a href="tel:+5541997452053">
                <Phone className="w-4 h-4 mr-2" />
                (41) 99745-2053
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
