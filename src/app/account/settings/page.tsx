"use client";

import { UserProfile } from "@clerk/nextjs";

export default function Settings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Account Settings</h1>
      <UserProfile
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none",
          },
        }}
        path="/account/settings"
      />
    </div>
  );
}
