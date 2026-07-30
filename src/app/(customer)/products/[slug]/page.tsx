import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle, CheckCircle2, XCircle, Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/products/product-gallery";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductGrid } from "@/components/shared/product-grid";
import { getProductBySlug, getSimilarProducts } from "@/services/product-queries";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const image = product.images[0]?.url;
  const description =
    product.description ??
    (product.hidePrice
      ? `${product.name} - ${product.category.name} jewellery from AI Jewellery. Contact us for pricing.`
      : `${product.name} - ${product.category.name} jewellery from AI Jewellery. Priced at ${formatINR(product.offerPrice ?? product.price)}.`);

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product);
  const hasOffer = product.offerPrice != null && product.offerPrice < product.price;
  const discountPercent = hasOffer
    ? Math.round(((product.price - (product.offerPrice as number)) / product.price) * 100)
    : 0;
  const whatsappUrl = buildWhatsAppUrl({
    name: product.name,
    price: product.hidePrice ? undefined : hasOffer ? (product.offerPrice as number) : product.price,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href={`/categories/${product.category.slug}`} className="hover:text-primary">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-5">
          <div>
            <Badge variant="secondary">{product.category.name}</Badge>
            <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">{product.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Product Code: {product.productCode}</p>
          </div>

          <div className="flex items-baseline gap-3">
            {product.hidePrice ? (
              <span className="text-3xl font-bold text-gradient-gold">Contact for Price</span>
            ) : (
              <>
                <span className="text-3xl font-bold text-gradient-gold">
                  {formatINR(hasOffer ? (product.offerPrice as number) : product.price)}
                </span>
                {hasOffer && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">{formatINR(product.price)}</span>
                    <Badge variant="destructive">{discountPercent}% OFF</Badge>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm font-medium">
            {product.inStock ? (
              <>
                <CheckCircle2 className="size-4 text-green-600" />
                <span className="text-green-700">In Stock</span>
              </>
            ) : (
              <>
                <XCircle className="size-4 text-destructive" />
                <span className="text-destructive">Out of Stock</span>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          <div className="card-luxury grid grid-cols-2 gap-4 p-5 text-sm">
            <div>
              <p className="text-muted-foreground">Material</p>
              <p className="font-medium text-foreground">{product.material ?? "Not specified"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Color</p>
              <p className="font-medium text-foreground">{product.color ?? "Not specified"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium text-foreground">{product.category.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Product Code</p>
              <p className="font-medium text-foreground">{product.productCode}</p>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-luxury-gradient w-full text-white shadow-luxury hover:opacity-90"
            render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
          >
            <MessageCircle />
            Inquire on WhatsApp
          </Button>
        </div>
      </div>

      <section className="mt-20">
        <SectionHeading eyebrow="You May Also Like" title="Similar Products" />
        <div className="mt-10">
          {similarProducts.length === 0 ? (
            <div className="card-luxury flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Gem className="size-5" />
              No similar products found yet.
            </div>
          ) : (
            <ProductGrid products={similarProducts} />
          )}
        </div>
      </section>
    </div>
  );
}
