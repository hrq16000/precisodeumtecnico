import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { 
  MessageCircle, Phone, MapPin, CheckCircle, Clock, Shield, 
  Award, ArrowRight, Monitor, Laptop, Camera, Zap, Wifi, Wind
} from "lucide-react";

const curitibaBairros = [
  "Água Verde", "Alto da Glória", "Alto da XV", "Bacacheri", "Bairro Alto",
  "Barreirinha", "Batel", "Bigorrilho", "Boa Vista", "Bom Retiro", "Boqueirão",
  "Cabral", "Cajuru", "Campina do Siqueira", "Campo Comprido", "Capão da Imbuia",
  "Capão Raso", "Centro", "Centro Cívico", "Cidade Industrial", "Cristo Rei",
  "Fanny", "Fazendinha", "Guabirotuba", "Guairá", "Hauer", "Hugo Lange",
  "Jardim Botânico", "Jardim das Américas", "Jardim Social", "Juvevê",
  "Lindóia", "Mercês", "Mossunguê", "Novo Mundo", "Parolin", "Pinheirinho",
  "Portão", "Prado Velho", "Rebouças", "Santa Cândida", "Santa Felicidade",
  "Santa Quitéria", "Santo Inácio", "São Braz", "São Francisco", "São Lourenço",
  "Seminário", "Sítio Cercado", "Tarumã", "Tatuquara", "Tingui", "Uberaba",
  "Vila Izabel", "Vista Alegre", "Xaxim"
];

const sjpBairros = [
  "Afonso Pena", "Águas Belas", "Aristocrata", "Boneca do Iguaçu", "Borda do Campo",
  "Centro", "Cidade Jardim", "Colônia Rio Grande", "Costeira", "Cruzeiro",
  "Del Rey", "Guatupê", "Independência", "Ipê", "Itália", "Jardim Dona Letícia",
  "Jardim Ibaiti", "Ouro Fino", "Pedro Moro", "Quissisana", "Rio Pequeno",
  "Roseira de São Sebastião", "São Cristóvão", "São Domingos", "São Marcos"
];

const cityData: Record<string, {
  name: string;
  state: string;
  description: string;
  neighborhoods: string[];
  isMainCity: boolean;
}> = {
  curitiba: {
    name: "Curitiba",
    state: "PR",
    description: "Atendimento completo em todos os bairros de Curitiba. Técnicos especializados em informática, elétrica, CFTV, ar-condicionado e muito mais.",
    neighborhoods: curitibaBairros,
    isMainCity: true,
  },
  "sao-jose-dos-pinhais": {
    name: "São José dos Pinhais",
    state: "PR",
    description: "Cobertura total em São José dos Pinhais. Assistência técnica residencial e empresarial com atendimento 24h via WhatsApp.",
    neighborhoods: sjpBairros,
    isMainCity: true,
  },
  pinhais: {
    name: "Pinhais",
    state: "PR",
    description: "Técnicos especializados prontos para atender em Pinhais. Serviços de informática, elétrica, CFTV e muito mais.",
    neighborhoods: [],
    isMainCity: false,
  },
  colombo: {
    name: "Colombo",
    state: "PR",
    description: "Atendimento técnico especializado em toda Colombo. Garantia em todos os serviços realizados.",
    neighborhoods: [],
    isMainCity: false,
  },
  araucaria: {
    name: "Araucária",
    state: "PR",
    description: "Assistência técnica em Araucária para residências e empresas. Atendimento rápido e com garantia.",
    neighborhoods: [],
    isMainCity: false,
  },
};

const mainServices = [
  { icon: Monitor, name: "Informática", href: "/servicos/informatica" },
  { icon: Laptop, name: "Notebooks", href: "/servicos/notebooks" },
  { icon: Camera, name: "CFTV", href: "/servicos/cftv" },
  { icon: Zap, name: "Elétrica", href: "/servicos/eletrica" },
  { icon: Wifi, name: "Redes", href: "/servicos/redes" },
  { icon: Wind, name: "Ar-Condicionado", href: "/servicos/ar-condicionado" },
];

