import "dotenv/config";
import fs from "node:fs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const FILE_PATH = "C:\\Users\\Hp\\Downloads\\WhatsApp Image 2026-07-31 at 2.17.56 PM (2).jpeg";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlugFor(base: string) {
  let slug = base;
  let suffix = 1;
  while (await prisma.product.findFirst({ where: { slug } })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

async function main() {
  let category = await prisma.category.findUnique({ where: { slug: "mangalsutra" } });

  const buffer = fs.readFileSync(FILE_PATH);
  const dataUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;

  if (!category) {
    const categoryUpload = await cloudinary.uploader.upload(dataUri, {
      folder: "ai-jewellery/categories",
      resource_type: "image",
    });
    category = await prisma.category.create({
      data: {
        name: "Mangalsutra",
        slug: "mangalsutra",
        image: categoryUpload.secure_url,
        isActive: true,
      },
    });
    console.log(`Created category: ${category.name} (${category.id})`);
  } else {
    console.log(`Category already exists: ${category.name} (${category.id})`);
  }

  const productUpload = await cloudinary.uploader.upload(dataUri, {
    folder: "ai-jewellery/products",
    resource_type: "image",
  });

  const name = "Mangalsutra Pendant Necklace";
  const slug = await uniqueSlugFor(slugify(name));
  const productCode = "MNG-001";

  const existingProduct = await prisma.product.findUnique({ where: { productCode } });
  if (existingProduct) {
    console.log(`Product already exists with code ${productCode}, skipping creation.`);
  } else {
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: 1,
        hidePrice: true,
        productCode,
        categoryId: category.id,
        inStock: true,
        isFeatured: false,
        isNewArrival: true,
        isTrending: false,
        images: {
          create: [{ url: productUpload.secure_url, publicId: productUpload.public_id, order: 0 }],
        },
      },
    });
    console.log(`Created product: ${product.name} (${product.slug})`);
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Fatal error:", err);
  await prisma.$disconnect();
  process.exit(1);
});
