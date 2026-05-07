import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.webp";
import logoFallback from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  /** light = for use on dark backgrounds, dark = for use on light backgrounds */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  /** When true, smoothly scales between md and lg without remounting (used by sticky header). */
  compact?: boolean;
  priority?: boolean;
}

export function Logo({
  className,
  variant = "dark",
  size = "md",
  compact,
  priority = false,
}: LogoProps) {
  // Heights are picked carefully so the footer/header keep similar
  // responsive rhythm. We always render the LARGEST height for a given
  // size and apply a transform-scale when `compact` is requested. This
  // produces a smooth, non-janky transition driven by GPU-accelerated
  // transforms instead of swapping Tailwind height classes (which would
  // jump because Tailwind classes can't tween between named sizes).
  const sizeClasses = {
    sm: "h-9 sm:h-10 md:h-11",
    md: "h-12 sm:h-14 md:h-16 lg:h-20",
    lg: "h-16 sm:h-20 md:h-24 lg:h-28",
  };

  const bgClasses =
    variant === "light"
      ? "bg-white shadow-xl shadow-black/40 ring-1 ring-white/20"
      : "bg-white shadow-md shadow-black/15 ring-1 ring-black/5";

  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center rounded-xl px-2 py-1.5 sm:px-3 sm:py-2",
        "origin-left transition-transform duration-500 ease-out will-change-transform",
        "hover:scale-[1.03]",
        compact && "scale-[0.78] sm:scale-[0.82] md:scale-[0.85]",
        bgClasses,
        className,
      )}
      aria-label="Preciso de um Técnico - Início"
    >
      <picture>
        <source srcSet={logoImg} type="image/webp" />
        <img
          src={logoFallback}
          alt="Preciso de um Técnico"
          className={cn("w-auto object-contain transition-[height] duration-500 ease-out", sizeClasses[size])}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
    </Link>
  );
}
