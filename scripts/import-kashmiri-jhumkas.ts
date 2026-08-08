import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
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

const DOWNLOADS = "C:\\Users\\Hp\\Downloads";
const FILES = [
  "WhatsApp Image 2026-08-04 at 12.17.34 AM.jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.33 AM (3).jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.33 AM (2).jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.33 AM (1).jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.33 AM.jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.32 AM (2).jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.32 AM (1).jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.32 AM.jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.31 AM.jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.28 AM.jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.27 AM (1).jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.27 AM.jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.26 AM (1).jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.26 AM.jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.35 AM (1).jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.35 AM.jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.34 AM (2).jpeg",
  "WhatsApp Image 2026-08-04 at 12.17.34 AM (1).jpeg",
];

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
  let category = await prisma.category.findUnique({ where: { slug: "kashmiri-jewellery" } });

  if (!category) {
    const firstFile = fs.readFileSync(path.join(DOWNLOADS, FILES[0]));
    const dataUri = `data:image/jpeg;base64,${firstFile.toString("base64")}`;
    const categoryUpload = await cloudinary.uploader.upload(dataUri, {
      folder: "ai-jewellery/categories",
      resource_type: "image",
    });
    category = await prisma.category.create({
      data: {
        name: "Kashmiri Jewellery",
        slug: "kashmiri-jewellery",
        image: categoryUpload.secure_url,
        isActive: true,
      },
    });
    console.log(`Created category: ${category.name} (${category.id})`);
  } else {
    console.log(`Category already exists: ${category.name} (${category.id})`);
  }

  const existing = await prisma.product.findMany({
    where: { productCode: { startsWith: "KSH-" } },
    select: { productCode: true },
  });
  const maxN = existing.reduce((max, p) => {
    const n = parseInt(p.productCode.replace("KSH-", ""), 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);

  console.log(`Highest existing KSH number: ${maxN}. Starting new batch at ${maxN + 1}.`);
  console.log(`Importing ${FILES.length} files...`);

  const results: { success: string[]; failed: { filename: string; error: string }[] } = {
    success: [],
    failed: [],
  };

  for (let i = 0; i < FILES.length; i++) {
    const filename = FILES[i];
    const n = maxN + 1 + i;
    const filePath = path.join(DOWNLOADS, filename);
    const productCode = `KSH-${String(n).padStart(3, "0")}`;

    try {
      const already = await prisma.product.findUnique({ where: { productCode } });
      if (already) {
        console.log(`[${i + 1}/${FILES.length}] SKIP (already imported): ${filename}`);
        results.success.push(filename);
        continue;
      }

      if (!fs.existsSync(filePath)) {
        throw new Error("file not found");
      }

      const buffer = fs.readFileSync(filePath);
      const dataUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;
      const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: "ai-jewellery/products",
        resource_type: "image",
      });

      const name = `Kashmiri Jhumka ${n}`;
      const slug = await uniqueSlugFor(slugify(name));

      await prisma.product.create({
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
            create: [{ url: uploaded.secure_url, publicId: uploaded.public_id, order: 0 }],
          },
        },
      });

      console.log(`[${i + 1}/${FILES.length}] OK: ${name} <- ${filename}`);
      results.success.push(filename);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null
            ? JSON.stringify(err)
            : String(err);
      console.error(`[${i + 1}/${FILES.length}] FAILED: ${filename} -- ${message}`);
      results.failed.push({ filename, error: message });
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log("Failed files:", JSON.stringify(results.failed, null, 2));
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Fatal error:", err);
  await prisma.$disconnect();
  process.exit(1);
});
