import { LayoutFooter } from "./layout-footer";
import { LayoutHeader } from "./layout-header";
import { LayoutMain } from "./layout-main";
import { LayoutRoot } from "./layout-root";

// Compound Component pattern exports
export type { LayoutRootProps } from "./layout-root";
export type { LayoutHeaderProps } from "./layout-header";
export type { LayoutMainProps } from "./layout-main";
export type { LayoutFooterProps } from "./layout-footer";

/**
 * Layout compound component for building page layouts.
 *
 * @example
 * ```tsx
 * import { Layout } from "@/components/layout";
 *
 * <Layout.Root>
 *   <Layout.Header title="My Blog" navItems={navItems} githubUrl="..." />
 *   <Layout.Main>{children}</Layout.Main>
 *   <Layout.Footer>
 *     <p>Built with Next.js</p>
 *   </Layout.Footer>
 * </Layout.Root>
 * ```
 */
export const Layout = {
  Root: LayoutRoot,
  Header: LayoutHeader,
  Main: LayoutMain,
  Footer: LayoutFooter,
};

// Re-export NavItem type from header
export type { NavItem } from "./layout-header";

// Legacy exports for backward compatibility
/**
 * @deprecated Use `Layout.Root`, `Layout.Header`, `Layout.Main`, `Layout.Footer` instead.
 */
export { Layout as LegacyLayout } from "./layout";
export type { LayoutProps } from "./layout";
