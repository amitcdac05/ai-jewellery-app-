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

const ITEMS = [
  {
    file: "WhatsApp Image 2026-08-04 at 12.18.36 AM.jpeg",
    categoryName: "Bracelets",
    namePrefix: "Beaded Bracelet",
    codePrefix: "BRC",
  },
  {
    file: "WhatsApp Image 2026-08-04 at 12.18.36 AM (1).jpeg",
    categoryName: "Bracelets",
    namePrefix: "Beaded Bracelet",
    codePrefix: "BRC",
  },
  {
    file: "WhatsApp Image 2026-08-04 at 12.18.36 AM (2).jpeg",
    categoryName: "Anklets (Payal)",
    namePrefix: "Beaded Anklet",
    codePrefix: "ANK",
  },
  {
    file: "WhatsApp Image 2026-08-04 at 12.18.37 AM.jpeg",
    categoryName: "Stud Earrings",
    namePrefix: "Fashion Tops Stud Set",
    codePrefix: "STD",
  },
  {
    file: "WhatsApp Image 2026-08-04 at 12.18.37 AM (1).jpeg",
    categoryName: "Stud Earrings",
    namePrefix: "Fashion Tops Stud Set",
    codePrefix: "STD",
  },
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

async function nextNumberFor(codePrefix: string) {
  const existing = await prisma.product.findMany({
    where: { productCode: { startsWith: `${codePrefix}-` } },
    select: { productCode: true },
  });
  const maxN = existing.reduce((max, p) => {
    const n = parseInt(p.productCode.replace(`${codePrefix}-`, ""), 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return maxN + 1;
}

async function main() {
  const categoryCache = new Map<string, { id: string; name: string }>();
  const counters = new Map<string, number>();

  const results: { success: string[]; failed: { filename: string; error: string }[] } = {
    success: [],
    failed: [],
  };

  for (let i = 0; i < ITEMS.length; i++) {
    const item = ITEMS[i];
    const filePath = path.join(DOWNLOADS, item.file);

    try {
      if (!categoryCache.has(item.categoryName)) {
        const category = await prisma.category.findFirst({ where: { name: item.categoryName } });
        if (!category) throw new Error(`Category "${item.categoryName}" not found`);
        categoryCache.set(item.categoryName, category);
      }
      const category = categoryCache.get(item.categoryName)!;

      if (!counters.has(item.codePrefix)) {
        counters.set(item.codePrefix, await nextNumberFor(item.codePrefix));
      }
      const n = counters.get(item.codePrefix)!;
      counters.set(item.codePrefix, n + 1);

      const productCode = `${item.codePrefix}-${String(n).padStart(3, "0")}`;

      const already = await prisma.product.findUnique({ where: { productCode } });
      if (already) {
        console.log(`[${i + 1}/${ITEMS.length}] SKIP (already imported): ${item.file}`);
        results.success.push(item.file);
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

      const name = `${item.namePrefix} ${n}`;
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

      console.log(`[${i + 1}/${ITEMS.length}] OK: ${name} (${category.name}) <- ${item.file}`);
      results.success.push(item.file);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null
            ? JSON.stringify(err)
            : String(err);
      console.error(`[${i + 1}/${ITEMS.length}] FAILED: ${item.file} -- ${message}`);
      results.failed.push({ filename: item.file, error: message });
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
