/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1) สร้างหมวดหมู่ก่อน (มีอยู่แล้วก็ข้าม)
  const categoryNames = ['อาหารจานหลัก', 'ของหวาน', 'ผลไม้']
  await Promise.all(
    categoryNames.map(name =>
      prisma.category.upsert({
        where: { name },     // Category.name เป็น @unique
        update: {},
        create: { name },
      })
    )
  )

  // 2) ดึง id ของหมวดมาใช้
  const cats = await prisma.category.findMany({
    where: { name: { in: categoryNames } },
    select: { c_id: true, name: true },
  })
  const catIdByName = Object.fromEntries(cats.map(c => [c.name, c.c_id]))

  // 3) เตรียมสินค้าที่จะ seed (อ้างอิง categoryId จากชื่อหมวด)
  const productsData = [
    { name: "ข้าวผัดกุ้ง",        description: "ข้าวผัดรสชาติเข้มข้น พร้อมกุ้งสด", price: 50, categoryId: catIdByName['อาหารจานหลัก'] },
    { name: "ฝรั่งแช่อิ่ม",        description: "ฝรั่งแช่อิ่มรสหวานกรอบ",          price: 60, categoryId: catIdByName['ผลไม้'] },
    { name: "ไอศกรีมวนิลา",      description: "ไอศกรีมรสวนิลาเนียนนุ่ม",            price: 40, categoryId: catIdByName['ของหวาน'] },
    { name: "ส้มตำปูปลาร้า",      description: "ส้มตำรสแซ่บ ปูปลาร้าสด",            price: 35, categoryId: catIdByName['อาหารจานหลัก'] },
    { name: "ส้มตำไทย",          description: "ส้มตำรสจัดจ้าน เผ็ดแซ่บ",             price: 30, categoryId: catIdByName['อาหารจานหลัก'] },
    { name: "เค้กช็อกโกแลต",      description: "เค้กนุ่ม รสช็อกโกแลตเข้มข้น",        price: 80, categoryId: catIdByName['ของหวาน'] },
    { name: "ส้มโอหวาน",          description: "ส้มโอสด รสชาติหวานฉ่ำ",               price: 30, categoryId: catIdByName['ผลไม้'] },
    { name: "สปาเก็ตตี้คาโบนาร่า", description: "สปาเก็ตตี้ครีมซอสคาโบนาร่า",       price: 70, categoryId: catIdByName['อาหารจานหลัก'] },
    { name: "สตรอว์เบอร์รี่สด",   description: "สตรอว์เบอร์รี่หวานฉ่ำ สดใหม่",       price: 80, categoryId: catIdByName['ผลไม้'] },
  ]

  // 4) กันซ้ำ: ลบสินค้าที่ชื่อชนกันก่อน (ถ้า seed ซ้ำจะไม่สะสม)
  await prisma.product.deleteMany({
    where: { name: { in: productsData.map(p => p.name) } },
  })

  // 5) ใส่สินค้า
  await prisma.product.createMany({ data: productsData })

  console.log('✅ Seeded products successfully.')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding products:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
