import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type InputProps = ComponentProps<"input"> & {
  variant?: "default" | "error";
  inputSize?: "sm" | "md" | "lg";
};

export function Input({
  variant = "default",
  inputSize = "md",
  className,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-md border bg-transparent transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[inputSize],
        className
      )}
      {...props}
    />
  );
}

const variantStyles = {
  default:
    "border-foreground/20 text-foreground placeholder:text-foreground/50 focus:border-foreground focus:ring-foreground",
  error:
    "border-red-500 text-foreground placeholder:text-foreground/50 focus:border-red-500 focus:ring-red-500",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-4 py-3 text-lg",
} as const;
