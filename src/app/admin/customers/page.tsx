import { Suspense } from "react";
import AdminPanelLayout from "@/components/admin/admin-panel-layout";
import CustomersTable from "./customers-table";
import { getCustomers } from "@/lib/actions/customer-actions";

export default async function CustomersPage() {
  const { customers, success, error } = await getCustomers();

  return (
    <AdminPanelLayout title="Customers">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Customers
        </h1>
      </div>

      <Suspense
        fallback={
          <div className="flex h-40 items-center justify-center">
            Loading customers...
          </div>
        }
      >
        <CustomersTable
          initialCustomers={success ? customers : []}
          error={error}
        />
      </Suspense>
    </AdminPanelLayout>
  );
}
