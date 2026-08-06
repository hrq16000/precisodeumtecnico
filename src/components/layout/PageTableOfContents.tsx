/**
 * Rodada 3P — sumário navegável para páginas longas.
 *
 * Recebe os headings reais da página (id + rótulo). No mobile fica recolhido
 * num <details>; no desktop é uma lista simples. Sem sticky invasivo e sem
 * dependência nova.
 */
import { ListTree } from "lucide-react";

export interface TocItem {
  id: string;
  label: string;
}

interface Props {
  items: TocItem[];
  title?: string;
  className?: string;
}

export function PageTableOfContents({ items, title = "Nesta página", className = "" }: Props) {
  if (items.length < 2) return null;

  const list = (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="inline-flex min-h-11 items-center text-sm text-primary hover:underline focus-visible:underline"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav aria-label={title} className={`rounded-xl border border-border bg-card p-4 ${className}`}>
      <details className="md:hidden" open={false}>
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-card-foreground">
          <ListTree className="h-4 w-4 text-primary" aria-hidden="true" />
          {title}
        </summary>
        {list}
      </details>
      <div className="hidden md:block">
        <p className="flex items-center gap-2 font-semibold text-card-foreground">
          <ListTree className="h-4 w-4 text-primary" aria-hidden="true" />
          {title}
        </p>
        {list}
      </div>
    </nav>
  );
}
