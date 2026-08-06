import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { AlertCircle, ArrowLeft, ArrowRight, Download, MessageCircle } from "lucide-react";
import { buildWhatsAppUrlFromText, readStoredLocation, currentSourcePage } from "@/lib/whatsapp";
import { trackWhatsAppClick, trackEvent } from "@/lib/analytics";


/**
 * Mini-wizard de orçamento de montagem/upgrade de PC.
 * Coleta modelo, peças (fornecidas ou não) e uso pretendido, exige aceite
 * explícito dos termos e envia a mensagem pronta para o WhatsApp.
 * Nenhum claim comercial novo: os textos de política vivem nas páginas linkadas.
 */

const USAGE_OPTIONS = [
  "Jogos",
  "Trabalho / escritório",
  "Edição de vídeo ou imagem",
  "Estudos / uso doméstico",
  "Servidor ou uso profissional específico",
] as const;

const stepOneSchema = z.object({
  model: z.string().trim().min(3, "Descreva o modelo ou a configuração (mínimo 3 caracteres).").max(200),
  usage: z.enum(USAGE_OPTIONS, { errorMap: () => ({ message: "Selecione o uso pretendido." }) }),
});

const stepTwoSchema = z.object({
  partsBy: z.enum(["cliente", "indicacao", "indefinido"]),
  parts: z.string().trim().max(600, "Máximo de 600 caracteres.").optional(),
  city: z.string().trim().max(80).optional(),
  neighborhood: z.string().trim().max(80).optional(),
});

type Errors = Partial<Record<string, string>>;

const PARTS_LABEL: Record<string, string> = {
  cliente: "Cliente fornece as peças",
  indicacao: "Preciso de indicação de peças (compra por minha conta)",
  indefinido: "Ainda não defini as peças",
};