const whatsappNumber = "5541997452053";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Preciso de um técnico.`;

const RegiaoDetalhe = () => {
  const { city, neighborhood } = useParams<{ city: string; neighborhood?: string }>();
  const cityInfo = city && cityData[city] ? cityData[city] : null;
  
  // Generate display name from slug
  const formatName = (slug: string) => {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const displayCityName = cityInfo ? cityInfo.name : (city ? formatName(city) : "Região");
  const displayNeighborhoodName = neighborhood ? formatName(neighborhood) : null;

  const pageTitle = displayNeighborhoodName 
    ? `${displayNeighborhoodName}, ${displayCityName}`
    : displayCityName;

  return (
    <Layout>
      <SEOHead
        title={`Técnico em ${pageTitle} | Assistência Técnica 24h`}
        description={`Assistência técnica em ${pageTitle}. Informática, elétrica, CFTV, ar-condicionado. Atendimento 24h via WhatsApp. Técnico vai até você!`}
        canonical={`https://precisodeumtecnico.com/regioes/${city}${neighborhood ? `/${neighborhood}` : ''}`}
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Link to="/regioes" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Regiões
              </Link>
              {displayNeighborhoodName && (
                <>
                  <span className="text-primary-foreground/40">/</span>
                  <Link to={`/regioes/${city}`} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {displayCityName}
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
                  Técnico em <span className="text-accent">{pageTitle}</span>
                </h1>
              </div>
            </div>
            
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8">
              {cityInfo?.description || `Assistência técnica especializada em ${pageTitle}. Atendimento 24 horas via WhatsApp com garantia em todos os serviços.`}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Clock className="w-5 h-5 text-accent" />
                <span>Atendimento 24h</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Shield className="w-5 h-5 text-success" />
                <span>Garantia inclusa</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Award className="w-5 h-5 text-accent" />
                <span>Técnicos avaliados</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
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
        </div>
      </section>

      {/* Services Available */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Serviços Disponíveis em {pageTitle}
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mainServices.map((service) => (
              <Link
                key={service.name}
                to={service.href}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 card-shadow hover:card-shadow-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">em {displayCityName}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/servicos">
                Ver todos os serviços
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Neighborhoods (if main city) */}
      {cityInfo?.isMainCity && cityInfo.neighborhoods.length > 0 && !displayNeighborhoodName && (
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
              Bairros Atendidos em {displayCityName}
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Técnicos especializados prontos para atender em todos os bairros de {displayCityName}
            </p>
            
            <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow border border-border/50">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cityInfo.neighborhoods.map((bairro) => (
                  <Link
                    key={bairro}
                    to={`/regioes/${city}/${bairro.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    {bairro}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content for neighborhood page */}
      {displayNeighborhoodName && (
        <section className="section-padding bg-secondary/30">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                Assistência Técnica no {displayNeighborhoodName}
              </h2>
              
              <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
                <p>
                  O <strong>Preciso de Um Técnico</strong> oferece serviços de assistência técnica especializada 
                  no bairro <strong>{displayNeighborhoodName}</strong>, em <strong>{displayCityName}</strong>. 
                  Nossa equipe de técnicos qualificados está pronta para atender residências e empresas 
                  com agilidade e qualidade.
                </p>
                <p>
                  Trabalhamos com os mais diversos serviços: <strong>informática</strong>, <strong>notebooks</strong>, 
                  <strong>elétrica</strong>, <strong>instalação de câmeras (CFTV)</strong>, <strong>ar-condicionado</strong>, 
                  <strong>redes e Wi-Fi</strong>, e muito mais. Todos os nossos serviços incluem garantia e 
                  são realizados por profissionais certificados.
                </p>
                <p>
                  Para solicitar um técnico no {displayNeighborhoodName}, basta entrar em contato via 
                  <strong> WhatsApp</strong> a qualquer hora do dia ou da noite. Nosso atendimento é 24 horas 
                  e agendamos o horário mais conveniente para você.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 card-shadow border border-border/50">
                <h3 className="font-bold text-card-foreground mb-4">Por que escolher nossos serviços?</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Técnicos especializados no bairro",
                    "Atendimento 24h via WhatsApp",
                    "Garantia em todos os serviços",
                    "Orçamento sem compromisso",
                    "Atendimento no local",
                    "Preços justos e competitivos",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </Layout>
  );
};

export default RegiaoDetalhe;
