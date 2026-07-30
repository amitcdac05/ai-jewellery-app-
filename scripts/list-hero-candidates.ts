import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany({
    where: { productCode: { in: ["JHK-001", "JHK-005", "JHK-010", "JHK-020", "JHK-030", "JHK-044", "JHK-050"] } },
    include: { images: true },
  });
  products.forEach((p) => console.log(p.productCode, p.images[0]?.url));
  await prisma.$disconnect();
}

main();