export const PcQuoteWizard = ({ sourcePage }: { sourcePage?: string }) => {
  const stored = useMemo(() => readStoredLocation(), []);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [model, setModel] = useState("");
  const [usage, setUsage] = useState<string>("");
  const [partsBy, setPartsBy] = useState<"cliente" | "indicacao" | "indefinido">("cliente");
  const [parts, setParts] = useState("");
  const [city, setCity] = useState(stored.city ?? "");
  const [neighborhood, setNeighborhood] = useState(stored.neighborhood ?? "");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrices, setAcceptPrices] = useState(false);
  const [acceptParts, setAcceptParts] = useState(false);
  const [acceptLgpd, setAcceptLgpd] = useState(false);
  const [showAcceptErrors, setShowAcceptErrors] = useState(false);
  const [orderProtocol, setOrderProtocol] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  const page = sourcePage ?? currentSourcePage();

  // Leva o foco para o primeiro campo inválido, tornando óbvio o que falta.
  function focusFirst(fields: string[], errs: Errors) {
    const id = fields.find((f) => errs[f]);
    if (!id) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(`pcq-${id}`) as HTMLElement | null;
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  useEffect(() => {
    if (Object.keys(errors).length > 0) errorRef.current?.focus();
  }, [errors]);

  function next() {
    if (step === 0) {
      const parsed = stepOneSchema.safeParse({ model, usage });
      if (!parsed.success) {
        const f = parsed.error.flatten().fieldErrors;
        const next = { model: f.model?.[0], usage: f.usage?.[0] };
        setErrors(next);
        focusFirst(["model", "usage"], next);
        return;
      }
    }
    if (step === 1) {
      const parsed = stepTwoSchema.safeParse({ partsBy, parts, city, neighborhood });
      if (!parsed.success) {
        const f = parsed.error.flatten().fieldErrors;
        const next = { parts: f.parts?.[0] };
        setErrors(next);
        focusFirst(["parts"], next);
        return;
      }
    }
    setErrors({});
    trackEvent("pc_quote_step_next", { step: step + 1, page_path: page });
    setStep((s) => Math.min(s + 1, 2));
  }

  const canSubmit =
    acceptTerms && acceptPrices && acceptLgpd && (partsBy !== "cliente" || acceptParts);

  function buildProtocol(): string {
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
      d.getDate(),
    ).padStart(2, "0")}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `OS-${stamp}-${rand}`;
  }

  function buildMessage(protocol: string): string {
    const lines = [
      "Olá! Fiz o orçamento de montagem de PC pelo site.",
      "",
      `Ordem de serviço (pré-abertura): ${protocol}`,
      "Serviço: Montagem/configuração de desktop ou PC Gamer",
      `Modelo/configuração: ${model.trim()}`,
      `Uso pretendido: ${usage}`,
      `Peças: ${PARTS_LABEL[partsBy]}`,
    ];
    if (parts.trim()) lines.push(`Lista de peças: ${parts.trim()}`);
    if (city.trim()) lines.push(`Cidade: ${city.trim()}`);
    if (neighborhood.trim()) lines.push(`Bairro: ${neighborhood.trim()}`);
    lines.push(
      "",
      "Li e aceito os termos e condições, a política de preços e a política de peças do cliente.",
      "",
      "Origem: source=pc_quote_wizard",
      "service=montagem-de-pc",
      "utm_source=whatsapp_cta",
      `page=${page}`,
    );
    return lines.join("\n");
  }

  function submit() {
    if (!canSubmit) {
      setShowAcceptErrors(true);
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>("[data-accept-invalid='true']");
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }
    setShowAcceptErrors(false);
    const protocol = orderProtocol ?? buildProtocol();
    setOrderProtocol(protocol);
    const url = buildWhatsAppUrlFromText(buildMessage(protocol));
    trackWhatsAppClick({
      source: "pc_quote_wizard",
      service: "montagem-de-pc",
      city: city.trim() || undefined,
      bairro: neighborhood.trim() || undefined,
      source_component: "PcQuoteWizard",
      cta_label: "Enviar orçamento no WhatsApp",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function printServiceOrder() {
    trackEvent("pc_service_order_download", { page_path: page });
    document.body.setAttribute("data-print-target", "service-order");
    window.print();
    document.body.removeAttribute("data-print-target");
  }

  const inputBase =
    "w-full rounded-lg border bg-background px-3 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const inputClass = (invalid?: string) =>
    `${inputBase} ${invalid ? "field-invalid" : "border-border"}`;
  // Aceites obrigatórios ganham destaque pulsante quando o envio é tentado sem marcar.
  const acceptClass = (checked: boolean) =>
    !checked && showAcceptErrors
      ? "field-invalid rounded-lg border p-3 -m-[1px]"
      : "border border-transparent p-3";

  return (
    <section
      aria-labelledby="pc-quote-wizard"
      className="p-4 sm:p-6 rounded-2xl border border-border bg-card"
    >

      <h2 id="pc-quote-wizard" className="font-display text-2xl font-bold text-card-foreground mb-1">
        Orçamento de montagem em 3 passos
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Responda o essencial e enviamos a mensagem pronta para o WhatsApp — sem repetir informação.
      </p>

      <ol className="flex gap-2 mb-6" aria-label="Progresso do orçamento">
        {["Equipamento", "Peças e local", "Aceite"].map((label, i) => (
          <li
            key={label}
            aria-current={i === step ? "step" : undefined}
            className={`flex-1 text-center text-xs font-semibold py-2 rounded-lg border ${
              i === step
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="pcq-model" className="block text-sm font-semibold text-card-foreground mb-1">
              Modelo ou configuração pretendida <span className="text-destructive">*</span>
            </label>
            <input
              id="pcq-model"
              className={inputClass(errors.model)}
              value={model}
              maxLength={200}
              aria-invalid={!!errors.model}
              aria-describedby={errors.model ? "pcq-model-err" : undefined}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Ex.: Ryzen 5 + B550 + 16GB + RTX 3060"
            />
            {errors.model && (
              <p id="pcq-model-err" className="flex items-center gap-1 text-sm text-destructive mt-1">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {errors.model}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="pcq-usage" className="block text-sm font-semibold text-card-foreground mb-1">
              Uso pretendido <span className="text-destructive">*</span>
            </label>
            <select
              id="pcq-usage"
              className={inputClass(errors.usage)}
              value={usage}
              aria-invalid={!!errors.usage}
              aria-describedby={errors.usage ? "pcq-usage-err" : undefined}
              onChange={(e) => setUsage(e.target.value)}
            >
              <option value="">Selecione…</option>
              {USAGE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {errors.usage && (
              <p id="pcq-usage-err" className="flex items-center gap-1 text-sm text-destructive mt-1">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {errors.usage}
              </p>
            )}
          </div>
        </div>
      )}


      {step === 1 && (
        <div className="space-y-4">
          <fieldset>
            <legend className="text-sm font-semibold text-card-foreground mb-2">
              Quem fornece as peças?
            </legend>
            <div className="space-y-2">
              {(Object.keys(PARTS_LABEL) as Array<keyof typeof PARTS_LABEL>).map((key) => (
                <label key={key} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <input
                    type="radio"
                    name="pcq-parts-by"
                    value={key}
                    checked={partsBy === key}
                    onChange={() => setPartsBy(key as typeof partsBy)}
                    className="mt-1"
                  />
                  <span>{PARTS_LABEL[key]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="pcq-parts" className="block text-sm font-semibold text-card-foreground mb-1">
              Peças já definidas (opcional)
            </label>
            <textarea
              id="pcq-parts"
              className={inputClass}
              rows={3}
              maxLength={600}
              value={parts}
              onChange={(e) => setParts(e.target.value)}
              placeholder="Placa-mãe, processador, memória, fonte, gabinete…"
            />
            {errors.parts && <p className="text-sm text-destructive mt-1">{errors.parts}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pcq-city" className="block text-sm font-semibold text-card-foreground mb-1">
                Cidade
              </label>
              <input
                id="pcq-city"
                className={inputClass}
                value={city}
                maxLength={80}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="pcq-bairro" className="block text-sm font-semibold text-card-foreground mb-1">
                Bairro
              </label>
              <input
                id="pcq-bairro"
                className={inputClass}
                value={neighborhood}
                maxLength={80}
                onChange={(e) => setNeighborhood(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>
              Li e aceito os{" "}
              <Link to="/termos-orcamento-pre-aprovado" className="text-primary hover:underline">
                termos e condições do orçamento
              </Link>
              , incluindo a declaração de valor do equipamento.
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1"
              checked={acceptPrices}
              onChange={(e) => setAcceptPrices(e.target.checked)}
            />
            <span>
              Li a{" "}
              <Link to="/precos" className="text-primary hover:underline">
                política de preços e modalidades
              </Link>{" "}
              e entendo que o valor final depende de avaliação técnica.
            </span>
          </label>
          {partsBy === "cliente" && (
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="mt-1"
                checked={acceptParts}
                onChange={(e) => setAcceptParts(e.target.checked)}
              />
              <span>
                Li a{" "}
                <Link to="/politica-de-pecas-do-cliente" className="text-primary hover:underline">
                  política de peças do cliente
                </Link>{" "}
                (compatibilidade, procedência, prazos de troca e garantia da peça vs. mão de obra).
              </span>
            </label>
          )}
          {!canSubmit && (
            <p className="text-sm text-muted-foreground">
              Marque todos os aceites para liberar o envio.
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Voltar
        </button>

        {step < 2 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
          >
            Continuar
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            data-wa-source="pc_quote_wizard"
            data-service="montagem-de-pc"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-success text-success-foreground font-semibold disabled:opacity-40"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            Enviar orçamento no WhatsApp
          </button>
        )}
      </div>

      {orderProtocol && (
        <div
          id="pc-service-order"
          data-service-order
          className="mt-8 pt-6 border-t border-border"
        >
          <h3 className="font-display text-xl font-bold text-card-foreground mb-1">
            Ordem de serviço {orderProtocol}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Pré-abertura gerada pelo site em {new Date().toLocaleString("pt-BR")}. Serve como
            comprovante da solicitação; o escopo, o valor e o prazo válidos são os do orçamento
            confirmado por escrito no atendimento.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {[
              ["Serviço", "Montagem/configuração de desktop ou PC Gamer"],
              ["Modelo/configuração", model.trim()],
              ["Uso pretendido", usage],
              ["Peças", PARTS_LABEL[partsBy]],
              ["Lista de peças", parts.trim() || "—"],
              ["Cidade", city.trim() || "—"],
              ["Bairro", neighborhood.trim() || "—"],
              [
                "Aceites",
                "Termos e condições, política de preços" +
                  (partsBy === "cliente" ? " e política de peças do cliente" : ""),
              ],
            ].map(([label, value]) => (
              <article key={label} className="p-3 rounded-lg bg-muted/40 border border-border/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="text-sm text-card-foreground break-words">{value}</p>
              </article>
            ))}
          </div>
          <button
            type="button"
            data-print-service-order
            onClick={printServiceOrder}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border font-semibold text-foreground hover:bg-muted print:hidden"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Baixar ordem de serviço em PDF
          </button>
        </div>
      )}
    </section>
  );
};
