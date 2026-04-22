import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = ComponentProps<"span"> & {
  variant?: "default" | "success" | "warning" | "error" | "info" | "accent";
  size?: "sm" | "md";
};

export function Badge({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

const variantStyles = {
  default: "bg-surface-pressed text-foreground",
  success: "bg-success-soft text-success-soft-fg",
  warning: "bg-warning-soft text-warning-soft-fg",
  error: "bg-error-soft text-error-soft-fg",
  info: "bg-info-soft text-info-soft-fg",
  accent: "bg-gradient-to-r from-accent-soft to-brand-accent-soft text-accent-soft-fg",
} as const;

const sizeStyles = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
} as const;
