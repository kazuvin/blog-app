import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type InputProps = Omit<ComponentProps<"input">, "size"> & {
  variant?: "default" | "error";
  size?: "sm" | "md" | "lg";
};

export function Input({ variant = "default", size = "md", className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}

const variantStyles = {
  default:
    "bg-surface-hover rounded-2xl placeholder:text-foreground/50 outline-transparent focus:outline-primary/30 outline-2",
  error:
    "border-error text-foreground placeholder:text-foreground/50 focus:border-error focus:ring-error",
} as const;

const sizeStyles = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-5 py-4 text-lg",
} as const;
