import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the welcome heading", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome to My Blog");
  });

  it("renders the hero section with description", () => {
    render(<Home />);

    expect(screen.getByText(/Thoughts, stories, and ideas/i)).toBeInTheDocument();
  });

  it("renders the blog navigation links", () => {
    render(<Home />);

    const exploreLink = screen.getByRole("link", { name: /Explore Articles/i });
    expect(exploreLink).toBeInTheDocument();
    expect(exploreLink).toHaveAttribute("href", "/blog");

    const aboutLink = screen.getByRole("link", { name: /About Me/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("renders the recent posts section", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /Recent Posts/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all/i })).toHaveAttribute("href", "/blog");
  });

  it("renders the stay updated section", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /Stay Updated/i })).toBeInTheDocument();
    expect(screen.getByText(/Subscribe to get notified/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Coming Soon/i })).toBeDisabled();
  });
});
