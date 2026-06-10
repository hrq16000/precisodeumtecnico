import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
  X,
} from "lucide-react";
import { trackWhatsAppClick, trackEvent } from "@/lib/analytics";

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

const WHATSAPP_NUMBER = "5541997452053";
const STORAGE_KEY = "wa-funnel-draft-v1";

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

function loadDraft(): { step: Step; answers: Answers } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return { step: (parsed.step ?? 0) as Step, answers: { ...emptyAnswers, ...parsed.answers } };
  } catch {
    return null;
  }
}

function hasMeaningfulDraft(a: Answers): boolean {
  return Boolean(
    a.path ||
      a.problema.trim() ||
      a.marcaModelo.trim() ||
      a.endereco.trim() ||
      a.observacoes.trim() ||
      a.defeitoPlaca ||
      a.logistica ||
      a.tipoVisita.trim(),
  );
}

export function WhatsAppFunnelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [meta, setMeta] = useState<OpenOptions>({});
  const hasDraftRef = useRef(false);

  // Persist draft as the user types
  useEffect(() => {
    if (!isOpen) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }));
    } catch {
      /* ignore */
    }
  }, [isOpen, step, answers]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const openFunnel = useCallback((opts: OpenOptions = {}) => {
    setMeta(opts);
    const draft = loadDraft();
    if (draft && hasMeaningfulDraft(draft.answers)) {
      hasDraftRef.current = true;
      setStep(draft.step);
      setAnswers(draft.answers);
      trackEvent("whatsapp_funnel_resume", { source: opts.source ?? "unknown" });
    } else {
      hasDraftRef.current = false;
      setStep(0);
      setAnswers(emptyAnswers);
    }
    setOpen(true);
    trackEvent("whatsapp_funnel_open", {
      source: opts.source ?? "unknown",
      service: opts.service,
      city: opts.city,
      bairro: opts.bairro,
      resumed: hasDraftRef.current,
    });
  }, []);

  const closeFunnel = useCallback(
    (opts: { clear?: boolean } = {}) => {
      setOpen(false);
      if (opts.clear) {
        setStep(0);
        setAnswers(emptyAnswers);
        setMeta({});
        clearDraft();
      }
    },
    [clearDraft],
  );

  // Global interceptor
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!/wa\.me\/5541997452053/i.test(href)) return;
      if (anchor.dataset.waDirect === "true") return;
      e.preventDefault();
      const source =
        anchor.dataset.waSource ?? anchor.getAttribute("data-source") ?? "global_anchor";
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
        onClose={closeFunnel}
        step={step}
        setStep={setStep}
        answers={answers}
        setAnswers={setAnswers}
        meta={meta}
        clearDraft={clearDraft}
      />
    </FunnelContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dialog                                                                    */
/* -------------------------------------------------------------------------- */

interface DialogProps {
  isOpen: boolean;
  onClose: (opts?: { clear?: boolean }) => void;
  step: Step;
  setStep: (s: Step) => void;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  meta: OpenOptions;
  clearDraft: () => void;
}

