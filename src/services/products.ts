import { prisma } from "@/lib/prisma";

export function getAllProductsForAdmin() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { orderBy: { order: "asc" } } },
  });
}

export function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true, images: { orderBy: { order: "asc" } } },
  });
}
