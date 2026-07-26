import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

const listInclude = {
  category: true,
  images: { orderBy: { order: "asc" as const } },
};

export type ProductListItem = Prisma.ProductGetPayload<{ include: typeof listInclude }>;

export function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isHidden: false, isFeatured: true },
    include: listInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function getNewArrivals(limit = 8) {
  return prisma.product.findMany({
    where: { isHidden: false, isNewArrival: true },
    include: listInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function getTrendingProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isHidden: false, isTrending: true },
    include: listInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export interface ProductFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  q?: string;
  sort?: "latest" | "price-asc" | "price-desc";
}

function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isHidden: false };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }

  if (filters.featured) where.isFeatured = true;
  if (filters.trending) where.isTrending = true;
  if (filters.newArrival) where.isNewArrival = true;

  if (filters.q && filters.q.trim().length > 0) {
    const q = filters.q.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { material: { contains: q, mode: "insensitive" } },
      { color: { contains: q, mode: "insensitive" } },
      { category: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  return where;
}

function buildOrderBy(sort?: ProductFilters["sort"]): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export function getProducts(filters: ProductFilters = {}) {
  return prisma.product.findMany({
    where: buildWhere(filters),
    include: listInclude,
    orderBy: buildOrderBy(filters.sort),
  });
}

export function getProductsByCategory(slug: string, filters: Omit<ProductFilters, "categorySlug"> = {}) {
  return getProducts({ ...filters, categorySlug: slug });
}

export function searchProducts(query: string) {
  return getProducts({ q: query });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isHidden: false },
    include: listInclude,
  });
}

export async function getSimilarProducts(product: { id: string; categoryId: string }, limit = 4) {
  return prisma.product.findMany({
    where: {
      isHidden: false,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: listInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getPriceRange() {
  const result = await prisma.product.aggregate({
    where: { isHidden: false },
    _min: { price: true },
    _max: { price: true },
  });
  return { min: result._min.price ?? 0, max: result._max.price ?? 0 };
}
