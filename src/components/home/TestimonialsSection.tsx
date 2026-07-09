import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
export function TestimonialsSection() {
  return <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
            Depoimentos
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            O Que Nossos{" "}
            <span className="text-gradient text-primary-foreground">Clientes Dizem</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Milhares de clientes satisfeitos em toda a região. Veja o que eles falam sobre nosso atendimento.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-card rounded-2xl p-6 card-shadow border border-border/50 hover:card-shadow-hover transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-1">
                  {Array.from({
                length: testimonial.rating
              }).map((_, i) => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
                </div>
                <Quote className="w-8 h-8 text-primary/20" />
              </div>
              
              <p className="text-card-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                <p className="text-muted-foreground text-sm">{testimonial.location}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {testimonial.service}
                </span>
              </div>
            </div>)}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border/50 card-shadow">
            <div className="flex">
              {Array.from({
              length: 5
            }).map((_, i) => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
            </div>
            <span className="text-card-foreground font-medium">
              Depoimentos reais de clientes atendidos pela nossa rede
            </span>
          </div>
        </div>
      </div>
    </section>;
}