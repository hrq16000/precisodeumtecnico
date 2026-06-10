import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Wrench,
  Home,
  FileText,
  Cpu,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Info,
  CheckCircle2,
} from "lucide-react";
import { trackWhatsAppClick, trackEvent } from "@/lib/analytics";

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

const WHATSAPP_NUMBER = "5541997452053";

type OpenOptions = { source?: string; service?: string; city?: string; bairro?: string };

interface FunnelContextValue {
  open: (opts?: OpenOptions) => void;
}

const FunnelContext = createContext<FunnelContextValue | null>(null);

export function useWhatsAppFunnel() {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error("useWhatsAppFunnel must be used inside <WhatsAppFunnelProvider>");
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Provider + Global anchor interceptor                                      */
/* -------------------------------------------------------------------------- */

type Step = 0 | 1 | 2 | 3;
type Path = "reparo" | "visita" | "orcamento" | null;

interface Answers {
  path: Path;
  problema: string;
  marcaModelo: string;
  defeitoPlaca: "sim" | "nao" | null;
  tipoVisita: string;
  logistica: "parceiro" | "coleta" | null;
  endereco: string;
  observacoes: string;
}

const emptyAnswers: Answers = {
  path: null,
  problema: "",
  marcaModelo: "",
  defeitoPlaca: null,
  tipoVisita: "",
  logistica: null,
  endereco: "",
  observacoes: "",
};

export function WhatsAppFunnelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [meta, setMeta] = useState<OpenOptions>({});

  const reset = useCallback(() => {
    setStep(0);
    setAnswers(emptyAnswers);
    setMeta({});
  }, []);

  const openFunnel = useCallback((opts: OpenOptions = {}) => {
    setMeta(opts);
    setStep(0);
    setAnswers(emptyAnswers);
    setOpen(true);
    trackEvent("whatsapp_funnel_open", {
      source: opts.source ?? "unknown",
      service: opts.service,
      city: opts.city,
      bairro: opts.bairro,
    });
  }, []);

  // Global interceptor: any anchor pointing at our wa.me number opens the funnel
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!/wa\.me\/5541997452053/i.test(href)) return;
      // Allow opt-out for raw send (e.g. final modal button itself uses data-wa-direct)
      if (anchor.dataset.waDirect === "true") return;
      e.preventDefault();
      const source =
        anchor.dataset.waSource ??
        anchor.getAttribute("data-source") ??
        "global_anchor";
      openFunnel({ source });
    }
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [openFunnel]);

  const value = useMemo(() => ({ open: openFunnel }), [openFunnel]);

  return (
    <FunnelContext.Provider value={value}>
      {children}
      <FunnelDialog
        isOpen={isOpen}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        step={step}
        setStep={setStep}
        answers={answers}
        setAnswers={setAnswers}
        meta={meta}
      />
    </FunnelContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dialog                                                                    */
/* -------------------------------------------------------------------------- */

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  step: Step;
  setStep: (s: Step) => void;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  meta: OpenOptions;
}

