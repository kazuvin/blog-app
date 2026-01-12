import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Layout, LegacyLayout } from "./index";

describe("Layout (Compound Component)", () => {
  describe("Layout.Root", () => {
    it("renders children content", () => {
      render(
        <Layout.Root>
          <div data-testid="child-content">Child content</div>
        </Layout.Root>
      );

      expect(screen.getByTestId("child-content")).toBeInTheDocument();
      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Layout.Root className="custom-root-class" data-testid="layout-root">
          <div>Content</div>
        </Layout.Root>
      );

      const container = screen.getByTestId("layout-root");
      expect(container).toHaveClass("custom-root-class");
      expect(container).toHaveClass("min-h-screen");
      expect(container).toHaveClass("flex");
      expect(container).toHaveClass("flex-col");
    });

    it("forwards ref to div element", () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Layout.Root ref={ref}>
          <div>Content</div>
        </Layout.Root>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Layout.Header", () => {
    it("renders header with title", () => {
      render(
        <Layout.Root>
          <Layout.Header title="My Blog" />
        </Layout.Root>
      );

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByText("My Blog")).toBeInTheDocument();
    });

    it("renders navItems", () => {
      const navItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
      ];

      render(
        <Layout.Root>
          <Layout.Header title="Blog" navItems={navItems} />
        </Layout.Root>
      );

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
    });

    it("renders GitHub link when githubUrl is provided", () => {
      render(
        <Layout.Root>
          <Layout.Header title="Blog" githubUrl="https://github.com/example/repo" />
        </Layout.Root>
      );

      const githubLink = screen.getByRole("link", { name: /github repository/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/example/repo");
    });

    it("forwards ref to header element", () => {
      const ref = createRef<HTMLElement>();
      render(
        <Layout.Root>
          <Layout.Header ref={ref} title="Blog" />
        </Layout.Root>
      );

      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe("HEADER");
    });
  });

  describe("Layout.Main", () => {
    it("renders children in main element", () => {
      render(
        <Layout.Root>
          <Layout.Main>
            <div data-testid="main-content">Main content here</div>
          </Layout.Main>
        </Layout.Root>
      );

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
      expect(main).toContainElement(screen.getByTestId("main-content"));
    });

    it("applies custom className", () => {
      render(
        <Layout.Root>
          <Layout.Main className="custom-main-class" data-testid="layout-main">
            <div>Content</div>
          </Layout.Main>
        </Layout.Root>
      );

      const main = screen.getByTestId("layout-main");
      expect(main).toHaveClass("custom-main-class");
      expect(main).toHaveClass("flex-1");
    });

    it("forwards ref to main element", () => {
      const ref = createRef<HTMLElement>();
      render(
        <Layout.Root>
          <Layout.Main ref={ref}>
            <div>Content</div>
          </Layout.Main>
        </Layout.Root>
      );

      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe("MAIN");
    });
  });

  describe("Layout.Footer", () => {
    it("renders footer with default content when no children", () => {
      render(
        <Layout.Root>
          <Layout.Footer />
        </Layout.Root>
      );

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(screen.getByText("Built with Next.js")).toBeInTheDocument();
    });

    it("renders footer with custom content", () => {
      render(
        <Layout.Root>
          <Layout.Footer>
            <span data-testid="custom-footer">Custom Footer Text</span>
          </Layout.Footer>
        </Layout.Root>
      );

      expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
      expect(screen.getByText("Custom Footer Text")).toBeInTheDocument();
      expect(screen.queryByText("Built with Next.js")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Layout.Root>
          <Layout.Footer className="custom-footer-class" data-testid="layout-footer">
            <div>Footer</div>
          </Layout.Footer>
        </Layout.Root>
      );

      const footer = screen.getByTestId("layout-footer");
      expect(footer).toHaveClass("custom-footer-class");
      expect(footer).toHaveClass("border-t");
    });

    it("forwards ref to footer element", () => {
      const ref = createRef<HTMLElement>();
      render(
        <Layout.Root>
          <Layout.Footer ref={ref}>
            <div>Footer</div>
          </Layout.Footer>
        </Layout.Root>
      );

      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe("FOOTER");
    });
  });

  describe("Full Layout composition", () => {
    it("renders complete layout with all components", () => {
      const navItems = [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
      ];

      render(
        <Layout.Root data-testid="layout-root">
          <Layout.Header title="My Blog" navItems={navItems} githubUrl="https://github.com/test" />
          <Layout.Main>
            <h1>Welcome</h1>
            <p>Main content</p>
          </Layout.Main>
          <Layout.Footer>
            <p>Copyright 2025</p>
          </Layout.Footer>
        </Layout.Root>
      );

      // Root
      expect(screen.getByTestId("layout-root")).toBeInTheDocument();

      // Header
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByText("My Blog")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();

      // Main
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByText("Welcome")).toBeInTheDocument();
      expect(screen.getByText("Main content")).toBeInTheDocument();

      // Footer
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(screen.getByText("Copyright 2025")).toBeInTheDocument();
    });

    it("allows selective component usage", () => {
      render(
        <Layout.Root>
          <Layout.Main>
            <p>Just main content, no header or footer</p>
          </Layout.Main>
        </Layout.Root>
      );

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByText("Just main content, no header or footer")).toBeInTheDocument();
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
      expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    });
  });
});

