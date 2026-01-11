import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("Home", () => {
	it("renders the Next.js logo", () => {
		render(<Home />);

		const logo = screen.getByAltText("Next.js logo");
		expect(logo).toBeInTheDocument();
	});

	it("renders the getting started instruction", () => {
		render(<Home />);

		expect(screen.getByText(/Get started by editing/i)).toBeInTheDocument();
		expect(screen.getByText("src/app/page.tsx")).toBeInTheDocument();
	});

	it("renders the docs link", () => {
		render(<Home />);

		const docsLink = screen.getByRole("link", { name: /Read our docs/i });
		expect(docsLink).toBeInTheDocument();
		expect(docsLink).toHaveAttribute(
			"href",
			expect.stringContaining("nextjs.org/docs")
		);
	});

	it("renders footer navigation links", () => {
		render(<Home />);

		const learnLink = screen.getByRole("link", { name: /Learn/i });
		expect(learnLink).toBeInTheDocument();
		expect(learnLink).toHaveAttribute(
			"href",
			expect.stringContaining("nextjs.org/learn")
		);

		const nextjsLink = screen.getByRole("link", { name: /Go to nextjs.org/i });
		expect(nextjsLink).toBeInTheDocument();
	});

	it("renders all images with proper alt text", () => {
		render(<Home />);

		expect(screen.getByAltText("Next.js logo")).toBeInTheDocument();
		expect(screen.getByAltText("File icon")).toBeInTheDocument();
		expect(screen.getByAltText("Globe icon")).toBeInTheDocument();
	});
});
