import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge UI Component", () => {
  it("renders with default styling", () => {
    render(<Badge>Bestseller</Badge>);
    const badge = screen.getByText("Bestseller");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("applies variant classes accurately", () => {
    const { rerender } = render(<Badge variant="secondary">In Stock</Badge>);
    expect(screen.getByText("In Stock")).toHaveClass("bg-secondary");

    rerender(<Badge variant="destructive">Out of Stock</Badge>);
    expect(screen.getByText("Out of Stock")).toHaveClass("bg-destructive");

    rerender(<Badge variant="outline">FPV Ready</Badge>);
    expect(screen.getByText("FPV Ready")).toHaveClass("text-foreground");
  });
});
