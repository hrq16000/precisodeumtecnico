import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { 
  Shield, Award, Users, Clock, CheckCircle, Target, Heart, 
  Zap, MessageCircle, Building, ThumbsUp
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const stats = [
  { number: "Rede", label: "Técnicos parceiros verificados", icon: Users },
  { number: "24h", label: "Atendimento via WhatsApp", icon: Clock },
  { number: "1998", label: "Atuação em informática desde", icon: Award },
  { number: "Garantia", label: "Conforme o serviço realizado", icon: Shield },
];

const values = [
  {
    icon: Target,
    title: "Missão",
    description: "Conectar clientes aos melhores técnicos da região, oferecendo serviços de qualidade com agilidade e preço justo.",
  },
  {
    icon: Heart,
    title: "Valores",
    description: "Compromisso, transparência, qualidade técnica e satisfação do cliente em cada atendimento realizado.",
  },
  {
    icon: Zap,
    title: "Visão",
    description: "Ser a maior e mais confiável rede de assistência técnica do Brasil, presente em todas as regiões do país.",
  },
];

const differentials = [
  "Técnicos rigorosamente selecionados e avaliados",
  "Garantia em todos os serviços realizados",
  "Atendimento 24 horas via WhatsApp",
  "Orçamento sem compromisso",
  "Preços justos e competitivos",
  "Atendimento no endereço do cliente",
  "Peças de qualidade com procedência",
  "Suporte pós-atendimento",
  "Cobertura em toda a Região Metropolitana",
  "Atendimento residencial e empresarial",
];
const whatsappLink = buildWhatsAppUrl({ service: "assistência técnica", sourcePage: "/sobre" });

const Sobre = () => {
  return (
    <Layout>
      <SEOHead
        title="Sobre Nós | Preciso de Um Técnico"
        description="Conheça a maior rede de técnicos especializados de Curitiba e Região Metropolitana. Nossa história, missão, valores e compromisso com a qualidade."
        canonical="https://precisodeumtecnico.com/sobre"
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Sobre", url: "https://precisodeumtecnico.com/sobre" },
        ]}
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Sobre o <span className="text-accent">Preciso de Um Técnico</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              A maior rede de assistência técnica de Curitiba e Região Metropolitana. 
              Conectamos você aos melhores profissionais do mercado.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-card border border-border/50 card-shadow">
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
                Nossa História
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Evolução da{" "}
                <span className="text-gradient">Assistência Técnica</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  O <strong className="text-foreground">Preciso de Um Técnico</strong> nasceu da necessidade de 
                  conectar clientes a profissionais qualificados de forma rápida e confiável. 
                  Identificamos que muitas pessoas enfrentavam dificuldades para encontrar 
                  técnicos de confiança para resolver seus problemas técnicos do dia a dia.
                </p>
                <p>
                  Desde então, construímos a <strong className="text-foreground">maior rede de técnicos especializados</strong> de 
                  Curitiba e Região Metropolitana. Nossa plataforma conecta centenas de 
                  profissionais qualificados a milhares de clientes que precisam de serviços 
                  de informática, elétrica, CFTV, ar-condicionado e muito mais.
                </p>
                <p>
                  Cada técnico da nossa rede passa por um rigoroso processo de seleção 
                  e avaliação contínua, garantindo que você sempre receberá um atendimento 
                  de excelência. Nossa missão é simples: <strong className="text-foreground">resolver seu problema técnico 
                  com qualidade, rapidez e preço justo</strong>.
                </p>
              </div>
              <Button variant="whatsapp" size="lg" className="mt-8" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" data-wa-source="about" data-service="assistência técnica" aria-label="Falar com técnico pelo WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                  Fale Conosco
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50">
                  <Building className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg text-card-foreground mb-2">Empresas</h3>
                  <p className="text-muted-foreground text-sm">
                    Atendemos desde pequenas empresas até grandes corporações
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50">
                  <Users className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-bold text-lg text-card-foreground mb-2">Residências</h3>
                  <p className="text-muted-foreground text-sm">
                    Serviços técnicos para sua casa com garantia
                  </p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50">
                  <ThumbsUp className="w-10 h-10 text-success mb-4" />
                  <h3 className="font-bold text-lg text-card-foreground mb-2">Clientes satisfeitos</h3>
                  <p className="text-muted-foreground text-sm">
                    Atendimento avaliado diretamente pelos nossos clientes
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50">
                  <Clock className="w-10 h-10 text-accent mb-4" />
                  <h3 className="font-bold text-lg text-card-foreground mb-2">Rápido</h3>
                  <p className="text-muted-foreground text-sm">
                    Atendimento no mesmo dia na maioria dos casos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
              Nosso Propósito
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Missão, Visão e Valores
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((item) => (
              <div key={item.title} className="text-center p-8 rounded-2xl bg-card border border-border/50 card-shadow">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl text-card-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
              Por Que Nos Escolher
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossos Diferenciais
            </h2>
            <p className="text-muted-foreground">
              Entenda por que somos a escolha certa para resolver seus problemas técnicos
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 card-shadow border border-border/50">
            <div className="grid sm:grid-cols-2 gap-4">
              {differentials.map((item) => (
                <div key={item} className="flex items-center gap-3 p-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                  <span className="text-card-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Sobre;
