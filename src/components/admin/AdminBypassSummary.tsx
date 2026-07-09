import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";

/**
 * Card compacto que resume, nas janelas de 7h e 24h:
 * - Cliques capturados pelo funil obrigatório
 * - Bypass (cliques que escaparam da triagem)
 * Usado no topo do /admin para visão rápida de conversão × vazamento.
 */
export function AdminBypassSummary() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    funnel7h: 0,
    bypass7h: 0,
    funnel24h: 0,
    bypass24h: 0,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const now = Date.now();
      const h7 = new Date(now - 7 * 3600 * 1000).toISOString();
      const h24 = new Date(now - 24 * 3600 * 1000).toISOString();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = (supabase.from as any)("wa_bypass_events");
      const [f7, b7, f24, b24] = await Promise.all([
        t.select("id", { count: "exact", head: true }).eq("bypass", false).gte("created_at", h7),
        t.select("id", { count: "exact", head: true }).eq("bypass", true).gte("created_at", h7),
        t.select("id", { count: "exact", head: true }).eq("bypass", false).gte("created_at", h24),
        t.select("id", { count: "exact", head: true }).eq("bypass", true).gte("created_at", h24),
      ]);
      setCounts({
        funnel7h: f7.count ?? 0,
        bypass7h: b7.count ?? 0,
        funnel24h: f24.count ?? 0,
        bypass24h: b24.count ?? 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  const Cell = ({ label, value, tone }: { label: string; value: number; tone: "ok" | "warn" }) => (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {tone === "ok" ? (
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <ShieldAlert className="h-3.5 w-3.5 text-orange-500" />
        )}
        {label}
      </div>
      <span className={`text-lg font-bold ${tone === "warn" && value > 0 ? "text-orange-600" : ""}`}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : value}
      </span>
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Funil obrigatório × Bypass (últimas horas)
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Cell label="Funil 7h" value={counts.funnel7h} tone="ok" />
        <Cell label="Bypass 7h" value={counts.bypass7h} tone="warn" />
        <Cell label="Funil 24h" value={counts.funnel24h} tone="ok" />
        <Cell label="Bypass 24h" value={counts.bypass24h} tone="warn" />
      </CardContent>
    </Card>
  );
}
