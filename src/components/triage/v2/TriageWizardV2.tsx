import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Zap, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  EQUIPMENTS, PRICING, URGENCY_OPTIONS, TERMS_VERSION,
  routeLabel, type EquipmentId,
} from "@/data/triage/config";
import { getQuestionsForEquipment, type Question } from "@/data/triage/questions";
import {
  activeQuestions, buildTriageSummary, buildWhatsAppTriageMessage,
  determineServiceRoute, getFirstIncompleteField, getPricingRules,
  makeInitialStateV2, reducerV2, STEP_ORDER, validateCurrentStep,
  type StepId, type TriageStateV2,
} from "@/lib/triage/engine";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { pushLocalAnalyticsEvent } from "@/lib/localAnalytics";
import { trackWhatsAppClick } from "@/lib/analytics";
import { logWaEvent } from "@/lib/waAudit";

interface Props {
  source?: string;
  onClose?: () => void;
}

const STEP_LABELS: Record<StepId, string> = {
  equipment: "1 · Equipamento",
  deviceDetails: "2 · Identificação",
  symptom: "3 · Problema",
  contextualAnswers: "4 · Detalhes",
  serviceRoute: "5 · Modalidade",
  termsAccepted: "6 · Termos",
  review: "7 · Revisão",
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function TriageWizardV2({ source = "triagem", onClose }: Props) {
  const [state, dispatch] = useReducer(reducerV2, undefined, makeInitialStateV2);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copyFallback, setCopyFallback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const transitioningRef = useRef(false);
  const advanceTimerRef = useRef<number | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const lastStepRef = useRef<StepId | null>(null);

  // ---------- efeitos de body[data-triage-open] gerenciados pelo Dialog pai
  // (GlobalTriageLauncher aplica ao abrir/fechar)

  // ---------- analytics de passo
  useEffect(() => {
    if (lastStepRef.current === state.currentStep) return;
    lastStepRef.current = state.currentStep;
    const idx = STEP_ORDER.indexOf(state.currentStep);
    pushLocalAnalyticsEvent({
      event: "triage_step",
      source,
      step_id: state.currentStep,
      step_index: idx,
      completion_status: idx === 0 ? "started" : "in_progress",
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  }, [state.currentStep, source]);

  // ---------- limpeza de timers
  useEffect(() => () => {
    if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
  }, []);

  // ---------- foco automático no primeiro campo inválido
  useEffect(() => {
    const id = getFirstIncompleteField(state);
    if (!id) return;
    const el = document.getElementById(`triage-field-${id}`);
    if (el && "focus" in el) {
      window.setTimeout(() => (el as HTMLElement).focus({ preventScroll: true }), 30);
    }
  }, [state.currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- helpers de navegação com trava
  const goNext = useCallback(() => {
    if (transitioningRef.current) return;
    const v = validateCurrentStep(state);
    if (!v.ok) {
      dispatch({ type: "NEXT" }); // aplica erros para exibir
      // rola até primeiro erro
      const firstErr = Object.keys(v.errors)[0];
      const el = firstErr ? document.getElementById(`triage-field-${firstErr}`) : null;
      el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
      (el as HTMLElement | null)?.focus?.();
      return;
    }
    transitioningRef.current = true;
    dispatch({ type: "NEXT" });
    window.setTimeout(() => { transitioningRef.current = false; }, 400);
  }, [state]);

  const goBack = useCallback(() => {
    if (transitioningRef.current) return;
    dispatch({ type: "BACK" });
  }, []);

  // ---------- auto-advance quando etapa fica completa
  const canAdvanceNow = useMemo(() => validateCurrentStep(state).ok, [state]);

  useEffect(() => {
    if (!canAdvanceNow) return;
    if (state.currentStep === "review") return;
    // steps que NÃO fazem auto-advance (precisam de confirmação do usuário)
    if (["termsAccepted", "serviceRoute"].includes(state.currentStep)) return;
    if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
    const delay = prefersReducedMotion() ? 0 : 500;
    advanceTimerRef.current = window.setTimeout(() => {
      if (transitioningRef.current) return;
      transitioningRef.current = true;
      dispatch({ type: "NEXT" });
      window.setTimeout(() => { transitioningRef.current = false; }, 400);
    }, delay);
    return () => { if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current); };
  }, [canAdvanceNow, state.currentStep]);

  // ---------- submit final
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const pricing = getPricingRules(state);
    const summary = buildTriageSummary(state);
    const message = buildWhatsAppTriageMessage(state);
    const modeMap: Record<string, string> = { remoto: "bancada", visita: "visita", coleta: "coleta" };

    try {
      const payload = {
        name: state.contact.name.trim(),
        email: state.contact.email.trim(),
        phone: state.contact.phone.trim(),
        neighborhood: undefined,
        category: state.equipment,
        brand: state.deviceDetails.brand || state.deviceDetails.equipment_name,
        model: state.deviceDetails.model,
        symptom: summary.symptom,
        symptom_slug: state.symptom,
        service_mode: pricing ? modeMap[pricing.route] : undefined,
        estimated_ticket_min: pricing?.minimum ?? PRICING.minimumAny,
        estimated_ticket_max: pricing?.minimum ?? PRICING.minimumAny,
        sla_days_min: pricing?.route === "coleta" ? 3 : 0,
        sla_days_max: pricing?.route === "coleta" ? 60 : 7,
        media_urls: [] as string[],
        triage_completed: true,
        terms_accepted: true,
        terms_accepted_at: state.termsAcceptedAt ?? new Date().toISOString(),
        source,
        message,
        triage_payload: {
          sessionId: state.sessionId,
          version: state.version,
          termsVersion: TERMS_VERSION,
          equipment: state.equipment,
          deviceDetails: state.deviceDetails,
          symptom: state.symptom,
          symptomCustom: state.symptomCustom,
          contextualAnswers: state.contextualAnswers,
          urgency: state.urgency,
          serviceRoute: pricing?.route,
          termsAccepted: state.termsAccepted,
          finalNotes: state.finalNotes,
        },
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
        referrer: typeof document !== "undefined" ? document.referrer.slice(0, 1000) : null,
      };

      const { error } = await supabase.from("leads").insert(payload as never);
      if (error) throw error;

      try {
        await supabase.from("terms_acceptances").insert({
          name: payload.name, phone: payload.phone, email: payload.email,
          service: `triagem-v2:${state.equipment}:${pricing?.route ?? "n/a"} [v${TERMS_VERSION}]`,
        } as never);
      } catch { /* não bloqueia */ }

      try {
        await supabase.functions.invoke("send-lead-notification", {
          body: {
            name: payload.name, email: payload.email, phone: payload.phone,
            service: summary.symptom ?? state.equipment,
            city: undefined, message,
          },
        });
      } catch { /* não bloqueia */ }

      // Analytics
      pushLocalAnalyticsEvent({
        event: "triage_complete",
        source,
        completion_status: "completed",
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
      trackWhatsAppClick({
        source: "triage",
        service: state.equipment ?? "triagem",
        source_component: "triage_wizard_v2",
        cta_label: "Agendar agora",
      });
      void logWaEvent({ source: "triage-v2", href: null, kind: "whatsapp", category: state.equipment ?? null, bypass: true, sessionId: state.sessionId });

      // Abre WhatsApp
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      const win = typeof window !== "undefined" ? window.open(url, "_blank", "noopener,noreferrer") : null;
      if (!win) setCopyFallback(message);
    } catch (e) {
      setSubmitError((e as Error).message || "Falha ao registrar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- render por etapa
  const eqOpt = state.equipment ? EQUIPMENTS.find((e) => e.id === state.equipment) : undefined;
  const questionnaire = state.equipment ? getQuestionsForEquipment(state.equipment) : undefined;
  const stepIdx = STEP_ORDER.indexOf(state.currentStep);
  const progressPct = Math.round(((stepIdx + 1) / STEP_ORDER.length) * 100);
  const errors = state.validationErrors;

  const renderField = (q: Question, value: string, onChange: (v: string) => void) => {
    const fieldId = `triage-field-${q.id}`;
    const errorMsg = errors[q.id];
    const baseClass = "space-y-1.5";
    if (q.type === "single" && q.options) {
      return (
        <div key={q.id} className={baseClass}>
          <Label className="text-sm font-medium">
            {q.label} {q.required && <span aria-hidden className="text-destructive">*</span>}
          </Label>
          <div id={fieldId} role="radiogroup" aria-label={q.label} className="grid gap-2 sm:grid-cols-2">
            {q.options.map((opt) => {
              const selected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(opt.value)}
                  className={cn(
                    "min-h-[44px] rounded-lg border-2 px-3 py-2.5 text-left text-sm transition",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {errorMsg && <p role="alert" className="text-xs text-destructive">{errorMsg}</p>}
        </div>
      );
    }
    if (q.type === "textarea") {
      return (
        <div key={q.id} className={baseClass}>
          <Label htmlFor={fieldId}>
            {q.label} {q.required && <span aria-hidden className="text-destructive">*</span>}
          </Label>
          <Textarea
            id={fieldId}
            value={value}
            maxLength={2000}
            placeholder={q.placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!errorMsg}
          />
          {errorMsg && <p role="alert" className="text-xs text-destructive">{errorMsg}</p>}
        </div>
      );
    }
    return (
      <div key={q.id} className={baseClass}>
        <Label htmlFor={fieldId}>
          {q.label} {q.required && <span aria-hidden className="text-destructive">*</span>}
        </Label>
        <Input
          id={fieldId}
          value={value}
          maxLength={120}
          placeholder={q.placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!errorMsg}
        />
        {errorMsg && <p role="alert" className="text-xs text-destructive">{errorMsg}</p>}
      </div>
    );
  };

  const summary = buildTriageSummary(state);
  const pricing = getPricingRules(state);

  return (
    <div className="mx-auto flex h-full max-h-[100dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-none bg-card sm:h-auto sm:max-h-[92dvh] sm:rounded-2xl sm:border sm:border-border sm:shadow-xl">
      {/* HEADER fixo */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Zap className="h-4 w-4 text-primary" aria-hidden />
          <span>Triagem técnica</span>
          <span className="hidden rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground sm:inline">
            {STEP_LABELS[state.currentStep]}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Fechar triagem"
            className="rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </header>

      {/* Progress */}
      <div className="h-1 w-full bg-muted" aria-hidden>
        <div
          className={cn("h-full bg-primary transition-[width]", canAdvanceNow && "animate-pulse")}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="sr-only" aria-live="polite">Etapa {stepIdx + 1} de {STEP_ORDER.length}: {STEP_LABELS[state.currentStep]}</div>

      {/* BODY scrollable */}
      <div ref={scrollAnchorRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {/* STEP 1: EQUIPAMENTO */}
        {state.currentStep === "equipment" && (
          <section className="space-y-3">
            <h2 className="text-base font-bold">Qual é o equipamento?</h2>
            <p className="text-xs text-muted-foreground">Selecione uma opção para começar.</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EQUIPMENTS.map((e) => {
                const selected = state.equipment === e.id;
                return (
                  <button
                    key={e.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => dispatch({ type: "SET_EQUIPMENT", value: e.id })}
                    className={cn(
                      "min-h-[76px] rounded-xl border-2 p-3 text-left transition active:scale-[0.98]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40",
                    )}
                  >
                    <div className="text-xl leading-none" aria-hidden>{e.emoji}</div>
                    <div className="mt-1.5 text-sm font-semibold">{e.label}</div>
                  </button>
                );
              })}
            </div>
            {errors.equipment && <p role="alert" className="text-xs text-destructive">{errors.equipment}</p>}
          </section>
        )}

        {/* STEP 2: DEVICE DETAILS */}
        {state.currentStep === "deviceDetails" && questionnaire && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">Identificação — {eqOpt?.label}</h2>
            {questionnaire.device.map((q) =>
              renderField(q, state.deviceDetails[q.id] ?? "", (v) => dispatch({ type: "SET_DEVICE_FIELD", id: q.id, value: v })),
            )}
          </section>
        )}

        {/* STEP 3: SYMPTOM */}
        {state.currentStep === "symptom" && questionnaire && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">O que aconteceu?</h2>
            {questionnaire.symptom
              .filter((q) => !q.when || q.when({ ...state.deviceDetails, symptom: state.symptom ?? "" }))
              .map((q) => {
                if (q.isSymptom) {
                  return renderField(q, state.symptom ?? "", (v) => {
                    const label = q.options?.find((o) => o.value === v)?.label;
                    dispatch({ type: "SET_SYMPTOM", value: v, label });
                  });
                }
                return renderField(q, state.symptomCustom ?? "", (v) =>
                  dispatch({ type: "SET_SYMPTOM", value: state.symptom ?? "", custom: v }),
                );
              })}
          </section>
        )}

        {/* STEP 4: CONTEXTUAL */}
        {state.currentStep === "contextualAnswers" && questionnaire && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">Mais alguns detalhes</h2>
            {activeQuestions(questionnaire.contextual, { ...state.deviceDetails, ...state.contextualAnswers, symptom: state.symptom ?? "" }).map((q) =>
              renderField(q, state.contextualAnswers[q.id] ?? "", (v) => dispatch({ type: "SET_CONTEXTUAL", id: q.id, value: v })),
            )}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Urgência <span aria-hidden className="text-destructive">*</span></Label>
              <div id="triage-field-urgency" role="radiogroup" aria-label="Urgência" className="grid gap-2">
                {URGENCY_OPTIONS.map((u) => {
                  const selected = state.urgency === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => dispatch({ type: "SET_URGENCY", value: u.id })}
                      className={cn(
                        "min-h-[44px] rounded-lg border-2 px-3 py-2.5 text-left text-sm transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40",
                      )}
                    >
                      {u.label}
                    </button>
                  );
                })}
              </div>
              {errors.urgency && <p role="alert" className="text-xs text-destructive">{errors.urgency}</p>}
            </div>
          </section>
        )}

        {/* STEP 5: SERVICE ROUTE */}
        {state.currentStep === "serviceRoute" && pricing && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">Modalidade indicada: {pricing.routeLabel}</h2>
            <p className="text-sm leading-relaxed text-foreground">{pricing.explanation}</p>
            <ul className="space-y-1.5 rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <li><strong>Valor mínimo:</strong> R$ {pricing.minimum.toFixed(2).replace(".", ",")}</li>
              <li><strong>Prazo:</strong> {pricing.slaText}</li>
              {pricing.route === "visita" && (
                <li className="text-xs text-muted-foreground">
                  R$ {PRICING.visitaFee.toFixed(2).replace(".", ",")} por até {PRICING.visitaWindowMinutes} minutos.
                  Cada novo período de até {PRICING.visitaWindowMinutes} minutos pode gerar nova cobrança de
                  R$ {PRICING.visitaFee.toFixed(2).replace(".", ",")}, limitado a 4 blocos (2 horas).
                  A visita não garante reparo; peças não inclusas.
                </li>
              )}
              {pricing.route === "coleta" && (
                <li className="text-xs text-muted-foreground">
                  Até R$ {PRICING.coletaAutoApprovedCap},00 o procedimento compatível pode ser executado sem nova autorização;
                  acima disso, aguardamos sua aprovação. Peças não inclusas.
                </li>
              )}
            </ul>
            {errors.serviceRoute && <p role="alert" className="text-xs text-destructive">{errors.serviceRoute}</p>}
          </section>
        )}

        {/* STEP 6: TERMOS */}
        {state.currentStep === "termsAccepted" && pricing && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">Ciência e aceite</h2>
            <p className="text-sm leading-relaxed">
              Esta triagem é obrigatória e registra sua ciência sobre a modalidade indicada,
              os valores mínimos, os prazos e as condições do atendimento. O WhatsApp será aberto
              somente para agendar o atendimento indicado.
            </p>

            <label htmlFor="triage-field-minimum" className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Checkbox
                id="triage-field-minimum"
                checked={!!state.termsAccepted.minimum}
                onCheckedChange={(v) => dispatch({ type: "TOGGLE_TERM", key: "minimum", value: !!v })}
              />
              <span className="text-sm">
                Estou ciente de que o valor mínimo desta modalidade é
                <strong> R$ {pricing.minimum.toFixed(2).replace(".", ",")}</strong>, com peças não inclusas.
              </span>
            </label>
            {errors.minimum && <p role="alert" className="text-xs text-destructive">{errors.minimum}</p>}

            {pricing.route === "coleta" && (
              <>
                <label htmlFor="triage-field-cancel" className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Checkbox
                    id="triage-field-cancel"
                    checked={!!state.termsAccepted.cancel}
                    onCheckedChange={(v) => dispatch({ type: "TOGGLE_TERM", key: "cancel", value: !!v })}
                  />
                  <span className="text-sm">
                    Estou ciente de que, em caso de cancelamento, desistência ou não aprovação do orçamento,
                    será cobrado <strong>R$ {PRICING.cancelDiagnosticFee.toFixed(2).replace(".", ",")}</strong> pelo diagnóstico,
                    análise e permanência do equipamento na fila técnica.
                  </span>
                </label>
                {errors.cancel && <p role="alert" className="text-xs text-destructive">{errors.cancel}</p>}

                <label htmlFor="triage-field-sla" className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Checkbox
                    id="triage-field-sla"
                    checked={!!state.termsAccepted.sla}
                    onCheckedChange={(v) => dispatch({ type: "TOGGLE_TERM", key: "sla", value: !!v })}
                  />
                  <span className="text-sm">
                    Estou ciente de que o prazo estimado é de 3 a 60 dias úteis e pode ser maior
                    em caso de encomenda ou indisponibilidade de peças.
                  </span>
                </label>
                {errors.sla && <p role="alert" className="text-xs text-destructive">{errors.sla}</p>}
              </>
            )}

            {pricing.route === "visita" && (
              <>
                <label htmlFor="triage-field-visit" className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Checkbox
                    id="triage-field-visit"
                    checked={!!state.termsAccepted.visit}
                    onCheckedChange={(v) => dispatch({ type: "TOGGLE_TERM", key: "visit", value: !!v })}
                  />
                  <span className="text-sm">
                    Estou ciente de que a visita técnica para PC/Notebook custa <strong>R$ 99,99</strong> por
                    até 30 minutos, e que cada novo período de até 30 minutos pode gerar nova cobrança de R$ 99,99,
                    limitado a 4 blocos (2 horas). A visita não garante o reparo e peças não estão inclusas.
                    Se for identificada necessidade de bancada, o atendimento será convertido em coleta e entrega.
                  </span>
                </label>
                {errors.visit && <p role="alert" className="text-xs text-destructive">{errors.visit}</p>}
              </>
            )}

            {pricing.route === "remoto" && (
              <>
                <label htmlFor="triage-field-remote" className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Checkbox
                    id="triage-field-remote"
                    checked={!!state.termsAccepted.remote}
                    onCheckedChange={(v) => dispatch({ type: "TOGGLE_TERM", key: "remote", value: !!v })}
                  />
                  <span className="text-sm">
                    Estou ciente de que o atendimento remoto será realizado em horário combinado no WhatsApp,
                    depende de acesso à internet e de o computador estar em condições de operar.
                  </span>
                </label>
                {errors.remote && <p role="alert" className="text-xs text-destructive">{errors.remote}</p>}
              </>
            )}

            <p className="text-xs text-muted-foreground">
              Registro de ciência e aceite eletrônico · versão {TERMS_VERSION}
            </p>
          </section>
        )}

        {/* STEP 7: REVIEW + CONTACT */}
        {state.currentStep === "review" && (
          <section className="space-y-4">
            <h2 className="text-base font-bold">Revisar e agendar</h2>

            <dl className="space-y-1.5 rounded-lg border border-border bg-muted/30 p-3 text-sm">
              {summary.equipment && <div><dt className="inline font-medium">Equipamento: </dt><dd className="inline">{summary.equipment}</dd></div>}
              {summary.brandModel && <div><dt className="inline font-medium">Marca/modelo: </dt><dd className="inline">{summary.brandModel}</dd></div>}
              {summary.age && <div><dt className="inline font-medium">Idade: </dt><dd className="inline">{summary.age}</dd></div>}
              {summary.symptom && <div><dt className="inline font-medium">Problema: </dt><dd className="inline">{summary.symptom}</dd></div>}
              {summary.contextual.map((c) => (
                <div key={c.label}><dt className="inline font-medium">{c.label}: </dt><dd className="inline">{c.value}</dd></div>
              ))}
              {summary.urgency && <div><dt className="inline font-medium">Urgência: </dt><dd className="inline">{summary.urgency}</dd></div>}
              {summary.route && <div><dt className="inline font-medium">Modalidade: </dt><dd className="inline">{summary.route}</dd></div>}
              {summary.minimum && <div><dt className="inline font-medium">Valor mínimo: </dt><dd className="inline">{summary.minimum}</dd></div>}
              {summary.sla && <div><dt className="inline font-medium">Prazo: </dt><dd className="inline">{summary.sla}</dd></div>}
            </dl>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="triage-field-name">Nome</Label>
                <Input id="triage-field-name" value={state.contact.name} maxLength={120}
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "name", value: e.target.value })}
                  aria-invalid={!!errors.name} />
                {errors.name && <p role="alert" className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="triage-field-phone">WhatsApp (com DDD)</Label>
                <Input id="triage-field-phone" value={state.contact.phone} inputMode="tel" maxLength={20}
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "phone", value: e.target.value })}
                  aria-invalid={!!errors.phone} placeholder="(41) 99999-0000" />
                {errors.phone && <p role="alert" className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="triage-field-email">E-mail</Label>
                <Input id="triage-field-email" value={state.contact.email} type="email" maxLength={200}
                  onChange={(e) => dispatch({ type: "SET_CONTACT", field: "email", value: e.target.value })}
                  aria-invalid={!!errors.email} />
                {errors.email && <p role="alert" className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="triage-final-notes">Observação adicional (opcional)</Label>
                <Textarea id="triage-final-notes" value={state.finalNotes ?? ""} maxLength={1000}
                  onChange={(e) => dispatch({ type: "SET_FINAL_NOTES", value: e.target.value })} />
              </div>
            </div>

            {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}

            {copyFallback && (
              <div role="alert" className="space-y-2 rounded-lg border border-amber-500 bg-amber-50 p-3 text-sm text-amber-900">
                <p>Não foi possível abrir o WhatsApp automaticamente. Copie a mensagem e envie:</p>
                <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded bg-white p-2 text-xs">{copyFallback}</pre>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try { await navigator.clipboard.writeText(copyFallback); setCopied(true); } catch { /* noop */ }
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" /> {copied ? "Copiado!" : "Copiar mensagem"}
                </Button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copyFallback)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="ml-2 text-sm font-semibold text-primary underline"
                >
                  Abrir WhatsApp
                </a>
              </div>
            )}
          </section>
        )}
      </div>

      {/* FOOTER fixo */}
      <footer className="sticky bottom-0 z-10 flex items-center justify-between gap-2 border-t border-border bg-card px-4 py-3">
        <Button variant="ghost" onClick={goBack} disabled={stepIdx === 0 || submitting} aria-label="Voltar">
          <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
        </Button>
        <div className="text-xs text-muted-foreground">
          Etapa {stepIdx + 1}/{STEP_ORDER.length}
        </div>
        {state.currentStep === "review" ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting || !canAdvanceNow}
            className="min-w-[160px]"
          >
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando…</> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Agendar agora</>}
          </Button>
        ) : (
          <Button onClick={goNext} disabled={submitting} aria-label="Próxima etapa">
            Continuar <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </footer>
    </div>
  );
}
