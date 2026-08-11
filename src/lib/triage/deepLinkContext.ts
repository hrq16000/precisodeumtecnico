/**
 * Contexto de deep-link da triagem (#agendamento / #triagem / #triage).
 *
 * Objetivos:
 *  - Pré-selecionar equipamento e sintoma quando o link vier de uma página
 *    do cluster (ex.: /formatacao-de-computador-curitiba).
 *  - Restaurar o MESMO contexto após um reload, sem nunca inventar
 *    cidade/bairro (só persiste o que veio explicitamente na URL/CTA).
 *
 * Regras de segurança/qualidade:
 *  - Somente valores validados contra o catálogo real (config + questions).
 *  - sessionStorage com TTL curto (mesmo TTL do rascunho).
 *  - Falha silenciosa: qualquer erro descarta o contexto (fail-closed).
 */

import { EQUIPMENTS, type EquipmentId } from "@/data/triage/config";
import { getQuestionsForEquipment } from "@/data/triage/questions";
import { makeInitialStateV2 } from "@/lib/triage/engine";
import { mergeTriageDraft, readTriageDraft, saveTriageDraft } from "@/lib/triage/draft";

export const TRIAGE_DEEPLINK_KEY = "pdt_triage_deeplink_v1";
export const TRIAGE_DEEPLINK_TTL_MS = 6 * 60 * 60 * 1000;

export interface TriageDeepLinkContext {
  equipment?: EquipmentId;
  symptom?: string;
  symptomLabel?: string;
  city?: string;
  neighborhood?: string;
  source?: string;
}

interface Envelope {
  savedAt: number;
  context: TriageDeepLinkContext;
}

/** Slugs de serviço (páginas do cluster) → equipamento + sintoma do funil. */
const SERVICE_SLUG_MAP: Record<string, { equipment: EquipmentId; symptom?: string }> = {
  formatacao: { equipment: "pc_notebook", symptom: "windows_system" },
  "formatacao-de-computador": { equipment: "pc_notebook", symptom: "windows_system" },
  virus: { equipment: "pc_notebook", symptom: "virus_slow" },
  "remocao-de-virus": { equipment: "pc_notebook", symptom: "virus_slow" },
  lentidao: { equipment: "pc_notebook", symptom: "virus_slow" },
  ssd: { equipment: "pc_notebook", symptom: "swap_component" },
  memoria: { equipment: "pc_notebook", symptom: "swap_component" },
  upgrade: { equipment: "pc_notebook", symptom: "swap_component" },
  "nao-liga": { equipment: "pc_notebook", symptom: "no_power_board" },
  "recuperacao-de-dados": { equipment: "pc_notebook", symptom: "recover_files" },
  wifi: { equipment: "pc_notebook", symptom: "install_config" },
  "configuracao-wifi": { equipment: "pc_notebook", symptom: "install_config" },
  impressora: { equipment: "pc_notebook", symptom: "printer_periph" },
  notebook: { equipment: "pc_notebook" },
  computador: { equipment: "pc_notebook" },
  informatica: { equipment: "pc_notebook" },
  tv: { equipment: "tv" },
  "smart-tv": { equipment: "tv" },
  "troca-de-tela-tv": { equipment: "tv" },
  celular: { equipment: "celular_tablet" },
  tablet: { equipment: "celular_tablet" },
  surface: { equipment: "surface" },
  som: { equipment: "som_audio" },
  audio: { equipment: "som_audio" },
  videogame: { equipment: "videogame" },
  console: { equipment: "videogame" },
};

const EQUIPMENT_IDS = new Set(EQUIPMENTS.map((e) => e.id));

function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isEquipmentId(v: string): v is EquipmentId {
  return EQUIPMENT_IDS.has(v as EquipmentId);
}

/** Opções válidas de sintoma para um equipamento (vazio = campo livre). */
function symptomOptions(equipment: EquipmentId): { value: string; label: string }[] {
  const q = getQuestionsForEquipment(equipment)?.symptom ?? [];
  const symptomQuestion = q.find((item) => item.isSymptom);
  return symptomQuestion?.options ?? [];
}

/** Valida um sintoma contra o catálogo do equipamento. */
export function resolveSymptom(
  equipment: EquipmentId | undefined,
  raw: string | null | undefined,
): { symptom?: string; symptomLabel?: string } {
  if (!equipment || !raw) return {};
  const wanted = raw.trim().toLowerCase();
  const match = symptomOptions(equipment).find(
    (o) => o.value.toLowerCase() === wanted || normalizeSlug(o.label) === normalizeSlug(wanted),
  );
  return match ? { symptom: match.value, symptomLabel: match.label } : {};
}

