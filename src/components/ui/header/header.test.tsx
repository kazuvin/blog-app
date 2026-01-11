import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "./header";

describe("Header", () => {
  describe("Title rendering", () => {
    it("renders title correctly as a link to home", () => {
      render(<Header title="My Blog" />);

      const titleLink = screen.getByRole("link", { name: "My Blog" });
      expect(titleLink).toBeInTheDocument();
      expect(titleLink).toHaveAttribute("href", "/");
    });
  });

  describe("Navigation items", () => {
    it("renders navigation items with correct links", () => {
      const navItems = [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "About", href: "/about" },
      ];

      render(<Header title="My Blog" navItems={navItems} />);

      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute("href", "/");

      const blogLink = screen.getByRole("link", { name: "Blog" });
      expect(blogLink).toBeInTheDocument();
      expect(blogLink).toHaveAttribute("href", "/blog");

      const aboutLink = screen.getByRole("link", { name: "About" });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("renders empty navigation when navItems is not provided", () => {
      render(<Header title="My Blog" />);

      // Only the title link should be present (no nav item links)
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent("My Blog");
    });

    it("renders empty navigation when navItems is empty array", () => {
      render(<Header title="My Blog" navItems={[]} />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent("My Blog");
    });
  });

  describe("GitHub link", () => {
    it("renders GitHub link when githubUrl is provided", () => {
      render(<Header title="My Blog" githubUrl="https://github.com/example/repo" />);

      const githubLink = screen.getByRole("link", { name: "GitHub repository" });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/example/repo");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("does not render GitHub link when githubUrl is not provided", () => {
      render(<Header title="My Blog" />);

      const githubLink = screen.queryByRole("link", { name: "GitHub repository" });
      expect(githubLink).not.toBeInTheDocument();
    });
  });

  describe("Custom className", () => {
    it("applies custom className to header element", () => {
      render(<Header title="My Blog" className="custom-header-class" data-testid="header" />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("custom-header-class");
    });

    it("merges custom className with default classes", () => {
      render(<Header title="My Blog" className="custom-class" data-testid="header" />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("custom-class");
      expect(header).toHaveClass("w-full");
      expect(header).toHaveClass("border-b");
    });
  });

  describe("HTML attributes", () => {
    it("renders as header element", () => {
      render(<Header title="My Blog" />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("passes additional props to header element", () => {
      render(<Header title="My Blog" data-testid="custom-header" aria-label="Site header" />);

      const header = screen.getByTestId("custom-header");
      expect(header).toHaveAttribute("aria-label", "Site header");
    });
  });
});
