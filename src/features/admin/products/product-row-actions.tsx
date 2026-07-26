"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { deleteProductAction, toggleProductFlagAction } from "@/actions/products";

type ProductFlag = "isHidden" | "isFeatured" | "isNewArrival" | "isTrending";

export function ProductFlagToggle({
  productId,
  field,
  value,
}: {
  productId: string;
  field: ProductFlag;
  value: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={value}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startTransition(() => toggleProductFlagAction(productId, field, checked));
      }}
    />
  );
}

export function ProductEditButton({ productId }: { productId: string }) {
  const router = useRouter();

  return (
    <Button
      size="icon"
      variant="outline"
      className="rounded-full"
      onClick={() => router.push(`/admin/products/${productId}/edit`)}
    >
      <Pencil className="size-4" />
    </Button>
  );
}

export function ProductDeleteButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="icon"
      variant="outline"
      className="rounded-full"
      disabled={isPending}
      onClick={() => {
        if (confirm("Delete this product? This cannot be undone.")) {
          startTransition(() => deleteProductAction(productId));
        }
      }}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
