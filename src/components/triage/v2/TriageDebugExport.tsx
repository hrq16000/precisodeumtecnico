import { useState } from "react";
import { Button } from "@/components/ui/button";
import { readBufferedTriageEvents } from "@/lib/triageEventBuffer";

/**
 * Exportador de eventos de triagem — SOMENTE dev/teste.
 *
 * Em produção o componente retorna `null` antes de qualquer render, e o
 * bundler elimina o corpo por `import.meta.env.DEV`. Nenhum PII é lido:
 * o buffer só guarda campos categóricos (evento, step, surface, path).
 */
export function TriageDebugExport() {
  const enabled =
    import.meta.env.DEV ||
    (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("triageDebug") === "1");
  const [copied, setCopied] = useState(false);
  if (!enabled) return null;

  const snapshot = () => JSON.stringify({ exportedAt: new Date().toISOString(), events: readBufferedTriageEvents() }, null, 2);

  return (
    <div
      data-testid="triage-debug-export"
      className="flex items-center justify-between gap-2 border-t border-dashed border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground"
    >
      <span>Modo diagnóstico (não aparece em produção)</span>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="triage-debug-copy"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(snapshot());
              setCopied(true);
            } catch {
              /* noop */
            }
          }}
        >
          {copied ? "Copiado!" : "Copiar eventos (JSON)"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="triage-debug-download"
          onClick={() => {
            const blob = new Blob([snapshot()], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `triage-events-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Baixar JSON
        </Button>
      </div>
    </div>
  );
}
