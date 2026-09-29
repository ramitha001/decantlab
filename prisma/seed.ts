import "dotenv/config";
import { PrismaClient, Gender, ProductType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const demoProducts = [
  {
    brand: "Maison Margiela",
    name: "REPLICA Jazz Club",
    slug: "maison-margiela-replica-jazz-club",
    type: ProductType.FULL_BOTTLE,
    gender: Gender.UNISEX,
    family: "Woody",
    description: "A warm, smoky composition inspired by the intimate atmosphere of a Brooklyn jazz club.",
    topNotes: ["Pink Pepper", "Neroli"],
    middleNotes: ["Rum", "Clary Sage"],
    baseNotes: ["Tobacco Leaf", "Vanilla"],
    featured: true,
    published: true,
    sizes: [{ size: "100ml", sku: "MM-JC-100", price: "48500", stock: 8 }],
  },
  {
    brand: "Byredo",
    name: "Bal d’Afrique",
    slug: "byredo-bal-dafrique-decant",
    type: ProductType.DECANT,
    gender: Gender.UNISEX,
    family: "Citrus",
    description: "A vibrant, joyful fragrance where neroli and African marigold meet warm woods.",
    topNotes: ["Bergamot", "Lemon"],
    middleNotes: ["Violet", "Jasmine"],
    baseNotes: ["Cedar", "Musk"],
    featured: true,
    published: true,
    sizes: [
      { size: "2ml", sku: "BY-BDA-D2", price: "2200", stock: 20 },
      { size: "5ml", sku: "BY-BDA-D5", price: "4800", stock: 15 },
      { size: "10ml", sku: "BY-BDA-D10", price: "8500", stock: 10 },
    ],
  },
];

async function main() {
  for (const item of demoProducts) {
    const brand = await prisma.brand.upsert({ where: { name: item.brand }, update: {}, create: { name: item.brand, slug: item.brand.toLowerCase().replaceAll(" ", "-") } });
    const productData = {
      name: item.name,
      slug: item.slug,
      type: item.type,
      gender: item.gender,
      family: item.family,
      description: item.description,
      topNotes: item.topNotes,
      middleNotes: item.middleNotes,
      baseNotes: item.baseNotes,
      featured: item.featured,
      published: item.published,
    };
    const product = await prisma.product.upsert({ where: { slug: item.slug }, update: { published: true }, create: { ...productData, brandId: brand.id } });
    for (const variant of item.sizes) {
      await prisma.productVariant.upsert({ where: { sku: variant.sku }, update: variant, create: { ...variant, productId: product.id } });
    }
  }
  console.log(`Seeded ${demoProducts.length} demo products.`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());
