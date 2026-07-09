import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOCATION_UPDATED_EVENT, useUserRegion } from "@/hooks/useUserRegion";

/**
 * Prompt não-agressivo de localização.
 * - Aparece após 5s de navegação (uma vez por sessão).
 * - Não abre em rotas admin/quiz.
 * - Salva em `user_location_full_v1` (usado por buildWhatsAppUrl).
 * - Se negado, mantém apenas cidade/bairro aproximados por IP.
 */
const KEY = "user_location_full_v1";
const PROMPTED = "user_location_prompted_v2";
const BLOCKED_PATHS = ["/admin", "/auth", "/diagnostics"];

interface StoredLocation {
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
  uf?: string;
  source?: "manual" | "gps" | "ip";
  savedAt?: string;
}

function readStored(): StoredLocation | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredLocation) : null;
  } catch { return null; }
}

export function SmartLocationPrompt() {
  const { region } = useUserRegion();
  const [open, setOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [form, setForm] = useState<StoredLocation>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (readStored()) return; // já respondeu
    try { if (sessionStorage.getItem(PROMPTED)) return; } catch { /* noop */ }
    if (BLOCKED_PATHS.some((p) => window.location.pathname.startsWith(p))) return;

    const t = setTimeout(() => {
      // não interromper se o quiz estiver aberto
      if (document.querySelector('[role="dialog"]')) return;
      setForm({
        city: region.city,
        uf: region.region,
        neighborhood: "",
        street: "",
        number: "",
        source: "ip",
      });
      setOpen(true);
      try { sessionStorage.setItem(PROMPTED, "1"); } catch { /* noop */ }
    }, 5000);
    return () => clearTimeout(t);
  }, [region.city, region.region]);

  // Persiste + notifica consumidores (useUserRegion, WhatsApp helpers).
  const persist = (payload: StoredLocation) => {
    try { localStorage.setItem(KEY, JSON.stringify(payload)); } catch { /* noop */ }
    try { window.dispatchEvent(new Event(LOCATION_UPDATED_EVENT)); } catch { /* noop */ }
  };

  const save = (source: StoredLocation["source"] = "manual") => {
    if (!form.city) return;
    persist({ ...form, source, savedAt: new Date().toISOString() });
    setOpen(false);
  };

  const useGps = () => {
    setGpsError(null);
    setGpsSuccess(false);
    if (!("geolocation" in navigator)) {
      setGpsError("Geolocalização indisponível neste navegador. Preencha manualmente.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "pt-BR" } },
          );
          const j = await r.json();
          const a = j.address ?? {};
          const next: StoredLocation = {
            city: a.city || a.town || a.village || a.municipality || form.city,
            uf: a.state_code || a.state || form.uf,
            neighborhood: a.suburb || a.neighbourhood || a.city_district || form.neighborhood,
            street: a.road || form.street,
            number: a.house_number || form.number,
            complement: form.complement,
            source: "gps",
            savedAt: new Date().toISOString(),
          };
          setForm(next);
          // Persistência automática — GPS aceito não pode ficar dependendo
          // do usuário clicar "Confirmar" para atualizar cidade/bairro.
          if (next.city) {
            persist(next);
            setGpsSuccess(true);
          } else {
            setGpsError("Não foi possível identificar sua cidade. Confirme manualmente.");
          }
        } catch {
          setGpsError("Falha ao obter endereço. Confirme manualmente.");
        }
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(
          err.code === err.PERMISSION_DENIED
            ? "Permissão negada. Preencha manualmente sua cidade e bairro."
            : "Não foi possível obter sua localização. Preencha manualmente.",
        );
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const dismiss = () => {
    // salva o que já temos por IP para uso no WhatsApp
    if (form.city && !gpsSuccess) {
      persist({
        city: form.city, uf: form.uf, source: "ip",
        savedAt: new Date().toISOString(),
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(v) : dismiss())}>
      <DialogContent className="sm:max-w-md" data-testid="smart-location-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Onde você está?
          </DialogTitle>
          <DialogDescription>
            Confirme sua localização para agilizarmos o atendimento e o orçamento.
            Enviamos junto no WhatsApp quando você chamar um técnico.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={useGps}
              disabled={gpsLoading}
              className="w-full"
              data-testid="smart-location-gps"
            >
              {gpsLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
              {gpsLoading ? "Detectando..." : "Usar minha localização (GPS)"}
            </Button>
          </div>
          {gpsSuccess && (
            <p
              className="col-span-2 flex items-center gap-2 text-xs text-green-600"
              data-testid="smart-location-success"
              role="status"
            >
              <CheckCircle2 className="w-4 h-4" /> Localização detectada e salva.
            </p>
          )}
          {gpsError && (
            <p
              className="col-span-2 text-xs text-destructive"
              data-testid="smart-location-error"
              role="alert"
            >
              {gpsError}
            </p>
          )}
          <label className="col-span-2 text-xs text-muted-foreground">Cidade</label>
          <Input data-testid="smart-location-city" className="col-span-2" value={form.city ?? ""} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Cidade" />
          <Input value={form.uf ?? ""} onChange={(e) => setForm({ ...form, uf: e.target.value.toUpperCase().slice(0, 2) })} placeholder="UF" maxLength={2} />
          <Input data-testid="smart-location-neighborhood" value={form.neighborhood ?? ""} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} placeholder="Bairro" />
          <Input className="col-span-2" value={form.street ?? ""} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Rua (opcional)" />
          <Input value={form.number ?? ""} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="Número" />
          <Input value={form.complement ?? ""} onChange={(e) => setForm({ ...form, complement: e.target.value })} placeholder="Complemento" />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={dismiss}>Agora não</Button>
          <Button onClick={() => save(form.source ?? "manual")} disabled={!form.city}>
            {gpsSuccess ? "Fechar" : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
