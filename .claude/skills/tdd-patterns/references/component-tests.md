# Component Test Patterns

## Test File Location

```
src/components/ui/{name}/
├── {name}.tsx
├── {name}.test.tsx    ← Specification
├── {name}.stories.tsx
└── index.ts
```

## Specification Template

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ComponentName } from "./component-name";

/**
 * ComponentName Specification
 *
 * Purpose: [Brief description of what this component does]
 * Usage: [Primary use cases]
 */
describe("ComponentName", () => {
  // ===========================================
  // 初期状態 (Initial State / Rendering)
  // ===========================================
  describe("初期状態 (Initial State)", () => {
    it("should render without crashing", () => {
      render(<ComponentName />);
      expect(screen.getByRole("...")).toBeInTheDocument();
    });

    it("should apply default variant styles", () => {
      render(<ComponentName data-testid="component" />);
      expect(screen.getByTestId("component")).toHaveClass("expected-class");
    });

    it("should render children correctly", () => {
      render(<ComponentName>Test Content</ComponentName>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
  });

  // ===========================================
  // Props (API Specification)
  // ===========================================
  describe("Props", () => {
    describe("variant prop", () => {
      it("should apply 'primary' variant styles", () => {
        render(<ComponentName variant="primary" data-testid="component" />);
        expect(screen.getByTestId("component")).toHaveClass("bg-primary");
      });

      it("should apply 'secondary' variant styles", () => {
        render(<ComponentName variant="secondary" data-testid="component" />);
        expect(screen.getByTestId("component")).toHaveClass("bg-secondary");
      });
    });

    describe("size prop", () => {
      it.each([
        ["sm", "text-sm"],
        ["md", "text-base"],
        ["lg", "text-lg"],
      ])("should apply '%s' size with class '%s'", (size, expectedClass) => {
        render(<ComponentName size={size as "sm" | "md" | "lg"} data-testid="component" />);
        expect(screen.getByTestId("component")).toHaveClass(expectedClass);
      });
    });

    describe("disabled prop", () => {
      it("should be disabled when disabled=true", () => {
        render(<ComponentName disabled />);
        expect(screen.getByRole("button")).toBeDisabled();
      });
    });
  });

  // ===========================================
  // ユーザー操作 (User Interactions)
  // ===========================================
  describe("ユーザー操作 (User Interactions)", () => {
    it("should call onClick when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ComponentName onClick={handleClick}>Click Me</ComponentName>);
      await user.click(screen.getByRole("button", { name: /click me/i }));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ComponentName onClick={handleClick} disabled>Click Me</ComponentName>);
      await user.click(screen.getByRole("button", { name: /click me/i }));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should handle keyboard Enter", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ComponentName onClick={handleClick}>Press Enter</ComponentName>);
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ===========================================
  // アクセシビリティ (Accessibility)
  // ===========================================
  describe("アクセシビリティ (Accessibility)", () => {
    it("should have correct ARIA attributes", () => {
      render(<ComponentName aria-label="Accessible Label" />);
      expect(screen.getByLabelText("Accessible Label")).toBeInTheDocument();
    });

    it("should be focusable", () => {
      render(<ComponentName />);
      const element = screen.getByRole("button");
      element.focus();
      expect(element).toHaveFocus();
    });

    it("should have visible focus indicator", () => {
      render(<ComponentName data-testid="component" />);
      const element = screen.getByTestId("component");
      element.focus();
      // Check for focus-visible classes
      expect(element).toHaveClass("focus-visible:ring-2");
    });
  });

  // ===========================================
  // エッジケース (Edge Cases)
  // ===========================================
  describe("エッジケース (Edge Cases)", () => {
    it("should handle empty children", () => {
      render(<ComponentName />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should handle very long text", () => {
      const longText = "A".repeat(1000);
      render(<ComponentName>{longText}</ComponentName>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should merge custom className with defaults", () => {
      render(<ComponentName className="custom-class" data-testid="component" />);
      const element = screen.getByTestId("component");
      expect(element).toHaveClass("custom-class");
      // Should also have default classes
      expect(element).toHaveClass("rounded-md");
    });
  });

  // ===========================================
  // スタイル (Styling)
  // ===========================================
  describe("スタイル (Styling)", () => {
    it("should apply custom className", () => {
      render(<ComponentName className="my-custom-class" data-testid="component" />);
      expect(screen.getByTestId("component")).toHaveClass("my-custom-class");
    });

    it("should forward ref correctly", () => {
      const ref = { current: null };
      render(<ComponentName ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
```

## Testing Patterns

### Event Handlers

```typescript
it("should call onChange with new value", async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();

  render(<Input onChange={handleChange} />);
  await user.type(screen.getByRole("textbox"), "hello");

  expect(handleChange).toHaveBeenLastCalledWith(
    expect.objectContaining({ target: expect.objectContaining({ value: "hello" }) })
  );
});
```

### Conditional Rendering

```typescript
it("should show error message when validation fails", () => {
  render(<Input error="This field is required" />);
  expect(screen.getByText("This field is required")).toBeInTheDocument();
  expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
});

it("should not show error when valid", () => {
  render(<Input />);
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
```

### Loading States

```typescript
it("should show loading spinner when loading", () => {
  render(<Button loading>Submit</Button>);
  expect(screen.getByRole("button")).toBeDisabled();
  expect(screen.getByTestId("spinner")).toBeInTheDocument();
});
```
