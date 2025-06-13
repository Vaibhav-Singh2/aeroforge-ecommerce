import { Metadata } from "next";
import { AddressBook } from "@/components/account/address-book";

export const metadata: Metadata = {
  title: "Address Book - Drone Store",
  description: "Manage your shipping addresses",
};

export default function AddressBookPage() {
  return <AddressBook />;
}
