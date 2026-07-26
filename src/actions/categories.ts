"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/session";

export type CategoryFormState = { error?: string };

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

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const imageFile = formData.get("image") as File | null;

  if (!name) return { error: "Category name is required." };

  const slug = slugify(name);
  const existing = await prisma.category.findFirst({ where: { OR: [{ name }, { slug }] } });
  if (existing) return { error: "A category with this name already exists." };

  let image: string | undefined;
  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const dataUri = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    const uploaded = await uploadImage(dataUri, "ai-jewellery/categories");
    image = uploaded.url;
  }

  await prisma.category.create({ data: { name, slug, image } });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/categories");
  return {};
}

export async function updateCategoryAction(
  categoryId: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const imageFile = formData.get("image") as File | null;
  if (!name) return { error: "Category name is required." };

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return { error: "Category not found." };

  const slug = slugify(name);
  const duplicate = await prisma.category.findFirst({
    where: { AND: [{ OR: [{ name }, { slug }] }, { NOT: { id: categoryId } }] },
  });
  if (duplicate) return { error: "A category with this name already exists." };

  let image = category.image;
  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const dataUri = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    const uploaded = await uploadImage(dataUri, "ai-jewellery/categories");
    image = uploaded.url;
  }

  await prisma.category.update({ where: { id: categoryId }, data: { name, slug, image } });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/categories");
  return {};
}

export async function deleteCategoryAction(categoryId: string) {
  await requireAdmin();

  const productCount = await prisma.product.count({ where: { categoryId } });
  if (productCount > 0) {
    throw new Error("Cannot delete a category that still has products.");
  }

  await prisma.category.delete({ where: { id: categoryId } });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/categories");
}

export async function toggleCategoryStatusAction(categoryId: string, isActive: boolean) {
  await requireAdmin();

  await prisma.category.update({ where: { id: categoryId }, data: { isActive } });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/categories");
}
