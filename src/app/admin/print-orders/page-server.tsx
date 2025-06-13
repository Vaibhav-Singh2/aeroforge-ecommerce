import { Suspense } from "react";
import AdminPanelLayout from "@/components/admin/admin-panel-layout";
import PrintOrdersTable from "./print-orders-table";
import { getPrintOrders } from "@/lib/actions/print-order-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function PrintOrdersPage() {
  const { printOrders, success, error } = await getPrintOrders();

  return (
    <AdminPanelLayout title="Print Orders">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Print Orders
        </h1>
        <Button asChild>
          <Link href="/admin/print-orders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Print Order
          </Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex h-40 items-center justify-center">
            Loading print orders...
          </div>
        }
      >
        <PrintOrdersTable
          initialPrintOrders={success ? printOrders : []}
          error={error}
        />
      </Suspense>
    </AdminPanelLayout>
  );
}
