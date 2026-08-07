import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { AuthoritySince } from "@/components/marketing/AuthoritySince";
import { CommercialTermsBlock } from "@/components/marketing/CommercialTermsBlock";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Monitor, Laptop, Camera, Zap, Wifi, Wind, Wrench, Tv, Server, 
  Smartphone, Printer, Building, HardDrive, Shield, Cpu, Settings,
  ArrowRight, CheckCircle, MessageCircle, Building2, Headset
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { PRICING, SLA } from "@/data/pricingPolicy";
import { servicesData } from "@/data/services";
import { buildLocalBusinessSchema } from "@/lib/schema/localBusiness";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickServicePhotos } from "@/data/publicPhotos";

/**
 * FAQ de /servicos — fonte única: COMMERCIAL_TERMS + PRICING.
 * Não incluir alegações sem comprovação (guard: check-commercial-claims.ts).
 */
const servicosFaqs = [
  {
    question: "Como funciona o orçamento antes do serviço?",
    answer: COMMERCIAL_TERMS.preApprovedPolicyText,
  },
  {
    question: "Quanto custa o diagnóstico?",
    answer: `${PRICING.benchDiagnosis.description} ${PRICING.technicalVisit.description}`,
  },
  {
    question: "Como funciona a coleta e entrega?",
    answer: PRICING.pickupDelivery.description,
  },
  {
    question: "Qual é o prazo de atendimento?",
    answer: `${COMMERCIAL_TERMS.minimumQueueText} ${SLA.disclaimer}`,
  },
  {
    question: "E se eu desistir depois do diagnóstico?",
    answer: COMMERCIAL_TERMS.cancellationText,
  },
  {
    question: "O valor mínimo inclui peças?",
    answer: `Não. ${COMMERCIAL_TERMS.preApprovedBudget.minLabel} é o mínimo pré-aprovado e cobre ${COMMERCIAL_TERMS.preApprovedBudget.includes.join(", ").toLowerCase()}. Peças, componentes, materiais ou itens adicionais são informados separadamente e só seguem com sua aprovação.`,
  },
];

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
const whatsappLink = buildWhatsAppUrl({ service: "assistência técnica", sourcePage: "/servicos" });

const Servicos = () => {
  return (
    <Layout>
      <SEOHead
        title="Assistência Técnica em Curitiba e Região"
        description="Escolha o serviço técnico que você precisa: informática, notebooks, CFTV, elétrica, redes, ar-condicionado e mais. Orçamento informado antes da execução."
        canonical="https://precisodeumtecnico.com/servicos"
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Serviços", url: "https://precisodeumtecnico.com/servicos" },
        ]}
        faq={servicosFaqs}
        structuredData={[
          buildLocalBusinessSchema({ url: "https://precisodeumtecnico.com/servicos" }),
          {
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: "Catálogo de serviços técnicos — Curitiba e Região",
            url: "https://precisodeumtecnico.com/servicos",
            itemListElement: Object.entries(servicesData)
              .slice(0, 24)
              .map(([slug, s], i) => ({
                "@type": "Offer",
                position: i + 1,
                itemOffered: {
                  "@type": "Service",
                  name: s.title,
                  description: s.description,
                  url: `https://precisodeumtecnico.com/servicos/${slug}`,
                  areaServed: "Curitiba e Região Metropolitana",
                  provider: { "@type": "LocalBusiness", name: "Preciso de Um Técnico" },
                },
              })),
          },
        ]}
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

      <AuthoritySince />


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

      {/* Cluster interno PJ e remoto */}
      <section className="section-padding bg-background" aria-labelledby="cluster-publicos">
        <div className="container-custom max-w-5xl">
          <h2 id="cluster-publicos" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            Atendimento para empresas e suporte remoto
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              to="/assistencia-tecnica-empresas-curitiba"
              className="group flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  Assistência técnica para empresas em Curitiba
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Suporte a parques de máquinas, servidores, redes e CFTV com atendimento
                  programado para CNPJ.
                </p>
              </div>
            </Link>
            <Link
              to="/suporte-tecnico-remoto"
              className="group flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Headset className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  Suporte técnico remoto
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Resolução de problemas de software, configuração e lentidão sem
                  deslocamento, com acesso assistido.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <CommercialTermsBlock />

      {/* FAQ */}
      <section className="section-padding bg-background" aria-labelledby="faq-servicos">
        <div className="container-custom max-w-3xl">
          <h2 id="faq-servicos" className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            Perguntas frequentes sobre nossos serviços
          </h2>
          <Accordion type="single" collapsible>
            {servicosFaqs.map((f, i) => (
              <AccordionItem key={i} value={`s-${i}`}>
                <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                <AccordionContent>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CTASection />
      <PublicPhotoBand
        title="Referências visuais dos serviços"
        intro="Fotos reais de bancadas, redes, CFTV e instalações elétricas — imagens de terceiros sob licença livre, usadas para ilustrar o tipo de trabalho descrito nesta página."
        photos={pickServicePhotos("todos-os-servicos", 3)}
      />
    </Layout>
  );
};

export default Servicos;
