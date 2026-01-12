import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type LayoutFooterProps = ComponentProps<"footer">;

/**
 * Layout.Footer - Footer component for the layout.
 * Provides a bordered footer area with centered content.
 *
 * @example
 * ```tsx
 * <Layout.Footer>
 *   <p>Built with Next.js</p>
 * </Layout.Footer>
 * ```
 *
 * @example
 * ```tsx
 * // With default content (no children)
 * <Layout.Footer />
 * ```
 */
export const LayoutFooter = forwardRef<HTMLElement, LayoutFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <footer ref={ref} className={cn("border-foreground/10 border-t", className)} {...props}>
        <div className="mx-auto max-w-4xl px-4 py-6">
          {children ?? <p className="text-foreground/60 text-center text-sm">Built with Next.js</p>}
        </div>
      </footer>
    );
  }
);

LayoutFooter.displayName = "Layout.Footer";
