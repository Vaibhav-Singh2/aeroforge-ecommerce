import { Suspense } from "react";
import AdminPanelLayout from "@/components/admin/admin-panel-layout";
import ProductsTable from "./products-table";
import { getProducts } from "@/lib/actions/product-actions";

export default async function ProductsPage() {
  const { products, success, error } = await getProducts();

  return (
    <AdminPanelLayout title="Products">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
      </div>

      <Suspense
        fallback={
          <div className="flex h-40 items-center justify-center">
            Loading products...
          </div>
        }
      >
        <ProductsTable
          initialProducts={success ? products : []}
          error={error}
        />
      </Suspense>
    </AdminPanelLayout>
  );
}
