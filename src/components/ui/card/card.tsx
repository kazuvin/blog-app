import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type CardProps = ComponentProps<"div"> & {
  variant?: "default" | "outline";
};

export type CardHeaderProps = ComponentProps<"div">;
export type CardContentProps = ComponentProps<"div">;
export type CardFooterProps = ComponentProps<"div">;

// ============================================================================
// Constants
// ============================================================================

/** Shared padding for Card subcomponents */
const CARD_SECTION_PADDING = "px-6 py-4";

const variantStyles = {
  default: "bg-stone-50",
  outline: "bg-transparent",
} as const;

// ============================================================================
// Components
// ============================================================================

export function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-3xl px-2 py-5", variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn(CARD_SECTION_PADDING, className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn(CARD_SECTION_PADDING, className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn(CARD_SECTION_PADDING, className)} {...props}>
      {children}
    </div>
  );
}
