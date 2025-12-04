import { Link } from "react-router-dom";
import { 
  Monitor, 
  Laptop, 
  Camera, 
  Zap, 
  Wifi, 
  Wind, 
  Wrench, 
  Tv,
  Server,
  Smartphone,
  Printer,
  Building,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Monitor,
    title: "Informática",
    description: "Manutenção, formatação, limpeza e upgrade de computadores desktop.",
    href: "/servicos/informatica",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Laptop,
    title: "Notebooks",
    description: "Conserto de tela, teclado, bateria, limpeza interna e upgrade.",
    href: "/servicos/notebooks",
    color: "bg-indigo-500/10 text-indigo-600",
  },
  {
    icon: Camera,
    title: "CFTV / Câmeras",
    description: "Instalação e manutenção de sistemas de câmeras de segurança.",
    href: "/servicos/cftv",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Zap,
    title: "Elétrica",
    description: "Instalações elétricas residenciais e comerciais conforme normas.",
    href: "/servicos/eletrica",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  {
    icon: Wifi,
    title: "Redes e Wi-Fi",
    description: "Configuração de redes, roteadores e sistemas mesh.",
    href: "/servicos/redes",
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    icon: Wind,
    title: "Ar-Condicionado",
    description: "Instalação, limpeza e manutenção de aparelhos de ar.",
    href: "/servicos/ar-condicionado",
    color: "bg-teal-500/10 text-teal-600",
  },
  {
    icon: Tv,
    title: "TV e Eletrônicos",
    description: "Conserto de TVs, videogames e eletrônicos em geral.",
    href: "/servicos/eletronicos",
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    icon: Server,
    title: "Servidores",
    description: "Configuração e manutenção de servidores e data centers.",
    href: "/servicos/servidores",
    color: "bg-slate-500/10 text-slate-600",
  },
  {
    icon: Smartphone,
    title: "Celulares e Tablets",
    description: "Reparo de telas, baterias e componentes de dispositivos móveis.",
    href: "/servicos/celulares",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: Printer,
    title: "Impressoras",
    description: "Manutenção e configuração de impressoras e multifuncionais.",
    href: "/servicos/impressoras",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    icon: Building,
    title: "Manutenção Predial",
    description: "Serviços de manutenção predial e comercial completos.",
    href: "/servicos/manutencao-predial",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Wrench,
    title: "Serviços Gerais",
    description: "Hidráulica básica, montagem de móveis e reparos diversos.",
    href: "/servicos/servicos-gerais",
    color: "bg-stone-500/10 text-stone-600",
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-background" id="servicos">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
            Nossos Serviços
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Soluções Completas em{" "}
            <span className="text-gradient">Assistência Técnica</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Oferecemos uma ampla gama de serviços técnicos para residências e empresas. 
            Técnicos especializados e garantia em todos os serviços.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.href}
              className="group bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border border-border/50"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-lg text-card-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                Saiba mais <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/servicos">
              Ver todos os serviços
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
