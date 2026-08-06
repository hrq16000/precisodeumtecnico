import { CheckCircle, ShieldCheck, PackageCheck, ListChecks, XCircle, Download } from "lucide-react";
import { PC_ASSEMBLY_POLICY } from "@/data/pcAssemblyPolicy";
import { trackEvent } from "@/lib/analytics";

/**
 * Blocos públicos de montagem/PC Gamer derivados 100% de PC_ASSEMBLY_POLICY.
 * Nenhum texto novo pode ser escrito aqui: tudo vem da fonte única.
 */
export const PcAssemblyPolicySections = () => {
  const { scope, customerParts, warranty, finalChecklist } = PC_ASSEMBLY_POLICY;

  return (
    <div className="space-y-12">
      {/* Escopo confirmado */}
      <section aria-labelledby="escopo-montagem">
        <h2
          id="escopo-montagem"
          className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4"
        >
          O que fazemos na montagem (escopo confirmado)
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">{scope.summary}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {scope.included.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50"
            >
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-card-foreground text-sm">{item}</span>
            </div>
          ))}
        </div>

        <h3 className="font-bold text-foreground mt-8 mb-3">O que não fazemos</h3>
        <ul className="space-y-2">
          {scope.excluded.map((item) => (
            <li key={item} className="flex items-start gap-3 text-muted-foreground">
              <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Peças do cliente */}
      <section aria-labelledby="pecas-do-cliente">
        <h2
          id="pecas-do-cliente"
          className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2"
        >
          <PackageCheck className="w-7 h-7 text-accent" aria-hidden="true" />
          Política para peças fornecidas pelo cliente
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Aceitamos peças compradas pelo cliente. Para evitar dúvida na entrega, as regras
          abaixo valem para todo atendimento de montagem ou upgrade.
        </p>
        <div className="space-y-4">
          {customerParts.rules.map((rule) => (
            <article key={rule.title} className="p-5 rounded-xl bg-card border border-border/50">
              <h3 className="font-bold text-card-foreground mb-1">{rule.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{rule.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Garantia delimitada */}
      <section aria-labelledby="garantia-delimitada">
        <h2
          id="garantia-delimitada"
          className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2"
        >
          <ShieldCheck className="w-7 h-7 text-success" aria-hidden="true" />
          Garantia delimitada: montagem, configuração e peça
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[warranty.labor, warranty.configuration, warranty.parts].map((block) => (
            <article key={block.title} className="p-5 rounded-xl bg-card border border-border/50">
              <h3 className="font-bold text-card-foreground mb-2">{block.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{block.text}</p>
            </article>
          ))}
        </div>

        <h3 className="font-bold text-foreground mt-6 mb-3">Exclusões da garantia</h3>
        <ul className="space-y-2">
          {warranty.exclusions.map((item) => (
            <li key={item} className="flex items-start gap-3 text-muted-foreground">
              <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Checklist final */}
      <section aria-labelledby="checklist-final" id="pc-final-checklist">
        <h2
          id="checklist-final"
          className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2"
        >
          <ListChecks className="w-7 h-7 text-accent" aria-hidden="true" />
          Checklist executado antes da entrega
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          O checklist é o mesmo em todo atendimento e é registrado em laudo. Ele comprova que a
          máquina foi testada — não é promessa de desempenho em jogos.
        </p>
        <button
          type="button"
          data-print-checklist
          onClick={() => {
            trackEvent("pc_checklist_download", { page_path: window.location.pathname });
            document.body.setAttribute("data-print-target", "checklist");
            window.print();
            document.body.removeAttribute("data-print-target");
          }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border border-border font-semibold text-foreground hover:bg-muted print:hidden"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Baixar checklist em PDF
        </button>
        <div className="grid md:grid-cols-3 gap-4">
          {finalChecklist.map((group) => (
            <article key={group.group} className="p-5 rounded-xl bg-card border border-border/50">
              <h3 className="font-bold text-card-foreground mb-3">{group.group}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle
                      className="w-4 h-4 text-success flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
