import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveCategories } from "@/services/categories";
import { getProductById } from "@/services/products";
import { ProductForm } from "@/features/admin/products/product-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Product | AI Jewellery Admin",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, product] = await Promise.all([getActiveCategories(), getProductById(id)]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="text-muted-foreground text-sm">Update product details</p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
