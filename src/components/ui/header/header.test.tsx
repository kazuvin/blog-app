import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Header } from "./header";

describe("Header", () => {
  describe("Header.Root", () => {
    it("renders as header element", () => {
      render(
        <Header.Root>
          <Header.Logo>My Blog</Header.Logo>
        </Header.Root>
      );

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Header.Root className="custom-class" data-testid="header">
          <Header.Logo>My Blog</Header.Logo>
        </Header.Root>
      );

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("custom-class");
      expect(header).toHaveClass("w-full");
      expect(header).toHaveClass("border-b");
    });

    it("passes additional props to header element", () => {
      render(
        <Header.Root data-testid="custom-header" aria-label="Site header">
          <Header.Logo>My Blog</Header.Logo>
        </Header.Root>
      );

      const header = screen.getByTestId("custom-header");
      expect(header).toHaveAttribute("aria-label", "Site header");
    });
  });

  describe("Header.Logo", () => {
    it("renders as link to home by default", () => {
      render(
        <Header.Root>
          <Header.Logo>My Blog</Header.Logo>
        </Header.Root>
      );

      const logo = screen.getByRole("link", { name: "My Blog" });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("href", "/");
    });

    it("renders with custom href", () => {
      render(
        <Header.Root>
          <Header.Logo href="/custom">My Blog</Header.Logo>
        </Header.Root>
      );

      const logo = screen.getByRole("link", { name: "My Blog" });
      expect(logo).toHaveAttribute("href", "/custom");
    });

    it("applies custom className", () => {
      render(
        <Header.Root>
          <Header.Logo className="custom-logo">My Blog</Header.Logo>
        </Header.Root>
      );

      const logo = screen.getByRole("link", { name: "My Blog" });
      expect(logo).toHaveClass("custom-logo");
    });
  });

  describe("Header.NavItem", () => {
    it("renders navigation items with correct links", () => {
      render(
        <Header.Root>
          <Header.Logo>My Blog</Header.Logo>
          <Header.Nav>
            <Header.NavList>
              <Header.NavItem href="/">Home</Header.NavItem>
              <Header.NavItem href="/blog">Blog</Header.NavItem>
              <Header.NavItem href="/about">About</Header.NavItem>
            </Header.NavList>
          </Header.Nav>
        </Header.Root>
      );

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

    it("applies custom className to nav item", () => {
      render(
        <Header.Root>
          <Header.Nav>
            <Header.NavList>
              <Header.NavItem href="/" className="custom-nav-item">
                Home
              </Header.NavItem>
            </Header.NavList>
          </Header.Nav>
        </Header.Root>
      );

      const link = screen.getByRole("link", { name: "Home" });
      expect(link).toHaveClass("custom-nav-item");
    });
  });

  describe("Header.GitHubLink", () => {
    it("renders GitHub link with correct attributes", () => {
      render(
        <Header.Root>
          <Header.Nav>
            <Header.GitHubLink url="https://github.com/example/repo" />
          </Header.Nav>
        </Header.Root>
      );

      const githubLink = screen.getByRole("link", { name: "GitHub repository" });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/example/repo");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("applies custom className", () => {
      render(
        <Header.Root>
          <Header.Nav>
            <Header.GitHubLink url="https://github.com" className="custom-github" />
          </Header.Nav>
        </Header.Root>
      );

      const githubLink = screen.getByRole("link", { name: "GitHub repository" });
      expect(githubLink).toHaveClass("custom-github");
    });
  });

  describe("Full Header composition", () => {
    it("renders complete header with all components", () => {
      render(
        <Header.Root data-testid="header">
          <Header.Logo>My Blog</Header.Logo>
          <Header.Nav>
            <Header.NavList>
              <Header.NavItem href="/">Home</Header.NavItem>
              <Header.NavItem href="/blog">Blog</Header.NavItem>
            </Header.NavList>
            <Header.GitHubLink url="https://github.com/example" />
          </Header.Nav>
        </Header.Root>
      );

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "My Blog" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "GitHub repository" })).toBeInTheDocument();
    });
  });
});
