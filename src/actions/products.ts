"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/session";

export type ProductFormState = { error?: string };

type ProductFlag = "isHidden" | "isFeatured" | "isNewArrival" | "isTrending";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
}

function revalidateProductPaths() {
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/products");
}

async function uniqueSlugFor(name: string, excludeId?: string) {
  const base = slugify(name);
  let slug = base;
  let suffix = 1;
  while (
    await prisma.product.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    })
  ) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceRaw = String(formData.get("price") || "");
  const offerPriceRaw = String(formData.get("offerPrice") || "");
  const material = String(formData.get("material") || "").trim();
  const color = String(formData.get("color") || "").trim();
  const productCode = String(formData.get("productCode") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();

  return {
    name,
    description: description || undefined,
    price: priceRaw ? Number(priceRaw) : NaN,
    offerPrice: offerPriceRaw ? Number(offerPriceRaw) : undefined,
    material: material || undefined,
    color: color || undefined,
    productCode,
    categoryId,
    inStock: formData.get("inStock") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isNewArrival: formData.get("isNewArrival") === "on",
    isTrending: formData.get("isTrending") === "on",
    hidePrice: formData.get("hidePrice") === "on",
  };
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const fields = readProductFields(formData);

  if (!fields.name) return { error: "Product name is required." };
  if (!fields.categoryId) return { error: "Category is required." };
  if (!fields.productCode) return { error: "Product code is required." };
  if (!Number.isFinite(fields.price)) return { error: "A valid price is required." };

  const existingCode = await prisma.product.findUnique({ where: { productCode: fields.productCode } });
  if (existingCode) return { error: "A product with this product code already exists." };

  const slug = await uniqueSlugFor(fields.name);

  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded = await Promise.all(
    imageFiles.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
      return uploadImage(dataUri, "ai-jewellery/products");
    })
  );

  await prisma.product.create({
    data: {
      name: fields.name,
      slug,
      description: fields.description,
      price: fields.price,
      offerPrice: fields.offerPrice,
      material: fields.material,
      color: fields.color,
      productCode: fields.productCode,
      categoryId: fields.categoryId,
      inStock: fields.inStock,
      isFeatured: fields.isFeatured,
      isNewArrival: fields.isNewArrival,
      isTrending: fields.isTrending,
      hidePrice: fields.hidePrice,
      images: {
        create: uploaded.map((img, index) => ({ url: img.url, publicId: img.publicId, order: index })),
      },
    },
  });

  revalidateProductPaths();
  return {};
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id: productId }, include: { images: true } });
  if (!product) return { error: "Product not found." };

  const fields = readProductFields(formData);

  if (!fields.name) return { error: "Product name is required." };
  if (!fields.categoryId) return { error: "Category is required." };
  if (!fields.productCode) return { error: "Product code is required." };
  if (!Number.isFinite(fields.price)) return { error: "A valid price is required." };

  const duplicateCode = await prisma.product.findFirst({
    where: { productCode: fields.productCode, NOT: { id: productId } },
  });
  if (duplicateCode) return { error: "A product with this product code already exists." };

  const slug =
    fields.name === product.name ? product.slug : await uniqueSlugFor(fields.name, productId);

  const imageFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded = await Promise.all(
    imageFiles.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
      return uploadImage(dataUri, "ai-jewellery/products");
    })
  );

  const existingOrderRaw = String(formData.get("existingImageOrder") || "");
  const existingImageOrder = existingOrderRaw ? existingOrderRaw.split(",").filter(Boolean) : null;
  const existingImageCount = existingImageOrder?.length ?? product.images.length;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: fields.name,
      slug,
      description: fields.description,
      price: fields.price,
      offerPrice: fields.offerPrice,
      material: fields.material,
      color: fields.color,
      productCode: fields.productCode,
      categoryId: fields.categoryId,
      inStock: fields.inStock,
      isFeatured: fields.isFeatured,
      isNewArrival: fields.isNewArrival,
      isTrending: fields.isTrending,
      hidePrice: fields.hidePrice,
      images: {
        create: uploaded.map((img, index) => ({
          url: img.url,
          publicId: img.publicId,
          order: existingImageCount + index,
        })),
      },
    },
  });

  if (existingImageOrder) {
    await Promise.all(
      existingImageOrder.map((id, index) =>
        prisma.productImage.update({ where: { id, productId }, data: { order: index } })
      )
    );
  }

  revalidateProductPaths();
  return {};
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id: productId }, include: { images: true } });
  if (!product) return;

  for (const image of product.images) {
    try {
      await deleteImage(image.publicId);
    } catch {
      // best-effort cleanup, ignore failures
    }
  }

  await prisma.product.delete({ where: { id: productId } });

  revalidateProductPaths();
}

export async function deleteProductImageAction(imageId: string) {
  await requireAdmin();

  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return;

  try {
    await deleteImage(image.publicId);
  } catch {
    // best-effort cleanup, ignore failures
  }

  await prisma.productImage.delete({ where: { id: imageId } });

  const remaining = await prisma.productImage.findMany({
    where: { productId: image.productId },
    orderBy: { order: "asc" },
  });
  await Promise.all(
    remaining.map((img, index) =>
      img.order === index
        ? Promise.resolve()
        : prisma.productImage.update({ where: { id: img.id }, data: { order: index } })
    )
  );

  revalidateProductPaths();
}

export async function reorderProductImagesAction(productId: string, orderedImageIds: string[]) {
  await requireAdmin();

  await Promise.all(
    orderedImageIds.map((id, index) =>
      prisma.productImage.update({ where: { id, productId }, data: { order: index } })
    )
  );

  revalidateProductPaths();
}

export async function toggleProductFlagAction(productId: string, field: ProductFlag, value: boolean) {
  await requireAdmin();

  await prisma.product.update({ where: { id: productId }, data: { [field]: value } });

  revalidateProductPaths();
}
