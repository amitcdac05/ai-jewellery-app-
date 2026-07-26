"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProductImageAction } from "@/actions/products";

type ExistingImage = { id: string; url: string };

export function ImageUpload({ existingImages = [] }: { existingImages?: ExistingImage[] }) {
  const [images, setImages] = useState(existingImages);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileListRef = useRef<DataTransfer>(null);

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    setNewFiles((prev) => [...prev, ...arr]);
    setNewPreviews((prev) => [...prev, ...arr.map((f) => URL.createObjectURL(f))]);
  }

  function syncInput(files: File[]) {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    fileListRef.current = dt;
    if (inputRef.current) inputRef.current.files = dt.files;
  }

  function removeNewFile(index: number) {
    const files = newFiles.filter((_, i) => i !== index);
    setNewFiles(files);
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
    syncInput(files);
  }

  function moveExisting(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeExisting(id: string) {
    if (!confirm("Delete this image?")) return;
    startTransition(async () => {
      await deleteProductImageAction(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          isDragging ? "border-primary bg-accent/50" : "border-border"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="text-muted-foreground size-6" />
        <p className="text-muted-foreground text-sm">Drag & drop images here, or</p>
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Choose Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          name="images"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
          }}
        />
      </div>

      {images.length > 0 && (
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-medium">Existing images</p>
          <div className="flex flex-wrap gap-3">
            {images.map((img, index) => (
              <div key={img.id} className="relative size-24 overflow-hidden rounded-xl border">
                <Image src={img.url} alt="Product" fill className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/60 p-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveExisting(index, -1)}
                    className="text-white disabled:opacity-30"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => removeExisting(img.id)}
                    className="text-white"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() => moveExisting(index, 1)}
                    className="text-white disabled:opacity-30"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <input type="hidden" name="existingImageOrder" value={images.map((i) => i.id).join(",")} />
        </div>
      )}

      {newPreviews.length > 0 && (
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-medium">New images</p>
          <div className="flex flex-wrap gap-3">
            {newPreviews.map((src, index) => (
              <div key={src} className="relative size-24 overflow-hidden rounded-xl border">
                <Image src={src} alt="New upload" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewFile(index)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