function FunnelDialog({
  isOpen,
  onClose,
  step,
  setStep,
  answers,
  setAnswers,
  meta,
  clearDraft,
}: DialogProps) {
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
    clearDraft();
    onClose({ clear: true });
  }

  // Compute disabled state for "Continuar" per step
  const canContinue = (() => {
    if (step === 0) return Boolean(answers.path);
    if (step === 1) return answers.problema.trim().length > 0;
    if (step === 2) {
      if (answers.path === "reparo") return Boolean(answers.logistica);
      if (answers.path === "visita") return answers.endereco.trim().length > 0;
      return true;
    }
    return true;
  })();

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="p-0 gap-0 border-border max-w-2xl w-[calc(100vw-1rem)] sm:w-full
                   h-[100dvh] sm:h-auto sm:max-h-[88vh] rounded-none sm:rounded-lg
                   flex flex-col overflow-hidden"
      >
        {/* Header — compact + close button */}
        <div className="relative bg-gradient-to-br from-primary/95 to-primary px-3 sm:px-5 pt-3 pb-2 sm:pb-3 text-primary-foreground shrink-0">
          <DialogTitle className="text-[15px] sm:text-lg font-display flex items-center gap-2 pr-8">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            Atendimento WhatsApp
            <span className="ml-auto text-[11px] sm:text-xs font-normal opacity-80">
              Passo {step + 1}/4
            </span>
          </DialogTitle>
          <button
            type="button"
            onClick={() => onClose()}
            aria-label="Fechar (mantém preenchimento)"
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 rounded-full
                       text-primary-foreground/80 hover:text-primary-foreground
                       hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Slim progress bar */}
          <div
            className="mt-2 h-1 w-full rounded-full bg-white/20 overflow-hidden"
            aria-label={`Progresso: passo ${step + 1} de 4`}
          >
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Transparency strip — hidden on very small screens to save space */}
        <div className="hidden xs:block px-3 sm:px-5 pt-2 shrink-0">
          <TransparencyBar />
        </div>

        {/* Scrollable step content */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4">
          {step === 0 && <Step1 answers={answers} setAnswers={setAnswers} />}
          {step === 1 && <Step2 answers={answers} setAnswers={setAnswers} />}
          {step === 2 && <Step3 answers={answers} setAnswers={setAnswers} onAutoSkip={next} />}
          {step === 3 && (
            <Step4 answers={answers} setAnswers={setAnswers} preview={buildMessage()} />
          )}
        </div>

        {/* Sticky footer with safe-area respect */}
        <div
          className="shrink-0 border-t border-border bg-background/95 backdrop-blur
                     px-3 sm:px-5 pt-2.5"
          style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={back}
              disabled={step === 0}
              className="shrink-0"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline ml-1">Voltar</span>
            </Button>

            {step < 3 ? (
              <Button
                onClick={next}
                disabled={!canContinue}
                className="flex-1"
                size="sm"
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="whatsapp"
                onClick={submit}
                className="flex-1"
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Enviar no WhatsApp
              </Button>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1.5 leading-tight">
            <Link to="/termos-orcamento-pre-aprovado" className="underline hover:text-primary">
              Políticas
            </Link>{" "}
            · WhatsApp (41) 9 9745-2053 · fechar mantém os dados
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px] sm:text-[11px]">
      <Pill icon={<MessageCircle className="w-3 h-3" />} title="Orçamento grátis" body="WhatsApp + fotos" />
      <Pill icon={<FileText className="w-3 h-3" />} title="Diagnóstico R$ 90" body="só se não aprovar" />
      <Pill icon={<Home className="w-3 h-3" />} title="Visita R$ 99,99" body="até 30 min" />
      <Pill icon={<Cpu className="w-3 h-3" />} title="Placa R$ 300–500" body="pré-aprovado" />
    </div>
  );
}

