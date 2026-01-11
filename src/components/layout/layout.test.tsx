import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Layout } from "./layout";

describe("Layout", () => {
  describe("children rendering", () => {
    it("renders children content", () => {
      render(
        <Layout>
          <div data-testid="child-content">Child content</div>
        </Layout>
      );

      expect(screen.getByTestId("child-content")).toBeInTheDocument();
      expect(screen.getByText("Child content")).toBeInTheDocument();
    });
  });

  describe("header", () => {
    it("renders header with title by default", () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      // Header should be rendered with default title "Blog"
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
    });

    it("renders header with custom title", () => {
      render(
        <Layout title="My Custom Blog">
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByText("My Custom Blog")).toBeInTheDocument();
    });

    it("hides header when showHeader is false", () => {
      render(
        <Layout showHeader={false}>
          <div>Content</div>
        </Layout>
      );

      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });

    it("passes navItems to Header", () => {
      const navItems = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
      ];

      render(
        <Layout navItems={navItems}>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
    });

    it("passes githubUrl to Header", () => {
      render(
        <Layout githubUrl="https://github.com/example/repo">
          <div>Content</div>
        </Layout>
      );

      const githubLink = screen.getByRole("link", { name: /github repository/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/example/repo");
    });
  });

  describe("footer", () => {
    it("renders footer by default with default content", () => {
      render(
        <Layout>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(screen.getByText("Built with Next.js")).toBeInTheDocument();
    });

    it("hides footer when showFooter is false", () => {
      render(
        <Layout showFooter={false}>
          <div>Content</div>
        </Layout>
      );

      expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
    });

    it("renders custom footer content", () => {
      render(
        <Layout footerContent={<span data-testid="custom-footer">Custom Footer Text</span>}>
          <div>Content</div>
        </Layout>
      );

      expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
      expect(screen.getByText("Custom Footer Text")).toBeInTheDocument();
      // Default content should not be rendered
      expect(screen.queryByText("Built with Next.js")).not.toBeInTheDocument();
    });
  });

  describe("main content area", () => {
    it("renders children in main element", () => {
      render(
        <Layout>
          <div data-testid="main-content">Main content here</div>
        </Layout>
      );

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
      expect(main).toContainElement(screen.getByTestId("main-content"));
    });
  });

  describe("custom className", () => {
    it("applies custom className to container", () => {
      render(
        <Layout className="custom-layout-class" data-testid="layout-container">
          <div>Content</div>
        </Layout>
      );

      const container = screen.getByTestId("layout-container");
      expect(container).toHaveClass("custom-layout-class");
    });
  });
});
