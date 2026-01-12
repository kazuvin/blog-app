import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = ComponentProps<"div"> & {
  /** Maximum width variant */
  size?: "sm" | "md" | "lg" | "xl" | "full";
};

/**
 * Container component for consistent max-width and horizontal padding.
 * Similar to Tailwind's .container class but as a reusable component.
 */
export function Container({ size = "lg", className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4",
        {
          "max-w-2xl": size === "sm",
          "max-w-3xl": size === "md",
          "max-w-4xl": size === "lg",
          "max-w-6xl": size === "xl",
          "max-w-none": size === "full",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
