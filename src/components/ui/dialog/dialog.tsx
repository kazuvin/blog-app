"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ComponentProps, forwardRef } from "react";
import { cn } from "@/lib/utils";

// Root Dialog component
export const Dialog = DialogPrimitive.Root;

// Dialog Trigger
export const DialogTrigger = DialogPrimitive.Trigger;

// Dialog Portal
export const DialogPortal = DialogPrimitive.Portal;

// Dialog Close
export const DialogClose = DialogPrimitive.Close;

// Dialog Overlay Props
export type DialogOverlayProps = ComponentProps<typeof DialogPrimitive.Overlay>;

// Dialog Overlay
export const DialogOverlay = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "bg-foreground/50 fixed inset-0 z-50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Dialog Content Props
export type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  size?: "sm" | "md" | "lg" | "xl" | "full";
};

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
} as const;

// Dialog Content
export const DialogContent = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, size = "md", children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
        "border-foreground/10 bg-background rounded-lg border p-6 shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "focus:ring-foreground focus:ring-2 focus:ring-offset-2 focus:outline-none",
        "duration-200",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className={cn(
          "absolute top-4 right-4 rounded-sm opacity-70 transition-opacity",
          "focus:ring-foreground hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none",
          "disabled:pointer-events-none"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Dialog Header Props
export type DialogHeaderProps = ComponentProps<"div">;

// Dialog Header
export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  );
}

// Dialog Footer Props
export type DialogFooterProps = ComponentProps<"div">;

// Dialog Footer
export function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

// Dialog Title Props
export type DialogTitleProps = ComponentProps<typeof DialogPrimitive.Title>;

// Dialog Title
export const DialogTitle = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-foreground text-lg leading-none font-semibold tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Dialog Description Props
export type DialogDescriptionProps = ComponentProps<typeof DialogPrimitive.Description>;

// Dialog Description
export const DialogDescription = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-foreground/70 text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
