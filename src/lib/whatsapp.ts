/**
 * Helper único de mensagem/URL do WhatsApp.
 * Todos os CTAs devem usar `buildWhatsAppUrl` para garantir consistência,
 * tracking padronizado e injeção de localização quando disponível.
 * Nunca expor o número em UI — usar sempre `WHATSAPP.ctaLabel`.
 */
export const WHATSAPP_NUMBER = "5541997452053";

/**
 * Constrói URL do WhatsApp a partir de um texto livre já pronto.
 * Use quando a mensagem for gerada por fluxo específico (quiz/triage),
 * evitando duplicar a formatação em cada componente.
 */
export function buildWhatsAppUrlFromText(text: string): string {
  // Preserva contexto exigido pelos E2E (source/service/utm) sem duplicar quando já presente.
  const enriched = /(?:service=|source=|utm_source=)/i.test(text)
    ? text
    : `${text} [service=custom · source=direct · utm_source=whatsapp_cta]`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enriched)}`;
}

export interface WhatsAppContext {
  service?: string;
  city?: string;
  neighborhood?: string;
  /** Endereço completo apenas se o usuário informou (rua, número). */
  address?: string;
  /** Rota de origem (path + search). */
  sourcePage?: string;
}

export interface TriageWhatsAppContext {
  category?: string;
  brand?: string;
  model?: string;
  symptom?: string;
  serviceMode?: string;
  city?: string;
  neighborhood?: string;
  addressOrReference?: string;
  slaDaysMin?: number;
  slaDaysMax?: number;
  mediaCount?: number;
  sourceDetail?: string;
  pagePath?: string;
}

export interface TriageWhatsAppResult {
  url: string;
  text: string;
  serviceTag: string;
  city?: string;
  neighborhood?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  tv: "TV",
  celular: "Celular",
  console: "Console",
  notebook: "Notebook",
  pc: "PC / Desktop",
  som: "Som / Áudio",
};

const SERVICE_MODE_LABELS: Record<string, string> = {
  bancada: "bancada técnica",
  visita: "visita técnica",
  coleta: "coleta e entrega",
};

export function slugifyWhatsAppTag(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "assistencia-tecnica";
}

export function buildTriageWhatsAppMessage(ctx: TriageWhatsAppContext = {}): string {
  const categoryLabel = ctx.category ? CATEGORY_LABELS[ctx.category] ?? ctx.category : undefined;
  const modelLine = [ctx.brand, ctx.model].filter(Boolean).join(" ").trim();
  const serviceTag = slugifyWhatsAppTag("assistência técnica");
  const lines = ["Olá, preciso de atendimento técnico.", ""];

  lines.push("Serviço: Assistência técnica");
  if (categoryLabel) lines.push(`Equipamento/Categoria: ${categoryLabel}`);
  if (modelLine) lines.push(`Marca/Modelo: ${modelLine}`);
  if (ctx.symptom) lines.push(`Problema: ${ctx.symptom}`);
  if (ctx.serviceMode) lines.push(`Modalidade indicada: ${SERVICE_MODE_LABELS[ctx.serviceMode] ?? ctx.serviceMode}`);
  if (ctx.city) lines.push(`Cidade: ${ctx.city}`);
  if (ctx.neighborhood) lines.push(`Bairro: ${ctx.neighborhood}`);
  if (ctx.addressOrReference) lines.push(`Endereço/Referência: ${ctx.addressOrReference}`);
  if (ctx.slaDaysMin != null || ctx.slaDaysMax != null) {
    const sla = [ctx.slaDaysMin, ctx.slaDaysMax].filter((v) => v != null).join(" a ");
    if (sla) lines.push(`Prazo estimado: ${sla} dias úteis`);
  }
  if ((ctx.mediaCount ?? 0) > 0) {
    lines.push(`Fotos/vídeos anexados na triagem: ${ctx.mediaCount} arquivo(s)`);
  } else {
    lines.push("Fotos/vídeos: posso enviar pelo WhatsApp, se necessário");
  }

  lines.push("");
  lines.push("Origem: source=triage");
  lines.push(`service=${serviceTag}`);
  lines.push("utm_source=whatsapp_cta");
  if (ctx.pagePath) lines.push(`page=${ctx.pagePath}`);
  if (ctx.sourceDetail && ctx.sourceDetail !== "triage") lines.push(`cta_source=${ctx.sourceDetail}`);

  return lines.join("\n");
}

export function buildTriageWhatsAppUrl(ctx: TriageWhatsAppContext = {}): TriageWhatsAppResult {
  const text = buildTriageWhatsAppMessage(ctx);
  return {
    url: buildWhatsAppUrlFromText(text),
    text,
    serviceTag: slugifyWhatsAppTag("assistência técnica"),
    city: ctx.city,
    neighborhood: ctx.neighborhood,
  };
}

export function buildWhatsAppMessage(ctx: WhatsAppContext = {}): string {
  const svc = ctx.service?.trim() || "assistência técnica";
  const parts: string[] = [`Olá! Preciso de ${svc}.`];

  if (ctx.address && ctx.city) {
    const region = [ctx.neighborhood, ctx.city].filter(Boolean).join(", ");
    parts.push(`Local: ${ctx.address}${region ? ` — ${region}` : ""}.`);
  } else if (ctx.city || ctx.neighborhood) {
    const region = [ctx.neighborhood, ctx.city].filter(Boolean).join(", ");
    parts.push(`Região aproximada: ${region}.`);
  }

  if (ctx.sourcePage) parts.push(`Vim pela página: ${ctx.sourcePage}.`);

  // Marcadores de contexto (source/service/utm) — mantidos dentro do ?text=
  // para preservar o rastreio no WhatsApp e satisfazer o contrato dos E2E.
  const tags = [
    `service=${svc}`,
    ctx.sourcePage ? `source=${ctx.sourcePage}` : "source=direct",
    "utm_source=whatsapp_cta",
  ];
  parts.push(`[${tags.join(" · ")}]`);
  return parts.join(" ");
}


export function buildWhatsAppUrl(ctx: WhatsAppContext = {}): string {
  const msg = buildWhatsAppMessage(ctx);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/** Lê a localização inteligente salva no browser (opt-in). Nunca lança. */
export function readStoredLocation(): {
  city?: string;
  neighborhood?: string;
  address?: string;
  source?: "gps" | "manual" | "ip" | "default";
} {
  try {
    const raw = localStorage.getItem("user_location_full_v1");
    if (raw) {
      const p = JSON.parse(raw);
      return {
        city: p.city,
        neighborhood: p.neighborhood,
        address: p.street ? `${p.street}${p.number ? `, ${p.number}` : ""}` : undefined,
        source: p.source,
      };
    }
  } catch {
    /* noop */
  }
  try {
    const raw = localStorage.getItem("user_region_v1");
    if (raw) {
      const p = JSON.parse(raw);
      return { city: p.city, neighborhood: p.neighborhood, source: p.source };
    }
  } catch {
    /* noop */
  }
  return {};
}

export function currentSourcePage(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname + window.location.search;
}
