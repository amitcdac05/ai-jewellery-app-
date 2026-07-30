import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductGrid } from "@/components/shared/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { getActiveCategories, getCategoryBySlug } from "@/services/categories";
import { getProductsByCategory, getPriceRange } from "@/services/product-queries";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
    trending?: string;
    newArrival?: string;
    sort?: string;
    q?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: `Browse our ${category.name} collection - handcrafted artificial jewellery.`,
  };
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category || !category.isActive) {
    notFound();
  }

  const [products, categories, priceRange] = await Promise.all([
    getProductsByCategory(slug, {
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      featured: sp.featured === "true",
      trending: sp.trending === "true",
      newArrival: sp.newArrival === "true",
      q: sp.q,
      sort: sp.sort === "price-asc" || sp.sort === "price-desc" ? sp.sort : "latest",
    }),
    getActiveCategories(),
    getPriceRange(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Category"
        title={category.name}
        description={`Handpicked ${category.name.toLowerCase()} pieces from our collection.`}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Suspense fallback={null}>
            <ProductFilters
              categories={categories}
              showCategoryFilter={false}
              minPrice={Math.floor(priceRange.min)}
              maxPrice={Math.ceil(priceRange.max) || 500000}
            />
          </Suspense>
        </aside>
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
          <ProductGrid products={products} emptyMessage={`No products in ${category.name} yet.`} />
        </div>
      </div>
    </div>
  );
}
