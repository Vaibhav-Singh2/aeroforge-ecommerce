import { Suspense } from "react";
import AdminPanelLayout from "@/components/admin/admin-panel-layout";
import RepairOrdersTable from "./repair-orders-table";
import { getRepairOrders } from "@/lib/actions/repair-order-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Prevent static rendering for this route
export const dynamic = "force-dynamic";

export default async function RepairOrdersPage() {
  const { repairOrders, success, error } = await getRepairOrders();

  return (
    <AdminPanelLayout title="Repair Orders">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Repair Orders
        </h1>
        <Button asChild>
          <Link href="/admin/repair-orders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Repair Order
          </Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex h-40 items-center justify-center">
            Loading repair orders...
          </div>
        }
      >
        <RepairOrdersTable
          initialRepairOrders={success ? repairOrders : []}
          error={error}
        />
      </Suspense>
    </AdminPanelLayout>
  );
}
