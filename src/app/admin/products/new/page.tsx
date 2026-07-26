import type { Metadata } from "next";
import { getActiveCategories } from "@/services/categories";
import { ProductForm } from "@/features/admin/products/product-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Add Product | AI Jewellery Admin",
};

export default async function NewProductPage() {
  const categories = await getActiveCategories();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Product</h1>
        <p className="text-muted-foreground text-sm">Create a new jewellery product</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
