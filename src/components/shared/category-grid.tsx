import Image from "next/image";
import Link from "next/link";
import { Gem } from "lucide-react";

export interface CategoryGridItem {
  slug: string;
  name: string;
  image: string | null;
}

export function CategoryGrid({
  categories,
  emptyMessage = "No categories yet.",
}: {
  categories: CategoryGridItem[];
  emptyMessage?: string;
}) {
  if (categories.length === 0) {
    return (
      <div className="card-luxury flex items-center justify-center py-16 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="card-luxury group flex flex-col items-center gap-3 p-5 text-center"
        >
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-luxury-gradient">
            {category.image ? (
              <Image src={category.image} alt={category.name} fill className="object-cover" />
            ) : (
              <Gem className="size-8 text-white" />
            )}
          </div>
          <span className="font-heading text-sm font-semibold text-foreground group-hover:text-primary sm:text-base">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
