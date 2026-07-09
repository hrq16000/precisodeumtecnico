/**
 * Reverse geocoding com cache local por coordenadas (arredondadas a ~11m)
 * e normalização estável dos campos comuns do Nominatim.
 * Nunca lança — retorna { ok:false } em falha, com status/reason para telemetria.
 */
export interface ReverseGeocodeResult {
  city?: string;
  uf?: string;
  state?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  postalCode?: string;
  country?: string;
}

export interface ReverseGeocodeOutcome {
  ok: boolean;
  data?: ReverseGeocodeResult;
  fromCache?: boolean;
  durationMs?: number;
  /** HTTP status code quando disponível. */
  status?: number;
  /** Motivo textual do erro (http_xxx, network, abort, parse, empty). */
  reason?: string;
}

const CACHE_KEY = "reverse_geocode_cache_v1";
const CACHE_MAX = 50;
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 dias

type CacheEntry = { at: number; data: ReverseGeocodeResult };
type CacheShape = Record<string, CacheEntry>;

function keyFor(lat: number, lon: number): string {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}

function readCache(): CacheShape {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CacheShape;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch { return {}; }
}

function writeCache(cache: CacheShape) {
  try {
    const entries = Object.entries(cache).sort((a, b) => b[1].at - a[1].at).slice(0, CACHE_MAX);
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch { /* noop */ }
}

function normalize(address: Record<string, string | undefined>): ReverseGeocodeResult {
  return {
    city: address.city || address.town || address.village || address.municipality,
    uf: address.state_code || address.state,
    state: address.state,
    neighborhood: address.suburb || address.neighbourhood || address.neighborhood || address.city_district,
    street: address.road,
    number: address.house_number,
    postalCode: address.postcode,
    country: address.country_code?.toUpperCase() || address.country,
  };
}

function hasAnyField(r: ReverseGeocodeResult): boolean {
  return !!(r.city || r.neighborhood || r.street || r.postalCode);
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  opts: { signal?: AbortSignal } = {},
): Promise<ReverseGeocodeOutcome> {
  const started = performance.now?.() ?? Date.now();
  const key = keyFor(lat, lon);
  const cache = readCache();
  const hit = cache[key];
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return { ok: true, data: hit.data, fromCache: true, durationMs: 0 };
  }
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { headers: { "Accept-Language": "pt-BR" }, signal: opts.signal },
    );
    const durationMs = (performance.now?.() ?? Date.now()) - started;
    if (!res.ok) {
      return { ok: false, durationMs, status: res.status, reason: `http_${res.status}` };
    }
    const j = await res.json().catch(() => null);
    const data = normalize((j?.address ?? {}) as Record<string, string | undefined>);
    // Não gravar cache vazio como se fosse válido.
    if (!hasAnyField(data)) {
      return { ok: false, durationMs, status: res.status, reason: "empty" };
    }
    cache[key] = { at: Date.now(), data };
    writeCache(cache);
    return { ok: true, data, fromCache: false, durationMs, status: res.status };
  } catch (err) {
    const durationMs = (performance.now?.() ?? Date.now()) - started;
    const name = err instanceof Error ? err.name : "";
    return {
      ok: false,
      durationMs,
      reason: name === "AbortError" ? "abort" : "network",
    };
  }
}
