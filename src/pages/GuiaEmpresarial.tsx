/**
 * Página de guia educacional empresarial (Rodada 31).
 * Renderiza qualquer guia definido em src/data/enterpriseGuides.ts.
 */
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { EnterpriseLinkCluster } from "@/components/seo/EnterpriseLinkCluster";
import { ENTERPRISE_GUIDES, type EnterpriseGuide } from "@/data/enterpriseGuides";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { AlertTriangle, BookOpen, CheckCircle2, MessageCircle } from "lucide-react";

const BASE = "https://precisodeumtecnico.com";

interface Props {
  slug: string;
}

export default function GuiaEmpresarial({ slug }: Props) {
  const guide: EnterpriseGuide | undefined = ENTERPRISE_GUIDES.find((g) => g.slug === slug);
  if (!guide) return null;

  const canonical = `${BASE}${guide.path}`;
  const waUrl = buildWhatsAppUrl({
    service: guide.whatsappService,
    sourcePage: guide.path,
  });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    mainEntityOfPage: canonical,
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: "Preciso de um Técnico" },
    publisher: { "@type": "Organization", name: "Preciso de um Técnico" },
    articleSection: "Guias empresariais",
  };

  return (
    <Layout>
      <SEOHead
        title={guide.metaTitle}
        description={guide.metaDescription}
        canonical={canonical}
        type="article"
        breadcrumbs={[
          { name: "Início", url: `${BASE}/` },
          { name: "Guias", url: `${BASE}/guias/organizacao-de-ti-para-pequenos-escritorios` },
          { name: guide.title, url: canonical },
        ]}
        faq={guide.faq}
        structuredData={[articleSchema]}
      />

      <article>
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {guide.kicker}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{guide.title}</h1>
            <p className="text-muted-foreground text-lg">{guide.intro}</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-source={`guia-${guide.slug}-hero`}
                data-service={guide.whatsappService}
                aria-label={`Falar no WhatsApp sobre ${guide.whatsappService}`}
                className="inline-flex items-center gap-2 min-h-[48px] bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Avaliar meu cenário
              </a>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav aria-label="Sumário do guia" className="mb-10 rounded-xl border border-border/50 bg-card p-5">
              <h2 className="font-semibold text-card-foreground mb-3">Neste guia</h2>
              <ol className="grid gap-2 sm:grid-cols-2 list-decimal list-inside text-sm text-muted-foreground">
                {guide.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="hover:text-primary underline-offset-4 hover:underline">
                      {s.title.replace(/^\d+\.\s*/, "")}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {guide.sections.map((s) => (
              <section key={s.id} id={s.id} className="mb-10 scroll-mt-24">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {s.title}
                </h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="space-y-2">
                    {s.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section id="checklist" className="mb-10 scroll-mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Checklist de requisitos
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {guide.checklist.map((c) => (
                  <div key={c.label} className="rounded-xl border border-border/50 bg-card p-4">
                    <p className="font-semibold text-card-foreground">{c.label}</p>
                    <p className="text-sm text-muted-foreground">{c.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="limites" className="mb-12 scroll-mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Limites operacionais
              </h2>
              <ul className="space-y-2">
                {guide.limits.map((l, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <AlertTriangle className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="faq" className="mb-12 scroll-mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Perguntas frequentes
              </h2>
              <div className="space-y-4">
                {guide.faq.map((f) => (
                  <div key={f.question} className="rounded-xl border border-border/50 bg-card p-4">
                    <h3 className="font-semibold text-card-foreground mb-1">{f.question}</h3>
                    <p className="text-sm text-muted-foreground">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <EnterpriseLinkCluster currentPath={guide.path} />

            <div className="rounded-xl border border-border/50 bg-card p-6 text-center">
              <h2 className="font-display text-xl md:text-2xl font-bold text-card-foreground mb-2">
                Quer aplicar isso no seu escritório?
              </h2>
              <p className="text-muted-foreground mb-5">
                Descreva o cenário atual (quantidade de postos, softwares e principais travas) e
                recebemos o contexto já organizado para a avaliação técnica.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-source={`guia-${guide.slug}-final`}
                data-service={guide.whatsappService}
                aria-label={`Falar no WhatsApp sobre ${guide.whatsappService}`}
                className="inline-flex items-center gap-2 min-h-[48px] bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Falar sobre o meu cenário
              </a>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
}
