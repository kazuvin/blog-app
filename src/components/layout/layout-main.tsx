import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type LayoutMainProps = ComponentProps<"main">;

/**
 * Layout.Main - Main content area component.
 * Provides flex-grow behavior and centered content with max-width constraint.
 *
 * @example
 * ```tsx
 * <Layout.Main>
 *   <h1>Page Title</h1>
 *   <p>Page content goes here...</p>
 * </Layout.Main>
 * ```
 */
export const LayoutMain = forwardRef<HTMLElement, LayoutMainProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <main ref={ref} className={cn("flex-1", className)} {...props}>
        <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
      </main>
    );
  }
);

LayoutMain.displayName = "Layout.Main";
