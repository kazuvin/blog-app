"use client";

import { type ComponentProps, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: "default" | "alert";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
};

export type DialogHeaderProps = ComponentProps<"div">;
export type DialogContentProps = ComponentProps<"div">;
export type DialogFooterProps = ComponentProps<"div">;
export type DialogTitleProps = ComponentProps<"h2">;
export type DialogDescriptionProps = ComponentProps<"p">;

export function Dialog({
  open,
  onOpenChange,
  variant = "default",
  size = "md",
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (variant === "alert") return; // Don't close on outside click for alert variant
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    // Prevent body scroll when dialog is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange, variant]);

  if (!open) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={cn(
          "bg-foreground/50 fixed inset-0 z-50 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          "bg-background fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg transition-all duration-200",
          "border",
          variantStyles[variant],
          sizeStyles[size],
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {children}
      </div>
    </>,
    document.body
  );
}

export function DialogHeader({ className, children, ...props }: DialogHeaderProps) {
  return (
    <div className={cn("border-foreground/10 border-b px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogFooter({ className, children, ...props }: DialogFooterProps) {
  return (
    <div
      className={cn("border-foreground/10 flex justify-end gap-2 border-t px-6 py-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogTitle({ className, children, ...props }: DialogTitleProps) {
  return (
    <h2 className={cn("text-foreground text-xl font-semibold", className)} {...props}>
      {children}
    </h2>
  );
}

export function DialogDescription({ className, children, ...props }: DialogDescriptionProps) {
  return (
    <p className={cn("text-foreground/60 mt-1.5 text-sm", className)} {...props}>
      {children}
    </p>
  );
}

const variantStyles = {
  default: "border-foreground/10",
  alert: "border-red-500",
} as const;

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
} as const;
