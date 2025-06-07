"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Edit, Trash, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addToast } from "@/lib/redux/features/uiSlice";
import { Address } from "@prisma/client";
import { deleteAddress, setDefaultAddress } from "@/lib/actions/user-actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddressForm } from "@/components/user/address-form";

export function AddressBook() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { addresses } = useAppSelector((state) => state.user);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle edit address
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setIsLoading(true);
      try {
        await deleteAddress(addressId);
        dispatch(
          addToast({
            type: "success",
            title: "Address deleted",
            message: "Your address has been deleted successfully.",
          }),
        );
        router.refresh();
      } catch (error) {
        console.error("Error deleting address:", error);
        dispatch(
          addToast({
            type: "error",
            title: "Error",
            message: "Failed to delete address. Please try again.",
          }),
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle set default address
  const handleSetDefaultAddress = async (
    addressId: string,
    type: "shipping" | "billing",
  ) => {
    setIsLoading(true);
    try {
      await setDefaultAddress(addressId, type);
      dispatch(
        addToast({
          type: "success",
          title: "Default address updated",
          message: `Your default ${type} address has been updated.`,
        }),
      );
      router.refresh();
    } catch (error) {
      console.error("Error setting default address:", error);
      dispatch(
        addToast({
          type: "error",
          title: "Error",
          message: "Failed to update default address. Please try again.",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Group addresses by type
  const shippingAddresses = addresses.filter(
    (addr) => addr.type === "shipping",
  );
  const billingAddresses = addresses.filter((addr) => addr.type === "billing");

  // Render empty state if no addresses
  if (addresses.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-3xl font-bold">Address Book</h1>
            <p className="text-muted-foreground">
              Manage your shipping and billing addresses
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Add a new shipping or billing address to your account.
                </DialogDescription>
              </DialogHeader>
              <AddressForm
                onSuccess={() => {
                  setDialogOpen(false);
                  router.refresh();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center pt-6 pb-16 text-center">
            <MapPin className="text-muted-foreground mb-4 h-16 w-16" />
            <h2 className="mb-2 text-xl font-semibold">No addresses yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Add your first address to make checkout faster and easier.
            </p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                  <DialogDescription>
                    Add a new shipping or billing address to your account.
                  </DialogDescription>
                </DialogHeader>
                <AddressForm
                  onSuccess={() => {
                    setDialogOpen(false);
                    router.refresh();
                  }}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-bold">Address Book</h1>
          <p className="text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingAddress(null)}>
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
              <DialogDescription>
                {editingAddress
                  ? "Update your existing address information."
                  : "Add a new shipping or billing address to your account."}
              </DialogDescription>
            </DialogHeader>
            <AddressForm
              address={editingAddress}
              onSuccess={() => {
                setDialogOpen(false);
                setEditingAddress(null);
                router.refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Shipping addresses */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Shipping Addresses</CardTitle>
          <CardDescription>
            Addresses used for delivering your orders.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {shippingAddresses.length === 0 ? (
            <p className="text-muted-foreground text-sm md:col-span-2">
              No shipping addresses added yet.
            </p>
          ) : (
            shippingAddresses.map((address) => (
              <Card key={address.id} className="relative">
                <CardContent className="pt-6">
                  {address.isDefault && (
                    <div className="bg-primary text-primary-foreground absolute -top-2 -right-2 rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      {address.firstName} {address.lastName}
                    </h3>
                    <p className="text-sm">{address.address1}</p>
                    {address.address2 && (
                      <p className="text-sm">{address.address2}</p>
                    )}
                    <p className="text-sm">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm">{address.country}</p>
                    {address.phone && (
                      <p className="text-sm">{address.phone}</p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="mr-1 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive h-8"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={isLoading}
                    >
                      <Trash className="mr-1 h-3.5 w-3.5" />
                      Delete
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-8"
                        onClick={() =>
                          handleSetDefaultAddress(address.id, "shipping")
                        }
                        disabled={isLoading}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Billing addresses */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Addresses</CardTitle>
          <CardDescription>
            Addresses used for payment and invoicing.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {billingAddresses.length === 0 ? (
            <p className="text-muted-foreground text-sm md:col-span-2">
              No billing addresses added yet.
            </p>
          ) : (
            billingAddresses.map((address) => (
              <Card key={address.id} className="relative">
                <CardContent className="pt-6">
                  {address.isDefault && (
                    <div className="bg-primary text-primary-foreground absolute -top-2 -right-2 rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      {address.firstName} {address.lastName}
                    </h3>
                    <p className="text-sm">{address.address1}</p>
                    {address.address2 && (
                      <p className="text-sm">{address.address2}</p>
                    )}
                    <p className="text-sm">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm">{address.country}</p>
                    {address.phone && (
                      <p className="text-sm">{address.phone}</p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="mr-1 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive h-8"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={isLoading}
                    >
                      <Trash className="mr-1 h-3.5 w-3.5" />
                      Delete
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-8"
                        onClick={() =>
                          handleSetDefaultAddress(address.id, "billing")
                        }
                        disabled={isLoading}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
