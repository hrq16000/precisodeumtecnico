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
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle, ChevronLeft, ChevronRight, Download, ExternalLink, Filter,
  Loader2, RefreshCw, X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FailureRow {
  id: string;
  reason: string;
  session_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const REASONS = [
  "invalid_session",
  "invalid_token",
  "missing_file",
  "unsupported_mime",
  "file_too_large",
  "upload_failed",
] as const;

function toCsv(rows: FailureRow[]): string {
  const headers = ["id", "created_at", "reason", "session_id", "ip_address", "user_agent", "details"];
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    const safe = s.replace(/"/g, '""');
    return /[",\n;]/.test(safe) ? `"${safe}"` : safe;
  };
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => esc((r as unknown as Record<string, unknown>)[h])).join(","));
  }
  lines.push(`# total_rows,${rows.length}`);
  return lines.join("\n");
}

const PAGE_SIZE = 25;

export function TriageFailuresLog() {
  const [rows, setRows] = useState<FailureRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Filters
  const [reasonFilter, setReasonFilter] = useState<string>("all");
  const [sessionFilter, setSessionFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("triage_media_failures")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (reasonFilter !== "all") q = q.eq("reason", reasonFilter);
    if (sessionFilter.trim()) q = q.ilike("session_id", `${sessionFilter.trim()}%`);
    if (fromDate) q = q.gte("created_at", new Date(fromDate).toISOString());
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      q = q.lte("created_at", end.toISOString());
    }

    const { data, error, count } = await q;
    if (error) {
      toast({ variant: "destructive", title: "Falha ao carregar falhas", description: error.message });
    } else {
      setRows((data || []) as FailureRow[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page]);

  const applyFilters = () => { setPage(0); setTimeout(load, 0); };

  const clearFilters = () => {
    setReasonFilter("all"); setSessionFilter(""); setFromDate(""); setToDate("");
    setPage(0);
    setTimeout(load, 0);
  };

  const exportCsv = () => {
    if (rows.length === 0) {
      toast({ title: "Nada para exportar", description: "Filtro atual não retornou linhas." });
      return;
    }
    const csv = toCsv(rows);
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `triage-failures-${format(new Date(), "yyyyMMdd-HHmm")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "CSV exportado", description: `${rows.length} linha(s).` });
  };

  const stats = useMemo(() => {
    const byReason: Record<string, number> = {};
    for (const r of rows) byReason[r.reason] = (byReason[r.reason] ?? 0) + 1;
    return { total: rows.length, byReason };
  }, [rows]);

  const openLead = (sessionId: string | null) => {
    if (!sessionId) return;
    window.dispatchEvent(new CustomEvent("admin:open-lead-by-session", { detail: { sessionId } }));
  };

  return (
    <Card className="mb-8">
      <CardHeader className="space-y-3">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Falhas de upload (triagem)
            <Badge variant="outline" className="ml-2">{total} total</Badge>
            {Object.entries(stats.byReason).slice(0, 3).map(([k, v]) => (
              <Badge key={k} variant="secondary" className="text-[10px]">{k}: {v}</Badge>
            ))}
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={exportCsv} disabled={loading || rows.length === 0}>
              <Download className="h-3 w-3 mr-1" /> CSV
            </Button>
            <Button size="sm" variant="outline" onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 border-t">
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1"><Filter className="h-3 w-3" />Tipo de erro</Label>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Sessão</Label>
            <Input
              placeholder="prefixo da sessão"
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="h-8 text-xs font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">De</Label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Até</Label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-8 text-xs" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={applyFilters} disabled={loading}>Aplicar filtros</Button>
          <Button size="sm" variant="ghost" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" /> Limpar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Sem falhas para os filtros atuais.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quando</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Sessão</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="text-right">Lead</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-xs">
                      {format(new Date(r.created_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="text-[10px]">{r.reason}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {r.session_id ? `${r.session_id.slice(0, 10)}…` : "—"}
                    </TableCell>
                    <TableCell className="text-xs">{r.ip_address ?? "—"}</TableCell>
                    <TableCell className="text-xs max-w-[280px] truncate">
                      {r.details ? JSON.stringify(r.details) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" disabled={!r.session_id} onClick={() => openLead(r.session_id)}>
                        <ExternalLink className="h-3 w-3 mr-1" /> Abrir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>Página {page + 1} de {Math.max(1, Math.ceil(total / PAGE_SIZE))} · {total} registros</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled={page === 0 || loading} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline"
              disabled={loading || (page + 1) * PAGE_SIZE >= total}
              onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
