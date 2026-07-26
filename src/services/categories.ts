import { prisma } from "@/lib/prisma";

export function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
}

export function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
