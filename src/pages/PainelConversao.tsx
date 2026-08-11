import { useCallback, useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { readLocalAnalyticsQueue, type LocalAnalyticsEvent } from "@/lib/localAnalytics";
import { RefreshCw, Download } from "lucide-react";

/**
 * Painel operacional (noindex) de conversão por página.
 *
 * Lê a fila local de analytics (memória do tab, sem PII, sem backend) e
 * agrega cliques de WhatsApp/CTA por rota — útil para inspecionar rapidamente
 * quais páginas do cluster de informática convertem melhor durante testes e
 * sessões de QA. Não substitui GA4: é leitura instantânea da sessão atual.
 */

interface Row {
  path: string;
  whatsapp: number;
  cta: number;
  views: number;
  triage: number;
}

const INFO_HINTS = ["informatica", "notebook", "computador", "formatacao", "pc", "wifi", "ssd"];

function aggregate(events: LocalAnalyticsEvent[]): Row[] {
  const map = new Map<string, Row>();
  for (const e of events) {
    const path = e.page_path || "(sem rota)";
    const row = map.get(path) ?? { path, whatsapp: 0, cta: 0, views: 0, triage: 0 };
    if (e.event === "whatsapp_click") row.whatsapp += 1;
    else if (e.event === "cta_click") row.cta += 1;
    else if (e.event === "virtual_page_view") row.views += 1;
    else if (e.event.startsWith("triage_")) row.triage += 1;
    map.set(path, row);
  }
  return Array.from(map.values()).sort(
    (a, b) => b.whatsapp + b.cta - (a.whatsapp + a.cta) || b.views - a.views,
  );
}

const PainelConversao = () => {
  const [events, setEvents] = useState<LocalAnalyticsEvent[]>([]);
  const [onlyInfo, setOnlyInfo] = useState(false);

  const refresh = useCallback(() => {
    setEvents(readLocalAnalyticsQueue());
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 4000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const rows = useMemo(() => {
    const all = aggregate(events);
    return onlyInfo
      ? all.filter((r) => INFO_HINTS.some((h) => r.path.toLowerCase().includes(h)))
      : all;
  }, [events, onlyInfo]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          whatsapp: acc.whatsapp + r.whatsapp,
          cta: acc.cta + r.cta,
          views: acc.views + r.views,
        }),
        { whatsapp: 0, cta: 0, views: 0 },
      ),
    [rows],
  );

  const exportCsv = useCallback(() => {
    const header = "page_path,pageviews,whatsapp_clicks,cta_clicks,triage_events,conversion_rate\n";
    const body = rows
      .map((r) => {
        const rate = r.views > 0 ? (((r.whatsapp + r.cta) / r.views) * 100).toFixed(1) : "";
        return `"${r.path}",${r.views},${r.whatsapp},${r.cta},${r.triage},${rate}`;
      })
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversao-por-pagina.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [rows]);

  return (
    <Layout>
      <SEOHead
        title="Painel de conversão por página (uso interno)"
        description="Painel operacional interno de leitura da fila local de analytics: cliques de WhatsApp e CTA por rota."
        canonical="https://precisodeumtecnico.com/operacao/painel-conversao"
        noindex
      />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold text-foreground">Painel de conversão por página</h1>
        <p className="mt-3 text-muted-foreground">
          Leitura instantânea da fila local de eventos desta aba (sem PII, sem backend). Navegue
          pelo site na mesma aba e volte aqui para ver os cliques agregados por rota. Para dados
          históricos e multiusuário, use o GA4.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" aria-hidden />
            Atualizar
          </Button>
          <Button onClick={exportCsv} variant="outline" disabled={rows.length === 0}>
            <Download className="w-4 h-4 mr-2" aria-hidden />
            Exportar CSV
          </Button>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={onlyInfo}
              onChange={(e) => setOnlyInfo(e.target.checked)}
              className="h-4 w-4"
            />
            Somente cluster de informática
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Pageviews", value: totals.views },
            { label: "Cliques WhatsApp", value: totals.whatsapp },
            { label: "Cliques em CTA", value: totals.cta },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <caption className="sr-only">Conversão agregada por rota</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-4 font-semibold text-foreground">Rota</th>
                <th scope="col" className="py-2 pr-4 font-semibold text-foreground">Views</th>
                <th scope="col" className="py-2 pr-4 font-semibold text-foreground">WhatsApp</th>
                <th scope="col" className="py-2 pr-4 font-semibold text-foreground">CTA</th>
                <th scope="col" className="py-2 pr-4 font-semibold text-foreground">Triagem</th>
                <th scope="col" className="py-2 font-semibold text-foreground">Taxa</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-muted-foreground">
                    Nenhum evento nesta aba ainda. Navegue pelo site e volte para consultar.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.path} className="border-b border-border">
                  <th scope="row" className="py-2 pr-4 font-medium text-foreground">{r.path}</th>
                  <td className="py-2 pr-4 text-muted-foreground">{r.views}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{r.whatsapp}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{r.cta}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{r.triage}</td>
                  <td className="py-2 text-muted-foreground">
                    {r.views > 0 ? `${(((r.whatsapp + r.cta) / r.views) * 100).toFixed(1)}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default PainelConversao;
