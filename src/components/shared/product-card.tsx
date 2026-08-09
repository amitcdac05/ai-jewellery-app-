import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export interface ProductCardData {
  slug: string;
  name: string;
  price: number;
  offerPrice: number | null;
  hidePrice: boolean;
  inStock: boolean;
  category: { name: string; slug: string };
  images: { url: string }[];
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductCard({ product, className }: { product: ProductCardData; className?: string }) {
  const image = product.images[0]?.url;
  const hasOffer = product.offerPrice != null && product.offerPrice < product.price;
  const discountPercent = hasOffer
    ? Math.round(((product.price - (product.offerPrice as number)) / product.price) * 100)
    : 0;

  return (
    <div className={cn("card-luxury group flex flex-col overflow-hidden", className)}>
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
        <Badge className="absolute left-3 top-3 bg-white/90 text-foreground backdrop-blur">
          {product.category.name}
        </Badge>
        {hasOffer && (
          <Badge variant="destructive" className="absolute right-3 top-3">
            {discountPercent}% OFF
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <Link href={`/products/${product.slug}`}>
            <h3 className="line-clamp-1 font-heading text-base font-semibold text-foreground hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1.5 flex items-baseline gap-2">
            {product.hidePrice ? (
              <span className="text-lg font-bold text-gradient-gold">Contact for Price</span>
            ) : (
              <>
                <span className="text-lg font-bold text-gradient-gold">
                  {formatINR(hasOffer ? (product.offerPrice as number) : product.price)}
                </span>
                {hasOffer && (
                  <span className="text-sm text-muted-foreground line-through">{formatINR(product.price)}</span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="flex-1" render={<Link href={`/products/${product.slug}`} />} nativeButton={false}>
            View Details
          </Button>
          <Button
            size="icon-sm"
            className="bg-luxury-gradient shrink-0 text-white hover:opacity-90"
            nativeButton={false}
            render={
              <a
                href={buildWhatsAppUrl({
                  name: product.name,
                  price: product.hidePrice ? undefined : hasOffer ? (product.offerPrice as number) : product.price,
                  imageUrl: image,
                })}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Inquire about ${product.name} on WhatsApp`}
              />
            }
          >
            <MessageCircle />
          </Button>
        </div>
      </div>
    </div>
  );
}
