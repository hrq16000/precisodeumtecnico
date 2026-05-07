import { ReactNode, ElementType, CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Animation kind. Defaults to fade-up. */
  variant?: "fade-up" | "fade" | "scale";
}

/**
 * Wrap any section or card to animate it on first scroll into view.
 * Uses IntersectionObserver and respects prefers-reduced-motion.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  variant = "fade-up",
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();

  const initial =
    variant === "scale"
      ? "opacity-0 scale-[0.96]"
      : variant === "fade"
        ? "opacity-0"
        : "opacity-0 translate-y-6";

  const shown = "opacity-100 translate-y-0 scale-100";

  const style: CSSProperties = delay ? { transitionDelay: `${delay}ms` } : {};

  return (
    <Tag
      ref={ref as never}
      style={style}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none",
        visible ? shown : initial,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
