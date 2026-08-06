/**
 * Rodada 3Q — caixa editorial reutilizável das páginas comerciais.
 * Reorganiza visualmente pontos de decisão já presentes na copy aprovada.
 * Não introduz preço, prazo, garantia ou promessa de resultado.
 */
import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";

export type CalloutTone = "neutral" | "attention";

interface Props {
  title: string;
  items: readonly string[];
  icon?: LucideIcon;
  tone?: CalloutTone;
  className?: string;
}

export function EditorialCallout({
  title,
  items,
  icon: Icon = Info,
  tone = "neutral",
  className = "",
}: Props) {
  const toneClass =
    tone === "attention"
      ? "border-destructive/30 bg-destructive/5"
      : "border-border bg-muted/40";

  return (
    <aside className={`rounded-xl border p-5 ${toneClass} ${className}`}>
      <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
        <Icon className="h-4 w-4 text-primary shrink-0" aria-hidden />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
