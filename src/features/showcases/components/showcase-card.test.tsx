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

  describe("初期表示", () => {
    it("カード名が表示されること", () => {
      render(<ShowcaseCard {...defaultProps} />);

      expect(screen.getByText("Test Card")).toBeInTheDocument();
    });

    it("カードの説明が表示されること", () => {
      render(<ShowcaseCard {...defaultProps} />);

      expect(screen.getByText("Test description for the card")).toBeInTheDocument();
    });

    it("プレビューコンテンツが表示されること", () => {
      render(<ShowcaseCard {...defaultProps} />);

      expect(screen.getByTestId("preview-content")).toBeInTheDocument();
      expect(screen.getByText("Preview Content")).toBeInTheDocument();
    });

    it("アクセシビリティのためにrole=buttonとして認識されること", () => {
      render(<ShowcaseCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("キーボードフォーカス可能であること", () => {
      render(<ShowcaseCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("ユーザー操作", () => {
    it("カードをクリックするとonClickが呼ばれること", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ShowcaseCard {...defaultProps} onClick={handleClick} />);

      await user.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("Enterキーを押すとonClickが呼ばれること", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ShowcaseCard {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("Spaceキーを押すとonClickが呼ばれること", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ShowcaseCard {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("さまざまなプレビューコンテンツ", () => {
    it("テキストのプレビューコンテンツが表示されること", () => {
      render(<ShowcaseCard {...defaultProps} preview="Text preview" />);

      expect(screen.getByText("Text preview")).toBeInTheDocument();
    });

    it("複雑なReact要素がプレビューとして表示されること", () => {
      const complexPreview = (
        <div>
          <span data-testid="nested-element">Nested</span>
          <button type="button">Inner Button</button>
        </div>
      );

      render(<ShowcaseCard {...defaultProps} preview={complexPreview} />);

      expect(screen.getByTestId("nested-element")).toBeInTheDocument();
    });

    it("nullのプレビューでもエラーなくレンダリングされること", () => {
      render(<ShowcaseCard {...defaultProps} preview={null} />);

      // カードは正常にレンダリングされる
      expect(screen.getByText("Test Card")).toBeInTheDocument();
    });
  });

  describe("スタイリング", () => {
    it("左揃えのためのtext-leftクラスを持つこと", () => {
      render(<ShowcaseCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-left");
    });

    it("クリック可能であることを示すcursor-pointerクラスを持つこと", () => {
      render(<ShowcaseCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("cursor-pointer");
    });
  });
});
