import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const faqs = [
  {
    question: "Qual o valor da visita técnica?",
    answer: "A visita técnica para diagnóstico custa a partir de R$ 99,99 (até 30 minutos). Esse valor pode ser abatido do serviço caso você aprove o orçamento. O diagnóstico inclui análise completa do problema e orçamento sem compromisso."
  },
  {
    question: "Vocês atendem em domicílio?",
    answer: "Sim! Nossos técnicos vão até você em Curitiba e toda a Região Metropolitana. Atendemos residências, empresas, escritórios e comércios. Basta agendar pelo WhatsApp ou telefone."
  },
  {
    question: "Qual a forma de pagamento?",
    answer: "Aceitamos dinheiro, PIX, cartão de débito e crédito (em até 12x). O pagamento é feito somente após a conclusão e aprovação do serviço."
  },
  {
    question: "Vocês dão garantia nos serviços?",
    answer: "Sim! Todos os nossos serviços têm garantia de até 1 ano, dependendo do tipo de reparo. Em peças originais, a garantia é de 90 dias a 1 ano. Fornecemos nota fiscal e termo de garantia."
  },
  {
    question: "Quanto tempo leva para fazer o reparo?",
    answer: "A maioria dos reparos é concluída no mesmo dia, em até 2 horas. Problemas mais complexos podem levar de 1 a 3 dias úteis. Informamos o prazo exato no momento do diagnóstico."
  },
  {
    question: "Vocês atendem empresas?",
    answer: "Sim! Temos planos especiais para empresas, com contratos de manutenção, atendimento prioritário e condições diferenciadas. Entre em contato para uma proposta personalizada."
  },
  {
    question: "Atendem aos finais de semana e feriados?",
    answer: "Sim, atendemos de segunda a domingo, das 08h às 22h, incluindo feriados. Para emergências fora do horário, consulte disponibilidade pelo WhatsApp."
  },
  {
    question: "Como faço para agendar um técnico?",
    answer: "É simples! Basta clicar no botão de WhatsApp ou ligar para WhatsApp 24h. Informe o problema e sua localização, e agendaremos o técnico mais próximo de você."
  }
];

export function FAQSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <MessageCircleQuestion className="w-4 h-4" />
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Tire suas dúvidas sobre nossos serviços de assistência técnica
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Não encontrou sua dúvida? Fale conosco!
          </p>
          <a
            href={buildWhatsAppUrl({ service: "dúvidas sobre assistência técnica" })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-success text-success-foreground rounded-lg font-semibold hover:bg-success/90 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
