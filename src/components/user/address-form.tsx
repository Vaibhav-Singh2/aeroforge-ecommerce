"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addAddress, updateAddress } from "@/lib/actions/user-actions";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addToast } from "@/lib/redux/features/uiSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Address } from "@prisma/client";

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

// Ensure full compatibility with Prisma Address type while allowing for address being optional
interface AddressFormProps {
  address?: Address | null;
  onSubmit?: (formData: FormData) => Promise<void>;
  onSuccess?: () => void;
}

export function AddressForm({
  address,
  onSubmit,
  onSuccess,
}: AddressFormProps) {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues:
      address && address !== null
        ? {
            firstName: address.firstName,
            lastName: address.lastName,
            company: address.company || "",
            address1: address.address1,
            address2: address.address2 || "",
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
            phone: address.phone || "",
            isDefault: address.isDefault,
          }
        : {
            firstName: "",
            lastName: "",
            company: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India",
            phone: "",
            isDefault: false,
          },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // If onSubmit is provided, use that
      if (onSubmit) {
        const formData = new FormData(e.currentTarget);
        await onSubmit(formData);
      }
      // Otherwise use our built-in address actions
      else {
        const formData = new FormData(e.currentTarget);
        const addressData = {
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

        if (address && address !== null) {
          // Update existing address
          await updateAddress(address.id, addressData);
          dispatch(
            addToast({
              type: "success",
              title: "Address updated",
              message: "Your address has been updated successfully.",
            }),
          );
        } else {
          // Add new address
          await addAddress(addressData);
          dispatch(
            addToast({
              type: "success",
              title: "Address added",
              message: "Your new address has been added successfully.",
            }),
          );
        }
      }

      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting address form:", error);
      dispatch(
        addToast({
          type: "error",
          title: "Error",
          message: "Failed to save address. Please try again.",
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={form.getValues("firstName")}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={form.getValues("lastName")}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company (Optional)</Label>
        <Input
          id="company"
          name="company"
          defaultValue={form.getValues("company")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address1">Address Line 1</Label>
        <Input
          id="address1"
          name="address1"
          defaultValue={form.getValues("address1")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address2">Address Line 2 (Optional)</Label>
        <Input
          id="address2"
          name="address2"
          defaultValue={form.getValues("address2")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            defaultValue={form.getValues("city")}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            name="state"
            defaultValue={form.getValues("state")}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP/Postal Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            defaultValue={form.getValues("zipCode")}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            defaultValue={form.getValues("country")}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={form.getValues("phone")}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          name="isDefault"
          defaultChecked={form.getValues("isDefault")}
        />
        <Label htmlFor="isDefault">Set as default address</Label>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : address
              ? "Update Address"
              : "Add Address"}
        </Button>
      </div>
    </form>
  );
}
