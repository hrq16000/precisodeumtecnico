/**
 * Rodada 3P — CTA de triagem reutilizável para uso no meio de páginas longas.
 * Não cria destino novo: dispara o mesmo fluxo de triagem já usado pelos CTAs
 * existentes, com o contexto (source/categoria/sintoma) da própria página.
 */
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  label: string;
  description?: string;
  source: string;
  category?: string;
  symptom?: string;
  className?: string;
}

export function InlineTriageCTA({
  label,
  description,
  source,
  category,
  symptom,
  className = "",
}: Props) {
  return (
    <div
      data-inline-triage-cta
      className={`rounded-xl border border-border bg-muted/40 p-5 ${className}`}
    >
      {description && <p className="mb-3 text-sm text-muted-foreground">{description}</p>}
      <Button
        size="lg"
        className="min-h-11 max-w-full whitespace-normal text-left leading-snug"
        data-triage-cta
        data-triage-source={source}
        data-triage-category={category}
        data-triage-symptom={symptom}
      >
        {label}
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
