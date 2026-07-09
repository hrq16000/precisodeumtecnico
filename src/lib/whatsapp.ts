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
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
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
} {
  try {
    const raw = localStorage.getItem("user_location_full_v1");
    if (raw) {
      const p = JSON.parse(raw);
      return {
        city: p.city,
        neighborhood: p.neighborhood,
        address: p.street ? `${p.street}${p.number ? `, ${p.number}` : ""}` : undefined,
      };
    }
  } catch {
    /* noop */
  }
  try {
    const raw = localStorage.getItem("user_region_v1");
    if (raw) {
      const p = JSON.parse(raw);
      return { city: p.city };
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
