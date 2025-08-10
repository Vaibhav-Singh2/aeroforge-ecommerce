"use client";

import { CreditCard, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CheckoutPaymentFormProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

export function CheckoutPaymentForm({
  paymentMethod,
  onPaymentMethodChange,
}: CheckoutPaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={onPaymentMethodChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 rounded-md border p-4">
              <RadioGroupItem value="razorpay" id="razorpay" />
              <Label
                htmlFor="razorpay"
                className="flex flex-1 cursor-pointer items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Razorpay</div>
                    <div className="text-muted-foreground text-sm">
                      Pay securely with credit/debit card, UPI, or bank transfer
                    </div>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 rounded-md border p-4">
              <RadioGroupItem value="cod" id="cod" />
              <Label
                htmlFor="cod"
                className="flex flex-1 cursor-pointer items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Landmark className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-muted-foreground text-sm">
                      Pay with cash when your order is delivered
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="bg-muted/50 text-muted-foreground rounded-lg p-4 text-sm">
            <p>
              {paymentMethod === "razorpay"
                ? "You'll be redirected to Razorpay's secure payment page to complete your purchase."
                : "You can pay in cash when your order is delivered."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
