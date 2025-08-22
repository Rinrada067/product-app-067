// app/api/products/route.ts
import { prisma } from '@/libs/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true }, // ดึงข้อมูลหมวดหมู่ด้วย
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, price, categoryId } = body

    // ตรวจสอบข้อมูล
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบ' },
        { status: 400 }
      )
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId, // เชื่อมกับ category
      },
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
