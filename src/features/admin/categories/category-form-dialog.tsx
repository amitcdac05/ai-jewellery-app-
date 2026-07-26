"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCategoryAction, updateCategoryAction, type CategoryFormState } from "@/actions/categories";

type Category = { id: string; name: string; image: string | null };

const initialState: CategoryFormState = {};

export function CategoryFormDialog({ category }: { category?: Category }) {
  const [open, setOpen] = useState(false);
  const action = category ? updateCategoryAction.bind(null, category.id) : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [preview, setPreview] = useState<string | null>(category?.image ?? null);

  useEffect(() => {
    if (!pending && !state.error && open) {
      setOpen(false);
    }
  }, [pending, state.error, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {category ? (
        <DialogTrigger render={<Button size="icon" variant="outline" className="rounded-full" />}>
          <Pencil className="size-4" />
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button className="bg-luxury-gradient rounded-xl" />}>
          <Plus className="size-4" />
          Add Category
        </DialogTrigger>
      )}
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={category?.name} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image">Category Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
            {preview && (
              <div className="relative mt-2 size-24 overflow-hidden rounded-xl border">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
          {state.error && <p className="text-destructive text-sm">{state.error}</p>}
          <Button type="submit" disabled={pending} className="bg-luxury-gradient rounded-xl">
            {pending ? "Saving..." : "Save Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
