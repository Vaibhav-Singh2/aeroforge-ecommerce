"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, PlusCircle, Search } from "lucide-react";
import { ProductStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteProduct } from "@/lib/actions/product-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  price: number;
  images: string[];
  category: {
    name: string;
  };
}

interface ProductsTableProps {
  initialProducts: Product[] | undefined;
  error?: string;
}

export default function ProductsTable({
  initialProducts,
  error,
}: ProductsTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (isDeleting) return;

    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setIsDeleting(true);

      const formData = new FormData();
      formData.append("productId", productId);

      const result = await deleteProduct(formData);

      if (result.success) {
        // Remove the product from the state
        setProducts(products.filter((product) => product.id !== productId));
        toast.success("Product deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and search products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "active")
      return matchesSearch && product.status === "ACTIVE";
    if (filter === "inactive")
      return matchesSearch && product.status === "INACTIVE";
    if (filter === "out-of-stock")
      return matchesSearch && product.status === "OUT_OF_STOCK";

    return matchesSearch;
  });

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/10 dark:text-red-300">
        <p>Error loading products: {error}</p>
        <Button
          onClick={() => router.refresh()}
          className="mt-2"
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Link href="/admin/products/new">
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Products table */}
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  {searchTerm || filter !== "all" ? (
                    <p>No products found matching your filters</p>
                  ) : (
                    <p>No products found</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : product.status === "INACTIVE"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}
                    >
                      {product.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          title="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Delete product"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
