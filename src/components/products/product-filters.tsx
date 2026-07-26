"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ProductFiltersCategoryOption {
  slug: string;
  name: string;
}

const TOGGLES: { key: "featured" | "trending" | "newArrival"; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "trending", label: "Trending" },
  { key: "newArrival", label: "New Arrival" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function ProductFilters({
  categories,
  showCategoryFilter = true,
  minPrice = 0,
  maxPrice = 500000,
}: {
  categories: ProductFiltersCategoryOption[];
  showCategoryFilter?: boolean;
  minPrice?: number;
  maxPrice?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "latest";
  const currentMin = searchParams.get("minPrice") ?? "";
  const currentMax = searchParams.get("maxPrice") ?? "";

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`${pathname}?${params.toString()}`);
  }

  function setParam(key: string, value: string | null) {
    updateParams((params) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
  }

  function toggleFlag(key: string) {
    const isActive = searchParams.get(key) === "true";
    setParam(key, isActive ? null : "true");
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasActiveFilters =
    currentCategory || currentMin || currentMax || TOGGLES.some((t) => searchParams.get(t.key) === "true");

  return (
    <div className="card-luxury flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="size-4 text-primary" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary"
          >
            <X className="size-3.5" />
            Clear all
          </button>
        )}
      </div>

      {showCategoryFilter && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Category</Label>
          <Select
            value={currentCategory || "all"}
            onValueChange={(value) => setParam("category", value === "all" ? null : String(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Sort By</Label>
        <Select value={currentSort} onValueChange={(value) => setParam("sort", value === "latest" ? null : String(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Latest" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">
          Price Range (Rs {Number(currentMin || minPrice).toLocaleString("en-IN")} - Rs {Number(currentMax || maxPrice).toLocaleString("en-IN")})
        </Label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={Math.max(1, Math.round((maxPrice - minPrice) / 100))}
            value={currentMin || minPrice}
            onChange={(e) => setParam("minPrice", e.target.value)}
            className="w-full accent-primary"
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={Math.max(1, Math.round((maxPrice - minPrice) / 100))}
            value={currentMax || maxPrice}
            onChange={(e) => setParam("maxPrice", e.target.value)}
            className="w-full accent-primary"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {TOGGLES.map((toggle) => (
          <div key={toggle.key} className="flex items-center justify-between">
            <Label className="text-sm font-normal text-foreground">{toggle.label}</Label>
            <Switch
              checked={searchParams.get(toggle.key) === "true"}
              onCheckedChange={() => toggleFlag(toggle.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
