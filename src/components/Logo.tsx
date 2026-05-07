import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.webp";
import logoFallback from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  /** light = for use on dark backgrounds, dark = for use on light backgrounds */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  /** When true, smoothly shrinks the logo (used by sticky header). */
  compact?: boolean;
  priority?: boolean;
}

// Per-breakpoint heights in pixels so the height transition can actually
// tween smoothly (Tailwind named sizes can't be interpolated by CSS).
const HEIGHTS: Record<NonNullable<LogoProps["size"]>, { base: number; sm: number; md: number; lg: number }> = {
  sm: { base: 32, sm: 36, md: 40, lg: 40 },
  md: { base: 40, sm: 48, md: 56, lg: 64 },
  lg: { base: 52, sm: 64, md: 80, lg: 96 },
};

export function Logo({
  className,
  variant = "dark",
  size = "md",
  compact,
  priority = false,
}: LogoProps) {
  const target = compact ? HEIGHTS.md : HEIGHTS[size];

  const bgClasses =
    variant === "light"
      ? "bg-white shadow-xl shadow-black/40 ring-1 ring-white/20"
      : "bg-white shadow-md shadow-black/15 ring-1 ring-black/5";

  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center rounded-xl px-2 py-1.5 sm:px-3 sm:py-2",
        "transition-[transform,box-shadow] duration-500 ease-out will-change-transform",
        "hover:scale-[1.03]",
        bgClasses,
        className,
      )}
      style={{
        // CSS vars consumed by the inner img element
        ["--logo-h-base" as string]: `${target.base}px`,
        ["--logo-h-sm" as string]: `${target.sm}px`,
        ["--logo-h-md" as string]: `${target.md}px`,
        ["--logo-h-lg" as string]: `${target.lg}px`,
      }}
      aria-label="Preciso de um Técnico - Início"
    >
      <picture>
        <source srcSet={logoImg} type="image/webp" />
        <img
          src={logoFallback}
          alt="Preciso de um Técnico"
          className={cn(
            "w-auto object-contain transition-[height] duration-500 ease-out",
            "h-[var(--logo-h-base)] sm:h-[var(--logo-h-sm)] md:h-[var(--logo-h-md)] lg:h-[var(--logo-h-lg)]",
          )}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
    </Link>
  );
}
