"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { deleteCategoryAction, toggleCategoryStatusAction } from "@/actions/categories";

export function CategoryStatusToggle({ categoryId, isActive }: { categoryId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={isActive}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startTransition(() => toggleCategoryStatusAction(categoryId, checked));
      }}
    />
  );
}

export function CategoryDeleteButton({ categoryId, disabled }: { categoryId: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="icon"
      variant="outline"
      className="rounded-full"
      disabled={disabled || isPending}
      title={disabled ? "Remove products from this category first" : "Delete category"}
      onClick={() => {
        if (confirm("Delete this category? This cannot be undone.")) {
          startTransition(() => deleteCategoryAction(categoryId));
        }
      }}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
