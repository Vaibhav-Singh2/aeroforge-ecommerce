"use client";

import { useState } from "react";
import { CreditCard, Calendar, Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutPaymentForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/g, "");
    let formattedValue = "";

    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += " ";
      }
      formattedValue += value[i];
    }

    if (formattedValue.length <= 19) {
      // 16 digits + 3 spaces
      setCardNumber(formattedValue);
    }
  };

  // Format expiry date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = value;

    if (value.length > 2) {
      formattedValue = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    if (formattedValue.length <= 5) {
      // MM/YY format
      setExpiryDate(formattedValue);
    }
  };

  // Limit CVV to 3-4 digits
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <div className="relative">
              <CreditCard className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                className="pl-10"
                value={cardNumber}
                onChange={handleCardNumberChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-name">Cardholder Name</Label>
            <Input
              id="card-name"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <div className="relative">
                <Calendar className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  className="pl-10"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <div className="relative">
                <Info className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                <Input
                  id="cvv"
                  placeholder="123"
                  className="pl-10"
                  value={cvv}
                  onChange={handleCvvChange}
                  type="password"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted/50 text-muted-foreground rounded-lg p-4 text-sm">
            <p>
              This is a demo store. No real payments will be processed. Use any
              valid-looking credit card information.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
