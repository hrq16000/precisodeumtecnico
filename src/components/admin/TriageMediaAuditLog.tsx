import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Eye, FileVideo, Image as ImageIcon, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditRow {
  id: string;
  session_id: string;
  object_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  ip_address: string | null;
  user_agent: string | null;
  lead_id: string | null;
  created_at: string;
}

const BUCKET = "triage-media";

function humanSize(b: number | null) {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Admin-only audit log of triage media uploads.
 * RLS allows SELECT only to admins; this component is also rendered behind
 * the /admin route guard. Each row offers a server-signed preview URL.
 */
export function TriageMediaAuditLog() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<{ url: string; isVideo: boolean } | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("triage_media_uploads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      toast({ variant: "destructive", title: "Falha ao carregar auditoria", description: error.message });
    } else {
      setRows((data || []) as AuditRow[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const preview = async (path: string) => {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 600);
    if (error || !data?.signedUrl) {
      toast({ variant: "destructive", title: "Falha ao gerar preview", description: error?.message ?? "" });
      return;
    }
    setPreviewUrl({ url: data.signedUrl, isVideo: /\.(mp4|mov|webm|m4v)$/i.test(path) });
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Auditoria de mídias de triagem
          <Badge variant="outline" className="ml-2">{rows.length}</Badge>
        </CardTitle>
        <Button size="sm" variant="outline" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma mídia enviada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quando</TableHead>
                  <TableHead>Sessão</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead className="text-right">Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const isVideo = r.mime_type?.startsWith("video/");
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {format(new Date(r.created_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.session_id.slice(0, 8)}…</TableCell>
                      <TableCell className="font-mono text-xs">
                        {r.lead_id ? `${r.lead_id.slice(0, 8)}…` : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1">
                          {isVideo ? <FileVideo className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                          {r.mime_type ?? "?"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{humanSize(r.size_bytes)}</TableCell>
                      <TableCell className="text-xs">{r.ip_address ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => preview(r.object_path)}>
                          <Eye className="h-3 w-3 mr-1" /> Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {previewUrl && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setPreviewUrl(null)}
          >
            <div className="max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              {previewUrl.isVideo ? (
                <video src={previewUrl.url} controls className="max-h-[90vh] rounded" />
              ) : (
                <img src={previewUrl.url} alt="Mídia de triagem" className="max-h-[90vh] rounded" />
              )}
              <Button className="mt-3" variant="secondary" onClick={() => setPreviewUrl(null)}>Fechar</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
