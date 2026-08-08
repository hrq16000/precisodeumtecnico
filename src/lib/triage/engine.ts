/**
 * Motor puro da triagem (Rodada 26). Sem React, testável.
 * ÚNICA fonte de verdade das regras de modalidade, validação e resumo.
 */
import {
  EQUIPMENT_BY_ID, LIGHT_SYMPTOMS_BY_EQUIPMENT, TERMS_VERSION, URGENCY_OPTIONS,
  routeExplanation, routeLabel, routeMinimumPrice, routeSlaText,
  type EquipmentId, type ServiceRoute, type UrgencyId,
} from "@/data/triage/config";
import { getQuestionsForEquipment, type Question } from "@/data/triage/questions";
import { getMessageTemplate } from "@/data/triage/messageTemplates";

export type StepId =
  | "equipment"
  | "deviceDetails"
  | "symptom"
  | "contextualAnswers"
  | "serviceRoute"
  | "termsAccepted"
  | "review";

export const STEP_ORDER: StepId[] = [
  "equipment", "deviceDetails", "symptom", "contextualAnswers",
  "serviceRoute", "termsAccepted", "review",
];

export interface TriageStateV2 {
  version: number;
  sessionId: string;
  createdAt: string;
  currentStep: StepId;
  completedSteps: StepId[];
  equipment?: EquipmentId;
  deviceDetails: Record<string, string>;
  symptom?: string;
  symptomLabel?: string;
  symptomCustom?: string;
  contextualAnswers: Record<string, string>;
  urgency?: UrgencyId;
  serviceRoute?: ServiceRoute;
  termsAccepted: Record<string, boolean>; // { minimum, cancel, sla, remote, visit }
  termsAcceptedAt?: string;
  finalNotes?: string;
  contact: { name: string; phone: string; email: string; neighborhood: string; city?: string };
  /** Preferência opcional de agendamento (não bloqueia o envio). */
  scheduling?: { preferredDate?: string; preferredSlot?: string };
  validationErrors: Record<string, string>;
}

export function makeInitialStateV2(): TriageStateV2 {
  const sessionId =
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36)
    ).replace(/-/g, "");
  return {
    version: 2,
    sessionId,
    createdAt: new Date().toISOString(),
    currentStep: "equipment",
    completedSteps: [],
    deviceDetails: {},
    contextualAnswers: {},
    termsAccepted: {},
    contact: { name: "", phone: "", email: "", neighborhood: "", city: "" },
    scheduling: {},
    validationErrors: {},
  };
}

// ---------------------------------------------------------------------------
// Prioridade de atendimento (urgência)
// ---------------------------------------------------------------------------
/** Urgência que aciona sinalização de prioridade para o time. */
export const PRIORITY_URGENCY: UrgencyId = "72h";

export function isPriorityUrgency(state: TriageStateV2): boolean {
  return state.urgency === PRIORITY_URGENCY;
}

/** Faixas de horário oferecidas como preferência (não vinculantes). */
export const SCHEDULING_SLOTS = [
  { id: "manha", label: "Manhã (08h–12h)" },
  { id: "tarde", label: "Tarde (13h–18h)" },
  { id: "noite", label: "Início da noite (18h–20h)" },
] as const;

export type SchedulingSlotId = (typeof SCHEDULING_SLOTS)[number]["id"];

/** Texto humano da preferência de agendamento, ou undefined se não informada. */
export function formatSchedulingPreference(state: TriageStateV2): string | undefined {
  const date = state.scheduling?.preferredDate?.trim();
  const slot = state.scheduling?.preferredSlot?.trim();
  if (!date && !slot) return undefined;
  const slotLabel = SCHEDULING_SLOTS.find((s) => s.id === slot)?.label ?? slot;
  let dateLabel: string | undefined;
  if (date) {
    const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    dateLabel = m ? `${m[3]}/${m[2]}/${m[1]}` : date;
  }
  return [dateLabel, slotLabel].filter(Boolean).join(" · ");
}

// ---------------------------------------------------------------------------
// Perguntas
// ---------------------------------------------------------------------------
export function activeQuestions(list: Question[], answers: Record<string, string>): Question[] {
  return list.filter((q) => !q.when || q.when(answers));
}

export function getQuestionsForSymptom(equipment: EquipmentId, symptomValue?: string): Question[] {
  const cat = getQuestionsForEquipment(equipment);
  const answers: Record<string, string> = { symptom: symptomValue ?? "" };
  return activeQuestions(cat.contextual, answers);
}

