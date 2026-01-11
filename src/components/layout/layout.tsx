import { type ComponentProps, type ReactNode } from "react";
import { Header, type NavItem } from "@/components/ui/header";
import { cn } from "@/lib/utils";

export type LayoutProps = Omit<ComponentProps<"div">, "title"> & {
  /** Page content */
  children: ReactNode;
  /** Site title displayed in the header (default: "Blog") */
  title?: string;
  /** Whether to show the header (default: true) */
  showHeader?: boolean;
  /** Navigation items for the header */
  navItems?: NavItem[];
  /** GitHub repository URL for the header */
  githubUrl?: string;
  /** Whether to show the footer (default: true) */
  showFooter?: boolean;
  /** Optional footer content */
  footerContent?: ReactNode;
};

/**
 * Layout component that provides consistent page structure with Header,
 * main content area, and optional footer.
 */
export function Layout({
  children,
  title = "Blog",
  showHeader = true,
  navItems,
  githubUrl,
  showFooter = true,
  footerContent,
  className,
  ...props
}: LayoutProps) {
  return (
    <div className={cn("bg-background flex min-h-screen flex-col", className)} {...props}>
      {showHeader && <Header title={title} navItems={navItems} githubUrl={githubUrl} />}

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
      </main>

      {showFooter && (
        <footer className="border-foreground/10 border-t">
          <div className="mx-auto max-w-4xl px-4 py-6">
            {footerContent ?? (
              <p className="text-foreground/60 text-center text-sm">Built with Next.js</p>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
