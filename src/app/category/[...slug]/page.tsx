import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

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
import prisma from "@/lib/prisma";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: "projects" | "parts-and-accessories" }>;
}) {
  const [type, category] = (await params).slug;

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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container px-5 py-8">
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
        <div className="from-background/90 to-background/40 absolute inset-0 flex items-center bg-gradient-to-r px-5">
          <div className="container">
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
                    {cat.name}
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
                        {cat.name}
                      </SelectItem>
                    </Link>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* <div>
              <h3 className="mb-3 font-medium">Price Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full rounded-md border px-3 py-1 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full rounded-md border px-3 py-1 text-sm"
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 font-medium">Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                  >
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground fill-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">& Up</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 font-medium">Availability</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">In Stock</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">On Sale</span>
                </label>
              </div>
            </div> */}
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
              </Button>
              <p className="text-muted-foreground text-sm">
                Showing <span className="text-foreground font-medium">20</span>{" "}
                of <span className="text-foreground font-medium">48</span>{" "}
                products
              </p>
            </div>

            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Best Rating</SelectItem>
              </SelectContent>
            </Select>
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
                  <Link href={product.slug} className="hover:underline">
                    <h3 className="line-clamp-1 font-medium">{product.name}</h3>
                  </Link>
                  {/* <div className="mt-1 flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground fill-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-xs">
                      ({product.reviewCount})
                    </span>
                  </div> */}
                  <div className="mt-2 flex items-end gap-2">
                    <span className="font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                    {/* {product.comparePrice && (
                      <span className="text-muted-foreground text-sm line-through">
                        ${product.comparePrice.toFixed(2)}
                      </span>
                    )} */}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button size="sm" className="w-full gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex gap-1">
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                4
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
