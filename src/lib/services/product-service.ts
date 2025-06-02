import prisma from "@/lib/prisma";
import { ProductType, ProductStatus, Prisma } from "@prisma/client";

export type ProductListOptions = {
  take?: number;
  skip?: number;
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "popularity";
  type?: ProductType;
  featured?: boolean;
  bestseller?: boolean;
};

export async function getProducts(options: ProductListOptions = {}) {
  const {
    take = 12,
    skip = 0,
    categoryId,
    categorySlug,
    search,
    minPrice,
    maxPrice,
    sort,
    type,
    featured,
    bestseller,
  } = options;
  // Build filter object
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.ACTIVE,
  };
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Handle category conditions
  let categoryConditions: Prisma.CategoryWhereInput | undefined;

  if (categorySlug) {
    categoryConditions = {
      ...categoryConditions,
      slug: categorySlug,
    };
  }

  if (type) {
    categoryConditions = {
      ...categoryConditions,
      type,
    };
  }

  if (categoryConditions) {
    where.category = categoryConditions;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }
  // Handle price filter
  let priceFilter: Prisma.FloatFilter | undefined;

  if (minPrice !== undefined) {
    priceFilter = {
      ...priceFilter,
      gte: minPrice,
    };
  }

  if (maxPrice !== undefined) {
    priceFilter = {
      ...priceFilter,
      lte: maxPrice,
    };
  }

  if (priceFilter) {
    where.price = priceFilter;
  }

  if (featured) {
    where.isFeature = true;
  }

  if (bestseller) {
    where.isBestseller = true;
  }
  // Build order object
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (sort === "popularity") {
    // For popularity, we'd ideally have a views counter or sales count
    // For now, let's use bestseller flag
    orderBy = { isBestseller: "desc" };
  }

  // Get total count for pagination
  const totalCount = await prisma.product.count({ where });

  // Execute query
  const products = await prisma.product.findMany({
    take,
    skip,
    where,
    orderBy,
    include: {
      category: true,
      variants: {
        take: 5, // Limit variants to reduce payload size
      },
      reviews: {
        take: 0,
        select: {
          id: true, // We just want to count them
        },
      },
    },
  });

  return {
    products,
    totalCount,
    pageCount: Math.ceil(totalCount / take),
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: true,
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return product;
}

export async function getFeaturedProducts(limit = 4) {
  return getProducts({
    take: limit,
    featured: true,
  });
}

export async function getBestsellerProducts(limit = 4) {
  return getProducts({
    take: limit,
    bestseller: true,
  });
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  return category;
}