// ---------------------------------------------------------------------------
// Rota de atendimento (regras exatas do briefing)
// ---------------------------------------------------------------------------
export function determineServiceRoute(state: TriageStateV2): ServiceRoute | undefined {
  if (!state.equipment) return undefined;
  const eq = EQUIPMENT_BY_ID[state.equipment];
  if (!eq) return undefined;

  // PC / Notebook — regras finas (mantidas)
  if (state.equipment === "pc_notebook") {
    const power = state.deviceDetails.power;
    const symptom = state.symptom;

    // Coleta obrigatória:
    if (["no_power", "boots_off"].includes(power ?? "")) return "coleta";
    if (["no_power_board", "swap_component", "screen_kb_bat", "recover_files"].includes(symptom ?? "")) return "coleta";

    // Remoto: PC ligando + intenção de software
    if (power === "boots_ok" && ["install_config", "printer_periph"].includes(symptom ?? "")) return "remoto";

    // Visita: PC ligando/quase ligando + serviços leves
    if (["boots_ok", "boots_no_os"].includes(power ?? "") &&
        ["install_config", "virus_slow", "printer_periph", "windows_system"].includes(symptom ?? "")) {
      return "visita";
    }

    // Default seguro
    return "coleta";
  }

  // Demais equipamentos: sintoma leve → visita; senão → fallback do equipamento.
  const light = LIGHT_SYMPTOMS_BY_EQUIPMENT[state.equipment];
  if (light && state.symptom && light.includes(state.symptom)) return "visita";

  return eq.defaultRoute;
}

export function isRemoteEligible(state: TriageStateV2): boolean {
  return determineServiceRoute(state) === "remoto";
}

// ---------------------------------------------------------------------------
// Validação
// ---------------------------------------------------------------------------
function isEmpty(v: string | undefined): boolean {
  return !v || v.trim().length === 0;
}

