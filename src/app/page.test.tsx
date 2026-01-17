import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the about me heading", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("About Me");
  });

  it("renders the introduction section", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /Introduction/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to my blog/i)).toBeInTheDocument();
  });

  it("renders the skills section with badges", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /Skills & Interests/i })).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders the contact section", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /Get in Touch/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Email/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /GitHub/i })).toBeDisabled();
  });

  it("renders the recent posts section", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /Recent Posts/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all/i })).toHaveAttribute("href", "/blog");
  });
});
