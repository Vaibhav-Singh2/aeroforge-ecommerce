import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SortDropdown } from "@/components/ui/sort-dropdown";

describe("SortDropdown Integration", () => {
  it("renders with trigger button", () => {
    render(
      <SortDropdown
        currentSort="newest"
        currentPage={1}
        type="projects"
        category="racing-drones"
      />,
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeInTheDocument();
  });
});
