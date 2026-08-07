import { useState } from "react";
import { ImageIcon } from "lucide-react";
import type { PublicPhoto } from "@/data/publicPhotos";

interface Props {
  photo: PublicPhoto;
  /** Carrega sem lazy (usar só acima da dobra). */
  eager?: boolean;
  sizes?: string;
  className?: string;
}

const srcset = (photo: PublicPhoto, ext: string) =>
  photo.variants.map((w) => `/photos/${photo.slug}-${w}.${ext} ${w}w`).join(", ");

/**
 * Foto real (Wikimedia Commons) com AVIF → WebP → JPG, srcset responsivo,
 * lazy-loading e proporção fixa (evita CLS).
 *
 * Fallback automático: se a origem falhar (arquivo removido, CDN bloqueada),
 * o componente troca para o placeholder local e mantém o bloco visível — a
 * página nunca fica sem mídia nem quebra o layout.
 */
export function PublicPhotoFigure({ photo, eager = false, sizes, className }: Props) {
  const [failed, setFailed] = useState(false);
  const largest = photo.variants[photo.variants.length - 1] ?? 800;
  const ratio = `${photo.width} / ${photo.height}`;

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground ${className ?? ""}`}
        style={{ aspectRatio: ratio }}
        role="img"
        aria-label={photo.alt}
        data-photo-fallback="true"
      >
        <ImageIcon className="w-8 h-8 opacity-60" aria-hidden="true" />
        <span className="px-4 text-center text-xs">{photo.caption}</span>
      </div>
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={srcset(photo, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(photo, "webp")} sizes={sizes} />
      <img
        src={`/photos/${photo.slug}-${largest}.jpg`}
        srcSet={srcset(photo, "jpg")}
        sizes={sizes}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        onError={() => setFailed(true)}
        className={className}
      />
    </picture>
  );
}
