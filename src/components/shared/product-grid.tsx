import { ProductCard, type ProductCardData } from "@/components/shared/product-card";

export function ProductGrid({
  products,
  emptyMessage = "No products yet.",
}: {
  products: ProductCardData[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="card-luxury flex items-center justify-center py-16 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
