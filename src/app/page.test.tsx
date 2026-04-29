import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the introduction heading", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1, name: /kazuvin/i })).toBeInTheDocument();
  });

  it("renders the introduction section", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /kazuvin/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to my blog/i)).toBeInTheDocument();
  });
});
