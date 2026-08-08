import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Testimonials } from "@/components/home/testimonials";
import { AboutSection, ContactSection } from "@/components/home/about-contact";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductGrid } from "@/components/shared/product-grid";
import { CategoryGrid } from "@/components/shared/category-grid";
import { getActiveCategories } from "@/services/categories";
import {
  getFeaturedProducts,
  getNewArrivals,
  getTrendingProducts,
  getProductsByCategorySlugLimited,
} from "@/services/product-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, newArrivals, trending, categories, korean] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getTrendingProducts(),
    getActiveCategories(),
    getProductsByCategorySlugLimited("korean-jewellery"),
  ]);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow="Handpicked" title="Featured Jewellery" description="Our most-loved pieces, chosen for their exceptional craftsmanship." />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-10">
          <ProductGrid products={featured} emptyMessage="No featured products yet. Check back soon." />
        </FadeIn>
        <div className="mt-8 flex justify-center">
          <Link href="/products?featured=true" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            View all featured <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading eyebrow="Just In" title="New Arrivals" description="Fresh designs added to our collection." />
          </FadeIn>
          <FadeIn delay={0.1} className="mt-10">
            <ProductGrid products={newArrivals} emptyMessage="No new arrivals yet. Check back soon." />
          </FadeIn>
          <div className="mt-8 flex justify-center">
            <Link href="/products?newArrival=true" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              View all new arrivals <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow="Popular Now" title="Trending Collection" description="What everyone's asking for right now." />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-10">
          <ProductGrid products={trending} emptyMessage="No trending products yet. Check back soon." />
        </FadeIn>
        <div className="mt-8 flex justify-center">
          <Link href="/products?trending=true" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            View all trending <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading eyebrow="Explore" title="Shop by Category" description="Find the perfect piece by browsing our curated categories." />
          </FadeIn>
          <FadeIn delay={0.1} className="mt-10">
            <CategoryGrid categories={categories} emptyMessage="No categories yet. Check back soon." />
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow="Trendy Picks" title="Korean Jewellery" description="Dainty, minimal designs inspired by Korean style." />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-10">
          <ProductGrid products={korean} emptyMessage="No Korean jewellery yet. Check back soon." />
        </FadeIn>
        <div className="mt-8 flex justify-center">
          <Link href="/categories/korean-jewellery" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            View all Korean jewellery <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading eyebrow="Testimonials" title="Customer Reviews" description="Loved by customers across the country." />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-10">
          <Testimonials />
        </FadeIn>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <AboutSection />
        </FadeIn>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <FadeIn>
          <ContactSection />
        </FadeIn>
      </section>
    </>
  );
}
