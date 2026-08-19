"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Edit, Trash, Check, ArrowLeft } from "lucide-react";
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
import LoadingScreen from "../loading-screen";

export function AddressBook() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { addresses, addressLoading } = useAppSelector((state) => state.user);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle navigating back
  const handleBack = () => {
    router.back();
  };

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
  const handleSetDefaultAddress = async (addressId: string) => {
    setIsLoading(true);
    try {
      await setDefaultAddress(addressId);
      dispatch(
        addToast({
          type: "success",
          title: "Default address updated",
          message: "Your default address has been updated.",
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

  if (addressLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="mb-1 text-2xl sm:text-3xl font-bold">Address Book</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">Manage your addresses</p>
            </div>
          </div>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4">
              <LoadingScreen />
            </div>
            <h2 className="mb-2 text-xl font-semibold">Loading addresses...</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Please wait while we fetch your saved addresses.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render empty state if no addresses
  if (addresses.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="mb-1 text-2xl sm:text-3xl font-bold">Address Book</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">Manage your addresses</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Add a new address to your account.
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
            <h2 className="mb-2 text-xl font-semibold">No addresses saved</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              You haven&apos;t saved any shipping addresses yet. Add one to speed up
              your checkout process.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="mb-1 text-2xl sm:text-3xl font-bold">Address Book</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">Manage your addresses</p>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingAddress(null)}>
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
              <DialogDescription>
                {editingAddress
                  ? "Update your existing address information."
                  : "Add a new address to your account."}
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

      {/* All addresses */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Addresses</CardTitle>
          <CardDescription>
            Addresses used for delivering orders and billing.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {addresses.map((address: Address) => (
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
                  {address.phone && <p className="text-sm">{address.phone}</p>}
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
                      onClick={() => handleSetDefaultAddress(address.id)}
                      disabled={isLoading}
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Back button */}
      <div className="mt-8">
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
