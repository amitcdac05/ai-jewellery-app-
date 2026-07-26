import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { CategoryGrid } from "@/components/shared/category-grid";
import { getActiveCategories } from "@/services/categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all jewellery categories - rings, necklaces, earrings, bangles and more.",
};

export default async function CategoriesPage() {
  const categories = await getActiveCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Explore" title="Shop by Category" description="Browse our full range of jewellery categories." />
      <div className="mt-10">
        <CategoryGrid categories={categories} emptyMessage="No categories available yet." />
      </div>
    </div>
  );
}
