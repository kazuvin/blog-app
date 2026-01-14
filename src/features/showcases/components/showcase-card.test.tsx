import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ShowcaseCard } from "./showcase-card";

describe("ShowcaseCard", () => {
  const defaultProps = {
    name: "Test Card",
    description: "Test description for the card",
    preview: <div data-testid="preview-content">Preview Content</div>,
    onClick: vi.fn(),
  };

  describe("初期表示 (Initial Rendering)", () => {
    it("should render the card name", () => {
      render(<ShowcaseCard {...defaultProps} />);

      expect(screen.getByText("Test Card")).toBeInTheDocument();
    });

    it("should render the card description", () => {
      render(<ShowcaseCard {...defaultProps} />);

      expect(screen.getByText("Test description for the card")).toBeInTheDocument();
    });

    it("should render the preview content", () => {
      render(<ShowcaseCard {...defaultProps} />);

      expect(screen.getByTestId("preview-content")).toBeInTheDocument();
      expect(screen.getByText("Preview Content")).toBeInTheDocument();
    });

    it("should render as a button element for accessibility", () => {
      render(<ShowcaseCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should have type='button' attribute", () => {
      render(<ShowcaseCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("ユーザー操作 (User Interactions)", () => {
    it("should call onClick when the card is clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ShowcaseCard {...defaultProps} onClick={handleClick} />);

      await user.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick when Enter key is pressed", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ShowcaseCard {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClick when Space key is pressed", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ShowcaseCard {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("さまざまなプレビューコンテンツ (Various Preview Content)", () => {
    it("should render text preview content", () => {
      render(<ShowcaseCard {...defaultProps} preview="Text preview" />);

      expect(screen.getByText("Text preview")).toBeInTheDocument();
    });

    it("should render complex React element as preview", () => {
      const complexPreview = (
        <div>
          <span data-testid="nested-element">Nested</span>
          <button type="button">Inner Button</button>
        </div>
      );

      render(<ShowcaseCard {...defaultProps} preview={complexPreview} />);

      expect(screen.getByTestId("nested-element")).toBeInTheDocument();
    });

    it("should render null preview without error", () => {
      render(<ShowcaseCard {...defaultProps} preview={null} />);

      // カードは正常にレンダリングされる
      expect(screen.getByText("Test Card")).toBeInTheDocument();
    });
  });

  describe("スタイリング (Styling)", () => {
    it("should have text-left class for left alignment", () => {
      render(<ShowcaseCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-left");
    });
  });
});
