import type { Metadata } from "next";
import Image from "next/image";
import { getAllCategories } from "@/services/categories";
import { CategoryFormDialog } from "@/features/admin/categories/category-form-dialog";
import { CategoryStatusToggle, CategoryDeleteButton } from "@/features/admin/categories/category-row-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories | AI Jewellery Admin",
};

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-muted-foreground text-sm">Manage your jewellery categories</p>
        </div>
        <CategoryFormDialog />
      </div>

      <div className="card-luxury overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-muted-foreground p-6 text-sm">No categories yet. Add your first one.</p>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-4 p-4">
                <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-xl">
                  {category.image && (
                    <Image src={category.image} alt={category.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{category.name}</p>
                  <p className="text-muted-foreground text-xs">{category._count.products} products</p>
                </div>
                <CategoryStatusToggle categoryId={category.id} isActive={category.isActive} />
                <CategoryFormDialog category={category} />
                <CategoryDeleteButton categoryId={category.id} disabled={category._count.products > 0} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
