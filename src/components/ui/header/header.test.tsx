import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Header,
  HeaderLogo,
  HeaderNav,
  HeaderNavList,
  HeaderNavItem,
  HeaderGitHubLink,
} from "./header";

describe("Header", () => {
  describe("Header", () => {
    it("renders as header element", () => {
      render(
        <Header>
          <HeaderLogo>My Blog</HeaderLogo>
        </Header>
      );

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Header className="custom-class" data-testid="header">
          <HeaderLogo>My Blog</HeaderLogo>
        </Header>
      );

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("custom-class");
      expect(header).toHaveClass("w-full");
      expect(header).toHaveClass("border-b");
    });

    it("passes additional props to header element", () => {
      render(
        <Header data-testid="custom-header" aria-label="Site header">
          <HeaderLogo>My Blog</HeaderLogo>
        </Header>
      );

      const header = screen.getByTestId("custom-header");
      expect(header).toHaveAttribute("aria-label", "Site header");
    });
  });

  describe("HeaderLogo", () => {
    it("renders as link to home by default", () => {
      render(
        <Header>
          <HeaderLogo>My Blog</HeaderLogo>
        </Header>
      );

      const logo = screen.getByRole("link", { name: "My Blog" });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("href", "/");
    });

    it("renders with custom href", () => {
      render(
        <Header>
          <HeaderLogo href="/custom">My Blog</HeaderLogo>
        </Header>
      );

      const logo = screen.getByRole("link", { name: "My Blog" });
      expect(logo).toHaveAttribute("href", "/custom");
    });

    it("applies custom className", () => {
      render(
        <Header>
          <HeaderLogo className="custom-logo">My Blog</HeaderLogo>
        </Header>
      );

      const logo = screen.getByRole("link", { name: "My Blog" });
      expect(logo).toHaveClass("custom-logo");
    });
  });

  describe("HeaderNavItem", () => {
    it("renders navigation items with correct links", () => {
      render(
        <Header>
          <HeaderLogo>My Blog</HeaderLogo>
          <HeaderNav>
            <HeaderNavList>
              <HeaderNavItem href="/">Home</HeaderNavItem>
              <HeaderNavItem href="/blog">Blog</HeaderNavItem>
              <HeaderNavItem href="/about">About</HeaderNavItem>
            </HeaderNavList>
          </HeaderNav>
        </Header>
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
        <Header>
          <HeaderNav>
            <HeaderNavList>
              <HeaderNavItem href="/" className="custom-nav-item">
                Home
              </HeaderNavItem>
            </HeaderNavList>
          </HeaderNav>
        </Header>
      );

      const link = screen.getByRole("link", { name: "Home" });
      expect(link).toHaveClass("custom-nav-item");
    });
  });

  describe("HeaderGitHubLink", () => {
    it("renders GitHub link with correct attributes", () => {
      render(
        <Header>
          <HeaderNav>
            <HeaderGitHubLink url="https://github.com/example/repo" />
          </HeaderNav>
        </Header>
      );

      const githubLink = screen.getByRole("link", { name: "GitHub repository" });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/example/repo");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("applies custom className", () => {
      render(
        <Header>
          <HeaderNav>
            <HeaderGitHubLink url="https://github.com" className="custom-github" />
          </HeaderNav>
        </Header>
      );

      const githubLink = screen.getByRole("link", { name: "GitHub repository" });
      expect(githubLink).toHaveClass("custom-github");
    });
  });

  describe("Full Header composition", () => {
    it("renders complete header with all components", () => {
      render(
        <Header data-testid="header">
          <HeaderLogo>My Blog</HeaderLogo>
          <HeaderNav>
            <HeaderNavList>
              <HeaderNavItem href="/">Home</HeaderNavItem>
              <HeaderNavItem href="/blog">Blog</HeaderNavItem>
            </HeaderNavList>
            <HeaderGitHubLink url="https://github.com/example" />
          </HeaderNav>
        </Header>
      );

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "My Blog" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "GitHub repository" })).toBeInTheDocument();
    });
  });
});
