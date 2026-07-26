import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllProductsForAdmin } from "@/services/products";
import {
  ProductFlagToggle,
  ProductEditButton,
  ProductDeleteButton,
} from "@/features/admin/products/product-row-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products | AI Jewellery Admin",
};

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your jewellery products</p>
        </div>
        <Button render={<Link href="/admin/products/new" />} nativeButton={false} className="bg-luxury-gradient rounded-xl">
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      <div className="card-luxury overflow-hidden">
        {products.length === 0 ? (
          <p className="text-muted-foreground p-6 text-sm">No products yet. Add your first one.</p>
        ) : (
          <div className="divide-y divide-border">
            {products.map((product) => (
              <div key={product.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-xl">
                  {product.images[0] && (
                    <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                  )}
                </div>
                <div className="min-w-40 flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {product.category.name} · {product.productCode}
                  </p>
                </div>
                <div className="w-24 shrink-0">
                  <p className="text-sm font-medium">₹{product.price}</p>
                  {product.offerPrice != null && (
                    <p className="text-muted-foreground text-xs line-through">₹{product.offerPrice}</p>
                  )}
                </div>
                {!product.inStock && (
                  <Badge variant="destructive" className="shrink-0">
                    Out of stock
                  </Badge>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5">
                    <ProductFlagToggle productId={product.id} field="isFeatured" value={product.isFeatured} />
                    Featured
                  </label>
                  <label className="flex items-center gap-1.5">
                    <ProductFlagToggle productId={product.id} field="isNewArrival" value={product.isNewArrival} />
                    New
                  </label>
                  <label className="flex items-center gap-1.5">
                    <ProductFlagToggle productId={product.id} field="isTrending" value={product.isTrending} />
                    Trending
                  </label>
                  <label className="flex items-center gap-1.5">
                    <ProductFlagToggle productId={product.id} field="isHidden" value={product.isHidden} />
                    Hidden
                  </label>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <ProductEditButton productId={product.id} />
                  <ProductDeleteButton productId={product.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
