import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.webp";
import logoFallback from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  /** light = for use on dark backgrounds, dark = for use on light backgrounds */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

export function Logo({
  className,
  variant = "dark",
  size = "md",
  priority = false,
}: LogoProps) {
  const sizeClasses = {
    sm: "h-9 sm:h-10",
    md: "h-11 sm:h-14 md:h-16 lg:h-20",
    lg: "h-16 sm:h-20 md:h-24 lg:h-28",
  };

  // Logo artwork uses dark navy ink, so we always need a light surface behind it.
  // The two variants only differ in the shadow/elevation tone.
  const bgClasses =
    variant === "light"
      ? "bg-white shadow-xl shadow-black/40 ring-1 ring-white/20"
      : "bg-white shadow-md shadow-black/15 ring-1 ring-black/5";

  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 transition-transform hover:scale-[1.03]",
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
          className={cn("w-auto object-contain", sizeClasses[size])}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
    </Link>
  );
}
