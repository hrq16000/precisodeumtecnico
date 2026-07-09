import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar,
} from "recharts";
import {
  extractCityFromPath, extractServiceFromEvent, normalizeSource,
} from "@/lib/waClicksParse";

interface Row {
  id: string;
  source: string | null;
  category: string | null;
  kind: string;
  bypass: boolean;
  page_path: string | null;
  created_at: string;
}

const RANGE_DAYS: Record<string, number> = { "7": 7, "30": 30, "90": 90 };
const ALL = "__all__";

/**
 * Dashboard interno de cliques em CTAs WhatsApp/telefone.
 * Filtra por city / service / source, com contagem e tendência diária.
 * Dados vêm de wa_bypass_events (RLS admin-only).
 */
export function WAClicksDashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [rangeKey, setRangeKey] = useState<"7" | "30" | "90">("30");
  const [cityFilter, setCityFilter] = useState<string>(ALL);
  const [serviceFilter, setServiceFilter] = useState<string>(ALL);
  const [sourceFilter, setSourceFilter] = useState<string>(ALL);

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - RANGE_DAYS[rangeKey] * 86400_000).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q = (supabase.from as any)("wa_bypass_events")
      .select("id,source,category,kind,bypass,page_path,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    const { data } = await q;
    setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [rangeKey]);

  const enriched = useMemo(() => rows.map(r => ({
    ...r,
    city: extractCityFromPath(r.page_path) ?? "(sem cidade)",
    service: extractServiceFromEvent(r.source, r.category, r.page_path) ?? "(sem serviço)",
    src: normalizeSource(r.source),
    day: r.created_at.slice(0, 10),
  })), [rows]);

  const cityOptions = useMemo(
    () => Array.from(new Set(enriched.map(e => e.city))).sort(),
    [enriched],
  );
  const serviceOptions = useMemo(
    () => Array.from(new Set(enriched.map(e => e.service))).sort(),
    [enriched],
  );
  const sourceOptions = useMemo(
    () => Array.from(new Set(enriched.map(e => e.src))).sort(),
    [enriched],
  );

  const filtered = useMemo(() => enriched.filter(e =>
    (cityFilter === ALL || e.city === cityFilter) &&
    (serviceFilter === ALL || e.service === serviceFilter) &&
    (sourceFilter === ALL || e.src === sourceFilter)
  ), [enriched, cityFilter, serviceFilter, sourceFilter]);

  const daily = useMemo(() => {
    const map = new Map<string, number>();
    // seed em dias sem clique
    const days = RANGE_DAYS[rangeKey];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
      map.set(d, 0);
    }
    for (const e of filtered) map.set(e.day, (map.get(e.day) ?? 0) + 1);
    return Array.from(map.entries()).map(([day, count]) => ({ day: day.slice(5), count }));
  }, [filtered, rangeKey]);

  const topSources = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of filtered) map.set(e.src, (map.get(e.src) ?? 0) + 1);
    return Array.from(map.entries())
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filtered]);

  const total = filtered.length;
  const funnel = filtered.filter(e => !e.bypass).length;
  const bypass = filtered.filter(e => e.bypass).length;
  const uniqueCities = new Set(filtered.map(e => e.city)).size;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            Cliques CTAs WhatsApp — dashboard
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Filtre por city / service / source e veja a tendência diária.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Select value={rangeKey} onValueChange={(v) => setRangeKey(v as "7" | "30" | "90")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger><SelectValue placeholder="Cidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas as cidades</SelectItem>
              {cityOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger><SelectValue placeholder="Serviço" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos os serviços</SelectItem>
              {serviceOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas as sources</SelectItem>
              {sourceOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <KPI label="Cliques" value={total} loading={loading} />
          <KPI label="Via funil" value={funnel} loading={loading} />
          <KPI label="Bypass" value={bypass} loading={loading} tone={bypass > 0 ? "warn" : "ok"} />
          <KPI label="Cidades" value={uniqueCities} loading={loading} />
        </div>

        {/* Trend */}
        <div className="rounded-lg border p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <TrendingUp className="h-3 w-3" /> Tendência diária ({rangeKey}d)
          </div>
          <div className="h-52">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={daily}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top sources */}
        <div className="rounded-lg border p-3">
          <div className="text-xs text-muted-foreground mb-2">Top 10 sources</div>
          <div className="h-56">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : topSources.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                Sem cliques no período/filtros.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSources} layout="vertical" margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="source" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function KPI({
  label, value, loading, tone = "ok",
}: { label: string; value: number; loading: boolean; tone?: "ok" | "warn" }) {
  return (
    <div className="rounded-md border px-3 py-2 flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Badge variant={tone === "warn" && value > 0 ? "destructive" : "secondary"}>{value}</Badge>
      )}
    </div>
  );
}