export function validateCurrentStep(state: TriageStateV2): { ok: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const eq = state.equipment ? EQUIPMENT_BY_ID[state.equipment] : undefined;
  const questionnaire = state.equipment ? getQuestionsForEquipment(state.equipment) : undefined;

  switch (state.currentStep) {
    case "equipment":
      if (!eq) errors.equipment = "Selecione o equipamento.";
      break;

    case "deviceDetails":
      if (!questionnaire) { errors.equipment = "Selecione o equipamento antes."; break; }
      for (const q of questionnaire.device) {
        if (q.required && isEmpty(state.deviceDetails[q.id])) errors[q.id] = "Preencha este campo.";
      }
      break;

    case "symptom":
      if (!questionnaire) { errors.equipment = "Selecione o equipamento antes."; break; }
      for (const q of questionnaire.symptom) {
        const shouldShow = !q.when || q.when({ ...state.deviceDetails, symptom: state.symptom ?? "" });
        if (!shouldShow) continue;
        if (q.isSymptom && isEmpty(state.symptom) && isEmpty(state.symptomCustom)) {
          errors.symptom = "Selecione ou descreva o sintoma.";
        } else if (q.required && isEmpty((q.isSymptom ? state.symptom : state.contextualAnswers[q.id]) ?? "")) {
          errors[q.id] = "Preencha este campo.";
        }
      }
      break;

    case "contextualAnswers":
      if (!questionnaire) break;
      for (const q of activeQuestions(questionnaire.contextual, { ...state.deviceDetails, ...state.contextualAnswers, symptom: state.symptom ?? "" })) {
        if (q.required && isEmpty(state.contextualAnswers[q.id])) errors[q.id] = "Preencha este campo.";
      }
      if (!state.urgency) errors.urgency = "Selecione a urgência.";
      break;

    case "serviceRoute":
      if (!determineServiceRoute(state)) errors.serviceRoute = "Não foi possível calcular a modalidade — revise as respostas.";
      break;

    case "termsAccepted": {
      const route = determineServiceRoute(state);
      if (!state.termsAccepted.minimum) errors.minimum = "Confirme o valor mínimo.";
      if (route === "coleta") {
        if (!state.termsAccepted.cancel) errors.cancel = "Confirme a taxa de cancelamento.";
        if (!state.termsAccepted.sla) errors.sla = "Confirme o prazo.";
      }
      if (route === "visita" && !state.termsAccepted.visit) errors.visit = "Confirme as condições da visita.";
      if (route === "remoto" && !state.termsAccepted.remote) errors.remote = "Confirme as condições do atendimento remoto.";
      break;
    }

    case "review": {
      const c = state.contact;
      if (c.name.trim().length < 2) errors.name = "Informe seu nome.";
      if (c.phone.replace(/\D/g, "").length < 10) errors.phone = "Informe um WhatsApp válido com DDD.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)) errors.email = "Informe um e-mail válido.";
      if (c.neighborhood.trim().length < 2) errors.neighborhood = "Informe o bairro do atendimento.";
      break;
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

export function getFirstIncompleteField(state: TriageStateV2): string | undefined {
  return Object.keys(validateCurrentStep(state).errors)[0];
}

// ---------------------------------------------------------------------------
// Reset dependente
// ---------------------------------------------------------------------------
export function resetDependentAnswers(state: TriageStateV2, changedField: "equipment" | "symptom"): TriageStateV2 {
  if (changedField === "equipment") {
    return {
      ...state,
      deviceDetails: {},
      symptom: undefined,
      symptomLabel: undefined,
      symptomCustom: undefined,
      contextualAnswers: {},
      serviceRoute: undefined,
      termsAccepted: {},
      termsAcceptedAt: undefined,
      validationErrors: {},
      currentStep: "deviceDetails",
      completedSteps: ["equipment"],
    };
  }
  if (changedField === "symptom") {
    return {
      ...state,
      contextualAnswers: {},
      serviceRoute: undefined,
      termsAccepted: {},
      validationErrors: {},
    };
  }
  return state;
}

// ---------------------------------------------------------------------------
// Resumo / Preço
// ---------------------------------------------------------------------------
export interface PricingRules {
  route: ServiceRoute;
  routeLabel: string;
  minimum: number;
  slaText: string;
  explanation: string;
}

export function getPricingRules(state: TriageStateV2): PricingRules | undefined {
  const route = determineServiceRoute(state);
  if (!route) return undefined;
  // routeExplanation já importado no topo do módulo.
  return {
    route,
    routeLabel: routeLabel(route),
    minimum: routeMinimumPrice(route),
    slaText: routeSlaText(route),
    explanation: routeExplanation(route, state.equipment),
  };
}

export interface TriageSummary {
  equipment?: string;
  brandModel?: string;
  age?: string;
  symptom?: string;
  contextual: { label: string; value: string }[];
  urgency?: string;
  route?: string;
  minimum?: string;
  sla?: string;
  notes?: string;
  city?: string;
  scheduling?: string;
  priority?: boolean;
}

function labelForOption(q: Question | undefined, value: string): string {
  if (!q?.options) return value;
  return q.options.find((o) => o.value === value)?.label ?? value;
}

export function buildTriageSummary(state: TriageStateV2): TriageSummary {
  const eq = state.equipment ? EQUIPMENT_BY_ID[state.equipment] : undefined;
  const questionnaire = state.equipment ? getQuestionsForEquipment(state.equipment) : undefined;
  const summary: TriageSummary = { contextual: [] };
  summary.equipment = eq?.label;

  if (questionnaire) {
    const brand = state.deviceDetails.brand;
    const model = state.deviceDetails.model || state.deviceDetails.equipment_name;
    summary.brandModel = [brand, model].filter(Boolean).join(" ").trim() || undefined;
    const ageQ = questionnaire.device.find((q) => q.id === "age");
    if (ageQ && state.deviceDetails.age) summary.age = labelForOption(ageQ, state.deviceDetails.age);

    const symQ = questionnaire.symptom.find((q) => q.isSymptom);
    if (state.symptom && symQ) summary.symptom = labelForOption(symQ, state.symptom);
    else if (state.symptomCustom) summary.symptom = state.symptomCustom;

    for (const q of activeQuestions(questionnaire.contextual, { ...state.deviceDetails, ...state.contextualAnswers, symptom: state.symptom ?? "" })) {
      const v = state.contextualAnswers[q.id];
      if (!v) continue;
      summary.contextual.push({ label: q.label, value: labelForOption(q, v) });
    }
  }

  if (state.urgency) {
    summary.urgency = URGENCY_OPTIONS.find((u) => u.id === state.urgency)?.label;
  }

  const pricing = getPricingRules(state);
  if (pricing) {
    summary.route = pricing.routeLabel;
    summary.minimum = `R$ ${pricing.minimum.toFixed(2).replace(".", ",")}`;
    summary.sla = pricing.slaText;
  }

  summary.notes = state.finalNotes || state.contextualAnswers.notes || undefined;
  summary.city = state.contact.city?.trim() || undefined;
  summary.scheduling = formatSchedulingPreference(state);
  summary.priority = isPriorityUrgency(state);
  return summary;
}

// ---------------------------------------------------------------------------
// Mensagem WhatsApp humana
// ---------------------------------------------------------------------------
export function buildWhatsAppTriageMessage(state: TriageStateV2): string {
  const s = buildTriageSummary(state);
  const shortId = state.sessionId.slice(0, 8);
  const now = new Date();
  const dt = `${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

  const template = getMessageTemplate(state.equipment);
  const lines: string[] = [];
  // Sinalização de prioridade — primeira linha, para o time triar na fila.
  if (s.priority) lines.push("[PRIORIDADE · URGENTE — atendimento em até 3 dias úteis]");
  lines.push(template.intro, "");
  const push = (label: string, value?: string) => { if (value && value.trim()) lines.push(`${label}: ${value}`); };

  // Qualificação curta (nome, cidade, bairro, urgência, sintoma) — primeiro bloco.
  push("Nome", state.contact.name?.trim());
  push("Cidade", s.city);
  push("Bairro", state.contact.neighborhood?.trim());
  push("Equipamento", s.equipment);
  push("Marca/modelo", s.brandModel);
  push("Idade aproximada", s.age);
  push("Problema", s.symptom);
  if (s.contextual.length > 0) {
    lines.push("Detalhes:");
    for (const c of s.contextual) lines.push(`  • ${c.label} — ${c.value}`);
  }
  push("Urgência", s.urgency);
  push("Modalidade indicada", s.route);
  push("Valor mínimo informado", s.minimum);
  push("Prazo informado", s.sla);
  if (s.scheduling) {
    lines.push("");
    push("Preferência de agendamento", s.scheduling);
    lines.push("Se este horário não servir, responda REAGENDAR que eu envio outras opções.");
  }
  lines.push("");
  lines.push("Confirmo que li e aceitei as condições apresentadas no funil.");
  if (s.notes) push("Observação adicional", s.notes);
  lines.push(template.closing);
  lines.push("");
  // Página em que o visitante estava ao concluir a triagem.
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  if (pageUrl) lines.push(`Página de origem: ${pageUrl}`);
  lines.push(`Triagem #${shortId} · ${dt} · v${TERMS_VERSION}`);

  const ctx = buildTriageContextSuffix({
    equipment: state.equipment,
    symptomSlug: state.symptom,
    pathname: typeof window !== "undefined" ? window.location.pathname : "",
    neighborhoodFallback: state.contact.neighborhood?.trim() || undefined,
    urgency: state.urgency,
  });
  if (ctx) lines.push(ctx);

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Contexto de tracking parseável no ?text= do WhatsApp.
// Formato estável: `[cat=... · sym=... · cidade=... · bairro=...]`.
// ---------------------------------------------------------------------------
export function parseCityBairroFromPathname(pathname: string): { city?: string; bairro?: string } {
  const m = pathname.match(/^\/atendimento-nacional\/([^/?#]+)(?:\/([^/?#]+))?/);
  if (m) return { city: m[1], bairro: m[2] };
  const s = pathname.match(/^\/servicos\/[^/]+\/([^/?#]+)/);
  if (s) return { city: s[1] };
  return {};
}

export function buildTriageContextSuffix(opts: {
  equipment?: string;
  symptomSlug?: string;
  pathname?: string;
  /** Bairro informado na qualificação, usado quando a rota não traz bairro. */
  neighborhoodFallback?: string;
  /** Cidade informada na qualificação, usada quando a rota não traz cidade. */
  cityFallback?: string;
  urgency?: string;
}): string {
  const parts: string[] = [];
  if (opts.equipment) parts.push(`cat=${opts.equipment}`);
  if (opts.symptomSlug) parts.push(`sym=${opts.symptomSlug}`);
  const { city, bairro } = parseCityBairroFromPathname(opts.pathname ?? "");
  const cityToken = city ?? (opts.cityFallback ? slugifyToken(opts.cityFallback) : undefined);
  if (cityToken) parts.push(`cidade=${cityToken}`);
  const nb = bairro ?? (opts.neighborhoodFallback ? slugifyToken(opts.neighborhoodFallback) : undefined);
  if (nb) parts.push(`bairro=${nb}`);
  if (opts.urgency) parts.push(`urg=${opts.urgency}`);
  return parts.length > 0 ? `[${parts.join(" · ")}]` : "";
}

function slugifyToken(v: string): string {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Modo E2E: monta URL final do WhatsApp a partir de estado sintético mínimo. */
export function buildTriageWaUrlSynthetic(opts: {
  equipment: string;
  symptomSlug: string;
  pathname: string;
  whatsappNumber: string;
}): string {
  const suffix = buildTriageContextSuffix({
    equipment: opts.equipment,
    symptomSlug: opts.symptomSlug,
    pathname: opts.pathname,
  });
  const text = `Olá! Concluí a triagem obrigatória pelo site.\n\n${suffix}`;
  return `https://wa.me/${opts.whatsappNumber}?text=${encodeURIComponent(text)}`;
}


// ---------------------------------------------------------------------------
// Reducer FSM
// ---------------------------------------------------------------------------
export type ActionV2 =
  | { type: "SET_EQUIPMENT"; value: EquipmentId }
  | { type: "SET_DEVICE_FIELD"; id: string; value: string }
  | { type: "SET_SYMPTOM"; value: string; label?: string; custom?: string }
  | { type: "SET_CONTEXTUAL"; id: string; value: string }
  | { type: "SET_URGENCY"; value: UrgencyId }
  | { type: "TOGGLE_TERM"; key: string; value: boolean }
  | { type: "SET_CONTACT"; field: keyof TriageStateV2["contact"]; value: string }
  | { type: "SET_FINAL_NOTES"; value: string }
  | { type: "GOTO"; step: StepId }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "RESET" };

export function reducerV2(state: TriageStateV2, action: ActionV2): TriageStateV2 {
  switch (action.type) {
    case "SET_EQUIPMENT": {
      if (state.equipment === action.value) return state;
      const base: TriageStateV2 = { ...state, equipment: action.value };
      return resetDependentAnswers(base, "equipment");
    }
    case "SET_DEVICE_FIELD":
      return { ...state, deviceDetails: { ...state.deviceDetails, [action.id]: action.value }, validationErrors: {} };
    case "SET_SYMPTOM": {
      if (state.symptom === action.value && (state.symptomCustom ?? "") === (action.custom ?? "")) return state;
      const next = { ...state, symptom: action.value || undefined, symptomLabel: action.label, symptomCustom: action.custom };
      return resetDependentAnswers(next, "symptom");
    }
    case "SET_CONTEXTUAL":
      return { ...state, contextualAnswers: { ...state.contextualAnswers, [action.id]: action.value }, validationErrors: {} };
    case "SET_URGENCY":
      return { ...state, urgency: action.value };
    case "TOGGLE_TERM":
      return {
        ...state,
        termsAccepted: { ...state.termsAccepted, [action.key]: action.value },
        termsAcceptedAt: action.value ? new Date().toISOString() : state.termsAcceptedAt,
      };
    case "SET_CONTACT":
      return { ...state, contact: { ...state.contact, [action.field]: action.value } };
    case "SET_FINAL_NOTES":
      return { ...state, finalNotes: action.value };
    case "GOTO":
      return { ...state, currentStep: action.step };
    case "NEXT": {
      const v = validateCurrentStep(state);
      if (!v.ok) return { ...state, validationErrors: v.errors };
      const idx = STEP_ORDER.indexOf(state.currentStep);
      if (idx < 0 || idx >= STEP_ORDER.length - 1) return state;
      const nextStep = STEP_ORDER[idx + 1];
      return {
        ...state,
        currentStep: nextStep,
        completedSteps: Array.from(new Set([...state.completedSteps, state.currentStep])),
        validationErrors: {},
      };
    }
    case "BACK": {
      const idx = STEP_ORDER.indexOf(state.currentStep);
      if (idx <= 0) return state;
      return { ...state, currentStep: STEP_ORDER[idx - 1], validationErrors: {} };
    }
    case "RESET":
      return makeInitialStateV2();
    default:
      return state;
  }
}

export { PRICING, SLA } from "@/data/triage/config";