function FunnelDialog({ isOpen, onClose, step, setStep, answers, setAnswers, meta }: DialogProps) {
  const next = () => setStep(Math.min(3, (step + 1) as Step) as Step);
  const back = () => setStep(Math.max(0, (step - 1) as Step) as Step);

  function buildMessage(): string {
    const lines: string[] = [];
    lines.push("Olá! Vim do site Preciso de um Técnico e gostaria de um atendimento.");
    lines.push("");
    if (answers.path === "reparo") lines.push("• Tipo: Conserto de equipamento");
    if (answers.path === "visita") lines.push("• Tipo: Visita técnica local");
    if (answers.path === "orcamento") lines.push("• Tipo: Orçamento rápido");
    if (answers.problema) lines.push(`• Problema/Aparelho: ${answers.problema}`);
    if (answers.marcaModelo) lines.push(`• Marca/Modelo: ${answers.marcaModelo}`);
    if (answers.path === "reparo" && answers.defeitoPlaca) {
      lines.push(
        `• Defeito em placa: ${answers.defeitoPlaca === "sim" ? "Sim" : "Não tenho certeza/Não"}`,
      );
    }
    if (answers.path === "visita" && answers.tipoVisita)
      lines.push(`• Serviço da visita: ${answers.tipoVisita}`);
    if (answers.logistica) {
      lines.push(
        `• Logística: ${answers.logistica === "parceiro" ? "Levo até parceiro em Curitiba" : "Preciso de coleta/entrega"}`,
      );
    }
    if (answers.endereco) lines.push(`• Endereço: ${answers.endereco}`);
    if (answers.observacoes) lines.push(`• Observações: ${answers.observacoes}`);
    lines.push("");
    lines.push("📌 Estou ciente das políticas de atendimento:");
    lines.push("- Orçamento por WhatsApp: gratuito (envio fotos/vídeos).");
    lines.push("- Visita técnica: a partir de R$ 99,99 (até 30 min) · Combo 2h: R$ 299,99.");
    lines.push("- Diagnóstico em bancada: R$ 90 (apenas se eu não aprovar o reparo).");
    lines.push("- Reparo de placas/TV/Console/PC: mínimo pré-aprovado R$ 300 a R$ 500.");
    lines.push("");
    lines.push("Vou enviar fotos, vídeos e endereço aqui. Aguardo retorno em até 30 min.");
    return lines.join("\n");
  }

  function submit() {
    const text = buildMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    trackWhatsAppClick({
      source: `funnel:${meta.source ?? "unknown"}`,
      service: meta.service,
      city: meta.city,
      bairro: meta.bairro,
    });
    trackEvent("whatsapp_funnel_submit", {
      source: meta.source ?? "unknown",
      path: answers.path ?? "unknown",
      defeito_placa: answers.defeitoPlaca ?? "",
      logistica: answers.logistica ?? "",
    });
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[82vh] overflow-hidden p-0 flex flex-col">
        <div className="bg-gradient-to-br from-primary/95 to-primary p-4 sm:p-5 text-primary-foreground shrink-0">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-display flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Atendimento WhatsApp · 4 passos
            </DialogTitle>
          </DialogHeader>
          <p className="text-primary-foreground/85 text-xs sm:text-sm mt-1">
            Conta o essencial pra gente chegar com a resposta certa.
          </p>
        </div>

        <div className="px-4 sm:px-5 pt-3 shrink-0">
          <TransparencyBar />
        </div>

        <div className="px-4 sm:px-5 py-4 flex-1 overflow-y-auto">
          <Stepper current={step} />
          <div className="mt-4">
            {step === 0 && <Step1 answers={answers} setAnswers={setAnswers} onNext={next} />}
            {step === 1 && (
              <Step2
                answers={answers}
                setAnswers={setAnswers}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 2 && (
              <Step3
                answers={answers}
                setAnswers={setAnswers}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 3 && (
              <Step4
                answers={answers}
                setAnswers={setAnswers}
                onBack={back}
                onSubmit={submit}
                preview={buildMessage()}
              />
            )}
          </div>
        </div>

        <div className="px-4 sm:px-5 pb-3 shrink-0">
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
            <Link to="/termos-orcamento-pre-aprovado" className="underline hover:text-primary">
              Políticas de serviço e termos
            </Link>{" "}
            · WhatsApp (41) 9 9745-2053
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function TransparencyBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] sm:text-[11px]">
      <Pill icon={<MessageCircle className="w-3 h-3" />} title="Orçamento grátis" body="WhatsApp + fotos" />
      <Pill icon={<FileText className="w-3 h-3" />} title="Diagnóstico R$ 90" body="só se não aprovar" />
      <Pill icon={<Home className="w-3 h-3" />} title="Visita a partir R$ 99,99" body="até 30 min" />
      <Pill icon={<Cpu className="w-3 h-3" />} title="Reparo placa: R$ 300–500" body="pré-aprovado" />
    </div>
  );
}

function Pill({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/40 px-2 py-1.5">
      <div className="flex items-center gap-1 font-semibold text-foreground">
        {icon}
        {title}
      </div>
      <div className="text-muted-foreground leading-tight mt-0.5">{body}</div>
    </div>
  );
}

function Stepper({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Passo ${current + 1} de 4`}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i <= current ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

function OptionCard({
  active,
  icon,
  title,
  body,
  onClick,
}: {
  active?: boolean;
  icon: ReactNode;
  title: string;
  body?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${
        active ? "border-primary bg-primary/5" : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-primary">{icon}</div>
        <div>
          <div className="font-semibold text-foreground">{title}</div>
          {body && <div className="text-sm text-muted-foreground mt-0.5">{body}</div>}
        </div>
      </div>
    </button>
  );
}

/* ---- Steps ---- */

function Step1({
  answers,
  setAnswers,
  onNext,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onNext: () => void;
}) {
  function pick(path: Path) {
    setAnswers((a) => ({ ...a, path }));
    setTimeout(onNext, 120);
  }
  return (
    <div className="space-y-2">
      <h3 className="font-display text-base font-bold">1. O que você precisa?</h3>
      <OptionCard
        active={answers.path === "reparo"}
        icon={<Wrench className="w-5 h-5" />}
        title="Consertar equipamento"
        body="TV, console, PC, notebook, celular, placa"
        onClick={() => pick("reparo")}
      />
      <OptionCard
        active={answers.path === "visita"}
        icon={<Home className="w-5 h-5" />}
        title="Visita técnica local"
        body="instalação, formatação, impressora, roteador"
        onClick={() => pick("visita")}
      />
      <OptionCard
        active={answers.path === "orcamento"}
        icon={<MessageCircle className="w-5 h-5" />}
        title="Orçamento rápido"
        body="foto/vídeo e descrição"
        onClick={() => pick("orcamento")}
      />
    </div>
  );
}

function Step2({
  answers,
  setAnswers,
  onNext,
  onBack,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-bold">2. Conta o problema e o modelo</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">Qual o problema ou aparelho?</label>
        <Input
          autoFocus
          placeholder="Ex: PS5 não liga · TV Samsung sem imagem · placa com superaquecimento"
          value={answers.problema}
          onChange={(e) => setAnswers((a) => ({ ...a, problema: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Marca e modelo</label>
        <Input
          placeholder="Ex: PlayStation 5 Slim · Notebook Dell Inspiron 15 · TV Samsung 55"
          value={answers.marcaModelo}
          onChange={(e) => setAnswers((a) => ({ ...a, marcaModelo: e.target.value }))}
        />
      </div>

      {answers.path === "reparo" && (
        <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
          <p className="text-sm font-medium flex items-center gap-1.5">
            <Info className="w-4 h-4 text-primary" /> O defeito é em placa? (não liga, tela preta, artefatos, superaquecimento)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={answers.defeitoPlaca === "sim" ? "default" : "outline"}
              onClick={() => setAnswers((a) => ({ ...a, defeitoPlaca: "sim" }))}
            >
              Sim
            </Button>
            <Button
              type="button"
              variant={answers.defeitoPlaca === "nao" ? "default" : "outline"}
              onClick={() => setAnswers((a) => ({ ...a, defeitoPlaca: "nao" }))}
            >
              Não / não sei
            </Button>
          </div>
          {answers.defeitoPlaca === "sim" && (
            <p className="text-xs text-foreground bg-accent/15 border border-accent/30 rounded p-2">
              ⚠️ Valor mínimo pré-aprovado de reparo de placa: <b>R$ 300</b> (diagnóstico incluso quando aprovado). Se desistir após análise: <b>R$ 90</b>.
            </p>
          )}
        </div>
      )}

      {answers.path === "visita" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Qual tipo de serviço na visita?</label>
          <Input
            placeholder="Ex: instalar programa · formatar · configurar roteador · tomada"
            value={answers.tipoVisita}
            onChange={(e) => setAnswers((a) => ({ ...a, tipoVisita: e.target.value }))}
          />
          <p className="text-xs text-foreground bg-accent/15 border border-accent/30 rounded p-2">
            🏠 Visita: <b>R$ 99,99</b> por até 30 min · Combo 2h: <b>R$ 299,99</b>. Não inclui peças nem estacionamento.
          </p>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button onClick={onNext} disabled={!answers.problema.trim()}>
          Continuar <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function Step3({
  answers,
  setAnswers,
  onNext,
  onBack,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onNext: () => void;
  onBack: () => void;
}) {
  // For "orcamento" path we don't need this step — skip forward
  useEffect(() => {
    if (answers.path === "orcamento") onNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-bold">3. Como vamos atender?</h3>
      {answers.path === "reparo" && (
        <>
          <OptionCard
            active={answers.logistica === "parceiro"}
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Levo até um parceiro em Curitiba (grátis)"
            body="você economiza e acompanha o orçamento"
            onClick={() => setAnswers((a) => ({ ...a, logistica: "parceiro" }))}
          />
          <OptionCard
            active={answers.logistica === "coleta"}
            icon={<Home className="w-5 h-5" />}
            title="Preciso de coleta e entrega"
            body="custo informado no WhatsApp"
            onClick={() => setAnswers((a) => ({ ...a, logistica: "coleta" }))}
          />
        </>
      )}
      {answers.path === "visita" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Endereço completo + bairro</label>
          <Input
            placeholder="Rua, número, bairro, cidade — usaremos só para agendar"
            value={answers.endereco}
            onChange={(e) => setAnswers((a) => ({ ...a, endereco: e.target.value }))}
          />
        </div>
      )}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={
            (answers.path === "reparo" && !answers.logistica) ||
            (answers.path === "visita" && !answers.endereco.trim())
          }
        >
          Continuar <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function Step4({
  answers,
  setAnswers,
  onBack,
  onSubmit,
  preview,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onBack: () => void;
  onSubmit: () => void;
  preview: string;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-bold">4. Algo mais antes de abrir o WhatsApp?</h3>
      <p className="text-sm text-muted-foreground">
        Você pode descrever detalhes adicionais. Depois é só anexar fotos e vídeos direto no chat.
      </p>
      <textarea
        className="w-full min-h-[90px] rounded-md border border-input bg-background p-3 text-sm"
        placeholder="Detalhes adicionais (opcional)"
        value={answers.observacoes}
        onChange={(e) => setAnswers((a) => ({ ...a, observacoes: e.target.value }))}
      />

      <details className="rounded-lg border bg-muted/30 p-3 text-xs">
        <summary className="cursor-pointer font-medium text-foreground">
          Ver pré-visualização da mensagem
        </summary>
        <pre className="whitespace-pre-wrap mt-2 font-sans text-muted-foreground">{preview}</pre>
      </details>

      <div className="rounded-lg bg-success/10 border border-success/30 p-3 text-sm flex gap-2">
        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
        <span>Resposta humana em até 30 minutos. Garantia de 90 dias no serviço executado.</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button variant="whatsapp" size="lg" onClick={onSubmit} className="flex-1 sm:flex-none">
          <MessageCircle className="w-5 h-5" /> Abrir WhatsApp com resumo
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Convenience: a small transparency text to put under WhatsApp CTAs          */
/* -------------------------------------------------------------------------- */
export function WhatsAppTransparencyNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-muted-foreground leading-relaxed ${className}`}>
      📌 <b>Transparência:</b> orçamento grátis por WhatsApp (envie fotos). Visita técnica a partir de{" "}
      <b>R$ 99,99</b> (até 30 min). Diagnóstico em bancada: <b>R$ 90</b> (só se não aprovar). Reparo de
      placas: pré-aprovado entre <b>R$ 300 e R$ 500</b>.{" "}
      <Link to="/termos-orcamento-pre-aprovado" className="underline hover:text-primary">
        Ver políticas
      </Link>
      .
    </p>
  );
}
