import { Metadata } from "next";
import { AccountDashboard } from "@/components/account/account-dashboard";

export const metadata: Metadata = {
  title: "My Account - Drone Store",
  description: "Manage your account, view orders, and update your profile",
};

export default function AccountPage() {
  return <AccountDashboard />;
}
