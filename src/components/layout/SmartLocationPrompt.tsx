import { useEffect, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserRegion } from "@/hooks/useUserRegion";

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

  const save = (source: StoredLocation["source"] = "manual") => {
    if (!form.city) return;
    const payload: StoredLocation = { ...form, source, savedAt: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(payload)); } catch { /* noop */ }
    setOpen(false);
  };

  const useGps = () => {
    if (!("geolocation" in navigator)) return;
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
          setForm((f) => ({
            ...f,
            city: a.city || a.town || a.village || a.municipality || f.city,
            uf: a.state_code || a.state || f.uf,
            neighborhood: a.suburb || a.neighbourhood || a.city_district || f.neighborhood,
            street: a.road || f.street,
            number: a.house_number || f.number,
            source: "gps",
          }));
        } catch { /* noop */ }
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const dismiss = () => {
    // salva o que já temos por IP para uso no WhatsApp
    if (form.city) {
      try {
        localStorage.setItem(KEY, JSON.stringify({
          city: form.city, uf: form.uf, source: "ip",
          savedAt: new Date().toISOString(),
        } satisfies StoredLocation));
      } catch { /* noop */ }
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(v) : dismiss())}>
      <DialogContent className="sm:max-w-md">
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
            <Button type="button" variant="outline" onClick={useGps} disabled={gpsLoading} className="w-full">
              {gpsLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
              Usar minha localização (GPS)
            </Button>
          </div>
          <label className="col-span-2 text-xs text-muted-foreground">Cidade</label>
          <Input className="col-span-2" value={form.city ?? ""} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Cidade" />
          <Input value={form.uf ?? ""} onChange={(e) => setForm({ ...form, uf: e.target.value.toUpperCase().slice(0, 2) })} placeholder="UF" maxLength={2} />
          <Input value={form.neighborhood ?? ""} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} placeholder="Bairro" />
          <Input className="col-span-2" value={form.street ?? ""} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Rua (opcional)" />
          <Input value={form.number ?? ""} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="Número" />
          <Input value={form.complement ?? ""} onChange={(e) => setForm({ ...form, complement: e.target.value })} placeholder="Complemento" />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={dismiss}>Agora não</Button>
          <Button onClick={() => save(form.source ?? "manual")} disabled={!form.city}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
