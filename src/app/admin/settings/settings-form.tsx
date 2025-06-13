"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, User, Mail, Store, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  updateAdminProfile,
  updateSiteSettings,
} from "@/lib/actions/settings-actions";

interface StoreSettings {
  id?: string;
  siteName?: string;
  siteDescription?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface SettingsFormProps {
  initialSettings: StoreSettings | null;
  admin: AdminUser | null;
  error?: string;
}

export default function SettingsForm({
  initialSettings,
  admin,
  error,
}: SettingsFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");
  const [accountFormLoading, setAccountFormLoading] = useState(false);
  const [storeFormLoading, setStoreFormLoading] = useState(false);

  const [accountForm, setAccountForm] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
  });

  const [storeForm, setStoreForm] = useState({
    siteName: initialSettings?.siteName || "E-commerce Store",
    siteDescription: initialSettings?.siteDescription || "",
    contactEmail: initialSettings?.contactEmail || "",
    contactPhone: initialSettings?.contactPhone || "",
  });

  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle account form submission
  const handleAccountUpdate = async (formData: FormData) => {
    try {
      setAccountFormLoading(true);

      const result = await updateAdminProfile(formData);

      if (result.success) {
        toast.success("Profile updated successfully");
        // Force a refresh to update admin data in session
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setAccountFormLoading(false);
    }
  };

  // Handle store settings form submission
  const handleStoreSettingsUpdate = async (formData: FormData) => {
    try {
      setStoreFormLoading(true);

      const result = await updateSiteSettings(formData);

      if (result.success) {
        toast.success("Store settings updated successfully");
      } else {
        toast.error(result.error || "Failed to update store settings");
      }
    } catch (error) {
      console.error("Error updating store settings:", error);
      toast.error("Failed to update store settings");
    } finally {
      setStoreFormLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="account"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account personal information
              </CardDescription>
            </CardHeader>
            <form action={handleAccountUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="mr-2 inline-block h-4 w-4" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={accountForm.name}
                    onChange={handleAccountFormChange}
                    disabled={accountFormLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="mr-2 inline-block h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={accountForm.email}
                    onChange={handleAccountFormChange}
                    disabled={accountFormLoading}
                  />
                </div>

                <div>
                  <Badge variant="outline" className="bg-primary/10">
                    <Shield className="mr-1 h-3 w-3" />
                    {admin?.role || "Admin"}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={accountFormLoading}>
                  {accountFormLoading ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Store Settings */}
        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and configuration
              </CardDescription>
            </CardHeader>
            <form action={handleStoreSettingsUpdate}>
              {initialSettings?.id && (
                <input type="hidden" name="id" value={initialSettings.id} />
              )}
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">
                    <Store className="mr-2 inline-block h-4 w-4" />
                    Store Name
                  </Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={storeForm.siteName}
                    onChange={handleStoreFormChange}
                    disabled={storeFormLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Store Description</Label>
                  <Input
                    id="siteDescription"
                    name="siteDescription"
                    value={storeForm.siteDescription}
                    onChange={handleStoreFormChange}
                    disabled={storeFormLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={storeForm.contactEmail}
                    onChange={handleStoreFormChange}
                    disabled={storeFormLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={storeForm.contactPhone}
                    onChange={handleStoreFormChange}
                    disabled={storeFormLoading}
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={storeFormLoading}>
                  {storeFormLoading ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Store Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Password change functionality will be implemented soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
