import { Suspense } from "react";
import AdminPanelLayout from "@/components/admin/admin-panel-layout";
import OrdersTable from "./orders-table";
import { getAdminOrders } from "@/lib/actions/order-admin-actions";

export default async function OrdersPage() {
  const { orders, success, error } = await getAdminOrders();

  return (
    <AdminPanelLayout title="Orders">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Orders
        </h1>
      </div>

      <Suspense
        fallback={
          <div className="flex h-40 items-center justify-center">
            Loading orders...
          </div>
        }
      >
        <OrdersTable initialOrders={success ? orders : []} error={error} />
      </Suspense>
    </AdminPanelLayout>
  );
}
