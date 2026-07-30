import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const codes = ["JHK-023", "JHK-035", "JHK-040", "JHK-055", "JHK-060", "JHK-069"];
  const products = await prisma.product.findMany({
    where: { productCode: { in: codes } },
    include: { images: true },
  });
  products.forEach((p) => console.log(p.productCode, p.images[0]?.url));
  await prisma.$disconnect();
}

main();
