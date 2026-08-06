/**
 * Links internos contextuais entre serviços correlatos.
 *
 * Objetivo: reduzir canibalização entre montagem/PC Gamer, manutenção de
 * computador e upgrade de SSD/RAM, direcionando cada intenção de busca ao
 * destino canônico correto. Só emite rotas que existem no App.
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface RelatedLink {
  to: string;
  label: string;
  description: string;
}

/** Mapa por slug de origem → destinos canônicos com intenção distinta. */
const RELATED_BY_SLUG: Record<string, RelatedLink[]> = {
  "pc-gamer": [
    {
      to: "/upgrade-ssd-curitiba",
      label: "Upgrade de SSD em Curitiba",
      description:
        "Quando a máquina já está montada e o objetivo é trocar ou acrescentar armazenamento.",
    },
    {
      to: "/upgrade-memoria-ram-curitiba",
      label: "Upgrade de memória RAM em Curitiba",
      description:
        "Ampliação de memória em desktop já em uso, com conferência de compatibilidade antes da compra.",
    },
    {
      to: "/formatacao-de-computador-curitiba",
      label: "Formatação e reinstalação do sistema",
      description:
        "Reinstalação limpa do sistema e drivers oficiais sem mexer no hardware do gabinete.",
    },
    {
      to: "/servicos/configuracao-wifi-curitiba",
      label: "Configuração de rede e Wi-Fi",
      description:
        "Deixar o desktop montado estável na rede, incluindo impressora e periféricos em rede.",
    },
  ],
  "formatacao-computadores": [
    {
      to: "/formatacao-de-computador-curitiba",
      label: "Formatação de computador em Curitiba",
      description: "Página local com escopo, prazos e o que é preservado no backup.",
    },
    {
      to: "/remocao-de-virus-curitiba",
      label: "Remoção de vírus em Curitiba",
      description: "Quando o objetivo é limpar a máquina sem reinstalar o sistema.",
    },
    {
      to: "/servicos/pc-gamer",
      label: "Montagem e configuração de desktop",
      description: "Montagem do zero, peças do cliente, garantia delimitada e checklist de testes.",
    },
  ],
};

interface Props {
  slug: string;
  title?: string;
}

export function RelatedServiceLinks({ slug, title = "Serviços relacionados" }: Props) {
  const links = RELATED_BY_SLUG[slug];
  if (!links?.length) return null;

  return (
    <nav aria-label={title} className="mb-12">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="group flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-primary/50"
          >
            <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
            <span>
              <span className="block font-semibold text-card-foreground">{l.label}</span>
              <span className="block text-sm text-muted-foreground">{l.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
