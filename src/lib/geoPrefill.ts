/**
 * Prefill geográfico para o funil de triagem.
 *
 * Fonte de verdade (ordem de prioridade):
 *  1. rota atual (/cidade/bairro) — intenção explícita do visitante;
 *  2. `user_location_full_v1` (GPS / manual / IP via SmartLocationPrompt);
 *  3. `user_region_v1` (fallback legado por IP).
 *
 * Só é usado para SUGERIR valores em campos vazios — nunca sobrescreve
 * o que o usuário digitou.
 */
import { parseCityBairroFromPathname } from "@/lib/triage/engine";

export type GeoPrefill = {
  city?: string;
  neighborhood?: string;
  uf?: string;
  source: "route" | "gps" | "manual" | "ip" | "none";
};

function titleize(slug?: string): string | undefined {
  if (!slug) return undefined;
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => (w.length <= 2 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export function readGeoPrefill(pathname?: string): GeoPrefill {
  if (typeof window === "undefined") return { source: "none" };

  const path = pathname ?? window.location.pathname;
  const fromRoute = parseCityBairroFromPathname(path);
  if (fromRoute.bairro || fromRoute.city) {
    return {
      city: titleize(fromRoute.city),
      neighborhood: titleize(fromRoute.bairro),
      source: "route",
    };
  }

  try {
    const raw = localStorage.getItem("user_location_full_v1");
    if (raw) {
      const p = JSON.parse(raw) as {
        city?: string; uf?: string; neighborhood?: string; source?: string;
      };
      if (p?.city || p?.neighborhood) {
        const src = p.source === "gps" || p.source === "manual" || p.source === "ip" ? p.source : "manual";
        return { city: p.city, uf: p.uf, neighborhood: p.neighborhood, source: src };
      }
    }
  } catch { /* noop */ }

  try {
    const raw = localStorage.getItem("user_region_v1");
    if (raw) {
      const p = JSON.parse(raw) as { city?: string; region?: string; neighborhood?: string };
      if (p?.city) return { city: p.city, uf: p.region, neighborhood: p.neighborhood, source: "ip" };
    }
  } catch { /* noop */ }

  return { source: "none" };
}

export const GEO_PREFILL_LABEL: Record<GeoPrefill["source"], string> = {
  route: "Sugerido pela página que você acessou",
  gps: "Confirmado pela sua localização (GPS)",
  manual: "Confirmado por você",
  ip: "Detectado automaticamente pelo seu acesso",
  none: "",
};