/**
 * Resolve o contexto a partir dos parâmetros de URL + rota atual.
 * Nunca infere cidade/bairro: só usa o que veio explícito.
 */
export function resolveDeepLinkContext(input: {
  params: URLSearchParams;
  pathname?: string;
  fallback?: TriageDeepLinkContext;
}): TriageDeepLinkContext {
  const { params, pathname = "", fallback = {} } = input;

  const rawEquipment =
    params.get("equipamento") ?? params.get("equipment") ?? params.get("categoria") ?? "";
  let equipment: EquipmentId | undefined = isEquipmentId(rawEquipment.trim())
    ? (rawEquipment.trim() as EquipmentId)
    : undefined;

  const rawService = params.get("servico") ?? params.get("service") ?? "";
  const serviceSlug = rawService ? normalizeSlug(rawService) : "";
  let mapped = serviceSlug ? SERVICE_SLUG_MAP[serviceSlug] : undefined;

  // Inferência pela rota do cluster (ex.: /formatacao-de-computador-curitiba).
  if (!mapped && pathname) {
    const path = normalizeSlug(pathname);
    const hit = Object.keys(SERVICE_SLUG_MAP)
      .filter((slug) => slug.length >= 3 && path.includes(slug))
      .sort((a, b) => b.length - a.length)[0];
    if (hit) mapped = SERVICE_SLUG_MAP[hit];
  }

  if (!equipment && mapped) equipment = mapped.equipment;
  if (!equipment && fallback.equipment) equipment = fallback.equipment;

  const explicitSymptom = resolveSymptom(
    equipment,
    params.get("sintoma") ?? params.get("symptom"),
  );
  const mappedSymptom =
    explicitSymptom.symptom || !mapped?.symptom
      ? explicitSymptom
      : resolveSymptom(equipment, mapped.symptom);
  const symptomFromFallback =
    mappedSymptom.symptom ? mappedSymptom : resolveSymptom(equipment, fallback.symptom);

  const city = (params.get("cidade") ?? params.get("city") ?? fallback.city ?? "").trim();
  const neighborhood = (
    params.get("bairro") ?? params.get("neighborhood") ?? fallback.neighborhood ?? ""
  ).trim();

  const context: TriageDeepLinkContext = {};
  if (equipment) context.equipment = equipment;
  if (symptomFromFallback.symptom) {
    context.symptom = symptomFromFallback.symptom;
    context.symptomLabel = symptomFromFallback.symptomLabel;
  }
  if (city) context.city = city;
  if (neighborhood) context.neighborhood = neighborhood;

  const utm = params.get("utm_source");
  context.source = utm ? `agendamento-${normalizeSlug(utm)}` : fallback.source ?? "agendamento-hash";

  return context;
}

export function saveDeepLinkContext(context: TriageDeepLinkContext): void {
  try {
    if (typeof window === "undefined") return;
    const envelope: Envelope = { savedAt: Date.now(), context };
    window.sessionStorage.setItem(TRIAGE_DEEPLINK_KEY, JSON.stringify(envelope));
  } catch {
    /* noop */
  }
}

export function readDeepLinkContext(): TriageDeepLinkContext | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem(TRIAGE_DEEPLINK_KEY);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as Envelope;
    if (!envelope?.context || typeof envelope.savedAt !== "number") return null;
    if (Date.now() - envelope.savedAt > TRIAGE_DEEPLINK_TTL_MS) {
      clearDeepLinkContext();
      return null;
    }
    return envelope.context;
  } catch {
    clearDeepLinkContext();
    return null;
  }
}

export function clearDeepLinkContext(): void {
  try {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(TRIAGE_DEEPLINK_KEY);
  } catch {
    /* noop */
  }
}

/**
 * Grava o contexto no rascunho do wizard (pré-seleção) sem sobrescrever
 * respostas que o usuário já tenha dado nesta sessão.
 */
export function applyContextToDraft(context: TriageDeepLinkContext): void {
  try {
    if (typeof window === "undefined") return;
    const current = mergeTriageDraft(makeInitialStateV2(), readTriageDraft());
    const next = { ...current };
    let changed = false;

    if (context.equipment && !current.equipment) {
      next.equipment = context.equipment;
      changed = true;
    }
    if (context.symptom && next.equipment === context.equipment && !current.symptom) {
      next.symptom = context.symptom;
      next.symptomLabel = context.symptomLabel;
      changed = true;
    }
    if (context.city && !current.contact.city) {
      next.contact = { ...next.contact, city: context.city };
      changed = true;
    }
    if (context.neighborhood && !current.contact.neighborhood) {
      next.contact = { ...next.contact, neighborhood: context.neighborhood };
      changed = true;
    }

    if (changed) saveTriageDraft(next);
  } catch {
    /* noop */
  }
}
