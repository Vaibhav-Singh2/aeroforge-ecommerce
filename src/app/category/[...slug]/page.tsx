import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, SlidersHorizontal, ChevronRight } from "lucide-react";

// Import the client component
import { ClientAddToCartButton } from "@/components/ui/category-add-to-cart";

import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortDropdown } from "@/components/ui/sort-dropdown";
import { PaginationControl } from "@/components/ui/pagination-control";
import prisma from "@/lib/prisma";

// Server component
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: "projects" | "parts-and-accessories" }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const [type, category] = (await params).slug;
  const awaitedSearchParams = await searchParams;
  const currentPage = awaitedSearchParams.page
    ? parseInt(awaitedSearchParams.page)
    : 1;
  const itemsPerPage = 15;
  const sortOption = awaitedSearchParams.sort || "newest";

  if (type !== "projects" && type !== "parts-and-accessories") {
    notFound();
  }

  const categoryList = await prisma.category.findMany({
    where: {
      type: type === "projects" ? "READY_MADE_PROJECT" : "PART_AND_ACCESSORY",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
  // Determine the sort order based on the sort parameter
  type OrderByOption = Record<string, "asc" | "desc">;
  let orderBy: OrderByOption = { createdAt: "desc" };
  switch (sortOption) {
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "featured":
      orderBy = { isBestseller: "desc" };
      break;
    // Add other sort options as needed
  }

  // Get total count for pagination
  const totalItems = await prisma.product.count({
    where: {
      category: {
        type: type === "projects" ? "READY_MADE_PROJECT" : "PART_AND_ACCESSORY",
        slug: category || undefined,
      },
    },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  const products = await prisma.product.findMany({
    where: {
      category: {
        type: type === "projects" ? "READY_MADE_PROJECT" : "PART_AND_ACCESSORY",
        slug: category || undefined,
      },
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    skip,
    take: itemsPerPage,
    orderBy,
  });

  return (
    <div className="flex w-full flex-col items-center px-5 py-8">
      {/* Breadcrumbs */}
      <div className="text-muted-foreground mb-6 flex items-center text-sm">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <Link
          className={!category ? "text-foreground" : "text-muted-foreground"}
          href={`/category/${type}`}
        >
          {type === "projects"
            ? "Ready Made Projects"
            : "Parts and Accessories"}
        </Link>
        {category && (
          <>
            <ChevronRight className="mx-1 h-4 w-4" />
            <Link
              className="text-foreground"
              href={`/category/${type}/${category}`}
            >
              {categoryList.find((cat) => cat.slug === category)?.name}
            </Link>
          </>
        )}
      </div>

      {/* Header */}
      <div className="relative mb-8 h-[300px] overflow-hidden rounded-lg">
        <Image
          // TODO: Replace with dynamic image based on category
          src={
            "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          }
          alt={
            type === "projects"
              ? "Ready Made Projects"
              : "Parts and Accessories"
          }
          fill
          className="object-cover"
        />
        <div className="from-background/90 to-background/40 absolute inset-0 flex w-full items-center bg-gradient-to-r px-5">
          <div className="mx-auto w-full max-w-7xl px-5">
            <div className="max-w-2xl">
              <h1 className="mb-4 text-4xl font-bold">
                {type === "projects"
                  ? "Ready Made Projects"
                  : "Parts and Accessories"}
              </h1>
              <p className="text-muted-foreground text-lg">
                {
                  "Explore our collection of ready-made projects, perfect for hobbyists and professionals alike. From DIY electronics to robotics, find everything you need to kickstart your next project."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Categories (Desktop Only) */}
            <div className="max-lg:hidden">
              <h3 className="mb-3 font-medium">Categories</h3>
              <div className="space-y-1">
                {categoryList.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${type}/${cat.slug}`}
                    className={`hover:bg-muted flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                      cat.slug === category
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {cat.name} {` (${cat._count.products})`}
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories (Mobile Only) */}
            <div className="lg:hidden">
              <h3 className="mb-3 font-medium">Categories</h3>
              <Select defaultValue={category || "all"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <Link href={`/category/${type}`}>
                    <SelectItem value="all">All Categories</SelectItem>
                  </Link>
                  {categoryList.map((cat) => (
                    <Link key={cat.id} href={`/category/${type}/${cat.slug}`}>
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name} ({cat._count.products})
                      </SelectItem>
                    </Link>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Sorting and View Options */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>{" "}
              <p className="text-muted-foreground text-sm">
                Showing{" "}
                <span className="text-foreground font-medium">
                  {products.length}
                </span>{" "}
                of{" "}
                <span className="text-foreground font-medium">
                  {totalItems}
                </span>{" "}
                products
              </p>
            </div>{" "}
            <SortDropdown
              currentSort={sortOption}
              currentPage={currentPage}
              type={type}
              category={category}
            />
          </div>
          {/* Products */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden">
                <div className="relative overflow-hidden">
                  <AspectRatio ratio={1 / 1}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </AspectRatio>

                  {/* Product badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {/* New badge - 1 week */}
                    {product.createdAt <
                      new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) && (
                      <Badge className="bg-blue-600 hover:bg-blue-700">
                        New
                      </Badge>
                    )}
                    {product.isBestseller && (
                      <Badge className="bg-amber-600 hover:bg-amber-700">
                        Bestseller
                      </Badge>
                    )}
                    {/* {product.comparePrice && (
                      <Badge variant="secondary">Sale</Badge>
                    )} */}
                  </div>

                  {/* Quick action buttons */}
                  <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Add to wishlist</span>
                    </Button>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <div className="mb-1 flex items-center gap-1">
                    <span className="text-muted-foreground text-xs">
                      {product.category.name}
                    </span>
                  </div>
                  <Link
                    href={`/product/${product.slug}`}
                    className="hover:underline"
                  >
                    <h3 className="line-clamp-1 font-medium">{product.name}</h3>
                  </Link>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </CardContent>{" "}
                <CardFooter className="pt-0">
                  <ClientAddToCartButton product={product} />
                </CardFooter>
              </Card>
            ))}
          </div>
          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
              type={type}
              category={category}
              sortOption={sortOption}
            />
          )}
        </div>
      </div>
    </div>
  );
}
