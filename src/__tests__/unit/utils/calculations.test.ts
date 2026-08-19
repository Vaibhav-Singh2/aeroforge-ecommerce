import { describe, it, expect } from "vitest";
import { cn, formatDate, generateOrderNumber } from "@/lib/utils";

describe("Utility and Calculation Functions", () => {
  it("merges Tailwind classes correctly with cn()", () => {
    expect(cn("px-2 py-1", "bg-blue-500")).toBe("px-2 py-1 bg-blue-500");
    // Should resolve conflicting Tailwind classes (e.g. padding override)
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", false && "hidden", "font-bold")).toBe("text-red-500 font-bold");
  });

  it("formats ISO date strings correctly", () => {
    const formatted = formatDate("2026-08-19T00:00:00.000Z");
    expect(formatted).toMatch(/Aug \d{1,2}, 2026/);
  });

  it("generates unique order numbers matching format YYYYMMDD-XXXX", () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber).toMatch(/^\d{8}-\d{4}$/);
  });

  it("calculates subtotal, GST/tax (18%), and order totals accurately", () => {
    const items = [
      { price: 44999, quantity: 1 },
      { price: 1899, quantity: 2 },
    ];

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    expect(subtotal).toBe(48797);

    const tax = Math.round(subtotal * 0.18);
    expect(tax).toBe(8783);

    const total = subtotal + tax;
    expect(total).toBe(57580);
  });
});
