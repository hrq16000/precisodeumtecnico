import { useMemo, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Loader2,
  ShieldAlert, Zap, X, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { SYMPTOMS } from "@/data/symptoms";
import {
  CATEGORIES, buildPayload, canAdvance, getSymptom, makeInitialState, reducer,
  type Category,
} from "./triageMachine";
import { MediaUploader } from "./MediaUploader";

interface TriageWizardProps {
  /** Categoria pré-selecionada (vinda do CTA da página). */
  initialCategory?: Category;
  /** Slug do sintoma pré-selecionado (vindo de hub /sintomas/:slug). */
  initialSymptomSlug?: string;
  /** Origem (rastreável em leads.source) — ex.: "hero", "float", "bairro_centro". */
  source?: string;
  /** Fechamento quando renderizado em Dialog/Sheet. */
  onClose?: () => void;
}

const STEP_LABELS: Record<string, string> = {
  category: "1 · Categoria",
  device: "2 · Aparelho",
  symptom: "3 · Sintoma",
  branch: "4 · Detalhes",
  contact: "5 · Contato",
  accept: "6 · Aceite",
};


const STEP_ORDER: string[] = ["category", "device", "symptom", "branch", "contact", "accept"];

export function TriageWizard({
  initialCategory, initialSymptomSlug, source = "triagem-preview", onClose,
}: TriageWizardProps) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const s = makeInitialState();
    if (initialCategory) s.category = initialCategory;
    if (initialSymptomSlug) {
      const found = SYMPTOMS.find((sy) => sy.slug === initialSymptomSlug);
      if (found) {
        s.symptomSlug = found.slug;
        s.category = found.category as Category;
      }
    }
    return s;
  });
  const [lastPayload, setLastPayload] = useState<unknown>(null);
  const [exited, setExited] = useState(false);

  const stepIdx = Math.max(0, STEP_ORDER.indexOf(state.step));
  const progressPct = state.step === "done"
    ? 100
    : Math.round(((stepIdx + 1) / STEP_ORDER.length) * 100);

  const sym = getSymptom(state);
  const symptomsForCat = useMemo(
    () => (state.category ? SYMPTOMS.filter((s) => s.category === state.category) : SYMPTOMS),
    [state.category],
  );

  const handleSubmit = async () => {
    dispatch({ type: "START_SUBMIT" });
    const payload = buildPayload(state, source);
    setLastPayload(payload);
    try {
      // Captura metadados leves (server-side já reforça com IP via edge function).
      const enriched = {
        ...payload,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
        referrer: typeof document !== "undefined" ? document.referrer.slice(0, 1000) : null,
      };
      const { error } = await supabase.from("leads").insert(enriched as never);
      if (error) throw error;
      dispatch({ type: "SUBMIT_OK" });
    } catch (e) {
      dispatch({ type: "SUBMIT_ERR", message: (e as Error).message || "Falha ao enviar." });
    }
  };

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card shadow-xl">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Zap className="h-4 w-4 text-primary" />
          Triagem técnica
          {!exited && state.step !== "submitting" && state.step !== "done" && state.step !== "error" && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {STEP_LABELS[state.step] ?? state.step}
            </span>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        )}
      </header>

      {/* Progress bar */}
      {!exited && !["submitting", "done", "error"].includes(state.step) && (
        <div className="h-1 w-full bg-muted" aria-hidden>
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Body */}
      <div key={exited ? "exited" : state.step} className="space-y-5 px-5 py-6 animate-in fade-in slide-in-from-bottom-1 duration-300">
        {exited && (
          <section className="space-y-4 py-4 text-center">
            <h2 className="text-xl font-bold">Agradecemos o seu tempo.</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nosso foco é oferecer um serviço técnico definitivo, transparente e de altíssima qualidade.
              Entendemos que este pode não ser o seu momento. Sempre que pensar{" "}
              <em>"preciso de uma solução"</em> altamente qualificada para resolver problemas sem dor de cabeça,
              acesse:
            </p>
            <a
              href="https://www.mestredosservicos.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold text-primary underline underline-offset-4"
            >
              www.mestredosservicos.com.br
            </a>
            <p className="text-sm text-muted-foreground">Estaremos de portas abertas.</p>
            {onClose && (
              <Button variant="outline" onClick={onClose} className="mt-4">Fechar</Button>
            )}
          </section>
        )}

        {!exited && state.step === "category" && (
          <section>
            <h2 className="mb-3 text-lg font-bold">Qual é o aparelho?</h2>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => dispatch({ type: "SET_CATEGORY", value: c.value })}
                  className={cn(
                    "min-h-[88px] rounded-xl border-2 p-4 text-left transition active:scale-[0.98]",
                    state.category === c.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="text-2xl">{c.emoji}</div>
                  <div className="mt-1 text-sm font-semibold">{c.label}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {!exited && state.step === "device" && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Marca e modelo</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={state.brand}
                  maxLength={80}
                  onChange={(e) => dispatch({ type: "SET_DEVICE", brand: e.target.value, model: state.model })}
                  placeholder="Samsung, LG, Sony…"
                />
              </div>
              <div>
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  value={state.model}
                  maxLength={120}
                  onChange={(e) => dispatch({ type: "SET_DEVICE", brand: state.brand, model: e.target.value })}
                  placeholder="Ex.: 55Q60T / iPhone 13 / PS5 Slim"
                />
              </div>
            </div>
          </section>
        )}

        {state.step === "symptom" && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Qual o sintoma?</h2>
            <div className="space-y-2">
              {symptomsForCat.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => dispatch({ type: "SET_SYMPTOM", slug: s.slug })}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition",
                    state.symptomSlug === s.slug
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div>
                    <p className="font-semibold">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.shortDescription}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))}
            </div>
            <div className="pt-2">
              <Label htmlFor="custom">Outro sintoma (descreva)</Label>
              <Textarea
                id="custom"
                value={state.symptomCustom ?? ""}
                maxLength={5000}
                onChange={(e) => dispatch({ type: "SET_SYMPTOM", slug: "", custom: e.target.value })}
                placeholder="Descreva o defeito com o máximo de detalhes…"
              />
            </div>
          </section>
        )}

        {state.step === "branch" && sym && (
          <section className="space-y-4">
            {/* === 4a · COLETA (gate impositivo) === */}
            {sym.triage.mode === "coleta" && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border-2 border-amber-500 bg-amber-500/10 p-4">
                  <ShieldAlert className="mt-0.5 h-6 w-6 text-amber-600" />
                  <div className="space-y-2 text-sm">
                    <p className="text-base font-extrabold uppercase">
                      Atenção: este reparo é por COLETA, em bancada.
                    </p>
                    <p>
                      Para o sintoma <strong>“{sym.label}”</strong> trabalhamos com
                      orçamento mínimo pré-aprovado de{" "}
                      <strong>R$ {sym.triage.ticketMin.toLocaleString("pt-BR")}</strong> a{" "}
                      <strong>R$ {sym.triage.ticketMax.toLocaleString("pt-BR")}</strong>.
                    </p>
                    <p>
                      Prazo realista: <strong>{sym.triage.slaMinDays} a {sym.triage.slaMaxDays} dias</strong>,
                      conforme disponibilidade de peça. Coleta e devolução R$ 99,99,
                      abatido em caso de aprovação.{" "}
                      <Link to="/termos-orcamento-pre-aprovado" className="underline">
                        Ver termos
                      </Link>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    onClick={() => dispatch({ type: "ACK_GATE" })}
                    className={cn(state.acknowledgedGate && "ring-2 ring-primary")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Entendi e quero continuar
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Sair
                  </Button>
                </div>
              </div>
            )}

            {/* === 4b · UPLOADER (sintoma de tela/display) === */}
            {sym.triage.mediaRequired && sym.triage.mode !== "coleta" && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold">Envie 3 fotos e 1 vídeo curto</h2>
                <p className="text-sm text-muted-foreground">
                  Sem essas mídias não conseguimos diagnosticar à distância — o atendimento será cancelado.
                </p>
                <MediaUploader
                  sessionId={state.sessionId}
                  paths={state.mediaPaths}
                  onAdd={(path) => dispatch({ type: "ADD_MEDIA", path })}
                  onRemove={(path) => dispatch({ type: "REMOVE_MEDIA", path })}
                />
              </div>
            )}

            {/* === 4c · VISITA RÁPIDA (CEP/bairro) === */}
            {sym.triage.mode === "visita" && !sym.triage.mediaRequired && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold">Onde será a visita?</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={state.cep}
                      onChange={(e) => dispatch({ type: "SET_LOCATION", cep: e.target.value, bairro: state.bairro })}
                      placeholder="80000-000"
                      maxLength={9}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={state.bairro}
                      maxLength={120}
                      onChange={(e) => dispatch({ type: "SET_LOCATION", cep: state.cep, bairro: e.target.value })}
                      placeholder="Centro, Batel…"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Visita técnica de 30 min: <strong>R$ 99,99</strong>. Abatido em caso de fechamento.
                </p>
              </div>
            )}
          </section>
        )}

        {state.step === "contact" && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Seu contato</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={state.contact.name}
                  maxLength={200}
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "name", value: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">WhatsApp</Label>
                <Input
                  id="phone"
                  value={state.contact.phone}
                  maxLength={50}
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "phone", value: e.target.value })}
                  placeholder="(41) 9 9999-9999"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={state.contact.email}
                  maxLength={320}
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "email", value: e.target.value })}
                />
              </div>
            </div>
          </section>
        )}

        {state.step === "accept" && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold">Aceite obrigatório</h2>
            <p className="text-sm text-muted-foreground">
              Marque os três itens para liberar o envio. Estes termos estão registrados no momento do envio.
            </p>
            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
                <Checkbox
                  checked={state.accepts.bancada}
                  onCheckedChange={(v) =>
                    dispatch({ type: "TOGGLE_ACCEPT", key: "bancada", value: v === true })
                  }
                />
                <span>
                  Aceito o valor de <strong>R$ 90,00</strong> para atendimento em bancada (sem visita).
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
                <Checkbox
                  checked={state.accepts.visita}
                  onCheckedChange={(v) =>
                    dispatch({ type: "TOGGLE_ACCEPT", key: "visita", value: v === true })
                  }
                />
                <span>
                  Aceito o valor de <strong>R$ 99,99</strong> pela visita técnica de até 30 min — abatido se o serviço for fechado.
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
                <Checkbox
                  checked={state.accepts.sla}
                  onCheckedChange={(v) =>
                    dispatch({ type: "TOGGLE_ACCEPT", key: "sla", value: v === true })
                  }
                />
                <span>
                  Estou ciente do SLA realista informado para o sintoma escolhido e dos{" "}
                  <Link to="/termos-orcamento-pre-aprovado" className="underline">
                    Termos de Orçamento Pré-Aprovado
                  </Link>.
                </span>
              </label>
            </div>
          </section>
        )}

        {state.step === "submitting" && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Enviando triagem segura…</p>
          </div>
        )}

        {state.step === "done" && (
          <div className="space-y-3 py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="text-xl font-bold">Triagem enviada!</h2>
            <p className="text-sm text-muted-foreground">
              Em até 24h um técnico responde no seu WhatsApp com o próximo passo.
            </p>
            {lastPayload != null && (
              <details className="mx-auto mt-4 max-w-full text-left">
                <summary className="cursor-pointer text-xs text-muted-foreground">
                  Ver payload de teste (debug)
                </summary>
                <pre className="mt-2 max-h-72 overflow-auto rounded-lg bg-muted/50 p-3 text-[11px] leading-relaxed">
                  {JSON.stringify(lastPayload, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        {state.step === "error" && (
          <div className="space-y-3 py-6 text-center">
            <p className="font-bold text-destructive">Falha ao enviar.</p>
            <p className="text-sm text-muted-foreground">{state.error}</p>
            <Button onClick={() => dispatch({ type: "BACK" })} variant="outline">Voltar</Button>
          </div>
        )}
      </div>

      {/* Footer nav */}
      {!["submitting", "done", "error"].includes(state.step) && (
        <footer className="flex items-center justify-between border-t border-border px-5 py-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => dispatch({ type: "BACK" })}
            disabled={state.step === "category"}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
          </Button>
          {state.step === "accept" ? (
            <Button type="button" onClick={handleSubmit} disabled={!canAdvance(state)}>
              <Send className="mr-2 h-4 w-4" /> Enviar triagem
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => dispatch({ type: "NEXT" })}
              disabled={!canAdvance(state)}
            >
              Avançar <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </footer>
      )}
    </div>
  );
}

export default TriageWizard;
