import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, variant = "dark", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  const topTextColor = variant === "light" ? "text-white" : "text-foreground";
  const bottomTextColor = "text-[#FFD93D]"; // Yellow/gold like the original

  return (
    <Link to="/" className={cn("flex flex-col leading-tight", className)}>
      <span className={cn("font-medium", sizeClasses[size], topTextColor)}>
        preciso de um
      </span>
      <span className={cn("font-bold tracking-tight", bottomTextColor, {
        "text-xl": size === "sm",
        "text-2xl": size === "md", 
        "text-4xl": size === "lg",
      })}>
        TÉCNICO<span className="text-xs align-top">.com</span>
      </span>
    </Link>
  );
}
