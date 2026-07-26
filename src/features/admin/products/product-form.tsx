"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/features/admin/products/image-upload";
import { createProductAction, updateProductAction, type ProductFormState } from "@/actions/products";

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  offerPrice: number | null;
  material: string | null;
  color: string | null;
  productCode: string;
  categoryId: string;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
  images: { id: string; url: string }[];
};

const initialState: ProductFormState = {};

export function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const action = product ? updateProductAction.bind(null, product.id) : createProductAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (!pending && !state.error && state !== initialState) {
      router.push("/admin/products");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, state]);

  return (
    <form action={formAction} className="card-luxury flex flex-col gap-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" defaultValue={product?.categoryId} required>
            <SelectTrigger id="categoryId" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={product?.description ?? ""} rows={4} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="offerPrice">Offer Price</Label>
          <Input
            id="offerPrice"
            name="offerPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.offerPrice ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="material">Material</Label>
          <Input id="material" name="material" defaultValue={product?.material ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" defaultValue={product?.color ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:w-1/2">
        <Label htmlFor="productCode">Product Code</Label>
        <Input id="productCode" name="productCode" defaultValue={product?.productCode} required />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <Switch name="inStock" defaultChecked={product?.inStock ?? true} />
          <span className="text-sm font-medium">In Stock</span>
        </label>
        <label className="flex items-center gap-2">
          <Switch name="isFeatured" defaultChecked={product?.isFeatured} />
          <span className="text-sm font-medium">Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <Switch name="isNewArrival" defaultChecked={product?.isNewArrival} />
          <span className="text-sm font-medium">New Arrival</span>
        </label>
        <label className="flex items-center gap-2">
          <Switch name="isTrending" defaultChecked={product?.isTrending} />
          <span className="text-sm font-medium">Trending</span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Images</Label>
        <ImageUpload existingImages={product?.images} />
      </div>

      {state.error && <p className="text-destructive text-sm">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="bg-luxury-gradient rounded-xl">
          {pending ? "Saving..." : product ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" className="rounded-xl" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
