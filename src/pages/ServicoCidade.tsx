import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/Reveal";
import { servicesData } from "@/data/services";
import { citiesData } from "@/data/regions";
import { OfferHighlight } from "@/components/marketing/OfferHighlight";
import { buildOfferSchema } from "@/components/seo/OfferSchema";
import { buildReviewsSchema } from "@/data/testimonials";
import { CheckCircle2, MapPin, Phone, MessageCircle, Clock, Shield, Star, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const whatsappLink = buildWhatsAppUrl();

export default function ServicoCidade() {
  const { city, service } = useParams<{ city: string; service: string }>();

  const cityData = city ? citiesData[city] : undefined;
  const serviceData = service ? servicesData[service] : undefined;

  if (!cityData || !serviceData) {
    return <Navigate to="/404" replace />;
  }

  const title = `${serviceData.title} em ${cityData.name} | ${cityData.state} - Atendimento 24h`;
  const description = `${serviceData.title} em ${cityData.name}/${cityData.state}. Técnicos certificados, visita a partir de R$ 99,99, garantia, nota fiscal. Atendimento 24h via WhatsApp em todos os bairros de ${cityData.name}.`;
  const url = `https://precisodeumtecnico.com/servico-em/${cityData.slug}/${serviceData.slug}`;

  const localFaqs = [
    {
      question: `Vocês atendem em ${cityData.name}?`,
      answer: `Sim! Atendemos toda ${cityData.name} e região, incluindo todos os bairros principais. Nossa equipe se desloca até o seu endereço com agilidade — agendamento 24h via WhatsApp e visita técnica das 8h às 22h, todos os dias.`,
    },
    {
      question: `Quanto custa ${serviceData.title.toLowerCase()} em ${cityData.name}?`,
      answer: `A visita técnica + diagnóstico em ${cityData.name} parte de R$ 99,99. O orçamento do reparo só é fechado após o diagnóstico no local, sem compromisso. Para serviços com peças, o orçamento mínimo pré-aprovado é de R$ 300,00.`,
    },
    {
      question: `Quanto tempo demora o atendimento em ${cityData.name}?`,
      answer: `Para chamados em ${cityData.name}, o tempo médio de resposta é de 1 a 4 horas, dependendo da disponibilidade do técnico mais próximo do seu bairro. Em emergências, priorizamos a rota mais rápida.`,
    },
    ...serviceData.faqs.slice(0, 3),
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
      { "@type": "ListItem", position: 2, name: "Serviços", item: "https://precisodeumtecnico.com/servicos" },
      { "@type": "ListItem", position: 3, name: serviceData.title, item: `https://precisodeumtecnico.com/servicos/${serviceData.slug}` },
      { "@type": "ListItem", position: 4, name: cityData.name, item: url },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: localFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const localServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceData.title} em ${cityData.name}`,
    serviceType: serviceData.title,
    provider: {
      "@type": "LocalBusiness",
      name: "Preciso de Um Técnico",
      areaServed: { "@type": "City", name: cityData.name, addressRegion: cityData.state },
    },
    areaServed: { "@type": "City", name: cityData.name },
    offers: {
      "@type": "Offer",
      price: "99.99",
      priceCurrency: "BRL",
      url,
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "523" },
  };

  const offerSchema = buildOfferSchema({
    serviceName: `${serviceData.title} em ${cityData.name}`,
    areaServed: cityData.name,
    url,
  });
  const reviewsSchema = buildReviewsSchema();

  // Related cross-links
  const otherServices = Object.values(servicesData)
    .filter((s) => s.slug !== serviceData.slug)
    .slice(0, 6);
  const otherCities = Object.values(citiesData)
    .filter((c) => c.slug !== cityData.slug)
    .slice(0, 8);

  return (
    <Layout>
      <SEOHead
        title={title}
        description={description}
        canonical={url}
        keywords={[
          ...serviceData.keywords,
          `${serviceData.title.toLowerCase()} ${cityData.name.toLowerCase()}`,
          `técnico ${cityData.name.toLowerCase()}`,
          `assistência técnica ${cityData.name.toLowerCase()}`,
        ].join(", ")}
        structuredData={[breadcrumbSchema, faqSchema, localServiceSchema, offerSchema, reviewsSchema].filter(Boolean) as object[]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-foreground via-foreground to-primary/20 text-background py-16 md:py-24">
        <div className="container-custom">
          <Reveal>
            <nav className="text-xs sm:text-sm text-background/60 mb-4 flex flex-wrap gap-2 items-center">
              <Link to="/" className="hover:text-background">Início</Link>
              <span>/</span>
              <Link to={`/servicos/${serviceData.slug}`} className="hover:text-background">{serviceData.title}</Link>
              <span>/</span>
              <span className="text-background">{cityData.name}</span>
            </nav>
            <div className="flex items-center gap-2 mb-4 text-primary">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">{cityData.name} — {cityData.state}</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              {serviceData.title} em <span className="text-primary">{cityData.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-background/80 mb-8 max-w-3xl">
              {serviceData.subtitle} — atendimento técnico em todos os bairros de {cityData.name} com visita a partir de R$ 99,99, garantia e nota fiscal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="whatsapp" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> Chamar Técnico Agora
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-8 text-sm">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Atendimento 24h</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Garantia até 1 ano</span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> 4,9★ (523 avaliações)</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Oferta âncora — preço (R$ 99,99) + termos com hierarquia forte */}
      <section className="bg-background pt-8">
        <div className="container-custom max-w-4xl">
          <OfferHighlight region={`${cityData.name} — ${cityData.state}`} serviceSlug={serviceData.slug} />
        </div>
      </section>

      {/* Long content */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
              Por que escolher nossa {serviceData.title.toLowerCase()} em {cityData.name}?
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {serviceData.longDescription}
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Em {cityData.name}, atendemos residências, comércios e empresas com técnicos formados e experientes. Nossa cobertura inclui todos os bairros — do centro às regiões periféricas — com tempo médio de chegada entre 1 e 4 horas após a aprovação do orçamento via WhatsApp.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Diferente de assistências comuns, oferecemos diagnóstico no local, orçamento transparente, peças originais e garantia por escrito. Emitimos nota fiscal e seguimos os Termos de Orçamento Pré-Aprovado, que protegem cliente e técnico em qualquer reparo realizado em {cityData.name}.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 mt-12">O que está incluso</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {serviceData.includedServices.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 mt-12">Preços de referência em {cityData.name}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {serviceData.pricing.slice(0, 6).map((p) => (
                <Card key={p.name} className="p-4 hover-lift">
                  <div className="flex justify-between gap-2 mb-1">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-primary font-bold whitespace-nowrap">{p.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Valores de referência sujeitos a diagnóstico. Visita técnica + diagnóstico R$ 99,99. Orçamento pré-aprovado a partir de R$ 300,00.{" "}
              <Link to="/termos-orcamento-pre-aprovado" className="underline hover:text-primary">Ver termos</Link>.
            </p>
          </Reveal>

          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 mt-12">Perguntas frequentes — {serviceData.title} em {cityData.name}</h2>
            <Accordion type="single" collapsible>
              {localFaqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          {/* Internal linking */}
          <Reveal>
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-xl font-bold mb-4">Outros serviços em {cityData.name}</h3>
                <ul className="space-y-2">
                  {otherServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/servico-em/${cityData.slug}/${s.slug}`}
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" /> {s.title} em {cityData.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold mb-4">{serviceData.title} em outras cidades</h3>
                <ul className="space-y-2">
                  {otherCities.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to={`/servico-em/${c.slug}/${serviceData.slug}`}
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" /> {serviceData.title} em {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
