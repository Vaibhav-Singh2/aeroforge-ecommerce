import AdminPanelLayout from "@/components/admin/admin-panel-layout";
import EditProductForm from "./edit-product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AdminPanelLayout title="Edit Product">
      <EditProductForm productId={id} />
    </AdminPanelLayout>
  );
}
