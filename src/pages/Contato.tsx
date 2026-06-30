import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/ContactForm";
import { 
  MessageCircle, Phone, MapPin, Clock, CheckCircle,
  Building, Users, Headphones
} from "lucide-react";

const whatsappNumber = "5541997452053";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Preciso de um técnico.`;

const contactInfo = [
  {
    icon: MessageCircle,
    title: "WhatsApp 24h",
    value: "WhatsApp 24h",
    description: "Atendimento imediato a qualquer hora",
    href: whatsappLink,
    highlight: true,
  },
  {
    icon: Clock,
    title: "Horário Presencial",
    value: "08h às 22h",
    description: "Atendimento no endereço do cliente",
    href: null,
    highlight: false,
  },
  {
    icon: MapPin,
    title: "Área de Atendimento",
    value: "Curitiba e Região",
    description: "Toda a Região Metropolitana",
    href: "/regioes",
    highlight: false,
  },
];

const serviceTypes = [
  {
    icon: Users,
    title: "Clientes Residenciais",
    description: "Atendimento para sua casa com agendamento flexível e garantia em todos os serviços.",
  },
  {
    icon: Building,
    title: "Empresas",
    description: "Suporte técnico para empresas de todos os portes. Contratos de manutenção disponíveis.",
  },
  {
    icon: Headphones,
    title: "Suporte Remoto",
    description: "Para problemas de software, oferecemos suporte remoto 24 horas via acesso seguro.",
  },
];

const Contato = () => {
  return (
    <Layout>
      <SEOHead
        title="Contato | Preciso de Um Técnico"
        description="Entre em contato com o Preciso de Um Técnico. WhatsApp 24h: WhatsApp 24h. Atendimento em Curitiba e Região Metropolitana."
        canonical="https://precisodeumtecnico.com/contato"
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Entre em <span className="text-accent">Contato</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8">
              Precisa de um técnico? Estamos prontos para atender você. 
              Atendimento imediato 24 horas via WhatsApp.
            </p>
            <Button variant="whatsapp" size="xl" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-6 h-6" />
                Chamar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 bg-background">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className={`rounded-2xl p-6 border transition-all duration-300 ${
                  info.highlight 
                    ? 'bg-success/10 border-success/30 hover:border-success/50' 
                    : 'bg-card border-border/50 hover:border-primary/30 card-shadow'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  info.highlight ? 'bg-success/20' : 'bg-primary/10'
                }`}>
                  <info.icon className={`w-6 h-6 ${info.highlight ? 'text-success' : 'text-primary'}`} />
                </div>
                <h3 className="font-bold text-lg text-card-foreground mb-1">
                  {info.title}
                </h3>
                {info.href ? (
                  <a 
                    href={info.href} 
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`font-bold text-xl block mb-2 hover:underline ${
                      info.highlight ? 'text-success' : 'text-primary'
                    }`}
                  >
                    {info.value}
                  </a>
                ) : (
                  <span className="font-bold text-xl text-foreground block mb-2">
                    {info.value}
                  </span>
                )}
                <p className="text-muted-foreground text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Form */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Side Content */}
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                Como Funciona o Atendimento
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Entre em Contato</h3>
                    <p className="text-muted-foreground">
                      Preencha o formulário ou envie uma mensagem via WhatsApp descrevendo o problema.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Receba o Orçamento</h3>
                    <p className="text-muted-foreground">
                      Nossa equipe analisa sua necessidade e envia um orçamento sem compromisso.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Agende o Atendimento</h3>
                    <p className="text-muted-foreground">
                      Escolha o melhor horário para você. Atendemos das 08h às 22h.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Problema Resolvido!</h3>
                    <p className="text-muted-foreground">
                      Técnico especializado resolve seu problema com garantia.
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-card rounded-xl p-6 border border-border/50 card-shadow mb-8">
                <h3 className="font-bold text-card-foreground mb-3">Informações Importantes</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    Orçamento sem compromisso
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    Garantia em todos os serviços
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    Pagamento após a conclusão do serviço
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    Aceitamos PIX, cartões e dinheiro
                  </li>
                </ul>
              </div>

              {/* Service Types */}
              <h3 className="font-display font-bold text-xl text-foreground mb-4">
                Tipos de Atendimento
              </h3>
              <div className="space-y-4">
                {serviceTypes.map((type) => (
                  <div key={type.title} className="bg-card rounded-xl p-5 card-shadow border border-border/50">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <type.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-card-foreground mb-1">
                          {type.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contato;
