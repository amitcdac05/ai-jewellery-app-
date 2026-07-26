import type { Metadata } from "next";
import Image from "next/image";
import { Package, FolderTree, Sparkles } from "lucide-react";
import { getDashboardStats } from "@/services/dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | AI Jewellery Admin",
};

export default async function AdminDashboardPage() {
  const { totalProducts, totalCategories, recentProducts } = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your jewellery catalog</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card-luxury flex items-center gap-4 p-6">
          <div className="bg-luxury-gradient flex size-12 items-center justify-center rounded-2xl">
            <Package className="size-6 text-white" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Products</p>
            <p className="text-2xl font-semibold">{totalProducts}</p>
          </div>
        </div>
        <div className="card-luxury flex items-center gap-4 p-6">
          <div className="bg-luxury-gradient flex size-12 items-center justify-center rounded-2xl">
            <FolderTree className="size-6 text-white" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Categories</p>
            <p className="text-2xl font-semibold">{totalCategories}</p>
          </div>
        </div>
        <div className="card-luxury flex items-center gap-4 p-6">
          <div className="bg-luxury-gradient flex size-12 items-center justify-center rounded-2xl">
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Recently Added</p>
            <p className="text-2xl font-semibold">{recentProducts.length}</p>
          </div>
        </div>
      </div>

      <div className="card-luxury p-6">
        <h2 className="mb-4 text-lg font-semibold">Recently Added Products</h2>
        {recentProducts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No products added yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 py-3">
                <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-xl">
                  {product.images[0] && (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-muted-foreground text-xs">{product.category.name}</p>
                </div>
                <p className="font-semibold">₹{product.offerPrice ?? product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
