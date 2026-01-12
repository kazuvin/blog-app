import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type LayoutRootProps = ComponentProps<"div">;

/**
 * Layout.Root - Container component for the page layout.
 * Provides flex column layout with minimum full screen height.
 *
 * @example
 * ```tsx
 * <Layout.Root>
 *   <Layout.Header title="My Blog" />
 *   <Layout.Main>{children}</Layout.Main>
 *   <Layout.Footer />
 * </Layout.Root>
 * ```
 */
export const LayoutRoot = forwardRef<HTMLDivElement, LayoutRootProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-background flex min-h-screen flex-col", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LayoutRoot.displayName = "Layout.Root";
