import { Calculator, AlertTriangle, ShieldQuestion, ListChecks } from "lucide-react";
import { EQUIPMENT_VALUATION } from "@/data/equipmentValuation";

/**
 * Bloco público de declaração de valor do equipamento.
 * Todo o texto deriva de EQUIPMENT_VALUATION (fonte única).
 */
export const EquipmentValuationTerms = ({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) => {
  const Heading = headingLevel;
  const { intro, categories, howToMeasure, acknowledgement, notices } = EQUIPMENT_VALUATION;

  return (
    <section aria-labelledby="declaracao-valor-equipamento" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Calculator className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <Heading
          id="declaracao-valor-equipamento"
          className="text-2xl md:text-3xl font-bold text-foreground"
        >
          Declaração de valor do equipamento
        </Heading>
      </div>

      <p className="text-muted-foreground leading-relaxed">{intro}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {categories.map((c) => (
          <article key={c.label} className="p-5 rounded-xl bg-card border border-border/50">
            <h3 className="font-bold text-card-foreground mb-1">{c.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.examples}</p>
          </article>
        ))}
      </div>

      <div>
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" aria-hidden="true" />
          Como mensurar o valor
        </h3>
        <ul className="space-y-2">
          {howToMeasure.map((item) => (
            <li key={item} className="flex items-start gap-2 text-muted-foreground">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 md:p-6">
        <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <ShieldQuestion className="h-5 w-5 text-primary" aria-hidden="true" />
          Termo de ciência
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">{acknowledgement}</p>
      </div>

      <div className="space-y-2">
        {notices.map((n) => (
          <p key={n} className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
            <span>{n}</span>
          </p>
        ))}
      </div>
    </section>
  );
};
