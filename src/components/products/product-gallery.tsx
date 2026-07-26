"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  productName,
}: {
  images: { url: string }[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images.length > 0;
  const activeImage = hasImages ? images[activeIndex]?.url : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="card-luxury relative aspect-square overflow-hidden">
        {activeImage ? (
          <Image
            src={activeImage}
            alt={productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:size-20",
                index === activeIndex ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${index + 1} of ${productName}`}
              aria-current={index === activeIndex}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
