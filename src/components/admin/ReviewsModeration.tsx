import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Check, X, RefreshCw, Loader2 } from "lucide-react";

/**
 * Moderação de avaliações: somente avaliações aprovadas E com autorização de
 * publicação chegam ao site e ao Review JSON-LD.
 */

interface ReviewRow {
  id: string;
  created_at: string;
  name: string;
  city: string | null;
  neighborhood: string | null;
  service: string | null;
  protocol: string | null;
  rating: number;
  comment: string | null;
  publish_consent: boolean;
  status: string;
}

const FILTERS = ["pending", "approved", "rejected"] as const;
type Filter = (typeof FILTERS)[number];

const LABEL: Record<Filter, string> = {
  pending: "Pendentes",
  approved: "Aprovadas",
  rejected: "Rejeitadas",
};

export function ReviewsModeration() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const { toast } = useToast();

  async function load(f: Filter = filter) {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", f)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      toast({ variant: "destructive", title: "Erro ao carregar avaliações", description: error.message });
    } else {
      setRows((data || []) as ReviewRow[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function moderate(id: string, status: "approved" | "rejected") {
    const { error } = await supabase
      .from("reviews")
      .update({ status, moderated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
      return;
    }
    toast({ title: status === "approved" ? "Avaliação publicada" : "Avaliação rejeitada" });
    setRows((r) => r.filter((x) => x.id !== id));
  }

  const cities = Array.from(new Set(rows.map((r) => r.city).filter(Boolean) as string[])).sort();
  const services = Array.from(new Set(rows.map((r) => r.service).filter(Boolean) as string[])).sort();

  const q = query.trim().toLowerCase();
  const visible = rows.filter((r) => {
    if (cityFilter !== "all" && (r.city || "") !== cityFilter) return false;
    if (serviceFilter !== "all" && (r.service || "") !== serviceFilter) return false;
    if (!q) return true;
    return [r.name, r.protocol, r.neighborhood, r.comment]
      .filter(Boolean)
      .some((v) => (v as string).toLowerCase().includes(q));
  });

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" aria-hidden="true" />
          Avaliações de clientes
        </CardTitle>
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
            >
              {LABEL[f]}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => load()} aria-label="Recarregar avaliações">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3 mb-5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por cliente, OS ou bairro"
              aria-label="Buscar avaliações por cliente, número da OS ou bairro"
              className="w-full h-11 pl-9 pr-3 rounded-lg border border-input bg-background text-sm text-foreground"
            />
          </div>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            aria-label="Filtrar por cidade"
            className="h-11 px-3 rounded-lg border border-input bg-background text-sm text-foreground"
          >
            <option value="all">Todas as cidades</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            aria-label="Filtrar por serviço"
            className="h-11 px-3 rounded-lg border border-input bg-background text-sm text-foreground"
          >
            <option value="all">Todos os serviços</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <p className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Carregando…
          </p>
        ) : visible.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma avaliação {LABEL[filter].toLowerCase()} com esses filtros.</p>
        ) : (
          <ul className="space-y-4">
            {visible.map((r) => (

              <li key={r.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-card-foreground">
                      {r.name}
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        · {[r.city, r.neighborhood].filter(Boolean).join(" - ") || "sem local"}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("pt-BR")}
                      {r.protocol ? ` · ${r.protocol}` : ""}
                      {r.service ? ` · ${r.service}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex" aria-label={`Nota ${r.rating} de 5`}>
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" aria-hidden="true" />
                      ))}
                    </span>
                    <Badge variant={r.publish_consent ? "default" : "secondary"}>
                      {r.publish_consent ? "Autoriza publicação" : "Sem autorização"}
                    </Badge>
                  </div>
                </div>
                {r.comment && <p className="text-sm text-card-foreground mt-3">"{r.comment}"</p>}
                {!r.publish_consent && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Mesmo aprovada, esta avaliação não é exibida no site: o cliente não autorizou a
                    publicação.
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  {r.status !== "approved" && (
                    <Button size="sm" onClick={() => moderate(r.id, "approved")}>
                      <Check className="w-4 h-4 mr-1" aria-hidden="true" /> Aprovar
                    </Button>
                  )}
                  {r.status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => moderate(r.id, "rejected")}>
                      <X className="w-4 h-4 mr-1" aria-hidden="true" /> Rejeitar
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
