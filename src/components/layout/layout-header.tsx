import { forwardRef, type ComponentProps } from "react";
import { Header, type NavItem } from "@/components/ui/header";

export type LayoutHeaderProps = Omit<ComponentProps<typeof Header>, "ref">;

/**
 * Layout.Header - Header component wrapper for the layout.
 * Wraps the existing Header component and passes through all props.
 *
 * @example
 * ```tsx
 * <Layout.Header
 *   title="My Blog"
 *   navItems={[{ label: "Home", href: "/" }]}
 *   githubUrl="https://github.com/example/repo"
 * />
 * ```
 */
export const LayoutHeader = forwardRef<HTMLElement, LayoutHeaderProps>(
  ({ title, navItems, githubUrl, ...props }, ref) => {
    return <Header ref={ref} title={title} navItems={navItems} githubUrl={githubUrl} {...props} />;
  }
);

LayoutHeader.displayName = "Layout.Header";

export type { NavItem };
