import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedUser() {
  await prisma.user.create({
    data: {
      name: "Natthawut",
      email: "natthawut@gmail.com",
      password: "123456",
    },
  });
  console.log("User seeded successfully!");
}

async function seedProduct() {
  await prisma.product.createMany({
    data: [
      {
        name: "Notebook",
        description: "14 inch, Intel i5",
        price: 23900,
      },
      {
        name: "Wireless Mouse",
        description: "Ergonomic design",
        price: 590,
      },
    ],
    skipDuplicates: true,
  });
  console.log("Products seeded successfully!");
}

async function seedCategory() {
  await prisma.category.createMany({
    data: [
      { name: "Electronics" },
      { name: "ขนม" },
      { name: "น้ำ" },
      { name: "เครื่องดื่ม" },
      { name: "อุปกรณ์การเรียน" },
    ],
    skipDuplicates: true, // ป้องกันการเพิ่มซ้ำ
  });
  console.log("Categories seeded successfully!");
}

async function main() {

  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  await seedUser();
  await seedCategory();
  await seedProduct();

  console.log("All data seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
