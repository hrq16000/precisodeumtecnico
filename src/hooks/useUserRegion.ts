import { useEffect, useState, useCallback } from "react";

export type UserRegion = {
  city: string;
  region?: string; // estado (UF)
  country?: string;
  neighborhood?: string;
  source: "gps" | "ip" | "manual" | "default";
};

const STORAGE_KEY = "user_region_v1";
const FULL_KEY = "user_location_full_v1";
export const LOCATION_UPDATED_EVENT = "user-location-updated";

const DEFAULT_REGION: UserRegion = {
  city: "Curitiba",
  region: "PR",
  country: "BR",
  source: "default",
};

// Prioridade: GPS > manual (full) > manual (region) > IP > default.
// Lê tanto `user_location_full_v1` (SmartLocationPrompt/GPS) quanto
// `user_region_v1` (fallback legado). O primeiro vence quando presente.
function readStored(): UserRegion | null {
  try {
    const raw = localStorage.getItem(FULL_KEY);
    if (raw) {
      const p = JSON.parse(raw) as {
        city?: string; uf?: string; neighborhood?: string; source?: string;
      };
      if (p?.city) {
        return {
          city: p.city,
          region: p.uf,
          neighborhood: p.neighborhood,
          country: "BR",
          source: (p.source === "gps" || p.source === "manual" || p.source === "ip")
            ? p.source
            : "manual",
        };
      }
    }
  } catch { /* noop */ }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserRegion;
    if (parsed && typeof parsed.city === "string" && parsed.city.length > 0) return parsed;
  } catch { /* noop */ }
  return null;
}

function writeStored(region: UserRegion) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(region));
  } catch { /* noop */ }
}

async function fetchByIp(): Promise<UserRegion | null> {
  // Try ipwho.is first (free, no key, https, CORS-enabled)
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    const res = await fetch("https://ipwho.is/", { signal: ctl.signal });
    clearTimeout(t);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.city) {
        return {
          city: data.city as string,
          region: (data.region_code || data.region) as string | undefined,
          country: data.country_code as string | undefined,
          source: "ip",
        };
      }
    }
  } catch {
    /* fallback */
  }
  // Fallback: ipapi.co
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    const res = await fetch("https://ipapi.co/json/", { signal: ctl.signal });
    clearTimeout(t);
    if (res.ok) {
      const data = await res.json();
      if (data && data.city) {
        return {
          city: data.city as string,
          region: (data.region_code || data.region) as string | undefined,
          country: data.country_code as string | undefined,
          source: "ip",
        };
      }
    }
  } catch {
    /* noop */
  }
  return null;
}

export function useUserRegion() {
  const [region, setRegion] = useState<UserRegion>(() => readStored() ?? DEFAULT_REGION);
  const [loading, setLoading] = useState(false);
  const [askPrompt, setAskPrompt] = useState(false);

  useEffect(() => {
    const stored = readStored();
    // If user already set manually, respect it.
    if (stored && stored.source === "manual") return;
    let cancelled = false;
    setLoading(true);
    fetchByIp()
      .then((r) => {
        if (cancelled) return;
        if (r) {
          setRegion(r);
          writeStored(r);
        }
        // After detection (or failure), prompt user once to confirm
        const promptedKey = "user_region_prompted_v1";
        try {
          if (!localStorage.getItem(promptedKey)) {
            setAskPrompt(true);
            localStorage.setItem(promptedKey, "1");
          }
        } catch {
          /* noop */
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const setManualRegion = useCallback((city: string, uf?: string) => {
    const next: UserRegion = {
      city: city.trim(),
      region: uf?.trim() || undefined,
      country: "BR",
      source: "manual",
    };
    setRegion(next);
    writeStored(next);
    setAskPrompt(false);
  }, []);

  const dismissPrompt = useCallback(() => setAskPrompt(false), []);

  return { region, loading, askPrompt, setManualRegion, dismissPrompt };
}
