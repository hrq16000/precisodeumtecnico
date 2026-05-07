import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, variant = "dark", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-12 md:h-14",
    md: "h-16 md:h-20 lg:h-24",
    lg: "h-20 md:h-24 lg:h-28",
  };

  const bgClasses =
    variant === "light"
      ? "bg-white/10 backdrop-blur-sm shadow-lg shadow-black/30"
      : "bg-white shadow-lg shadow-black/20";

  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center rounded-xl px-3 py-2 transition-transform hover:scale-105",
        bgClasses,
        className,
      )}
      aria-label="Preciso de um Técnico - Início"
    >
      <img
        src={logoImg}
        alt="Preciso de um Técnico"
        className={cn("w-auto object-contain", sizeClasses[size])}
        loading="eager"
      />
    </Link>
  );
}
