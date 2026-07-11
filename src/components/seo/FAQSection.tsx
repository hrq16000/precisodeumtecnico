import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle } from "lucide-react";
import type { FAQItem } from "@/lib/faqBuilders";

interface FAQSectionProps {
  /** Perguntas — o mesmo array deve ser passado como `faq` ao SEOHead para casar UI ↔ schema. */
  faqs: FAQItem[];
  /** Título visível da seção. */
  title?: string;
  /** Link WhatsApp já parametrizado (deep-link com utm/context). */
  whatsappHref: string;
  /** aria-label + data-service + data-wa-source do CTA. */
  waSource: string;
  service?: string;
  city?: string;
  neighborhood?: string;
  /** Texto do CTA. */
  ctaLabel?: string;
}

/**
 * Rodada 25 — Seção FAQ reutilizável.
 *
 * Renderiza as FAQs de forma acessível (accordion) + CTA WhatsApp
 * contextual. NÃO emite schema — o schema é emitido pelo SEOHead via
 * prop `faq` para evitar duplicação (react-helmet-async dedupa por
 * name/property, mas <script type="application/ld+json"> não dedupa,
 * então mantemos um único emissor).
 */
export function FAQSection({
  faqs,
  title = "Perguntas frequentes",
  whatsappHref,
  waSource,
  service,
  city,
  neighborhood,
  ctaLabel,
}: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  const label = ctaLabel ?? "Falar com a central no WhatsApp";
  const ariaLabel = [
    "Falar com a central pelo WhatsApp",
    service && `— ${service}`,
    neighborhood && `em ${neighborhood}`,
    city && !neighborhood && `em ${city}`,
  ].filter(Boolean).join(" ");

  return (
    <section className="py-12 md:py-16 bg-background" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-2 mb-2 text-primary">
          <HelpCircle className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wide font-semibold">FAQ</span>
        </div>
        <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          {title}
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-muted/50 border border-border/60">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Não encontrou sua dúvida? Nossa central responde em minutos.
          </p>
          <Button asChild variant="whatsapp" size="lg">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source={waSource}
              {...(service ? { "data-service": service } : {})}
              {...(city ? { "data-city": city } : {})}
              {...(neighborhood ? { "data-neighborhood": neighborhood } : {})}
              aria-label={ariaLabel}
            >
              <MessageCircle className="w-5 h-5" />
              {label}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
