import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isHidden: false },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
