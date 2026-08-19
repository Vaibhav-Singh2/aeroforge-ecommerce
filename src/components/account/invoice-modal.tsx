"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Printer, FileText, Download, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InvoiceModalProps {
  order: {
    id: string;
    orderNumber: string;
    createdAt: Date | string;
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    totalAmount: number;
    paymentMethod?: string | null;
    paymentStatus: string;
    shippingAddress?: {
      firstName: string;
      lastName: string;
      company?: string | null;
      address1: string;
      address2?: string | null;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone?: string | null;
    } | null;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      variant?: { name: string } | null;
    }>;
  };
}

export function InvoiceModal({ order }: InvoiceModalProps) {
  const [open, setOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const gstCalculated = order.taxAmount || Math.round(order.subtotal * 0.18);
  const cgst = gstCalculated / 2;
  const sgst = gstCalculated / 2;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <FileText className="h-3.5 w-3.5" />
          <span>Tax Invoice</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background">
        <div className="p-6 space-y-6 print:p-0 print:m-0" id="tax-invoice-printable">
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-primary">
                  AEROFORGE LABS
                </span>
                <span className="text-[10px] font-semibold uppercase bg-muted px-1.5 py-0.5 rounded">
                  Official GST Tax Invoice
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                AeroForge Aerospace & Drone Technologies Pvt Ltd
              </p>
              <p className="text-[11px] text-muted-foreground">
                GSTIN: <strong>07AAACA1234A1Z5</strong> • HSN Code: 8802 (UAV/Drones)
              </p>
              <p className="text-[11px] text-muted-foreground">
                support@aeroforge-labs.com • New Delhi, 110001, India
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-foreground block">
                INV #{order.orderNumber}
              </span>
              <span className="text-xs text-muted-foreground block">
                Date: {format(new Date(order.createdAt), "dd MMM yyyy")}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full mt-1">
                <Check className="h-3 w-3" />
                {order.paymentStatus === "PAID" ? "Paid in Full" : "Payment Pending"}
              </span>
            </div>
          </div>

          {/* Billed To Address */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg border bg-muted/20 p-3">
              <span className="font-semibold text-foreground uppercase tracking-wider block text-[10px] mb-1">
                Billed / Shipped To:
              </span>
              {order.shippingAddress ? (
                <div className="text-muted-foreground space-y-0.5">
                  <strong className="text-foreground block">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </strong>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                </div>
              ) : (
                <p className="text-muted-foreground">Customer Address on File</p>
              )}
            </div>

            <div className="rounded-lg border bg-muted/20 p-3 space-y-1">
              <span className="font-semibold text-foreground uppercase tracking-wider block text-[10px] mb-1">
                Payment & Fulfillment Details:
              </span>
              <p className="text-muted-foreground">
                Payment Mode: <strong className="text-foreground uppercase">{order.paymentMethod || "Online (Razorpay / UPI)"}</strong>
              </p>
              <p className="text-muted-foreground">
                Currency: <strong className="text-foreground">INR (₹)</strong>
              </p>
              <p className="text-muted-foreground">
                Quality Assurance: <strong className="text-foreground">ISO-9001 Benchmarked</strong>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-semibold border-b">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="p-2.5">
                      <div className="font-medium text-foreground">{item.name}</div>
                      {item.variant && (
                        <div className="text-[11px] text-muted-foreground">
                          Option: {item.variant.name}
                        </div>
                      )}
                    </td>
                    <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="p-2.5 text-right font-mono">₹{item.price.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-mono font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-1.5 border-t pt-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal (Excl. Tax):</span>
                <span className="font-mono">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>CGST (9%):</span>
                <span className="font-mono">₹{cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>SGST (9%):</span>
                <span className="font-mono">₹{sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Express Air Shipping:</span>
                <span className="font-mono">
                  {order.shippingAmount === 0 ? "FREE" : `₹${order.shippingAmount.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-1.5 font-bold text-sm text-foreground">
                <span>Total Invoice Value:</span>
                <span className="font-mono text-primary">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 border-t bg-muted/40 p-4 print:hidden">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="h-3.5 w-3.5" />
            <span>Print Invoice</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
