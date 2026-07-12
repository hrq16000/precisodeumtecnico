/**
 * Configuração central do funil de triagem (Rodada 26).
 *
 * ÚNICO local para alterar: preços mínimos, faixas de referência, prazos,
 * versão dos termos, textos de modalidade e catálogo de equipamentos.
 * Nome da empresa, WhatsApp e horários continuam onde já estão
 * (src/data/companyInfo.ts e src/lib/whatsapp.ts).
 */

export const TRIAGE_STATE_VERSION = 2;
export const TERMS_VERSION = "2026-07-12";

export type EquipmentId =
  | "pc_notebook"
  | "tv"
  | "celular_tablet"
  | "surface"
  | "som_audio"
  | "videogame"
  | "outro";

export type ServiceRoute = "remoto" | "visita" | "coleta";

export interface EquipmentOption {
  id: EquipmentId;
  label: string;
  emoji: string;
  /** Modalidade padrão quando não há regra específica. */
  defaultRoute: ServiceRoute;
  /** Se `true`, remoto e visita nunca podem ser oferecidos. */
  forceCollect: boolean;
}

export const EQUIPMENTS: EquipmentOption[] = [
  { id: "pc_notebook",   label: "PC / Notebook",         emoji: "💻", defaultRoute: "visita", forceCollect: false },
  { id: "tv",            label: "TV",                    emoji: "📺", defaultRoute: "coleta", forceCollect: true },
  { id: "celular_tablet",label: "Celular / Tablet",      emoji: "📱", defaultRoute: "coleta", forceCollect: true },
  { id: "surface",       label: "Surface",               emoji: "📘", defaultRoute: "coleta", forceCollect: true },
  { id: "som_audio",     label: "Som / Receiver / Áudio",emoji: "🔊", defaultRoute: "coleta", forceCollect: true },
  { id: "videogame",     label: "Videogame",             emoji: "🎮", defaultRoute: "coleta", forceCollect: true },
  { id: "outro",         label: "Outro",                 emoji: "🧰", defaultRoute: "coleta", forceCollect: true },
];

export const EQUIPMENT_BY_ID: Record<EquipmentId, EquipmentOption> = Object.fromEntries(
  EQUIPMENTS.map((e) => [e.id, e]),
) as Record<EquipmentId, EquipmentOption>;

/** Preços mínimos e regras de negócio da rodada 26. */
export const PRICING = {
  visitaFee: 99.99,
  visitaWindowMinutes: 30,
  coletaMin: 299.99,
  coletaAutoApprovedCap: 300, // até este valor não exige nova autorização
  cancelDiagnosticFee: 99.99,
  minimumAny: 99.99,
} as const;

export const SLA = {
  coletaMinDays: 3,
  coletaMaxDays: 60,
  disclaimerAboveMax:
    "O prazo pode ultrapassar 60 dias úteis quando houver encomenda, importação ou indisponibilidade de peças.",
} as const;

/** Faixas informativas por equipamento/categoria. Não são orçamento. */
export const REFERENCE_RANGES: Record<string, { label: string; from: number; to: number; note?: string }> = {
  tv_display:      { label: "TV — display/tela",       from: 900,  to: 5000, note: "Mão de obra e logística aproximadamente R$ 300 a R$ 500." },
  tv_leds:         { label: "TV — LEDs",               from: 300,  to: 500 },
  tv_placa:        { label: "TV — placa/alimentação",  from: 300,  to: 500 },
  som_placa:       { label: "Som — placa ou componentes", from: 300, to: 500 },
  videogame_placa: { label: "Videogame — placa",       from: 300,  to: 500 },
  videogame_leitor:{ label: "Videogame — leitor/desliga", from: 300, to: 500 },
  celular_generico:{ label: "Celular/Tablet",          from: 150,  to: 3000 },
};

export const URGENCY_OPTIONS = [
  { id: "72h",    label: "Próximas 72 horas úteis — até 3 dias úteis" },
  { id: "week",   label: "Esta semana" },
  { id: "no_rush",label: "Sem pressa" },
] as const;

export type UrgencyId = (typeof URGENCY_OPTIONS)[number]["id"];

/** Textos por rota, calculados na Etapa 4. */
export function routeExplanation(route: ServiceRoute, equipmentId?: EquipmentId): string {
  switch (route) {
    case "remoto":
      return "Pelas informações fornecidas, o serviço pode ser compatível com atendimento remoto, pois o computador está funcionando e a solicitação envolve instalação ou configuração. A confirmação será feita no WhatsApp.";
    case "visita":
      return "Pelas informações fornecidas, seu caso pode ser avaliado por visita técnica. O atendimento custa R$ 99,99 por até 30 minutos. Se for identificada necessidade de bancada, coleta ou peças, você será informado antes.";
    case "coleta":
    default:
      return equipmentId === "tv"
        ? "Os sintomas informados podem estar relacionados ao conjunto de tela, LEDs ou placa. A confirmação depende de avaliação técnica por coleta e entrega. Valor mínimo R$ 299,99 (peças não inclusas)."
        : "Pelas informações fornecidas, este equipamento precisa ser encaminhado por coleta e entrega para avaliação técnica. O valor mínimo é de R$ 299,99, com peças não inclusas.";
  }
}

export function routeMinimumPrice(route: ServiceRoute): number {
  return route === "coleta" ? PRICING.coletaMin : PRICING.visitaFee;
}

export function routeLabel(route: ServiceRoute): string {
  return route === "remoto" ? "Atendimento remoto"
       : route === "visita" ? "Visita técnica"
       : "Coleta e entrega";
}

export function routeSlaText(route: ServiceRoute): string {
  if (route === "coleta") return `${SLA.coletaMinDays} a ${SLA.coletaMaxDays} dias úteis (pode ser maior se houver encomenda de peças).`;
  if (route === "visita") return "Agendamento conforme disponibilidade — geralmente na mesma semana.";
  return "Atendimento remoto em horário combinado no WhatsApp.";
}
