import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { blogPostsMap, blogCategories, allBlogPosts as blogPosts } from "@/data/blog";
import { servicesData } from "@/data/services";
import { citiesData } from "@/data/regions";
import { Calendar, Clock, MessageCircle, ArrowRight } from "lucide-react";

const whatsappLink = "https://wa.me/5541997452053?text=Olá! Preciso de um técnico.";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPostsMap[slug] : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const category = blogCategories.find((c) => c.slug === post.category);
  const url = `https://precisodeumtecnico.com/blog/${post.slug}`;
  const ogImage = `https://precisodeumtecnico.com/og/${post.category}.jpg`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: "Preciso de Um Técnico" },
    publisher: {
      "@type": "Organization",
      name: "Preciso de Um Técnico",
      logo: { "@type": "ImageObject", url: "https://precisodeumtecnico.com/icon-512.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.join(", "),
    articleSection: category?.name,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://precisodeumtecnico.com/blog" },
      ...(category
        ? [{ "@type": "ListItem", position: 3, name: category.name, item: `https://precisodeumtecnico.com/blog/categoria/${category.slug}` }]
        : []),
      { "@type": "ListItem", position: category ? 4 : 3, name: post.title, item: url },
    ],
  };

  const schemas: object[] = [articleSchema, breadcrumb];
  if (post.faqs && post.faqs.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <Layout>
      <SEOHead
        title={post.metaTitle}
        description={post.metaDescription}
        canonical={url}
        type="article"
        keywords={post.tags.join(", ")}
        article={{
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt ?? post.publishedAt,
          section: category?.name,
          tags: post.tags,
        }}
        structuredData={schemas}
      />

      <article className="bg-gradient-to-br from-foreground to-primary/10 text-background py-12">
        <div className="container-custom max-w-4xl">
          <Reveal>
            <nav className="text-xs sm:text-sm text-background/60 mb-3 flex flex-wrap gap-2">
              <Link to="/" className="hover:text-background">Início</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-background">Blog</Link>
              {category && (
                <>
                  <span>/</span>
                  <Link to={`/blog/categoria/${category.slug}`} className="hover:text-background">{category.name}</Link>
                </>
              )}
            </nav>
            {category && <Badge variant="secondary" className="mb-3">{category.name}</Badge>}
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-background/70">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.publishedAt).toLocaleDateString("pt-BR")}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readingTime} min de leitura</span>
            </div>
          </Reveal>
        </div>
      </article>

      <section className="section-padding">
        <div className="container-custom max-w-3xl prose-custom">
          {post.sections.map((section, i) => (
            <Reveal key={i}>
              {section.heading && (
                <h2 className="font-display text-2xl md:text-3xl font-bold mt-10 mb-4">{section.heading}</h2>
              )}
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
              ))}
              {section.list && (
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}

          {post.faqs && post.faqs.length > 0 && (
            <Reveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold mt-12 mb-4">Perguntas frequentes</h2>
              <Accordion type="single" collapsible>
                {post.faqs.map((f, i) => (
                  <AccordionItem key={i} value={`f-${i}`}>
                    <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                    <AccordionContent>{f.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          )}

          <Reveal>
            <Card className="p-6 mt-12 bg-primary/5 border-primary/20">
              <h3 className="font-display text-xl font-bold mb-2">Precisa de um técnico em Curitiba e região?</h3>
              <p className="text-muted-foreground mb-4">Atendimento 24h via WhatsApp. Visita técnica + diagnóstico a partir de R$ 99,99.</p>
              <Button variant="whatsapp" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
                </a>
              </Button>
            </Card>
          </Reveal>

          {/* Related services + cities */}
          {(post.relatedServices?.length || post.relatedCities?.length) && (
            <Reveal>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                {post.relatedServices && (
                  <div>
                    <h3 className="font-display text-lg font-bold mb-3">Serviços relacionados</h3>
                    <ul className="space-y-2">
                      {post.relatedServices.map((s) => {
                        const sd = servicesData[s];
                        if (!sd) return null;
                        return (
                          <li key={s}>
                            <Link to={`/servicos/${s}`} className="text-sm hover:text-primary inline-flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" /> {sd.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {post.relatedCities && (
                  <div>
                    <h3 className="font-display text-lg font-bold mb-3">Atendimento nas cidades</h3>
                    <ul className="space-y-2">
                      {post.relatedCities.map((c) => {
                        const cd = citiesData[c];
                        if (!cd) return null;
                        return (
                          <li key={c}>
                            <Link to={`/regioes/${c}`} className="text-sm hover:text-primary inline-flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" /> {cd.name}/{cd.state}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {related.length > 0 && (
            <Reveal>
              <h3 className="font-display text-2xl font-bold mt-16 mb-4">Continue lendo</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map((p) => (
                  <Card key={p.slug} className="p-4 hover-lift">
                    <h4 className="font-semibold mb-2">
                      <Link to={`/blog/${p.slug}`} className="hover:text-primary">{p.title}</Link>
                    </h4>
                    <p className="text-xs text-muted-foreground">{p.excerpt}</p>
                  </Card>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </Layout>
  );
}
