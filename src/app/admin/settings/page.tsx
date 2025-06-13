import { Suspense } from "react";
import AdminPanelLayout from "@/components/admin/admin-panel-layout";
import SettingsForm from "./settings-form";
import { getSiteSettings } from "@/lib/actions/settings-actions";
import { getAdminSession } from "@/lib/admin/get-admin-session";

export default async function SettingsPage() {
  const { siteSettings, success, error } = await getSiteSettings();
  const admin = await getAdminSession();

  return (
    <AdminPanelLayout title="Settings">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
      </div>

      <Suspense fallback={<div className="flex h-40 items-center justify-center">Loading settings...</div>}>
        <SettingsForm initialSettings={success ? siteSettings : null} admin={admin} error={error} />
      </Suspense>
    </AdminPanelLayout>
  );
}
