import { trackEvent } from "@/lib/analytics";

/**
 * Telemetria do fluxo de localização.
 * Nunca envia coordenadas — apenas metadados (fonte, duração, erros).
 */
export type LocationSource = "gps" | "ip" | "manual" | "default";

export function trackLocationEvent(
  action:
    | "prompt_shown"
    | "gps_request"
    | "gps_success"
    | "gps_denied"
    | "gps_error"
    | "reverse_geocode_ok"
    | "reverse_geocode_fail"
    | "manual_edit"
    | "manual_save"
    | "ip_fallback"
    | "location_persisted"
    | "location_reset",
  params: {
    source?: LocationSource;
    duration_ms?: number;
    from_cache?: boolean;
    has_city?: boolean;
    has_neighborhood?: boolean;
    has_address?: boolean;
    has_coords?: boolean;
    /** GeolocationPositionError.code, HTTP status, etc. — nunca coordenadas. */
    error?: string;
    /** Motivo textual normalizado (http_5xx, network, abort, empty, denied, timeout). */
    reason?: string;
    /** HTTP status do provider quando aplicável. */
    status?: number;
    /** gps | ip | manual | default — indica qual fallback assumiu. */
    fallback?: LocationSource;
    accuracy_bucket?: "high" | "medium" | "low";
  } = {},
) {
  trackEvent("location_flow", { action, ...params });
}

/** Bucket qualitativo — evita expor accuracy exata em analytics. */
export function accuracyBucket(accuracy: number | undefined): "high" | "medium" | "low" | undefined {
  if (accuracy == null || Number.isNaN(accuracy)) return undefined;
  if (accuracy <= 50) return "high";
  if (accuracy <= 250) return "medium";
  return "low";
}