function Pill({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/40 px-2 py-1">
      <div className="flex items-center gap-1 font-semibold text-foreground leading-tight">
        {icon}
        {title}
      </div>
      <div className="text-muted-foreground leading-tight">{body}</div>
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
      className={`w-full text-left rounded-lg border-2 px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md ${
        active ? "border-primary bg-primary/5" : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 text-primary shrink-0">{icon}</div>
        <div className="min-w-0">
          <div className="font-semibold text-sm text-foreground">{title}</div>
          {body && <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{body}</div>}
        </div>
      </div>
    </button>
  );
}

/* ---- Steps ---- */

function Step1({
  answers,
  setAnswers,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-display text-sm sm:text-base font-bold">O que você precisa?</h3>
      <OptionCard
        active={answers.path === "reparo"}
        icon={<Wrench className="w-4 h-4" />}
        title="Consertar equipamento"
        body="TV, console, PC, notebook, celular, placa"
        onClick={() => setAnswers((a) => ({ ...a, path: "reparo" }))}
      />
      <OptionCard
        active={answers.path === "visita"}
        icon={<Home className="w-4 h-4" />}
        title="Visita técnica local"
        body="instalação, formatação, impressora, roteador"
        onClick={() => setAnswers((a) => ({ ...a, path: "visita" }))}
      />
      <OptionCard
        active={answers.path === "orcamento"}
        icon={<MessageCircle className="w-4 h-4" />}
        title="Orçamento rápido"
        body="foto/vídeo e descrição"
        onClick={() => setAnswers((a) => ({ ...a, path: "orcamento" }))}
      />
    </div>
  );
}

function Step2({
  answers,
  setAnswers,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
}) {
  return (
    <div className="space-y-2.5">
      <h3 className="font-display text-sm sm:text-base font-bold">Problema e modelo</h3>
      <div className="space-y-1">
        <label className="text-xs sm:text-sm font-medium">Problema ou aparelho</label>
        <Input
          autoFocus
          placeholder="Ex: PS5 não liga · TV sem imagem"
          value={answers.problema}
          onChange={(e) => setAnswers((a) => ({ ...a, problema: e.target.value }))}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs sm:text-sm font-medium">Marca e modelo</label>
        <Input
          placeholder="Ex: PS5 Slim · Dell Inspiron 15"
          value={answers.marcaModelo}
          onChange={(e) => setAnswers((a) => ({ ...a, marcaModelo: e.target.value }))}
        />
      </div>

      {answers.path === "reparo" && (
        <div className="rounded-lg border bg-muted/40 p-2 space-y-1.5">
          <p className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" /> Defeito em placa?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              size="sm"
              variant={answers.defeitoPlaca === "sim" ? "default" : "outline"}
              onClick={() => setAnswers((a) => ({ ...a, defeitoPlaca: "sim" }))}
            >
              Sim
            </Button>
            <Button
              type="button"
              size="sm"
              variant={answers.defeitoPlaca === "nao" ? "default" : "outline"}
              onClick={() => setAnswers((a) => ({ ...a, defeitoPlaca: "nao" }))}
            >
              Não sei
            </Button>
          </div>
          {answers.defeitoPlaca === "sim" && (
            <p className="text-[11px] text-foreground bg-accent/15 border border-accent/30 rounded p-1.5 leading-tight">
              ⚠️ Reparo de placa: mínimo <b>R$ 300</b>. Se desistir: <b>R$ 90</b>.
            </p>
          )}
        </div>
      )}

      {answers.path === "visita" && (
        <div className="space-y-1">
          <label className="text-xs sm:text-sm font-medium">Tipo de serviço</label>
          <Input
            placeholder="Ex: formatar · roteador · impressora"
            value={answers.tipoVisita}
            onChange={(e) => setAnswers((a) => ({ ...a, tipoVisita: e.target.value }))}
          />
          <p className="text-[11px] text-foreground bg-accent/15 border border-accent/30 rounded p-1.5 leading-tight">
            🏠 Visita: <b>R$ 99,99</b> (30 min) · Combo 2h: <b>R$ 299,99</b>.
          </p>
        </div>
      )}
    </div>
  );
}

function Step3({
  answers,
  setAnswers,
  onAutoSkip,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onAutoSkip: () => void;
}) {
  useEffect(() => {
    if (answers.path === "orcamento") onAutoSkip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="space-y-2">
      <h3 className="font-display text-sm sm:text-base font-bold">Como vamos atender?</h3>
      {answers.path === "reparo" && (
        <>
          <OptionCard
            active={answers.logistica === "parceiro"}
            icon={<ShieldCheck className="w-4 h-4" />}
            title="Levo até parceiro em Curitiba (grátis)"
            body="você economiza e acompanha o orçamento"
            onClick={() => setAnswers((a) => ({ ...a, logistica: "parceiro" }))}
          />
          <OptionCard
            active={answers.logistica === "coleta"}
            icon={<Home className="w-4 h-4" />}
            title="Preciso de coleta e entrega"
            body="custo informado no WhatsApp"
            onClick={() => setAnswers((a) => ({ ...a, logistica: "coleta" }))}
          />
        </>
      )}
      {answers.path === "visita" && (
        <div className="space-y-1">
          <label className="text-xs sm:text-sm font-medium">Endereço + bairro</label>
          <Input
            placeholder="Rua, número, bairro, cidade"
            value={answers.endereco}
            onChange={(e) => setAnswers((a) => ({ ...a, endereco: e.target.value }))}
          />
        </div>
      )}
    </div>
  );
}

function Step4({
  answers,
  setAnswers,
  preview,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  preview: string;
}) {
  return (
    <div className="space-y-2.5">
      <h3 className="font-display text-sm sm:text-base font-bold">Revisar e enviar</h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
        Detalhes opcionais. Anexe fotos direto no WhatsApp.
      </p>
      <textarea
        className="w-full min-h-[60px] rounded-md border border-input bg-background p-2 text-sm"
        placeholder="Detalhes adicionais (opcional)"
        value={answers.observacoes}
        onChange={(e) => setAnswers((a) => ({ ...a, observacoes: e.target.value }))}
      />

      <details className="rounded-lg border bg-muted/30 p-2 text-xs">
        <summary className="cursor-pointer font-medium text-foreground">
          Ver resumo da mensagem
        </summary>
        <pre className="whitespace-pre-wrap mt-1.5 font-sans text-muted-foreground">{preview}</pre>
      </details>

      <div className="rounded-lg bg-success/10 border border-success/30 p-2 text-xs sm:text-sm flex gap-2">
        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
        <span>Resposta em até 30 min. Garantia de 90 dias.</span>
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
