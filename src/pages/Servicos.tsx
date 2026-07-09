import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { 
  Monitor, Laptop, Camera, Zap, Wifi, Wind, Wrench, Tv, Server, 
  Smartphone, Printer, Building, HardDrive, Shield, Cpu, Settings,
  ArrowRight, CheckCircle, MessageCircle
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const serviceCategories = [
  {
    title: "Informática e Computadores",
    icon: Monitor,
    color: "bg-blue-500/10 text-blue-600",
    services: [
      { name: "Formatação de Computadores", href: "/servicos/formatacao-computadores" },
      { name: "Limpeza de Computador", href: "/servicos/limpeza-computador" },
      { name: "Upgrade de Hardware", href: "/servicos/upgrade-hardware" },
      { name: "Troca de HD para SSD", href: "/servicos/troca-hd-ssd" },
      { name: "Instalação de Programas", href: "/servicos/instalacao-programas" },
      { name: "Remoção de Vírus", href: "/servicos/remocao-virus" },
      { name: "Recuperação de Dados", href: "/servicos/recuperacao-dados" },
      { name: "Montagem de PC Gamer", href: "/servicos/montagem-pc-gamer" },
    ],
  },
  {
    title: "Notebooks",
    icon: Laptop,
    color: "bg-indigo-500/10 text-indigo-600",
    services: [
      { name: "Conserto de Notebook", href: "/servicos/conserto-notebook" },
      { name: "Troca de Tela de Notebook", href: "/servicos/troca-tela-notebook" },
      { name: "Troca de Teclado", href: "/servicos/troca-teclado-notebook" },
      { name: "Troca de Bateria", href: "/servicos/troca-bateria-notebook" },
      { name: "Limpeza Interna de Notebook", href: "/servicos/limpeza-notebook" },
      { name: "Reparo de Placa Mãe", href: "/servicos/reparo-placa-mae" },
      { name: "Upgrade de Memória RAM", href: "/servicos/upgrade-memoria-ram" },
      { name: "Notebook não Liga", href: "/servicos/notebook-nao-liga" },
    ],
  },
  {
    title: "CFTV e Câmeras de Segurança",
    icon: Camera,
    color: "bg-purple-500/10 text-purple-600",
    services: [
      { name: "Instalação de Câmeras", href: "/servicos/instalacao-cameras" },
      { name: "Manutenção de CFTV", href: "/servicos/manutencao-cftv" },
      { name: "Configuração de DVR/NVR", href: "/servicos/configuracao-dvr" },
      { name: "Acesso Remoto de Câmeras", href: "/servicos/acesso-remoto-cameras" },
      { name: "Instalação de Interfone", href: "/servicos/instalacao-interfone" },
      { name: "Alarme Residencial", href: "/servicos/alarme-residencial" },
      { name: "Cerca Elétrica", href: "/servicos/cerca-eletrica" },
      { name: "Controle de Acesso", href: "/servicos/controle-acesso" },
    ],
  },
  {
    title: "Elétrica",
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-600",
    services: [
      { name: "Instalação de Tomadas", href: "/servicos/instalacao-tomadas" },
      { name: "Troca de Disjuntores", href: "/servicos/troca-disjuntores" },
      { name: "Instalação de Chuveiro", href: "/servicos/instalacao-chuveiro" },
      { name: "Revisão Elétrica Residencial", href: "/servicos/revisao-eletrica" },
      { name: "Adequação NBR 5410", href: "/servicos/adequacao-nbr-5410" },
      { name: "Instalação de Lustres", href: "/servicos/instalacao-lustres" },
      { name: "Quadro de Distribuição", href: "/servicos/quadro-distribuicao" },
      { name: "Aterramento Elétrico", href: "/servicos/aterramento-eletrico" },
    ],
  },
  {
    title: "Redes e Wi-Fi",
    icon: Wifi,
    color: "bg-cyan-500/10 text-cyan-600",
    services: [
      { name: "Instalação de Roteador", href: "/servicos/instalacao-roteador" },
      { name: "Configuração Wi-Fi Mesh", href: "/servicos/wifi-mesh" },
      { name: "Rede Estruturada", href: "/servicos/rede-estruturada" },
      { name: "Instalação de Cabo de Rede", href: "/servicos/instalacao-cabo-rede" },
      { name: "Configuração de Switch", href: "/servicos/configuracao-switch" },
      { name: "Internet Lenta", href: "/servicos/internet-lenta" },
      { name: "Repetidor de Sinal", href: "/servicos/repetidor-sinal" },
      { name: "VPN Empresarial", href: "/servicos/vpn-empresarial" },
    ],
  },
  {
    title: "Ar-Condicionado",
    icon: Wind,
    color: "bg-teal-500/10 text-teal-600",
    services: [
      { name: "Instalação de Ar-Condicionado", href: "/servicos/instalacao-ar-condicionado" },
      { name: "Limpeza de Ar-Condicionado", href: "/servicos/limpeza-ar-condicionado" },
      { name: "Manutenção de Ar Split", href: "/servicos/manutencao-ar-split" },
      { name: "Carga de Gás", href: "/servicos/carga-gas-ar" },
      { name: "Conserto de Ar-Condicionado", href: "/servicos/conserto-ar-condicionado" },
      { name: "Desinstalação de Ar", href: "/servicos/desinstalacao-ar" },
    ],
  },
  {
    title: "TV e Eletrônicos",
    icon: Tv,
    color: "bg-rose-500/10 text-rose-600",
    services: [
      { name: "Conserto de TV", href: "/servicos/conserto-tv" },
      { name: "Instalação de TV na Parede", href: "/servicos/instalacao-tv-parede" },
      { name: "Conserto de Videogame", href: "/servicos/conserto-videogame" },
      { name: "Reparo de PlayStation", href: "/servicos/reparo-playstation" },
      { name: "Reparo de Xbox", href: "/servicos/reparo-xbox" },
      { name: "Conserto de Som", href: "/servicos/conserto-som" },
    ],
  },
  {
    title: "Servidores e Data Centers",
    icon: Server,
    color: "bg-slate-500/10 text-slate-600",
    services: [
      { name: "Instalação de Servidor", href: "/servicos/instalacao-servidor" },
      { name: "Configuração de Servidor", href: "/servicos/configuracao-servidor" },
      { name: "Backup Empresarial", href: "/servicos/backup-empresarial" },
      { name: "Virtualização", href: "/servicos/virtualizacao" },
      { name: "Suporte de TI", href: "/servicos/suporte-ti" },
      { name: "Contrato de Manutenção", href: "/servicos/contrato-manutencao" },
    ],
  },
  {
    title: "Celulares e Tablets",
    icon: Smartphone,
    color: "bg-emerald-500/10 text-emerald-600",
    services: [
      { name: "Troca de Tela de Celular", href: "/servicos/troca-tela-celular" },
      { name: "Troca de Bateria de Celular", href: "/servicos/troca-bateria-celular" },
      { name: "Conserto de Tablet", href: "/servicos/conserto-tablet" },
      { name: "Recuperação de Celular Molhado", href: "/servicos/celular-molhado" },
      { name: "Desbloqueio de Celular", href: "/servicos/desbloqueio-celular" },
    ],
  },
  {
    title: "Impressoras",
    icon: Printer,
    color: "bg-orange-500/10 text-orange-600",
    services: [
      { name: "Instalação de Impressora", href: "/servicos/instalacao-impressora" },
      { name: "Manutenção de Impressora", href: "/servicos/manutencao-impressora" },
      { name: "Impressora em Rede", href: "/servicos/impressora-rede" },
      { name: "Bulk Ink", href: "/servicos/bulk-ink" },
      { name: "Troca de Cartucho/Toner", href: "/servicos/troca-cartucho" },
    ],
  },
  {
    title: "Manutenção Predial",
    icon: Building,
    color: "bg-amber-500/10 text-amber-600",
    services: [
      { name: "Manutenção Comercial", href: "/servicos/manutencao-comercial" },
      { name: "Manutenção Industrial", href: "/servicos/manutencao-industrial" },
      { name: "Adequação NR-10", href: "/servicos/adequacao-nr10" },
      { name: "Laudo Técnico", href: "/servicos/laudo-tecnico" },
      { name: "PMOC", href: "/servicos/pmoc" },
    ],
  },
  {
    title: "Serviços Gerais",
    icon: Wrench,
    color: "bg-stone-500/10 text-stone-600",
    services: [
      { name: "Hidráulica Básica", href: "/servicos/hidraulica" },
      { name: "Montagem de Móveis", href: "/servicos/montagem-moveis" },
      { name: "Instalação de Suportes", href: "/servicos/instalacao-suportes" },
      { name: "Pequenos Reparos", href: "/servicos/pequenos-reparos" },
    ],
  },
];
const whatsappLink = buildWhatsAppUrl();

const Servicos = () => {
  return (
    <Layout>
      <SEOHead
        title="Serviços de Assistência Técnica | Preciso de Um Técnico"
        description="Conheça todos os nossos serviços de assistência técnica: informática, notebooks, CFTV, elétrica, redes, ar-condicionado e muito mais. Atendimento em Curitiba e região."
        canonical="https://precisodeumtecnico.com/servicos"
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Nossos <span className="text-accent">Serviços</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8">
              Soluções completas em assistência técnica para residências e empresas. 
              Técnicos especializados, garantia em todos os serviços e atendimento 24 horas.
            </p>
            <Button variant="whatsapp" size="lg" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                Solicitar Orçamento
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="space-y-16">
            {serviceCategories.map((category) => (
              <div key={category.title} id={category.title.toLowerCase().replace(/\s+/g, '-')}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-7 h-7" />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {category.title}
                  </h2>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.services.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    >
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-card-foreground group-hover:text-primary transition-colors font-medium">
                        {service.name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Servicos;
