import { Shield, Clock, Award, Users, Headphones, ThumbsUp } from "lucide-react";
const benefits = [{
  icon: Clock,
  title: "Atendimento 24 Horas",
  description: "Agende seu atendimento a qualquer hora via WhatsApp. Emergências? Estamos aqui para ajudar."
}, {
  icon: Shield,
  title: "Garantia em Todos os Serviços",
  description: "Trabalhamos com peças de qualidade e oferecemos garantia em todo serviço realizado."
}, {
  icon: Award,
  title: "Técnicos Especializados",
  description: "Profissionais qualificados, treinados e constantemente avaliados pelos clientes."
}, {
  icon: Users,
  title: "Maior Rede do Brasil",
  description: "Centenas de técnicos cadastrados prontos para atender em toda a região metropolitana."
}, {
  icon: Headphones,
  title: "Suporte Completo",
  description: "Acompanhamento do início ao fim. Você não fica sozinho com seu problema técnico."
}, {
  icon: ThumbsUp,
  title: "Satisfação Garantida",
  description: "Milhares de clientes satisfeitos. Nosso compromisso é resolver seu problema."
}];
export function BenefitsSection() {
  return <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
            Por Que Nos Escolher
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Excelência em{" "}
            <span className="text-gradient text-primary-foreground">Cada Atendimento</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Nossa missão é oferecer o melhor serviço técnico com agilidade, qualidade e preço justo.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => <div key={benefit.title} className="group text-center p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl text-card-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
}