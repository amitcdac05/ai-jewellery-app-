import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalProducts, totalCategories, recentProducts] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true, images: { orderBy: { order: "asc" }, take: 1 } },
    }),
  ]);

  return { totalProducts, totalCategories, recentProducts };
}
