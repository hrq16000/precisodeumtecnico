import { forwardRef, ImgHTMLAttributes } from "react";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** URL fallback (jpg/png). */
  src: string;
  /** Se true, não usa lazy (para LCP/hero). */
  eager?: boolean;
  /** srcset opcional (mesmo formato do fallback). */
  srcSet?: string;
  sizes?: string;
}

/**
 * <picture> com AVIF/WebP quando o path bate com um asset otimizado.
 * Convenção: se existirem `foo.avif` / `foo.webp` ao lado de `foo.jpg`,
 * eles são servidos automaticamente. Fallback = src original.
 */
export const SmartImage = forwardRef<HTMLImageElement, SmartImageProps>(
  ({ src, srcSet, sizes, eager, alt = "", width, height, className, ...rest }, ref) => {
    const base = src.replace(/\.(jpe?g|png|webp|avif)(\?.*)?$/i, "");
    const ext = src.match(/\.(jpe?g|png|webp|avif)(\?.*)?$/i)?.[1]?.toLowerCase();
    const isOptimizable = ext && ["jpg", "jpeg", "png"].includes(ext);

    return (
      <picture>
        {isOptimizable && <source type="image/avif" srcSet={`${base}.avif`} />}
        {isOptimizable && <source type="image/webp" srcSet={`${base}.webp`} />}
        <img
          ref={ref}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          className={className}
          {...rest}
        />
      </picture>
    );
  },
);
SmartImage.displayName = "SmartImage";
