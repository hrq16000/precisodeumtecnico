import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { WA_SCRIPTS } from "@/data/waScripts";
import { Button } from "@/components/ui/button";
import { Copy, Check, ClipboardList, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrlFromText } from "@/lib/whatsapp";

const CANONICAL = "https://precisodeumtecnico.com/operacao/mensagens-prontas";

const MensagensProntas = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
      toast.success("Mensagem copiada");
      trackEvent("wa_script_copy", { script_id: id });
    } catch {
      toast.error("Não foi possível copiar. Selecione o texto manualmente.");
    }
  }

  return (
    <Layout>
      <SEOHead
        title="Mensagens prontas de atendimento (uso interno)"
        description="Biblioteca interna de mensagens padronizadas para pedir as informações mínimas antes de abrir a triagem técnica."
        canonical={CANONICAL}
        noindex
      />

      <section className="py-12 lg:py-16 bg-background">
        <div className="container-custom max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground mb-4">
            <ClipboardList className="w-4 h-4" aria-hidden="true" />
            Uso interno da central
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Mensagens prontas por serviço
          </h1>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Copie e cole no WhatsApp para pedir as informações mínimas antes de abrir a triagem.
            Os textos já incluem as condições oficiais de modalidade e prazo — não altere valores
            manualmente.
          </p>

          <div className="space-y-6">
            {WA_SCRIPTS.map((s) => (
              <article key={s.id} className="p-6 rounded-xl border border-border bg-card">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-xl font-semibold">{s.label}</h2>
                    <p className="text-sm text-muted-foreground">{s.intent}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      data-testid={`copy-${s.id}`}
                      onClick={() => copy(s.id, s.message)}
                      className="min-h-11"
                    >
                      {copiedId === s.id ? (
                        <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                      )}
                      {copiedId === s.id ? "Copiado" : "Copiar mensagem"}
                    </Button>
                    <Button
                      asChild
                      data-testid={`wa-${s.id}`}
                      className="min-h-11"
                    >
                      <a
                        href={buildWhatsAppUrlFromText(
                          `${s.message} [service=${s.id} · source=wa_script · utm_source=whatsapp_cta]`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackEvent("whatsapp_click", {
                            surface: "wa_script",
                            script_id: s.id,
                          })
                        }
                      >
                        <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                        Abrir no WhatsApp
                      </a>
                    </Button>
                  </div>

                </div>

                <ul className="flex flex-wrap gap-2 mb-4">
                  {s.asks.map((a) => (
                    <li
                      key={a}
                      className="px-3 py-1 rounded-full border border-border text-xs text-muted-foreground"
                    >
                      {a}
                    </li>
                  ))}
                </ul>

                <pre className="whitespace-pre-wrap text-sm bg-muted/40 rounded-lg p-4 border border-border font-sans">
                  {s.message}
                </pre>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MensagensProntas;
