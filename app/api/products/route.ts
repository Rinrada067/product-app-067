import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()

  if (
    !body.name ||
    !body.description ||
    typeof body.price !== 'number' ||
    typeof body.categoryId !== 'number'
  ) {
    return NextResponse.json({ error: 'ข้อมูลไม่ครบหรือผิดประเภท' }, { status: 400 })
  }

  // แก้ไขตรงนี้ ใช้ id แทน c_id
  const categoryExists = await prisma.category.findUnique({
  where: { c_id: body.categoryId },
})

  if (!categoryExists) {
    return NextResponse.json({ error: 'ไม่พบหมวดหมู่ที่เลือก' }, { status: 400 })
  }

  const newProduct = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      categoryId: body.categoryId,
    },
  })

  return NextResponse.json(newProduct)
}
