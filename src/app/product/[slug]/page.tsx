import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/services/product-service";
import { ProductDetail } from "@/components/products/product-detail";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    variant?: string;
    sku?: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      images:
        product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const product = await getProductBySlug((await params).slug);

  if (!product) {
    notFound();
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialVariantId =
    resolvedSearchParams?.variant || resolvedSearchParams?.sku;

  return (
    <ProductDetail
      product={product}
      initialVariantId={initialVariantId}
    />
  );
}
