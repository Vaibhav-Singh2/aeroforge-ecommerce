import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronRight, Star } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { CategoryMobileSelect } from "@/components/ui/category-mobile-select";
import { Separator } from "@/components/ui/separator";
import { SortDropdown } from "@/components/ui/sort-dropdown";
import { PaginationControl } from "@/components/ui/pagination-control";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
};

type ProductItem = Prisma.ProductGetPayload<{
  include: {
    category: {
      select: {
        name: true;
        slug: true;
      };
    };
  };
}>;

// Server component
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: "projects" | "parts-and-accessories" }>;
  searchParams: Promise<{ page?: string; sort?: string; q?: string; rating?: string }>;
}) {
  const rawSlug = (await params).slug;
  let type = rawSlug[0];
  let category = rawSlug[1];

  const awaitedSearchParams = await searchParams;
  const currentPage = awaitedSearchParams.page
    ? parseInt(awaitedSearchParams.page)
    : 1;
  const itemsPerPage = 15;
  const sortOption = awaitedSearchParams.sort || "newest";
  const searchQuery = awaitedSearchParams.q || "";
  const ratingFilter = awaitedSearchParams.rating
    ? parseInt(awaitedSearchParams.rating)
    : 0;

  // Resolve aliases and direct category slugs
  if (type === "drones") {
    type = "projects";
  } else if (type === "planes") {
    type = "projects";
    category = category || "rc-planes";
  } else if (type === "accessories" || type === "parts") {
    type = "parts-and-accessories";
  } else if (type !== "projects" && type !== "parts-and-accessories") {
    const directCategory = await prisma.category.findUnique({
      where: { slug: type },
    });
    if (directCategory) {
      type =
        directCategory.type === "READY_MADE_PROJECT"
          ? "projects"
          : "parts-and-accessories";
      category = directCategory.slug;
    } else {
      notFound();
    }
  }

  const categoryList: CategoryItem[] = await prisma.category.findMany({
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
  }

  const whereClause: Prisma.ProductWhereInput = {
    category: {
      type: type === "projects" ? "READY_MADE_PROJECT" : "PART_AND_ACCESSORY",
      ...(category ? { slug: category } : {}),
    },
    ...(searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(ratingFilter > 0
      ? {
          reviews: {
            some: {
              rating: { gte: ratingFilter },
            },
          },
        }
      : {}),
  };

  // Get total count for pagination
  const totalItems = await prisma.product.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  const products: ProductItem[] = await prisma.product.findMany({
    where: whereClause,
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
      <div className="text-muted-foreground mx-auto mb-6 flex w-full items-center text-sm">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <Link className="hover:text-foreground" href={`/category/${type}`}>
          {type === "projects"
            ? "Ready Made Projects"
            : "Parts and Accessories"}
        </Link>
        {category ? (
          <>
            <ChevronRight className="mx-1 h-4 w-4" />
            <Link
              className="text-foreground"
              href={`/category/${type}/${category}`}
            >
              {
                categoryList.find((cat: CategoryItem) => cat.slug === category)
                  ?.name
              }
            </Link>
          </>
        ) : (
          <>
            <ChevronRight className="mx-1 h-4 w-4" />
            <span className="text-foreground">All</span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="bg-muted relative mb-8 h-48 w-full overflow-hidden rounded-lg sm:h-64 md:h-75">
        <Image
          src={
            "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          }
          alt={
            type === "projects"
              ? "Ready Made Projects"
              : "Parts and Accessories"
          }
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="from-background/90 to-background/40 absolute inset-0 flex min-h-24 w-full items-center bg-linear-to-r px-2 sm:min-h-0 sm:px-5">
          <div className="mx-auto w-full max-w-7xl px-2 sm:px-5">
            <div className="max-w-2xl py-4 sm:py-0">
              <h1 className="mb-2 text-2xl font-bold wrap-break-word sm:mb-4 sm:text-4xl">
                {type === "projects"
                  ? "Ready Made Projects"
                  : "Parts and Accessories"}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-lg">
                {
                  "Explore our collection of ready-made projects, perfect for hobbyists and professionals alike. From DIY electronics to robotics, find everything you need to kickstart your next project."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Categories (Desktop Only) */}
            <div className="max-lg:hidden">
              <h3 className="mb-3 font-medium">Categories</h3>
              <div className="space-y-1">
                <Link
                  href={`/category/${type}`}
                  className={`hover:bg-muted flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                    !category
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  All {` (${totalItems})`}
                </Link>
                {categoryList.map((cat: CategoryItem) => (
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

            {/* Customer Rating Filter */}
            <div className="max-lg:hidden pt-2">
              <h3 className="mb-2.5 font-medium text-sm">Customer Rating</h3>
              <div className="space-y-1">
                {[4, 3, 2].map((stars) => {
                  const isSelected = ratingFilter === stars;
                  const targetHref = `/category/${type}${category ? `/${category}` : ""}?sort=${sortOption}${isSelected ? "" : `&rating=${stars}`}${searchQuery ? `&q=${searchQuery}` : ""}`;
                  return (
                    <Link
                      key={stars}
                      href={targetHref}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < stars ? "fill-amber-400" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                        <span>& Up</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.2 rounded-full">
                          Active
                        </span>
                      )}
                    </Link>
                  );
                })}

                {ratingFilter > 0 && (
                  <Link
                    href={`/category/${type}${category ? `/${category}` : ""}?sort=${sortOption}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    className="text-[11px] text-primary hover:underline px-2 pt-1 inline-block font-medium"
                  >
                    Clear Rating Filter
                  </Link>
                )}
              </div>
            </div>

            {/* Categories (Mobile Only) */}
            <CategoryMobileSelect
              type={type}
              category={category}
              categoryList={categoryList}
              totalItems={totalItems}
            />
            <Separator />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Sorting and View Options */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
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

          {/* Search Box */}
          <div className="mb-8 w-full max-w-7xl">
            <form
              method="get"
              className="flex flex-col items-stretch gap-2 sm:flex-row"
              action=""
            >
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder={`Search in ${type === "projects" ? "Ready Made Projects" : "Parts and Accessories"}`}
                className="border-input bg-background focus:border-primary focus:ring-primary w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-1 focus:outline-none"
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium shadow focus:outline-none"
              >
                Search
              </button>
            </form>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: ProductItem) => (
              <ProductCard key={product.id} product={product} />
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
