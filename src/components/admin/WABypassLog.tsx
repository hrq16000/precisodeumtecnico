import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle, ChevronLeft, ChevronRight, Download, Loader2, RefreshCw, ShieldAlert, X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Row {
  id: string;
  source: string | null;
  href: string | null;
  kind: string;
  category: string | null;
  bypass: boolean;
  page_path: string | null;
  user_agent: string | null;
  session_id: string | null;
  created_at: string;
}

const PAGE_SIZE = 25;

export function WABypassLog() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [bypassOnly, setBypassOnly] = useState<"all" | "bypass" | "captured">("all");
  const [search, setSearch] = useState("");
  const [recentBypass, setRecentBypass] = useState(0);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = (supabase.from as any)("wa_bypass_events")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (bypassOnly === "bypass") q = q.eq("bypass", true);
    if (bypassOnly === "captured") q = q.eq("bypass", false);
    if (search.trim()) q = q.or(`source.ilike.%${search.trim()}%,page_path.ilike.%${search.trim()}%,href.ilike.%${search.trim()}%`);

    const { data, error, count } = await q;
    if (error) {
      toast({ variant: "destructive", title: "Falha", description: error.message });
    } else {
      setRows((data || []) as Row[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  };

  // Exporta os eventos filtrados (todos, não só a página atual) em CSV
  // com linha final "TOTAL,<n>". Limite defensivo de 10.000 linhas.
  const exportCsv = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = (supabase.from as any)("wa_bypass_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10000);
    if (bypassOnly === "bypass") q = q.eq("bypass", true);
    if (bypassOnly === "captured") q = q.eq("bypass", false);
    if (search.trim()) q = q.or(`source.ilike.%${search.trim()}%,page_path.ilike.%${search.trim()}%,href.ilike.%${search.trim()}%`);

    const { data, error } = await q;
    if (error) {
      toast({ variant: "destructive", title: "Falha no export", description: error.message });
      return;
    }
    const list = (data || []) as Row[];
    const esc = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = ["created_at", "bypass", "kind", "source", "page_path", "href", "category", "session_id", "user_agent"];
    const lines = [header.join(",")];
    for (const r of list) {
      lines.push([
        r.created_at, r.bypass ? "true" : "false", r.kind, r.source ?? "", r.page_path ?? "",
        r.href ?? "", r.category ?? "", r.session_id ?? "", r.user_agent ?? "",
      ].map(esc).join(","));
    }
    lines.push(`TOTAL,${list.length}`);
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wa-bypass-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Export concluído", description: `${list.length} registros exportados.` });
  };

  // Alerta: quantos bypass reais nas últimas 24h
  const loadAlert = async () => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await ((supabase.from as any)("wa_bypass_events")
      .select("id", { count: "exact", head: true })
      .eq("bypass", true)
      .gte("created_at", since));
    setRecentBypass(count ?? 0);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, bypassOnly]);
  useEffect(() => { loadAlert(); }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const alertLevel = useMemo(() => {
    if (recentBypass >= 20) return "high";
    if (recentBypass >= 5) return "medium";
    return "ok";
  }, [recentBypass]);

  return (
    <Card className="mb-8">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="h-4 w-4 text-orange-500" />
            Auditoria do funil obrigatório (WhatsApp/telefone)
            <Badge variant="outline" className="ml-2">{total}</Badge>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => { setPage(0); load(); loadAlert(); }} disabled={loading}>
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          </Button>
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={loading} className="ml-2">
            <Download className="h-3 w-3 mr-1" /> CSV
          </Button>
        </div>

        {alertLevel !== "ok" && (
          <Alert variant={alertLevel === "high" ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {recentBypass} bypass{recentBypass > 1 ? "es" : ""} do funil nas últimas 24h
            </AlertTitle>
            <AlertDescription className="text-xs">
              Clicks em CTAs WhatsApp/telefone que NÃO passaram pela triagem (whitelist do rodapé ou navegação direta).
              Filtre por "Apenas bypass" para investigar.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t">
          <div className="space-y-1">
            <Label className="text-xs">Tipo</Label>
            <Select value={bypassOnly} onValueChange={(v) => { setBypassOnly(v as "all" | "bypass" | "captured"); setPage(0); }}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cliques</SelectItem>
                <SelectItem value="bypass">Apenas bypass</SelectItem>
                <SelectItem value="captured">Capturados p/ triagem</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs">Busca (source / path / href)</Label>
            <div className="flex gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ex.: hero, /precos, wa.me"
                className="h-8 text-xs"
                onKeyDown={(e) => { if (e.key === "Enter") { setPage(0); load(); } }}
              />
              <Button size="sm" onClick={() => { setPage(0); load(); }}>Buscar</Button>
              {search && (
                <Button size="sm" variant="ghost" onClick={() => { setSearch(""); setPage(0); load(); }}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Sem eventos para os filtros atuais.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quando</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Página</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Sessão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-xs">
                      {format(new Date(r.created_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {r.bypass
                        ? <Badge variant="destructive" className="text-[10px]">BYPASS</Badge>
                        : <Badge className="bg-emerald-500 text-[10px]">FUNIL</Badge>}
                    </TableCell>
                    <TableCell className="text-xs">{r.source ?? "—"}</TableCell>
                    <TableCell className="text-xs max-w-[220px] truncate" title={r.page_path ?? ""}>
                      {r.page_path ?? "—"}
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{r.kind}</Badge></TableCell>
                    <TableCell className="font-mono text-[10px]">
                      {r.session_id ? `${r.session_id.slice(0, 8)}…` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>Página {page + 1} de {totalPages}</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
