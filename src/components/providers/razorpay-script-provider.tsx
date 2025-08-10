"use client";

import { useEffect } from "react";

/**
 * Loads the Razorpay script dynamically
 */
export function RazorpayScriptLoader() {
  useEffect(() => {
    // Check if the script is already loaded
    if (window.Razorpay) {
      return;
    }

    // Create and load the script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Cleanup function
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}
