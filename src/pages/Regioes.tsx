import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { MapPin, ArrowRight, CheckCircle, MessageCircle, Building, Users } from "lucide-react";

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

const otherCities = [
  { 
    name: "Pinhais", 
    href: "/regioes/pinhais",
    description: "Técnicos disponíveis em todos os bairros de Pinhais."
  },
  { 
    name: "Colombo", 
    href: "/regioes/colombo",
    description: "Atendimento completo na cidade de Colombo e região."
  },
  { 
    name: "Araucária", 
    href: "/regioes/araucaria",
    description: "Serviços técnicos especializados em Araucária."
  },
  { 
    name: "Campo Largo", 
    href: "/regioes/campo-largo",
    description: "Assistência técnica em Campo Largo e distritos."
  },
  { 
    name: "Fazenda Rio Grande", 
    href: "/regioes/fazenda-rio-grande",
    description: "Técnicos prontos para atender em Fazenda Rio Grande."
  },
  { 
    name: "Almirante Tamandaré", 
    href: "/regioes/almirante-tamandare",
    description: "Atendimento em toda Almirante Tamandaré."
  },
  { 
    name: "Piraquara", 
    href: "/regioes/piraquara",
    description: "Serviços técnicos em Piraquara e região."
  },
  { 
    name: "Campina Grande do Sul", 
    href: "/regioes/campina-grande-do-sul",
    description: "Assistência técnica em Campina Grande do Sul."
  },
  { 
    name: "Quatro Barras", 
    href: "/regioes/quatro-barras",
    description: "Técnicos especializados em Quatro Barras."
  },
  { 
    name: "Campo Magro", 
    href: "/regioes/campo-magro",
    description: "Atendimento técnico em Campo Magro."
  },
  { 
    name: "Itaperuçu", 
    href: "/regioes/itaperucu",
    description: "Serviços de assistência técnica em Itaperuçu."
  },
  { 
    name: "Rio Branco do Sul", 
    href: "/regioes/rio-branco-do-sul",
    description: "Técnicos disponíveis em Rio Branco do Sul."
  },
];

const whatsappNumber = "5541997452053";
const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Preciso de um técnico.`;

const Regioes = () => {
  return (
    <Layout>
      <SEOHead
        title="Regiões Atendidas | Assistência Técnica Curitiba e Região"
        description="Atendemos toda Curitiba, São José dos Pinhais e Região Metropolitana. Técnicos especializados em todos os bairros. Atendimento 24h via WhatsApp."
        canonical="https://precisodeumtecnico.com/regioes"
      />

      {/* Hero */}
      <section className="relative py-16 md:py-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 hero-overlay" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Regiões <span className="text-accent">Atendidas</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl mb-8">
              Cobertura completa em Curitiba e toda a Região Metropolitana. 
              Técnicos especializados prontos para atender você em qualquer bairro.
            </p>
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Building className="w-5 h-5 text-accent" />
                <span>14+ cidades</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <MapPin className="w-5 h-5 text-accent" />
                <span>100+ bairros</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Users className="w-5 h-5 text-accent" />
                <span>500+ técnicos</span>
              </div>
            </div>
            <Button variant="whatsapp" size="lg" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                Chamar Técnico Agora
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Curitiba */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Curitiba
              </h2>
              <p className="text-muted-foreground">Todos os bairros da capital</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow border border-border/50 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {curitibaBairros.map((bairro) => (
                <Link
                  key={bairro}
                  to={`/regioes/curitiba/${bairro.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  {bairro}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/regioes/curitiba">
                Ver todos os bairros de Curitiba
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* São José dos Pinhais */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                São José dos Pinhais
              </h2>
              <p className="text-muted-foreground">Cobertura completa na cidade</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 card-shadow border border-border/50 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sjpBairros.map((bairro) => (
                <Link
                  key={bairro}
                  to={`/regioes/sao-jose-dos-pinhais/${bairro.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  {bairro}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/regioes/sao-jose-dos-pinhais">
                Ver todos os bairros de SJP
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Outras Cidades da Região Metropolitana
            </h2>
            <p className="text-muted-foreground">
              Atendimento completo em todas as cidades da RMC
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCities.map((city) => (
              <Link
                key={city.name}
                to={city.href}
                className="group bg-card rounded-2xl p-6 card-shadow border border-border/50 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-display font-bold text-xl text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {city.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {city.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Regioes;
