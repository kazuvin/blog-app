import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the page heading", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("About Me");
  });

  it("renders the introduction section", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: /Introduction/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to my blog/i)).toBeInTheDocument();
  });

  it("renders the skills section with badges", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: /Skills & Interests/i })).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders the contact section", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: /Get in Touch/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Email/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /GitHub/i })).toBeDisabled();
  });
});
