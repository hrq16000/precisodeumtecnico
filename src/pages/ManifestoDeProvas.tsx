import { useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Download, Plus, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const CANONICAL = "https://precisodeumtecnico.com/operacao/manifesto-de-provas";

const STAGES = [
  "Recebimento do equipamento",
  "Diagnóstico na bancada",
  "Execução do reparo",
  "Teste final",
  "Entrega",
] as const;

interface ProofItem {
  id: string;
  file: string;
  stage: string;
  date: string;
  equipment: string;
  caption: string;
  consent: boolean;
}

const emptyItem = (): ProofItem => ({
  id: crypto.randomUUID(),
  file: "",
  stage: STAGES[0],
  date: new Date().toISOString().slice(0, 10),
  equipment: "",
  caption: "",
  consent: false,
});

function validate(i: ProofItem): string[] {
  const errs: string[] = [];
  if (!i.file.trim()) errs.push("arquivo");
  if (!i.equipment.trim()) errs.push("equipamento");
  if (!i.date) errs.push("data");
  if (i.caption.trim().length < 15) errs.push("legenda factual (mín. 15 caracteres)");
  if (/melhor|imbatível|garantido 100|o mais barato|nº 1|numero 1/i.test(i.caption))
    errs.push("legenda com claim comercial não comprovável");
  if (!i.consent) errs.push("autorização do cliente");
  return errs;
}

const ManifestoDeProvas = () => {
  const [items, setItems] = useState<ProofItem[]>([emptyItem()]);

  const report = useMemo(() => items.map((i) => ({ item: i, errs: validate(i) })), [items]);
  const validCount = report.filter((r) => r.errs.length === 0).length;

  const update = (id: string, patch: Partial<ProofItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const manifest = useMemo(
    () =>
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          total: items.length,
          approved: validCount,
          items: report
            .filter((r) => r.errs.length === 0)
            .map(({ item }) => ({
              file: item.file.trim(),
              stage: item.stage,
              date: item.date,
              equipment: item.equipment.trim(),
              caption: item.caption.trim(),
              consent: true,
            })),
        },
        null,
        2,
      ),
    [items, report, validCount],
  );

  function download() {
    const blob = new Blob([manifest], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `manifesto-provas-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("proof_manifest_export", { approved: validCount, total: items.length });
    toast.success("Manifesto exportado");
  }

  async function copyManifest() {
    try {
      await navigator.clipboard.writeText(manifest);
      toast.success("Manifesto copiado");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  return (
    <Layout>
      <SEOHead
        title="Manifesto de provas (uso interno)"
        description="Formulário interno para registrar e validar fotos e vídeos do atendimento antes da publicação."
        canonical={CANONICAL}
        noindex
      />

      <section className="py-12 lg:py-16 bg-background">
        <div className="container-custom max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground mb-4">
            <Camera className="w-4 h-4" aria-hidden="true" />
            Uso interno da operação
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Manifesto de provas (fotos e vídeos)</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Registre cada mídia com etapa, data, equipamento e legenda factual. Só entram no
            manifesto exportado os itens que passam na validação — nada é publicado sem
            autorização do cliente e sem descrição verificável.
          </p>

          <div className="space-y-6">
            {report.map(({ item, errs }, idx) => (
              <article key={item.id} className="p-6 rounded-xl border border-border bg-card space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Prova #{idx + 1}</h2>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-11"
                      onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                    >
                      <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                      Remover
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`file-${item.id}`}>Arquivo (nome ou caminho)</Label>
                    <Input
                      id={`file-${item.id}`}
                      value={item.file}
                      placeholder="bancada-notebook-01.jpg"
                      onChange={(e) => update(item.id, { file: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`stage-${item.id}`}>Etapa</Label>
                    <select
                      id={`stage-${item.id}`}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={item.stage}
                      onChange={(e) => update(item.id, { stage: e.target.value })}
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor={`date-${item.id}`}>Data</Label>
                    <Input
                      id={`date-${item.id}`}
                      type="date"
                      value={item.date}
                      onChange={(e) => update(item.id, { date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`eq-${item.id}`}>Equipamento</Label>
                    <Input
                      id={`eq-${item.id}`}
                      value={item.equipment}
                      placeholder="Notebook Dell Inspiron 15"
                      onChange={(e) => update(item.id, { equipment: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`cap-${item.id}`}>Legenda factual</Label>
                  <Textarea
                    id={`cap-${item.id}`}
                    rows={3}
                    value={item.caption}
                    placeholder="Troca de pasta térmica e limpeza do sistema de refrigeração após teste de temperatura."
                    onChange={(e) => update(item.id, { caption: e.target.value })}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.consent}
                    onChange={(e) => update(item.id, { consent: e.target.checked })}
                  />
                  Cliente autorizou o uso público desta mídia
                </label>

                {errs.length > 0 ? (
                  <p className="text-sm text-destructive" role="status">
                    Pendências: {errs.join(", ")}.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground" role="status">
                    Aprovado para publicação.
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <Button type="button" variant="outline" className="min-h-11" onClick={() => setItems((p) => [...p, emptyItem()])}>
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Adicionar prova
            </Button>
            <Button type="button" className="min-h-11" disabled={validCount === 0} onClick={download}>
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              Exportar manifesto ({validCount})
            </Button>
            <Button type="button" variant="outline" className="min-h-11" disabled={validCount === 0} onClick={copyManifest}>
              <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
              Copiar JSON
            </Button>
          </div>

          <pre className="mt-8 whitespace-pre-wrap text-xs bg-muted/40 rounded-lg p-4 border border-border overflow-x-auto">
            {manifest}
          </pre>
        </div>
      </section>
    </Layout>
  );
};

export default ManifestoDeProvas;
