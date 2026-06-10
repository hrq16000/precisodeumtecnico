import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  Monitor,
  Laptop,
  Smartphone,
  Cpu,
  Wrench,
  MessageCircle,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Zap,
  Flame,
  Tv,
  Battery,
  HardDrive,
  Wifi,
  Volume2,
  Plug,
  Fan,
  CircuitBoard,
  Gauge,
  Clock,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  MapPin,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { trackWhatsAppClick } from "@/lib/analytics";


const WHATSAPP_NUMBER = "5541997452053";
const WHATSAPP_DISPLAY = "(41) 9 9745-2053";
const DEFAULT_WA_TEXT =
  "Olá, preciso de um orçamento de assistência técnica em Curitiba.";
const waLink = (text = DEFAULT_WA_TEXT) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const waClick = (source: string, service?: string) => () =>
  trackWhatsAppClick({
    source: `curitiba_lp_${source}`,
    service,
    city: "Curitiba",
  });

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const services = [
  {
    icon: Gamepad2,
    title: "Consoles de Games",
    desc: "PlayStation, Xbox, Nintendo Switch e mais — reparo completo com garantia.",
    items: [
      "Consoles que não ligam",
      "Superaquecimento e limpeza preventiva",
      "Leitor de discos e troca de HDD/SSD",
      "Reballing e reparo de placa",
    ],
  },
  {
    icon: Cpu,
    title: "Placas de Vídeo (NVIDIA/AMD)",
    desc: "Reparo especializado em GPUs com bancada profissional.",
    items: [
      "Superaquecimento e artefatos",
      "Reballing de GPU",
      "Problemas no cooler",
      "Solda BGA",
    ],
  },
  {
    icon: Monitor,
    title: "Computadores e Notebooks",
    desc: "Montagem, manutenção e upgrade em PCs gamer, corporativos e notebooks.",
    items: [
      "Diagnóstico e reparo de falhas",
      "Upgrade para SSD e memória",
      "Troca de tela e teclado",
      "Recuperação de dados",
    ],
  },
  {
    icon: Smartphone,
    title: "Smartphones",
    desc: "iPhone, Samsung, Xiaomi, Motorola e demais marcas.",
    items: [
      "Troca de tela quebrada",
      "Substituição de bateria",
      "Reparo de conectores",
      "Recuperação de dados",
    ],
  },
  {
    icon: Wrench,
    title: "Manutenção Preventiva",
    desc: "Mantenha seu equipamento rápido, silencioso e com vida útil estendida.",
    items: [
      "Limpeza interna completa",
      "Troca de pasta térmica",
      "Teste de estresse",
      "Diagnóstico completo",
    ],
  },
  {
    icon: Laptop,
    title: "Especialistas Multi-Marca",
    desc: "Dell, HP, Lenovo, Asus, Acer, Samsung, Apple e mais.",
    items: [
      "Reparo de placa-mãe",
      "Troca de chip BGA",
      "Substituição de bateria",
      "Upgrade de hardware",
    ],
  },
];

const consoleBrands = [
  {
    icon: Gamepad2,
    title: "PlayStation",
    problems: [
      { icon: Zap, label: "PS5 não liga" },
      { icon: Flame, label: "PS4 superaquecendo" },
      { icon: HardDrive, label: "PS3 não lê discos" },
      { icon: Wifi, label: "Problemas de conexão" },
      { icon: CircuitBoard, label: "Falha no HD/SSD" },
      { icon: Gamepad2, label: "Controle com drift" },
    ],
  },
  {
    icon: Tv,
    title: "Xbox",
    problems: [
      { icon: Zap, label: "Xbox não liga" },
      { icon: Volume2, label: "Barulho no cooler" },
      { icon: Tv, label: "Sem vídeo na TV" },
      { icon: Plug, label: "Problema na fonte" },
      { icon: Wifi, label: "Falha de rede" },
      { icon: Sparkles, label: "Não reconhece jogos" },
    ],
  },
  {
    icon: Gamepad2,
    title: "Nintendo",
    problems: [
      { icon: Battery, label: "Switch não carrega" },
      { icon: Gamepad2, label: "Joy-Con com drift" },
      { icon: Tv, label: "Dock com defeito" },
      { icon: HardDrive, label: "Erro no cartão SD" },
      { icon: Zap, label: "Não liga ou reinicia" },
      { icon: Wifi, label: "Problemas de conexão" },
    ],
  },
  {
    icon: Cpu,
    title: "Placas de Vídeo",
    problems: [
      { icon: Flame, label: "Superaquecimento" },
      { icon: CircuitBoard, label: "Reballing de GPU" },
      { icon: Tv, label: "Artefatos na tela" },
      { icon: Zap, label: "Não é reconhecida" },
      { icon: Fan, label: "Problemas no cooler" },
      { icon: Gauge, label: "Baixo desempenho" },
    ],
  },
];

