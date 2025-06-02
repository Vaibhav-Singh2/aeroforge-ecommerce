"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Home, Building2 } from "lucide-react";
import { Address } from "@prisma/client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addToast } from "@/lib/redux/features/uiSlice";
import { addAddress } from "@/lib/actions/user-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddressForm } from "@/components/user/address-form";

interface CheckoutAddressFormProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onAddressSelect: (addressId: string) => void;
}

export function CheckoutAddressForm({
  addresses,
  selectedAddressId,
  onAddressSelect,
}: CheckoutAddressFormProps) {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleNewAddressSubmit = async (formData: FormData) => {
    try {
      // Extract address data from form
      const addressData = {
        type: formData.get("type") as "shipping" | "billing",
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        company: (formData.get("company") as string) || undefined,
        address1: formData.get("address1") as string,
        address2: (formData.get("address2") as string) || undefined,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zipCode: formData.get("zipCode") as string,
        country: formData.get("country") as string,
        phone: (formData.get("phone") as string) || undefined,
        isDefault: formData.has("isDefault"),
      };

      const newAddress = await addAddress(addressData);
      if (newAddress) {
        onAddressSelect(newAddress.id);
        setIsAddingAddress(false);
        dispatch(
          addToast({
            type: "success",
            title: "Address added",
            message: "Your new address has been added successfully.",
          }),
        );
      }
    } catch (error) {
      console.error("Failed to create address:", error);
      dispatch(
        addToast({
          type: "error",
          title: "Error",
          message: "Failed to add address. Please try again.",
        }),
      );
    }
  };

  // If no addresses are available, show the address form directly
  if (addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center">
            <p>
              {`You don't have any saved addresses. Please add a new address to
              continue.`}
            </p>
          </div>
          <AddressForm onSubmit={handleNewAddressSubmit} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Shipping Address</CardTitle>
        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm onSubmit={handleNewAddressSubmit} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAddressId || undefined}
          onValueChange={onAddressSelect}
          className="space-y-4"
        >
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`rounded-md border p-4 ${
                selectedAddressId === address.id ? "border-primary" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value={address.id}
                  id={address.id}
                  className="mt-1"
                />
                <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {address.firstName} {address.lastName}
                      </span>
                      {address.isDefault && (
                        <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
                          Default
                        </span>
                      )}
                      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                        {address.type === "shipping" ? (
                          <>
                            <Home className="h-3 w-3" />
                            Shipping
                          </>
                        ) : (
                          <>
                            <Building2 className="h-3 w-3" />
                            Billing
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                      >
                        <span
                          onClick={() =>
                            router.push(`/account/addresses/${address.id}`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="text-muted-foreground mt-2 text-sm">
                    {address.address1}
                    {address.address2 && `, ${address.address2}`}
                    <br />
                    {address.city}, {address.state}, {address.zipCode}
                    <br />
                    {address.country}
                    {address.phone && (
                      <>
                        <br />
                        Phone: {address.phone}
                      </>
                    )}
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
