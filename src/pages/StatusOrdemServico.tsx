import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, CheckCircle2, Circle, Clock, AlertCircle, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import {
  OS_STAGES,
  stageIndex,
  normalizeProtocol,
  formatEta,
  type ServiceOrderStatus,
} from "@/lib/serviceOrder";
import { SITE_ORIGIN } from "@/lib/reviews";

const faq = [
  {
    question: "Onde encontro o número da minha Ordem de Serviço?",
    answer:
      "O número da OS (protocolo) é enviado no WhatsApp assim que o orçamento é gerado e também aparece impresso no checklist e na Ordem de Serviço entregue ao final do atendimento.",
  },
  {
    question: "A consulta mostra meus dados pessoais?",
    answer:
      "Não. A consulta pública exibe apenas etapa atual, prazo estimado, serviço, cidade/bairro e observação técnica. Nome, telefone e e-mail nunca são exibidos nesta página.",
  },
  {
    question: "Com que frequência o status é atualizado?",
    answer:
      "A cada mudança de etapa: agendamento, diagnóstico, envio do orçamento, execução, testes finais e conclusão. A data da última atualização aparece junto ao resultado da consulta.",
  },
  {
    question: "O prazo pode mudar depois do orçamento aprovado?",
    answer:
      "Pode, quando depende de peça de terceiros ou de aprovação de escopo adicional. Qualquer alteração de prazo é comunicada no WhatsApp e refletida aqui na consulta por protocolo.",
  },
];

export default function StatusOrdemServico() {
  const [params, setParams] = useSearchParams();
  const [protocol, setProtocol] = useState(params.get("os") ?? "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<ServiceOrderStatus | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function lookup(value: string) {
    const normalized = normalizeProtocol(value);
    if (normalized.length < 4) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    trackEvent("os_status_lookup", { protocol_length: normalized.length });
    const { data, error } = await supabase.rpc("get_service_order_status", {
      _protocol: normalized,
    });
    setLoading(false);
    const row = Array.isArray(data) ? (data[0] as ServiceOrderStatus | undefined) : undefined;
    if (error || !row) {
      setNotFound(true);
      return;
    }
    setOrder(row);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeProtocol(protocol);
    setParams(normalized ? { os: normalized } : {}, { replace: true });
    void lookup(normalized);
  }

  const current = order ? stageIndex(order.status) : -1;

  return (
    <Layout>
      <SEOHead
        title="Status da Ordem de Serviço | Consulta por número da OS"
        description="Consulte o andamento do seu atendimento técnico pelo número da Ordem de Serviço: etapa atual, prazo estimado e observações. Sem cadastro e sem exposição de dados pessoais."
        canonical={`${SITE_ORIGIN}/status-os`}
        breadcrumbs={[
          { name: "Início", url: `${SITE_ORIGIN}/` },
          { name: "Status da OS", url: `${SITE_ORIGIN}/status-os` },
        ]}
        faq={faq}
      />

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
            Acompanhamento
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Status da Ordem de Serviço
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Digite o número da OS que você recebeu no WhatsApp para ver a etapa atual, o prazo
            estimado e as observações do técnico. A consulta é pública, sem cadastro, e não exibe
            dados pessoais.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 mb-10">
            <label htmlFor="os-protocol" className="sr-only">
              Número da Ordem de Serviço
            </label>
            <Input
              id="os-protocol"
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              placeholder="Ex.: OS-2026-0001"
              autoComplete="off"
              className="h-12 text-base"
            />
            <Button type="submit" size="lg" className="h-12 min-w-[10rem]" disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Consultando..." : "Consultar OS"}
            </Button>
          </form>

          {notFound && (
            <div
              role="status"
              className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 mb-10"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">
                  Não encontramos nenhuma OS com esse número.
                </p>
                <p className="text-muted-foreground">
                  Confira o protocolo enviado no WhatsApp (formato OS-ANO-NÚMERO). Se o atendimento
                  foi solicitado há poucos minutos, o registro pode ainda não estar publicado.
                </p>
              </div>
            </div>
          )}

          {order && (
            <div className="rounded-xl border border-border bg-card p-6 mb-10">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h2 className="font-display text-xl font-bold text-foreground">
                  OS {order.protocol}
                </h2>
                <span className="text-xs text-muted-foreground">
                  Atualizado em {new Date(order.updated_at).toLocaleString("pt-BR")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {[order.service, order.equipment, [order.neighborhood, order.city].filter(Boolean).join(" - ")]
                  .filter(Boolean)
                  .join(" · ") || "Atendimento técnico"}
              </p>

              {order.eta_date && (
                <p className="flex items-center gap-2 text-sm font-medium text-foreground mb-6">
                  <Clock className="w-4 h-4 text-primary" />
                  Previsão de conclusão: {formatEta(order.eta_date)}
                </p>
              )}

              <ol className="space-y-4">
                {OS_STAGES.map((stage, i) => {
                  const done = i < current;
                  const active = i === current;
                  return (
                    <li key={stage.key} className="flex gap-3">
                      {done || active ? (
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 mt-0.5 ${active ? "text-primary" : "text-muted-foreground"}`}
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground/40" aria-hidden="true" />
                      )}
                      <div>
                        <p
                          className={`font-semibold ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {stage.label}
                          {active && <span className="ml-2 text-xs font-normal">(etapa atual)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                        <p className="text-xs text-muted-foreground/80 mt-0.5">{stage.slaText}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {order.public_note && (
                <p className="mt-6 rounded-lg bg-secondary/40 p-4 text-sm text-foreground">
                  <strong className="block mb-1">Observação do técnico</strong>
                  {order.public_note}
                </p>
              )}
            </div>
          )}

          <div className="rounded-xl border border-border p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Dúvidas sobre o acompanhamento
            </h2>
            <dl className="space-y-4">
              {faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-foreground">{item.question}</dt>
                  <dd className="text-sm text-muted-foreground mt-1">{item.answer}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-muted-foreground mt-6 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              Serviço concluído?{" "}
              <Link to="/como-avaliar" className="text-primary underline">
                Veja como avaliar o atendimento
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