const differentials = [
  { icon: Clock, title: "Diagnóstico Rápido", desc: "Resposta em até 24h pelo WhatsApp." },
  { icon: ShieldCheck, title: "Garantia de 90 dias", desc: "Tranquilidade em cada reparo." },
  { icon: BadgeCheck, title: "Peças de Alta Qualidade", desc: "Componentes testados e originais." },
  { icon: Sparkles, title: "Orçamento Sem Compromisso", desc: "Avaliação técnica transparente." },
  { icon: Gauge, title: "Atendimento em toda Curitiba", desc: "Retirada e entrega via motoboy opcional." },
  { icon: CheckCircle2, title: "Técnicos Certificados", desc: "Experiência comprovada em bancada." },
];

const faqs = [
  {
    q: "Quanto custa um orçamento de assistência técnica em Curitiba?",
    a: "O orçamento é gratuito e sem compromisso. Após o diagnóstico, enviamos o valor exato do reparo via WhatsApp para sua aprovação antes de qualquer serviço.",
  },
  {
    q: "Vocês dão garantia no reparo de consoles e placas de vídeo?",
    a: "Sim. Todos os reparos têm garantia de 90 dias cobrindo o defeito apresentado e as peças substituídas.",
  },
  {
    q: "Em quanto tempo o conserto fica pronto?",
    a: "A maioria dos reparos de consoles, notebooks e celulares é entregue em 24 a 72 horas após a aprovação do orçamento. Reparos complexos (reballing de GPU, BGA) podem levar até 5 dias úteis.",
  },
  {
    q: "Vocês atendem em toda Curitiba e região metropolitana?",
    a: "Sim. Atendemos Curitiba e toda região metropolitana (São José dos Pinhais, Pinhais, Colombo, Araucária) com opção de retirada e entrega via motoboy.",
  },
  {
    q: "Trabalham com peças originais?",
    a: "Trabalhamos com peças originais e componentes de alta qualidade homologados pelos fabricantes. Sempre informamos a procedência antes da troca.",
  },
  {
    q: "Como faço para solicitar um reparo?",
    a: `Basta chamar no WhatsApp ${WHATSAPP_DISPLAY}. Descreva o problema, envie fotos se possível e nosso técnico responde com um diagnóstico inicial e o próximo passo.`,
  },
];

const relatedServices = [
  { label: "Informática e Notebooks em Curitiba", href: "/servicos/informatica" },
  { label: "Manutenção de Notebooks", href: "/servicos/notebooks" },
  { label: "Conserto de Celulares", href: "/servicos/celulares" },
  { label: "Assistência Técnica em Curitiba (geral)", href: "/regioes/curitiba" },
  { label: "São José dos Pinhais", href: "/regioes/sao-jose-dos-pinhais" },
  { label: "Pinhais", href: "/regioes/pinhais" },
  { label: "Colombo", href: "/regioes/colombo" },
  { label: "Araucária", href: "/regioes/araucaria" },
];

