import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DemoBanner } from "@/components/layouts/demo-banner";

describe("DemoBanner Component", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("renders the demo banner on initial visit", () => {
    render(<DemoBanner />);
    expect(screen.getByText(/PORTFOLIO SHOWCASE/i)).toBeInTheDocument();
    expect(screen.getByText(/Vaibhav Singh/i)).toBeInTheDocument();
    expect(screen.getByText(/Razorpay Test Mode/i)).toBeInTheDocument();
  });

  it("dismisses when the close button is clicked and stores in sessionStorage", () => {
    render(<DemoBanner />);
    const dismissButton = screen.getByRole("button", { name: /dismiss notice/i });
    expect(dismissButton).toBeInTheDocument();

    fireEvent.click(dismissButton);

    // Should no longer be visible in the DOM
    expect(screen.queryByText(/PORTFOLIO SHOWCASE/i)).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem("aeroforge_demo_banner_dismissed")).toBe("true");
  });

  it("does not render if previously dismissed in the same session", () => {
    window.sessionStorage.setItem("aeroforge_demo_banner_dismissed", "true");
    render(<DemoBanner />);
    expect(screen.queryByText(/PORTFOLIO SHOWCASE/i)).not.toBeInTheDocument();
  });
});
