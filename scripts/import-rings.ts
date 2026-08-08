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
  "WhatsApp Image 2026-08-04 at 12.19.56 AM (1).jpeg",
  "WhatsApp Image 2026-08-04 at 12.19.56 AM.jpeg",
  "WhatsApp Image 2026-08-04 at 12.19.57 AM (2).jpeg",
  "WhatsApp Image 2026-08-04 at 12.19.57 AM (1).jpeg",
  "WhatsApp Image 2026-08-04 at 12.19.57 AM.jpeg",
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
  const category = await prisma.category.findFirst({ where: { name: "Rings" } });
  if (!category) throw new Error("Rings category not found");
  console.log(`Using category: ${category.name} (slug: ${category.slug})`);

  const existing = await prisma.product.findMany({
    where: { productCode: { startsWith: "RNG-" } },
    select: { productCode: true },
  });
  const maxN = existing.reduce((max, p) => {
    const n = parseInt(p.productCode.replace("RNG-", ""), 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);

  console.log(`Highest existing RNG number: ${maxN}. Starting new batch at ${maxN + 1}.`);
  console.log(`Importing ${FILES.length} files...`);

  const results: { success: string[]; failed: { filename: string; error: string }[] } = {
    success: [],
    failed: [],
  };

  for (let i = 0; i < FILES.length; i++) {
    const filename = FILES[i];
    const n = maxN + 1 + i;
    const filePath = path.join(DOWNLOADS, filename);
    const productCode = `RNG-${String(n).padStart(3, "0")}`;

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

      const name = `Ring Design ${n}`;
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