describe("LegacyLayout (backward compatibility)", () => {
  describe("children rendering", () => {
    it("renders children content", () => {
      render(
        <LegacyLayout>
          <div data-testid="child-content">Child content</div>
        </LegacyLayout>
      );

      expect(screen.getByTestId("child-content")).toBeInTheDocument();
      expect(screen.getByText("Child content")).toBeInTheDocument();
    });
  });

  describe("header", () => {
    it("renders header with title by default", () => {
      render(
        <LegacyLayout>
          <div>Content</div>
        </LegacyLayout>
      );

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
    });

    it("renders header with custom title", () => {
      render(
        <LegacyLayout title="My Custom Blog">
          <div>Content</div>
        </LegacyLayout>
      );

      expect(screen.getByText("My Custom Blog")).toBeInTheDocument();
    });

    it("hides header when showHeader is false", () => {
      render(
        <LegacyLayout showHeader={false}>
          <div>Content</div>
        </LegacyLayout>
      );

      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });

    it("passes navItems to Header", () => {
      const navItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
      ];

      render(
        <LegacyLayout navItems={navItems}>
          <div>Content</div>
        </LegacyLayout>
      );

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
    });

    it("passes githubUrl to Header", () => {
      render(
        <LegacyLayout githubUrl="https://github.com/example/repo">
          <div>Content</div>
        </LegacyLayout>
      );

      const githubLink = screen.getByRole("link", { name: /github repository/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/example/repo");
    });
  });

  describe("footer", () => {
    it("renders footer by default with default content", () => {
      render(
        <LegacyLayout>
          <div>Content</div>
        </LegacyLayout>
      );

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(screen.getByText("Built with Next.js")).toBeInTheDocument();
    });

    it("hides footer when showFooter is false", () => {
      render(
        <LegacyLayout showFooter={false}>
          <div>Content</div>
        </LegacyLayout>
      );

      expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    });

    it("renders custom footer content", () => {
      render(
        <LegacyLayout footerContent={<span data-testid="custom-footer">Custom Footer Text</span>}>
          <div>Content</div>
        </LegacyLayout>
      );

      expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
      expect(screen.getByText("Custom Footer Text")).toBeInTheDocument();
      expect(screen.queryByText("Built with Next.js")).not.toBeInTheDocument();
    });
  });

  describe("main content area", () => {
    it("renders children in main element", () => {
      render(
        <LegacyLayout>
          <div data-testid="main-content">Main content here</div>
        </LegacyLayout>
      );

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
      expect(main).toContainElement(screen.getByTestId("main-content"));
    });
  });

  describe("custom className", () => {
    it("applies custom className to container", () => {
      render(
        <LegacyLayout className="custom-layout-class" data-testid="layout-container">
          <div>Content</div>
        </LegacyLayout>
      );

      const container = screen.getByTestId("layout-container");
      expect(container).toHaveClass("custom-layout-class");
    });
  });
});
