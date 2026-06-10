import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Monitor,
  Laptop,
  Smartphone,
  Cpu,
  Wrench,
  MessageCircle,
  Star,
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
} from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";

const WHATSAPP_NUMBER = "5541997452053";
const WHATSAPP_DISPLAY = "(41) 9 9745-2053";
const DEFAULT_WA_TEXT = "Olá, preciso de um orçamento de assistência técnica em Curitiba.";
const waLink = (text = DEFAULT_WA_TEXT) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const waClick = (source: string, service?: string) => () =>
  trackWhatsAppClick({ source: `curitiba_lp_${source}`, service, city: "Curitiba" });


const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const services = [
  {
    icon: Gamepad2,
    title: "Assistência Técnica para Consoles",
    desc: "PlayStation, Xbox, Nintendo Switch e mais. Reparo completo com garantia.",
    items: [
      "Consoles que não ligam",
      "Superaquecimento e limpeza preventiva",
      "Leitor de discos e troca de HDD/SSD",
      "Reballing e reparo de placa",
    ],
  },
  {
    icon: Monitor,
    title: "Assistência Técnica para Computadores",
    desc: "Montagem, manutenção e upgrade em PCs gamer e corporativos.",
    items: [
      "Montagem de PCs gamer",
      "Diagnóstico e reparo de falhas",
      "Upgrade de componentes",
      "Recuperação de dados",
    ],
  },
  {
    icon: Laptop,
    title: "Assistência Técnica para Notebooks",
    desc: "Todas as marcas: Dell, HP, Lenovo, Asus, Acer, Samsung, Apple.",
    items: [
      "Troca de tela e teclado",
      "Reparo de placa-mãe",
      "Upgrade para SSD",
      "Substituição de bateria",
    ],
  },
  {
    icon: Smartphone,
    title: "Assistência Técnica para Smartphones",
    desc: "iPhone, Samsung, Xiaomi, Motorola e demais marcas.",
    items: [
      "Troca de tela quebrada",
      "Substituição de bateria",
      "Reparo de conectores",
      "Recuperação de dados",
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

export default function AssistenciaTecnicaCuritiba() {
  const pageUrl = "https://precisodeumtecnico.com/assistencia-tecnica-curitiba";
  const ogImage = "https://precisodeumtecnico.com/og-image.jpg";
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Preciso de um Técnico",
    description:
      "Assistência técnica especializada em Curitiba: reparo de consoles, computadores, notebooks, smartphones e placas de vídeo.",
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 antialiased selection:bg-cyan-400/30">
      <Helmet>
        <title>Assistência Técnica em Curitiba | Consoles, PC, Notebook e Celular</title>
        <meta
          name="description"
          content="Reparo de PS5, Xbox, Nintendo, computadores, notebooks, celulares e placas de vídeo em Curitiba. Diagnóstico grátis, garantia e atendimento via WhatsApp (41) 9 9745-2053."
        />
        <meta name="keywords" content="assistência técnica curitiba, conserto ps5 curitiba, reparo xbox curitiba, troca de tela notebook curitiba, conserto placa de vídeo curitiba, assistência celular curitiba" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="geo.region" content="BR-PR" />
        <meta name="geo.placename" content="Curitiba" />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Preciso de um Técnico" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Assistência Técnica Especializada em Curitiba" />
        <meta
          property="og:description"
          content="Reparo de consoles, computadores, notebooks, smartphones e placas de vídeo em Curitiba. Atendimento via WhatsApp."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Assistência Técnica Especializada em Curitiba" />
        <meta name="twitter:description" content="Reparo de consoles, PC, notebooks, smartphones e GPUs em Curitiba. Atendimento via WhatsApp." />
        <meta name="twitter:image" content={ogImage} />

        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0a]/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/30">
              <Wrench className="w-4 h-4 text-[#0a0a0a]" />
            </span>
            <span className="text-base sm:text-lg">
              Preciso de um <span className="text-cyan-400">Técnico</span>
            </span>
          </a>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.2),transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-5 pt-20 pb-24 sm:pt-28 sm:pb-32 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <motion.span
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-300"
            >
              <Sparkles className="w-3.5 h-3.5" /> Atendimento em toda Curitiba
            </motion.span>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]"
            >
              Assistência Técnica{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Especializada em Curitiba
              </span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="mt-5 text-lg text-slate-300/90 max-w-2xl leading-relaxed"
            >
              Reparo profissional de <strong className="text-white">consoles, computadores, notebooks, smartphones e placas de vídeo</strong>.
              Diagnóstico rápido, peças de qualidade e serviço com garantia — atendimento direto com o técnico via WhatsApp.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 text-[#04140d] font-bold shadow-[0_0_0_0_rgba(16,185,129,0.6)] hover:shadow-[0_0_40px_0_rgba(16,185,129,0.55)] transition-all duration-300 hover:scale-[1.03]"
              >
                <span className="absolute inset-0 rounded-xl bg-emerald-400 opacity-0 group-hover:opacity-20 animate-pulse" />
                <MessageCircle className="w-5 h-5" />
                Chamar no WhatsApp
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#servicos"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 hover:border-cyan-400/50 transition"
              >
                Ver Serviços
              </a>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {b}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Rating card */}
          <motion.aside
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/40 via-cyan-400/30 to-violet-500/40 blur-2xl rounded-3xl" />
            <div className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.03] border border-white/10 backdrop-blur-xl p-7 shadow-2xl">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
                <span className="ml-2 text-white text-xl font-bold">4,9</span>
              </div>
              <p className="mt-3 text-slate-200 font-semibold">
                Nossos clientes confiam na qualidade técnica
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Avaliações reais de quem já confiou seu equipamento à equipe Preciso de um Técnico.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { v: "+500", l: "Reparos" },
                  { v: "90d", l: "Garantia" },
                  { v: "24h", l: "Resposta" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-black/30 border border-white/5 py-3">
                    <div className="text-cyan-300 font-extrabold text-lg">{s.v}</div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicos" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Nossos <span className="text-cyan-400">Serviços Especializados</span>
            </h2>
            <p className="mt-3 text-slate-400">
              Soluções completas para todos os seus dispositivos eletrônicos em Curitiba.
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
                  className="group relative rounded-2xl bg-[#111827] border border-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_20px_60px_-20px_rgba(34,211,238,0.35)]"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-violet-500/0 group-hover:from-cyan-500/5 group-hover:via-blue-500/5 group-hover:to-violet-500/10 transition" />
                  <div className="relative">
                    <div className="inline-grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-cyan-400/20 text-cyan-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-400">{s.desc}</p>
                    <ul className="mt-4 space-y-2">
                      {s.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={waLink(`Olá! Quero um orçamento para: ${s.title}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition"
                    >
                      Ver Detalhes <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONSOLES SPECIALISTS */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Resolvemos os Principais{" "}
              <span className="text-cyan-400">Defeitos do Seu Aparelho</span>
            </h2>
            <p className="mt-3 text-slate-400">
              Mais de 5 anos de experiência com os principais consoles e placas de vídeo do mercado em Curitiba.
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
                  className="group rounded-2xl bg-[#111827] border border-white/5 p-7 hover:border-cyan-400/30 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-[#0a0a0a] shadow-lg shadow-cyan-500/20">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
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
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/5 text-sm text-slate-200 hover:bg-cyan-400/10 hover:border-cyan-400/30 transition"
                        >
                          <PI className="w-4 h-4 text-cyan-300 shrink-0" />
                          <span className="truncate">{p.label}</span>
                        </motion.li>
                      );
                    })}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <a
              href={waLink("Olá! Quero enviar meu console ou placa de vídeo para reparo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-emerald-500 text-[#04140d] font-bold hover:shadow-[0_0_40px_0_rgba(16,185,129,0.5)] hover:scale-[1.03] transition"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar Console ou Placa para Reparo
            </a>
          </div>
        </div>
      </section>

      {/* DIFFERENTIALS */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Por que escolher a <span className="text-cyan-400">Preciso de um Técnico</span>
            </h2>
            <p className="mt-3 text-slate-400">
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
                  className="rounded-2xl p-6 bg-[#111827] border border-white/5 hover:border-violet-400/30 hover:-translate-y-1 transition"
                >
                  <div className="grid place-items-center w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-400/20 text-violet-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 font-bold text-white text-lg">{d.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-400">{d.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-violet-600/20 p-10 sm:p-14 text-center"
          >
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Seu equipamento precisa de reparo?
              </h2>
              <p className="mt-3 text-slate-300 max-w-xl mx-auto">
                Fale agora mesmo com nosso técnico no WhatsApp e receba seu orçamento sem compromisso.
              </p>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-[#04140d] font-bold text-lg hover:shadow-[0_0_50px_0_rgba(16,185,129,0.55)] hover:scale-[1.03] transition"
              >
                <MessageCircle className="w-6 h-6" />
                Chamar no WhatsApp — {WHATSAPP_DISPLAY}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>
            <span className="font-bold text-white">Preciso de um Técnico</span> — Assistência Técnica Especializada em Curitiba.
          </p>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chamar no WhatsApp"
        className="fixed bottom-5 right-5 z-50 group"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40" />
        <span className="relative grid place-items-center w-16 h-16 rounded-full bg-emerald-500 text-[#04140d] shadow-2xl shadow-emerald-500/40 group-hover:scale-110 transition">
          <MessageCircle className="w-7 h-7" />
        </span>
      </a>
    </div>
  );
}
