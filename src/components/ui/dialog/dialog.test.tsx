import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";

describe("Dialog Component", () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    // Reset body overflow style before each test
    document.body.style.overflow = "";
  });

  afterEach(() => {
    cleanup();
    // Ensure body overflow is reset after each test
    document.body.style.overflow = "";
  });

  it("renders correctly when open", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Dialog Content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <Dialog open={false} onOpenChange={mockOnOpenChange}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Dialog Content")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when ESC key is pressed", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenChange when clicking outside (overlay click)", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    // Find the overlay (has aria-hidden="true")
    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();

    // Click on the overlay (outside the dialog)
    fireEvent.mouseDown(overlay!);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
  });

  it('does not close on overlay click when variant="alert"', () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange} variant="alert">
        <DialogContent>Alert Dialog Content</DialogContent>
      </Dialog>
    );

    // Find the overlay
    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();

    // Click on the overlay
    fireEvent.mouseDown(overlay!);

    // onOpenChange should NOT be called for alert variant
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  it("renders with correct size classes (sm)", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange} size="sm">
        <DialogContent>Small Dialog</DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("max-w-sm");
  });

  it("renders with correct size classes (md)", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange} size="md">
        <DialogContent>Medium Dialog</DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("max-w-md");
  });

  it("renders with correct size classes (lg)", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange} size="lg">
        <DialogContent>Large Dialog</DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("max-w-lg");
  });

  it("defaults to md size when no size prop is provided", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>Default Size Dialog</DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("max-w-md");
  });

  it("renders with correct variant classes (default)", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange} variant="default">
        <DialogContent>Default Dialog</DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("border-foreground/10");
  });

  it("renders with correct variant classes (alert)", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange} variant="alert">
        <DialogContent>Alert Dialog</DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("border-red-500");
  });

  it("sets body overflow to hidden when open", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("cleans up body overflow style on unmount", () => {
    const { unmount } = render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("");
  });

  it("has correct aria attributes", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("does not call onOpenChange when a non-Escape key is pressed", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    fireEvent.keyDown(document, { key: "Enter" });
    fireEvent.keyDown(document, { key: "Tab" });
    fireEvent.keyDown(document, { key: "a" });

    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  it("does not close when clicking inside the dialog", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>
          <button>Inside Button</button>
        </DialogContent>
      </Dialog>
    );

    const insideButton = screen.getByText("Inside Button");
    fireEvent.mouseDown(insideButton);

    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  it("does not close when clicking on the dialog container itself", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    fireEvent.mouseDown(dialog);

    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  it("has open state classes when open is true", () => {
    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogContent>Dialog Content</DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("opacity-100", "scale-100");
  });
});

describe("DialogHeader Component", () => {
  it("renders children correctly", () => {
    render(
      <DialogHeader>
        <span>Header Content</span>
      </DialogHeader>
    );

    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <DialogHeader className="custom-header-class">
        <span>Header Content</span>
      </DialogHeader>
    );

    const header = screen.getByText("Header Content").parentElement;
    expect(header).toHaveClass("custom-header-class");
  });

  it("applies default styles", () => {
    render(
      <DialogHeader data-testid="dialog-header">
        <span>Header Content</span>
      </DialogHeader>
    );

    const header = screen.getByTestId("dialog-header");
    expect(header).toHaveClass("px-6", "py-4", "border-b");
  });
});

describe("DialogContent Component", () => {
  it("renders children correctly", () => {
    render(
      <DialogContent>
        <p>Main content goes here</p>
      </DialogContent>
    );

    expect(screen.getByText("Main content goes here")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <DialogContent className="custom-content-class">
        <p>Main content</p>
      </DialogContent>
    );

    const content = screen.getByText("Main content").parentElement;
    expect(content).toHaveClass("custom-content-class");
  });

  it("applies default styles", () => {
    render(
      <DialogContent data-testid="dialog-content">
        <p>Content</p>
      </DialogContent>
    );

    const content = screen.getByTestId("dialog-content");
    expect(content).toHaveClass("px-6", "py-4");
  });
});

describe("DialogFooter Component", () => {
  it("renders children correctly", () => {
    render(
      <DialogFooter>
        <button>Cancel</button>
        <button>Confirm</button>
      </DialogFooter>
    );

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <DialogFooter className="custom-footer-class">
        <button>Action</button>
      </DialogFooter>
    );

    const footer = screen.getByText("Action").parentElement;
    expect(footer).toHaveClass("custom-footer-class");
  });

  it("applies default styles", () => {
    render(
      <DialogFooter data-testid="dialog-footer">
        <button>Action</button>
      </DialogFooter>
    );

    const footer = screen.getByTestId("dialog-footer");
    expect(footer).toHaveClass("px-6", "py-4", "border-t", "flex", "justify-end", "gap-2");
  });
});

describe("DialogTitle Component", () => {
  it("renders as h2 element", () => {
    render(<DialogTitle>My Dialog Title</DialogTitle>);

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H2");
  });

  it("renders children correctly", () => {
    render(<DialogTitle>My Dialog Title</DialogTitle>);

    expect(screen.getByText("My Dialog Title")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<DialogTitle className="custom-title-class">Title</DialogTitle>);

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveClass("custom-title-class");
  });

  it("applies default styles", () => {
    render(<DialogTitle>Title</DialogTitle>);

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveClass("text-xl", "font-semibold");
  });
});

describe("DialogDescription Component", () => {
  it("renders as p element", () => {
    render(<DialogDescription>This is a description</DialogDescription>);

    const description = screen.getByText("This is a description");
    expect(description.tagName).toBe("P");
  });

  it("renders children correctly", () => {
    render(<DialogDescription>Description text here</DialogDescription>);

    expect(screen.getByText("Description text here")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<DialogDescription className="custom-description-class">Description</DialogDescription>);

    const description = screen.getByText("Description");
    expect(description).toHaveClass("custom-description-class");
  });

  it("applies default styles", () => {
    render(<DialogDescription>Description</DialogDescription>);

    const description = screen.getByText("Description");
    expect(description).toHaveClass("text-sm", "mt-1.5");
  });
});

describe("Dialog Integration", () => {
  it("renders a complete dialog with all subcomponents", () => {
    const mockOnOpenChange = vi.fn();

    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>Are you sure you want to proceed?</DialogDescription>
        </DialogHeader>
        <DialogContent>
          <p>This action cannot be undone.</p>
        </DialogContent>
        <DialogFooter>
          <button onClick={() => mockOnOpenChange(false)}>Cancel</button>
          <button>Confirm</button>
        </DialogFooter>
      </Dialog>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Confirm Action");
    expect(screen.getByText("Are you sure you want to proceed?")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("handles closing via cancel button", () => {
    const mockOnOpenChange = vi.fn();

    render(
      <Dialog open={true} onOpenChange={mockOnOpenChange}>
        <DialogHeader>
          <DialogTitle>Confirm</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <button onClick={() => mockOnOpenChange(false)}>Cancel</button>
        </DialogFooter>
      </Dialog>
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
