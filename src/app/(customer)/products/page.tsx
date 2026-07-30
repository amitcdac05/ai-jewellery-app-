import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductGrid } from "@/components/shared/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { getActiveCategories } from "@/services/categories";
import { getProducts, getPriceRange } from "@/services/product-queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our full collection of artificial jewellery.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
    trending?: string;
    newArrival?: string;
    sort?: string;
    q?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const [products, categories, priceRange] = await Promise.all([
    getProducts({
      categorySlug: params.category,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      featured: params.featured === "true",
      trending: params.trending === "true",
      newArrival: params.newArrival === "true",
      q: params.q,
      sort: params.sort === "price-asc" || params.sort === "price-desc" ? params.sort : "latest",
    }),
    getActiveCategories(),
    getPriceRange(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="All Products"
        title={params.q ? `Search results for "${params.q}"` : "Our Jewellery Collection"}
        description="Explore every piece in our collection, filtered exactly the way you like."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Suspense fallback={null}>
            <ProductFilters
              categories={categories}
              minPrice={Math.floor(priceRange.min)}
              maxPrice={Math.ceil(priceRange.max) || 500000}
            />
          </Suspense>
        </aside>
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
          <ProductGrid products={products} emptyMessage="No products match your filters. Try adjusting them." />
        </div>
      </div>
    </div>
  );
}
