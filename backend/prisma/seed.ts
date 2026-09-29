import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tea = await prisma.category.upsert({
    where: { name: "Tea" },
    update: {},
    create: {
      name: "Tea",
    },
  });

  const snacks = await prisma.category.upsert({
    where: { name: "Snacks" },
    update: {},
    create: {
      name: "Snacks",
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Masala Tea",
        price: 30,
        categoryId: tea.id,
      },
      {
        name: "Ginger Tea",
        price: 35,
        categoryId: tea.id,
      },
      {
        name: "Bun Maska",
        price: 50,
        categoryId: snacks.id,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });