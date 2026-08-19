import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CheckoutPaymentForm } from "@/components/checkout/checkout-payment-form";

describe("CheckoutPaymentForm Integration", () => {
  it("renders payment methods and sandbox indicator", () => {
    const handleMethodChange = vi.fn();
    render(
      <CheckoutPaymentForm
        paymentMethod="razorpay"
        onPaymentMethodChange={handleMethodChange}
      />,
    );

    expect(screen.getByText("Payment Method")).toBeInTheDocument();
    expect(screen.getByText("Razorpay")).toBeInTheDocument();
    expect(screen.getByText("Cash on Delivery")).toBeInTheDocument();
    expect(screen.getByText("Sandbox Mode")).toBeInTheDocument();
  });

  it("calls onPaymentMethodChange when selecting a different payment method", () => {
    const handleMethodChange = vi.fn();
    render(
      <CheckoutPaymentForm
        paymentMethod="razorpay"
        onPaymentMethodChange={handleMethodChange}
      />,
    );

    const codLabel = screen.getByText("Cash on Delivery");
    fireEvent.click(codLabel);

    expect(handleMethodChange).toHaveBeenCalledWith("cod");
  });
});