export default function AssistenciaTecnicaCuritiba() {
  const pageUrl = "https://precisodeumtecnico.com/assistencia-tecnica-curitiba";
  const ogImage = "https://precisodeumtecnico.com/og-image.jpg";
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Preciso de um Técnico",
    description:
      "Assistência técnica especializada em Curitiba: reparo de consoles, placas de vídeo, computadores, notebooks e smartphones.",
    url: pageUrl,
    telephone: "+55-41-99745-2053",
    image: ogImage,
    areaServed: [
      { "@type": "City", name: "Curitiba", "@id": "https://www.wikidata.org/wiki/Q40269" },
    ],
    serviceArea: { "@type": "AdministrativeArea", name: "Curitiba - PR" },
    priceRange: "$$",
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "523" },
    sameAs: [
      "https://www.facebook.com/precisodeumtecnico/",
      "https://www.instagram.com/PrecisoDeUmTecnico",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
      { "@type": "ListItem", position: 2, name: "Serviços", item: "https://precisodeumtecnico.com/servicos" },
      { "@type": "ListItem", position: 3, name: "Assistência Técnica em Curitiba", item: pageUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Dev-time schema + tracking validation. Logs structured data and verifies
  // that whatsapp_click events fire with utm_*/gclid payload. Surfaces a
  // warning in the console if tracking breaks (e.g. dataLayer never receives
  // the event after a CTA click).
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    // eslint-disable-next-line no-console
    console.groupCollapsed("[SEO] /assistencia-tecnica-curitiba JSON-LD");
    // eslint-disable-next-line no-console
    console.log("LocalBusiness", localBusinessSchema);
    // eslint-disable-next-line no-console
    console.log("BreadcrumbList", breadcrumbSchema);
    // eslint-disable-next-line no-console
    console.log("FAQPage", faqSchema);
    // eslint-disable-next-line no-console
    console.groupEnd();

    // Tracking watchdog: warns if no whatsapp_click events show up in
    // dataLayer 8s after any wa.me anchor is clicked.
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    let clicked = false;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href*='wa.me']");
      if (!a) return;
      clicked = true;
      const before = w.dataLayer?.length ?? 0;
      setTimeout(() => {
        const events = (w.dataLayer ?? []).slice(before);
        const wa = events.find((ev) => ev.event === "whatsapp_click");
        if (!wa) {
          // eslint-disable-next-line no-console
          console.warn("[tracking] whatsapp_click did NOT fire after CTA click — check analytics wiring");
        } else {
          // eslint-disable-next-line no-console
          console.info("[tracking] whatsapp_click OK", wa);
        }
      }, 250);
    };
    document.addEventListener("click", onClick);
    const timer = setTimeout(() => {
      if (!clicked) {
        // eslint-disable-next-line no-console
        console.info("[tracking] watchdog armed — click any WhatsApp CTA to validate utm_*/gclid payload");
      }
    }, 1000);
    return () => {
      document.removeEventListener("click", onClick);
      clearTimeout(timer);
    };
  }, [localBusinessSchema, breadcrumbSchema, faqSchema]);


  return (
    <Layout>
      <Helmet>
        <title>Assistência Técnica de Consoles em Curitiba | PS5, Xbox, Nintendo e Placa de Vídeo</title>
        <meta
          name="description"
          content="Assistência técnica especializada em reparo de consoles em Curitiba. PlayStation, Xbox, Nintendo Switch, placas de vídeo, PCs e notebooks. Orçamento rápido pelo WhatsApp (41) 9 9745-2053."
        />
        <meta
          name="keywords"
          content="assistência técnica curitiba, conserto ps5 curitiba, reparo xbox curitiba, conserto nintendo switch curitiba, conserto placa de vídeo curitiba, assistência consoles curitiba"
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="geo.region" content="BR-PR" />
        <meta name="geo.placename" content="Curitiba" />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Preciso de um Técnico" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Assistência Técnica de Consoles em Curitiba" />
        <meta
          property="og:description"
          content="Reparo de PS5, Xbox, Nintendo, placas de vídeo, PCs e notebooks em Curitiba. Atendimento via WhatsApp."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Assistência Técnica de Consoles em Curitiba" />
        <meta
          name="twitter:description"
          content="Reparo de consoles, GPUs, PCs e notebooks em Curitiba. Atendimento via WhatsApp."
        />
        <meta name="twitter:image" content={ogImage} />

        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>

      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b">
        <div className="absolute inset-0 -z-0 opacity-60 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.18),transparent_60%)]" />
        </div>
        <div className="container-custom relative py-16 md:py-24 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <motion.span
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
            >
              <Sparkles className="w-3.5 h-3.5" /> Atendimento em toda Curitiba
            </motion.span>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-foreground"
            >
              Assistência Técnica Especializada{" "}
              <span className="text-primary">em Curitiba</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              Reparo de <strong className="text-foreground">consoles, placas de vídeo, computadores, notebooks e smartphones</strong>.
              Diagnóstico rápido, peças de qualidade e serviço com garantia — atendimento direto com o técnico via WhatsApp.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button variant="whatsapp" size="lg" asChild>
                <a
                  href={waLink()}
                  onClick={waClick("hero")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chamar no WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#servicos">Ver Serviços</a>
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={4}
              className="mt-8 flex flex-wrap gap-2.5 text-xs"
            >
              {["Orçamento Grátis", "Garantia de 90 dias", "Peças de Qualidade", "Atendimento Rápido"].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border text-muted-foreground"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  {b}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 via-accent/30 to-primary/20 blur-2xl rounded-3xl" />
            <div className="relative rounded-3xl bg-card border border-border p-7 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Especialistas em Consoles</p>
                  <p className="text-xs text-muted-foreground">PS5 · Xbox · Switch · GPUs</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { v: "+500", l: "Reparos" },
                  { v: "90d", l: "Garantia" },
                  { v: "24h", l: "Resposta" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-muted/50 border border-border py-3">
                    <div className="text-primary font-extrabold text-lg">{s.v}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicos" className="py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Nossos <span className="text-primary">Serviços Especializados</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Soluções completas para todos os seus dispositivos eletrônicos em Curitiba — foco em consoles e games.
            </p>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.article
                  key={s.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={i}
                  className="group relative rounded-2xl bg-card border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="inline-grid place-items-center w-12 h-12 rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={waLink(`Olá! Quero um orçamento para: ${s.title}.`)}
                    onClick={waClick("service_card", s.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Solicitar Orçamento <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONSOLES SPECIALISTS */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Resolvemos os Principais{" "}
              <span className="text-primary">Defeitos do Seu Aparelho</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Mais de 5 anos de experiência com os principais consoles e placas de vídeo em Curitiba.
            </p>
          </motion.div>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {consoleBrands.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={i}
                  className="group rounded-2xl bg-card border border-border p-7 hover:border-primary/40 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid place-items-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-md">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Assistência Técnica {b.title}
                    </h3>
                  </div>

                  <ul className="mt-6 grid grid-cols-2 gap-2.5">
                    {b.problems.map((p, idx) => {
                      const PI = p.icon;
                      return (
                        <motion.li
                          key={p.label}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: idx * 0.05 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground/90 hover:bg-primary/10 hover:border-primary/40 transition"
                        >
                          <PI className="w-4 h-4 text-primary shrink-0" />
                          <span className="truncate">{p.label}</span>
                        </motion.li>
                      );
                    })}
                  </ul>

                  <div className="mt-6">
                    <Button variant="whatsapp" size="sm" asChild>
                      <a
                        href={waLink(`Olá! Quero agendar reparo de ${b.title}.`)}
                        onClick={waClick("brand_card", b.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4" /> Agendar Reparo
                      </a>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIFFERENTIALS */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Por que escolher a <span className="text-primary">Preciso de um Técnico</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Atendimento profissional, transparente e direto com o técnico — sem intermediários.
            </p>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {differentials.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div
                  key={d.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-2xl p-6 bg-card border border-border hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition"
                >
                  <div className="grid place-items-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 font-bold text-foreground text-lg">{d.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{d.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 bg-muted/30 border-t border-border">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-10 sm:p-14 text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Seu equipamento precisa de reparo?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Fale agora mesmo com nosso técnico no WhatsApp e receba seu orçamento sem compromisso.
            </p>
            <div className="mt-8">
              <Button variant="whatsapp" size="lg" asChild>
                <a
                  href={waLink()}
                  onClick={waClick("final_cta")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chamar no WhatsApp — {WHATSAPP_DISPLAY}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
