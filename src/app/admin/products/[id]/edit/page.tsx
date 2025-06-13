import AdminPanelLayout from "@/components/admin/admin-panel-layout";
import EditProductForm from "./edit-product-form";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <AdminPanelLayout title="Edit Product">
      <EditProductForm productId={params.id} />
    </AdminPanelLayout>
  );
}
