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
    | "location_persisted",
  params: {
    source?: LocationSource;
    duration_ms?: number;
    from_cache?: boolean;
    has_city?: boolean;
    has_neighborhood?: boolean;
    has_address?: boolean;
    has_coords?: boolean;
    error?: string;
    accuracy?: number;
  } = {},
) {
  trackEvent("location_flow", { action, ...params });
}
