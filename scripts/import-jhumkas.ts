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
  "WhatsApp Image 2026-07-31 at 1.11.48 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.30 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.30 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.31 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.31 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.32 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.32 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.32 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.33 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.34 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.35 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.35 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.36 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.36 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.37 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.39 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.40 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.40 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.40 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.41 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.42 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.42 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.43 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.43 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.43 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.44 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.44 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.45 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.45 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.45 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.46 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.46 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.46 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.47 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.47 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.48 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.48 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.48 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.49 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.49 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.50 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.50 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.03.51 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.03 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.04 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.05 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.11 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.05 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.05 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.07 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.07 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.08 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.08 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.09.33 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.07 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.07 AM (3).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.08 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.08 AM (3).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.09 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.09 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.09 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.10 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.10 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.11 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.11 AM (2).jpeg",
  "WhatsApp Image 2026-07-31 at 1.04.11 AM (3).jpeg",
  "WhatsApp Image 2026-07-31 at 1.09.32 AM.jpeg",
  "WhatsApp Image 2026-07-31 at 1.09.32 AM (1).jpeg",
  "WhatsApp Image 2026-07-31 at 1.09.33 AM (1).jpeg",
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
  const category = await prisma.category.findUnique({ where: { slug: "jhumkas" } });
  if (!category) {
    throw new Error("Jhumkas category not found");
  }

  console.log(`Found category: ${category.name} (${category.id})`);
  console.log(`Importing ${FILES.length} files...`);

  const results: { success: string[]; failed: { filename: string; error: string }[] } = {
    success: [],
    failed: [],
  };

  for (let i = 0; i < FILES.length; i++) {
    const filename = FILES[i];
    const n = i + 1;
    const filePath = path.join(DOWNLOADS, filename);
    const productCode = `JHK-${String(n).padStart(3, "0")}`;

    try {
      const already = await prisma.product.findUnique({ where: { productCode } });
      if (already) {
        console.log(`[${n}/${FILES.length}] SKIP (already imported): ${filename}`);
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

      const name = `Jhumka Earrings ${n}`;
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
          isFeatured: true,
          isNewArrival: true,
          images: {
            create: [{ url: uploaded.secure_url, publicId: uploaded.public_id, order: 0 }],
          },
        },
      });

      console.log(`[${n}/${FILES.length}] OK: ${name} <- ${filename}`);
      results.success.push(filename);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null
            ? JSON.stringify(err)
            : String(err);
      console.error(`[${n}/${FILES.length}] FAILED: ${filename} -- ${message}`);
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
