import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const variantStyles = {
  primary: "bg-foreground text-background hover:opacity-90 focus:ring-foreground",
  secondary:
    "bg-transparent text-foreground border border-foreground/20 hover:bg-foreground/5 focus:ring-foreground",
  ghost: "bg-transparent text-foreground hover:bg-foreground/10 focus:ring-foreground",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
} as const;
