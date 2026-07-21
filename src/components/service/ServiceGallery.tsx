import { ImageIcon } from "lucide-react";

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

interface Props {
  title: string;
  intro?: string;
  items: GalleryItem[];
}

/**
 * Galeria de imagens ilustrativas para páginas de serviço.
 * Convenções:
 *  - WebP servido de /public/gallery.
 *  - Todas as imagens carregam com loading="lazy" e decoding="async".
 *  - Legenda sempre marca "Imagem ilustrativa." — nenhum ativo aqui é foto real
 *    de atendimento, respeitando a política da Rodada 23 (nada fabricado como real).
 */
export function ServiceGallery({ title, intro, items }: Props) {
  if (items.length === 0) return null;
  return (
    <section className="py-16 md:py-20 border-t border-border" aria-labelledby="galeria-heading">
      <div className="container-custom max-w-5xl">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <ImageIcon className="w-4 h-4" /> Exemplos ilustrativos
        </div>
        <h2 id="galeria-heading" className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
        {intro ? <p className="mt-3 text-muted-foreground max-w-2xl">{intro}</p> : null}
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6" data-testid="service-gallery">
          {items.map((item) => (
            <li key={item.src} className="rounded-lg overflow-hidden border border-border bg-card">
              <figure>
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto aspect-video object-cover bg-muted"
                />
                <figcaption className="p-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{item.caption}</span>
                  <span className="block mt-1 text-xs uppercase tracking-wide text-muted-foreground/80">
                    Imagem ilustrativa.
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
